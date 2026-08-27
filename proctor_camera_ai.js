/* ============================================================================
   PROCTOR CAMERA AI - FULL MODULE
   GIÁM SÁT CAMERA PHÒNG THI (TH-THCS AMA TRANG LƠNG LMS)
   ============================================================================ */

(function () {
    'use strict';

    class ProctorCameraAI {

        constructor(options = {}) {

            this.video =
                options.video ||
                document.querySelector('#exam-pip-video');

            this.hud =
                options.hud ||
                document.querySelector('#exam-proctor-hud') ||
                document.querySelector('#exam-pip-hud');

            this.status =
                options.status ||
                document.querySelector('#exam-camera-status');

            this.onViolation =
                typeof options.onViolation === 'function'
                    ? options.onViolation
                    : function () {};

            this.studentName =
                options.studentName ||
                'Thí sinh';

            this.running = false;
            this.stream = options.stream || null;

            this.analysisTimer = null;
            this.animationFrame = null;

            this.analyzing = false;

            this.absentSeconds = 10;
            this.absentStartTime = null;
            this.absentCount = 0;

            this.coveredCount = 0;

            this.lastViolationTime = 0;
            this.violationCooldown = 8000;

            this.lastStatus = '';

            /*
             * Canvas phân tích hình ảnh.
             * Không phân tích trực tiếp canvas HUD.
             */
            this.analysisCanvas =
                document.createElement('canvas');

            this.analysisCanvas.width = 160;
            this.analysisCanvas.height = 120;

            this.analysisCtx =
                this.analysisCanvas.getContext(
                    '2d',
                    { willReadFrequently: true }
                );

            /*
             * Trạng thái tracking & ghi nhớ tiêu cự.
             */
            this.isRegistered = false;
            this.registrationProgress = 0;
            this.initialSnapshot = null;
            this.flashAlpha = 0;

            this.track = {

                hasFace: false,

                multiPerson: false,

                cameraCovered: false,

                confidence: 0,

                isRegistered: false,

                registeredX: 80,
                registeredY: 60,
                registeredW: 50,
                registeredH: 65,

                x: 80,
                y: 60,
                w: 50,
                h: 65,

                smoothX: 80,
                smoothY: 60,
                smoothW: 50,
                smoothH: 65
            };

            /*
             * FaceDetector nếu trình duyệt có hỗ trợ.
             */
            this.faceDetector = null;

            this._prepareVideo();
            this._prepareHUD();
        }


        /* ====================================================================
           CHUẨN BỊ VIDEO
           ==================================================================== */

        _prepareVideo() {

            if (!this.video) {
                console.warn(
                    '[PROCTOR] Chưa tìm thấy video camera (sẽ gắn khi khởi động).'
                );
                return;
            }

            this.video.autoplay = true;
            this.video.muted = true;
            this.video.playsInline = true;

            this.video.setAttribute('autoplay', '');
            this.video.setAttribute('muted', '');
            this.video.setAttribute('playsinline', '');
        }


        /* ====================================================================
           CHUẨN BỊ HUD
           ==================================================================== */

        _prepareHUD() {

            if (!this.video) return;

            const parent = this.video.parentElement;

            if (
                parent &&
                getComputedStyle(parent).position === 'static'
            ) {
                parent.style.position = 'relative';
            }

            if (!this.hud && parent) {

                this.hud = document.createElement('canvas');
                this.hud.id = 'exam-proctor-hud';
                this.hud.width = 140;
                this.hud.height = 105;
                this.hud.style.cssText = `
                    position:absolute;
                    inset:0;
                    width:100%;
                    height:100%;
                    z-index:20;
                    pointer-events:none;
                `;
                parent.appendChild(this.hud);
            }

            if (!this.status && parent) {

                this.status = document.createElement('div');
                this.status.id = 'exam-camera-status';
                this.status.style.cssText = `
                    position:absolute;
                    left:8px;
                    right:8px;
                    bottom:8px;
                    z-index:30;
                    padding:7px 10px;
                    border-radius:7px;
                    background:rgba(15,23,42,.90);
                    color:#6ee7b7;
                    font:bold 12px Arial,sans-serif;
                    text-align:center;
                    pointer-events:none;
                    box-sizing:border-box;
                `;
                parent.appendChild(this.status);
            }
        }


        /* ====================================================================
           KHỞI ĐỘNG CAMERA
           ==================================================================== */

        async start(existingStream = null) {

            if (this.running) {
                console.log('[PROCTOR] Camera đã đang chạy.');
                return true;
            }

            if (existingStream) {
                this.stream = existingStream;
            }

            if (!this.video) {
                this.video = document.querySelector('#exam-pip-video');
                this._prepareVideo();
            }

            if (!this.hud) {
                this.hud = document.querySelector('#exam-proctor-hud') || document.querySelector('#exam-pip-hud');
                this._prepareHUD();
            }

            if (!this.status) {
                this.status = document.querySelector('#exam-camera-status');
                this._prepareHUD();
            }

            if (!this.video) {
                this._setStatus('error', '❌ Không tìm thấy phần tử video camera.');
                return false;
            }

            try {

                this._setStatus('info', '📷 Đang khởi động camera...');

                if (!this.stream) {
                    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                        this._setStatus('error', '❌ Trình duyệt không hỗ trợ camera hoặc trang chưa chạy HTTPS.');
                        return false;
                    }

                    this.stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: { ideal: 'user' },
                            width: { ideal: 640 },
                            height: { ideal: 480 },
                            frameRate: { ideal: 30, max: 30 }
                        },
                        audio: false
                    });
                }

                this.video.srcObject = this.stream;
                await this.video.play().catch(() => {});
                await this._waitVideo();
                this._initFaceDetector();

                this.running = true;
                this.absentStartTime = null;
                this.absentCount = 0;
                this.coveredCount = 0;
                this.lastViolationTime = 0;

                this._setStatus('ok', '🟢 CAMERA ĐANG HOẠT ĐỘNG — ĐANG GIÁM SÁT');

                this._startAnalysis();
                this._startRender();

                console.log('[PROCTOR] CAMERA STARTED SUCCESSFULLY');
                return true;

            } catch (error) {

                console.error('[PROCTOR] Camera start error:', error);
                let message = '❌ Không thể khởi động camera.';

                if (error && error.name === 'NotAllowedError') {
                    message = '❌ Bạn chưa cấp quyền sử dụng camera cho trang thi.';
                } else if (error && error.name === 'NotFoundError') {
                    message = '❌ Không tìm thấy camera trên thiết bị.';
                } else if (error && error.name === 'NotReadableError') {
                    message = '❌ Camera đang được ứng dụng khác sử dụng.';
                } else if (error && error.name === 'SecurityError') {
                    message = '❌ Trình duyệt chặn quyền truy cập camera.';
                }

                this._setStatus('error', message);
                return false;
            }
        }


        /* ====================================================================
           CHỜ VIDEO SẴN SÀNG
           ==================================================================== */

        async _waitVideo() {
            const timeout = Date.now() + 10000;
            while (Date.now() < timeout) {
                if (
                    this.video.readyState >= 2 &&
                    this.video.videoWidth > 0 &&
                    this.video.videoHeight > 0
                ) {
                    return true;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            throw new Error('Camera không cung cấp được hình ảnh.');
        }


        /* ====================================================================
           FACE DETECTOR
           ==================================================================== */

        _initFaceDetector() {
            this.faceDetector = null;
            try {
                if ('FaceDetector' in window) {
                    this.faceDetector = new window.FaceDetector({
                        fastMode: true,
                        maxDetectedFaces: 5
                    });
                    console.log('[PROCTOR] Native FaceDetector: ON');
                } else {
                    console.log('[PROCTOR] Native FaceDetector: OFF - dùng fallback sinh trắc học');
                }
            } catch (error) {
                console.warn('[PROCTOR] Không khởi tạo được FaceDetector', error);
                this.faceDetector = null;
            }
        }


        /* ====================================================================
           BẮT ĐẦU VÒNG PHÂN TÍCH
           ==================================================================== */

        _startAnalysis() {
            this._stopAnalysis();
            this.analysisTimer = setInterval(() => {
                this._runAnalysis();
            }, 150);
        }


        async _runAnalysis() {
            if (!this.running || this.analyzing || !this.video || this.video.readyState < 2) return;
            this.analyzing = true;
            try {
                const result = await this._analyzeFrame();
                this._applyResult(result);
            } catch (error) {
                console.error('[PROCTOR] LỖI PHÂN TÍCH CAMERA:', error);
            } finally {
                this.analyzing = false;
            }
        }


        /* ====================================================================
           PHÂN TÍCH KHUNG HÌNH & XÁC THỰC SINH TRẮC HỌC KHUÔN MẶT
           ==================================================================== */

        async _analyzeFrame() {
            // TẦNG 1: Native FaceDetector (nếu trình duyệt có hỗ trợ và phát hiện được)
            if (this.faceDetector) {
                try {
                    const faces = await this.faceDetector.detect(this.video);
                    if (faces && faces.length > 0) {
                        const face = this._largestFace(faces);
                        const box = face.boundingBox || face;
                        const vW = this.video.videoWidth || 640;
                        const vH = this.video.videoHeight || 480;

                        if (box.width >= 20 && box.height >= 20) {
                            const cx = box.x + box.width / 2;
                            const cy = box.y + box.height / 2;

                            return {
                                hasFace: true,
                                multiPerson: faces.length > 1,
                                cameraCovered: false,
                                confidence: 99,
                                x: (cx / vW) * 160,
                                y: (cy / vH) * 120,
                                w: (box.width / vW) * 160,
                                h: (box.height / vH) * 120
                            };
                        }
                    }
                } catch (error) {
                    console.warn('[PROCTOR] FaceDetector fallback:', error);
                }
            }

            // TẦNG 2: Tracking.js Haar Cascade Viola-Jones
            if (window.tracking && window.tracking.ViolaJones && window.tracking.ViolaJones.classifiers && window.tracking.ViolaJones.classifiers.face) {
                try {
                    const W = 160, H = 120;
                    const ctx = this.analysisCtx;
                    ctx.drawImage(this.video, 0, 0, W, H);
                    const imgData = ctx.getImageData(0, 0, W, H);
                    const gray = window.tracking.Image.grayscale(imgData.data, W, H);
                    const corners = window.tracking.ViolaJones.detect(
                        gray, W, H,
                        1.25, 1.15, 1.7,
                        window.tracking.ViolaJones.classifiers.face
                    );

                    if (corners && corners.length > 0) {
                        let maxBox = corners[0];
                        let maxArea = maxBox.width * maxBox.height;
                        for (let i = 1; i < corners.length; i++) {
                            const a = corners[i].width * corners[i].height;
                            if (a > maxArea) { maxArea = a; maxBox = corners[i]; }
                        }

                        const cx = maxBox.x + maxBox.width / 2;
                        const cy = maxBox.y + maxBox.height / 2;

                        return {
                            hasFace: true,
                            multiPerson: corners.length > 1,
                            cameraCovered: false,
                            confidence: 96,
                            x: cx,
                            y: cy,
                            w: maxBox.width,
                            h: maxBox.height
                        };
                    }
                } catch (e) {
                    console.warn('[PROCTOR] Haar Cascade fallback:', e);
                }
            }

            // TẦNG 3: Sinh trắc học hình thái & mật độ khuôn mặt (Strict Biometric Vision)
            return this._strictBiometricAnalyze();
        }


        /* ====================================================================
           CHỌN KHUÔN MẶT LỚN NHẤT
           ==================================================================== */

        _largestFace(faces) {
            let selected = faces[0];
            let selectedArea = 0;
            for (const face of faces) {
                const box = face.boundingBox || face;
                const area = (box.width || 0) * (box.height || 0);
                if (area > selectedArea) {
                    selectedArea = area;
                    selected = face;
                }
            }
            return selected;
        }


        /* ====================================================================
           STRICT BIOMETRIC FACE ANALYSIS (CHỐNG NHẬN DIỆN NHẦM TỦ GỖ / TƯỜNG)
           ==================================================================== */

        _strictBiometricAnalyze() {
            const W = 160;
            const H = 120;
            try {
                const ctx = this.analysisCtx;
                ctx.drawImage(this.video, 0, 0, W, H);
                const image = ctx.getImageData(0, 0, W, H);
                const data = image.data;

                let totalLuma = 0;
                let dark = 0;
                let skinCount = 0;
                let sumX = 0, sumY = 0;
                let minX = W, maxX = 0, minY = H, maxY = 0;

                for (let y = 0; y < H; y++) {
                    for (let x = 0; x < W; x++) {
                        const i = (y * W + x) * 4;
                        const r = data[i], g = data[i + 1], b = data[i + 2];
                        const Y  =  0.299 * r + 0.587 * g + 0.114 * b;
                        const Cb = -0.169 * r - 0.331 * g + 0.500 * b + 128;
                        const Cr =  0.500 * r - 0.419 * g - 0.081 * b + 128;

                        totalLuma += Y;
                        if (Y < 8) dark++;

                        // Bộ lọc sắc tố da chuẩn sinh trắc học quốc tế YCbCr & RGB
                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        const isSkin = (
                            r > 38 && g > 20 && b > 14 &&
                            (max - min >= 8) &&
                            Math.abs(r - g) >= 2 &&
                            r > g && r > b &&
                            Cb >= 65 && Cb <= 145 &&
                            Cr >= 120 && Cr <= 185
                        );

                        if (isSkin) {
                            skinCount++;
                            sumX += x;
                            sumY += y;
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }

                const totalPixels = W * H;
                const meanLuma = totalLuma / totalPixels;
                const darkRatio = dark / totalPixels;

                // 1. Camera bị che hoặc phòng quá tối
                if (meanLuma < 6 || darkRatio > 0.98) {
                    return {
                        hasFace: false,
                        multiPerson: false,
                        cameraCovered: true,
                        confidence: 0,
                        x: 80, y: 60, w: 0, h: 0
                    };
                }

                // 2. Số lượng pixel da tối thiểu cho 1 khuôn mặt:
                // Một khuôn mặt ở cự ly webcam thông thường có ít nhất 40 pixel da.
                // Khi người rời khỏi máy -> skinCount giảm xuống gần 0 -> Báo vắng mặt!
                if (skinCount < 40 || skinCount > totalPixels * 0.70) {
                    return {
                        hasFace: false,
                        multiPerson: false,
                        cameraCovered: false,
                        confidence: 0,
                        x: 80, y: 60, w: 0, h: 0
                    };
                }

                const cx = sumX / skinCount;
                const cy = sumY / skinCount;
                const spanW = maxX - minX + 1;
                const spanH = maxY - minY + 1;

                // 3. Tỷ lệ khung hình khuôn mặt (Aspect Ratio)
                const aspect = spanW / spanH;
                if (aspect < 0.25 || aspect > 2.2) {
                    return {
                        hasFace: false,
                        multiPerson: false,
                        cameraCovered: false,
                        confidence: 0,
                        x: 80, y: 60, w: 0, h: 0
                    };
                }

                // 4. Kích thước bounding box hợp lệ
                const bw = Math.max(26, Math.min(100, spanW * 0.85));
                const bh = Math.max(32, Math.min(110, spanH * 0.90));

                return {
                    hasFace: true,
                    multiPerson: false,
                    cameraCovered: false,
                    confidence: 95,
                    x: cx,
                    y: cy,
                    w: bw,
                    h: bh
                };

            } catch (error) {
                console.error('[PROCTOR] Strict Biometric error:', error);
                return {
                    hasFace: false,
                    multiPerson: false,
                    cameraCovered: false,
                    confidence: 0,
                    x: 80,
                    y: 60,
                    w: 0,
                    h: 0
                };
            }
        }


        /* ====================================================================
           XỬ LÝ KẾT QUẢ
           ==================================================================== */

        _applyResult(result) {
            if (!this.running) return;

            // GIAI ĐOẠN 1: CHỤP & GHI NHỚ KHUÔN MẶT ĐẦU GIỜ THI
            if (!this.isRegistered) {
                if (result.hasFace) {
                    this.track.hasFace = true;
                    this.track.x = result.x;
                    this.track.y = result.y;
                    this.track.w = Math.max(25, result.w);
                    this.track.h = Math.max(30, result.h);

                    this.registrationProgress = (this.registrationProgress || 0) + 25;

                    this._setStatus('info', `📸 ĐANG QUÉT CHỤP KHUÔN MẶT [${Math.min(100, this.registrationProgress)}%]...`);

                    if (this.registrationProgress >= 100) {
                        this.isRegistered = true;
                        this.track.isRegistered = true;
                        this.track.registeredX = result.x;
                        this.track.registeredY = result.y;
                        this.track.registeredW = result.w;
                        this.track.registeredH = result.h;

                        // Hiệu ứng chớp sáng chụp ảnh & tiếng shutter máy ảnh
                        this.flashAlpha = 0.95;
                        this._playShutterSound();

                        // Chụp ảnh chân dung gốc lưu vào hồ sơ thi
                        this.initialSnapshot = this.captureSnapshot(this.studentName, 'Ảnh chân dung gốc thí sinh (Đầu giờ thi)');

                        this._setStatus('ok', '🟢 ĐÃ CHỤP & KHÓA TIÊU CỰ — ĐANG GIÁM SÁT');
                        this._speak('Đã chụp và nhận diện khuôn mặt thành công');
                    }
                    return;
                } else {
                    this.registrationProgress = Math.max(0, (this.registrationProgress || 0) - 5);
                    this._setStatus('warning', '⏳ VUI LÒNG NHÌN THẲNG CAMERA ĐỂ CHỤP KHUÔN MẶT...');
                    return;
                }
            }

            // GIAI ĐOẠN 2: GIÁM SÁT TIÊU CỰ KHUÔN MẶT LIÊN TỤC
            if (result.hasFace) {
                this.noFaceStreak = 0;
                this.track.hasFace = true;
                this.track.cameraCovered = false;
                this.track.multiPerson = !!result.multiPerson;
                this.track.confidence = result.confidence || 0;

                this.track.x = result.x;
                this.track.y = result.y;
                this.track.w = Math.max(25, result.w);
                this.track.h = Math.max(30, result.h);

                this.absentStartTime = null;
                this.absentCount = 0;
                this.coveredCount = 0;
                this._lastSpokenSec = 0;

                if (result.multiPerson) {
                    this._setStatus('warning', '⚠️ PHÁT HIỆN CÓ KHẢ NĂNG NGƯỜI THỨ 2!');
                    this._reportViolation('Phát hiện có người thứ hai trong khung hình camera phòng thi!');
                    return;
                }

                this._setStatus('ok', '🟢 ĐÃ KHÓA & GHI NHỚ TIÊU CỰ [GIÁM SÁT]');
                return;
            }

            // Bộ lọc Debounce: Chỉ chuyển sang vắng mặt khi mất dấu liên tục ít nhất 5 frames (~750ms)
            this.noFaceStreak = (this.noFaceStreak || 0) + 1;
            if (this.noFaceStreak < 5) {
                return;
            }

            if (result.cameraCovered) {
                this.track.hasFace = false;
                this.track.cameraCovered = true;
                this.track.multiPerson = false;
                this.coveredCount++;

                this._setStatus('warning', '🚫 CAMERA BỊ CHE HOẶC PHÒNG QUÁ TỐI!');
                if (this.coveredCount >= 4) {
                    this.coveredCount = 0;
                    this._reportViolation('Camera bị che hoặc phòng thi quá tối — không thể giám sát!');
                }
                return;
            }

            this.track.hasFace = false;
            this.track.cameraCovered = false;
            this.track.multiPerson = false;
            this.coveredCount = 0;

            if (!this.absentStartTime) {
                this.absentStartTime = Date.now();
                this._lastSpokenSec = 0;
            }

            const elapsedSec = Math.floor((Date.now() - this.absentStartTime) / 1000);
            this.absentCount = Math.min(elapsedSec, this.absentSeconds);

            this._setStatus('warning', `🔴 MẤT TIÊU CỰ KHUÔN MẶT [${this.absentCount}/${this.absentSeconds}s]`);

            // Chỉ phát giọng nói cảnh báo khi đã vắng mặt thực sự từ 3 giây trở lên
            if (this.absentCount >= 3 && this._lastSpokenSec !== this.absentCount && (this.absentCount === 3 || this.absentCount === 7)) {
                this._lastSpokenSec = this.absentCount;
                this._speak('Vui lòng không ra khỏi màn hình giám sát, vui lòng quay lại tiếp tục thi');
            }

            if (elapsedSec >= this.absentSeconds) {
                this.absentStartTime = null;
                this.absentCount = 0;
                this._lastSpokenSec = 0;
                this.noFaceStreak = 0;
                this._speak('Bạn đã vi phạm rời khỏi màn hình giám sát quá 10 giây!');
                this._reportViolation('Không phát hiện khuôn mặt thí sinh trước camera quá 10 giây!');
            }
        }


        /* ====================================================================
           BÁO VI PHẠM
           ==================================================================== */

        _reportViolation(reason) {
            const now = Date.now();
            if (now - this.lastViolationTime < this.violationCooldown) {
                return;
            }
            this.lastViolationTime = now;

            let snapshot = null;
            try {
                snapshot = this.captureSnapshot(this.studentName, reason);
            } catch (error) {
                console.error('[PROCTOR] Snapshot error:', error);
            }

            console.warn('[PROCTOR] VI PHẠM:', reason);

            try {
                this.onViolation(reason, snapshot);
            } catch (error) {
                console.error('[PROCTOR] onViolation error:', error);
            }
        }


        /* ====================================================================
           CHỤP ẢNH BẰNG CHỨNG
           ==================================================================== */

        captureSnapshot(studentName, reason) {
            if (!this.video || !this.video.videoWidth || !this.video.videoHeight) {
                return null;
            }

            const canvas = document.createElement('canvas');
            const width = 640;
            const height = Math.round(this.video.videoHeight / this.video.videoWidth * width);

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(this.video, 0, 0, width, height);

            const footer = 75;
            ctx.fillStyle = 'rgba(15,23,42,.92)';
            ctx.fillRect(0, height - footer, width, footer);

            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`VI PHẠM: ${String(reason || '').substring(0, 55)}`, 15, height - 45);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '13px Arial';
            ctx.fillText(`Thí sinh: ${String(studentName || 'Thí sinh').substring(0, 50)} | ⏰ ${new Date().toLocaleString('vi-VN')}`, 15, height - 20);

            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 5;
            ctx.strokeRect(3, 3, width - 6, height - 6);

            return canvas.toDataURL('image/jpeg', 0.82);
        }


        /* ====================================================================
           HUD 60 FPS
           ==================================================================== */

        _startRender() {
            if (!this.hud) return;
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }

            const render = () => {
                if (!this.running) return;
                this._smooth();
                this._renderHUD();
                this.animationFrame = requestAnimationFrame(render);
            };

            this.animationFrame = requestAnimationFrame(render);
        }


        _smooth() {
            const factor = 0.30;
            this.track.smoothX += (this.track.x - this.track.smoothX) * factor;
            this.track.smoothY += (this.track.y - this.track.smoothY) * factor;
            this.track.smoothW += (this.track.w - this.track.smoothW) * factor;
            this.track.smoothH += (this.track.h - this.track.smoothH) * factor;
        }


        /* ====================================================================
           VẼ HUD
           ==================================================================== */

        _renderHUD() {
            if (!this.hud) return;
            const ctx = this.hud.getContext('2d');
            if (!ctx) return;

            // Đồng bộ kích thước canvas với kích thước hiển thị thực tế
            if (this.hud.clientWidth > 0 && (this.hud.width !== this.hud.clientWidth || this.hud.height !== this.hud.clientHeight)) {
                this.hud.width = this.hud.clientWidth;
                this.hud.height = this.hud.clientHeight;
            }

            const W = this.hud.width || 140;
            const H = this.hud.height || 105;

            ctx.clearRect(0, 0, W, H);

            const alert = !this.track.hasFace || this.track.cameraCovered || this.track.multiPerson;
            const pulse = (Math.sin(performance.now() / 180) + 1) / 2;
            const color = !this.isRegistered ? '#38bdf8' : (alert ? '#ef4444' : `rgba(16, 185, 129, ${0.75 + pulse * 0.25})`);
            const glowColor = !this.isRegistered ? 'rgba(56, 189, 248, 0.85)' : (alert ? 'rgba(239, 68, 68, 0.85)' : `rgba(52, 211, 153, ${0.45 + pulse * 0.45})`);

            // 1. 4 Góc viền ngoài màn hình camera
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = alert ? 2.5 : 1.8;

            const corner = Math.min(12, W * 0.1);
            ctx.beginPath();
            ctx.moveTo(4, 4 + corner); ctx.lineTo(4, 4); ctx.lineTo(4 + corner, 4);
            ctx.moveTo(W - 4 - corner, 4); ctx.lineTo(W - 4, 4); ctx.lineTo(W - 4, 4 + corner);
            ctx.moveTo(4, H - 4 - corner); ctx.lineTo(4, H - 4); ctx.lineTo(4 + corner, H - 4);
            ctx.moveTo(W - 4 - corner, H - 4); ctx.lineTo(W - 4, H - 4); ctx.lineTo(W - 4, H - 4 - corner);
            ctx.stroke();

            // 2. Khung tiêu cự ôm sát khuôn mặt (Chỉ vẽ khi có khuôn mặt)
            if (this.track.hasFace) {
                const sx = W / 160;
                const sy = H / 120;

                const boxW = Math.max(28, Math.min(W * 0.75, this.track.smoothW * sx * 0.9));
                const boxH = Math.max(34, Math.min(H * 0.85, this.track.smoothH * sy * 0.95));

                let bx = (this.track.smoothX * sx) - boxW / 2;
                let by = (this.track.smoothY * sy) - boxH / 2;

                bx = Math.max(4, Math.min(W - boxW - 4, bx));
                by = Math.max(4, Math.min(H - boxH - 4, by));

                ctx.shadowColor = glowColor;
                ctx.shadowBlur = 6 + pulse * 8;
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.8 + pulse * 0.5;

                // Khung viền mờ
                ctx.strokeRect(bx, by, boxW, boxH);

                // 4 góc khung ôm sát mặt [ ┌ ┐ └ ┘ ]
                const c = Math.min(8, boxW * 0.25);
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(bx, by + c); ctx.lineTo(bx, by); ctx.lineTo(bx + c, by);
                ctx.moveTo(bx + boxW - c, by); ctx.lineTo(bx + boxW, by); ctx.lineTo(bx + boxW, by + c);
                ctx.moveTo(bx, by + boxH - c); ctx.lineTo(bx, by + boxH); ctx.lineTo(bx + c, by + boxH);
                ctx.moveTo(bx + boxW - c, by + boxH); ctx.lineTo(bx + boxW, by + boxH); ctx.lineTo(bx + boxW, by + boxH - c);
                ctx.stroke();

                // Tia laser quét khi đang trong tiến trình chụp khuôn mặt
                if (!this.isRegistered) {
                    const scanY = by + (pulse * boxH);
                    ctx.strokeStyle = '#38bdf8';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(bx + 4, scanY);
                    ctx.lineTo(bx + boxW - 4, scanY);
                    ctx.stroke();

                    // Chữ báo tiến độ chụp
                    ctx.fillStyle = '#38bdf8';
                    ctx.font = 'bold 10px Arial';
                    ctx.fillText(`📸 QUÉT ${Math.min(100, this.registrationProgress)}%`, bx, Math.max(12, by - 4));
                } else {
                    // Tâm ngắm [+] khi đã khóa
                    const cx = bx + boxW / 2;
                    const cy = by + boxH / 2;
                    const cross = 4 + pulse * 1.5;

                    ctx.shadowBlur = 0;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.moveTo(cx - cross, cy); ctx.lineTo(cx + cross, cy);
                    ctx.moveTo(cx, cy - cross); ctx.lineTo(cx, cy + cross);
                    ctx.stroke();
                }
            }

            // 3. Khi mất dấu mặt / cảnh báo mất tiêu cự -> Vẽ khung tiêu cự đỏ nhấp nháy quét tìm kiếm
            if (!this.track.hasFace) {
                const sx = W / 160;
                const sy = H / 120;

                const lastX = (this.track.registeredX || 80) * sx;
                const lastY = (this.track.registeredY || 60) * sy;
                const lastW = Math.max(30, (this.track.registeredW || 50) * sx);
                const lastH = Math.max(36, (this.track.registeredH || 65) * sy);

                let bx = lastX - lastW / 2;
                let by = lastY - lastH / 2;
                bx = Math.max(4, Math.min(W - lastW - 4, bx));
                by = Math.max(4, Math.min(H - lastH - 4, by));

                ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = `rgba(239, 68, 68, ${0.6 + pulse * 0.4})`;
                ctx.lineWidth = 2;

                // Khung nét đứt màu đỏ
                ctx.setLineDash([6, 4]);
                ctx.strokeRect(bx, by, lastW, lastH);
                ctx.setLineDash([]);

                // 4 góc khung đỏ
                const c = Math.min(8, lastW * 0.25);
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(bx, by + c); ctx.lineTo(bx, by); ctx.lineTo(bx + c, by);
                ctx.moveTo(bx + lastW - c, by); ctx.lineTo(bx + lastW, by); ctx.lineTo(bx + lastW, by + c);
                ctx.moveTo(bx, by + lastH - c); ctx.lineTo(bx, by + lastH); ctx.lineTo(bx + c, by + lastH);
                ctx.moveTo(bx + lastW - c, by + lastH); ctx.lineTo(bx + lastW, by + lastH); ctx.lineTo(bx + lastW, by + lastH - c);
                ctx.stroke();

                // Tia laser quét dọc khung tìm khuôn mặt
                const scanY = by + (pulse * lastH);
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(bx + 4, scanY);
                ctx.lineTo(bx + lastW - 4, scanY);
                ctx.stroke();

                // Dấu chấm hỏi [?] ở tâm
                const cx = bx + lastW / 2;
                const cy = by + lastH / 2;
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', cx, cy);
                ctx.textAlign = 'start';
            }

            // 4. Hiệu ứng Flash trắng khi chụp ảnh
            if (this.flashAlpha > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
                ctx.fillRect(0, 0, W, H);
                this.flashAlpha = Math.max(0, this.flashAlpha - 0.08);
            }

            ctx.restore();
        }


        /* ====================================================================
           ÂM THANH CHỤP ẢNH (SHUTTER CLICK)
           ==================================================================== */

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


        /* ====================================================================
           STATUS
           ==================================================================== */

        _setStatus(type, message) {
            if (this.lastStatus === message) return;
            this.lastStatus = message;

            if (!this.status) {
                this.status = document.querySelector('#exam-camera-status');
            }
            if (!this.status) return;

            const map = {
                ok: { color: '#6ee7b7', background: 'rgba(6,78,59,.94)' },
                warning: { color: '#fbbf24', background: 'rgba(120,53,15,.95)' },
                error: { color: '#fca5a5', background: 'rgba(127,29,29,.96)' },
                info: { color: '#93c5fd', background: 'rgba(30,58,138,.95)' }
            };

            const style = map[type] || map.info;
            this.status.style.color = style.color;
            this.status.style.background = style.background;
            this.status.textContent = message;
        }


        /* ====================================================================
           CẢNH BÁO GIỌNG NÓI
           ==================================================================== */

        _speak(text = 'Vui lòng quay lại trước camera') {
            try {
                if (!window.speechSynthesis) return;
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'vi-VN';
                utterance.rate = 1.08;
                utterance.volume = 1;
                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.warn('[PROCTOR] Speech error:', error);
            }
        }


        /* ====================================================================
           DỪNG
           ==================================================================== */

        stop() {
            this.running = false;
            this._stopAnalysis();

            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }

            if (this.stream) {
                this.stream.getTracks().forEach(track => {
                    try { track.stop(); } catch (_) {}
                });
                this.stream = null;
            }

            if (this.video) {
                try {
                    this.video.pause();
                    this.video.srcObject = null;
                } catch (_) {}
            }

            this.track.hasFace = false;
            this.absentStartTime = null;
            this.absentCount = 0;
            this.coveredCount = 0;

            if (this.hud) {
                const ctx = this.hud.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, this.hud.width, this.hud.height);
                }
            }

            this._setStatus('info', '⚪ ĐÃ DỪNG GIÁM SÁT CAMERA');
            console.log('[PROCTOR] CAMERA STOPPED');
        }


        /* ====================================================================
           RESTART
           ==================================================================== */

        async restart() {
            this.stop();
            await new Promise(resolve => setTimeout(resolve, 200));
            return await this.start();
        }


        /* ====================================================================
           STOP ANALYSIS
           ==================================================================== */

        _stopAnalysis() {
            if (this.analysisTimer) {
                clearInterval(this.analysisTimer);
                this.analysisTimer = null;
            }
        }
    }


    /* ========================================================================
       ĐƯA CLASS RA WINDOW
       ======================================================================== */

    window.ProctorCameraAI = ProctorCameraAI;


    /* ========================================================================
       START CAMERA
       ======================================================================== */

    window.startExamCameraAI = async function (options = {}) {
        try {
            const proctor = new ProctorCameraAI(options);
            const started = await proctor.start(options.stream);

            if (started) {
                window.__examProctorAI = proctor;
            }

            return proctor;
        } catch (error) {
            console.error('[PROCTOR] START ERROR:', error);
            return null;
        }
    };


    /* ========================================================================
       STOP CAMERA
       ======================================================================== */

    window.stopExamCameraAI = function () {
        if (window.__examProctorAI) {
            window.__examProctorAI.stop();
            window.__examProctorAI = null;
        }
    };


    /* ========================================================================
       HÀM TỰ ĐỘNG TÌM CAMERA LMS
       ======================================================================== */

    window.initExamCameraAI = async function (customOptions = {}) {

        const video = customOptions.video || document.querySelector('#exam-pip-video');
        if (!video) {
            console.error('[PROCTOR] Không tìm thấy #exam-pip-video');
            return null;
        }

        const parent = video.parentElement;

        let hud = customOptions.hud || document.querySelector('#exam-proctor-hud') || document.querySelector('#exam-pip-hud');
        if (!hud && parent) {
            if (getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }
            hud = document.createElement('canvas');
            hud.id = 'exam-proctor-hud';
            hud.width = 640;
            hud.height = 480;
            hud.style.cssText = `
                position:absolute;
                inset:0;
                width:100%;
                height:100%;
                z-index:20;
                pointer-events:none;
            `;
            parent.appendChild(hud);
        }

        let status = customOptions.status || document.querySelector('#exam-camera-status');
        if (!status && parent) {
            status = document.createElement('div');
            status.id = 'exam-camera-status';
            status.style.cssText = `
                position:absolute;
                left:8px;
                right:8px;
                bottom:8px;
                z-index:30;
                padding:7px 10px;
                border-radius:7px;
                background:rgba(15,23,42,.90);
                color:#6ee7b7;
                font:bold 12px Arial,sans-serif;
                text-align:center;
                pointer-events:none;
                box-sizing:border-box;
            `;
            parent.appendChild(status);
        }

        const proctor = await window.startExamCameraAI({
            video: video,
            hud: hud,
            status: status,
            stream: customOptions.stream || null,
            studentName: customOptions.studentName || (window.currentUser && window.currentUser.name) || 'Thí sinh',
            onViolation: customOptions.onViolation || function (reason, snapshot) {
                console.warn('[PROCTOR VIOLATION]', reason);
                if (typeof window.handleViolation === 'function') {
                    try {
                        window.handleViolation(reason, snapshot);
                        return;
                    } catch (error) {
                        console.error('[PROCTOR] handleViolation error:', error);
                    }
                }
                window.__lastProctorViolation = {
                    reason: reason,
                    snapshot: snapshot,
                    time: new Date().toISOString()
                };
            }
        });

        return proctor;
    };


    /* ========================================================================
       TƯƠNG THÍCH HÀM CHỤP ẢNH CŨ
       ======================================================================== */

    window._captureProctorSnapshot = function (videoEl, studentName, violationReason) {
        try {
            if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
                return null;
            }

            const canvas = document.createElement('canvas');
            const width = 640;
            const height = Math.round(videoEl.videoHeight / videoEl.videoWidth * width);

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoEl, 0, 0, width, height);

            const footer = 75;
            ctx.fillStyle = 'rgba(15,23,42,.92)';
            ctx.fillRect(0, height - footer, width, footer);

            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('VI PHẠM: ' + String(violationReason || '').substring(0, 55), 15, height - 45);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '13px Arial';
            ctx.fillText('Thí sinh: ' + String(studentName || 'Thí sinh').substring(0, 50) + ' | ⏰ ' + new Date().toLocaleString('vi-VN'), 15, height - 20);

            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 5;
            ctx.strokeRect(3, 3, width - 6, height - 6);

            return canvas.toDataURL('image/jpeg', 0.82);

        } catch (error) {
            console.error('[PROCTOR] Snapshot compatibility error:', error);
            return null;
        }
    };

    console.log('[PROCTOR] ProctorCameraAI module loaded.');

})();
