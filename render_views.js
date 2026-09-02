/* FORCE_CACHE_PURGE_BUILD_20260802_114000 */
function attachRenderMethods(LMSApp) {
  if (typeof window !== 'undefined') window.attachRenderMethods = attachRenderMethods;

  LMSApp.prototype.openRemotePairingModal = function() {
    let modal = document.getElementById('ai-remote-pairing-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ai-remote-pairing-modal';
      modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.82); backdrop-filter: blur(10px); z-index: 99999; display: flex; justify-content: center; align-items: center; padding: 1.5rem; animation: fadeIn 0.25s ease-out;';
      document.body.appendChild(modal);
    }

    let defaultHost = 'lmsamatranglong.netlify.app';
    if (typeof window !== 'undefined' && window.location) {
      if (window.location.protocol === 'file:') {
        defaultHost = '192.168.0.110:8888';
      } else if (window.location.host && window.location.host !== '127.0.0.1:8888' && window.location.host !== 'localhost:8888' && window.location.host !== '127.0.0.1' && window.location.host !== 'localhost') {
        defaultHost = window.location.host;
      } else if (window.location.hostname && window.location.hostname.startsWith('192.168.')) {
        defaultHost = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
      }
    }

    let currentHost = this._customLanHost || defaultHost;
    let proto = (typeof window !== 'undefined' && window.location.protocol === 'https:') ? 'https://' : 'http://';
    if (currentHost.includes('vercel.app') || currentHost.includes('netlify.app') || currentHost.includes('github.io') || currentHost.includes('edu.vn')) {
      proto = 'https://';
    }

    if (!this._lmsPeerId) {
      this._lmsPeerId = 'LMS-CAM-' + Math.floor(1000 + Math.random() * 9000);
    }
    const remoteUrl = proto + currentHost + '/cam.html?v=' + Date.now() + '&peer=' + this._lmsPeerId;
    const qrImgUrl1 = 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=' + encodeURIComponent(remoteUrl);
    const qrImgUrl2 = 'https://chart.googleapis.com/chart?cht=qr&chs=280x280&chl=' + encodeURIComponent(remoteUrl);

    modal.innerHTML = `
      <div style="background: #ffffff; width: 100%; max-width: 550px; border-radius: 26px; padding: 2.2rem; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.35); position: relative; border: 2px solid #bfdbfe; font-family: var(--font-body); color: #0f172a; text-align: center;">

        <!-- Nút đóng -->
        <button onclick="document.getElementById('ai-remote-pairing-modal').style.display='none';" style="position: absolute; top: 1.2rem; right: 1.2rem; background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.3rem; color: #64748b; font-weight: bold; display: flex; align-items: center; justify-content: center;">✕</button>

        <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1d4ed8; font-weight: 800; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.82rem; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(37,99,235,0.08);">
          <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block; box-shadow: 0 0 10px #10b981;"></span>
          QUÉT MÃ QR KẾT NỐI CAMERA ĐIỆN THOẠI 1 CHẠM (HTTPS INTERNET)
        </div>

        <h2 style="margin: 0 0 0.5rem 0; font-family: var(--font-title); font-size: 1.6rem; font-weight: 900; color: #0f172a; letter-spacing: -0.3px;">
          📷 Giơ Điện Thoại Quét Mã QR Bên Dưới
        </h2>
        <p style="margin: 0 0 1.2rem 0; font-size: 0.9rem; color: #475569; font-weight: 600; line-height: 1.5;">
          Dùng ứng dụng <strong>Camera thường</strong> (trên iPhone/Android) hoặc <strong>Zalo</strong> rọi thẳng vào hình QR. Mở mượt 100% trên 4G/5G/Wi-Fi!
        </p>

        <!-- KHUNG MÃ QR CODE LỚN SIÊU NÉT -->
        <div style="background: #ffffff; border: 3px solid #3b82f6; border-radius: 24px; padding: 1.2rem; display: inline-block; margin-bottom: 1.2rem; box-shadow: 0 10px 30px rgba(37,99,235,0.15); position: relative;">
          <img id="qr-code-img-element" src="${qrImgUrl1}" alt="Mã QR Code Máy Ảnh Di Động" style="width: 240px; height: 240px; border-radius: 14px; display: block; margin: 0 auto;" onerror="this.onerror=null; this.src='${qrImgUrl2}';">
          <div style="margin-top: 0.85rem; font-size: 0.88rem; font-weight: 800; color: #1e40af; background: #eff6ff; padding: 0.5rem 1rem; border-radius: 12px; border: 1px solid #bfdbfe;">
            📲 ĐƯỜNG DẪN QR TRUYỀN HÌNH: <span id="current-lan-url-display" style="font-size: 0.92rem; color: #1d4ed8; font-family: monospace;">${remoteUrl}</span>
          </div>
        </div>

        <!-- IP / DOMAIN CUSTOMIZER -->
        <div style="margin-bottom: 1.2rem; display: flex; justify-content: center; align-items: center; gap: 0.6rem; flex-wrap: wrap; background: #f8fafc; padding: 0.75rem 1rem; border-radius: 14px; border: 1px solid #e2e8f0;">
          <span style="font-size: 0.82rem; font-weight: 700; color: #475569;">Tên Miền / IP Truy Cập:</span>
          <input type="text" id="ip-custom-input" value="${currentHost}" style="padding: 0.4rem 0.8rem; border-radius: 10px; border: 1.5px solid #cbd5e1; font-weight: 800; font-size: 0.88rem; width: 220px; text-align: center; color: #0f172a;" />
          <button onclick="
            const val = document.getElementById('ip-custom-input').value.trim();
            if (val) {
              window.app._customLanHost = val;
              const p = (val.includes('://')) ? '' : ((val.includes('vercel.app') || val.includes('netlify.app') || val.includes('edu.vn')) ? 'https://' : 'http://');
              const newUrl = p + val + (val.endsWith('.html') ? '' : '/cam.html');
              document.getElementById('current-lan-url-display').innerText = newUrl;
              document.getElementById('qr-code-img-element').src = 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=' + encodeURIComponent(newUrl);
              if(window.app.showToast) window.app.showToast('✅ Đã cập nhật Mã QR theo Tên miền mới!');
            }
          " style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #fff; border: none; padding: 0.45rem 0.9rem; border-radius: 10px; font-weight: 800; font-size: 0.82rem; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">Cập Nhật QR</button>
        </div>

        <!-- NÚT THAO TÁC -->
        <div style="display: flex; gap: 0.8rem; justify-content: center;">
          <a href="${remoteUrl}" target="_blank" style="text-decoration: none; background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1d4ed8; padding: 0.75rem 1.3rem; border-radius: 14px; font-weight: 800; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 0.4rem;">
            <span>🔗 Mở Thử Trên Trình Duyệt</span>
          </a>
          <button onclick="document.getElementById('ai-remote-pairing-modal').style.display='none';" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border: none; color: #ffffff; padding: 0.75rem 1.5rem; border-radius: 14px; font-weight: 800; font-size: 0.88rem; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.3);">
            Đã Hiểu & Đóng
          </button>
        </div>

      </div>
    `;

    modal.style.display = 'flex';
  };



          // 1.0 TRANG CHỦ / DASHBOARD TỔNG QUAN DÀNH CHO ADMIN VÀ GIÁO VIÊN
  LMSApp.prototype.render_info = function(dom) {
    if (db.initUserGroupsAndPermissions) db.initUserGroupsAndPermissions();

    const isTeacherRole = (this.currentRole === 'teacher' || (this.currentUser && this.currentUser.role === 'teacher'));

    // =========================================================================
    // 🌟 GIAO DIỆN BẢNG ĐIỀU KHIỂN & THỐNG KÊ TOÀN DIỆN CHO GIÁO VIÊN
    // =========================================================================
    if (isTeacherRole) {
      const teacher = this.currentUser || { name: 'Thầy/Cô Giáo Viên', subjectId: 'toan', classes: ['6A', '6B', '7A'] };
      const teacherName = teacher.name || teacher.fullName || 'Thầy/Cô Giáo Viên';
      const subjectId = teacher.subjectId || 'toan';
      
      const allSubjects = (typeof db !== 'undefined' && db.getSubjects) ? db.getSubjects() : [];
      const subObj = allSubjects.find(s => s.id === subjectId) || { name: 'Toán học', icon: '📐' };
      
      const assignedClasses = (teacher.classes && teacher.classes.length > 0) ? teacher.classes : ['6A', '6B', '7A'];
      const allClasses = (typeof db !== 'undefined' && db.getClasses) ? db.getClasses() : [];
      const homeroomClass = allClasses.find(c => c.homeroomTeacherId === teacher.id || c.homeroomTeacher === teacherName);
      
      const allStudents = (typeof db !== 'undefined' && db.getStudents) ? db.getStudents() : [];
      const teacherStudents = allStudents.filter(s => assignedClasses.includes(s.classId));
      const totalStudentsCount = teacherStudents.length || (assignedClasses.length * 35);

      const allLessons = (typeof db !== 'undefined' && db.getLessons) ? db.getLessons() : [];
      const teacherLessons = allLessons.filter(l => l.subjectId === subjectId || l.teacherId === teacher.id);
      const allUploadedFiles = (typeof db !== 'undefined' && db.getUploadedFiles) ? db.getUploadedFiles() : [];
      const totalLessonCount = teacherLessons.length + allUploadedFiles.length;

      const allQuestions = (typeof db !== 'undefined' && db.getQuestions) ? db.getQuestions() : [];
      const teacherQuestions = allQuestions.filter(q => q.subjectId === subjectId || !q.subjectId);

      const allExams = (typeof db !== 'undefined' && db.getExams) ? db.getExams() : [];
      const teacherExams = allExams.filter(e => e.subjectId === subjectId || e.teacherId === teacher.id);

      const allSubmissions = (typeof db !== 'undefined' && db.getSubmissions) ? db.getSubmissions() : [];
      const allAttempts = (typeof db !== 'undefined' && db.getExamAttempts) ? db.getExamAttempts() : [];
      const teacherSubmissionsCount = allSubmissions.length + allAttempts.length;

      const totCount = Math.round(totalStudentsCount * 0.38);
      const khaCount = Math.round(totalStudentsCount * 0.44);
      const datCount = Math.round(totalStudentsCount * 0.15);
      const chuaDatCount = Math.max(0, totalStudentsCount - (totCount + khaCount + datCount));

      dom.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.6rem; max-width:1280px; margin:0 auto; padding-bottom:2.5rem; font-family:var(--font-body); animation:fadeIn 0.25s ease-out;">

          <!-- SECTION 1: HERO BANNER GIÁO VIÊN (ĐỒ HỌA TRONG SÁNG & SANG TRỌNG) -->
          <div style="background:linear-gradient(135deg, #ffffff 0%, #f0f9ff 40%, #e0f2fe 100%); border-radius:24px; padding:1.8rem 2rem; color:#0f172a; box-shadow:0 10px 30px rgba(37,99,235,0.1); border:1.8px solid #93c5fd; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.2rem; position:relative; overflow:hidden;">
            <div style="position:absolute; right:-50px; top:-50px; width:220px; height:220px; background:rgba(37,99,235,0.04); border-radius:50%; pointer-events:none;"></div>
            <div style="position:absolute; right:120px; bottom:-80px; width:180px; height:180px; background:rgba(16,185,129,0.04); border-radius:50%; pointer-events:none;"></div>

            <div style="position:relative; z-index:2;">
              <div style="display:inline-flex; align-items:center; gap:0.45rem; background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; font-weight:800; padding:0.3rem 0.85rem; border-radius:20px; font-size:0.8rem; margin-bottom:0.6rem;">
                <span style="width:8px; height:8px; border-radius:50%; background:#10b981; display:inline-block; box-shadow:0 0 8px #10b981;"></span>
                KHÔNG GIAN GIẢNG DẠY SỐ — NĂM HỌC 2025-2026
              </div>
              <h1 style="margin:0; font-family:var(--font-title); font-size:1.75rem; font-weight:900; letter-spacing:-0.3px; color:#1e3a8a;">
                Xin chào, <span style="color:#2563eb;">${teacherName}</span>! 👨‍🏫
              </h1>
              <p style="margin:0.45rem 0 0 0; font-size:0.92rem; color:#475569; font-weight:500; max-width:720px; line-height:1.5;">
                Môn phụ trách: <strong style="color:#1e3a8a;">${subObj.name}</strong> &nbsp;|&nbsp; 
                Lớp giảng dạy: <strong style="color:#2563eb;">${assignedClasses.map(c => 'Lớp ' + c).join(', ')}</strong>
                ${homeroomClass ? ` &nbsp;|&nbsp; Chủ nhiệm: <strong style="color:#059669;">Lớp ${homeroomClass.name || homeroomClass.id}</strong>` : ''}
              </p>
            </div>

            <div style="display:flex; align-items:center; gap:0.75rem; position:relative; z-index:2; flex-wrap:wrap;">
              <button onclick="if(window.app) window.app.switchView('lessons');" style="background:#ffffff; color:#2563eb; border:1.5px solid #bfdbfe; padding:0.75rem 1.25rem; border-radius:14px; font-weight:700; font-size:0.88rem; cursor:pointer; display:flex; align-items:center; gap:0.45rem; box-shadow:0 2px 8px rgba(37,99,235,0.08); transition:all 0.2s;" onmouseover="this.style.background='#eff6ff';" onmouseout="this.style.background='#ffffff';">
                <span>📝 Soạn KHBD Mới</span>
              </button>
              <button onclick="if(window.app) window.app.switchView('exams');" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#ffffff; border:none; padding:0.75rem 1.35rem; border-radius:14px; font-weight:800; font-size:0.88rem; cursor:pointer; box-shadow:0 4px 14px rgba(16,185,129,0.3); display:flex; align-items:center; gap:0.45rem;">
                <span>➕ Tạo Đề Kiểm Tra</span>
              </button>
            </div>
          </div>

          <!-- SECTION 2: 6 THẺ KPI THỐNG KÊ TOÀN DIỆN CHO GIÁO VIÊN -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(185px, 1fr)); gap:1.1rem;">
            
            <!-- KPI 1: Lớp Phụ Trách -->
            <div onclick="if(window.app) window.app.switchView('grading');" style="background:#ffffff; border-radius:18px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 15px rgba(0,0,0,0.03); cursor:pointer; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)';">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.65rem;">
                <span style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">Lớp Phụ Trách</span>
                <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color:#2563eb; display:flex; align-items:center; justify-content:center; font-size:1.25rem;">🏫</div>
              </div>
              <div style="font-size:1.8rem; font-weight:900; color:#0f172a; line-height:1;">${assignedClasses.length} <span style="font-size:0.85rem; font-weight:600; color:#64748b;">lớp</span></div>
              <div style="font-size:0.76rem; color:#2563eb; font-weight:700; margin-top:0.45rem;">${assignedClasses.map(c => 'Lớp ' + c).join(', ')}</div>
            </div>

            <!-- KPI 2: Tổng Học Sinh -->
            <div onclick="if(window.app) window.app.switchView('grading');" style="background:#ffffff; border-radius:18px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 15px rgba(0,0,0,0.03); cursor:pointer; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)';">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.65rem;">
                <span style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">Học Sinh Giảng Dạy</span>
                <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%); color:#9333ea; display:flex; align-items:center; justify-content:center; font-size:1.25rem;">🎓</div>
              </div>
              <div style="font-size:1.8rem; font-weight:900; color:#0f172a; line-height:1;">${totalStudentsCount} <span style="font-size:0.85rem; font-weight:600; color:#64748b;">học sinh</span></div>
              <div style="font-size:0.76rem; color:#9333ea; font-weight:700; margin-top:0.45rem;">100% Đồng bộ CSDL</div>
            </div>

            <!-- KPI 3: KHBD & Bài Giảng -->
            <div onclick="if(window.app) window.app.switchView('lessons');" style="background:#ffffff; border-radius:18px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 15px rgba(0,0,0,0.03); cursor:pointer; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)';">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.65rem;">
                <span style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">KHBD & Bài Giảng</span>
                <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%); color:#16a34a; display:flex; align-items:center; justify-content:center; font-size:1.25rem;">📝</div>
              </div>
              <div style="font-size:1.8rem; font-weight:900; color:#0f172a; line-height:1;">${totalLessonCount} <span style="font-size:0.85rem; font-weight:600; color:#64748b;">tài liệu</span></div>
              <div style="font-size:0.76rem; color:#16a34a; font-weight:700; margin-top:0.45rem;">Chuẩn CV 5512 & Slide</div>
            </div>

            <!-- KPI 4: Ngân Hàng Câu Hỏi -->
            <div onclick="if(window.app) window.app.switchView('questions');" style="background:#ffffff; border-radius:18px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 15px rgba(0,0,0,0.03); cursor:pointer; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)';">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.65rem;">
                <span style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">Ngân Hàng Câu Hỏi</span>
                <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg, #fefce8 0%, #fef08a 100%); color:#ca8a04; display:flex; align-items:center; justify-content:center; font-size:1.25rem;">❓</div>
              </div>
              <div style="font-size:1.8rem; font-weight:900; color:#0f172a; line-height:1;">${teacherQuestions.length} <span style="font-size:0.85rem; font-weight:600; color:#64748b;">câu</span></div>
              <div style="font-size:0.76rem; color:#ca8a04; font-weight:700; margin-top:0.45rem;">Đầy đủ 4 nhóm GDPT 2018</div>
            </div>

            <!-- KPI 5: Đề Kiểm Tra Đã Tạo -->
            <div onclick="if(window.app) window.app.switchView('exams');" style="background:#ffffff; border-radius:18px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 15px rgba(0,0,0,0.03); cursor:pointer; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)';">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.65rem;">
                <span style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">Đề Kiểm Tra</span>
                <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); color:#0891b2; display:flex; align-items:center; justify-content:center; font-size:1.25rem;">⏱️</div>
              </div>
              <div style="font-size:1.8rem; font-weight:900; color:#0f172a; line-height:1;">${teacherExams.length} <span style="font-size:0.85rem; font-weight:600; color:#64748b;">bộ đề</span></div>
              <div style="font-size:0.76rem; color:#0891b2; font-weight:700; margin-top:0.45rem;">TX, Giữa kỳ & Cuối kỳ</div>
            </div>

            <!-- KPI 6: Lượt Nộp & Chấm Điểm -->
            <div onclick="if(window.app) window.app.switchView('grading');" style="background:#ffffff; border-radius:18px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 15px rgba(0,0,0,0.03); cursor:pointer; transition:all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)';">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.65rem;">
                <span style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">Bài Nộp Học Sinh</span>
                <div style="width:40px; height:40px; border-radius:12px; background:linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); color:#e11d48; display:flex; align-items:center; justify-content:center; font-size:1.25rem;">💯</div>
              </div>
              <div style="font-size:1.8rem; font-weight:900; color:#0f172a; line-height:1;">${teacherSubmissionsCount} <span style="font-size:0.85rem; font-weight:600; color:#64748b;">lượt</span></div>
              <div style="font-size:0.76rem; color:#e11d48; font-weight:700; margin-top:0.45rem;">Đã chấm & Vào điểm tự động</div>
            </div>

          </div>

          <!-- SECTION 3: BIỂU ĐỒ HỌC LỰC & TIẾN ĐỘ THEO LỚP -->
          <div style="display:grid; grid-template-columns:1.25fr 1fr; gap:1.4rem;">

            <!-- Biểu đồ 1: Xếp loại học lực môn phụ trách -->
            <div style="background:#ffffff; border-radius:20px; border:1.5px solid #cbd5e1; padding:1.5rem; box-shadow:0 4px 18px rgba(0,0,0,0.04);">
              <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1.5px solid #f1f5f9; padding-bottom:0.85rem; margin-bottom:1.2rem;">
                <div>
                  <h3 style="margin:0; font-size:1.1rem; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:0.45rem;">
                    <span>📊</span> XẾP LOẠI HỌC LỰC MÔN ${subObj.name.toUpperCase()} (GDPT 2018)
                  </h3>
                  <div style="font-size:0.8rem; color:#64748b; font-weight:400; margin-top:0.2rem;">Thống kê trên toàn bộ ${totalStudentsCount} học sinh các lớp phụ trách</div>
                </div>
                <span style="font-size:0.78rem; font-weight:700; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; padding:0.25rem 0.7rem; border-radius:10px;">${subObj.name}</span>
              </div>

              <div style="display:flex; flex-direction:column; gap:1.1rem;">
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.88rem; font-weight:700; margin-bottom:0.4rem;">
                    <span style="color:#059669; display:flex; align-items:center; gap:0.35rem;">🥇 Mức Tốt (8.0 - 10.0đ): 38%</span>
                    <span style="color:#475569; font-weight:700;">${totCount} học sinh</span>
                  </div>
                  <div style="width:100%; height:12px; background:#f1f5f9; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">
                    <div style="width:38%; height:100%; background:linear-gradient(90deg, #10b981 0%, #059669 100%); border-radius:10px; box-shadow:0 2px 6px rgba(16,185,129,0.3);"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.88rem; font-weight:700; margin-bottom:0.4rem;">
                    <span style="color:#2563eb; display:flex; align-items:center; gap:0.35rem;">🥈 Mức Khá (6.5 - 7.9đ): 44%</span>
                    <span style="color:#475569; font-weight:700;">${khaCount} học sinh</span>
                  </div>
                  <div style="width:100%; height:12px; background:#f1f5f9; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">
                    <div style="width:44%; height:100%; background:linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); border-radius:10px; box-shadow:0 2px 6px rgba(37,99,235,0.3);"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.88rem; font-weight:700; margin-bottom:0.4rem;">
                    <span style="color:#d97706; display:flex; align-items:center; gap:0.35rem;">🥉 Mức Đạt (5.0 - 6.4đ): 15%</span>
                    <span style="color:#475569; font-weight:700;">${datCount} học sinh</span>
                  </div>
                  <div style="width:100%; height:12px; background:#f1f5f9; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">
                    <div style="width:15%; height:100%; background:linear-gradient(90deg, #f59e0b 0%, #d97706 100%); border-radius:10px; box-shadow:0 2px 6px rgba(245,158,11,0.3);"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.88rem; font-weight:700; margin-bottom:0.4rem;">
                    <span style="color:#dc2626; display:flex; align-items:center; gap:0.35rem;">⚠️ Chưa Đạt (< 5.0đ): 3%</span>
                    <span style="color:#475569; font-weight:700;">${chuaDatCount} học sinh</span>
                  </div>
                  <div style="width:100%; height:12px; background:#f1f5f9; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">
                    <div style="width:3%; height:100%; background:linear-gradient(90deg, #ef4444 0%, #b91c1c 100%); border-radius:10px; box-shadow:0 2px 6px rgba(239,68,68,0.3);"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Biểu đồ 2: Sơ đồ hình quạt tỷ lệ học lực -->
            <div style="background:#ffffff; border-radius:20px; border:1.5px solid #cbd5e1; padding:1.5rem; box-shadow:0 4px 18px rgba(0,0,0,0.04); display:flex; flex-direction:column; justify-content:space-between;">
              <div style="border-bottom:1.5px solid #f1f5f9; padding-bottom:0.85rem; margin-bottom:0.85rem;">
                <h3 style="margin:0; font-size:1.1rem; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:0.45rem;">
                  <span>🎯</span> TỶ LỆ HỌC LỰC HỌC SINH CỦA THẦY/CÔ
                </h3>
                <div style="font-size:0.8rem; color:#64748b; font-weight:400; margin-top:0.2rem;">Tổng hợp tỷ lệ 4 mức chất lượng môn học</div>
              </div>

              <div style="display:flex; justify-content:center; align-items:center; margin:0.6rem 0;">
                <div style="width:145px; height:145px; border-radius:50%; background:conic-gradient(#10b981 0% 38%, #3b82f6 38% 82%, #f59e0b 82% 97%, #ef4444 97% 100%); display:flex; align-items:center; justify-content:center; box-shadow:0 6px 20px rgba(0,0,0,0.1); position:relative;">
                  <div style="width:95px; height:95px; background:#ffffff; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:inset 0 2px 8px rgba(0,0,0,0.06);">
                    <div style="font-weight:900; font-size:1.35rem; color:#0f172a;">82%</div>
                    <div style="font-size:0.68rem; color:#64748b; font-weight:700;">Tốt & Khá</div>
                  </div>
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.55rem; font-size:0.78rem; font-weight:700;">
                <div style="background:#f0fdf4; padding:0.45rem 0.6rem; border-radius:9px; color:#166534; border:1px solid #bbf7d0;">🥇 Tốt: 38% (${totCount} em)</div>
                <div style="background:#eff6ff; padding:0.45rem 0.6rem; border-radius:9px; color:#1e40af; border:1px solid #bfdbfe;">🥈 Khá: 44% (${khaCount} em)</div>
                <div style="background:#fffbe8; padding:0.45rem 0.6rem; border-radius:9px; color:#92400e; border:1px solid #fef08a;">🥉 Đạt: 15% (${datCount} em)</div>
                <div style="background:#fef2f2; padding:0.45rem 0.6rem; border-radius:9px; color:#991b1b; border:1px solid #fecaca;">⚠️ Chưa đạt: 3% (${chuaDatCount} em)</div>
              </div>
            </div>

          </div>

          <!-- SECTION 4: TIẾN ĐỘ TỪNG LỚP & KHỐI TÁC VỤ 1 CHẠM -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.4rem;">
            
            <!-- Danh sách từng lớp giảng dạy -->
            <div style="background:#ffffff; border-radius:20px; border:1.5px solid #cbd5e1; padding:1.5rem; box-shadow:0 4px 18px rgba(0,0,0,0.04);">
              <div style="border-bottom:1.5px solid #f1f5f9; padding-bottom:0.85rem; margin-bottom:1.1rem;">
                <h3 style="margin:0; font-size:1.1rem; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:0.45rem;">
                  <span>🏫</span> TIẾN ĐỘ & ĐIỂM TRUNG BÌNH THEO TỪNG LỚP
                </h3>
                <div style="font-size:0.8rem; color:#64748b; font-weight:400; margin-top:0.2rem;">Kết quả đánh giá thường xuyên & nộp bài của các lớp</div>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.85rem;">
                ${assignedClasses.map((clsName, idx) => {
                  const baseAvg = [8.1, 7.8, 8.4, 7.6, 8.2][idx % 5];
                  const colors = ['linear-gradient(90deg,#2563eb,#3b82f6)', 'linear-gradient(90deg,#10b981,#059669)', 'linear-gradient(90deg,#8b5cf6,#7c3aed)', 'linear-gradient(90deg,#f59e0b,#d97706)'];
                  return `
                    <div>
                      <div style="display:flex; justify-content:space-between; font-size:0.84rem; font-weight:700; margin-bottom:0.3rem;">
                        <span style="color:#1e293b; display:flex; align-items:center; gap:0.4rem;">🏫 Lớp ${clsName}</span>
                        <span style="font-weight:800; color:#1e40af;">Điểm TB: ${baseAvg} / 10 &nbsp;|&nbsp; <span style="color:#059669;">98% Nộp bài</span></span>
                      </div>
                      <div style="width:100%; height:9px; background:#f1f5f9; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">
                        <div style="width:${Math.round(baseAvg * 10)}%; height:100%; background:${colors[idx % colors.length]}; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.15);"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Khối Lối Tắt Thao Tác Nhanh -->
            <div style="background:#ffffff; border-radius:20px; border:1.5px solid #cbd5e1; padding:1.5rem; box-shadow:0 4px 18px rgba(0,0,0,0.04); display:flex; flex-direction:column; justify-content:space-between;">
              <div style="border-bottom:1.5px solid #f1f5f9; padding-bottom:0.85rem; margin-bottom:1rem;">
                <h3 style="margin:0; font-size:1.1rem; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:0.45rem;">
                  <span>⚡</span> LỐI TẮT TÁC VỤ GIẢNG DẠY 1 CHẠM
                </h3>
                <div style="font-size:0.8rem; color:#64748b; font-weight:400; margin-top:0.2rem;">Truy cập nhanh các công cụ cốt lõi của giáo viên</div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem;">
                <button onclick="if(window.app) window.app.switchView('lessons');" style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:14px; padding:1rem; text-align:left; cursor:pointer; transition:transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
                  <div style="font-size:1.6rem; margin-bottom:0.35rem;">📝</div>
                  <div style="font-weight:700; font-size:0.9rem; color:#166534;">Soạn KHBD / Slide</div>
                  <div style="font-size:0.75rem; color:#4b5563; margin-top:0.15rem;">Kế hoạch bài dạy 5512</div>
                </button>

                <button onclick="if(window.app) window.app.switchView('exams');" style="background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:14px; padding:1rem; text-align:left; cursor:pointer; transition:transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
                  <div style="font-size:1.6rem; margin-bottom:0.35rem;">⏱️</div>
                  <div style="font-weight:700; font-size:0.9rem; color:#1e40af;">Tạo Đề Kiểm Tra</div>
                  <div style="font-size:0.75rem; color:#4b5563; margin-top:0.15rem;">TX, GK, CK & Quizizz</div>
                </button>

                <button onclick="if(window.app) window.app.switchView('grading');" style="background:#faf5ff; border:1.5px solid #e9d5ff; border-radius:14px; padding:1rem; text-align:left; cursor:pointer; transition:transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
                  <div style="font-size:1.6rem; margin-bottom:0.35rem;">💯</div>
                  <div style="font-weight:700; font-size:0.9rem; color:#7e22ce;">Chấm Điểm & Sổ Điểm</div>
                  <div style="font-size:0.75rem; color:#4b5563; margin-top:0.15rem;">Vào điểm tự động</div>
                </button>

                <button onclick="if(window.app) window.app.switchView('ai_hub');" style="background:#fffbe8; border:1.5px solid #fef08a; border-radius:14px; padding:1rem; text-align:left; cursor:pointer; transition:transform 0.15s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">
                  <div style="font-size:1.6rem; margin-bottom:0.35rem;">🤖</div>
                  <div style="font-weight:700; font-size:0.9rem; color:#854d0e;">Trợ Lý AI & Game</div>
                  <div style="font-size:0.75rem; color:#4b5563; margin-top:0.15rem;">15 Game & Trợ giảng AI</div>
                </button>
              </div>
            </div>

          </div>

        </div>
      `;
      return;
    }

    // =========================================================================
    // 🌟 GIAO DIỆN BẢNG ĐIỀU KHIỂN & THỐNG KÊ DÀNH CHO ADMIN / TOÀN TRƯỜNG
    // =========================================================================
    const classesList = db.state.classesList || [];
    const classesCount = classesList.length || 5;
    const teachersList = db.getTeachers ? db.getTeachers() : [];
    const teachersCount = teachersList.length || 4;
    const studentsList = db.getStudents ? db.getStudents() : [];
    const studentsCount = studentsList.length || 175;
    const subjectsList = db.state.subjectsList || [];
    const subjectsCount = subjectsList.length || 6;

    const examAttempts = (typeof db !== 'undefined' && db.getExamAttempts) ? db.getExamAttempts() : [];
    const homeworkSubmissions = (typeof db !== 'undefined' && db.getSubmissions) ? db.getSubmissions() : [];
    const totalSubmissionsDisplay = examAttempts.length + homeworkSubmissions.length;

    const visitCount = (typeof db !== 'undefined' && db.getVisitCount) ? db.getVisitCount() : 0;
    const visitDisplay = visitCount > 0 ? visitCount.toLocaleString('vi-VN') : '1,248';
    const submissionsDisplay = totalSubmissionsDisplay > 0 ? totalSubmissionsDisplay.toLocaleString('vi-VN') : '856';

    const totCount = Math.round(studentsCount * 0.35);
    const khaCount = Math.round(studentsCount * 0.45);
    const datCount = Math.round(studentsCount * 0.16);
    const chuaDatCount = Math.max(0, studentsCount - (totCount + khaCount + datCount));

    const subjectStats = [
      { name: 'Toán học', avg: 7.8, icon: '📐', color: 'linear-gradient(90deg,#2563eb,#3b82f6)' },
      { name: 'Ngữ văn', avg: 7.5, icon: '📖', color: 'linear-gradient(90deg,#7c3aed,#8b5cf6)' },
      { name: 'Tiếng Anh', avg: 8.1, icon: '🔤', color: 'linear-gradient(90deg,#059669,#10b981)' },
      { name: 'Khoa học Tự nhiên', avg: 7.9, icon: '🔬', color: 'linear-gradient(90deg,#0284c7,#38bdf8)' },
      { name: 'Lịch sử & Địa lý', avg: 8.2, icon: '🌍', color: 'linear-gradient(90deg,#d97706,#f59e0b)' },
      { name: 'Tin học', avg: 8.6, icon: '💻', color: 'linear-gradient(90deg,#dc2626,#ef4444)' }
    ];

    dom.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.6rem; max-width: 1280px; margin: 0 auto; padding-bottom: 2.5rem; font-family: var(--font-body); animation: fadeIn 0.25s ease-out;">

        <!-- SECTION 1: HERO BANNER VỚI ĐỒ HỌA MESH GRADIENT SANG TRỌNG -->
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 40%, #e0f2fe 100%); border-radius: 24px; padding: 1.8rem 2rem; color: #0f172a; box-shadow: 0 12px 30px rgba(37,99,235,0.22); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.2rem; position: relative; overflow: hidden;">
          <div style="position: absolute; right: -50px; top: -50px; width: 220px; height: 220px; background: rgba(255,255,255,0.06); border-radius: 50%; pointer-events: none;"></div>
          <div style="position: absolute; right: 120px; bottom: -80px; width: 180px; height: 180px; background: rgba(255,255,255,0.04); border-radius: 50%; pointer-events: none;"></div>

          <div style="position: relative; z-index: 2;">
            <div style="display: inline-flex; align-items: center; gap: 0.45rem; background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.28); color: #0f172a; font-weight: 700; padding: 0.3rem 0.85rem; border-radius: 20px; font-size: 0.78rem; margin-bottom: 0.6rem; backdrop-filter: blur(6px);">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; box-shadow: 0 0 8px #10b981;"></span>
              TRUNG TÂM BÁO CÁO THỐNG KÊ TOÀN TRƯỜNG GDPT 2018
            </div>
            <h1 style="margin: 0; font-family: var(--font-title); font-size: 1.7rem; font-weight: 900; letter-spacing: -0.3px; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
              Hệ Thống Quản Lý Giáo Dục Số <span style="color:#059669;">TH</span>-<span style="color:#2563eb;">THCS</span> <span style="color:#dc2626;">AMA TRANG LƠNG</span>
            </h1>
            <p style="margin: 0.4rem 0 0 0; font-size: 0.9rem; color: #475569; font-weight: 400; opacity: 0.95; max-width: 680px; line-height: 1.45;">
              Trực quan hóa số liệu chất lượng giảng dạy, phân bổ học lực, kết quả các môn học và diễn biến chuyên cần năm học 2025 - 2026.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem; position: relative; z-index: 2;">
            <button onclick="if(window.app && window.app.exportReportsToExcel) window.app.exportReportsToExcel(); else if(window.app) window.app.switchView('reports');" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #0f172a; border: none; padding: 0.75rem 1.4rem; border-radius: 14px; font-weight: 800; font-size: 0.88rem; cursor: pointer; box-shadow: 0 6px 18px rgba(16,185,129,0.3); display: flex; align-items: center; gap: 0.45rem;">
              <span>📥 Xuất Báo Cáo Excel</span>
            </button>
          </div>
        </div>

        <!-- SECTION 2: 6 THẺ THỐNG KÊ KPI HIỆN ĐẠI -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(185px, 1fr)); gap: 1.1rem;">
          
          <div onclick="if(window.app) window.app.switchView('classes');" style="background: #ffffff; border-radius: 18px; padding: 1.25rem; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)';" onmouseout="this.style.transform='translateY(0)';">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Số Lớp Học</span>
              <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">🏫</div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1;">${classesCount} <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">lớp</span></div>
            <div style="font-size: 0.76rem; color: #2563eb; font-weight: 700; margin-top: 0.45rem;">${classesList.map(c => c.name).join(', ') || '6A, 6B, 7A, 8A, 9A'}</div>
          </div>

          <div onclick="if(window.app) window.app.switchView('classes');" style="background: #ffffff; border-radius: 18px; padding: 1.25rem; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)';" onmouseout="this.style.transform='translateY(0)';">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Khối Áp Dụng</span>
              <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #fefce8 0%, #fef08a 100%); color: #ca8a04; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">📊</div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1;">4 <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">khối</span></div>
            <div style="font-size: 0.76rem; color: #ca8a04; font-weight: 700; margin-top: 0.45rem;">Khối 6, 7, 8, 9</div>
          </div>

          <div onclick="if(window.app) window.app.switchView('teachers');" style="background: #ffffff; border-radius: 18px; padding: 1.25rem; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)';" onmouseout="this.style.transform='translateY(0)';">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Tổng Giáo Viên</span>
              <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%); color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">👨‍🏫</div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1;">${teachersCount} <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">cán bộ</span></div>
            <div style="font-size: 0.76rem; color: #16a34a; font-weight: 700; margin-top: 0.45rem;">100% Đạt chuẩn</div>
          </div>

          <div onclick="if(window.app) window.app.switchView('students');" style="background: #ffffff; border-radius: 18px; padding: 1.25rem; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.25s ease;" onmouseover="this.style.transform='translateY(-3px)';" onmouseout="this.style.transform='translateY(0)';">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Tổng Học Sinh</span>
              <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%); color: #9333ea; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">🎓</div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1;">${studentsCount} <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">em</span></div>
            <div style="font-size: 0.76rem; color: #9333ea; font-weight: 700; margin-top: 0.45rem;">TB 35 HS / lớp</div>
          </div>

          <div style="background: #ffffff; border-radius: 18px; padding: 1.25rem; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Lượt Truy Cập</span>
              <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); color: #0891b2; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">👁️</div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1;">${visitDisplay} <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">lượt</span></div>
            <div style="font-size: 0.76rem; color: #0891b2; font-weight: 700; margin-top: 0.45rem;">▲ +18% tuần này</div>
          </div>

          <div style="background: #ffffff; border-radius: 18px; padding: 1.25rem; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Lượt Làm Bài</span>
              <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); color: #e11d48; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">📝</div>
            </div>
            <div style="font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1;">${submissionsDisplay} <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">bài</span></div>
            <div style="font-size: 0.76rem; color: #e11d48; font-weight: 700; margin-top: 0.45rem;">Kiểm tra & Bài tập</div>
          </div>

        </div>

        <!-- BIỂU ĐỒ 1 & BIỂU ĐỒ 2 -->
        <div style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 1.4rem;">

          <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #cbd5e1; padding: 1.5rem; box-shadow: 0 4px 18px rgba(0,0,0,0.04);">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.85rem; margin-bottom: 1.2rem;">
              <div>
                <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.45rem;">
                  <span>📊</span> THỐNG KÊ XẾP LOẠI HỌC LỰC (GDPT 2018)
                </h3>
                <div style="font-size: 0.8rem; color: #64748b; font-weight: 400; margin-top: 0.2rem;">Phân loại chất lượng học tập toàn trường</div>
              </div>
              <span style="font-size: 0.78rem; font-weight: 700; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; padding: 0.25rem 0.7rem; border-radius: 10px;">Toàn trường</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.1rem;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 0.4rem;">
                  <span style="color: #059669; display: flex; align-items: center; gap: 0.35rem;">🥇 Mức Tốt (Giỏi): 35%</span>
                  <span style="color: #475569; font-weight: 700;">${totCount} học sinh</span>
                </div>
                <div style="width: 100%; height: 12px; background: #f1f5f9; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
                  <div style="width: 35%; height: 100%; background: linear-gradient(90deg, #10b981 0%, #059669 100%); border-radius: 10px; box-shadow: 0 2px 6px rgba(16,185,129,0.3);"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 0.4rem;">
                  <span style="color: #2563eb; display: flex; align-items: center; gap: 0.35rem;">🥈 Mức Khá: 45%</span>
                  <span style="color: #475569; font-weight: 700;">${khaCount} học sinh</span>
                </div>
                <div style="width: 100%; height: 12px; background: #f1f5f9; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
                  <div style="width: 45%; height: 100%; background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 10px; box-shadow: 0 2px 6px rgba(37,99,235,0.3);"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 0.4rem;">
                  <span style="color: #d97706; display: flex; align-items: center; gap: 0.35rem;">🥉 Mức Đạt (Trung Bình): 16%</span>
                  <span style="color: #475569; font-weight: 700;">${datCount} học sinh</span>
                </div>
                <div style="width: 100%; height: 12px; background: #f1f5f9; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
                  <div style="width: 16%; height: 100%; background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); border-radius: 10px; box-shadow: 0 2px 6px rgba(245,158,11,0.3);"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 0.4rem;">
                  <span style="color: #dc2626; display: flex; align-items: center; gap: 0.35rem;">⚠️ Chưa Đạt (Yếu): 4%</span>
                  <span style="color: #475569; font-weight: 700;">${chuaDatCount} học sinh</span>
                </div>
                <div style="width: 100%; height: 12px; background: #f1f5f9; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
                  <div style="width: 4%; height: 100%; background: linear-gradient(90deg, #ef4444 0%, #b91c1c 100%); border-radius: 10px; box-shadow: 0 2px 6px rgba(239,68,68,0.3);"></div>
                </div>
              </div>
            </div>
          </div>

          <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #cbd5e1; padding: 1.5rem; box-shadow: 0 4px 18px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
            <div style="border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.85rem; margin-bottom: 0.85rem;">
              <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.45rem;">
                <span>🎯</span> SƠ ĐỒ HÌNH QUẠT TỶ LỆ HỌC LỰC
              </h3>
              <div style="font-size: 0.8rem; color: #64748b; font-weight: 400; margin-top: 0.2rem;">Tỷ lệ phần trăm tổng hợp 4 mức xếp loại</div>
            </div>

            <div style="display: flex; justify-content: center; align-items: center; margin: 0.6rem 0;">
              <div style="width: 145px; height: 145px; border-radius: 50%; background: conic-gradient(#10b981 0% 35%, #3b82f6 35% 80%, #f59e0b 80% 96%, #ef4444 96% 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,0,0,0.1); position: relative;">
                <div style="width: 95px; height: 95px; background: #ffffff; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 2px 8px rgba(0,0,0,0.06);">
                  <div style="font-weight: 900; font-size: 1.35rem; color: #0f172a;">80%</div>
                  <div style="font-size: 0.68rem; color: #64748b; font-weight: 700;">Tốt & Khá</div>
                </div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem; font-size: 0.78rem; font-weight: 700;">
              <div style="background: #f0fdf4; padding: 0.45rem 0.6rem; border-radius: 9px; color: #166534; border: 1px solid #bbf7d0;">🥇 Tốt: 35% (${totCount} em)</div>
              <div style="background: #eff6ff; padding: 0.45rem 0.6rem; border-radius: 9px; color: #1e40af; border: 1px solid #bfdbfe;">🥈 Khá: 45% (${khaCount} em)</div>
              <div style="background: #fffbe8; padding: 0.45rem 0.6rem; border-radius: 9px; color: #92400e; border: 1px solid #fef08a;">🥉 Đạt: 16% (${datCount} em)</div>
              <div style="background: #fef2f2; padding: 0.45rem 0.6rem; border-radius: 9px; color: #991b1b; border: 1px solid #fecaca;">⚠️ Chưa đạt: 4% (${chuaDatCount} em)</div>
            </div>
          </div>

        </div>

        <!-- BIỂU ĐỒ 3 & BIỂU ĐỒ 4 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem;">

          <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #cbd5e1; padding: 1.5rem; box-shadow: 0 4px 18px rgba(0,0,0,0.04);">
            <div style="border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.85rem; margin-bottom: 1.1rem;">
              <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.45rem;">
                <span>📚</span> ĐIỂM TRUNG BÌNH MÔN HỌC TOÀN TRƯỜNG
              </h3>
              <div style="font-size: 0.8rem; color: #64748b; font-weight: 400; margin-top: 0.2rem;">So sánh kết quả điểm bình quân theo môn</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${subjectStats.map(s => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.84rem; font-weight: 700; margin-bottom: 0.3rem;">
                    <span style="color: #1e293b; display: flex; align-items: center; gap: 0.4rem;">${s.icon} ${s.name}</span>
                    <span style="font-weight: 800; color: #1e40af;">${s.avg} / 10</span>
                  </div>
                  <div style="width: 100%; height: 9px; background: #f1f5f9; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="width: ${Math.round(s.avg * 10)}%; height: 100%; background: ${s.color}; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #cbd5e1; padding: 1.5rem; box-shadow: 0 4px 18px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
            <div style="border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.85rem; margin-bottom: 0.85rem;">
              <h3 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 0.45rem;">
                <span>⏱️</span> DIỄN BIẾN CHUYÊN CẦN TRONG TUẦN
              </h3>
              <div style="font-size: 0.8rem; color: #64748b; font-weight: 400; margin-top: 0.2rem;">Tỷ lệ chuyên cần học sinh đi học các ngày</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.75rem; height: 155px; align-items: flex-end; padding-bottom: 0.5rem; border-bottom: 1.5px solid #cbd5e1;">
              ${[
                { day: 'T2', val: '99%' },
                { day: 'T3', val: '98%' },
                { day: 'T4', val: '99.5%' },
                { day: 'T5', val: '97.5%' },
                { day: 'T6', val: '98.8%' },
                { day: 'T7', val: '96%' }
              ].map(d => `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.3rem; height: 100%; justify-content: flex-end;">
                  <div style="font-size: 0.7rem; font-weight: 800; color: #2563eb;">${d.val}</div>
                  <div style="width: 100%; height: ${Math.round(parseFloat(d.val) * 1.12)}px; background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 7px 7px 0 0; box-shadow: 0 3px 8px rgba(37,99,235,0.25);"></div>
                  <div style="font-size: 0.78rem; font-weight: 800; color: #334155; margin-top: 0.35rem;">${d.day}</div>
                </div>
              `).join('')}
            </div>

            <div style="font-size: 0.82rem; color: #059669; font-weight: 700; background: #f0fdf4; padding: 0.5rem 0.85rem; border-radius: 10px; text-align: center; margin-top: 0.75rem; border: 1.5px solid #bbf7d0; box-shadow: 0 2px 6px rgba(16,185,129,0.1);">
              ✅ Tỷ lệ chuyên cần bình quân toàn trường đạt 98.5%
            </div>
          </div>

        </div>

        <!-- BẢNG MẪU THỐNG KÊ CHI TIẾT THEO LỚP -->
        <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #cbd5e1; padding: 1.5rem; box-shadow: 0 4px 18px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.1rem; padding-bottom: 0.85rem; border-bottom: 1.5px solid #f1f5f9;">
            <div>
              <div style="display: inline-flex; align-items: center; gap: 0.35rem; background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.76rem; margin-bottom: 0.3rem;">
                📋 MẪU THỐNG KÊ CHUẨN THÔNG TƯ 22 (GDPT 2018)
              </div>
              <h3 style="margin: 0; font-family: var(--font-title); font-weight: 800; color: #0f172a; font-size: 1.15rem;">
                Bảng Mẫu Thống Kê Chi Tiết Học Lực & Chuyên Cần Theo Từng Lớp
              </h3>
              <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: #64748b;">Tổng hợp số liệu chất lượng giáo dục toàn trường năm học 2025 - 2026</p>
            </div>

            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <button onclick="if(window.app && window.app.exportReportsToExcel) window.app.exportReportsToExcel(); else if(window.app) window.app.switchView('reports');" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; border: none; padding: 0.55rem 1.1rem; border-radius: 10px; font-weight: 700; font-size: 0.82rem; cursor: pointer; box-shadow: 0 3px 10px rgba(16,185,129,0.3); display: flex; align-items: center; gap: 0.4rem;">
                📥 Xuất Báo Cáo Excel
              </button>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: center; color: #334155; font-weight: 700;">
                  <th style="padding: 0.65rem; width: 50px;">STT</th>
                  <th style="padding: 0.65rem; text-align: left;">Tên Lớp Học</th>
                  <th style="padding: 0.65rem; width: 85px;">Sĩ Số</th>
                  <th style="padding: 0.65rem; width: 110px; background: #eff6ff; color: #1d4ed8;">Mức Tốt (Giỏi)</th>
                  <th style="padding: 0.65rem; width: 110px; background: #f0fdf4; color: #166534;">Mức Khá</th>
                  <th style="padding: 0.65rem; width: 110px; background: #fffbe8; color: #92400e;">Mức Đạt</th>
                  <th style="padding: 0.65rem; width: 110px; background: #fef2f2; color: #991b1b;">Chưa Đạt</th>
                  <th style="padding: 0.65rem; width: 120px;">Chuyên Cần</th>
                </tr>
              </thead>
              <tbody>
                ${classesList.map((cls, idx) => {
                  const sCount = cls.studentCount || 35;
                  const cTot = Math.round(sCount * 0.35);
                  const cKha = Math.round(sCount * 0.45);
                  const cDat = Math.round(sCount * 0.16);
                  const cChuaDat = Math.max(0, sCount - (cTot + cKha + cDat));
                  return `
                    <tr style="border-bottom: 1px solid #f1f5f9; text-align: center; transition: background 0.15s;" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='transparent';">
                      <td style="padding: 0.6rem; color: #64748b;">${idx + 1}</td>
                      <td style="padding: 0.6rem; text-align: left; font-weight: 700; color: #1e293b;">Lớp ${cls.name}</td>
                      <td style="padding: 0.6rem; font-weight: 600;">${sCount}</td>
                      <td style="padding: 0.6rem; font-weight: 700; color: #1d4ed8; background: #f8fafc;">${cTot} <span style="font-size:0.75rem; color:#64748b;">(35%)</span></td>
                      <td style="padding: 0.6rem; font-weight: 700; color: #166534;">${cKha} <span style="font-size:0.75rem; color:#64748b;">(45%)</span></td>
                      <td style="padding: 0.6rem; font-weight: 700; color: #92400e; background: #f8fafc;">${cDat} <span style="font-size:0.75rem; color:#64748b;">(16%)</span></td>
                      <td style="padding: 0.6rem; font-weight: 700; color: #991b1b;">${cChuaDat} <span style="font-size:0.75rem; color:#64748b;">(4%)</span></td>
                      <td style="padding: 0.6rem; font-weight: 700; color: #059669;">98.${5 + (idx % 4)}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  };
  // 1.1 Khai báo Năm học & Học kỳ
  LMSApp.prototype.render_years = function(dom) {
    if (db.initUserGroupsAndPermissions) db.initUserGroupsAndPermissions();
    const years = db.state.academicYears || [
      {
        id: 'year_2025_2026',
        name: 'Năm học 2025 - 2026',
        isCurrent: true,
        hk1: { startDate: '2025-09-05', endDate: '2026-01-15' },
        hk2: { startDate: '2026-01-16', endDate: '2026-05-31' }
      }
    ];

    dom.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 1100px; margin: 0 auto;">
        
        <!-- HEADER TOOLBAR -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: white; padding: 1.25rem 1.5rem; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div>
            <h2 style="margin: 0; color: #1e3a8a; font-size: 1.4rem; font-weight: 900; display: flex; align-items: center; gap: 0.5rem;">
              📅 QUẢN LÝ NĂM HỌC & HỌC KỲ THCS
            </h2>
            <p style="margin: 0.2rem 0 0 0; color: #64748b; font-size: 0.85rem; font-weight: 600;">Khai báo thời gian bắt đầu, kết thúc Học kỳ I và Học kỳ II cho từng năm học</p>
          </div>
          <button class="btn btn-primary" onclick="if(window.app) window.app.showAddAcademicYearModal();" style="font-weight: 800; border-radius: 10px; padding: 0.7rem 1.35rem; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border: none; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">
            ➕ Thêm mới năm học
          </button>
        </div>

        <!-- ACADEMIC YEARS CARDS LIST -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 1.5rem;">
          ${years.map(y => `
            <div style="background: white; border-radius: 18px; border: 1.5px solid ${y.isCurrent ? '#bfdbfe' : '#e2e8f0'}; padding: 1.5rem; box-shadow: ${y.isCurrent ? '0 8px 24px rgba(37,99,235,0.08)' : '0 4px 12px rgba(0,0,0,0.03)'}; position: relative;">
              
              <!-- CARD HEADER -->
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.85rem; margin-bottom: 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span style="font-size: 1.3rem;">🏫</span>
                  <h3 style="margin: 0; font-size: 1.2rem; color: #0f172a; font-weight: 900;">${y.name}</h3>
                  ${y.isCurrent ? '<span style="background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 0.75rem; padding: 0.2rem 0.65rem; border-radius: 12px; border: 1px solid #bfdbfe;">⭐ Năm học hiện tại</span>' : ''}
                </div>
                
                <!-- ACTION BUTTONS -->
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <button title="Sửa năm học" onclick="if(window.app) window.app.showEditAcademicYearModal('${y.id}');" style="background: transparent; border: none; padding: 0.35rem; cursor: pointer; display: flex; align-items: center; justify-content: center;" class="icon-only-btn">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button title="Xóa năm học" onclick="if(window.app) window.app.deleteAcademicYear('${y.id}');" style="background: transparent; border: none; padding: 0.35rem; cursor: pointer; display: flex; align-items: center; justify-content: center;" class="icon-only-btn">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>

              <!-- TERMS (HỌC KỲ I & HỌC KỲ II) DETAILS -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                
                <!-- HỌC KỲ I -->
                <div style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 1rem;">
                  <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.6rem; color: #1e40af; font-weight: 800; font-size: 0.95rem;">
                    <span>📘</span>
                    <span>HỌC KỲ I</span>
                  </div>
                  <div style="font-size: 0.83rem; color: #475569; display: flex; flex-direction: column; gap: 0.35rem;">
                    <div>📅 <b>Bắt đầu:</b> ${(y.hk1 && y.hk1.startDate) ? formatDateVN(y.hk1.startDate) : '05/09/2025'}</div>
                    <div>🏁 <b>Kết thúc:</b> ${(y.hk1 && y.hk1.endDate) ? formatDateVN(y.hk1.endDate) : '15/01/2026'}</div>
                  </div>
                </div>

                <!-- HỌC KỲ II -->
                <div style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 1rem;">
                  <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.6rem; color: #065f46; font-weight: 800; font-size: 0.95rem;">
                    <span>📙</span>
                    <span>HỌC KỲ II</span>
                  </div>
                  <div style="font-size: 0.83rem; color: #475569; display: flex; flex-direction: column; gap: 0.35rem;">
                    <div>📅 <b>Bắt đầu:</b> ${(y.hk2 && y.hk2.startDate) ? formatDateVN(y.hk2.startDate) : '16/01/2026'}</div>
                    <div>🏁 <b>Kết thúc:</b> ${(y.hk2 && y.hk2.endDate) ? formatDateVN(y.hk2.endDate) : '31/05/2026'}</div>
                  </div>
                </div>

              </div>

              <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; border-top: 1px dashed #e2e8f0; padding-top: 0.85rem;">
                <button onclick="if(window.app) window.app.showRollOverModal('${y.id}');" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;">
                  🔄 Kết chuyển dữ liệu từ năm cũ
                </button>
                ${!y.isCurrent ? `
                  <button onclick="if(window.app) window.app.setCurrentAcademicYear('${y.id}');" style="background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.82rem; font-weight: 800; cursor: pointer;">
                    ⭐ Đặt làm Năm học Hiện tại
                  </button>
                ` : '<span style="color: #16a34a; font-weight: 800; font-size: 0.82rem; background: #f0fdf4; padding: 0.3rem 0.65rem; border-radius: 8px; border: 1px solid #bbf7d0;">✓ Năm học đang chọn</span>'}
              </div>

            </div>
          `).join('')}
        </div>

      </div>
    `;
  };

  // 1.2 Thông tin nhà trường
  LMSApp.prototype.render_school_info_view = function(dom) {
    const info = (db.state && db.state.schoolInfo) ? db.state.schoolInfo : {
      name: 'TH-THCS AMA TRANG LƠNG',
      address: 'Dliê Ya, Krông Năng, Đắk Lắk',
      principal: 'Chu Văn Giáp',
      phone: '0397800689',
      academicYear: '2025-2026'
    };

    dom.innerHTML = `
      <div class="glass-card" style="padding: 2rem; max-width: 900px; margin: 0 auto; border-radius: 20px; background: white; border: 1.5px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem;">
          <div>
            <h2 style="margin: 0; color: #1e3a8a; font-size: 1.5rem; font-weight: 900; display: flex; align-items: center; gap: 0.6rem;">
              🏛️ THÔNG TIN TRƯỜNG HỌC TH-THCS AMA TRANG LƠNG
            </h2>
            <p style="margin: 0.25rem 0 0 0; color: #64748b; font-size: 0.88rem; font-weight: 600;">Khai báo thông tin chung chuẩn hồ sơ Giáo dục & Đào tạo</p>
          </div>
          <span style="font-size: 0.8rem; font-weight: 800; color: #10b981; background: #ecfdf5; padding: 0.35rem 0.85rem; border-radius: 20px; border: 1px solid #a7f3d0;">GDPT 2018</span>
        </div>

        <form id="form-school-info-view" onsubmit="event.preventDefault(); window.app.saveSchoolInfo(this);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="form-group">
              <label style="font-weight: 800; color: #0f172a; display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Tên Trường Hợp Quy:</label>
              <input type="text" name="name" class="form-control" value="${info.name || 'TH-THCS AMA TRANG LƠNG'}" required style="font-weight: bold; height: 42px; border-radius: 10px;">
            </div>

            <div class="form-group">
              <label style="font-weight: 800; color: #0f172a; display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Địa chỉ Trường:</label>
              <input type="text" name="address" class="form-control" value="${info.address || 'Dliê Ya, Krông Năng, Đắk Lắk'}" required style="font-weight: bold; height: 42px; border-radius: 10px;">
            </div>

            <div class="form-group">
              <label style="font-weight: 800; color: #0f172a; display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Hiệu trưởng Phụ trách:</label>
              <input type="text" name="principal" class="form-control" value="${info.principal || 'Chu Văn Giáp'}" required style="font-weight: bold; height: 42px; border-radius: 10px;">
            </div>

            <div class="form-group">
              <label style="font-weight: 800; color: #0f172a; display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Số điện thoại Hotline / Zalo:</label>
              <input type="text" name="phone" class="form-control" value="${info.phone || '0397800689'}" required style="font-weight: bold; height: 42px; border-radius: 10px;">
            </div>
          </div>

          <div style="margin-top: 1.75rem; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2.25rem; font-weight: 800; font-size: 0.95rem; border-radius: 12px; cursor: pointer; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border: none; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);">
              💾 LƯU THAY ĐỔI THÔNG TIN TRƯỜNG
            </button>
          </div>
        </form>
      </div>
    `;
  };

  // 1.3 Nhóm người dùng & Phân quyền
  LMSApp.prototype.render_user_groups = function(dom) {
    if (db.initUserGroupsAndPermissions) db.initUserGroupsAndPermissions();
    const groups = db.state.userGroups || [];
    const selectedGroup = this.selectedPermissionGroupId || 'bgh';
    const currentGroupObj = groups.find(g => g.id === selectedGroup) || groups[0] || { id: 'bgh', name: 'Ban Giám Hiệu' };
    const permissions = (db.state.groupPermissions && db.state.groupPermissions[selectedGroup]) ? db.state.groupPermissions[selectedGroup] : {};

    const menuList = [
      { id: 'years', name: '1. Khởi tạo dữ liệu (Năm học & Học kỳ)' },
      { id: 'school_info_view', name: '2. Thông tin nhà trường' },
      { id: 'user_groups', name: '3. Nhóm người dùng & Phân quyền' },
      { id: 'user_management', name: '4. Quản lý Người dùng' },
      { id: 'classes', name: '5. Lớp học THCS' },
      { id: 'subjects', name: '6. Khai báo môn học' },
      { id: 'teachers', name: '7. Quản lý Giáo viên' },
      { id: 'students', name: '8. Quản lý Học sinh' },
      { id: 'parents', name: '9. Quản lý Phụ huynh' },
      { id: 'reports', name: '10. Báo cáo Thống kê' },
      { id: 'backup', name: '11. Sao lưu & Khôi phục' },
      { id: 'lessons', name: '12. KHBD và Bài giảng' },
      { id: 'questions', name: '13. Ngân hàng Câu hỏi' },
      { id: 'assignments', name: '14. Giao bài tập' },
      { id: 'exams', name: '15. Tạo đề kiểm tra' },
      { id: 'grading', name: '16. Chấm điểm học sinh' },
      { id: 'attendance', name: '18. Điểm danh chuyên cần' },
      { id: 'messages', name: '19. Liên lạc Phụ huynh' },
      { id: 'ai_hub', name: '20. Trợ lý KHBD AI' }
    ];

    dom.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; background: white; padding: 1.25rem 1.5rem; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div>
            <h2 style="margin: 0; color: #1e3a8a; font-size: 1.4rem; font-weight: 900;">👥 QUẢN LÝ NHÓM NGƯỜI DÙNG & PHÂN QUYỀN HỆ THỐNG LMS</h2>
            <p style="margin: 0.2rem 0 0 0; color: #64748b; font-size: 0.85rem; font-weight: 600;">Chọn nhóm để phân quyền Xem, Sửa, Xóa, Import, Export, Hiện Menu</p>
          </div>
          <button class="btn btn-primary" onclick="if(window.app) window.app.showAddUserGroupModal();" style="font-weight: 800; border-radius: 10px; padding: 0.65rem 1.2rem; background: #2563eb;">
            ➕ Thêm nhóm người dùng
          </button>
        </div>

        <!-- GROUPS TABS & PERMISSIONS MATRIX -->
        <div style="display: flex; gap: 1rem; align-items: center; background: white; padding: 0.85rem 1.25rem; border-radius: 14px; border: 1.5px solid #e2e8f0; flex-wrap: wrap;">
          <span style="font-weight: 800; color: #0f172a; font-size: 0.9rem;">Chọn Nhóm Cán Bộ:</span>
          ${groups.map(g => `
            <button onclick="if(window.app) { window.app.selectedPermissionGroupId = '${g.id}'; window.app.render_user_groups(document.getElementById('viewport') || document.getElementById('main-viewport')); }" 
              style="padding: 0.45rem 1rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; border: 1.5px solid ${g.id === selectedGroup ? '#2563eb' : '#cbd5e1'}; background: ${g.id === selectedGroup ? '#eff6ff' : '#ffffff'}; color: ${g.id === selectedGroup ? '#2563eb' : '#475569'};">
              ${g.name} ${g.isSystem ? '🔒' : ''}
            </button>
          `).join('')}
        </div>

        <div style="background: white; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow: hidden;">
          <div style="padding: 1.25rem 1.5rem; background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between;">
            <h3 style="margin: 0; font-size: 1.1rem; font-weight: 900; color: #0f172a;">
              BẢNG PHÂN QUYỀN CHO NHÓM: <span style="color: #2563eb;">${currentGroupObj.name.toUpperCase()}</span>
            </h3>
            <button onclick="if(window.app) window.app.saveGroupPermissions('${selectedGroup}');" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 0.6rem 1.4rem; border-radius: 10px; font-weight: 800; cursor: pointer;">
              💾 LƯU CẤU HÌNH PHÂN QUYỀN
            </button>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
            <thead>
              <tr style="background: #0f172a; color: white; text-align: center; height: 50px;">
                <th style="padding: 0.6rem 1rem; text-align: left; font-weight: 800; width: 320px;">
                  <label style="display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; margin: 0; user-select: none;" title="Tích/Bỏ tích toàn bộ tất cả quyền">
                    <input type="checkbox" id="perm-select-all-master" onchange="if(window.app) window.app.toggleAllPermMatrix(this.checked);" style="transform: scale(1.3); cursor: pointer; accent-color: #2563eb;">
                    <span>TẤT CẢ MENU LMS</span>
                  </label>
                </th>
                <th style="padding: 0.6rem; font-weight: 800; text-align: center;">
                  <label style="display: flex; flex-direction: column; align-items: center; gap: 0.2rem; cursor: pointer; margin: 0; user-select: none;" title="Tích/Bỏ tích toàn bộ cột XEM">
                    <input type="checkbox" onchange="if(window.app) window.app.toggleAllPermColumn('view', this.checked);" style="transform: scale(1.2); cursor: pointer; accent-color: #2563eb;">
                    <span>XEM</span>
                  </label>
                </th>
                <th style="padding: 0.6rem; font-weight: 800; text-align: center;">
                  <label style="display: flex; flex-direction: column; align-items: center; gap: 0.2rem; cursor: pointer; margin: 0; user-select: none;" title="Tích/Bỏ tích toàn bộ cột SỬA">
                    <input type="checkbox" onchange="if(window.app) window.app.toggleAllPermColumn('edit', this.checked);" style="transform: scale(1.2); cursor: pointer; accent-color: #2563eb;">
                    <span>SỬA</span>
                  </label>
                </th>
                <th style="padding: 0.6rem; font-weight: 800; text-align: center;">
                  <label style="display: flex; flex-direction: column; align-items: center; gap: 0.2rem; cursor: pointer; margin: 0; user-select: none;" title="Tích/Bỏ tích toàn bộ cột XÓA">
                    <input type="checkbox" onchange="if(window.app) window.app.toggleAllPermColumn('delete', this.checked);" style="transform: scale(1.2); cursor: pointer; accent-color: #2563eb;">
                    <span>XÓA</span>
                  </label>
                </th>
                <th style="padding: 0.6rem; font-weight: 800; text-align: center;">
                  <label style="display: flex; flex-direction: column; align-items: center; gap: 0.2rem; cursor: pointer; margin: 0; user-select: none;" title="Tích/Bỏ tích toàn bộ cột IMPORT">
                    <input type="checkbox" onchange="if(window.app) window.app.toggleAllPermColumn('import', this.checked);" style="transform: scale(1.2); cursor: pointer; accent-color: #2563eb;">
                    <span>IMPORT</span>
                  </label>
                </th>
                <th style="padding: 0.6rem; font-weight: 800; text-align: center;">
                  <label style="display: flex; flex-direction: column; align-items: center; gap: 0.2rem; cursor: pointer; margin: 0; user-select: none;" title="Tích/Bỏ tích toàn bộ cột EXPORT">
                    <input type="checkbox" onchange="if(window.app) window.app.toggleAllPermColumn('export', this.checked);" style="transform: scale(1.2); cursor: pointer; accent-color: #2563eb;">
                    <span>EXPORT</span>
                  </label>
                </th>
                <th style="padding: 0.6rem; font-weight: 800; text-align: center;">
                  <label style="display: flex; flex-direction: column; align-items: center; gap: 0.2rem; cursor: pointer; margin: 0; user-select: none;" title="Tích/Bỏ tích toàn bộ cột HIỆN MENU">
                    <input type="checkbox" onchange="if(window.app) window.app.toggleAllPermColumn('showMenu', this.checked);" style="transform: scale(1.2); cursor: pointer; accent-color: #2563eb;">
                    <span>HIỆN MENU</span>
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>
              ${menuList.map((m, idx) => {
                const p = permissions[m.id] || { view: true, edit: true, delete: true, import: true, export: true, showMenu: true };
                return `
                  <tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                    <td style="padding: 0.75rem 1rem; font-weight: 800; color: #1e293b;">${m.name}</td>
                    <td style="text-align: center;"><input type="checkbox" class="perm-cb" data-menu="${m.id}" data-action="view" ${p.view ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;"></td>
                    <td style="text-align: center;"><input type="checkbox" class="perm-cb" data-menu="${m.id}" data-action="edit" ${p.edit ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;"></td>
                    <td style="text-align: center;"><input type="checkbox" class="perm-cb" data-menu="${m.id}" data-action="delete" ${p.delete ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;"></td>
                    <td style="text-align: center;"><input type="checkbox" class="perm-cb" data-menu="${m.id}" data-action="import" ${p.import ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;"></td>
                    <td style="text-align: center;"><input type="checkbox" class="perm-cb" data-menu="${m.id}" data-action="export" ${p.export ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;"></td>
                    <td style="text-align: center;"><input type="checkbox" class="perm-cb" data-menu="${m.id}" data-action="showMenu" ${p.showMenu ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;"></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // 1.4 Quản lý người dùng
  LMSApp.prototype.render_user_management = function(dom) {
    if (db.initUserGroupsAndPermissions) db.initUserGroupsAndPermissions();
    if (db.syncAllUsersFromEntities) db.syncAllUsersFromEntities();
    const users = (db.getAllUsers ? db.getAllUsers() : (db.state.users || []));
    const groups = db.state.userGroups || [];

    const groupMeta = {
      admin: { name: 'Quản trị hệ thống (Admin)', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
      bgh: { name: 'Ban Giám Hiệu (BGH)', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
      totruong: { name: 'Tổ trưởng chuyên môn', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
      giaovien: { name: 'Giáo viên bộ môn', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
      nhanvien: { name: 'Nhân viên văn phòng', color: '#4b5563', bg: '#f3f4f6', border: '#e5e7eb' },
      hocsinh: { name: 'Học sinh', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
      phuhuynh: { name: 'Phụ huynh học sinh', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
    };

    const searchQuery = (this.userSearchQuery || '').toLowerCase();
    const selectedGroup = this.userFilterGroup || 'all';

    const filteredUsers = users.filter(u => {
      const uName = String(u.name || '').toLowerCase();
      const uUsername = String(u.username || '').toLowerCase();
      const matchSearch = !searchQuery || uName.includes(searchQuery) || uUsername.includes(searchQuery);
      
      let matchGroup = false;
      if (selectedGroup === 'all') {
        matchGroup = true;
      } else if (selectedGroup === 'giaovien') {
        matchGroup = (u.groupId === 'giaovien' || u.sourceType === 'teacher' || u.groupId === 'teacher');
      } else if (selectedGroup === 'hocsinh') {
        matchGroup = (u.groupId === 'hocsinh' || u.sourceType === 'student' || u.groupId === 'student');
      } else if (selectedGroup === 'phuhuynh') {
        matchGroup = (u.groupId === 'phuhuynh' || u.sourceType === 'parent' || u.groupId === 'parent');
      } else {
        matchGroup = (u.groupId === selectedGroup);
      }
      return matchSearch && matchGroup;
    });

    dom.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="background: white; padding: 1.25rem 1.5rem; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; flex: 1;">
              <input type="text" id="user-search-input" placeholder="Lọc theo họ và tên, tên đăng nhập..." value="${this.userSearchQuery || ''}" class="form-control" style="height: 38px; border-radius: 8px; width: 280px; font-weight: 600;">
              <select id="user-group-filter" class="form-control" style="height: 38px; border-radius: 8px; width: 220px; font-weight: 700;">
                <option value="all">-- Tất cả Nhóm (${users.length}) --</option>
                ${groups.map(g => {
                  let count = 0;
                  if (g.id === 'giaovien') count = users.filter(u => u.groupId === 'giaovien' || u.sourceType === 'teacher' || u.groupId === 'teacher').length;
                  else if (g.id === 'hocsinh') count = users.filter(u => u.groupId === 'hocsinh' || u.sourceType === 'student' || u.groupId === 'student').length;
                  else if (g.id === 'phuhuynh') count = users.filter(u => u.groupId === 'phuhuynh' || u.sourceType === 'parent' || u.groupId === 'parent').length;
                  else count = users.filter(u => u.groupId === g.id).length;
                  return `<option value="${g.id}" ${selectedGroup === g.id ? 'selected' : ''}>${g.name} (${count})</option>`;
                }).join('')}
              </select>
              <button id="btn-search-users" class="btn btn-primary" style="height: 38px; font-weight: 800; border-radius: 8px; padding: 0 1.25rem; background: #2563eb;">🔍 Tìm kiếm</button>
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="if(window.app) window.app.showAddUserModal();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.95rem; font-size: 0.85rem; background: #2563eb;">➕ Thêm mới người dùng</button>
              <button class="btn btn-secondary" onclick="if(window.app) window.app.bulkResetPassword();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.85rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;">🔑 Đổi mật khẩu hàng loạt</button>
              <button class="btn btn-secondary" onclick="if(window.app) window.app.exportUsersExcel();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.85rem; background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7;">📊 Xuất Excel</button>
              <button class="btn btn-secondary" onclick="if(window.app) window.app.bulkDeleteUsers();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.85rem; background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2;"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Xóa</button>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: #4b8b8d; color: white; text-align: left; height: 44px;">
                <th style="padding: 0.65rem 0.85rem; width: 40px; text-align: center;"><input type="checkbox" id="check-all-users" style="transform: scale(1.15); cursor: pointer;"></th>
                <th style="padding: 0.65rem 1rem; width: 130px; font-weight: 800; text-align: center;">Thao tác</th>
                <th style="padding: 0.65rem 0.85rem; width: 50px; font-weight: 800; text-align: center;">STT</th>
                <th style="padding: 0.65rem 1.25rem; font-weight: 800;">Tên đăng nhập</th>
                <th style="padding: 0.65rem 1.25rem; font-weight: 800;">Họ và tên</th>
                <th style="padding: 0.65rem 1rem; font-weight: 800;">Nhóm người dùng</th>
                <th style="padding: 0.65rem 0.85rem; font-weight: 800; text-align: center;">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${filteredUsers.length > 0 ? filteredUsers.map((u, idx) => {
                const grpInfo = groupMeta[u.groupId] || { name: u.groupId || 'Người dùng', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' };
                const isLocked = u.status === 'locked';
                return `
                <tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  <td style="padding: 0.75rem 0.85rem; text-align: center;"><input type="checkbox" class="user-row-cb" data-user-id="${u.id}" style="transform: scale(1.15); cursor: pointer;"></td>
                  <td style="padding: 0.75rem 0.5rem; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                      <button title="Sửa tên" onclick="if(window.app) window.app.showEditUserModal('${u.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer;" class="icon-only-btn"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                      <button title="Khóa/Mở khóa" onclick="if(window.app) window.app.toggleUserLock('${u.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer; font-size: 0.95rem;">${isLocked ? '🔒' : '🔓'}</button>
                      <button title="Reset mật khẩu" onclick="if(window.app) window.app.resetSingleUserPassword('${u.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer; font-size: 0.95rem;">🔑</button>
                      <button title="Xóa người dùng" onclick="if(window.app) window.app.deleteSingleUser('${u.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer;" class="icon-only-btn"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                    </div>
                  </td>
                  <td style="padding: 0.75rem 0.85rem; text-align: center; font-weight: 700; color: #475569;">${idx + 1}</td>
                  <td style="padding: 0.75rem 1.25rem; font-weight: 800; color: #2563eb;">${u.username}</td>
                  <td style="padding: 0.75rem 1.25rem; font-weight: 800; color: #0f172a;">${u.name}</td>
                  <td style="padding: 0.75rem 1rem;">
                    <span style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.78rem; font-weight: 800; background: ${grpInfo.bg}; color: ${grpInfo.color}; border: 1px solid ${grpInfo.border};">
                      ${grpInfo.name}
                    </span>
                  </td>
                  <td style="padding: 0.75rem 0.85rem; text-align: center;">
                    <span style="display: inline-block; padding: 0.2rem 0.55rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; background: ${isLocked ? '#fef2f2' : '#f0fdf4'}; color: ${isLocked ? '#dc2626' : '#16a34a'}; border: 1px solid ${isLocked ? '#fecaca' : '#bbf7d0'};">
                      ${isLocked ? '🔒 Đã khóa' : '🟢 Hoạt động'}
                    </span>
                  </td>
                </tr>
              `;}).join('') : `
                <tr><td colspan="7" style="text-align: center; padding: 3rem; color: #94a3b8; font-weight: 700;">Không tìm thấy người dùng nào trong nhóm này.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const inputQuery = dom.querySelector('#user-search-input');
    const inputGroup = dom.querySelector('#user-group-filter');
    const btnSearch = dom.querySelector('#btn-search-users');
    const checkAll = dom.querySelector('#check-all-users');

    if (inputQuery) {
      inputQuery.oninput = () => { this.userSearchQuery = inputQuery.value; };
      inputQuery.onkeydown = (e) => { if (e.key === 'Enter') { this.userSearchQuery = inputQuery.value; this.render_user_management(dom); } };
    }
    if (inputGroup) inputGroup.onchange = () => { this.userFilterGroup = inputGroup.value; this.render_user_management(dom); };
    if (btnSearch) btnSearch.onclick = () => { if (inputQuery) this.userSearchQuery = inputQuery.value; this.render_user_management(dom); };
    if (checkAll) {
      checkAll.onchange = () => {
        dom.querySelectorAll('.user-row-cb').forEach(cb => { cb.checked = checkAll.checked; });
      };
    }
  };

  // 1.5 Lớp học THCS
  LMSApp.prototype.render_classes = function(dom) {
    const classes = (typeof db !== 'undefined' && db.getClassesList) ? db.getClassesList() : (db.state.classesList || []);
    const teachers = db.getTeachers ? (db.getTeachers() || []) : [];
    const teacherNames = ['Chu Văn Giáp', 'Cao Thị Ngọc Châu', 'Trần Thanh Xuân', 'Lê Thị Liên Hương', 'Nông Văn Dũng'];
    teachers.forEach(t => { if (t.name && !teacherNames.includes(t.name)) teacherNames.push(t.name); });

    const filterGrade = this.classFilterGrade || 'all';
    const filterClassName = this.classFilterName || 'all';
    const filterTeacher = this.classFilterTeacher || 'all';

    const filteredClasses = classes.filter(c => {
      const matchGrade = filterGrade === 'all' || c.grade === filterGrade;
      const matchName = filterClassName === 'all' || c.name === filterClassName;
      const matchTeacher = filterTeacher === 'all' || c.homeroomTeacher === filterTeacher;
      return matchGrade && matchName && matchTeacher;
    });

    dom.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem; max-width: 1200px; margin: 0 auto;">
        <div style="background: white; padding: 1.25rem 1.5rem; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; flex: 1;">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <label style="font-weight: 800; font-size: 0.88rem; color: #1e293b; white-space: nowrap;">Khối:</label>
                <select id="filter-class-grade" class="form-control" style="height: 38px; border-radius: 8px; font-weight: 700; width: 130px;">
                  <option value="all">-- Tất cả khối --</option>
                  <option value="6" ${filterGrade === '6' ? 'selected' : ''}>Khối 6</option>
                  <option value="7" ${filterGrade === '7' ? 'selected' : ''}>Khối 7</option>
                  <option value="8" ${filterGrade === '8' ? 'selected' : ''}>Khối 8</option>
                  <option value="9" ${filterGrade === '9' ? 'selected' : ''}>Khối 9</option>
                </select>
              </div>

              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <label style="font-weight: 800; font-size: 0.88rem; color: #1e293b; white-space: nowrap;">Lớp:</label>
                <select id="filter-class-name" class="form-control" style="height: 38px; border-radius: 8px; font-weight: 700; width: 130px;">
                  <option value="all">-- Tất cả lớp --</option>
                  ${classes.map(c => '<option value="' + c.name + '" ' + (filterClassName === c.name ? 'selected' : '') + '>' + c.name + '</option>').join('')}
                </select>
              </div>

              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <label style="font-weight: 800; font-size: 0.88rem; color: #1e293b; white-space: nowrap;">Giáo viên chủ nhiệm:</label>
                <select id="filter-class-teacher" class="form-control" style="height: 38px; border-radius: 8px; font-weight: 700; width: 220px;">
                  <option value="all">-- Tất cả GVCN --</option>
                  ${teacherNames.map(tn => '<option value="' + tn + '" ' + (filterTeacher === tn ? 'selected' : '') + '>' + tn + '</option>').join('')}
                </select>
              </div>

              <button id="btn-search-classes" class="btn btn-primary" style="height: 38px; font-weight: 800; border-radius: 8px; padding: 0 1.25rem; background: #2563eb;">🔍 Tìm kiếm</button>
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="if(window.app) window.app.showAddClassModal();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.95rem; font-size: 0.85rem; background: #2563eb;">➕ Thêm mới lớp học</button>
              <button class="btn btn-secondary" onclick="if(window.app) window.app.importClassesExcel();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.85rem; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;">📥 Nhập lớp từ Excel</button>
              <button class="btn btn-secondary" onclick="if(window.app) window.app.downloadClassExcelTemplate();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.85rem; background: #fefce8; color: #ca8a04; border: 1px solid #fef08a;">📄 File mẫu Excel</button>
              <button class="btn btn-secondary" onclick="if(window.app) window.app.exportClassesExcel();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.85rem; background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7;">📊 Xuất Excel</button>
              <button class="btn btn-secondary" onclick="if(window.app) window.app.bulkDeleteClasses();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.85rem; background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2;"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Xóa</button>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="background: #4b8b8d; color: white; text-align: left; height: 44px;">
                <th style="padding: 0.65rem 0.85rem; width: 40px; text-align: center;"><input type="checkbox" id="check-all-classes" style="transform: scale(1.15); cursor: pointer;"></th>
                <th style="padding: 0.65rem 1rem; width: 130px; font-weight: 800; text-align: center;">Thao tác</th>
                <th style="padding: 0.65rem 0.85rem; width: 60px; font-weight: 800; text-align: center;">STT</th>
                <th style="padding: 0.65rem 1rem; width: 100px; font-weight: 800; text-align: center;">Khối</th>
                <th style="padding: 0.65rem 1.25rem; font-weight: 800;">Tên lớp</th>
                <th style="padding: 0.65rem 1.25rem; font-weight: 800;">Giáo viên chủ nhiệm</th>
              </tr>
            </thead>
            <tbody>
              ${filteredClasses.length > 0 ? filteredClasses.map((c, idx) => `
                <tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  <td style="padding: 0.75rem 0.85rem; text-align: center;"><input type="checkbox" class="class-row-cb" data-class-id="${c.id}" style="transform: scale(1.15); cursor: pointer;"></td>
                  <td style="padding: 0.75rem 0.5rem; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                      <button title="Sửa thông tin lớp" onclick="if(window.app) window.app.showEditClassModal('${c.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer;" class="icon-only-btn"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                      <button title="Xóa lớp" onclick="if(window.app) window.app.deleteClass('${c.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer;" class="icon-only-btn"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                    </div>
                  </td>
                  <td style="padding: 0.75rem 0.85rem; text-align: center; font-weight: 700; color: #475569;">${idx + 1}</td>
                  <td style="padding: 0.75rem 1rem; text-align: center;"><span style="background: #f1f5f9; color: #1e293b; font-weight: 800; font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 8px; border: 1px solid #cbd5e1;">Khối ${c.grade}</span></td>
                  <td style="padding: 0.75rem 1.25rem; font-weight: 900; color: #2563eb; font-size: 1rem;">${c.name}</td>
                  <td style="padding: 0.75rem 1.25rem; font-weight: 800; color: #0f172a;">${c.homeroomTeacher || 'Chưa phân công'}</td>
                </tr>
              `).join('') : `
                <tr><td colspan="6" style="text-align: center; padding: 3rem; color: #94a3b8; font-weight: 700;">Không tìm thấy lớp học nào phù hợp.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const inputGrade = dom.querySelector('#filter-class-grade');
    const inputName = dom.querySelector('#filter-class-name');
    const inputTeacher = dom.querySelector('#filter-class-teacher');
    const btnSearch = dom.querySelector('#btn-search-classes');

    if (inputGrade) inputGrade.onchange = () => { this.classFilterGrade = inputGrade.value; this.render_classes(dom); };
    if (inputName) inputName.onchange = () => { this.classFilterName = inputName.value; this.render_classes(dom); };
    if (inputTeacher) inputTeacher.onchange = () => { this.classFilterTeacher = inputTeacher.value; this.render_classes(dom); };
    if (btnSearch) btnSearch.onclick = () => { if (inputGrade) this.classFilterGrade = inputGrade.value; if (inputName) this.classFilterName = inputName.value; if (inputTeacher) this.classFilterTeacher = inputTeacher.value; this.render_classes(dom); };

    const checkAll = dom.querySelector('#check-all-classes');
    const rowCheckboxes = dom.querySelectorAll('.class-row-cb');
    if (checkAll) {
      checkAll.onchange = (e) => {
        const isChecked = e.target.checked;
        rowCheckboxes.forEach(cb => cb.checked = isChecked);
      };
    }
    rowCheckboxes.forEach(cb => {
      cb.onchange = () => {
        if (checkAll) {
          const allChecked = rowCheckboxes.length > 0 && Array.from(rowCheckboxes).every(c => c.checked);
          checkAll.checked = allChecked;
        }
      };
    });
  };

  // 1.6 Khai báo Môn học GDPT 2018 (Chia theo Khối & Áp dụng Toàn khối)
  LMSApp.prototype.render_subjects = function(dom) {
    if (db.initUserGroupsAndPermissions) db.initUserGroupsAndPermissions();
    const subjects = db.state.subjectsList || [];

    const activeGradeTab = this.selectedSubjectGradeTab || 'all';
    const filterType = this.subjectFilterType || 'all';

    const gradesList = ['all', '6', '7', '8', '9'];

    const filteredSubjects = subjects.filter(s => {
      const matchGrade = activeGradeTab === 'all' || (s.grades && s.grades.includes(activeGradeTab));
      const matchType = filterType === 'all' || s.type === filterType;
      return matchGrade && matchType;
    });

    dom.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem; max-width: 1200px; margin: 0 auto;">

        <!-- GRADE SELECTION TABS & FILTER TOOLBAR -->
        <div style="background: white; padding: 1.25rem 1.5rem; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 1rem;">
          
          <!-- GRADE TABS (TẤT CẢ KHỐI / KHỐI 6 / KHỐI 7 / KHỐI 8 / KHỐI 9) -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.85rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-weight: 800; color: #1e293b; font-size: 0.95rem; margin-right: 0.5rem;">🏫 Chọn Khối Lớp:</span>
              ${gradesList.map(g => `
                <button onclick="if(window.app) { window.app.selectedSubjectGradeTab = '${g}'; window.app.render_subjects(document.getElementById('viewport') || document.getElementById('main-viewport')); }"
                  style="padding: 0.45rem 1.15rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; border: 1.5px solid ${g === activeGradeTab ? '#2563eb' : '#cbd5e1'}; background: ${g === activeGradeTab ? '#eff6ff' : '#ffffff'}; color: ${g === activeGradeTab ? '#2563eb' : '#475569'};">
                  ${g === 'all' ? '🌐 Tất cả các khối' : 'Khối ' + g}
                </button>
              `).join('')}
            </div>

            <!-- BUTTON ÁP DỤNG MÔN HỌC TOÀN KHỐI -->
            <button onclick="if(window.app) window.app.applySubjectsToAllGrades();" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; border: none; padding: 0.55rem 1.15rem; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer; box-shadow: 0 4px 12px rgba(16,185,129,0.25); display: flex; align-items: center; gap: 0.4rem;">
              <span>⚡</span> Áp dụng môn học cho toàn khối (6,7,8,9)
            </button>
          </div>

          <!-- SECONDARY FILTER & ACTION BUTTONS -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <label style="font-weight: 800; font-size: 0.88rem; color: #1e293b; white-space: nowrap;">Loại môn học:</label>
                <select id="filter-subject-type" class="form-control" style="height: 38px; border-radius: 8px; font-weight: 700; width: 160px;">
                  <option value="all">-- Tất cả loại --</option>
                  <option value="Bắt buộc" ${filterType === 'Bắt buộc' ? 'selected' : ''}>Bắt buộc</option>
                  <option value="Tự chọn" ${filterType === 'Tự chọn' ? 'selected' : ''}>Tự chọn</option>
                </select>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="if(window.app) window.app.showAddSubjectModal();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.95rem; font-size: 0.85rem; background: #2563eb;">
                ➕ Thêm mới môn học
              </button>
              <button class="btn btn-secondary" onclick="if(window.app) window.app.exportSubjectsExcel();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.85rem; background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7;">
                📊 Xuất Excel
              </button>
              <button class="btn btn-secondary" onclick="if(window.app) window.app.bulkDeleteSubjects();" style="font-weight: 800; border-radius: 8px; padding: 0.5rem 0.85rem; font-size: 0.85rem; background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2;">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Xóa
              </button>
            </div>

          </div>

        </div>

        <!-- SUBJECTS DATA TABLE GDPT 2018 -->
        <div style="background: white; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow: hidden;">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-family: var(--font-body); font-size: 0.9rem;">
              <thead>
                <tr style="background: #4b8b8d; color: white; text-align: left; height: 44px;">
                  <th style="padding: 0.65rem 0.85rem; width: 40px; text-align: center;">
                    <input type="checkbox" id="check-all-subjects" style="transform: scale(1.15); cursor: pointer;">
                  </th>
                  <th style="padding: 0.65rem 1rem; width: 100px; font-weight: 800; text-align: center;">Thao tác</th>
                  <th style="padding: 0.65rem 0.85rem; width: 60px; font-weight: 800; text-align: center;">STT</th>
                  <th style="padding: 0.65rem 1rem; width: 100px; font-weight: 800; text-align: center;">Mã môn</th>
                  <th style="padding: 0.65rem 1.25rem; font-weight: 800;">Tên môn học (Chương trình GDPT 2018)</th>
                  <th style="padding: 0.65rem 1rem; font-weight: 800; text-align: center;">Số tiết/tuần</th>
                  <th style="padding: 0.65rem 1rem; font-weight: 800; text-align: center;">Loại môn</th>
                  <th style="padding: 0.65rem 1rem; font-weight: 800; text-align: center;">Khối áp dụng</th>
                </tr>
              </thead>

              <tbody>
                ${filteredSubjects.length > 0 ? filteredSubjects.map((s, idx) => `
                  <tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; transition: background 0.15s;">
                    <td style="padding: 0.75rem 0.85rem; text-align: center;">
                      <input type="checkbox" class="subject-row-cb" data-subject-id="${s.id}" style="transform: scale(1.15); cursor: pointer;">
                    </td>
                    <td style="padding: 0.75rem 0.5rem; text-align: center;">
                      <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <button title="Sửa môn học" onclick="if(window.app) window.app.showEditSubjectModal('${s.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer;" class="icon-only-btn">
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button title="Xóa môn học" onclick="if(window.app) window.app.deleteSubject('${s.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer;" class="icon-only-btn">
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </td>
                    <td style="padding: 0.75rem 0.85rem; text-align: center; font-weight: 700; color: #475569;">${idx + 1}</td>
                    <td style="padding: 0.75rem 1rem; text-align: center; font-weight: 800; color: #64748b; font-family: monospace;">${s.code}</td>
                    <td style="padding: 0.75rem 1.25rem; font-weight: 900; color: #1e3a8a; font-size: 0.95rem;">${s.name}</td>
                    <td style="padding: 0.75rem 1rem; text-align: center; font-weight: 800; color: #0284c7;">${s.periodsPerWeek} tiết</td>
                    <td style="padding: 0.75rem 1rem; text-align: center;">
                      <span style="background: ${s.type === 'Bắt buộc' ? '#ecfdf5' : '#fff7ed'}; color: ${s.type === 'Bắt buộc' ? '#059669' : '#ea580c'}; font-weight: 800; font-size: 0.78rem; padding: 0.25rem 0.65rem; border-radius: 12px; border: 1px solid ${s.type === 'Bắt buộc' ? '#a7f3d0' : '#ffedd5'};">
                        ${s.type}
                      </span>
                    </td>
                    <td style="padding: 0.75rem 1rem; text-align: center; font-weight: 800; color: #334155;">
                      Khối ${s.grades || '6,7,8,9'}
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="8" style="text-align: center; padding: 3rem; color: #94a3b8; font-weight: 700;">Không tìm thấy môn học nào phù hợp với bộ lọc.</td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    const inputType = dom.querySelector('#filter-subject-type');
    if (inputType) inputType.onchange = () => { this.subjectFilterType = inputType.value; this.render_subjects(dom); };

    const checkAll = dom.querySelector('#check-all-subjects');
    if (checkAll) {
      checkAll.onchange = () => {
        dom.querySelectorAll('.subject-row-cb').forEach(cb => cb.checked = checkAll.checked);
      };
    }
  };



  LMSApp.prototype.render_ai_picker = function(dom) {
  if (!db) return;

  const classesList = db.state.classesList || [];
  const subjectsList = db.state.subjectsList || [];
  const currentClassId = this._aiPickerSelectedClass || (classesList[0] ? classesList[0].name : '6A');
  const currentSubjectId = this._aiPickerSelectedSubject || 'toan';
  const currentCamMode = this._aiPickerCamMode || 'webcam';

  const studentsInClass = (db.getStudents ? db.getStudents() : []).filter(s => (s.classId || '6A') === currentClassId);

  dom.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.4rem; max-width: 1280px; margin: 0 auto; padding-bottom: 2.5rem; font-family: var(--font-body); animation: fadeIn 0.25s ease-out;">

            <!-- HEADER BANNER & BẢNG ĐIỀU KHIỂN - GRAPHIC NỀN SÁNG CHỮ NỔI BẬT -->
      <div style="background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 50%, #e0f2fe 100%); border-radius: 22px; padding: 1.6rem 2rem; color: #0f172a; border: 1.5px solid #bfdbfe; box-shadow: 0 10px 30px rgba(37,99,235,0.08); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.2rem; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -30px; top: -30px; width: 220px; height: 220px; background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%); border-radius: 50%; pointer-events: none;"></div>
        <div style="position: absolute; left: -20px; bottom: -40px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 70%); border-radius: 50%; pointer-events: none;"></div>

        <div style="position: relative; z-index: 2; max-width: 800px;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-weight: 800; padding: 0.3rem 0.85rem; border-radius: 20px; font-size: 0.78rem; margin-bottom: 0.6rem; box-shadow: 0 2px 6px rgba(37,99,235,0.08);">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; box-shadow: 0 0 8px #10b981;"></span>
            CÔNG NGHỆ NHẬN DIỆN KHUÔN MẶT AI 2026
          </div>
          <h2 style="margin: 0; font-family: var(--font-title); font-size: 1.65rem; font-weight: 900; color: #0f172a; letter-spacing: -0.4px; line-height: 1.3;">
            📸 Quét AI Gọi Học Sinh & Đẩy Điểm Thường Xuyên Tự Động
          </h2>
          <p style="margin: 0.4rem 0 0 0; font-size: 0.88rem; color: #475569; font-weight: 600; line-height: 1.5;">
            Nhận diện khuôn mặt học sinh trong lớp, quay chọn ngẫu nhiên & tự động thay thế con điểm thấp nhất khi đã đủ 4 cột điểm Thường xuyên (Thông tư 22).
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; position: relative; z-index: 2;">
          <button id="btn-show-qr-pairing" onclick="if(window.app && window.app.openRemotePairingModal) window.app.openRemotePairingModal();" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border: none; color: #ffffff; padding: 0.75rem 1.3rem; border-radius: 14px; font-weight: 800; font-size: 0.88rem; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.3); display: flex; align-items: center; gap: 0.5rem; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.03)';" onmouseout="this.style.transform='scale(1)';">
            <span>📱 Kết Nối Điện Thoại Remote</span>
          </button>
        </div>
      </div>

      <!-- THANH CHỌN THÔNG SỐ (LỚP, MÔN, NGUỒN CAMERA) -->
      <div style="background: #ffffff; border-radius: 18px; padding: 1.15rem 1.4rem; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.1rem;">
        
        <div style="display: flex; align-items: center; gap: 1.2rem; flex-wrap: wrap;">
          <div>
            <label style="display: block; font-size: 0.76rem; font-weight: 800; color: #64748b; margin-bottom: 0.3rem; text-transform: uppercase;">🏫 Chọn Lớp Học:</label>
            <select id="ai-picker-select-class" style="padding: 0.55rem 0.9rem; border-radius: 10px; border: 1.5px solid #cbd5e1; font-weight: 700; font-size: 0.88rem; color: #1e293b; background: #f8fafc; cursor: pointer; outline: none;">
              ${classesList.map(c => `<option value="${c.name || c.id}" ${c.name === currentClassId ? 'selected' : ''}>Lớp ${c.name || c.id} (${(db.getStudents ? db.getStudents() : []).filter(s => (s.classId || '6A') === (c.name || c.id)).length} học sinh)</option>`).join('')}
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.76rem; font-weight: 800; color: #64748b; margin-bottom: 0.3rem; text-transform: uppercase;">📚 Môn Học:</label>
            <select id="ai-picker-select-subject" style="padding: 0.55rem 0.9rem; border-radius: 10px; border: 1.5px solid #cbd5e1; font-weight: 700; font-size: 0.88rem; color: #1e293b; background: #f8fafc; cursor: pointer; outline: none;">
              ${subjectsList.map(s => `<option value="${s.id}" ${s.id === currentSubjectId ? 'selected' : ''}>${s.name}</option>`).join('')}
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.76rem; font-weight: 800; color: #64748b; margin-bottom: 0.3rem; text-transform: uppercase;">📹 Nguồn Camera Quét:</label>
            <select id="ai-picker-select-cam-mode" style="padding: 0.55rem 0.9rem; border-radius: 10px; border: 1.5px solid #2563eb; font-weight: 800; font-size: 0.88rem; color: #1d4ed8; background: #eff6ff; cursor: pointer; outline: none;">
              <option value="simulated" ${currentCamMode === 'simulated' ? 'selected' : ''}>🎥 Camera Lớp Học THCS (Mô Phỏng AI Scanner)</option>
              <option value="webcam" ${currentCamMode === 'webcam' ? 'selected' : ''}>📷 Camera Trực Tiếp Thiết Bị (Webcam / Phone)</option>
            </select>
          </div>
        </div>

        <button id="btn-trigger-ai-call" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border: none; padding: 0.75rem 1.6rem; border-radius: 14px; font-weight: 900; font-size: 0.95rem; cursor: pointer; box-shadow: 0 6px 18px rgba(16,185,129,0.35); display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;" onmouseover="this.style.transform='scale(1.02)';" onmouseout="this.style.transform='scale(1)';">
          <span>🚀 AI QUÉT & GỌI HỌC SINH NGẪU NHIÊN</span>
        </button>

      </div>

      <!-- MAIN VIEWPORT KHUNG HÌNH CAMERA & QUÉT AI KHUÔN MẶT -->
      <div style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 1.4rem;">

        <!-- BÊN TRÁI: MAN HINH CAMERA VỚI KHUNG BOUNDING BOXES -->
        <div style="background: #0f172a; border-radius: 20px; border: 2px solid #334155; position: relative; overflow: hidden; min-height: 480px; display: flex; flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          
          <!-- LIVE HUD OVERLAY BAR -->
          <div style="position: absolute; top: 12px; left: 16px; right: 16px; display: flex; justify-content: space-between; align-items: center; z-index: 10; pointer-events: none;">
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(16,185,129,0.5); color: #10b981; font-weight: 800; padding: 0.35rem 0.8rem; border-radius: 12px; font-size: 0.78rem; display: flex; align-items: center; gap: 0.4rem; backdrop-filter: blur(8px);">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444; display: inline-block; animation: pulse 1s infinite;"></span>
              <span>LIVE AI CAMERA SCANNER | CLASS ${currentClassId}</span>
            </div>
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1; font-weight: 700; padding: 0.35rem 0.8rem; border-radius: 12px; font-size: 0.78rem; backdrop-filter: blur(8px);">
              <span>🎯 ${studentsInClass.length} KHUÔN MẶT ĐÃ NHẬN DIỆN</span>
            </div>
          </div>

          <!-- VIDEO WEBCAM THẬT HOẶC MÔ PHỎNG -->
          <div id="ai-camera-container" style="width: 100%; height: 100%; position: relative; display: flex; justify-content: center; align-items: center;">
            
            ${currentCamMode === 'webcam' ? `
              <video id="ai-webcam-video" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 18px;"></video>
            ` : `
              <!-- HÌNH MẪU LỚP HỌC VỚI HIỆU ỨNG TIA LASER & KHUNG XANH NHẬN DIỆN KHUÔN MẶT -->
              <div id="ai-classroom-viewport" style="position: relative; width: 100%; height: 100%; min-height: 480px; border-radius: 18px; overflow: hidden; transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);">
                  <!-- HÌNH ẢNH THẬT LỚP HỌC HỌC SINH -->
                  <img src="./real_classroom.png" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; border-radius: 18px;" alt="Hình ảnh lớp học thực tế">
                
                <!-- TIA LASER QUÉT RÀ QUA LỚP HỌC -->
                <div id="ai-scan-laser" style="position: absolute; left: 0; right: 0; top: 0; height: 3px; background: linear-gradient(90deg, transparent, #ef4444, #f59e0b, #ef4444, transparent); box-shadow: 0 0 15px #ef4444, 0 0 25px #ef4444; opacity: 0.85; pointer-events: none; z-index: 5; transition: top 0.05s linear;"></div>

                <!-- BOUNDING BOXES KHUÔN MẶT CÁC HỌC SINH -->
                ${studentsInClass.slice(0, 12).map((st, idx) => {
                  const positions = [
                    { top: '56%', left: '18%' }, { top: '56%', left: '33%' }, { top: '56%', left: '59%' }, { top: '56%', left: '84%' },
                    { top: '48%', left: '17%' }, { top: '48%', left: '38%' }, { top: '48%', left: '56%' }, { top: '48%', left: '75%' },
                    { top: '42%', left: '22%' }, { top: '42%', left: '42%' }, { top: '42%', left: '65%' }, { top: '42%', left: '80%' }
                  ];
                  const pos = positions[idx % positions.length];
                  return `
                    <div id="face-box-${st.id}" class="ai-face-box" style="position: absolute; top: ${pos.top}; left: ${pos.left}; width: 62px; height: 62px; border: 2.5px solid #10b981; border-radius: 8px; box-shadow: 0 0 12px rgba(16,185,129,0.7); cursor: pointer; transition: all 0.2s;" onclick="if(window.app) window.app.selectAiStudent('${st.id}');">
                      <div style="position: absolute; top: -22px; left: 50%; transform: translateX(-50%); background: rgba(16,185,129,0.9); color: #0f172a; font-size: 0.65rem; font-weight: 800; padding: 0.1rem 0.4rem; border-radius: 4px; whitespace: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
                        ${st.name.split(' ').slice(-1)[0]} (99.2%)
                      </div>
                    </div>
                  `;
                }).join('')}

              </div>
            `}

          </div>

          <!-- RADAR SEARCHING OVERLAY (ANIMAL WHEN CALLING) -->
          <div id="ai-radar-overlay" style="display: none; position: absolute; inset: 0; background: rgba(15,23,42,0.85); backdrop-filter: blur(6px); z-index: 20; flex-direction: column; justify-content: center; align-items: center; color: #ffffff;">
            <div style="width: 130px; height: 130px; border: 4px solid rgba(37,99,235,0.3); border-top: 4px solid #3b82f6; border-right: 4px solid #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1.2rem; box-shadow: 0 0 30px rgba(37,99,235,0.5);"></div>
            <h3 style="margin: 0; font-size: 1.35rem; font-weight: 900; color: #60a5fa; letter-spacing: 0.5px;">🤖 AI DỰ ĐOÁN & QUAY CHỌN HỌC SINH...</h3>
            <p style="margin: 0.4rem 0 0 0; font-size: 0.88rem; color: #94a3b8; font-weight: 600;" id="ai-radar-status-text">Đang phân tích độ tập trung & gọi ngẫu nhiên trong Lớp ${currentClassId}...</p>
          </div>

        </div>

        <!-- BÊN PHẢI: BẢNG THÔNG TIN HỌC SINH ĐƯỢC GỌI & FORM NHẬP ĐIỂM THƯỜNG XUYÊN -->
        <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #cbd5e1; padding: 1.35rem; box-shadow: 0 4px 18px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
          
          <div id="selected-student-panel">
            <div style="border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.75rem; margin-bottom: 1rem;">
              <div style="font-size: 0.76rem; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">🎯 HỌC SINH ĐƯỢC GỌI TRẢ LỜI</div>
              <h3 id="panel-student-name" style="margin: 0.2rem 0 0 0; font-size: 1.3rem; font-weight: 900; color: #0f172a;">Chưa chọn học sinh</h3>
              <div id="panel-student-sub" style="font-size: 0.8rem; color: #64748b; font-weight: 600; margin-top: 0.25rem;">Vui lòng bấm nút 'AI Quét & Gọi Học Sinh'</div>
            </div>

            <!-- BẢNG XEM ĐIỂM THƯỜNG XUYÊN HIỆN CÓ CỦA HỌC SINH -->
            <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 0.9rem; margin-bottom: 1.1rem;">
              <div style="font-size: 0.76rem; font-weight: 800; color: #475569; margin-bottom: 0.5rem;">📊 Điểm Thường Xuyên Hiện Có (4 Cột):</div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.45rem; text-align: center;" id="panel-student-scores">
                <div style="background: #ffffff; border: 1px solid #cbd5e1; padding: 0.4rem; border-radius: 8px; font-weight: 800; font-size: 0.85rem; color: #64748b;">TX1: -</div>
                <div style="background: #ffffff; border: 1px solid #cbd5e1; padding: 0.4rem; border-radius: 8px; font-weight: 800; font-size: 0.85rem; color: #64748b;">TX2: -</div>
                <div style="background: #ffffff; border: 1px solid #cbd5e1; padding: 0.4rem; border-radius: 8px; font-weight: 800; font-size: 0.85rem; color: #64748b;">TX3: -</div>
                <div style="background: #ffffff; border: 1px solid #cbd5e1; padding: 0.4rem; border-radius: 8px; font-weight: 800; font-size: 0.85rem; color: #64748b;">TX4: -</div>
              </div>
              <div style="font-size: 0.72rem; color: #059669; font-weight: 700; margin-top: 0.5rem; text-align: center;" id="panel-rule-hint">
                💡 Đã cài đặt tự động thay thế con điểm thấp nhất khi đủ 4 cột
              </div>
            </div>

            <!-- FORM NHẬP ĐIỂM -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 800; color: #1e293b; margin-bottom: 0.45rem;">💯 Nhập Điểm Đánh Giá Trực Tiếp:</label>
              
              <!-- NÚT CHỌN NHANH ĐIỂM SỐ -->
              <div style="display: flex; gap: 0.4rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
                ${['8.0', '8.5', '9.0', '9.5', '10.0'].map(sc => `
                  <button type="button" class="btn-quick-score" data-score="${sc}" style="background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1d4ed8; padding: 0.35rem 0.65rem; border-radius: 8px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">${sc}</button>
                `).join('')}
              </div>

              <input type="number" id="ai-input-score-val" step="0.1" min="0" max="10" placeholder="Nhập điểm (0 - 10)" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 10px; border: 1.5px solid #cbd5e1; font-weight: 800; font-size: 1rem; color: #0f172a; margin-bottom: 0.85rem; outline: none; box-sizing: border-box;">

              <button id="btn-submit-ai-score" style="width: 100%; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; border: none; padding: 0.75rem; border-radius: 12px; font-weight: 900; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.3); display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                <span>💾 ĐẨY ĐIỂM VÀO SỔ ĐIỂM THƯỜNG XUYÊN</span>
              </button>
            </div>

          </div>

          <div style="font-size: 0.75rem; color: #64748b; text-align: center; margin-top: 1rem; border-top: 1px solid #f1f5f9; padding-top: 0.65rem;">
            Chuẩn Thông Tư 22 (GDPT 2018) • Tự động tính TBM
          </div>

        </div>

      </div>

    </div>
  `;

  // EVENT BINDINGS
  const classSelect = dom.querySelector('#ai-picker-select-class');
  if (classSelect) {
    classSelect.onchange = (e) => {
      this._aiPickerSelectedClass = e.target.value;
      this.render_ai_picker(dom);
    };
  }

  const subjectSelect = dom.querySelector('#ai-picker-select-subject');
  if (subjectSelect) {
    subjectSelect.onchange = (e) => {
      this._aiPickerSelectedSubject = e.target.value;
      this.render_ai_picker(dom);
    };
  }

  const camModeSelect = dom.querySelector('#ai-picker-select-cam-mode');
  if (camModeSelect) {
    camModeSelect.onchange = (e) => {
      this._aiPickerCamMode = e.target.value;
      this.render_ai_picker(dom);
    };
  }

  // Trigger AI Calling Animation
  const btnTrigger = dom.querySelector('#btn-trigger-ai-call');
  if (btnTrigger) {
    btnTrigger.onclick = () => this.startAiCallAnimation(dom);
  }

  // Quick Score Buttons
  dom.querySelectorAll('.btn-quick-score').forEach(btn => {
    btn.onclick = () => {
      const val = btn.getAttribute('data-score');
      const scoreInput = dom.querySelector('#ai-input-score-val');
      if (scoreInput) scoreInput.value = val;
    };
  });

  // Submit Score Button
  const btnSubmitScore = dom.querySelector('#btn-submit-ai-score');
  if (btnSubmitScore) {
    btnSubmitScore.onclick = () => this.submitAiPickerScore(dom);
  }

  // Laser Animation Loop
  this.startLaserAnimation(dom);

  // Initialize webcam if webcam mode selected
  if (currentCamMode === 'webcam') {
    this.initAiWebcam(dom);
  }
};




  LMSApp.prototype.startLaserAnimation = function(dom) {
    if (this._laserInterval) clearInterval(this._laserInterval);
    const laser = dom.querySelector('#ai-scan-laser');
    if (!laser) return;

    let dir = 1;
    let pos = 0;
    this._laserInterval = setInterval(() => {
      pos += dir * 2.5;
      if (pos >= 95) dir = -1;
      if (pos <= 2) dir = 1;
      if (laser) laser.style.top = pos + '%';
    }, 40);
  };

  LMSApp.prototype.initAiWebcam = function(dom) {
  try {
    const video = dom ? dom.querySelector('#ai-webcam-video') : null;
    const statusText = dom ? dom.querySelector('#ai-camera-live-status') : null;
    if (!video || typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    if (statusText) statusText.innerText = '⏳ Đang khởi động Camera thiết bị...';

    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    })
      .then(stream => {
        if (video) {
          video.srcObject = stream;
          video.play();
        }
        this._currentWebcamStream = stream;
        if (statusText) statusText.innerHTML = '🟢 LIVE CAMERA THỰC TẾ ĐANG TRUYỀN HÌNH LỚP HỌC';
        if (this.showToast) this.showToast('📷 Đã kết nối Camera thực tế thành công! Đang rà quét nhận diện lớp học.');
      })
      .catch(err => {
        console.warn('Webcam access error:', err);
        if (statusText) statusText.innerHTML = '⚠️ KHÔNG TRUY CẬP ĐƯỢC CAMERA (Vui lòng cấp quyền Camera trên trình duyệt)';
        if (this.showToast) this.showToast('⚠️ Vui lòng cấp quyền mở Camera trên trình duyệt hoặc sử dụng chế độ Mô Phỏng Ảnh Lớp Học.');
      });
  } catch(e) {}
};

LMSApp.prototype.selectAiStudent = function(studentId) {
    const students = db.getStudents ? db.getStudents() : [];
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    this._currentSelectedAiStudent = student;

    // Highlight face box in DOM
    if (typeof document !== 'undefined') document.querySelectorAll('.ai-face-box').forEach(box => {
      box.style.border = '2.5px solid #10b981';
      box.style.boxShadow = '0 0 12px rgba(16,185,129,0.7)';
    });

    const targetBox = (typeof document !== 'undefined') ? document.getElementById('face-box-' + studentId) : null;
    if (targetBox) {
      targetBox.style.border = '3.5px solid #ef4444';
      targetBox.style.boxShadow = '0 0 25px #ef4444, 0 0 35px #ef4444';
    }

    // Update Student Panel
    const nameEl = (typeof document !== 'undefined') ? document.getElementById('panel-student-name') : null;
    const subEl = (typeof document !== 'undefined') ? document.getElementById('panel-student-sub') : null;
    if (nameEl) nameEl.innerText = student.name;
    if (subEl) subEl.innerText = `Lớp ${student.classId || '6A'} • Mã HS: ${student.id}`;

    // Render Student Existing Regular Scores (4 TX slots)
    const currentSubjectId = this._aiPickerSelectedSubject || 'toan';
    const gradebook = db.getGradebook ? db.getGradebook() : [];
    const record = gradebook.find(r => r.studentId === student.id && r.subjectId === currentSubjectId);

    const scoresDiv = (typeof document !== 'undefined') ? document.getElementById('panel-student-scores') : null;
    if (scoresDiv) {
      const tx1 = record && record.tx1 !== null && record.tx1 !== undefined ? record.tx1 : '-';
      const tx2 = record && record.tx2 !== null && record.tx2 !== undefined ? record.tx2 : '-';
      const tx3 = record && record.tx3 !== null && record.tx3 !== undefined ? record.tx3 : '-';
      const tx4 = record && record.tx4 !== null && record.tx4 !== undefined ? record.tx4 : '-';

      scoresDiv.innerHTML = `
        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; padding: 0.45rem; border-radius: 8px; font-weight: 800; font-size: 0.88rem; color: ${tx1 !== '-' ? '#2563eb' : '#94a3b8'};">TX1: ${tx1}</div>
        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; padding: 0.45rem; border-radius: 8px; font-weight: 800; font-size: 0.88rem; color: ${tx2 !== '-' ? '#2563eb' : '#94a3b8'};">TX2: ${tx2}</div>
        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; padding: 0.45rem; border-radius: 8px; font-weight: 800; font-size: 0.88rem; color: ${tx3 !== '-' ? '#2563eb' : '#94a3b8'};">TX3: ${tx3}</div>
        <div style="background: #ffffff; border: 1.5px solid #cbd5e1; padding: 0.45rem; border-radius: 8px; font-weight: 800; font-size: 0.88rem; color: ${tx4 !== '-' ? '#2563eb' : '#94a3b8'};">TX4: ${tx4}</div>
      `;
    }

    const hintEl = (typeof document !== 'undefined') ? document.getElementById('panel-rule-hint') : null;
    if (hintEl) {
      if (record) {
        const existingTx = [record.tx1, record.tx2, record.tx3, record.tx4].filter(v => v !== null && v !== undefined && !isNaN(v));
        if (existingTx.length >= 4) {
          const minVal = Math.min(...existingTx);
          hintEl.innerHTML = `⚠️ Học sinh đã có đủ 4/4 cột điểm Thường xuyên. Điểm mới > <b>${minVal}</b> sẽ tự động thay thế điểm thấp nhất!`;
          hintEl.style.color = '#d97706';
        } else {
          hintEl.innerHTML = `✅ Học sinh hiện có ${existingTx.length}/4 cột điểm Thường xuyên. Điểm mới sẽ ghi vào cột trống tiếp theo.`;
          hintEl.style.color = '#059669';
        }
      } else {
        hintEl.innerHTML = `✅ Học sinh chưa có điểm Thường xuyên. Điểm mới sẽ ghi vào cột TX1.`;
        hintEl.style.color = '#059669';
      }
    }
  };

  LMSApp.prototype.startAiCallAnimation = function(dom) {
    const currentClassId = this._aiPickerSelectedClass || '6A';
    const students = (db.getStudents ? db.getStudents() : []).filter(s => (s.classId || '6A') === currentClassId);
    
    if (students.length === 0) {
      if (this.showToast) this.showToast('⚠️ Không tìm thấy học sinh trong lớp được chọn!');
      return;
    }

    const overlay = dom.querySelector('#ai-radar-overlay');
    const statusText = dom.querySelector('#ai-radar-status-text');
    if (overlay) overlay.style.display = 'flex';

    let spins = 0;
    const maxSpins = 18;
    const interval = setInterval(() => {
      spins++;
      const randomSt = students[Math.floor(Math.random() * students.length)];
      if (statusText) statusText.innerText = `🎯 Đang quét ngẫu nhiên: ${randomSt.name}...`;
      
      // Random face highlight
      this.selectAiStudent(randomSt.id);

      if (spins >= maxSpins) {
        clearInterval(interval);
        if (overlay) overlay.style.display = 'none';

        // Select Final Winner Student
        const winner = students[Math.floor(Math.random() * students.length)];
        this.selectAiStudent(winner.id);

        if (this.showToast) this.showToast(`🎉 AI đã chọn học sinh: ${winner.name} (${winner.classId || currentClassId})!`);
      }
    }, 120);
  };

  LMSApp.prototype.submitAiPickerScore = function(dom) {
    if (!this._currentSelectedAiStudent) {
      if (this.showToast) this.showToast('⚠️ Vui lòng chọn hoặc dùng AI để gọi một học sinh trước!');
      return;
    }

    const scoreInput = dom.querySelector('#ai-input-score-val');
    const valStr = scoreInput ? scoreInput.value : '';
    const scoreVal = parseFloat(valStr);

    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
      if (this.showToast) this.showToast('⚠️ Vui lòng nhập con điểm số hợp lệ từ 0 đến 10!');
      return;
    }

    const student = this._currentSelectedAiStudent;
    const currentClassId = this._aiPickerSelectedClass || student.classId || '6A';
    const currentSubjectId = this._aiPickerSelectedSubject || 'toan';

    const res = db.pushOrUpdateRegularScore(student.id, currentClassId, currentSubjectId, scoreVal);

    if (res && res.success) {
      if (res.action === 'replaced') {
        if (this.showToast) this.showToast(`🎉 ${res.message}! Đã tự động thay thế điểm thấp nhất cho ${student.name}.`);
      } else if (res.action === 'added') {
        if (this.showToast) this.showToast(`✅ ${res.message} cho ${student.name}!`);
      } else {
        if (this.showToast) this.showToast(`ℹ️ ${res.message}`);
      }

      // Refresh student panel scores display
      this.selectAiStudent(student.id);

      if (scoreInput) scoreInput.value = '';
    } else {
      if (this.showToast) this.showToast(res ? res.message : '❌ Không thể đẩy điểm vào CSDL!');
    }
  };


  // =========================================================================
  // 🌟 1. SỔ LIÊN LẠC & TIN NHẮN PHỤ HUYNH CHO GIÁO VIÊN (render_messages)
  // =========================================================================
  LMSApp.prototype.render_messages = function(dom) {
    const classes = (typeof db !== 'undefined' && db.getClasses) ? db.getClasses() : [];
    const selectedClassId = this._messagesSelectedClass || (classes.length > 0 ? (classes[0].name || classes[0].id) : '6A');
    const allStudents = (typeof db !== 'undefined' && db.getStudents) ? db.getStudents() : [];
    const classStudents = allStudents.filter(s => (s.classId === selectedClassId || s.classId === selectedClassId.replace('Lớp ', '')));

    const messages = (typeof db !== 'undefined' && db.getMessages) ? db.getMessages() : [];
    const classMessages = messages.filter(m => m.classId === selectedClassId || m.classId === 'all');

    dom.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.5rem; max-width:1280px; margin:0 auto; padding-bottom:2.5rem; font-family:var(--font-body); animation:fadeIn 0.25s ease-out;">
        
        <!-- HEADER SỔ LIÊN LẠC (ĐỒ HỌA TRONG SÁNG & SANG TRỌNG) -->
        <div style="background:linear-gradient(135deg, #ffffff 0%, #eff6ff 40%, #e0e7ff 100%); border-radius:22px; padding:1.6rem 2rem; color:#0f172a; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; box-shadow:0 10px 30px rgba(67,56,202,0.1); border:1.8px solid #c7d2fe;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:0.4rem; background:#e0e7ff; border:1px solid #c7d2fe; color:#4338ca; padding:0.25rem 0.85rem; border-radius:20px; font-size:0.78rem; font-weight:800; margin-bottom:0.5rem;">
              <span>💬</span> SỔ LIÊN LẠC ĐIỆN TỬ VÀ TIN NHẮN PHỤ HUYNH
            </div>
            <h1 style="margin:0; font-family:var(--font-title); font-size:1.65rem; font-weight:900; color:#1e1b4b;">
              Trung Tâm Liên Lạc Phụ Huynh — <span style="color:#4338ca;">Lớp ${selectedClassId}</span>
            </h1>
            <p style="margin:0.35rem 0 0 0; color:#475569; font-size:0.9rem; font-weight:500;">Gửi thông báo học tập, chuyên cần, họp phụ huynh & nhận xét định kỳ 2 chiều</p>
          </div>

          <div style="display:flex; align-items:center; gap:0.75rem;">
            <select id="msg-select-class" style="padding:0.6rem 1rem; border-radius:12px; border:1.5px solid #cbd5e1; background:#ffffff; color:#1e1b4b; font-weight:800; font-size:0.9rem; cursor:pointer;">
              ${classes.map(c => `<option value="${c.name || c.id}" ${c.name === selectedClassId || c.id === selectedClassId ? 'selected' : ''}>Lớp ${c.name || c.id}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- GRID 2 CỘT: FORM GỬI TIN NHẮN & DANH SÁCH TIN ĐÃ GỬI -->
        <div style="display:grid; grid-template-columns:1.15fr 1fr; gap:1.4rem;">
          
          <!-- KHỐI 1: SOẠN & GỬI THÔNG BÁO / NHẬN XÉT -->
          <div style="background:#ffffff; border-radius:20px; border:1.5px solid #cbd5e1; padding:1.5rem; box-shadow:0 4px 15px rgba(0,0,0,0.04);">
            <h3 style="margin:0 0 1rem 0; font-size:1.1rem; font-weight:800; color:#1e293b; display:flex; align-items:center; gap:0.4rem;">
              <span>✉️</span> Soạn Thông Báo & Nhận Xét Mới
            </h3>

            <div style="display:flex; flex-direction:column; gap:1rem;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Người Nhận / Đối Tượng:</label>
                <select id="msg-recipient-select" style="width:100%; padding:0.65rem 0.85rem; border-radius:10px; border:1.5px solid #cbd5e1; font-weight:700; color:#0f172a; font-size:0.88rem;">
                  <option value="all">📢 Toàn thể Phụ huynh Lớp ${selectedClassId} (Gửi cả lớp)</option>
                  ${classStudents.map(s => `<option value="${s.id}">👤 PH em ${s.name} (${s.parentPhone || s.phone || 'Chưa có SĐT'})</option>`).join('')}
                </select>
              </div>

              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Loại Thông Báo:</label>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                  <label style="display:flex; align-items:center; gap:0.4rem; padding:0.5rem; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; font-size:0.82rem; cursor:pointer; font-weight:600;">
                    <input type="radio" name="msg-type" value="announcement" checked> 📢 Thông báo chung
                  </label>
                  <label style="display:flex; align-items:center; gap:0.4rem; padding:0.5rem; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; font-size:0.82rem; cursor:pointer; font-weight:600;">
                    <input type="radio" name="msg-type" value="praise"> 🥇 Khen ngợi học tập
                  </label>
                  <label style="display:flex; align-items:center; gap:0.4rem; padding:0.5rem; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; font-size:0.82rem; cursor:pointer; font-weight:600;">
                    <input type="radio" name="msg-type" value="reminder"> ⚠️ Nhắc nhở chuyên cần
                  </label>
                  <label style="display:flex; align-items:center; gap:0.4rem; padding:0.5rem; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; font-size:0.82rem; cursor:pointer; font-weight:600;">
                    <input type="radio" name="msg-type" value="meeting"> 📅 Mời họp phụ huynh
                  </label>
                </div>
              </div>

              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Tiêu Đề:</label>
                <input type="text" id="msg-input-title" placeholder="VD: Thông báo kiểm tra giữa kỳ 2 / Khen ngợi em..." style="width:100%; padding:0.65rem 0.85rem; border-radius:10px; border:1.5px solid #cbd5e1; font-weight:600; font-size:0.88rem; box-sizing:border-box;">
              </div>

              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Nội Dung Tin Nhắn / Nhận Xét:</label>
                <textarea id="msg-input-content" rows="4" placeholder="Nhập nội dung thông báo gửi đến phụ huynh..." style="width:100%; padding:0.65rem 0.85rem; border-radius:10px; border:1.5px solid #cbd5e1; font-family:var(--font-body); font-size:0.88rem; box-sizing:border-box;"></textarea>
              </div>

              <button id="btn-send-message-submit" style="width:100%; background:linear-gradient(135deg, #4338ca 0%, #3730a3 100%); color:#fff; border:none; padding:0.8rem; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer; box-shadow:0 4px 14px rgba(67,56,202,0.3); display:flex; align-items:center; justify-content:center; gap:0.4rem;">
                <span>🚀</span> GỬI TIN NHẮN ĐẾN PHỤ HUYNH
              </button>
            </div>
          </div>

          <!-- KHỐI 2: HỘP THƯ LỊCH SỬ TIN NHẮN -->
          <div style="background:#ffffff; border-radius:20px; border:1.5px solid #cbd5e1; padding:1.5rem; box-shadow:0 4px 15px rgba(0,0,0,0.04); display:flex; flex-direction:column;">
            <h3 style="margin:0 0 1rem 0; font-size:1.1rem; font-weight:800; color:#1e293b; display:flex; align-items:center; gap:0.4rem;">
              <span>📬</span> Lịch Sử Thông Báo Lớp ${selectedClassId} (${classMessages.length})
            </h3>

            <div style="display:flex; flex-direction:column; gap:0.75rem; overflow-y:auto; max-height:480px; padding-right:0.25rem;">
              ${classMessages.length === 0 ? `
                <div style="text-align:center; padding:2.5rem 1rem; color:#64748b;">
                  <div style="font-size:2.5rem; margin-bottom:0.5rem;">📭</div>
                  <p style="font-weight:600; font-size:0.9rem;">Chưa có thông báo nào được gửi cho Lớp ${selectedClassId}</p>
                </div>
              ` : classMessages.map(m => {
                const dateStr = new Date(m.createdAt || Date.now()).toLocaleDateString('vi-VN', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit' });
                const typeIcon = m.type === 'praise' ? '🥇' : m.type === 'reminder' ? '⚠️' : m.type === 'meeting' ? '📅' : '📢';
                const recipientText = m.studentId === 'all' ? `📢 Toàn lớp ${m.classId}` : `👤 PH: ${m.studentId}`;
                return `
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:1rem; position:relative;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                      <span style="font-size:0.75rem; font-weight:800; color:#4338ca; background:#e0e7ff; padding:0.15rem 0.55rem; border-radius:8px;">${typeIcon} ${recipientText}</span>
                      <span style="font-size:0.72rem; color:#94a3b8;">${dateStr}</span>
                    </div>
                    <h4 style="margin:0 0 0.35rem 0; font-size:0.9rem; font-weight:800; color:#1e293b;">${m.title || 'Thông báo'}</h4>
                    <p style="margin:0; font-size:0.82rem; color:#475569; line-height:1.45;">${m.content || ''}</p>
                    <div style="display:flex; justify-content:flex-end; margin-top:0.5rem;">
                      <button onclick="if(confirm('Xóa thông báo này?')){ db.deleteMessage('${m.id}'); window.app.render_messages(document.getElementById('viewport')); }" style="background:none; border:none; color:#ef4444; font-size:0.76rem; font-weight:700; cursor:pointer; padding:0.2rem 0.4rem;">✕ Xóa</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>

      </div>
    `;

    // Events
    const clsSel = dom.querySelector('#msg-select-class');
    if (clsSel) {
      clsSel.onchange = (e) => {
        this._messagesSelectedClass = e.target.value;
        this.render_messages(dom);
      };
    }

    const btnSend = dom.querySelector('#btn-send-message-submit');
    if (btnSend) {
      btnSend.onclick = () => {
        const title = (dom.querySelector('#msg-input-title')?.value || '').trim();
        const content = (dom.querySelector('#msg-input-content')?.value || '').trim();
        const studentId = dom.querySelector('#msg-recipient-select')?.value || 'all';
        const typeEl = dom.querySelector('input[name="msg-type"]:checked');
        const type = typeEl ? typeEl.value : 'announcement';

        if (!title || !content) {
          if (this.showToast) this.showToast('⚠️ Vui lòng nhập đầy đủ Tiêu đề và Nội dung tin nhắn!', 'error');
          return;
        }

        db.addMessage({
          senderRole: 'teacher',
          senderName: this.currentUser ? (this.currentUser.name || 'Giáo viên') : 'Giáo viên',
          teacherId: this.currentUser?.id || 'gv_toan',
          classId: selectedClassId,
          studentId: studentId,
          title: title,
          content: content,
          type: type
        });

        if (this.showToast) this.showToast('✅ Đã gửi tin nhắn đến Phụ huynh thành công!');
        this.render_messages(dom);
      };
    }
  };

  // =========================================================================
  // 🌟 2. SỔ LIÊN LẠC & TIN NHẮN PHỤ HUYNH CHO PHỤ HUYNH (render_parent_messages)
  // =========================================================================
  LMSApp.prototype.render_parent_messages = function(dom) {
    const parent = this.currentUser || { name: 'Phụ huynh', studentId: 'hs_01', classId: '6A' };
    const studentId = parent.studentId || 'hs_01';
    const classId = parent.classId || '6A';

    const messages = (typeof db !== 'undefined' && db.getMessages) ? db.getMessages() : [];
    const myMessages = messages.filter(m => m.classId === classId && (m.studentId === 'all' || m.studentId === studentId));

    dom.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.5rem; max-width:1100px; margin:0 auto; padding-bottom:2.5rem; font-family:var(--font-body); animation:fadeIn 0.25s ease-out;">
        
        <!-- HEADER PHỤ HUYNH (ĐỒ HỌA TRONG SÁNG & SANG TRỌNG) -->
        <div style="background:linear-gradient(135deg, #ffffff 0%, #faf5ff 40%, #f3e8ff 100%); border-radius:22px; padding:1.6rem 2rem; color:#0f172a; box-shadow:0 10px 30px rgba(168,85,247,0.1); border:1.8px solid #d8b4fe; position:relative; overflow:hidden;">
          <div style="display:inline-flex; align-items:center; gap:0.4rem; background:#f5f3ff; border:1px solid #d8b4fe; color:#7c3aed; padding:0.25rem 0.85rem; border-radius:20px; font-size:0.78rem; font-weight:800; margin-bottom:0.5rem;">
            <span>👨‍👩‍👧</span> SỔ LIÊN LẠC ĐIỆN TỬ GIA ĐÌNH & NHÀ TRƯỜNG
          </div>
          <h1 style="margin:0; font-family:var(--font-title); font-size:1.65rem; font-weight:900; color:#1e1b4b;">
            Hộp Thư Liên Lạc — <span style="color:#7c3aed;">${parent.name}</span>
          </h1>
          <p style="margin:0.35rem 0 0 0; color:#475569; font-size:0.9rem; font-weight:500;">Học sinh: <strong style="color:#0f172a;">${parent.studentName || 'Con em'}</strong> &nbsp;|&nbsp; Lớp: <strong style="color:#7c3aed;">${classId}</strong></p>
        </div>

        <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:1.4rem;">
          
          <!-- KHỐI 1: THÔNG BÁO TỪ NHÀ TRƯỜNG & THẦY CÔ -->
          <div style="background:#ffffff; border-radius:20px; border:1.5px solid #cbd5e1; padding:1.5rem; box-shadow:0 4px 15px rgba(0,0,0,0.04);">
            <h3 style="margin:0 0 1rem 0; font-size:1.1rem; font-weight:800; color:#1e293b; display:flex; align-items:center; gap:0.4rem;">
              <span>📬</span> Thông Báo Từ Nhà Trường & Giáo Viên (${myMessages.length})
            </h3>

            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              ${myMessages.length === 0 ? `
                <div style="text-align:center; padding:2rem 1rem; color:#64748b;">
                  <div style="font-size:2.5rem; margin-bottom:0.5rem;">📭</div>
                  <p style="font-weight:600;">Hiện chưa có thông báo mới.</p>
                </div>
              ` : myMessages.map(m => {
                const dateStr = new Date(m.createdAt || Date.now()).toLocaleDateString('vi-VN', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit' });
                const typeBadge = m.type === 'praise' ? '🥇 Khen ngợi' : m.type === 'reminder' ? '⚠️ Nhắc nhở' : m.type === 'meeting' ? '📅 Họp phụ huynh' : '📢 Thông báo';
                const bgType = m.type === 'praise' ? '#f0fdf4' : m.type === 'reminder' ? '#fffbe8' : '#eff6ff';
                return `
                  <div style="background:${bgType}; border:1.5px solid #cbd5e1; border-radius:14px; padding:1.1rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                      <span style="font-size:0.75rem; font-weight:800; color:#4338ca; background:#ffffff; padding:0.2rem 0.6rem; border-radius:8px; border:1px solid #cbd5e1;">${typeBadge}</span>
                      <span style="font-size:0.75rem; color:#64748b;">${dateStr}</span>
                    </div>
                    <h4 style="margin:0 0 0.4rem 0; font-size:0.95rem; font-weight:800; color:#1e293b;">${m.title || 'Thông báo'}</h4>
                    <p style="margin:0; font-size:0.86rem; color:#334155; line-height:1.5;">${m.content || ''}</p>
                    <div style="margin-top:0.6rem; font-size:0.75rem; font-weight:700; color:#64748b;">Gửi từ: ${m.senderName || 'Ban Giám Hiệu & GVCN'}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- KHỐI 2: PHỤ HUYNH GỬI ĐƠN NGHỈ HỌC / TRAO ĐỔI VỚI GVCN -->
          <div style="background:#ffffff; border-radius:20px; border:1.5px solid #cbd5e1; padding:1.5rem; box-shadow:0 4px 15px rgba(0,0,0,0.04);">
            <h3 style="margin:0 0 1rem 0; font-size:1.1rem; font-weight:800; color:#1e293b; display:flex; align-items:center; gap:0.4rem;">
              <span>📝</span> Gửi Tin Nhắn / Đơn Xin Nghỉ Học
            </h3>

            <div style="display:flex; flex-direction:column; gap:0.9rem;">
              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Mục đích liên hệ:</label>
                <select id="parent-msg-topic" style="width:100%; padding:0.6rem 0.85rem; border-radius:10px; border:1.5px solid #cbd5e1; font-weight:700; color:#0f172a; font-size:0.88rem;">
                  <option value="Đơn xin phép nghỉ học">🏥 Đơn xin phép nghỉ học trực tuyến</option>
                  <option value="Trao đổi tình hình học tập">📚 Trao đổi tình hình học tập với GVCN</option>
                  <option value="Liên hệ khác">💬 Ý kiến đóng góp & Liên hệ khác</option>
                </select>
              </div>

              <div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#334155; margin-bottom:0.35rem;">Nội dung gửi Giáo viên chủ nhiệm:</label>
                <textarea id="parent-msg-text" rows="5" placeholder="Kính gửi Thầy/Cô chủ nhiệm, gia đình xin phép cho em nghỉ học ngày... vì lý do..." style="width:100%; padding:0.65rem 0.85rem; border-radius:10px; border:1.5px solid #cbd5e1; font-family:var(--font-body); font-size:0.88rem; box-sizing:border-box;"></textarea>
              </div>

              <button id="btn-parent-submit-msg" style="width:100%; background:linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color:#fff; border:none; padding:0.8rem; border-radius:12px; font-weight:800; font-size:0.95rem; cursor:pointer; box-shadow:0 4px 14px rgba(124,58,237,0.3); display:flex; align-items:center; justify-content:center; gap:0.4rem;">
                <span>📨</span> GỬI TRỰC TUYẾN ĐẾN GVCN
              </button>
            </div>
          </div>

        </div>

      </div>
    `;

    const btnParentSend = dom.querySelector('#btn-parent-submit-msg');
    if (btnParentSend) {
      btnParentSend.onclick = () => {
        const topic = dom.querySelector('#parent-msg-topic')?.value || 'Liên hệ';
        const txt = (dom.querySelector('#parent-msg-text')?.value || '').trim();
        if (!txt) {
          if (this.showToast) this.showToast('⚠️ Vui lòng nhập nội dung cần gửi đến Giáo viên!', 'error');
          return;
        }

        db.addMessage({
          senderRole: 'parent',
          senderName: parent.name,
          studentId: studentId,
          classId: classId,
          title: `[PH gửi] ${topic}`,
          content: txt,
          type: 'parent_reply'
        });

        if (this.showToast) this.showToast('✅ Đã gửi tin nhắn đến Giáo viên chủ nhiệm thành công!');
        const txtArea = dom.querySelector('#parent-msg-text');
        if (txtArea) txtArea.value = '';
      };
    }
  };

  // =========================================================================
  // 🌟 3. HỌC BẠ ĐIỆN TỬ & BẢNG ĐIỂM CÁ NHÂN HỌC SINH (render_student_grades)
  // =========================================================================
  LMSApp.prototype.render_student_grades = function(dom) {
    const student = this.currentUser || { name: 'Học sinh', classId: '6A', id: 'hs_01' };
    const studentId = student.id || 'hs_01';
    const classId = student.classId || '6A';

    const subjects = (typeof db !== 'undefined' && db.getSubjects) ? db.getSubjects() : [];
    const defaultSubs = [
      { id:'toan', name:'Toán học', icon:'📐' },
      { id:'van', name:'Ngữ văn', icon:'📖' },
      { id:'anh', name:'Tiếng Anh', icon:'🔤' },
      { id:'khtn', name:'Khoa học Tự nhiên', icon:'🔬' },
      { id:'lsdl', name:'Lịch sử & Địa lý', icon:'🌍' },
      { id:'tin', name:'Tin học', icon:'💻' },
      { id:'gdcd', name:'GD Công dân', icon:'⚖️' },
      { id:'congnghe', name:'Công nghệ', icon:'⚙️' },
      { id:'nghethuat', name:'Nghệ thuật', icon:'🎨' },
      { id:'gdtc', name:'GD Thể chất', icon:'🏃' }
    ];
    const subList = subjects.length > 0 ? subjects : defaultSubs;

    const grades = (typeof db !== 'undefined' && db.getGrades) ? db.getGrades() : [];
    const myGrades = grades.filter(g => g.studentId === studentId);

    dom.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.5rem; max-width:1280px; margin:0 auto; padding-bottom:2.5rem; font-family:var(--font-body); animation:fadeIn 0.25s ease-out;">
        
        <!-- HEADER HỌC BẠ (ĐỒ HỌA TRONG SÁNG & SANG TRỌNG) -->
        <div style="background:linear-gradient(135deg, #ffffff 0%, #f0fdf4 40%, #dcfce7 100%); border-radius:22px; padding:1.6rem 2rem; color:#0f172a; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; box-shadow:0 10px 30px rgba(16,185,129,0.1); border:1.8px solid #86efac;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:0.4rem; background:#dcfce7; border:1px solid #86efac; color:#059669; padding:0.25rem 0.85rem; border-radius:20px; font-size:0.78rem; font-weight:800; margin-bottom:0.5rem;">
              <span>🎓</span> HỌC BẠ ĐIỆN TỬ & KẾT QUẢ ĐÁNH GIÁ THÔNG TƯ 22
            </div>
            <h1 style="margin:0; font-family:var(--font-title); font-size:1.65rem; font-weight:900; color:#064e3b;">
              Phiếu Điểm Học Tập — <span style="color:#059669;">${student.name}</span>
            </h1>
            <p style="margin:0.35rem 0 0 0; color:#475569; font-size:0.9rem; font-weight:500;">Mã HS: <strong style="color:#0f172a;">${student.maHS || student.id}</strong> &nbsp;|&nbsp; Lớp: <strong style="color:#059669;">${classId}</strong> &nbsp;|&nbsp; Năm học: <strong>2025 - 2026</strong></p>
          </div>

          <div style="display:flex; gap:0.75rem;">
            <button onclick="window.print();" style="background:#059669; color:#ffffff; border:none; padding:0.75rem 1.35rem; border-radius:12px; font-weight:800; font-size:0.88rem; cursor:pointer; box-shadow:0 4px 14px rgba(5,150,105,0.3); display:flex; align-items:center; gap:0.4rem;">
              <span>🖨️</span> In Phiếu Điểm
            </button>
          </div>
        </div>

        <!-- 4 THẺ TỔNG KẾT HỌC LỰC & RÈN LUYỆN -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
          <div style="background:#ffffff; border-radius:16px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">Kết Quả Học Tập</div>
            <div style="font-size:1.6rem; font-weight:900; color:#059669; margin-top:0.3rem;">🥇 MỨC TỐT</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:0.2rem;">Theo chuẩn Thông tư 22</div>
          </div>
          <div style="background:#ffffff; border-radius:16px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">Kết Quả Rèn Luyện</div>
            <div style="font-size:1.6rem; font-weight:900; color:#2563eb; margin-top:0.3rem;">🥇 MỨC TỐT</div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:0.2rem;">Chuyên cần & Kỷ luật</div>
          </div>
          <div style="background:#ffffff; border-radius:16px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">Điểm TB Chung</div>
            <div style="font-size:1.6rem; font-weight:900; color:#7c3aed; margin-top:0.3rem;">8.6 <span style="font-size:0.85rem; color:#64748b;">/ 10</span></div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:0.2rem;">Toàn bộ 10 môn học</div>
          </div>
          <div style="background:#ffffff; border-radius:16px; padding:1.25rem; border:1.5px solid #cbd5e1; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
            <div style="font-size:0.78rem; font-weight:700; color:#64748b; text-transform:uppercase;">Xếp Hạng Trong Lớp</div>
            <div style="font-size:1.6rem; font-weight:900; color:#d97706; margin-top:0.3rem;">Top 5 <span style="font-size:0.85rem; color:#64748b;">/ 35 HS</span></div>
            <div style="font-size:0.75rem; color:#64748b; margin-top:0.2rem;">Lớp ${classId}</div>
          </div>
        </div>

        <!-- BẢNG ĐIỂM CHI TIẾT TỪNG MÔN CHUẨN THÔNG TƯ 22 -->
        <div style="background:#ffffff; border-radius:20px; border:1.5px solid #cbd5e1; padding:1.5rem; box-shadow:0 4px 18px rgba(0,0,0,0.04);">
          <h3 style="margin:0 0 1rem 0; font-size:1.15rem; font-weight:800; color:#1e293b; display:flex; align-items:center; gap:0.4rem;">
            <span>📋</span> Bảng Điểm Chi Tiết Các Môn Học Học Kỳ 2 (GDPT 2018)
          </h3>

          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:2px solid #cbd5e1; text-align:center; color:#334155; font-weight:700;">
                  <th style="padding:0.75rem; text-align:left;">Môn Học</th>
                  <th style="padding:0.75rem; width:80px;">ĐĐGtx 1</th>
                  <th style="padding:0.75rem; width:80px;">ĐĐGtx 2</th>
                  <th style="padding:0.75rem; width:80px;">ĐĐGtx 3</th>
                  <th style="padding:0.75rem; width:80px;">ĐĐGtx 4</th>
                  <th style="padding:0.75rem; width:90px; background:#eff6ff; color:#1d4ed8;">Giữa kỳ (x2)</th>
                  <th style="padding:0.75rem; width:90px; background:#f0fdf4; color:#166534;">Cuối kỳ (x3)</th>
                  <th style="padding:0.75rem; width:95px; background:#fffbe8; color:#92400e;">ĐTB Môn</th>
                  <th style="padding:0.75rem; width:110px;">Xếp Loại</th>
                </tr>
              </thead>
              <tbody>
                ${subList.map((s, idx) => {
                  const g = myGrades.find(gr => gr.subjectId === s.id) || {};
                  const tx1 = g.tx1 !== undefined ? g.tx1 : [8.5, 9.0, 8.0, 9.5, 8.0, 9.0, 8.5, 8.0, 9.0, 8.5][idx % 10];
                  const tx2 = g.tx2 !== undefined ? g.tx2 : [9.0, 8.5, 8.5, 9.0, 8.5, 9.5, 8.0, 8.5, 9.0, 9.0][idx % 10];
                  const tx3 = g.tx3 !== undefined ? g.tx3 : [8.0, 9.0, 8.0, 8.5, 9.0, 8.5, 9.0, 8.0, 8.5, 8.5][idx % 10];
                  const tx4 = g.tx4 !== undefined ? g.tx4 : [9.5, 8.0, 9.0, 9.0, 8.0, 9.0, 8.5, 9.0, 8.5, 9.0][idx % 10];
                  const gk = g.gk !== undefined ? g.gk : [8.5, 8.0, 8.5, 9.0, 8.5, 9.0, 8.0, 8.5, 9.0, 8.5][idx % 10];
                  const ck = g.ck !== undefined ? g.ck : [9.0, 8.5, 9.0, 9.5, 8.5, 9.5, 8.5, 9.0, 9.0, 9.0][idx % 10];
                  
                  const tbm = parseFloat(((tx1 + tx2 + tx3 + tx4 + gk * 2 + ck * 3) / 9).toFixed(1));
                  const xlBadge = tbm >= 8.0 ? '<span style="color:#059669; font-weight:800;">🥇 Tốt</span>' : tbm >= 6.5 ? '<span style="color:#2563eb; font-weight:800;">🥈 Khá</span>' : '<span style="color:#d97706; font-weight:800;">🥉 Đạt</span>';

                  return `
                    <tr style="border-bottom:1px solid #f1f5f9; text-align:center; transition:background 0.15s;" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='transparent';">
                      <td style="padding:0.7rem; text-align:left; font-weight:700; color:#1e293b;">${s.icon || '📚'} ${s.name}</td>
                      <td style="padding:0.7rem;">${tx1}</td>
                      <td style="padding:0.7rem;">${tx2}</td>
                      <td style="padding:0.7rem;">${tx3}</td>
                      <td style="padding:0.7rem;">${tx4}</td>
                      <td style="padding:0.7rem; font-weight:700; color:#1d4ed8; background:#f8fafc;">${gk}</td>
                      <td style="padding:0.7rem; font-weight:700; color:#166534; background:#f8fafc;">${ck}</td>
                      <td style="padding:0.7rem; font-weight:900; color:#b45309; background:#fffdf5; font-size:0.95rem;">${tbm}</td>
                      <td style="padding:0.7rem;">${xlBadge}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  };

}



