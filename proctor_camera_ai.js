/* ============================================================================
   PROCTOR CAMERA AI & MIC VAD - PHÒNG THI THCS (CHUẨN GDPT 2018)
   HỆ THỐNG GIÁM SÁT CHỐNG GIAN LẬN SIÊU NHẠY & LỌC TIẾNG MƯA / ỒN THÔNG MINH
   ============================================================================
   Changelog v3.0:
   1. Bộ lọc âm thanh VAD (Voice Activity Detection):
      - Dải thông BiquadFilter 300Hz - 3400Hz (loại bỏ tiếng mưa, quạt gió, ve kêu).
      - Thuật toán Spectral Flatness + Formant Energy: chỉ bắt tiếng nói người / thì thầm.
   2. Giám sát tư thế mặt 4 góc (Quadrants & Head Pose):
      - Ngồi thẳng, cân giữa màn hình (Vùng an toàn 50% trung tâm).
      - Nghiêng mặt 2/4, 3/4 hoặc cúi gục: Cảnh báo giọng nói nhắc ngồi cân giữa.
   3. Thoát khỏi màn hình 4/4 (Vắng mặt hoàn toàn):
      - Còi hú cảnh báo khẩn cấp + Giọng nói nghiêm túc, âm lượng lớn.
      - Đếm ngược 10 giây (10s Absence Countdown).
      - Quá 10s: Tự động ghi nhận 1 lần vi phạm + Chụp ảnh bằng chứng + Khóa bài.
   4. Chống thoát màn hình (Anti-Tab Switch & Fullscreen Lock).
   ============================================================================ */

