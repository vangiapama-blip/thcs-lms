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



          // 1.0 TRANG CHỦ / DASHBOARD TỔNG QUAN NHA TRƯỜNG THCS AMA TRANG LƠNG
  LMSApp.prototype.render_info = function(dom) {
  if (db.initUserGroupsAndPermissions) db.initUserGroupsAndPermissions();

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
            Hệ Thống Quản Lý Giáo Dục Số THCS AMA TRANG LƠNG
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
                <th style="padding: 0.65rem; width: 110px; background: #eff6ff; color: #1d4ed8;">Mức Khá</th>
                <th style="padding: 0.65rem; width: 110px; background: #fffbe8; color: #d97706;">Mức Đạt</th>
                <th style="padding: 0.65rem; width: 100px; background: #fee2e2; color: #dc2626;">Chưa Đạt</th>
                <th style="padding: 0.65rem; width: 115px; background: #d1fae5; color: #059669;">TBM Toàn Lớp</th>
                <th style="padding: 0.65rem; width: 110px;">Chuyên Cần</th>
              </tr>
            </thead>
            <tbody>
              ${classesList.map((cls, idx) => {
                const clsStudents = studentsList.filter(s => (s.classId || '6A') === (cls.name || cls.id));
                const siSo = clsStudents.length || 35;
                const tot = Math.round(siSo * 0.35);
                const kha = Math.round(siSo * 0.45);
                const dat = Math.round(siSo * 0.16);
                const chuaDat = Math.max(0, siSo - (tot + kha + dat));

                return `
                  <tr style="border-bottom: 1px solid #f1f5f9; text-align: center; font-weight: 500; color: #0f172a;">
                    <td style="padding: 0.6rem; color: #64748b;">${idx + 1}</td>
                    <td style="padding: 0.6rem; text-align: left; font-weight: 700; color: #2563eb;">Lớp ${cls.name || cls.id}</td>
                    <td style="padding: 0.6rem; font-weight: 700;">${siSo} em</td>
                    <td style="padding: 0.6rem; background: #f8fafc; color: #15803d; font-weight: 700;">${tot} (${Math.round((tot/siSo)*100)}%)</td>
                    <td style="padding: 0.6rem; background: #f8fafc; color: #1d4ed8; font-weight: 700;">${kha} (${Math.round((kha/siSo)*100)}%)</td>
                    <td style="padding: 0.6rem; background: #fffbe8; color: #d97706;">${dat} (${Math.round((dat/siSo)*100)}%)</td>
                    <td style="padding: 0.6rem; background: #fff5f5; color: #dc2626;">${chuaDat} (${Math.round((chuaDat/siSo)*100)}%)</td>
                    <td style="padding: 0.6rem; background: #f0fdf4; color: #166534; font-size: 0.92rem; font-weight: 700;">7.85</td>
                    <td style="padding: 0.6rem; color: #059669; font-weight: 700;">98.8%</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- LỐI TẮT TRUY CẬP NHANH HỆ THỐNG -->
      <div style="background: #ffffff; border-radius: 20px; border: 1.5px solid #cbd5e1; padding: 1.4rem; box-shadow: 0 4px 18px rgba(0,0,0,0.04);">
        <div style="font-size: 0.95rem; font-weight: 800; color: #1e3a8a; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.45rem;">
          <span>⚡</span> LỐI TẮT TRUY CẬP NHANH HỆ THỐNG
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
          <button onclick="if(window.app) window.app.switchView('years');" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer; transition: all 0.2s;">
            <span style="font-size: 1.4rem;">📅</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: #334155;">Năm học & Kỳ</span>
          </button>
          <button onclick="if(window.app) window.app.switchView('classes');" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer; transition: all 0.2s;">
            <span style="font-size: 1.4rem;">🏫</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: #334155;">Lớp THCS</span>
          </button>
          <button onclick="if(window.app) window.app.switchView('subjects');" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer; transition: all 0.2s;">
            <span style="font-size: 1.4rem;">📚</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: #334155;">Môn học 2018</span>
          </button>
          <button onclick="if(window.app) window.app.switchView('teachers');" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer; transition: all 0.2s;">
            <span style="font-size: 1.4rem;">👨‍🏫</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: #334155;">Giáo viên</span>
          </button>
          <button onclick="if(window.app) window.app.switchView('students');" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer; transition: all 0.2s;">
            <span style="font-size: 1.4rem;">🎓</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: #334155;">Học sinh</span>
          </button>
          <button onclick="if(window.app) window.app.switchView('user_groups');" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer; transition: all 0.2s;">
            <span style="font-size: 1.4rem;">👥</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: #334155;">Phân quyền</span>
          </button>
          <button onclick="if(window.app) window.app.switchView('reports');" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer; transition: all 0.2s;">
            <span style="font-size: 1.4rem;">📊</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: #334155;">Báo cáo</span>
          </button>
          <button onclick="if(window.app) window.app.switchView('ai_hub');" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer; transition: all 0.2s;">
            <span style="font-size: 1.4rem;">🤖</span>
            <span style="font-size: 0.78rem; font-weight: 700; color: #334155;">Trợ lý AI</span>
          </button>
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
      name: 'THCS AMA TRANG LƠNG',
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
              🏛️ THÔNG TIN TRƯỜNG HỌC THCS AMA TRANG LƠNG
            </h2>
            <p style="margin: 0.25rem 0 0 0; color: #64748b; font-size: 0.88rem; font-weight: 600;">Khai báo thông tin chung chuẩn hồ sơ Giáo dục & Đào tạo</p>
          </div>
          <span style="font-size: 0.8rem; font-weight: 800; color: #10b981; background: #ecfdf5; padding: 0.35rem 0.85rem; border-radius: 20px; border: 1px solid #a7f3d0;">GDPT 2018</span>
        </div>

        <form id="form-school-info-view" onsubmit="event.preventDefault(); window.app.saveSchoolInfo(this);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="form-group">
              <label style="font-weight: 800; color: #0f172a; display: block; margin-bottom: 0.4rem; font-size: 0.9rem;">Tên Trường Hợp Quy:</label>
              <input type="text" name="name" class="form-control" value="${info.name || 'THCS AMA TRANG LƠNG'}" required style="font-weight: bold; height: 42px; border-radius: 10px;">
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
      { id: 'ai_picker', name: '17. Quét AI gọi học sinh' },
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
    const users = db.state.users || [];
    const groups = db.state.userGroups || [];

    const searchQuery = (this.userSearchQuery || '').toLowerCase();
    const selectedGroup = this.userFilterGroup || 'all';

    const filteredUsers = users.filter(u => {
      const matchSearch = !searchQuery || u.name.toLowerCase().includes(searchQuery) || u.username.toLowerCase().includes(searchQuery);
      const matchGroup = selectedGroup === 'all' || u.groupId === selectedGroup;
      return matchSearch && matchGroup;
    });

    dom.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="background: white; padding: 1.25rem 1.5rem; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; flex: 1;">
              <input type="text" id="user-search-input" placeholder="Lọc theo họ và tên, tên đăng nhập..." value="${this.userSearchQuery || ''}" class="form-control" style="height: 38px; border-radius: 8px; width: 280px; font-weight: 600;">
              <select id="user-group-filter" class="form-control" style="height: 38px; border-radius: 8px; width: 200px; font-weight: 700;">
                <option value="all">-- Tất cả Nhóm --</option>
                ${groups.map(g => `<option value="${g.id}" ${selectedGroup === g.id ? 'selected' : ''}>${g.name}</option>`).join('')}
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
                <th style="padding: 0.65rem 1rem; width: 140px; font-weight: 800; text-align: center;">Thao tác</th>
                <th style="padding: 0.65rem 0.85rem; width: 60px; font-weight: 800; text-align: center;">STT</th>
                <th style="padding: 0.65rem 1.25rem; font-weight: 800;">Tên đăng nhập</th>
                <th style="padding: 0.65rem 1.25rem; font-weight: 800;">Họ và tên cán bộ / GV</th>
              </tr>
            </thead>
            <tbody>
              ${filteredUsers.length > 0 ? filteredUsers.map((u, idx) => `
                <tr style="border-bottom: 1px solid #e2e8f0; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  <td style="padding: 0.75rem 0.85rem; text-align: center;"><input type="checkbox" class="user-row-cb" data-user-id="${u.id}" style="transform: scale(1.15); cursor: pointer;"></td>
                  <td style="padding: 0.75rem 0.5rem; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                      <button title="Sửa tên" onclick="if(window.app) window.app.showEditUserModal('${u.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer;" class="icon-only-btn"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                      <button title="Khóa/Mở khóa" onclick="if(window.app) window.app.toggleUserLock('${u.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer; font-size: 0.95rem;">${u.status === 'locked' ? '🔒' : '🔓'}</button>
                      <button title="Reset mật khẩu" onclick="if(window.app) window.app.resetSingleUserPassword('${u.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer; font-size: 0.95rem;">🔑</button>
                      <button title="Xóa người dùng" onclick="if(window.app) window.app.deleteUserGroup('${u.id}');" style="background: transparent; border: none; padding: 0.3rem; cursor: pointer;" class="icon-only-btn"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s ease;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                    </div>
                  </td>
                  <td style="padding: 0.75rem 0.85rem; text-align: center; font-weight: 700; color: #475569;">${idx + 1}</td>
                  <td style="padding: 0.75rem 1.25rem; font-weight: 800; color: #2563eb;">${u.username}</td>
                  <td style="padding: 0.75rem 1.25rem; font-weight: 800; color: #0f172a;">${u.name}</td>
                </tr>
              `).join('') : `
                <tr><td colspan="5" style="text-align: center; padding: 3rem; color: #94a3b8; font-weight: 700;">Không tìm thấy người dùng nào.</td></tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const inputQuery = dom.querySelector('#user-search-input');
    const inputGroup = dom.querySelector('#user-group-filter');
    const btnSearch = dom.querySelector('#btn-search-users');

    if (inputQuery) inputQuery.oninput = () => { this.userSearchQuery = inputQuery.value; };
    if (inputGroup) inputGroup.onchange = () => { this.userFilterGroup = inputGroup.value; this.render_user_management(dom); };
    if (btnSearch) btnSearch.onclick = () => { if (inputQuery) this.userSearchQuery = inputQuery.value; this.render_user_management(dom); };
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

}