(function () {
    'use strict';

    class ProctorCameraAI {

        constructor(options = {}) {
            this.video = options.video || document.querySelector('#exam-pip-video');
            this.hud = options.hud || document.querySelector('#exam-proctor-hud') || document.querySelector('#exam-pip-hud');
            this.status = options.status || document.querySelector('#exam-camera-status');
            this.onViolation = typeof options.onViolation === 'function' ? options.onViolation : function () {};
            this.studentName = options.studentName || 'Thí sinh';
            this.enableMic = options.enableMic !== false;
            this.enableFullscreenGuard = options.enableFullscreen !== false;

            this.running = false;
            this.stream = options.stream || null;
            this.audioStream = null;

            this.analysisTimer = null;
            this.animationFrame = null;
            this.analyzing = false;

            // Quy định thời gian vắng mặt: Đúng 10 giây theo yêu cầu
            this.absentSeconds = 10;
            this.absentStartTime = null;
            this.absentCount = 0;
            this.coveredCount = 0;

            this.lastViolationTime = 0;
            this.violationCooldown = 3000;
            this.totalViolationCount = 0;
            this.violationLevel = 0;

            this.examBlurred = false;
            this.examLocked = false;
            this._examAreaEl = null;
            this._lockScreenEl = null;
            this._countdownOverlay = null;

            // Head pose & Look-aside (Ngay lập tức phản hồi khi nghiêng mặt)
            this.lookAsideStreak = 0;
            this.lookAsideThreshold = 1; // Phát hiện và nhắc ngay lập tức trong nhịp đầu tiên (~140ms)
            this.lastLookAsideTime = 0;
            this._lastSpeakTime = 0;
            this._lastSirenTime = 0;
            this.lastStatus = '';

            // Canvas phân tích 160x120
            this.analysisCanvas = document.createElement('canvas');
            this.analysisCanvas.width = 160;
            this.analysisCanvas.height = 120;
            this.analysisCtx = this.analysisCanvas.getContext('2d', { willReadFrequently: true });

            this.isRegistered = false;
            this.registrationProgress = 0;
            this.initialSnapshot = null;
            this.flashAlpha = 0;

            this.track = {
                hasFace: false,
                multiPerson: false,
                cameraCovered: false,
                lookingAside: false,
                lookingDown: false,
                quadrant: 'center', // 'center' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right'
                confidence: 0,
                isRegistered: false,
                registeredX: 80, registeredY: 60,
                registeredW: 46, registeredH: 58,
                x: 80, y: 60, w: 46, h: 58,
                smoothX: 80, smoothY: 60, smoothW: 46, smoothH: 58
            };

            this.faceDetector = null;

            // Audio Context & Voice Activity Detection (VAD)
            this.audioCtx = null;
            this.analyser = null;
            this.audioFilter = null;
            this.audioData = null;
            this.voiceStreak = 0;
            this.speechRecognition = null;

            this._prepareVideo();
            this._prepareHUD();
            this._initFullscreenGuard();
        }

        _prepareVideo() {
            if (!this.video) { console.warn('[PROCTOR] Chưa tìm thấy video camera.'); return; }
            this.video.autoplay = true;
            this.video.muted = true;
            this.video.playsInline = true;
            this.video.setAttribute('autoplay', '');
            this.video.setAttribute('muted', '');
            this.video.setAttribute('playsinline', '');
        }

        _prepareHUD() {
            if (!this.video) return;
            const parent = this.video.parentElement;
            if (parent && getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }
            if (!this.hud && parent) {
                this.hud = document.createElement('canvas');
                this.hud.id = 'exam-proctor-hud';
                this.hud.width = 140;
                this.hud.height = 105;
                this.hud.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:20;pointer-events:none;';
                parent.appendChild(this.hud);
            }
            if (!this.status && parent) {
                this.status = document.createElement('div');
                this.status.id = 'exam-camera-status';
                this.status.style.cssText = 'position:absolute;left:6px;right:6px;bottom:6px;z-index:30;padding:6px 8px;border-radius:8px;background:rgba(15,23,42,.92);color:#6ee7b7;font:bold 11px Arial,sans-serif;text-align:center;pointer-events:none;box-sizing:border-box;backdrop-filter:blur(4px);';
                parent.appendChild(this.status);
            }
        }

        _initFullscreenGuard() {
            if (!this.enableFullscreenGuard) return;
            
            // Tab Switch & Visibility Change Guard
            this._visibilityHandler = () => {
                if (document.hidden && this.running && this.isRegistered && !this.examLocked) {
                    this._speakWithName('Cảnh báo: Bạn đang rời khỏi màn hình thi! Hãy quay lại bài thi ngay!');
                    this._reportViolation('tab_switch', 'Học sinh chuyển sang tab khác hoặc ẩn trình duyệt thi!');
                    this._blurExamContent(12);
                }
            };
            document.addEventListener('visibilitychange', this._visibilityHandler);

            // Window Blur Guard (Alt+Tab)
            this._blurHandler = () => {
                if (this.running && this.isRegistered && !this.examLocked) {
                    this._reportViolation('window_blur', 'Học sinh nhấn Alt+Tab hoặc mất tiêu điểm màn hình thi!');
                }
            };
            window.addEventListener('blur', this._blurHandler);
        }

        async start(existingStream = null) {
            if (this.running) { console.log('[PROCTOR] Camera đã đang chạy.'); return true; }
            if (existingStream) this.stream = existingStream;
            if (!this.video) { this.video = document.querySelector('#exam-pip-video'); this._prepareVideo(); }
            if (!this.hud) { this.hud = document.querySelector('#exam-proctor-hud') || document.querySelector('#exam-pip-hud'); this._prepareHUD(); }
            if (!this.status) { this.status = document.querySelector('#exam-camera-status'); this._prepareHUD(); }
            if (!this.video) { this._setStatus('error', 'Không tìm thấy phần tử video camera.'); return false; }

            try {
                this._setStatus('info', 'Đang khởi động Camera AI & Mic VAD...');
                if (!this.stream) {
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        this._setStatus('error', 'Trình duyệt không hỗ trợ camera hoặc trang chưa chạy HTTPS.');
                        return false;
                    }
                    const constraints = {
                        video: {
                            facingMode: { ideal: 'user' },
                            width: { ideal: 640 },
                            height: { ideal: 480 },
                            frameRate: { ideal: 30, max: 30 }
                        },
                        audio: this.enableMic ? {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        } : false
                    };
                    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
                }

                this.video.srcObject = this.stream;
                await this.video.play().catch(() => {});
                await this._waitVideo();

                this._initFaceDetector();
                this._initAudioVAD();

                this.running = true;
                this.absentStartTime = null;
                this.absentCount = 0;
                this.coveredCount = 0;
                this.lastViolationTime = 0;
                this.totalViolationCount = 0;
                this.violationLevel = 0;
                this.lookAsideStreak = 0;

                window.__proctorViolationLog = window.__proctorViolationLog || [];
                this._setStatus('ok', 'CAMERA & MIC AI ĐANG GIÁM SÁT');
                this._startAnalysis();
                this._startRender();
                console.log('[PROCTOR] CAMERA & MIC VAD 3.0 STARTED SUCCESSFULLY');
                return true;
            } catch (error) {
                console.error('[PROCTOR] Camera start error:', error);
                let message = 'Không thể khởi động camera/mic.';
                if (error && error.name === 'NotAllowedError') message = 'Bạn chưa cấp quyền truy cập Camera và Microphone.';
                else if (error && error.name === 'NotFoundError') message = 'Không tìm thấy thiết bị Camera/Microphone.';
                else if (error && error.name === 'NotReadableError') message = 'Camera đang bị ứng dụng khác chiếm dụng.';
                this._setStatus('error', message);
                return false;
            }
        }

        async _waitVideo() {
            const timeout = Date.now() + 10000;
            while (Date.now() < timeout) {
                if (this.video.readyState >= 2 && this.video.videoWidth > 0 && this.video.videoHeight > 0) return true;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            throw new Error('Camera không cung cấp được hình ảnh.');
        }

        _initFaceDetector() {
            this.faceDetector = null;
            try {
                if ('FaceDetector' in window) {
                    this.faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
                    console.log('[PROCTOR] Native FaceDetector: BẬT');
                }
            } catch (error) {
                this.faceDetector = null;
            }
        }

        // =========================================================================
        // 🎙️ BỘ LỌC ÂM THANH THÔNG MINH - CHỐNG MƯA & BẮT GIỌNG NÓI (VAD ENGINE)
        // =========================================================================
        _initAudioVAD() {
            if (!this.enableMic || !this.stream) return;
            const audioTracks = this.stream.getAudioTracks();
            if (!audioTracks || audioTracks.length === 0) return;

            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) return;

                this.audioCtx = new AudioContextClass();
                if (this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }

                const source = this.audioCtx.createMediaStreamSource(this.stream);

                // 1. Bộ lọc dải thông Biquad Filter (300Hz - 3400Hz) - Giữ dải tần số giọng nói, triệt tiêu tiếng mưa dải rộng
                const bandpass = this.audioCtx.createBiquadFilter();
                bandpass.type = 'bandpass';
                bandpass.frequency.value = 1500; // Tâm tần số giọng nói
                bandpass.Q.value = 0.85;

                // 2. Bộ lọc cắt tần số siêu trầm (Low-cut / High-pass 200Hz) - loại bỏ tiếng gió / sấm sét / rung bàn
                const highpass = this.audioCtx.createBiquadFilter();
                highpass.type = 'highpass';
                highpass.frequency.value = 220;

                // 3. Analyser Node phân tích phổ
                this.analyser = this.audioCtx.createAnalyser();
                this.analyser.fftSize = 512;
                this.analyser.smoothingTimeConstant = 0.65;

                source.connect(highpass);
                highpass.connect(bandpass);
                bandpass.connect(this.analyser);

                this.audioData = new Uint8Array(this.analyser.frequencyBinCount);
                console.log('[PROCTOR] Audio VAD Noise Filtering Engine: BẬT');
            } catch (e) {
                console.warn('[PROCTOR] Không thể khởi tạo Audio VAD:', e);
            }
        }

        // Phân tích âm thanh theo thời gian thực (Lọc tiếng mưa / quạt gió vs Giọng nói người)
        _analyzeAudioFrame() {
            if (!this.analyser || !this.audioData) return false;
            this.analyser.getByteFrequencyData(this.audioData);

            let totalEnergy = 0;
            let voiceBandEnergy = 0;
            let geometricMeanSum = 0;
            const binCount = this.audioData.length;
            const sampleRate = this.audioCtx ? this.audioCtx.sampleRate : 44100;
            const binHz = (sampleRate / 2) / binCount;

            // Dải tần số giọng nói con người (Formants F1 - F3: 300Hz -> 3400Hz)
            const minVoiceBin = Math.floor(300 / binHz);
            const maxVoiceBin = Math.min(binCount - 1, Math.floor(3400 / binHz));

            let nonZeroBins = 0;

            for (let i = 0; i < binCount; i++) {
                const val = this.audioData[i];
                totalEnergy += val;

                if (i >= minVoiceBin && i <= maxVoiceBin) {
                    voiceBandEnergy += val;
                }

                if (val > 0) {
                    geometricMeanSum += Math.log(val + 0.001);
                    nonZeroBins++;
                }
            }

            const meanEnergy = totalEnergy / binCount;
            if (meanEnergy < 18) {
                this.voiceStreak = Math.max(0, this.voiceStreak - 1);
                return false; // Yên tĩnh
            }

            // 1. Tỉ lệ năng lượng tập trung trong dải giọng nói
            const voiceEnergyRatio = voiceBandEnergy / Math.max(1, totalEnergy);

            // 2. Độ phẳng phổ (Spectral Flatness - Wiener Entropy):
            // Tiếng mưa to / Tiếng ồn trắng: Năng lượng dàn đều khắp các tần số -> Flatness CAO (> 0.60)
            // Tiếng nói người: Năng lượng tập trung tại các đỉnh sóng hài/formant -> Flatness THẤP (< 0.40)
            const geometricMean = Math.exp(geometricMeanSum / Math.max(1, nonZeroBins));
            const arithmeticMean = totalEnergy / Math.max(1, nonZeroBins);
            const spectralFlatness = geometricMean / Math.max(1, arithmeticMean);

            // Phân biệt chính xác:
            // Là GIỌNG NÓI THỰC SỰ khi: Năng lượng dải giọng nói > 65% VÀ Độ phẳng phổ < 0.45 (có đỉnh âm định âm)
            const isHumanSpeech = (voiceEnergyRatio >= 0.62) && (spectralFlatness <= 0.48) && (meanEnergy >= 25);

            if (isHumanSpeech) {
                this.voiceStreak++;
                if (this.voiceStreak >= 8) { // Liên tục phát âm ~1.2 giây
                    this.voiceStreak = 0;
                    return true;
                }
            } else {
                this.voiceStreak = Math.max(0, this.voiceStreak - 2);
            }

            return false;
        }

        _startAnalysis() {
            this._stopAnalysis();
            this.analysisTimer = setInterval(() => { this._runAnalysis(); }, 140);
        }

        async _runAnalysis() {
            if (!this.running || this.analyzing || !this.video || this.video.readyState < 2) return;
            this.analyzing = true;
            try {
                const result = await this._analyzeFrame();
                const hasVoiceViolation = this._analyzeAudioFrame();

                if (hasVoiceViolation && this.isRegistered && !this.examLocked) {
                    this._speakWithName('Nhắc nhở: Đề nghị giữ trật tự, không phát ra tiếng nói trong giờ thi!');
                    this._reportViolation('voice', 'Phát hiện có tiếng nói hoặc thì thầm trao đổi bài trong phòng thi!');
                }

                this._applyResult(result);
            } catch (error) {
                console.error('[PROCTOR] Lỗi phân tích camera:', error);
            } finally {
                this.analyzing = false;
            }
        }

        async _analyzeFrame() {
            const W = 160, H = 120;

            // 1. Native FaceDetector API (Nhanh và chính xác nhất nếu Chrome bật flag)
            if (this.faceDetector) {
                try {
                    const faces = await this.faceDetector.detect(this.video);
                    if (faces && faces.length > 0) {
                        const face = this._largestFace(faces);
                        const box = face.boundingBox || face;
                        const vW = this.video.videoWidth || 640;
                        const vH = this.video.videoHeight || 480;
                        if (box.width >= 20 && box.height >= 20) {
                            const cx = (box.x + box.width / 2) / vW * W;
                            const cy = (box.y + box.height / 2) / vH * H;
                            const fw = (box.width / vW) * W;
                            const fh = (box.height / vH) * H;
                            const regX = this.track.registeredX || (W / 2);
                            const shiftX = Math.abs(cx - regX);
                            const ratioWH = fw / Math.max(1, fh);

                            // Phân tích góc nghiêng 2/4 (45°) và 3/4 (60°-75°)
                            const lookingAside = (
                                (cx / W) < 0.28 || (cx / W) > 0.72 ||
                                (this.isRegistered && shiftX > 20) ||
                                (ratioWH < 0.54)
                            );
                            const lookingDown = (cy / H) > 0.85;
                            const quadrant = this._getQuadrant(cx, cy, W, H);

                            return {
                                hasFace: true,
                                multiPerson: faces.length > 1,
                                cameraCovered: false,
                                lookingAside,
                                lookingDown,
                                quadrant,
                                confidence: 99,
                                x: cx, y: cy, w: fw, h: fh
                            };
                        }
                    }
                    return { hasFace: false, multiPerson: false, cameraCovered: false, lookingAside: false, lookingDown: false, confidence: 0, x: 80, y: 60, w: 0, h: 0 };
                } catch (error) {
                    this.faceDetector = null;
                }
            }

            // 2. Fallback Sinh trắc học Ngu Quan & Skin Centroid (Chạy ổn định 100% mọi thiết bị)
            return this._biometricDetect();
        }

        // Xác định vị trí khuôn mặt nằm ở góc phần tư nào (Vùng trung tâm rộng rãi 60%)
        _getQuadrant(cx, cy, W, H) {
            const isLeft = cx < W * 0.20;
            const isRight = cx > W * 0.80;
            const isTop = cy < H * 0.15;
            const isBottom = cy > H * 0.88;

            if (!isLeft && !isRight && !isTop && !isBottom) return 'center';
            if (isLeft && isTop) return 'top_left';
            if (isRight && isTop) return 'top_right';
            if (isLeft && isBottom) return 'bottom_left';
            if (isRight && isBottom) return 'bottom_right';
            return isLeft ? 'left' : isRight ? 'right' : isBottom ? 'bottom' : 'center';
        }

        _largestFace(faces) {
            let best = faces[0], bestArea = 0;
            for (const f of faces) {
                const box = f.boundingBox || f;
                const area = (box.width || 0) * (box.height || 0);
                if (area > bestArea) { bestArea = area; best = f; }
            }
            return best;
        }

        _enhanceGrayscale(data, W, H) {
            const gray = new Uint8ClampedArray(W * H);
            let minVal = 255, maxVal = 0;
            for (let i = 0, j = 0; i < data.length; i += 4, j++) {
                const Y = (data[i] * 77 + data[i+1] * 150 + data[i+2] * 29) >> 8;
                gray[j] = Y;
                if (Y < minVal) minVal = Y;
                if (Y > maxVal) maxVal = Y;
            }
            const range = maxVal - minVal;
            if (range > 15 && range < 230) {
                const scale = 255 / range;
                for (let j = 0; j < gray.length; j++) {
                    gray[j] = Math.min(255, Math.max(0, ((gray[j] - minVal) * scale) | 0));
                }
            }
            return gray;
        }

        _biometricDetect() {
            const W = 160, H = 120;
            try {
                const ctx = this.analysisCtx;
                ctx.drawImage(this.video, 0, 0, W, H);
                const sample = ctx.getImageData(0, 0, W, H);
                const data = sample.data;
                const gray = this._enhanceGrayscale(data, W, H);

                // 1. Kiểm tra camera bị che khuất
                let totalLuma = 0, darkCount = 0;
                for (let i = 0; i < gray.length; i++) {
                    totalLuma += gray[i];
                    if (gray[i] < 6) darkCount++;
                }
                if ((totalLuma / (W * H)) < 5 || (darkCount / (W * H)) > 0.97) {
                    return { hasFace: false, multiPerson: false, cameraCovered: true, lookingAside: false, lookingDown: false, confidence: 0, x: 80, y: 60, w: 0, h: 0 };
                }

                // 2. Bản đồ điểm ảnh màu da người (Skin Map)
                let skinCount = 0, sumSkinX = 0, sumSkinY = 0;
                let minSkinX = W, maxSkinX = 0, minSkinY = H, maxSkinY = 0;
                const skinMap = new Uint8Array(W * H);

                for (let y = 0; y < H; y++) {
                    for (let x = 0; x < W; x++) {
                        const i = (y * W + x) * 4;
                        const r = data[i], g = data[i+1], b = data[i+2];
                        const Y = gray[y * W + x];
                        if (Y > 235 || Y < 8) continue;

                        const Cb = -0.169 * r - 0.331 * g + 0.500 * b + 128;
                        const Cr =  0.500 * r - 0.419 * g - 0.081 * b + 128;

                        const isSkin = (r > 60 && g > 40 && b > 38 && (r > g) && (g > b) &&
                                       Cb >= 85 && Cb <= 138 && Cr >= 135 && Cr <= 182 &&
                                       (r - b) <= 125);

                        if (isSkin) {
                            skinMap[y * W + x] = 1;
                            skinCount++;
                            sumSkinX += x;
                            sumSkinY += y;
                            if (x < minSkinX) minSkinX = x;
                            if (x > maxSkinX) maxSkinX = x;
                            if (y < minSkinY) minSkinY = y;
                            if (y > maxSkinY) maxSkinY = y;
                        }
                    }
                }

                const faceBoxW = Math.max(0, maxSkinX - minSkinX);
                const faceBoxH = Math.max(0, maxSkinY - minSkinY);

                // THOÁT HẲN 4/4 KHUNG HÌNH (VẮNG MẶT HOÀN TOÀN KHỎI CAMERA)
                // Khuôn mặt người thật (>2000 pixels): skinCount phải >= 220 VÀ kích thước khối >= 24x28
                if (skinCount < 220 || faceBoxW < 24 || faceBoxH < 28) {
                    return {
                        hasFace: false,
                        multiPerson: false,
                        cameraCovered: false,
                        lookingAside: false,
                        lookingDown: false,
                        quadrant: 'out',
                        confidence: 0,
                        x: this.track.registeredX || 80,
                        y: this.track.registeredY || 60,
                        w: 0, h: 0
                    };
                }

                const skinCenterCX = sumSkinX / skinCount;
                const skinCenterCY = sumSkinY / skinCount;

                // 3. Phân tích đối xứng 2 bên má để nhận diện góc nghiêng mặt 2/4 (45°) và 3/4 (60°-75°)
                let leftSkin = 0, rightSkin = 0;
                for (let y = 0; y < H; y++) {
                    for (let x = 0; x < W; x++) {
                        if (skinMap[y * W + x]) {
                            if (x < skinCenterCX - 4) leftSkin++;
                            else if (x > skinCenterCX + 4) rightSkin++;
                        }
                    }
                }
                const symmetryRatio = (leftSkin > 0 && rightSkin > 0) ? Math.min(leftSkin, rightSkin) / Math.max(leftSkin, rightSkin) : 1;

                const regX = this.track.registeredX || (W / 2);
                const regY = this.track.registeredY || (H / 2);
                const shiftX = Math.abs(skinCenterCX - regX);
                const shiftY = skinCenterCY - regY;

                // Nhận diện chuẩn xác:
                // - Trực diện (Cân giữa): symmetryRatio >= 0.40 VÀ nằm trong vùng giữa
                // - Nghiêng mặt 2/4 hoặc 3/4: symmetryRatio < 0.36 HOẶC lệch tâm > 22px HOẶC ra sát mép
                const lookingAside = (
                    (skinCenterCX / W) < 0.28 || (skinCenterCX / W) > 0.72 ||
                    (this.isRegistered && shiftX > 22) ||
                    (symmetryRatio < 0.36)
                );
                const lookingDown = (skinCenterCY / H > 0.85) || (this.isRegistered && shiftY > 24);
                const quadrant = this._getQuadrant(skinCenterCX, skinCenterCY, W, H);

                return {
                    hasFace: true,
                    multiPerson: false,
                    cameraCovered: false,
                    lookingAside,
                    lookingDown,
                    quadrant,
                    confidence: 94,
                    x: skinCenterCX,
                    y: skinCenterCY,
                    w: Math.max(38, Math.min(78, Math.sqrt(skinCount) * 1.6)),
                    h: Math.max(48, Math.min(90, Math.sqrt(skinCount) * 1.9))
                };
            } catch (err) {
                return { hasFace: false, multiPerson: false, cameraCovered: false, lookingAside: false, lookingDown: false, confidence: 0, x: 80, y: 60, w: 0, h: 0 };
            }
        }

        _applyResult(result) {
            if (!this.running) return;

            // =========================================================================
            // GIAI ĐOẠN 1: ĐĂNG KÝ / CHỤP KHUÔN MẶT ĐẦU GIỜ THI
            // =========================================================================
            if (!this.isRegistered) {
                if (result.hasFace && !result.lookingAside && !result.lookingDown) {
                    this.track.hasFace = true;
                    this.track.x = result.x;
                    this.track.y = result.y;
                    this.track.w = Math.max(30, result.w);
                    this.track.h = Math.max(38, result.h);
                    this.registrationProgress = (this.registrationProgress || 0) + 25;
                    this._setStatus('info', 'ĐANG QUÉT MẶT CHUẨN [' + Math.min(100, this.registrationProgress) + '%]...');

                    if (this.registrationProgress >= 100) {
                        this.isRegistered = true;
                        this.track.isRegistered = true;
                        this.track.registeredX = result.x;
                        this.track.registeredY = result.y;
                        this.track.registeredW = result.w;
                        this.track.registeredH = result.h;
                        this.flashAlpha = 0.95;
                        this._playShutterSound();
                        this.initialSnapshot = this.captureSnapshot(this.studentName, 'Ảnh chân dung gốc thí sinh (Đầu giờ thi)');
                        this._setStatus('ok', 'ĐÃ KHÓA TIÊU CỰ - ĐANG GIÁM SÁT');
                        this._speakWithName('Đã xác nhận khuôn mặt thành công. Chúc em làm bài thật tốt!');
                    }
                    return;
                } else {
                    this.registrationProgress = Math.max(0, (this.registrationProgress || 0) - 5);
                    this._setStatus('warning', 'VUI LÒNG NGỒI THẲNG, CÂN GIỮA CAMERA ĐỂ BẮT ĐẦU...');
                    return;
                }
            }

            // =========================================================================
            // GIAI ĐOẠN 2: GIÁM SÁT LIÊN TỤC TRONG SUỐT GIỜ THI
            // =========================================================================
            if (result.hasFace) {
                this.noFaceStreak = 0;
                this.track.hasFace = true;
                this.track.cameraCovered = false;
                this.track.multiPerson = !!result.multiPerson;
                this.track.confidence = result.confidence || 0;
                this.track.lookingAside = !!result.lookingAside;
                this.track.lookingDown = !!result.lookingDown;
                this.track.quadrant = result.quadrant || 'center';
                this.track.x = result.x;
                this.track.y = result.y;
                this.track.w = Math.max(28, result.w);
                this.track.h = Math.max(36, result.h);

                // Khôi phục nếu trước đó bị vắng mặt
                if (this.absentStartTime) {
                    this.absentStartTime = null;
                    this.absentCount = 0;
                    this._removeCountdownOverlay();
                    this._unblurExamContent();
                }

                // Trường hợp 1: Phát hiện người thứ 2
                if (result.multiPerson) {
                    this._setStatus('warning', '⚠️ PHÁT HIỆN CÓ NGƯỜI THỨ 2 TRONG KHUNG HÌNH!');
                    this._reportViolation('multiperson', 'Phát hiện có người thứ 2 xuất hiện trong camera phòng thi!');
                    return;
                }

                // Trường hợp 2: Nghiêng mặt hẳn sang bên hoặc cúi gục đầu (CHỈ NHẮC KHI THỰC SỰ LỆCH HẲN, KHÔNG TÍNH VI PHẠM)
                if (result.lookingAside || result.lookingDown) {
                    this.lookAsideStreak = (this.lookAsideStreak || 0) + 1;
                    this._setStatus('warning', '⚠️ VUI LÒNG NGỒI THẲNG, CÂN GIỮA MÀN HÌNH!');

                    if (this.lookAsideStreak >= this.lookAsideThreshold) {
                        const now = Date.now();
                        // Chỉ phát giọng nói 1 lần khi bắt đầu lệch, sau đó nếu vẫn tiếp tục quay đi thì nhắc lại sau mỗi 8 giây
                        if (this.lookAsideStreak === this.lookAsideThreshold || (now - (this.lastLookAsideTime || 0) > 8000)) {
                            this.lastLookAsideTime = now;
                            this._speakWithName('Đề nghị bạn ngồi thẳng và nhìn thẳng vào giữa màn hình!', true);
                        }
                    }
                    return;
                } else {
                    this.lookAsideStreak = 0;
                }

                this._setStatus('ok', '🟢 ĐANG LÀM BÀI - TƯ THẾ HỢP LỆ');
                return;
            }

            // =========================================================================
            // TRƯỜNG HỢP 3: THOÁT HẲN 4/4 MÀN HÌNH (VẮNG MẶT HOÀN TOÀN)
            // =========================================================================
            this.noFaceStreak = (this.noFaceStreak || 0) + 1;

            this.track.hasFace = false;
            this.track.lookingAside = false;
            this.track.lookingDown = false;
            this.lookAsideStreak = 0;

            if (!this.absentStartTime) {
                this.absentStartTime = Date.now();
                this._playAlarmSiren(); // Hú còi cảnh báo to ngay lập tức
                this._speakWithName('Cảnh báo khẩn cấp! Bạn đang rời khỏi màn hình giám sát! Đề nghị quay lại vị trí làm bài ngay lập tức!', true); // Phát ngay tức thì
            }

            const elapsedSec = Math.floor((Date.now() - this.absentStartTime) / 1000);
            this.absentCount = Math.min(elapsedSec, this.absentSeconds);
            const remainingSec = Math.max(0, this.absentSeconds - elapsedSec);

            this._showCountdownOverlay(remainingSec);
            this._setStatus('error', `🚨 VẮNG MẶT: CÒN ${remainingSec}s TRƯỚC KHI TÍNH VI PHẠM!`);

            // Đếm ngược cảnh báo âm thanh
            if (remainingSec === 5 || remainingSec === 3 || remainingSec === 1) {
                if (this._lastCountdownSpoken !== remainingSec) {
                    this._lastCountdownSpoken = remainingSec;
                    this._speakWithName(`Còn ${remainingSec} giây! Hãy quay lại camera ngay!`);
                }
            }

            // QUÁ 10 GIÂY -> TÍNH 1 LẦN VI PHẠM & KHÓA BÀI
            if (elapsedSec >= this.absentSeconds) {
                this.absentStartTime = null;
                this.absentCount = 0;
                this._lastCountdownSpoken = null;
                this._removeCountdownOverlay();
                this._lockExam();
                this._reportViolation('absent_10s', `VI PHẠM QUY CHẾ THI: Vắng mặt khỏi camera quá 10 giây! (Lần vi phạm thứ ${this.totalViolationCount + 1})`);
            }
        }

        _playAlarmSiren() {
            try {
                const now = Date.now();
                if (now - (this._lastSirenTime || 0) < 3500) return;
                this._lastSirenTime = now;

                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                const audioCtx = this.audioCtx || (AudioCtx ? new AudioCtx() : null);
                if (!audioCtx) return;
                if (audioCtx.state === 'suspended') audioCtx.resume();

                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(750, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(1450, audioCtx.currentTime + 0.25);
                osc.frequency.linearRampToValueAtTime(750, audioCtx.currentTime + 0.50);
                osc.frequency.linearRampToValueAtTime(1450, audioCtx.currentTime + 0.75);

                gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.1);

                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 1.1);
            } catch (e) {}
        }

        _showCountdownOverlay(remainingSec) {
            let overlay = document.getElementById('__proctor_countdown_overlay__');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = '__proctor_countdown_overlay__';
                overlay.style.cssText = 'position:fixed;inset:0;background:rgba(185,28,28,0.35);backdrop-filter:blur(6px);z-index:9998;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:Arial,sans-serif;pointer-events:none;animation:fadeIn 0.2s ease;';
                document.body.appendChild(overlay);
            }

            overlay.innerHTML = `
                <div style="background:rgba(15,23,42,0.96); border:4px solid #ef4444; border-radius:24px; padding:2rem 3rem; text-align:center; box-shadow:0 25px 60px rgba(0,0,0,0.6); max-width:550px;">
                    <div style="font-size:3.5rem; animation:pulse 0.6s infinite alternate;">🚨</div>
                    <h2 style="color:#ef4444; font-size:1.8rem; margin:0.5rem 0; font-weight:900; text-transform:uppercase;">
                        CẢNH BÁO RỜI KHỎI MÀN HÌNH!
                    </h2>
                    <p style="color:#fca5a5; font-size:1.1rem; margin:0 0 1rem 0;">
                        Thí sinh <strong>${this.studentName}</strong> hãy quay lại trước camera ngay lập tức!
                    </p>
                    <div style="font-size:4.5rem; font-weight:900; color:#fbbf24; text-shadow:0 0 20px rgba(251,191,36,0.8); line-height:1;">
                        ${remainingSec}s
                    </div>
                    <div style="font-size:0.95rem; color:#cbd5e1; margin-top:0.8rem;">
                        Quá 10 giây sẽ tự động tính <strong>1 LẦN VI PHẠM QUY CHẾ THI</strong> và khóa bài thi!
                    </div>
                </div>
            `;
        }

        _removeCountdownOverlay() {
            const overlay = document.getElementById('__proctor_countdown_overlay__');
            if (overlay) overlay.remove();
        }

        _blurExamContent(blurLevel) {
            if (this.examBlurred) return;
            this.examBlurred = true;
            const selectors = ['.exam-questions-area','#exam-questions-container','.question-content','#exam-content','.exam-body','[data-exam-content]'];
            let examArea = null;
            for (const sel of selectors) { examArea = document.querySelector(sel); if (examArea) break; }
            if (examArea) {
                examArea.style.transition = 'filter 0.4s ease';
                examArea.style.filter = 'blur(' + (blurLevel || 10) + 'px)';
                examArea.style.pointerEvents = 'none';
                examArea.style.userSelect = 'none';
                this._examAreaEl = examArea;
            }
        }

        _unblurExamContent() {
            if (!this.examBlurred) return;
            this.examBlurred = false;
            if (this._examAreaEl) {
                this._examAreaEl.style.filter = '';
                this._examAreaEl.style.pointerEvents = '';
                this._examAreaEl.style.userSelect = '';
            }
        }

        _lockExam() {
            if (this.examLocked) return;
            this.examLocked = true;
            this._unblurExamContent();

            const lockScreen = document.createElement('div');
            lockScreen.id = '__proctor_lock_screen__';
            lockScreen.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.97);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:Arial,sans-serif;animation:fadeIn 0.3s ease;';

            let snapshotHtml = '';
            try {
                const snap = this.captureSnapshot(this.studentName, 'Vi phạm quy chế - Vắng mặt quá 10s');
                if (snap) snapshotHtml = `<img src="${snap}" style="width:240px;height:auto;border:3px solid #ef4444;border-radius:10px;margin:12px 0;" />`;
            } catch(e) {}

            lockScreen.innerHTML = `
                <div style="max-width:540px;width:90%;background:#1e293b;border:3px solid #ef4444;border-radius:24px;padding:32px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.6);">
                    <div style="font-size:52px;margin-bottom:10px;">🔒</div>
                    <h2 style="color:#ef4444;font-size:24px;margin:0 0 8px 0;font-weight:900;">BÀI THI TẠM THỜI BỊ KHÓA</h2>
                    <p style="color:#94a3b8;font-size:14px;margin:0 0 16px 0;">Thí sinh: <strong style="color:#e2e8f0;">${this.studentName}</strong></p>
                    
                    <div style="background:#0f172a;border-radius:12px;padding:14px;margin-bottom:16px;text-align:left;">
                        <div style="color:#ef4444;font-size:14px;font-weight:bold;margin-bottom:4px;">⚠️ LÝ DO TÍNH VI PHẠM:</div>
                        <div style="color:#fca5a5;font-size:13px;">Vắng mặt khỏi camera giám sát quá 10 giây liên tục.</div>
                        <div style="color:#fbbf24;font-size:13px;font-weight:bold;margin-top:6px;">Tổng số lần vi phạm: ${this.totalViolationCount} lần</div>
                    </div>

                    ${snapshotHtml}

                    <div style="color:#64748b;font-size:12px;margin-bottom:18px;">Ảnh bằng chứng vi phạm và thời gian đã được lưu vào biên bản thi.</div>

                    <button onclick="window.__proctorUnlock&&window.__proctorUnlock()" style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;box-shadow:0 4px 16px rgba(37,99,235,.4);">
                        Quay lại trước Camera để mở lại bài
                    </button>
                </div>
            `;
            document.body.appendChild(lockScreen);
            this._lockScreenEl = lockScreen;
            window.__proctorUnlock = () => { this._unlockExam(); };
        }

        _unlockExam() {
            if (!this.examLocked) return;
            if (this._lockScreenEl) { this._lockScreenEl.remove(); this._lockScreenEl = null; }
            this.examLocked = false;
            this.absentStartTime = null;
            this._setStatus('info', 'Vui lòng ngồi thẳng trước camera để tiếp tục làm bài...');
            this._speakWithName('Bài thi đã được mở lại. Bạn hãy ngồi thẳng, cân giữa màn hình và tập trung làm bài.');
            window.__proctorUnlock = null;
        }

        _reportViolation(type, reason) {
            // Không tính vi phạm đối với các nhắc nhở tư thế
            if (type === 'lookaside' || type === 'posture' || (reason && (reason.includes('nghiêng mặt') || reason.includes('lệch góc') || reason.includes('cúi nhìn')))) {
                return;
            }
            const now = Date.now();
            if (now - this.lastViolationTime < this.violationCooldown) return;
            this.lastViolationTime = now;
            this.totalViolationCount++;

            let snapshot = null;
            try { snapshot = this.captureSnapshot(this.studentName, reason); } catch (error) {}

            this._recordViolation(type, reason, snapshot);
            try {
                this.onViolation(reason, snapshot, {
                    type,
                    count: this.totalViolationCount,
                    studentName: this.studentName,
                    log: window.__proctorViolationLog || []
                });
            } catch (error) {}
        }

        _recordViolation(type, reason, snapshot) {
            const log = {
                id: Date.now(), type, reason, snapshot,
                time: new Date().toLocaleString('vi-VN'),
                count: this.totalViolationCount,
                studentName: this.studentName
            };
            if (!window.__proctorViolationLog) window.__proctorViolationLog = [];
            window.__proctorViolationLog.push(log);
            if (window.__proctorViolationLog.length > 50) window.__proctorViolationLog.shift();
        }

        captureSnapshot(studentName, reason) {
            if (!this.video || !this.video.videoWidth || !this.video.videoHeight) return null;
            const canvas = document.createElement('canvas');
            const width = 640;
            const height = Math.round(this.video.videoHeight / this.video.videoWidth * width);
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.video, 0, 0, width, height);

            const footer = 75;
            ctx.fillStyle = 'rgba(15,23,42,.94)';
            ctx.fillRect(0, height - footer, width, footer);
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 15px Arial';
            ctx.fillText('VI PHẠM: ' + String(reason || '').substring(0, 60), 14, height - 45);
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '12px Arial';
            ctx.fillText(`Thí sinh: ${String(studentName || 'Thí sinh')} | Thời gian: ${new Date().toLocaleString('vi-VN')}`, 14, height - 20);

            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 6;
            ctx.strokeRect(3, 3, width - 6, height - 6);
            return canvas.toDataURL('image/jpeg', 0.85);
        }

        // =========================================================================
        // 🎯 RENDER HUD 60 FPS (KHUNG NGẮM CÂN GIỮA / CHỈ BÁO GÓC LỆCH)
        // =========================================================================
        _startRender() {
            const draw = () => {
                if (!this.running) return;
                this._renderHUD();
                this.animationFrame = requestAnimationFrame(draw);
            };
            this.animationFrame = requestAnimationFrame(draw);
        }

        _renderHUD() {
            if (!this.hud) return;
            const ctx = this.hud.getContext('2d');
            const W = this.hud.width || 140;
            const H = this.hud.height || 105;
            ctx.clearRect(0, 0, W, H);

            const isAlert = Boolean(this.absentStartTime) || !this.track.hasFace;
            const isWarning = this.track.lookingAside || this.track.lookingDown;

            const timeMs = performance.now();
            const pulse = (Math.sin(timeMs / 180) + 1) / 2;

            // Xanh Neon (Hợp lệ) | Vàng Cam (Nghiêng hẳn sang bên) | Đỏ (Vắng mặt)
            const mainColor = isAlert ? '#ef4444' : isWarning ? '#f59e0b' : `rgba(16,185,129,${0.75 + pulse * 0.25})`;

            // 1. Khung 4 góc viewport
            ctx.strokeStyle = mainColor;
            ctx.lineWidth = isAlert ? 2.5 : 2;
            const bLen = 12;
            ctx.beginPath();
            ctx.moveTo(4, 4 + bLen); ctx.lineTo(4, 4); ctx.lineTo(4 + bLen, 4);
            ctx.moveTo(W - 4 - bLen, 4); ctx.lineTo(W - 4, 4); ctx.lineTo(W - 4, 4 + bLen);
            ctx.moveTo(4, H - 4 - bLen); ctx.lineTo(4, H - 4); ctx.lineTo(4 + bLen, H - 4);
            ctx.moveTo(W - 4 - bLen, H - 4); ctx.lineTo(W - 4, H - 4); ctx.lineTo(W - 4, H - 4 - bLen);
            ctx.stroke();

            // 2. Vùng an toàn cân giữa rộng rãi (Center Safe Box Dotted)
            ctx.save();
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.strokeRect(W * 0.16, H * 0.12, W * 0.68, H * 0.76);
            ctx.restore();

            // 3. Khung bám mặt
            if (this.track.hasFace) {
                const scaleX = W / 160;
                const scaleY = H / 120;
                const bx = (this.track.x - this.track.w / 2) * scaleX;
                const by = (this.track.y - this.track.h / 2) * scaleY;
                const bw = this.track.w * scaleX;
                const bh = this.track.h * scaleY;

                ctx.save();
                ctx.strokeStyle = mainColor;
                ctx.lineWidth = 2;
                ctx.shadowColor = mainColor;
                ctx.shadowBlur = 8;
                ctx.strokeRect(bx, by, bw, bh);

                // Khung ngắm tâm mặt
                ctx.beginPath();
                ctx.arc(this.track.x * scaleX, this.track.y * scaleY, 3, 0, Math.PI * 2);
                ctx.fillStyle = mainColor;
                ctx.fill();
                ctx.restore();
            }

            // 4. Badge số lần vi phạm
            if (this.totalViolationCount > 0) {
                ctx.fillStyle = this.totalViolationCount >= 3 ? '#ef4444' : '#f59e0b';
                ctx.fillRect(W - 46, 4, 42, 16);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 9px Arial';
                ctx.fillText(`VP: ${this.totalViolationCount}`, W - 42, 16);
            }
        }

        _playShutterSound() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                const audioCtx = new AudioCtx();
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.08);
            } catch (e) {}
        }

        _setStatus(type, message) {
            if (this.lastStatus === message) return;
            this.lastStatus = message;
            if (!this.status) this.status = document.querySelector('#exam-camera-status');
            if (!this.status) return;
            const map = {
                ok: { color: '#6ee7b7', background: 'rgba(6,78,59,.95)' },
                warning: { color: '#fde047', background: 'rgba(133,77,14,.95)' },
                error: { color: '#fca5a5', background: 'rgba(153,27,27,.96)' },
                info: { color: '#93c5fd', background: 'rgba(30,58,138,.95)' }
            };
            const style = map[type] || map.info;
            this.status.style.color = style.color;
            this.status.style.background = style.background;
            this.status.textContent = message;
        }

        _speakWithName(text, forceImmediate = false) {
            try {
                if (!window.speechSynthesis) return;
                const now = Date.now();
                if (!forceImmediate && (now - (this._lastSpeakTime || 0) < 3000)) return;
                this._lastSpeakTime = now;
                window.speechSynthesis.cancel();
                const spokenText = String(text || '').trim();
                if (!spokenText) return;
                const utterance = new SpeechSynthesisUtterance(spokenText);
                utterance.lang = 'vi-VN';
                utterance.rate = 1.05;
                utterance.volume = 1;
                utterance.pitch = 1;
                window.speechSynthesis.speak(utterance);
            } catch (error) {}
        }

        stop() {
            this.running = false;
            this._stopAnalysis();
            if (this.animationFrame) { cancelAnimationFrame(this.animationFrame); this.animationFrame = null; }
            if (this.stream) { this.stream.getTracks().forEach(t => { try { t.stop(); } catch (_) {} }); this.stream = null; }
            if (this.video) { try { this.video.pause(); this.video.srcObject = null; } catch (_) {} }
            if (this.audioCtx) { try { this.audioCtx.close(); } catch (_) {} this.audioCtx = null; }

            if (this._visibilityHandler) document.removeEventListener('visibilitychange', this._visibilityHandler);
            if (this._blurHandler) window.removeEventListener('blur', this._blurHandler);

            this._removeCountdownOverlay();
            this._unblurExamContent();
            if (this._lockScreenEl) { this._lockScreenEl.remove(); this._lockScreenEl = null; }
            this._setStatus('info', 'ĐÃ DỪNG GIÁM SÁT');
            console.log('[PROCTOR] CAMERA & MIC STOPPED');
        }

        _stopAnalysis() {
            if (this.analysisTimer) { clearInterval(this.analysisTimer); this.analysisTimer = null; }
        }

        getViolationLog() { return window.__proctorViolationLog || []; }
        getTotalViolations() { return this.totalViolationCount; }
    }

    window.ProctorCameraAI = ProctorCameraAI;

    window.startExamCameraAI = async function (options = {}) {
        try {
            const proctor = new ProctorCameraAI(options);
            const started = await proctor.start(options.stream);
            if (started) window.__examProctorAI = proctor;
            return proctor;
        } catch (error) { console.error('[PROCTOR] START ERROR:', error); return null; }
    };

    window.stopExamCameraAI = function () {
        if (window.__examProctorAI) { window.__examProctorAI.stop(); window.__examProctorAI = null; }
    };

    window.initExamCameraAI = async function (customOptions = {}) {
        const video = customOptions.video || document.querySelector('#exam-pip-video');
        if (!video) { console.error('[PROCTOR] Không tìm thấy #exam-pip-video'); return null; }
        const parent = video.parentElement;
        let hud = customOptions.hud || document.querySelector('#exam-proctor-hud') || document.querySelector('#exam-pip-hud');
        if (!hud && parent) {
            if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
            hud = document.createElement('canvas');
            hud.id = 'exam-proctor-hud';
            hud.width = 640;
            hud.height = 480;
            hud.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:20;pointer-events:none;';
            parent.appendChild(hud);
        }
        let status = customOptions.status || document.querySelector('#exam-camera-status');
        if (!status && parent) {
            status = document.createElement('div');
            status.id = 'exam-camera-status';
            status.style.cssText = 'position:absolute;left:6px;right:6px;bottom:6px;z-index:30;padding:6px 8px;border-radius:8px;background:rgba(15,23,42,.92);color:#6ee7b7;font:bold 11px Arial,sans-serif;text-align:center;pointer-events:none;box-sizing:border-box;backdrop-filter:blur(4px);';
            parent.appendChild(status);
        }
        const proctor = await window.startExamCameraAI({
            video, hud, status,
            stream: customOptions.stream || null,
            studentName: customOptions.studentName || (window.currentUser && window.currentUser.name) || 'Thí sinh',
            enableMic: customOptions.enableMic !== false,
            enableFullscreen: customOptions.enableFullscreen !== false,
            onViolation: customOptions.onViolation || function (reason, snapshot, meta) {
                console.warn('[PROCTOR VIOLATION]', reason, meta);
                if (typeof window.handleViolation === 'function') {
                    try { window.handleViolation(reason, snapshot, meta); return; } catch (error) {}
                }
                window.__lastProctorViolation = { reason, snapshot, meta, time: new Date().toISOString() };
            }
        });
        return proctor;
    };

    window._captureProctorSnapshot = function (videoEl, studentName, violationReason) {
        try {
            if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) return null;
            const canvas = document.createElement('canvas');
            const width = 640;
            const height = Math.round(videoEl.videoHeight / videoEl.videoWidth * width);
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoEl, 0, 0, width, height);
            const footer = 75;
            ctx.fillStyle = 'rgba(15,23,42,.94)';
            ctx.fillRect(0, height - footer, width, footer);
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 15px Arial';
            ctx.fillText('VI PHẠM: ' + String(violationReason || '').substring(0, 55), 15, height - 45);
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '12px Arial';
            ctx.fillText('Thí sinh: ' + String(studentName || 'Thí sinh').substring(0, 50) + ' | ' + new Date().toLocaleString('vi-VN'), 15, height - 20);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 5;
            ctx.strokeRect(3, 3, width - 6, height - 6);
            return canvas.toDataURL('image/jpeg', 0.85);
        } catch (error) { return null; }
    };

    console.log('[PROCTOR] ProctorCameraAI module loaded v3.0 - Giám sát Camera & Mic VAD chống mưa siêu nhạy.');

})();
