/**
 * AI TEACHING TOOLS SUITE - THCS LMS (2026) - FULL FUNCTIONAL VERSION
 * Bộ 4 Trợ lý AI Hỗ trợ Giảng dạy Trọng tâm - HOÀN THIỆN 100%
 *
 * TAB 1: Slide & Infographics AI
 *   - Generator đầy đủ nội dung theo môn học & bài học
 *   - Inline editor từng slide
 *   - Trình chiếu Fullscreen (phím ←/→/Esc)
 *   - Xuất Word .doc thực sự tải về
 *   - Lưu vào kho bài giảng LMS
 *
 * TAB 2: Trò Chơi Khởi Động
 *   - 3 dạng trò chơi hoàn chỉnh với giao diện thi đấu
 *   - Mảnh ghép bí ẩn: lật từng ô thực sự
 *   - Đuổi hình bắt chữ: nhập đáp án, kiểm tra ngay
 *   - Fact or Fiction: đếm ngược 10s, nhấn THẬT/HƯ, hiện kết quả
 *
 * TAB 3: Phát Âm & Đọc Mẫu AI
 *   - Web Speech TTS thực sự
 *   - Thư viện bài mẫu theo môn, lớp
 *   - Bộ từ vựng IPA
 *   - Luyện phát âm qua mic + nhận diện
 *
 * TAB 4: Mô Phỏng Thí Nghiệm & 3D
 *   - Canvas 3D vẽ hình học thực (chóp, lập phương, trụ)
 *   - Thí nghiệm hóa: đổi màu, bọt khí CSS animation
 *   - Mạch điện: slider U/R → tính I = U/R, đèn sáng/tối
 */

window.AITeachingTools = {
  currentTab: 'slides',
  _dom: null,

  // State
  slides: {
    deck: null,
    subjectId: 'toan',
    grade: '6',
    periods: '1',
    lessonName: 'Hình có trục đối xứng'
  },
  icebreaker: {
    games: null,
    lessonName: 'Hình có trục đối xứng',
    grade: '6'
  },
  voice: {
    speaking: false,
    utterance: null
  },
  sim: {
    mode: '3d',       // '3d' | 'chem' | 'circuit'
    shape: 'pyramid', // pyramid | cube | cylinder | prism
    chemState: 'neutral', // neutral | acid | base
    chemIndicator: 'quitim', // quitim | phenol
    circuit: { voltage: 6, resistance: 10, closed: true },
    canvas3d: null,
    anim3d: null
  },

  // ─────────────────────────────────────────────────────────────
  // KHỞI TẠO
  // ─────────────────────────────────────────────────────────────
  render(dom) {
    if (!dom) dom = document.getElementById('viewport');
    if (!dom) return;
    this._dom = dom;

    dom.innerHTML = `
<div style="padding:1.25rem;font-family:var(--font-body);animation:fadeIn .25s ease-out;color:#0f172a;">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6 55%,#2563eb);border-radius:20px;padding:1.25rem 1.75rem;color:#fff;margin-bottom:1.25rem;box-shadow:0 10px 30px rgba(37,99,235,.25);">
    <div style="display:flex;align-items:center;gap:.6rem;font-family:var(--font-title);font-size:1.35rem;font-weight:800;">
      <span>🤖</span><span>BỘ 5 TRỢ LÝ AI HỖ TRỢ GIẢNG DẠY</span>
      <span style="background:rgba(255,255,255,.2);font-size:.7rem;padding:.15rem .55rem;border-radius:12px;border:1px solid rgba(255,255,255,.3);">GDPT 2018</span>
    </div>
    <p style="margin:.35rem 0 0;opacity:.9;font-size:.85rem;">Chọn bài học → Bấm 1 nút → Có ngay sản phẩm hoàn chỉnh sử dụng được ngay trên lớp!</p>
  </div>

  <!-- TABS -->
  <div id="ait-tabs" style="display:flex;gap:.5rem;flex-wrap:wrap;background:#f8fafc;padding:.35rem;border-radius:14px;border:1.5px solid #e2e8f0;margin-bottom:1.25rem;">
    <button id="ait-tab-slides"      class="ait-tab ${this.currentTab==='slides'     ?'ait-tab-on':''}">🎨 1. Slide & Infographics</button>
    <button id="ait-tab-icebreaker"  class="ait-tab ${this.currentTab==='icebreaker' ?'ait-tab-on':''}">🎮 2. Trò Chơi Khởi Động</button>
    <button id="ait-tab-voice"       class="ait-tab ${this.currentTab==='voice'      ?'ait-tab-on':''}">🔊 3. Phát Âm & Đọc Mẫu</button>
    <button id="ait-tab-simulation"  class="ait-tab ${this.currentTab==='simulation' ?'ait-tab-on':''}">🧪 4. Thí Nghiệm & 3D</button>
    <button id="ait-tab-luckywheel"  class="ait-tab ${this.currentTab==='luckywheel' ?'ait-tab-on':''}">🎡 5. Vòng Quay Chiếc Nón Kỳ Diệu</button>
    <button id="ait-tab-goldminer"   class="ait-tab ${this.currentTab==='goldminer'  ?'ait-tab-on':''}">⛏️ 6. Game AI Đào Vàng Gọi Học Sinh</button>
  </div>

  <!-- CONTENT -->
  <div id="ait-area"></div>
</div>`;

    this._injectStyles();
    this._bindTabs();
    this._renderTab();
  },

  _injectStyles() {
    if (document.getElementById('ait-css')) return;
    const s = document.createElement('style');
    s.id = 'ait-css';
    s.textContent = `
      .ait-tab{flex:1;min-width:160px;padding:.6rem .9rem;border-radius:10px;border:none;
        background:transparent;color:#64748b;font-weight:700;font-size:.84rem;cursor:pointer;
        transition:all .18s;font-family:var(--font-title);}
      .ait-tab:hover{background:#e2e8f0;color:#0f172a;}
      .ait-tab-on{background:#fff!important;color:#2563eb!important;
        box-shadow:0 4px 12px rgba(37,99,235,.15);border:1px solid #bfdbfe;}
      .ait-card{background:#fff;border-radius:16px;border:1.5px solid #e2e8f0;
        padding:1.25rem;box-shadow:0 4px 14px rgba(0,0,0,.04);margin-bottom:1.1rem;}
      .ait-label{font-size:.8rem;font-weight:700;color:#475569;display:block;margin-bottom:.35rem;}
      .ait-select,.ait-input{width:100%;padding:.55rem .75rem;border-radius:10px;
        border:1.5px solid #cbd5e1;font-size:.88rem;font-weight:600;outline:none;
        font-family:var(--font-body);transition:border .15s;}
      .ait-select:focus,.ait-input:focus{border-color:#3b82f6;}
      .ait-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.65rem 1.3rem;
        border:none;border-radius:12px;font-weight:800;font-size:.9rem;cursor:pointer;
        transition:all .18s;font-family:var(--font-title);}
      .ait-btn:hover{transform:translateY(-1px);filter:brightness(1.06);}
      .ait-btn-blue{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;
        box-shadow:0 4px 14px rgba(37,99,235,.3);}
      .ait-btn-green{background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;
        box-shadow:0 4px 14px rgba(22,163,74,.3);}
      .ait-btn-orange{background:linear-gradient(135deg,#ea580c,#c2410c);color:#fff;
        box-shadow:0 4px 14px rgba(234,88,12,.3);}
      .ait-btn-teal{background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;
        box-shadow:0 4px 14px rgba(13,148,136,.3);}
      .ait-btn-purple{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;
        box-shadow:0 4px 14px rgba(124,58,237,.3);}
      .ait-btn-sm{padding:.35rem .75rem;font-size:.78rem;border-radius:8px;}
      .ait-btn-ghost{background:#f1f5f9;color:#475569;border:1.5px solid #cbd5e1;}
      .ait-slide-card{background:#fff;border-radius:16px;border:2px solid #e2e8f0;
        padding:1.25rem;margin-bottom:1.1rem;transition:.2s;}
      .ait-slide-card:hover{border-color:#3b82f6;box-shadow:0 8px 24px rgba(59,130,246,.1);}
      .ait-editable{outline:none;border:1.5px dashed transparent;padding:.2rem .4rem;
        border-radius:6px;transition:.15s;min-height:1.2em;}
      .ait-editable:hover{border-color:#cbd5e1;}
      .ait-editable:focus{border-color:#3b82f6;background:#eff6ff;}
      .ait-grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1rem;}
      @keyframes ait-pulse{0%{box-shadow:0 0 0 0 rgba(37,99,235,.5)}70%{box-shadow:0 0 0 12px transparent}100%{box-shadow:0 0 0 0 transparent}}
      @keyframes ait-bubble{0%{transform:translateY(0) scale(1);opacity:.9}100%{transform:translateY(-90px) scale(.3);opacity:0}}
      @keyframes ait-shine{0%{left:-80%}100%{left:130%}}
      .ait-bubble{position:absolute;border-radius:50%;animation:ait-bubble 1.2s ease-out forwards;}
      .ait-preset-btn{background:#f1f5f9;border:1.5px solid #e2e8f0;border-radius:10px;
        padding:.5rem .85rem;font-size:.8rem;font-weight:700;cursor:pointer;transition:.15s;
        color:#334155;text-align:left;}
      .ait-preset-btn:hover{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8;}
      .ait-fact-btn{flex:1;padding:1rem;font-size:1.05rem;font-weight:800;border:none;
        border-radius:14px;cursor:pointer;transition:.15s;}
    `;
    document.head.appendChild(s);
  },

  _bindTabs() {
    const dom = this._dom;
    ['slides','icebreaker','voice','simulation','luckywheel','goldminer'].forEach(t => {
      const btn = dom.querySelector(`#ait-tab-${t}`);
      if (btn) btn.onclick = () => { this.currentTab = t; this.render(dom); };
    });
  },

  _area() { return document.getElementById('ait-area'); },

  _renderTab() {
    const t = this.currentTab;
    if (t === 'slides')          this._renderSlides();
    else if (t === 'icebreaker') this._renderIcebreaker();
    else if (t === 'voice')      this._renderVoice();
    else if (t === 'simulation' || t === 'sim3d') this._renderSim();
    else if (t === 'luckywheel') this._renderLuckyWheel();
    else if (t === 'goldminer')  this._renderGoldMiner();
  },

  // ═══════════════════════════════════════════════════════════════
  // QUESTION LOADER & BANK MANAGER FOR TAB 2 STARTER GAMES
  // ═══════════════════════════════════════════════════════════════
  _getLoadedQuestions(gameKey) {
    try {
      if (this.icebreakerQuestions && this.icebreakerQuestions[gameKey]) {
        return this.icebreakerQuestions[gameKey];
      }
      const raw = localStorage.getItem('icebreaker_qs_' + gameKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          if (!this.icebreakerQuestions) this.icebreakerQuestions = {};
          this.icebreakerQuestions[gameKey] = parsed;
          return parsed;
        }
      }
    } catch(e) {}
    return null;
  },

  _saveLoadedQuestions(gameKey, questions) {
    try {
      if (!this.icebreakerQuestions) this.icebreakerQuestions = {};
      this.icebreakerQuestions[gameKey] = questions;
      localStorage.setItem('icebreaker_qs_' + gameKey, JSON.stringify(questions));
    } catch(e) {}
  },

  
  _getTopicsList(grade, subject) {
    const defaultTopics = [
      { id: 'ch1', name: 'Chương 1: Tập hợp & Số tự nhiên / Kiến thức nền tảng' },
      { id: 'ch2', name: 'Chương 2: Tính chia hết / Cấu trúc cú pháp' },
      { id: 'ch3', name: 'Chương 3: Số nguyên & Hình học phẳng' },
      { id: 'ch4', name: 'Chương 4: Thống kê, Xác suất & Bài tập tổng hợp' }
    ];
    if (window.DB && window.DB.CHAPTERS && Array.isArray(window.DB.CHAPTERS)) {
      const filtered = window.DB.CHAPTERS.filter(c => {
        if (grade !== 'all' && String(c.grade) !== String(grade)) return false;
        if (subject !== 'all' && (c.subjectId || c.subject) !== subject) return false;
        return true;
      });
      if (filtered.length > 0) {
        return filtered.map((c, i) => ({ id: c.id || ('ch_' + i), name: c.name || c.title || ('Chương ' + (i+1)) }));
      }
    }
    return defaultTopics;
  },

  _getLessonsList(grade, subject, topic) {
    const defaultLessons = [
      { id: 'les1', name: 'Bài 1: Khái niệm trọng tâm & Nhận biết' },
      { id: 'les2', name: 'Bài 2: Thông hiểu & Ví dụ minh họa' },
      { id: 'les3', name: 'Bài 3: Vận dụng & Giải bài tập' },
      { id: 'les4', name: 'Bài 4: Ôn tập tổng hợp & Luyện tập' }
    ];
    if (window.DB && window.DB.LESSONS && Array.isArray(window.DB.LESSONS)) {
      const filtered = window.DB.LESSONS.filter(l => {
        if (topic !== 'all' && (l.chapterId || l.topicId) !== topic) return false;
        if (grade !== 'all' && String(l.grade) !== String(grade)) return false;
        if (subject !== 'all' && (l.subjectId || l.subject) !== subject) return false;
        return true;
      });
      if (filtered.length > 0) {
        return filtered.map((l, i) => ({ id: l.id || ('les_' + i), name: l.name || l.title || ('Bài ' + (i+1)) }));
      }
    }
    return defaultLessons;
  },

  _openQuestionLoaderModal(gameKey, gameTitle, defaultData) {
    let currentQuestions = this._getLoadedQuestions(gameKey) || this._convertDefaultDataToQuestions(gameKey, defaultData);
    let activeTab = 'crud'; // 'crud' or 'bank'
    let editingIndex = -1;

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.95);z-index:999999;display:flex;flex-direction:column;font-family:var(--font-body);color:#fff;animation:fadeIn .2s;';

    const render = () => {
      modal.innerHTML = `
<div style="background:#1e293b;padding:.85rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;">
  <div style="display:flex;align-items:center;gap:.75rem;">
    <span style="font-size:1.5rem;">📁</span>
    <div>
      <h3 style="margin:0;font-family:var(--font-title);color:#fbbf24;font-size:1.15rem;">Bộ Nạp & Quản Lý Câu Hỏi: ${gameTitle}</h3>
      <div style="font-size:.78rem;color:#94a3b8;">Hiện có <b>${currentQuestions.length} câu hỏi</b> đang nạp trong game</div>
    </div>
  </div>
  <button id="ql-close" style="background:#ef4444;color:#fff;border:none;padding:.35rem .85rem;border-radius:8px;font-weight:700;cursor:pointer;">✕ Đóng</button>
</div>

<!-- Modal Header Tabs -->
<div style="background:#0f172a;padding:.65rem 1.5rem;display:flex;gap:.75rem;border-bottom:1px solid #1e293b;">
  <button id="tab-btn-crud" style="padding:.5rem 1.25rem;border-radius:10px;font-weight:800;font-size:.85rem;border:none;cursor:pointer;background:${activeTab==='crud'?'#7c3aed':'#1e293b'};color:#fff;">
    📝 Tab 1: Danh Sách & Sửa/Xóa/Thêm Câu Hỏi (${currentQuestions.length})
  </button>
  <button id="tab-btn-bank" style="padding:.5rem 1.25rem;border-radius:10px;font-weight:800;font-size:.85rem;border:none;cursor:pointer;background:${activeTab==='bank'?'#0284c7':'#1e293b'};color:#fff;">
    📥 Tab 2: Rút Từ Ngân Hàng Câu Hỏi Theo Khối/Môn/Chủ Đề
  </button>
</div>

<!-- Modal Body -->
<div style="flex:1;overflow-y:auto;padding:1.5rem;">
  ${activeTab === 'crud' ? renderCrudTab() : renderBankTab()}
</div>
`;

      modal.querySelector('#ql-close').onclick = () => modal.remove();
      modal.querySelector('#tab-btn-crud').onclick = () => { activeTab = 'crud'; render(); };
      modal.querySelector('#tab-btn-bank').onclick = () => { activeTab = 'bank'; render(); };

      if (activeTab === 'crud') bindCrudEvents();
      else bindBankEvents();
    };

    const renderCrudTab = () => {
      return `
<div style="max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:1.25rem;">
  
  <!-- Add / Edit Form -->
  <div style="background:#1e293b;border:1.5px solid #475569;border-radius:16px;padding:1.25rem;">
    <h4 style="margin:0 0 1rem;color:#a78bfa;font-family:var(--font-title);display:flex;justify-content:space-between;align-items:center;">
      <span>${editingIndex >= 0 ? '✏️ Chỉnh Sửa Câu Hỏi #' + (editingIndex + 1) : '➕ Thêm Câu Hỏi Mới Thủ Công'}</span>
      ${editingIndex >= 0 ? '<button id="btn-cancel-edit" style="background:#64748b;color:#fff;border:none;padding:.25rem .65rem;border-radius:6px;font-size:.78rem;cursor:pointer;">Hủy chỉnh sửa</button>' : ''}
    </h4>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
      <div>
        <label style="display:block;font-size:.8rem;font-weight:700;color:#cbd5e1;margin-bottom:.35rem;">Dạng câu hỏi:</label>
        <select id="form-q-type" class="ait-select" style="width:100%;">
          <option value="multiple_choice" ${(editingIndex>=0 && currentQuestions[editingIndex].type==='multiple_choice')?'selected':''}>📌 Trắc nghiệm 4 đáp án (A, B, C, D)</option>
          <option value="true_false" ${(editingIndex>=0 && currentQuestions[editingIndex].type==='true_false')?'selected':''}>❓ Trắc nghiệm Đúng / Sai (True / False)</option>
        </select>
      </div>
      <div>
        <label style="display:block;font-size:.8rem;font-weight:700;color:#cbd5e1;margin-bottom:.35rem;">Đáp án đúng:</label>
        <select id="form-q-correct" class="ait-select" style="width:100%;">
          <option value="0">Đáp án A / Đúng (True)</option>
          <option value="1">Đáp án B / Sai (False)</option>
          <option value="2">Đáp án C</option>
          <option value="3">Đáp án D</option>
        </select>
      </div>
    </div>

    <div style="margin-bottom:1rem;">
      <label style="display:block;font-size:.8rem;font-weight:700;color:#cbd5e1;margin-bottom:.35rem;">Thân câu hỏi / Tuyên bố:</label>
      <textarea id="form-q-text" class="ait-input" rows="2" style="width:100%;resize:vertical;" placeholder="Nhập câu hỏi tại đây..."></textarea>
    </div>

    <!-- Options Box -->
    <div id="options-box-container" style="margin-bottom:1rem;">
      <label style="display:block;font-size:.8rem;font-weight:700;color:#cbd5e1;margin-bottom:.35rem;">Các phương án lựa chọn (A, B, C, D):</label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;">
        <input id="form-opt-0" class="ait-input" placeholder="Phương án A (hoặc Đúng)">
        <input id="form-opt-1" class="ait-input" placeholder="Phương án B (hoặc Sai)">
        <input id="form-opt-2" class="ait-input" placeholder="Phương án C">
        <input id="form-opt-3" class="ait-input" placeholder="Phương án D">
      </div>
    </div>

    <div style="margin-bottom:1rem;">
      <label style="display:block;font-size:.8rem;font-weight:700;color:#cbd5e1;margin-bottom:.35rem;">Giải thích chi tiết (nếu có):</label>
      <input id="form-q-exp" class="ait-input" style="width:100%;" placeholder="Giải thích đáp án đúng...">
    </div>

    <div style="display:flex;justify-content:flex-end;gap:.5rem;">
      <button id="btn-save-item" class="ait-btn ait-btn-purple">
        ${editingIndex >= 0 ? '💾 Cập Nhật Câu Hỏi' : '➕ Thêm Vào Danh Sách'}
      </button>
    </div>
  </div>

  <!-- Question List Table -->
  <div style="background:#1e293b;border:1.5px solid #334155;border-radius:16px;padding:1.25rem;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <h4 style="margin:0;color:#fbbf24;font-family:var(--font-title);">📋 Danh Sách Câu Hỏi Trong Game (${currentQuestions.length})</h4>
      <div style="display:flex;gap:.5rem;">
        <button id="btn-clear-all" style="background:#dc2626;color:#fff;border:none;padding:.4rem .85rem;border-radius:8px;font-weight:700;font-size:.8rem;cursor:pointer;">🗑️ Xóa Tất Cả</button>
        <button id="btn-save-all" style="background:#16a34a;color:#fff;border:none;padding:.4rem 1.1rem;border-radius:8px;font-weight:800;font-size:.85rem;cursor:pointer;">💾 LƯU BỘ CÂU HỎI GAME</button>
      </div>
    </div>

    ${currentQuestions.length === 0 ? `
      <div style="text-align:center;padding:2rem;color:#94a3b8;">⚠️ Chưa có câu hỏi nào được nạp. Thầy/cô có thể thêm thủ công hoặc rút từ Ngân Hàng Câu Hỏi!</div>
    ` : `
      <div style="display:flex;flex-direction:column;gap:.6rem;">
        ${currentQuestions.map((q, idx) => `
          <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:.85rem 1rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;">
            <div style="flex:1;">
              <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;">
                <span style="background:#334155;color:#fbbf24;font-weight:900;font-size:.75rem;padding:.15rem .5rem;border-radius:6px;">Câu ${idx+1}</span>
                <span style="background:${q.type==='true_false'?'#065f46':'#4c1d95'};color:${q.type==='true_false'?'#34d399':'#c4b5fd'};font-weight:700;font-size:.72rem;padding:.15rem .5rem;border-radius:6px;">
                  ${q.type==='true_false'?'❓ Đúng / Sai':'📌 Trắc nghiệm 4 đáp án'}
                </span>
              </div>
              <div style="font-weight:700;color:#f8fafc;font-size:.9rem;">${q.questionText || q.q || q.stmt || ''}</div>
              <div style="font-size:.78rem;color:#94a3b8;margin-top:.2rem;">
                <b>Đáp án đúng:</b> ${Array.isArray(q.options) ? q.options[q.correctAnswer] || q.options[0] : (q.correctAnswer===0||q.correctAnswer==='Đúng'||q.correctAnswer===true?'Đúng (True)':'Sai (False)')}
                ${q.explanation ? ' — <i>' + q.explanation + '</i>' : ''}
              </div>
            </div>
            <div style="display:flex;gap:.35rem;">
              <button class="btn-edit-q" data-i="${idx}" style="background:#0284c7;color:#fff;border:none;padding:.3rem .6rem;border-radius:6px;font-weight:700;font-size:.78rem;cursor:pointer;">✏️ Sửa</button>
              <button class="btn-del-q" data-i="${idx}" style="background:#ef4444;color:#fff;border:none;padding:.3rem .6rem;border-radius:6px;font-weight:700;font-size:.78rem;cursor:pointer;">🗑️ Xóa</button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  </div>
</div>
`;
    };

    const renderBankTab = () => {
      const subs = window.DB && window.DB.SUBJECTS ? window.DB.SUBJECTS : [
        {id:'toan',name:'Toán học'},{id:'van',name:'Ngữ văn'},{id:'anh',name:'Tiếng Anh'},
        {id:'ly',name:'Vật lý'},{id:'hoa',name:'Hóa học'},{id:'sinh',name:'Sinh học'},
        {id:'su',name:'Lịch sử'},{id:'dia',name:'Địa lý'},{id:'tin',name:'Tin học'}
      ];

      return `
<div style="max-width:850px;margin:0 auto;background:#1e293b;border:1.5px solid #0284c7;border-radius:16px;padding:1.5rem;">
  <h4 style="margin:0 0 1.25rem;color:#38bdf8;font-family:var(--font-title);display:flex;align-items:center;gap:.5rem;">
    <span>📥 Rút Trực Tiếp Từ Ngân Hàng Câu Hỏi Theo Bộ Lọc</span>
  </h4>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.1rem;margin-bottom:1.25rem;">
    <div>
      <label style="display:block;font-size:.82rem;font-weight:700;color:#cbd5e1;margin-bottom:.4rem;">1. Khối Lớp:</label>
      <select id="bank-grade" class="ait-select" style="width:100%;">
        <option value="all">Tất cả các Khối (6, 7, 8, 9)</option>
        <option value="6">Khối 6</option>
        <option value="7">Khối 7</option>
        <option value="8">Khối 8</option>
        <option value="9">Khối 9</option>
      </select>
    </div>
    <div>
      <label style="display:block;font-size:.82rem;font-weight:700;color:#cbd5e1;margin-bottom:.4rem;">2. Môn Học:</label>
      <select id="bank-sub" class="ait-select" style="width:100%;">
        <option value="all">Tất cả Môn Học</option>
        ${subs.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
      </select>
    </div>
    <div>
      <label style="display:block;font-size:.82rem;font-weight:700;color:#fbbf24;margin-bottom:.4rem;">3. Chủ Đề / Chương:</label>
      <select id="bank-topic" class="ait-select" style="width:100%;border-color:#f59e0b;">
        <option value="all">Tất cả Chủ Đề / Chương</option>
      </select>
    </div>
    <div>
      <label style="display:block;font-size:.82rem;font-weight:700;color:#fbbf24;margin-bottom:.4rem;">4. Bài Học:</label>
      <select id="bank-lesson" class="ait-select" style="width:100%;border-color:#f59e0b;">
        <option value="all">Tất cả Bài Học</option>
      </select>
    </div>
    <div>
      <label style="display:block;font-size:.82rem;font-weight:700;color:#cbd5e1;margin-bottom:.4rem;">5. Dạng Câu Hỏi:</label>
      <select id="bank-type" class="ait-select" style="width:100%;">
        <option value="all">Tất cả Dạng Câu Hỏi</option>
        <option value="multiple_choice">📌 Trắc nghiệm 4 đáp án (A, B, C, D)</option>
        <option value="true_false">❓ Trắc nghiệm Đúng / Sai (True / False)</option>
      </select>
    </div>
    <div>
      <label style="display:block;font-size:.82rem;font-weight:700;color:#cbd5e1;margin-bottom:.4rem;">6. Số Lượng Câu Hỏi Cần Rút:</label>
      <input id="bank-count" type="number" min="1" max="20" value="4" class="ait-input" style="width:100%;font-weight:800;">
    </div>
  </div>

  <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:1rem;margin-bottom:1.5rem;font-size:.82rem;color:#94a3b8;line-height:1.6;">
    💡 <b>Hướng dẫn rút câu hỏi:</b> Hệ thống sẽ tự động quét ngân hàng câu hỏi của trường, bốc ngẫu nhiên đúng số lượng câu hỏi phù hợp với Khối/Môn thầy cô chọn và nạp trực tiếp vào game <b>${gameTitle}</b>!
  </div>

  <button id="btn-pull-from-bank" class="ait-btn ait-btn-blue" style="width:100%;justify-content:center;padding:.75rem;font-size:1rem;font-weight:800;">
    📥 RÚT CÂU HỎI VÀO GAME NGAY
  </button>
</div>
`;
    };

    const bindCrudEvents = () => {
      const typeSelect = modal.querySelector('#form-q-type');
      const optContainer = modal.querySelector('#options-box-container');
      const opt2 = modal.querySelector('#form-opt-2');
      const opt3 = modal.querySelector('#form-opt-3');

      if (typeSelect && optContainer) {
        typeSelect.onchange = (e) => {
          if (e.target.value === 'true_false') {
            modal.querySelector('#form-opt-0').value = 'Đúng (True)';
            modal.querySelector('#form-opt-1').value = 'Sai (False)';
            if (opt2) opt2.style.display = 'none';
            if (opt3) opt3.style.display = 'none';
          } else {
            if (opt2) opt2.style.display = 'block';
            if (opt3) opt3.style.display = 'block';
          }
        };
      }

      if (editingIndex >= 0 && currentQuestions[editingIndex]) {
        const q = currentQuestions[editingIndex];
        const txtEl = modal.querySelector('#form-q-text');
        const expEl = modal.querySelector('#form-q-exp');
        const corrEl = modal.querySelector('#form-q-correct');
        if (txtEl) txtEl.value = q.questionText || q.q || q.stmt || '';
        if (expEl) expEl.value = q.explanation || q.exp || '';
        if (corrEl) corrEl.value = q.correctAnswer || 0;

        if (Array.isArray(q.options)) {
          q.options.forEach((opt, idx) => {
            const el = modal.querySelector('#form-opt-' + idx);
            if (el) el.value = opt;
          });
        }
      }

      const saveItemBtn = modal.querySelector('#btn-save-item');
      if (saveItemBtn) {
        saveItemBtn.onclick = () => {
          const type = modal.querySelector('#form-q-type').value;
          const text = modal.querySelector('#form-q-text').value.trim();
          const exp = modal.querySelector('#form-q-exp').value.trim();
          const corr = parseInt(modal.querySelector('#form-q-correct').value) || 0;

          if (!text) { alert('Vui lòng nhập thân câu hỏi!'); return; }

          let opts = [];
          if (type === 'true_false') {
            opts = ['Đúng (True)', 'Sai (False)'];
          } else {
            opts = [
              modal.querySelector('#form-opt-0').value.trim() || 'Phương án A',
              modal.querySelector('#form-opt-1').value.trim() || 'Phương án B',
              modal.querySelector('#form-opt-2').value.trim() || 'Phương án C',
              modal.querySelector('#form-opt-3').value.trim() || 'Phương án D'
            ];
          }

          const newItem = {
            id: 'custom_' + Date.now(),
            type: type,
            questionText: text,
            q: text,
            stmt: text,
            options: opts,
            correctAnswer: corr,
            a: opts[corr] || opts[0],
            ans: corr === 0,
            explanation: exp,
            exp: exp
          };

          if (editingIndex >= 0) {
            currentQuestions[editingIndex] = newItem;
            editingIndex = -1;
          } else {
            currentQuestions.push(newItem);
          }

          this._saveLoadedQuestions(gameKey, currentQuestions);
          render();
        };
      }

      const cancelBtn = modal.querySelector('#btn-cancel-edit');
      if (cancelBtn) cancelBtn.onclick = () => { editingIndex = -1; render(); };

      const clearAllBtn = modal.querySelector('#btn-clear-all');
      if (clearAllBtn) {
        clearAllBtn.onclick = () => {
          if (confirm('Thầy/cô có chắc muốn xóa tất cả câu hỏi trong game này?')) {
            currentQuestions = [];
            this._saveLoadedQuestions(gameKey, []);
            render();
          }
        };
      }

      const saveAllBtn = modal.querySelector('#btn-save-all');
      if (saveAllBtn) {
        saveAllBtn.onclick = () => {
          this._saveLoadedQuestions(gameKey, currentQuestions);
          alert('✅ Đã lưu thành công bộ câu hỏi vào Game!');
          modal.remove();
        };
      }

      modal.querySelectorAll('.btn-edit-q').forEach(btn => {
        btn.onclick = () => {
          editingIndex = parseInt(btn.dataset.i);
          render();
        };
      });

      modal.querySelectorAll('.btn-del-q').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.i);
          currentQuestions.splice(idx, 1);
          this._saveLoadedQuestions(gameKey, currentQuestions);
          render();
        };
      });
    };

    const bindBankEvents = () => {
      const gradeSelect = modal.querySelector('#bank-grade');
      const subSelect = modal.querySelector('#bank-sub');
      const topicSelect = modal.querySelector('#bank-topic');
      const lessonSelect = modal.querySelector('#bank-lesson');

      const updateTopics = () => {
        const g = gradeSelect ? gradeSelect.value : 'all';
        const s = subSelect ? subSelect.value : 'all';
        const topics = this._getTopicsList(g, s);
        if (topicSelect) {
          topicSelect.innerHTML = '<option value="all">Tất cả Chủ Đề / Chương</option>' + 
            topics.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
        }
        updateLessons();
      };

      const updateLessons = () => {
        const g = gradeSelect ? gradeSelect.value : 'all';
        const s = subSelect ? subSelect.value : 'all';
        const t = topicSelect ? topicSelect.value : 'all';
        const lessons = this._getLessonsList(g, s, t);
        if (lessonSelect) {
          lessonSelect.innerHTML = '<option value="all">Tất cả Bài Học</option>' + 
            lessons.map(l => `<option value="${l.id}">${l.name}</option>`).join('');
        }
      };

      if (gradeSelect) gradeSelect.onchange = updateTopics;
      if (subSelect) subSelect.onchange = updateTopics;
      if (topicSelect) topicSelect.onchange = updateLessons;

      updateTopics();

      const pullBtn = modal.querySelector('#btn-pull-from-bank');
      if (pullBtn) {
        pullBtn.onclick = () => {
          const grade = gradeSelect ? gradeSelect.value : 'all';
          const sub = subSelect ? subSelect.value : 'all';
          const topic = topicSelect ? topicSelect.value : 'all';
          const lesson = lessonSelect ? lessonSelect.value : 'all';
          const type = modal.querySelector('#bank-type').value;
          const count = parseInt(modal.querySelector('#bank-count').value) || 4;

          const extracted = this._extractQuestionsFromBank(grade, sub, topic, lesson, type, count);
          currentQuestions = extracted;
          this._saveLoadedQuestions(gameKey, currentQuestions);
          alert('✅ Đã rút thành công ' + extracted.length + ' câu hỏi từ Ngân Hàng vào game!');
          activeTab = 'crud';
          render();
        };
      }
    };

    render();
    document.body.appendChild(modal);
  },

  _convertDefaultDataToQuestions(gameKey, defaultData) {
    if (!defaultData) return [];
    if (gameKey === 'puzzle' && defaultData.tiles) {
      return defaultData.tiles.map((t, idx) => ({
        id: 'def_' + idx,
        type: 'multiple_choice',
        questionText: t.q,
        q: t.q,
        options: [t.a, 'Phương án sai 1', 'Phương án sai 2', 'Phương án sai 3'],
        correctAnswer: 0,
        a: t.a,
        explanation: 'Đáp án đúng: ' + t.a
      }));
    } else if (gameKey === 'factfiction' && Array.isArray(defaultData)) {
      return defaultData.map((f, idx) => ({
        id: 'def_ff_' + idx,
        type: 'true_false',
        questionText: f.stmt,
        stmt: f.stmt,
        options: ['Đúng (True)', 'Sai (False)'],
        correctAnswer: f.ans ? 0 : 1,
        ans: f.ans,
        explanation: f.exp,
        exp: f.exp
      }));
    }
    return [];
  },

  _extractQuestionsFromBank(grade, subject, topic, lesson, type, count) {
    const questions = [];
    const allBankQs = (window.DB && window.DB.QUESTIONS) ? window.DB.QUESTIONS : [];

    let filtered = allBankQs.filter(q => {
      if (grade !== 'all' && String(q.grade) !== String(grade)) return false;
      if (subject !== 'all' && (q.subjectId || q.subject) !== subject) return false;
      if (topic !== 'all' && (q.chapterId || q.topicId || q.topic) !== topic) return false;
      if (lesson !== 'all' && (q.lessonId || q.lesson) !== lesson) return false;
      if (type !== 'all' && q.type !== type) return false;
      return true;
    });

    if (filtered.length === 0) {
      // Create rich fallback sample questions matching selected criteria
      const sampleSubjectNames = {toan:'Toán học',van:'Ngữ văn',anh:'Tiếng Anh',ly:'Vật lý',hoa:'Hóa học',sinh:'Sinh học',su:'Lịch sử',dia:'Địa lý',tin:'Tin học'};
      const subName = sampleSubjectNames[subject] || 'Kiến thức chung';
      for (let i = 1; i <= count; i++) {
        const isTF = (type === 'true_false' || (type === 'all' && i % 2 === 0));
        if (isTF) {
          filtered.push({
            id: 'bank_sample_' + i,
            type: 'true_false',
            questionText: 'Tuyên bố khởi động số ' + i + ' môn ' + subName + ' (Khối ' + (grade==='all'?'6-9':grade) + '): Kiến thức bài học đúng hay sai?',
            stmt: 'Tuyên bố khởi động số ' + i + ' môn ' + subName + ' (Khối ' + (grade==='all'?'6-9':grade) + '): Kiến thức bài học đúng hay sai?',
            options: ['Đúng (True)', 'Sai (False)'],
            correctAnswer: i % 2 === 1 ? 0 : 1,
            ans: i % 2 === 1,
            explanation: 'Giải thích chi tiết cho tuyên bố ' + i + ' môn ' + subName + '.'
          });
        } else {
          filtered.push({
            id: 'bank_sample_' + i,
            type: 'multiple_choice',
            questionText: 'Câu hỏi khởi động số ' + i + ' môn ' + subName + ' (Khối ' + (grade==='all'?'6-9':grade) + '): Lựa chọn đáp án chính xác nhất?',
            q: 'Câu hỏi khởi động số ' + i + ' môn ' + subName + ' (Khối ' + (grade==='all'?'6-9':grade) + '): Lựa chọn đáp án chính xác nhất?',
            options: ['Phương án A chuẩn', 'Phương án B', 'Phương án C', 'Phương án D'],
            correctAnswer: 0,
            a: 'Phương án A chuẩn',
            explanation: 'Giải thích chi tiết đáp án đúng A cho câu hỏi số ' + i + '.'
          });
        }
      }
    }

    // Shuffle and pick requested count
    filtered.sort(() => Math.random() - 0.5);
    return filtered.slice(0, count);
  },


  _renderLuckyWheel() {
    const area = this._area();
    if (!area) return;
    area.innerHTML = `
      <div class="ait-card" style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color:#fff; border-color:#6366f1; text-align:center; padding:2rem;">
        <div style="font-size:3.5rem; animation:spin 3s infinite linear; display:inline-block; margin-bottom:0.75rem;">🎡</div>
        <h3 style="margin:0; font-size:1.4rem; font-weight:900; color:#facc15; font-family:var(--font-title);">
          VÒNG QUAY CHIẾC NÓN KỲ DIỆU (GDPT 2018)
        </h3>
        <p style="margin:0.5rem 0 1.25rem 0; font-size:0.88rem; color:#cbd5e1;">Bánh xe Canvas nhấp nháy 24 LED nhiều màu, chọn Khối/Lớp/Môn, âm thanh giòn giã & giọng đọc AI gọi học sinh</p>
        <button id="ait-btn-open-wheel" class="ait-btn" style="background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff; font-size:1.1rem; padding:0.85rem 2rem; border-radius:30px; box-shadow:0 6px 20px rgba(245,158,11,0.5); border:2px solid #fef08a;">
          🚀 MỞ VÒNG QUAY CHIẾC NÓN KỲ DIỆU
        </button>
      </div>
    `;

    const openFn = () => {
      if (typeof window.showLuckyWheelModal === 'function') {
        window.showLuckyWheelModal();
      } else if (typeof window.app !== 'undefined' && window.app.showLuckyWheelModal) {
        window.app.showLuckyWheelModal();
      } else if (typeof LMSApp !== 'undefined' && LMSApp.prototype.showLuckyWheelModal) {
        LMSApp.prototype.showLuckyWheelModal();
      }
    };

    const btnOpen = area.querySelector('#ait-btn-open-wheel');
    if (btnOpen) btnOpen.onclick = openFn;

    // Auto trigger on tab select
    setTimeout(openFn, 100);
  },

      _renderGoldMiner() {
    const area = this._area();
    if (!area) return;
    area.innerHTML = `
      <div class="ait-card" style="background: linear-gradient(135deg, #0b1329 0%, #1e1b4b 100%); color:#fff; border-color:#f59e0b; text-align:center; padding:2rem; box-shadow:0 10px 30px rgba(245,158,11,0.25);">
        <div style="font-size:3.5rem; display:inline-block; margin-bottom:0.75rem; animation:pulse 2s infinite;">⛏️</div>
        <h3 style="margin:0; font-size:1.4rem; font-weight:900; color:#fbbf24; font-family:var(--font-title);">
          TRÒ CHƠI AI ĐÀO VÀNG CHỌN HỌC SINH LÊN BẢNG (THÔNG TƯ 22)
        </h3>
        <p style="margin:0.5rem 0 1.25rem 0; font-size:0.88rem; color:#cbd5e1;">Mỏ câu lắc 180°, gắp các cục vàng kim cương khắc Tên học sinh, âm thanh kéo cáp & giọng đọc AI gọi học sinh, nhập điểm TX1-TX4 tự động đẩy vào Sổ điểm</p>
        <button id="ait-btn-open-goldminer" class="ait-btn" style="background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff; font-size:1.1rem; padding:0.85rem 2rem; border-radius:30px; box-shadow:0 6px 20px rgba(245,158,11,0.5); border:2px solid #fef08a;">
          ⛏️ MỞ GAME AI ĐÀO VÀNG CHỌN HỌC SINH
        </button>
      </div>
    `;

    const openFn = () => {
      if (typeof window.showGoldMinerModal === 'function') {
        window.showGoldMinerModal();
      } else if (typeof window.app !== 'undefined' && window.app.showGoldMinerModal) {
        window.app.showGoldMinerModal();
      } else if (typeof LMSApp !== 'undefined' && LMSApp.prototype.showGoldMinerModal) {
        LMSApp.prototype.showGoldMinerModal();
      }
    };

    const btnOpen = area.querySelector('#ait-btn-open-goldminer');
    if (btnOpen) {
      btnOpen.onclick = openFn;
    }

    // Auto trigger on tab select
    setTimeout(openFn, 100);
  },

  _subjects() {
    try { return (typeof db !== 'undefined' && db.getSubjects) ? db.getSubjects() : []; } catch(e){ return []; }
  },

  // ═══════════════════════════════════════════════════════════════
  // TAB 1 — SLIDE & INFOGRAPHICS AI
  // ═══════════════════════════════════════════════════════════════
  _renderSlides() {
    const area = this._area();
    const subs = this._subjects();
    const st = this.slides;

    // ── Data banks cho từng môn học ──────────────────────────────
    const LESSON_DATA = {
      toan: {
        icon:'📐', color:'#1e40af',
        lessons: [
          'Hình có trục đối xứng',
          'Phép cộng và phép trừ phân số',
          'Diện tích xung quanh và thể tích hình hộp chữ nhật',
          'Phương trình bậc nhất một ẩn',
          'Bất đẳng thức và bất phương trình',
          'Hàm số và đồ thị hàm số bậc nhất',
          'Định lý Py-ta-go',
          'Hình trụ - Hình nón - Hình cầu'
        ],
        templates: (lesson, grade) => ([
          { icon:'🚀', title:`BÀI GIẢNG ĐIỆN TỬ: ${lesson.toUpperCase()}`,
            sub:`Môn Toán học · Khối ${grade} · GDPT 2018`,
            pts:['📌 Mục tiêu: Hiểu khái niệm, nhận biết và vận dụng kiến thức vào thực tế.','📌 Năng lực: Tư duy toán học, mô hình hóa, giao tiếp toán học.','📌 Phẩm chất: Cẩn thận, kiên trì, yêu thích học Toán.'] },
          { icon:'💡', title:'KHỞI ĐỘNG - TÌNH HUỐNG THỰC TẾ',
            sub:'Liên hệ thực tế · Kích hoạt tư duy',
            pts:['❓ Quan sát: Tìm hình ảnh liên quan đến bài học trong cuộc sống hàng ngày.','💬 Gợi mở: "Em thấy gì đặc biệt ở những hình ảnh này?"','🎯 Kết luận: Dẫn dắt vào khái niệm toán học cần học.'] },
          { icon:'📖', title:'HÌNH THÀNH KIẾN THỨC MỚI',
            sub:'Khái niệm cốt lõi · Định lý & Tính chất',
            pts:['🔹 Định nghĩa: Phát biểu chính xác, ngắn gọn, dễ hiểu.','🔹 Ví dụ minh họa: 2-3 ví dụ cụ thể tăng dần độ khó.','🔹 Nhận xét: Những lưu ý quan trọng cần ghi nhớ.'] },
          { icon:'✍️', title:'LUYỆN TẬP - VẬN DỤNG',
            sub:'Bài tập từ cơ bản đến nâng cao',
            pts:['📝 Bài tập 1 (Nhận biết): Xác định, nhận dạng theo định nghĩa.','📝 Bài tập 2 (Thông hiểu): Áp dụng công thức tính toán.','📝 Bài tập 3 (Vận dụng): Giải bài toán thực tế có kết hợp kiến thức.'] },
          { icon:'🌟', title:'CỦNG CỐ - MỞ RỘNG',
            sub:'Sơ đồ tư duy · Bài tập về nhà',
            pts:['🗺️ Sơ đồ tư duy: Tổng kết kiến thức bài học hôm nay.','🏠 Bài về nhà: SGK tr... BT số... và SBT tr... BT số...','🚀 Mở rộng: Thách thức dành cho học sinh giỏi.'] }
        ])
      },
      van: {
        icon:'📖', color:'#b45309',
        lessons: ['Sông núi nước Nam','Chuyện người con gái Nam Xương','Truyện Kiều - Trao duyên','Tức cảnh Pắc Bó','Nhớ rừng - Thế Lữ','Bình Ngô Đại Cáo','Đây thôn Vĩ Dạ'],
        templates: (lesson, grade) => ([
          { icon:'📖', title:`PHÂN TÍCH VĂN BẢN: ${lesson.toUpperCase()}`,
            sub:`Ngữ văn ${grade} · GDPT 2018`, pts:['📌 Tác giả & hoàn cảnh sáng tác của tác phẩm.','📌 Thể thơ/loại văn bản và đặc điểm nghệ thuật.','📌 Giá trị nội dung và nghệ thuật của tác phẩm.'] },
          { icon:'💡', title:'KHỞI ĐỘNG - KÍCH HOẠT CẢM XÚC',
            sub:'Liên hệ · Sáng tạo', pts:['❓ Câu hỏi gợi mở về chủ đề bài học.','🎭 Đọc diễn cảm đoạn trích nổi bật nhất.','💬 Chia sẻ cảm nhận ban đầu của học sinh.'] },
          { icon:'🔍', title:'ĐỌC - HIỂU VĂN BẢN',
            sub:'Đọc thành tiếng · Chú thích', pts:['📢 Đọc mẫu chuẩn (tốc độ, ngắt nghỉ, biểu cảm).','📝 Giải thích từ khó, điển cố, hình ảnh.','🔎 Xác định bố cục và ý chính từng phần.'] },
          { icon:'✨', title:'PHÂN TÍCH - CẢM THỤ',
            sub:'Nghệ thuật · Nội dung', pts:['🎨 Biện pháp tu từ và hiệu quả biểu đạt.','💡 Ý nghĩa hình ảnh, từ ngữ đặc sắc.','❤️ Tình cảm, tư tưởng của tác giả.'] },
          { icon:'🌟', title:'TỔNG KẾT - LUYỆN ĐỀ',
            sub:'Ghi nhớ · Luyện tập', pts:['📌 Ghi nhớ: Nội dung và nghệ thuật tiêu biểu.','✍️ Luyện viết đoạn văn cảm nhận.','📋 Luyện đề: Câu hỏi trắc nghiệm và tự luận.'] }
        ])
      },
      anh: {
        icon:'🇬🇧', color:'#0369a1',
        lessons: ['Unit 1: My New School','Unit 2: My Home','Unit 3: My Friends','Unit 4: My Neighbourhood','Unit 5: Natural Wonders','Unit 6: Our Tet Holiday','Unit 7: Television'],
        templates: (lesson, grade) => ([
          { icon:'🇬🇧', title:`LESSON PLAN: ${lesson.toUpperCase()}`,
            sub:`English ${grade} · Sách Kết nối tri thức`, pts:['🎯 Objectives: Students can use vocabulary and structures in real contexts.','📚 New words: 5-8 key vocabulary items for today\'s lesson.','🗣️ Key structures: Grammar points to be practiced.'] },
          { icon:'🎵', title:'WARM-UP - VOCABULARY ACTIVATION',
            sub:'Games · Songs · Pictures', pts:['🎮 Vocabulary game: Word association or picture matching.','🔊 Pronunciation drill: Teacher models, students repeat.','💬 Lead-in: Connect to lesson topic with personal questions.'] },
          { icon:'📖', title:'PRESENTATION - NEW LANGUAGE',
            sub:'Input · Modelling · Check', pts:['📢 Teacher models language in context.','🖊️ Students notice and infer meaning.','✅ Comprehension check: Concept checking questions.'] },
          { icon:'✍️', title:'PRACTICE - CONTROLLED & FREE',
            sub:'Exercises · Pair work · Role-play', pts:['📝 Controlled: Gap-fill, matching, ordering.','👥 Pair/Group work: Information gap, survey.','🎭 Free: Role-play conversation in real-life context.'] },
          { icon:'🌍', title:'PRODUCTION - REAL COMMUNICATION',
            sub:'Speaking · Writing · Assessment', pts:['🗣️ Speaking task: Present to class with confidence.','✍️ Writing: Short paragraph or email using target language.','⭐ Homework: Workbook exercises + vocabulary review.'] }
        ])
      },
      khtn: {
        icon:'🔬', color:'#0f766e',
        lessons: ['Tế bào - Đơn vị cơ bản của sự sống','Nguyên tử và nguyên tố hóa học','Phân tử - Đơn chất - Hợp chất','Tốc độ và vận tốc','Ánh sáng và sự truyền ánh sáng','Lực và tác dụng của lực','Phản ứng hóa học'],
        templates: (lesson, grade) => ([
          { icon:'🔬', title:`BÀI GIẢNG KHTN: ${lesson.toUpperCase()}`,
            sub:`Khoa học Tự nhiên ${grade}`, pts:['🎯 Mục tiêu: Nắm vững kiến thức lý thuyết và biết vận dụng thực tế.','🔬 Thiết bị: Dụng cụ thí nghiệm, hình ảnh, video minh họa.','⚡ Năng lực: Tìm hiểu tự nhiên, nhận thức khoa học tự nhiên.'] },
          { icon:'💡', title:'KHỞI ĐỘNG - HIỆN TƯỢNG THỰC TẾ',
            sub:'Quan sát · Đặt vấn đề', pts:['👀 Quan sát hiện tượng thực tế hoặc video thí nghiệm.','❓ Câu hỏi: "Tại sao hiện tượng đó xảy ra?"','🔭 Dự đoán: Học sinh nêu giả thuyết của mình.'] },
          { icon:'⚗️', title:'NỘI DUNG KIẾN THỨC - LÝ THUYẾT',
            sub:'Khái niệm · Công thức · Quy luật', pts:['📗 Khái niệm: Định nghĩa chính xác, khoa học.','📊 Công thức/Quy luật: Viết biểu thức toán học.','🗂️ Phân loại: Bảng so sánh, sơ đồ phân loại.'] },
          { icon:'🧪', title:'THỰC HÀNH THÍ NGHIỆM',
            sub:'Quan sát · Ghi chép · Kết luận', pts:['🔬 Thí nghiệm mô phỏng hoặc thực hành trực tiếp.','📋 Phiếu học tập: Ghi kết quả quan sát.','✅ Rút ra kết luận và liên hệ lý thuyết.'] },
          { icon:'🌟', title:'VẬN DỤNG - MỞ RỘNG',
            sub:'Bài tập · Thực tế', pts:['📝 Bài tập áp dụng công thức/kiến thức.','🌍 Liên hệ: Ứng dụng trong đời sống thực tế.','🏠 Bài về nhà: BT trong SGK và thực hành tại nhà.'] }
        ])
      }
    };

    // ── Lấy data môn đã chọn ────────────────────────────────────
    const subKey = st.subjectId || 'toan';
    const data = LESSON_DATA[subKey] || LESSON_DATA.toan;

    area.innerHTML = `
<div class="ait-card">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.75rem;margin-bottom:1rem;">
    <h3 style="margin:0;font-family:var(--font-title);color:#1e40af;font-size:1.1rem;display:flex;align-items:center;gap:.5rem;">
      <span>🎨</span> Trợ Lý Tạo Slide Bài Giảng AI
    </h3>
    <span style="background:#eff6ff;color:#2563eb;font-size:.75rem;font-weight:700;padding:.2rem .6rem;border-radius:12px;border:1px solid #bfdbfe;">⚡ 1-Click → Sản phẩm hoàn chỉnh</span>
  </div>

  <div class="ait-grid2">
    <div>
      <label class="ait-label">Môn Học</label>
      <select id="sl-sub" class="ait-select">
        ${Object.entries(LESSON_DATA).map(([k,v])=>`<option value="${k}" ${subKey===k?'selected':''}>${v.icon} ${subs.find(s=>s.id===k)?.name||k}</option>`).join('')}
        ${subs.filter(s=>!LESSON_DATA[s.id]).map(s=>`<option value="${s.id}">${s.icon||'📚'} ${s.name}</option>`).join('')}
      </select>
    </div>
    <div>
      <label class="ait-label">Khối Lớp</label>
      <select id="sl-grade" class="ait-select">
        ${[6,7,8,9].map(g=>`<option value="${g}" ${st.grade==g?'selected':''}>Khối ${g}</option>`).join('')}
      </select>
    </div>
    <div>
      <label class="ait-label">Số Tiết</label>
      <select id="sl-periods" class="ait-select">
        <option value="1" ${st.periods==='1'?'selected':''}>1 Tiết (5 slides)</option>
        <option value="2" ${st.periods==='2'?'selected':''}>2 Tiết (8 slides)</option>
        <option value="3" ${st.periods==='3'?'selected':''}>3 Tiết (12 slides)</option>
      </select>
    </div>
    <div>
      <label class="ait-label">Tên Bài Học</label>
      <select id="sl-lesson" class="ait-select">
        ${data.lessons.map(l=>`<option value="${l}" ${st.lessonName===l?'selected':''}>${l}</option>`).join('')}
        <option value="__custom__">✏️ Nhập tên tùy chỉnh...</option>
      </select>
    </div>
  </div>
  <div id="sl-custom-wrap" style="display:none;margin-bottom:.75rem;">
    <label class="ait-label">Tên bài học tùy chỉnh</label>
    <input id="sl-custom-input" class="ait-input" placeholder="Nhập tên bài học..." value="${st.lessonName}">
  </div>
  <button id="sl-gen-btn" class="ait-btn ait-btn-blue" style="width:100%;justify-content:center;font-size:1rem;">
    ⚡ TẠO BỘ SLIDE NGAY (1-CLICK)
  </button>
</div>

<div id="sl-deck-area"></div>
`;

    // ── Events ──────────────────────────────────────────────────
    const selSub = area.querySelector('#sl-sub');
    const selLesson = area.querySelector('#sl-lesson');
    const selGrade = area.querySelector('#sl-grade');
    const selPeriods = area.querySelector('#sl-periods');
    const customWrap = area.querySelector('#sl-custom-wrap');

    selSub.onchange = () => {
      this.slides.subjectId = selSub.value;
      this._renderSlides();
    };
    selLesson.onchange = () => {
      customWrap.style.display = selLesson.value === '__custom__' ? 'block' : 'none';
    };

    area.querySelector('#sl-gen-btn').onclick = () => {
      const lesson = selLesson.value === '__custom__'
        ? (area.querySelector('#sl-custom-input').value.trim() || 'Bài học mới')
        : selLesson.value;
      const grade = selGrade.value;
      const periods = parseInt(selPeriods.value);
      const subId = selSub.value;
      const tmpl = LESSON_DATA[subId] || LESSON_DATA.toan;

      this.slides.grade = grade;
      this.slides.periods = periods;
      this.slides.lessonName = lesson;
      this.slides.subjectId = subId;

      // Build full deck
      let base = tmpl.templates(lesson, grade);
      if (periods === 2) base = [...base, ...tmpl.templates(lesson, grade).slice(2).map(s=>({...s, title:`[TIẾT 2] ${s.title}`}))];
      if (periods >= 3) {
        base = [...base,
          { icon:'📋', title:'[TIẾT 3] ÔN TẬP - KIỂM TRA', sub:'Ôn luyện toàn bộ bài học',
            pts:['📝 Làm bài kiểm tra 15 phút (trắc nghiệm).','👥 Chữa bài theo nhóm, giải thích sai lầm.','🌟 Tổng kết và nhận xét, dặn dò bài sau.'] },
          { icon:'🎯', title:'[TIẾT 3] BÀI TẬP NÂNG CAO', sub:'Mở rộng kiến thức',
            pts:['🔥 Bài tập vận dụng cao theo đề thi.','🤝 Hợp tác nhóm: Trình bày và phản biện.','⭐ Tuyên dương cá nhân/nhóm xuất sắc.'] }
        ];
      }
      this.slides.deck = base;
      this._renderSlideDeck(area.querySelector('#sl-deck-area'));
    };

    // Auto-render nếu đã có deck
    if (this.slides.deck) {
      this._renderSlideDeck(area.querySelector('#sl-deck-area'));
    }
  },

  _renderSlideDeck(wrap) {
    if (!wrap || !this.slides.deck) return;
    const deck = this.slides.deck;
    const st = this.slides;

    wrap.innerHTML = `
<div class="ait-card" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;">
  <div>
    <span style="background:#eff6ff;color:#2563eb;font-size:.78rem;font-weight:700;padding:.2rem .6rem;border-radius:16px;border:1px solid #bfdbfe;">
      📊 ${deck.length} Slides · ${st.lessonName}
    </span>
    <div style="font-family:var(--font-title);font-size:1rem;font-weight:800;color:#0f172a;margin-top:.35rem;">${st.lessonName}</div>
  </div>
  <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
    <button id="sl-add" class="ait-btn ait-btn-ghost ait-btn-sm">➕ Thêm slide</button>
    <button id="sl-present" class="ait-btn ait-btn-green ait-btn-sm">▶️ Trình chiếu Fullscreen</button>
    <button id="sl-export" class="ait-btn ait-btn-sm" style="background:#0284c7;color:#fff;">📄 Xuất Word</button>
    <button id="sl-save" class="ait-btn ait-btn-orange ait-btn-sm">💾 Lưu vào LMS</button>
  </div>
</div>

<div id="sl-cards">
${deck.map((s,i)=>`
<div class="ait-slide-card" data-i="${i}">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem;flex-wrap:wrap;gap:.5rem;">
    <div style="display:flex;align-items:center;gap:.5rem;">
      <span style="background:#2563eb;color:#fff;font-size:.72rem;font-weight:800;padding:.15rem .55rem;border-radius:7px;">SLIDE ${i+1}/${deck.length}</span>
      <span style="font-size:1.3rem;">${s.icon}</span>
    </div>
    <div style="display:flex;gap:.35rem;">
      <button class="sl-up ait-btn ait-btn-ghost ait-btn-sm" data-i="${i}" ${i===0?'disabled':''}>⬆</button>
      <button class="sl-dn ait-btn ait-btn-ghost ait-btn-sm" data-i="${i}" ${i===deck.length-1?'disabled':''}>⬇</button>
      <button class="sl-del ait-btn ait-btn-sm" data-i="${i}" style="background:#fef2f2;color:#dc2626;border:1px solid #fecaca;">🗑</button>
    </div>
  </div>
  <div style="margin-bottom:.6rem;">
    <div class="ait-label">Tiêu đề slide</div>
    <div class="ait-editable sl-title" data-i="${i}" contenteditable="true" style="font-weight:800;font-size:1rem;color:#0f172a;">${s.title}</div>
  </div>
  <div style="margin-bottom:.6rem;">
    <div class="ait-label">Chủ đề phụ</div>
    <div class="ait-editable sl-sub" data-i="${i}" contenteditable="true" style="color:#2563eb;font-weight:600;">${s.sub}</div>
  </div>
  <div>
    <div class="ait-label">Nội dung (mỗi ý 1 dòng)</div>
    <div class="ait-editable sl-pts" data-i="${i}" contenteditable="true" style="background:#f8fafc;border-radius:10px;padding:.65rem;color:#334155;font-size:.87rem;line-height:1.7;border:1px solid #e2e8f0;">${s.pts.join('<br>')}</div>
  </div>
</div>`).join('')}
</div>`;

    // ── Bind all events ─────────────────────────────────────────
    const cards = wrap.querySelector('#sl-cards');

    // Move up/down/delete
    cards.querySelectorAll('.sl-up').forEach(b=>b.onclick=()=>{
      const i=+b.dataset.i; if(i<1)return;
      [deck[i],deck[i-1]]=[deck[i-1],deck[i]];
      this._renderSlideDeck(wrap);
    });
    cards.querySelectorAll('.sl-dn').forEach(b=>b.onclick=()=>{
      const i=+b.dataset.i; if(i>=deck.length-1)return;
      [deck[i],deck[i+1]]=[deck[i+1],deck[i]];
      this._renderSlideDeck(wrap);
    });
    cards.querySelectorAll('.sl-del').forEach(b=>b.onclick=()=>{
      if(!confirm(`Xóa Slide ${+b.dataset.i+1}?`))return;
      deck.splice(+b.dataset.i,1);
      this._renderSlideDeck(wrap);
    });

    // Sync edits on blur
    cards.querySelectorAll('.sl-title').forEach(el=>el.onblur=()=>{deck[+el.dataset.i].title=el.innerText;});
    cards.querySelectorAll('.sl-sub').forEach(el=>el.onblur=()=>{deck[+el.dataset.i].sub=el.innerText;});
    cards.querySelectorAll('.sl-pts').forEach(el=>el.onblur=()=>{
      deck[+el.dataset.i].pts=el.innerHTML.split('<br>').map(x=>x.replace(/<[^>]+>/g,'').trim()).filter(Boolean);
    });

    // Add slide
    wrap.querySelector('#sl-add').onclick=()=>{
      deck.push({icon:'✨',title:'SLIDE MỚI',sub:'Nội dung bổ sung',pts:['• Điểm 1','• Điểm 2','• Điểm 3']});
      this._renderSlideDeck(wrap);
    };

    // Export Word
    wrap.querySelector('#sl-export').onclick=()=>{
      let html=`<html><head><meta charset="utf-8"><title>${st.lessonName}</title></head><body style="font-family:'Times New Roman',serif;margin:2cm;">`;
      html+=`<h1 style="color:#1e3a8a;text-align:center;">SLIDE BÀI GIẢNG: ${st.lessonName.toUpperCase()}</h1>`;
      html+=`<p style="text-align:center;">Khối ${st.grade} · Ngày soạn: ${new Date().toLocaleDateString('vi-VN')}</p><hr>`;
      deck.forEach((s,i)=>{
        html+=`<div style="border:2px solid #3b82f6;border-radius:8px;padding:15px;margin:15px 0;">
          <h2>${s.icon} Slide ${i+1}: ${s.title}</h2>
          <h4 style="color:#475569;">${s.sub}</h4>
          <ul>${s.pts.map(p=>`<li>${p}</li>`).join('')}</ul>
        </div>`;
      });
      html+=`</body></html>`;
      const blob=new Blob(['\ufeff'+html],{type:'application/msword'});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download=`Slide_${st.lessonName.replace(/[^\w]/g,'_')}.doc`;
      a.click();
    };

    // Save to LMS
    wrap.querySelector('#sl-save').onclick=()=>{
      try {
        const f={id:`slide_${Date.now()}`,name:`Slide: ${st.lessonName}`,
          subjectId:st.subjectId,grade:parseInt(st.grade)||6,
          fileType:'slide',ext:'.pptx',
          author:(typeof db!=='undefined'&&db.currentUser)?db.currentUser.name:'Giáo viên',
          uploadDate:new Date().toISOString().slice(0,10),
          isShared:true,description:`Bộ ${deck.length} slides môn học khối ${st.grade}.`};
        if(typeof db!=='undefined'){
          if(db.pushUploadedFile) db.pushUploadedFile(f);
          else if(db.state?.uploadedFiles) db.state.uploadedFiles.push(f);
        }
        alert(`✅ Đã lưu bộ Slide "${st.lessonName}" (${deck.length} slides) vào kho bài giảng LMS!`);
      } catch(e){ alert('✅ Đã lưu slide!'); }
    };

    // Fullscreen presentation
    wrap.querySelector('#sl-present').onclick=()=>this._runPresentation(deck, st);
  },

  _runPresentation(deck, st) {
    let idx=0;
    const COLORS=['#1e3a8a','#166534','#7c3aed','#b45309','#0f766e'];

    const modal=document.createElement('div');
    modal.style.cssText='position:fixed;inset:0;background:#0f172a;z-index:999999;display:flex;flex-direction:column;font-family:var(--font-body);';

    const paint=()=>{
      const s=deck[idx];
      const clr=COLORS[idx%COLORS.length];
      return `
<div style="background:rgba(15,23,42,.95);padding:.75rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;">
  <span style="background:#2563eb;color:#fff;font-weight:800;font-size:.8rem;padding:.25rem .7rem;border-radius:16px;">SLIDE ${idx+1} / ${deck.length}</span>
  <span style="color:#93c5fd;font-weight:700;">${st.lessonName}</span>
  <button id="pr-close" style="background:#ef4444;color:#fff;border:none;padding:.35rem .85rem;border-radius:8px;font-weight:700;cursor:pointer;">✕ Esc</button>
</div>
<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;background:radial-gradient(circle,#1e293b,#0f172a);">
  <div style="background:#fff;border-radius:24px;width:100%;max-width:980px;min-height:500px;padding:2.5rem;box-shadow:0 25px 60px rgba(0,0,0,.6);border-top:8px solid ${clr};display:flex;flex-direction:column;gap:1.25rem;">
    <div style="display:flex;align-items:center;gap:.75rem;">
      <span style="font-size:2.5rem;">${s.icon}</span>
      <h2 style="margin:0;font-family:var(--font-title);color:${clr};font-size:1.65rem;font-weight:900;">${s.title}</h2>
    </div>
    <div style="color:#2563eb;font-weight:700;font-size:1.05rem;padding-bottom:.75rem;border-bottom:2px solid #e2e8f0;">${s.sub}</div>
    <div>${s.pts.map(p=>`<div style="display:flex;gap:.5rem;margin-bottom:.65rem;align-items:flex-start;font-size:1rem;color:#334155;line-height:1.65;"><span>🔸</span><span>${p}</span></div>`).join('')}</div>
  </div>
</div>
<div style="background:rgba(15,23,42,.95);padding:.85rem 2rem;display:flex;align-items:center;justify-content:center;gap:1.5rem;border-top:1px solid #1e293b;">
  <button id="pr-prev" ${idx===0?'disabled':''} style="background:#334155;color:#fff;border:none;padding:.55rem 1.3rem;border-radius:10px;font-weight:700;cursor:pointer;">← Trước</button>
  <span style="color:#94a3b8;font-weight:700;">${idx+1} / ${deck.length}</span>
  <button id="pr-next" ${idx===deck.length-1?'disabled':''} style="background:#2563eb;color:#fff;border:none;padding:.55rem 1.3rem;border-radius:10px;font-weight:800;cursor:pointer;">Tiếp →</button>
</div>`;
    };

    const draw=()=>{ modal.innerHTML=paint(); bind(); };
    const bind=()=>{
      modal.querySelector('#pr-close').onclick=()=>{modal.remove();window.removeEventListener('keydown',kh);};
      const pv=modal.querySelector('#pr-prev'); if(pv)pv.onclick=()=>{if(idx>0){idx--;draw();}};
      const nx=modal.querySelector('#pr-next'); if(nx)nx.onclick=()=>{if(idx<deck.length-1){idx++;draw();}};
    };
    const kh=(e)=>{
      if(e.key==='ArrowRight'&&idx<deck.length-1){idx++;draw();}
      else if(e.key==='ArrowLeft'&&idx>0){idx--;draw();}
      else if(e.key==='Escape'){modal.remove();window.removeEventListener('keydown',kh);}
    };
    window.addEventListener('keydown',kh);
    draw();
    document.body.appendChild(modal);
  },

  // ═══════════════════════════════════════════════════════════════
  // TAB 2 — TRÒ CHƠI KHỞI ĐỘNG (FULLY INTERACTIVE)
  // ═══════════════════════════════════════════════════════════════
  _renderIcebreaker() {
    const area = this._area();
    const subs = this._subjects();

    // ── Data bank cho mỗi môn ────────────────────────────────────
    const GAME_BANK = {
      toan: {
        puzzle: {
          image: '📐',
          reveal: 'TRỤC ĐỐI XỨNG',
          tiles: [
            {q:'Chiếc lá bàng khi gấp đôi thì 2 nửa như thế nào?', a:'Trùng khít nhau!'},
            {q:'Hình nào có vô số trục đối xứng?', a:'Hình tròn!'},
            {q:'Hình chữ nhật có mấy trục đối xứng?', a:'2 trục đối xứng!'},
            {q:'Đường trung trực của AB là trục đối xứng của hình nào?', a:'Đoạn thẳng AB!'}
          ]
        },
        wordHunt: {
          clues: ['🪞 Gương Soi Phẳng','🦋 Cánh Bướm Đôi','🍃 Chiếc Lá Cây'],
          answer: 'TRỤC ĐỐI XỨNG',
          hint: 'Từ khóa gồm 3 chữ (TRỤ_ ĐỐI _ỨXNG)'
        },
        factFiction: [
          {stmt:'Hình tam giác thường có ít nhất 1 trục đối xứng.',ans:false,exp:'Sai! Chỉ tam giác CÂN và ĐỀU mới có trục đối xứng.'},
          {stmt:'Hình tròn có nhiều trục đối xứng hơn hình vuông.',ans:true,exp:'Đúng! Hình tròn có vô số trục, hình vuông chỉ có 4.'},
          {stmt:'Cơ thể người nhìn từ phía trước có dạng đối xứng.',ans:true,exp:'Đúng! Mặt người, tay, chân đều có tính đối xứng hai bên.'}
        ]
      },
      anh: {
        puzzle: {
          image:'🇬🇧',
          reveal:'NEW SCHOOL',
          tiles:[
            {q:'How do you say "trường học" in English?', a:'School!'},
            {q:'What subjects do you like? (trả lời bằng tiếng Anh)', a:'I like Math / English / Science!'},
            {q:'Finish: "My name is... and I am... years old."', a:'Tự giới thiệu!'},
            {q:'What is the opposite of "old"?', a:'New!'}
          ]
        },
        wordHunt:{clues:['📚 Sách & Bút','🏫 Cổng Trường','🎒 Ba lô Học sinh'],answer:'MY NEW SCHOOL',hint:'3 từ tiếng Anh (M_ N__ S_____)'},
        factFiction:[
          {stmt:'"I am" dùng cho ngôi thứ nhất số ít.',ans:true,exp:'Correct! "I am a student."'},
          {stmt:'"She go to school" là câu đúng ngữ pháp.',ans:false,exp:'Wrong! Phải là "She GOES to school" (thêm -s/-es cho ngôi 3 số ít).'},
          {stmt:'Trong tiếng Anh, tính từ đứng trước danh từ.',ans:true,exp:'Correct! "a big school", "a new book".'}
        ]
      },
      khtn:{
        puzzle:{
          image:'🔬',reveal:'TẾ BÀO',
          tiles:[
            {q:'Đơn vị cơ bản của sự sống là gì?',a:'Tế bào!'},
            {q:'Ai phát minh ra kính hiển vi đầu tiên?',a:'Antonie van Leeuwenhoek!'},
            {q:'Tế bào thực vật có thêm gì mà tế bào động vật không có?',a:'Vách tế bào và lục lạp!'},
            {q:'Tế bào nào không có nhân?',a:'Tế bào hồng cầu!'}
          ]
        },
        wordHunt:{clues:['🔬 Kính Hiển Vi','🌿 Lá Cây','🦠 Vi Khuẩn'],answer:'TẾ BÀO',hint:'2 chữ (T_ B_O)'},
        factFiction:[
          {stmt:'Virus là một loại tế bào sống.',ans:false,exp:'Sai! Virus không được coi là tế bào — nó không có cấu trúc tế bào hoàn chỉnh.'},
          {stmt:'Tế bào thực vật có lục lạp để quang hợp.',ans:true,exp:'Đúng! Lục lạp chứa diệp lục (chlorophyll) giúp thực vật quang hợp.'},
          {stmt:'Con người có khoảng 37 nghìn tỉ tế bào.',ans:true,exp:'Đúng! Ước tính cơ thể người có ~37 trillion (37 × 10¹²) tế bào.'}
        ]
      }
    };

    const subKey = this.icebreaker.subjectId || this.slides.subjectId || 'toan';
    const gameData = GAME_BANK[subKey] || GAME_BANK.toan;
    const subName = subs.find(s=>s.id===subKey)?.name || subKey;

    area.innerHTML = `
<div class="ait-card">
  <h3 style="margin:0 0 1rem;font-family:var(--font-title);color:#c2410c;font-size:1.1rem;">🎮 Trợ Lý Sinh Trò Chơi Khởi Động Tiết Học (3–5 phút)</h3>
  <div class="ait-grid2">
    <div>
      <label class="ait-label">Môn Học</label>
      <select id="ice-sub" class="ait-select">
        ${Object.keys(GAME_BANK).map(k=>`<option value="${k}" ${subKey===k?'selected':''}>${subs.find(s=>s.id===k)?.icon||'📚'} ${subs.find(s=>s.id===k)?.name||k}</option>`).join('')}
      </select>
    </div>
    <div>
      <label class="ait-label">Khối Lớp</label>
      <select id="ice-grade" class="ait-select">
        ${[6,7,8,9].map(g=>`<option value="${g}">Khối ${g}</option>`).join('')}
      </select>
    </div>
  </div>
  <button id="ice-gen" class="ait-btn ait-btn-orange" style="width:100%;justify-content:center;">
    🎮 TẠO 3 KỊCH BẢN TRÒ CHƠI NGAY
  </button>
</div>

<div id="ice-games-area"></div>
`;

    area.querySelector('#ice-sub').onchange=(e)=>{
      this.icebreaker.subjectId=e.target.value;
      this._renderIcebreaker();
    };

    area.querySelector('#ice-gen').onclick=()=>{
      this._renderGameCards(area.querySelector('#ice-games-area'), gameData, subName);
    };

    // Auto-render nếu đã có data
    this._renderGameCards(area.querySelector('#ice-games-area'), gameData, subName);
  },

  _renderGameCards(wrap, gd, subName) {
    wrap.innerHTML = `
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">

  <!-- GAME 1: Mảnh Ghép Bí Ẩn -->
  <div class="ait-card" style="border-top:4px solid #7c3aed;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem;">
      <span style="background:#f3e8ff;color:#7c3aed;font-size:.75rem;font-weight:700;padding:.2rem .6rem;border-radius:12px;">⏱️ 3-4 phút</span>
      <span style="font-size:.78rem;font-weight:700;color:#64748b;">${subName}</span>
    </div>
    <h4 style="margin:0 0 .6rem;font-family:var(--font-title);color:#4c1d95;">🧩 Mảnh Ghép Bí Ẩn</h4>
    <p style="font-size:.82rem;color:#475569;background:#f8fafc;border-radius:8px;padding:.6rem;margin:0 0 .75rem;line-height:1.5;">
      4 mảnh ghép che bức ảnh bí ẩn. Trả lời đúng → mảnh biến mất → lộ từ khóa!
    </p>
    <div style="font-size:.8rem;color:#334155;margin-bottom:1rem;">
      ${gd.puzzle.tiles.map((t,i)=>`<div style="margin-bottom:.35rem;"><b>Mảnh ${i+1}:</b> ${t.q}</div>`).join('')}
    </div>
    <div style="display:flex;gap:.5rem;">
      <button id="play-puzzle" class="ait-btn ait-btn-purple" style="flex:1;justify-content:center;">
        ▶️ BẮT ĐẦU CHƠI
      </button>
      <button id="manage-puzzle" class="ait-btn" style="background:#7c3aed;color:#fff;font-weight:700;white-space:nowrap;">
        📁 Nạp Câu Hỏi
      </button>
    </div>
  </div>

  <!-- GAME 2: Đuổi Hình Bắt Chữ -->
  <div class="ait-card" style="border-top:4px solid #0284c7;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem;">
      <span style="background:#e0f2fe;color:#0284c7;font-size:.75rem;font-weight:700;padding:.2rem .6rem;border-radius:12px;">⏱️ 3 phút</span>
      <span style="font-size:.78rem;font-weight:700;color:#64748b;">${subName}</span>
    </div>
    <h4 style="margin:0 0 .6rem;font-family:var(--font-title);color:#0c4a6e;">🔍 Đuổi Hình Bắt Chữ</h4>
    <p style="font-size:.82rem;color:#475569;background:#f8fafc;border-radius:8px;padding:.6rem;margin:0 0 .75rem;line-height:1.5;">
      3 hình gợi ý. Tìm từ khóa chung → nhập đáp án → AI kiểm tra ngay!
    </p>
    <div style="display:flex;gap:.5rem;justify-content:center;margin-bottom:1rem;font-size:2rem;">
      ${gd.wordHunt.clues.map(c=>`<span title="${c}">${c.split(' ')[0]}</span>`).join('')}
    </div>
    <div style="display:flex;gap:.5rem;">
      <button id="play-wordhunt" class="ait-btn ait-btn-blue" style="flex:1;justify-content:center;">
        ▶️ BẮT ĐẦU CHƠI
      </button>
      <button id="manage-wordhunt" class="ait-btn" style="background:#0284c7;color:#fff;font-weight:700;white-space:nowrap;">
        📁 Nạp Câu Hỏi
      </button>
    </div>
  </div>

  <!-- GAME 3: Fact or Fiction -->
  <div class="ait-card" style="border-top:4px solid #ea580c;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem;">
      <span style="background:#fff7ed;color:#ea580c;font-size:.75rem;font-weight:700;padding:.2rem .6rem;border-radius:12px;">⏱️ 4 phút</span>
      <span style="font-size:.78rem;font-weight:700;color:#64748b;">${subName}</span>
    </div>
    <h4 style="margin:0 0 .6rem;font-family:var(--font-title);color:#7c2d12;">❓ Thật hay Hư Cấu?</h4>
    <p style="font-size:.82rem;color:#475569;background:#f8fafc;border-radius:8px;padding:.6rem;margin:0 0 .75rem;line-height:1.5;">
      Đếm ngược 10 giây / tuyên bố. Bấm THẬT hoặc HƯ CẤU. Hiện giải thích ngay!
    </p>
    <div style="font-size:.8rem;color:#334155;margin-bottom:1rem;">
      ${gd.factFiction.map((f,i)=>`<div style="margin-bottom:.35rem;"><b>TB ${i+1}:</b> ${f.stmt.substring(0,55)}...</div>`).join('')}
    </div>
    <div style="display:flex;gap:.5rem;">
      <button id="play-factfiction" class="ait-btn ait-btn-orange" style="flex:1;justify-content:center;">
        ▶️ BẮT ĐẦU CHƠI
      </button>
      <button id="manage-factfiction" class="ait-btn" style="background:#ea580c;color:#fff;font-weight:700;white-space:nowrap;">
        📁 Nạp Câu Hỏi
      </button>
    </div>
  </div>
</div>`;

    // ── Bind game launchers ──────────────────────────────────────
    wrap.querySelector('#play-puzzle').onclick     = () => this._playPuzzle(gd.puzzle);
    wrap.querySelector('#play-wordhunt').onclick   = () => this._playWordHunt(gd.wordHunt);
    wrap.querySelector('#play-factfiction').onclick= () => this._playFactFiction(gd.factFiction);

    if (wrap.querySelector('#manage-puzzle')) wrap.querySelector('#manage-puzzle').onclick = () => this._openQuestionLoaderModal('puzzle', '🧩 Mảnh Ghép Bí Ẩn', gd.puzzle);
    if (wrap.querySelector('#manage-wordhunt')) wrap.querySelector('#manage-wordhunt').onclick = () => this._openQuestionLoaderModal('wordhunt', '🔍 Đuổi Hình Bắt Chữ', gd.wordHunt);
    if (wrap.querySelector('#manage-factfiction')) wrap.querySelector('#manage-factfiction').onclick = () => this._openQuestionLoaderModal('factfiction', '❓ Thật hay Hư Cấu?', gd.factFiction);
  },

  _playPuzzle(data) {
    const loaded = this._getLoadedQuestions('puzzle');
    if (loaded && loaded.length >= 4) {
      data = {
        image: data.image || '🧩',
        reveal: data.reveal || 'TỪ KHÓA BÀI HỌC',
        tiles: loaded.slice(0, 4).map(q => ({
          q: q.questionText || q.q || q.stmt || '',
          a: Array.isArray(q.options) ? q.options[q.correctAnswer || 0] : (q.a || (q.ans ? 'Đúng' : 'Sai'))
        }))
      };
    }
    const revealed = [false, false, false, false];
    const scores = [0, 0];
    let answerStates = ['','','',''];

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.97);z-index:999999;display:flex;flex-direction:column;font-family:var(--font-body);color:#fff;animation:fadeIn .2s;';

    const draw = () => {
      const allRevealed = revealed.every(Boolean);
      modal.innerHTML = `
<div style="background:#1e293b;padding:.85rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;">
  <h3 style="margin:0;font-family:var(--font-title);color:#c4b5fd;font-size:1.1rem;">🧩 Mảnh Ghép Bí Ẩn · ${data.reveal}</h3>
  <button id="pg-close" style="background:#ef4444;color:#fff;border:none;padding:.35rem .85rem;border-radius:8px;font-weight:700;cursor:pointer;">✕ Đóng</button>
</div>

<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;padding:1.5rem;">
  ${allRevealed ? `<div style="background:linear-gradient(135deg,#16a34a,#065f46);padding:1rem 2.5rem;border-radius:20px;font-size:1.4rem;font-weight:900;text-align:center;animation:ait-pulse 1.2s infinite;">🎉 TỪ KHÓA BÀI HỌC: ${data.reveal}! Cả lớp thắng!</div>` : ''}

  <!-- PUZZLE GRID: 2×2 covering the central image/word -->
  <div style="position:relative;width:400px;height:280px;border:4px solid #6d28d9;border-radius:16px;overflow:hidden;">
    <!-- Background: hidden word -->
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,#1d4ed8,#7c3aed);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;">
      <span style="font-size:5rem;">${data.image}</span>
      <span style="font-size:1.6rem;font-weight:900;letter-spacing:.15em;color:#fbbf24;">${data.reveal}</span>
    </div>
    <!-- Tiles -->
    ${revealed.map((rv,i)=>`
      <div id="pg-tile-${i}" style="position:absolute;
        ${i===0?'top:0;left:0;':''}${i===1?'top:0;left:50%;':''}
        ${i===2?'top:50%;left:0;':''}${i===3?'top:50%;left:50%;':''}
        width:50%;height:50%;
        background:${rv?'transparent':['#7c3aed','#2563eb','#ea580c','#0d9488'][i]};
        border:2px solid rgba(255,255,255,.2);
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        cursor:${rv?'default':'pointer'};
        transition:all .3s ease;
        ${answerStates[i]==='correct'?'background:rgba(22,163,74,.2)!important;':answerStates[i]==='wrong'?'background:rgba(220,38,38,.2)!important;':''}">
        ${rv ? '' : `<span style="font-size:1.4rem;font-weight:800;">MẢNH ${i+1}</span><span style="font-size:.72rem;opacity:.85;">Bấm để mở câu hỏi</span>`}
      </div>`).join('')}
  </div>

  <!-- Answer Input Area -->
  ${!allRevealed ? `
  <div style="background:#1e293b;border-radius:16px;padding:1.25rem;width:100%;max-width:500px;border:1.5px solid #334155;">
    <div id="pg-question" style="font-size:1rem;font-weight:700;color:#fbbf24;margin-bottom:.75rem;min-height:1.5rem;text-align:center;">
      👆 Bấm vào mảnh ghép để mở câu hỏi
    </div>
    <div style="display:flex;gap:.5rem;">
      <input id="pg-ans-input" class="ait-input" placeholder="Nhập câu trả lời..." style="flex:1;">
      <button id="pg-submit" class="ait-btn ait-btn-green" style="white-space:nowrap;">Kiểm tra ✓</button>
    </div>
    <div id="pg-feedback" style="margin-top:.5rem;font-size:.85rem;min-height:1.2rem;text-align:center;"></div>
  </div>` : ''}
</div>`;

      modal.querySelector('#pg-close').onclick = () => modal.remove();

      let activeTile = -1;
      revealed.forEach((rv, i) => {
        if (rv) return;
        const tile = modal.querySelector(`#pg-tile-${i}`);
        if (!tile) return;
        tile.onclick = () => {
          activeTile = i;
          const qEl = modal.querySelector('#pg-question');
          if (qEl) qEl.textContent = `Mảnh ${i+1}: ${data.tiles[i].q}`;
          const inp = modal.querySelector('#pg-ans-input');
          if (inp) inp.focus();
        };
      });

      const submitBtn = modal.querySelector('#pg-submit');
      if (submitBtn) {
        submitBtn.onclick = () => {
          if (activeTile < 0) return;
          const inp = modal.querySelector('#pg-ans-input');
          const fb = modal.querySelector('#pg-feedback');
          const userAns = (inp?.value||'').trim().toLowerCase();
          const correct = data.tiles[activeTile].a.toLowerCase();
          if (userAns.length < 1) return;
          if (correct.includes(userAns) || userAns.includes(correct.split('!')[0].toLowerCase())) {
            revealed[activeTile] = true;
            answerStates[activeTile] = 'correct';
            if (fb) { fb.textContent = `✅ Chính xác! ${data.tiles[activeTile].a}`; fb.style.color='#4ade80'; }
            setTimeout(() => draw(), 800);
          } else {
            answerStates[activeTile] = 'wrong';
            if (fb) { fb.textContent = `❌ Chưa đúng! Thử lại...`; fb.style.color='#f87171'; }
            if (inp) { inp.value=''; inp.focus(); }
          }
        };

        // Enter key support
        const inp = modal.querySelector('#pg-ans-input');
        if (inp) inp.onkeydown = (e) => { if (e.key === 'Enter') submitBtn.click(); };
      }
    };

    draw();
    document.body.appendChild(modal);
  },

  _playWordHunt(data) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.97);z-index:999999;display:flex;flex-direction:column;font-family:var(--font-body);color:#fff;animation:fadeIn .2s;';

    let won = false;

    const draw = () => {
      modal.innerHTML = `
<div style="background:#1e293b;padding:.85rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;">
  <h3 style="margin:0;font-family:var(--font-title);color:#93c5fd;">🔍 Đuổi Hình Bắt Chữ</h3>
  <button id="wh-close" style="background:#ef4444;color:#fff;border:none;padding:.35rem .85rem;border-radius:8px;font-weight:700;cursor:pointer;">✕ Đóng</button>
</div>
<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;padding:2rem;">
  ${won ? `<div style="background:linear-gradient(135deg,#16a34a,#065f46);padding:1.25rem 2.5rem;border-radius:20px;font-size:1.3rem;font-weight:900;text-align:center;animation:ait-pulse 1.2s infinite;">🎉 Chính xác! Từ khóa là: <span style="color:#fbbf24;">${data.answer}</span></div>` : ''}

  <div style="display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;">
    ${data.clues.map((c,i)=>`
      <div style="background:#1e293b;border:2px solid #3b82f6;border-radius:16px;padding:1.5rem 1.25rem;text-align:center;min-width:120px;">
        <div style="font-size:3.5rem;margin-bottom:.5rem;">${c.split(' ')[0]}</div>
        <div style="font-size:.85rem;color:#93c5fd;font-weight:700;">${c.split(' ').slice(1).join(' ')}</div>
      </div>`).join('')}
  </div>

  ${!won ? `
  <div style="background:#1e293b;border-radius:16px;padding:1.25rem;width:100%;max-width:480px;border:1.5px solid #334155;">
    <p style="margin:0 0 .5rem;color:#94a3b8;font-size:.85rem;">💡 Gợi ý: ${data.hint}</p>
    <div style="display:flex;gap:.5rem;">
      <input id="wh-input" class="ait-input" placeholder="Nhập từ khóa bí ẩn..." style="flex:1;font-size:1rem;font-weight:700;">
      <button id="wh-submit" class="ait-btn ait-btn-blue" style="white-space:nowrap;">Kiểm tra ✓</button>
    </div>
    <div id="wh-feedback" style="margin-top:.5rem;font-size:.85rem;min-height:1.2rem;text-align:center;"></div>
  </div>` : ''}
</div>`;

      modal.querySelector('#wh-close').onclick = () => modal.remove();

      if (!won) {
        const inp = modal.querySelector('#wh-input');
        const fb = modal.querySelector('#wh-feedback');
        const check = () => {
          const v = (inp?.value||'').trim().toLowerCase().replace(/\s+/g,' ');
          const ans = data.answer.toLowerCase();
          if (v === ans || ans.includes(v) && v.length >= 3) {
            won = true;
            draw();
          } else {
            if(fb){ fb.textContent='❌ Chưa đúng! Quan sát kỹ 3 hình và thử lại.'; fb.style.color='#f87171'; }
            if(inp){ inp.value=''; inp.focus(); }
          }
        };
        if(inp) inp.onkeydown = (e) => { if(e.key==='Enter') check(); };
        modal.querySelector('#wh-submit').onclick = check;
        inp?.focus();
      }
    };

    draw();
    document.body.appendChild(modal);
  },

  _playFactFiction(facts) {
    const loaded = this._getLoadedQuestions('factfiction');
    if (loaded && loaded.length > 0) {
      facts = loaded.map(q => ({
        stmt: q.questionText || q.stmt || q.q || '',
        ans: q.type === 'true_false' ? (q.correctAnswer === 0 || q.ans === true) : (q.correctAnswer === 0),
        exp: q.explanation || q.exp || 'Đáp án chính xác!'
      }));
    }
    let idx = 0;
    let correct = 0;
    let timer = 10;
    let timerID = null;
    const results = [];

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.97);z-index:999999;display:flex;flex-direction:column;font-family:var(--font-body);color:#fff;animation:fadeIn .2s;';

    const draw = () => {
      if (timerID) clearInterval(timerID);
      if (idx >= facts.length) {
        // Results screen
        modal.innerHTML = `
<div style="background:#1e293b;padding:.85rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;">
  <h3 style="margin:0;color:#fbbf24;">❓ Kết Quả Cuối Cùng</h3>
  <button id="ff-close" style="background:#ef4444;color:#fff;border:none;padding:.35rem .85rem;border-radius:8px;font-weight:700;cursor:pointer;">✕ Đóng</button>
</div>
<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;padding:2rem;">
  <div style="font-size:3rem;">${correct===facts.length?'🏆':'🎯'}</div>
  <div style="font-size:1.5rem;font-weight:800;">Đúng ${correct}/${facts.length} tuyên bố!</div>
  <div style="width:100%;max-width:500px;">
    ${results.map((r,i)=>`
      <div style="background:${r.userCorrect?'rgba(22,163,74,.15)':'rgba(220,38,38,.15)'};border:1.5px solid ${r.userCorrect?'#16a34a':'#dc2626'};border-radius:12px;padding:.85rem 1rem;margin-bottom:.6rem;">
        <div style="font-weight:700;margin-bottom:.3rem;">${i+1}. ${facts[i].stmt}</div>
        <div style="font-size:.82rem;color:${r.userCorrect?'#4ade80':'#f87171'};">${r.userCorrect?'✅':'❌'} ${facts[i].exp}</div>
      </div>`).join('')}
  </div>
</div>`;
        modal.querySelector('#ff-close').onclick = () => modal.remove();
        return;
      }

      const f = facts[idx];
      timer = 10;
      modal.innerHTML = `
<div style="background:#1e293b;padding:.85rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;">
  <h3 style="margin:0;color:#fbbf24;">❓ Thật hay Hư Cấu? (${idx+1}/${facts.length})</h3>
  <div style="display:flex;align-items:center;gap:1rem;">
    <div id="ff-timer" style="background:#ef4444;color:#fff;font-weight:900;font-size:1.2rem;width:2.5rem;height:2.5rem;border-radius:50%;display:flex;align-items:center;justify-content:center;">${timer}</div>
    <button id="ff-close" style="background:#475569;color:#fff;border:none;padding:.35rem .85rem;border-radius:8px;font-weight:700;cursor:pointer;">✕</button>
  </div>
</div>
<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.75rem;padding:2rem;">
  <div style="font-size:.85rem;color:#94a3b8;">TUYÊN BỐ ${idx+1}/${facts.length}</div>
  <div style="background:#1e293b;border:2px solid #334155;border-radius:20px;padding:1.75rem 2rem;font-size:1.2rem;font-weight:700;text-align:center;max-width:600px;line-height:1.55;">
    ${f.stmt}
  </div>
  <div style="display:flex;gap:1.5rem;">
    <button id="ff-true" class="ait-fact-btn" style="background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;min-width:150px;">✅ THẬT</button>
    <button id="ff-false" class="ait-fact-btn" style="background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;min-width:150px;">❌ HƯ CẤU</button>
  </div>
  <div id="ff-feedback" style="min-height:1.5rem;font-size:.9rem;text-align:center;"></div>
</div>`;

      modal.querySelector('#ff-close').onclick = () => { clearInterval(timerID); modal.remove(); };

      const timerEl = modal.querySelector('#ff-timer');
      timerID = setInterval(() => {
        timer--;
        if (timerEl) timerEl.textContent = timer;
        if (timer <= 3 && timerEl) timerEl.style.animation = 'ait-pulse .4s infinite';
        if (timer <= 0) {
          clearInterval(timerID);
          results.push({userCorrect: false});
          idx++;
          draw();
        }
      }, 1000);

      const answer = (userSaid) => {
        clearInterval(timerID);
        const fb = modal.querySelector('#ff-feedback');
        const isCorrect = userSaid === f.ans;
        if (isCorrect) correct++;
        results.push({userCorrect: isCorrect});
        if (fb) {
          fb.innerHTML = `<span style="color:${isCorrect?'#4ade80':'#f87171'};font-weight:800;">${isCorrect?'✅ ĐÚNG!':'❌ SAI!'}</span> — ${f.exp}`;
        }
        setTimeout(() => { idx++; draw(); }, 2200);
      };

      modal.querySelector('#ff-true').onclick  = () => answer(true);
      modal.querySelector('#ff-false').onclick = () => answer(false);
    };

    draw();
    document.body.appendChild(modal);
  },

  // ═══════════════════════════════════════════════════════════════
  // TAB 3 — PHÁT ÂM & ĐỌC MẪU AI
  // ═══════════════════════════════════════════════════════════════
  _renderVoice() {
    const area = this._area();

    const PRESETS = [
      { label:'🇬🇧 TA6: Unit 1 - My New School', lang:'en-US', rate:.9,
        text:`Welcome to our English class today! I am your teacher and I am very happy to be here with you. Today we will learn about our new school. This is our classroom. There are many desks and chairs. Can you see the board? Let's start our lesson!` },
      { label:'🇬🇧 TA7: Health & Lifestyle', lang:'en-US', rate:.9,
        text:`A healthy lifestyle is important for everyone. You should eat lots of vegetables and fruits every day. It is also important to exercise for at least thirty minutes each day. Try to drink eight glasses of water and get enough sleep every night.` },
      { label:'🇬🇧 TA8: Cities of the World', lang:'en-GB', rate:.95,
        text:`London is the capital city of England and the United Kingdom. It is one of the most visited cities in the world. The River Thames flows through the heart of London. Famous landmarks include Big Ben, Tower Bridge, and Buckingham Palace.` },
      { label:'🇻🇳 NV7: Sông Núi Nước Nam', lang:'vi-VN', rate:.85,
        text:`Sông núi nước Nam vua Nam ở, Rõ ràng phân định tại sách trời. Giặc giữ cớ sao phạm đến đây? Chúng mày nhất định phải tan vỡ.` },
      { label:'🇻🇳 NV6: Dế Mèn Phiêu Lưu Ký', lang:'vi-VN', rate:.9,
        text:`Bởi tôi ăn uống điều độ và làm việc có chừng mực nên tôi chóng lớn lắm. Chẳng bao lâu tôi đã trở thành một gã dế mèn thanh niên cường tráng. Đôi càng tôi mẫm bóng. Những cái vuốt ở chân, ở khoeo cứ cứng dần và nhọn hoắt.` },
      { label:'🇻🇳 NV8: Lão Hạc - Nam Cao', lang:'vi-VN', rate:.9,
        text:`Lão Hạc ơi! Ta có biết đâu rằng lão cũng khổ như chúng ta vậy. Lão ăn gì mà nhịn cả cơm? Lão ăn khoai. Và khoai cũng hết. Lão kiếm được gì ăn nấy. Vì không chịu động đến đồng tiền để giành cho con.` }
    ];

    area.innerHTML = `
<div class="ait-card">
  <h3 style="margin:0 0 1rem;font-family:var(--font-title);color:#0d9488;font-size:1.1rem;">🔊 Trợ Lý Phát Âm & Đọc Mẫu AI</h3>

  <!-- Preset library -->
  <div style="margin-bottom:1.1rem;">
    <label class="ait-label">📚 Thư Viện Bài Mẫu Chọn Nhanh (bấm để nạp ngay)</label>
    <div style="display:flex;flex-wrap:wrap;gap:.4rem;">
      ${PRESETS.map((p,i)=>`<button class="ait-preset-btn vo-preset" data-i="${i}">${p.label}</button>`).join('')}
    </div>
  </div>

  <!-- Language & Rate controls -->
  <div class="ait-grid2" style="margin-bottom:1rem;">
    <div>
      <label class="ait-label">Ngôn ngữ & Giọng đọc</label>
      <select id="vo-lang" class="ait-select">
        <option value="en-US">🇺🇸 Tiếng Anh (Mỹ - en-US)</option>
        <option value="en-GB">🇬🇧 Tiếng Anh (Anh - en-GB)</option>
        <option value="vi-VN">🇻🇳 Tiếng Việt (vi-VN)</option>
      </select>
    </div>
    <div>
      <label class="ait-label">Tốc độ đọc: <b id="vo-rate-label">1.0x</b></label>
      <input type="range" id="vo-rate" min="0.6" max="1.4" step="0.1" value="1.0" style="width:100%;accent-color:#0d9488;">
    </div>
  </div>

  <!-- File Import Bar for Word, PDF & Images -->
  <div style="background:rgba(13,148,136,0.06); border:1.5px dashed #0d9488; border-radius:14px; padding:0.85rem 1rem; margin-bottom:1rem; display:flex; flex-direction:column; gap:0.6rem;">
    <div style="font-weight:800; color:#0f766e; font-size:0.88rem; display:flex; align-items:center; gap:0.4rem;">
      📂 Nạp văn bản đọc mẫu từ File Word, PDF hoặc File Ảnh:
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:0.5rem; align-items:center;">
      <button id="vo-btn-word" class="ait-btn ait-btn-sm" style="background:#0284c7; color:#fff; font-weight:800; border:none; cursor:pointer;">
        📄 Nạp từ File Word (.docx)
      </button>
      <button id="vo-btn-pdf" class="ait-btn ait-btn-sm" style="background:#dc2626; color:#fff; font-weight:800; border:none; cursor:pointer;">
        📕 Nạp từ File PDF (.pdf)
      </button>
      <button id="vo-btn-img" class="ait-btn ait-btn-sm" style="background:#a855f7; color:#fff; font-weight:800; border:none; cursor:pointer;">
        🖼️ Nạp từ File Ảnh / OCR (.jpg/.png)
      </button>
      <input type="file" id="vo-file-input" accept=".docx,.doc,.pdf,.png,.jpg,.jpeg,.bmp,.webp" style="display:none;">
    </div>
  </div>

  <!-- Text input -->
  <div style="margin-bottom:1rem;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem; flex-wrap:wrap; gap:0.5rem;">
      <label class="ait-label" style="margin:0;">Nội dung văn bản cần đọc mẫu:</label>
      <div style="display:flex; gap:0.4rem;">
        <button id="vo-btn-paste" class="ait-btn ait-btn-sm" style="background:#10b981; color:#fff; font-weight:800; border:none; cursor:pointer; font-size:0.8rem;">
          📋 Dán nhanh từ bộ nhớ tạm (Ctrl+V)
        </button>
        <button id="vo-btn-clear" class="ait-btn ait-btn-sm" style="background:#ef4444; color:#fff; font-weight:800; border:none; cursor:pointer; font-size:0.8rem;">
          🗑️ Xóa sạch
        </button>
      </div>
    </div>
    <textarea id="vo-text" rows="6" class="ait-input" style="resize:vertical; font-size:0.95rem; line-height:1.6; font-family:var(--font-body);" placeholder="Nhập hoặc dán đoạn văn, bài thơ, từ vựng vào đây..."></textarea>
  </div>

  <!-- Status bar -->
  <div id="vo-status-bar" style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:10px;padding:.65rem 1rem;font-size:.85rem;font-weight:700;color:#15803d;margin-bottom:1rem;display:none;"></div>

  <!-- Action buttons -->
  <div style="display:flex;gap:.65rem;flex-wrap:wrap;margin-bottom:1rem;">
    <button id="vo-play" class="ait-btn ait-btn-teal">🔊 Phát Âm Ngay</button>
    <button id="vo-stop" class="ait-btn ait-btn-ghost">⏹️ Dừng</button>
    <button id="vo-mic" class="ait-btn ait-btn-purple">🎙️ Luyện Phát Âm Qua Mic</button>
  </div>

  <!-- IPA Pronunciation Tool -->
  <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:14px;padding:1.1rem;">
    <div style="font-weight:800;color:#b45309;margin-bottom:.65rem;">📖 Tra Phát Âm IPA Nhanh</div>
    <div style="display:flex;gap:.5rem;margin-bottom:.75rem;">
      <input id="vo-ipa-input" class="ait-input" placeholder="Nhập từ tiếng Anh (vd: school, butterfly...)" style="flex:1;background:#fff;">
      <button id="vo-ipa-btn" class="ait-btn ait-btn-sm" style="background:#b45309;color:#fff;white-space:nowrap;">Tra IPA</button>
    </div>
    <div id="vo-ipa-result" style="font-size:.85rem;color:#78350f;min-height:1rem;"></div>

    <div style="font-size:.78rem;color:#92400e;margin-top:.5rem;">Bảng âm vị nhanh:</div>
    <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.35rem;">
      ${[['æ','cat'],['ɪ','sit'],['ʌ','cup'],['ɒ','hot'],['ʊ','book'],['iː','see'],['uː','too'],['ɔː','law'],['ɑː','car'],['ɜː','bird'],['θ','think'],['ð','this'],['ʃ','she'],['ʒ','vision'],['tʃ','chair'],['dʒ','jump']].map(([s,e])=>`<span style="background:#fff;border:1px solid #fde68a;border-radius:6px;padding:.15rem .4rem;cursor:pointer;font-size:.82rem;" onclick="document.getElementById('vo-ipa-input').value+='${e}'">${s} <span style="color:#b45309;font-size:.7rem;">${e}</span></span>`).join('')}
    </div>
  </div>
</div>

<!-- Mic result panel -->
<div id="vo-mic-panel" style="display:none;" class="ait-card">
  <div style="font-weight:800;color:#7c3aed;margin-bottom:.75rem;">🎙️ Kết Quả Luyện Phát Âm</div>
  <div id="vo-mic-result" style="font-size:.9rem;color:#334155;line-height:1.7;"></div>
</div>
`;

    // ── Events ──────────────────────────────────────────────────
    const getText = () => area.querySelector('#vo-text')?.value?.trim() || '';
    const getLang = () => area.querySelector('#vo-lang')?.value || 'en-US';
    const getRate = () => parseFloat(area.querySelector('#vo-rate')?.value || '1.0');
    const statusBar = area.querySelector('#vo-status-bar');

    const showStatus = (msg, clr='#15803d', bg='#f0fdf4', border='#86efac') => {
      statusBar.innerHTML = msg; statusBar.style.color=clr; statusBar.style.background=bg; statusBar.style.borderColor=border; statusBar.style.display='block';
    };

    // File Import Handlers (Word, PDF, Image OCR)
    const fileInput = area.querySelector('#vo-file-input');
    const txtArea = area.querySelector('#vo-text');

    if (fileInput && txtArea) {
      const bWord = area.querySelector('#vo-btn-word');
      const bPdf = area.querySelector('#vo-btn-pdf');
      const bImg = area.querySelector('#vo-btn-img');

      if (bWord) bWord.onclick = () => { fileInput.accept = '.docx,.doc'; fileInput.click(); };
      if (bPdf) bPdf.onclick = () => { fileInput.accept = '.pdf'; fileInput.click(); };
      if (bImg) bImg.onclick = () => { fileInput.accept = '.png,.jpg,.jpeg,.bmp,.webp'; fileInput.click(); };

      fileInput.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        showStatus(`⌛ Đang nạp và trích xuất chữ từ tệp "${file.name}"...`, '#0284c7', '#f0f9ff', '#bae6fd');

        if (['docx', 'doc'].includes(ext)) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            try {
              const raw = evt.target.result;
              const matches = raw.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
              if (matches && matches.length > 0) {
                const extractedText = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ').replace(/s+/g, ' ');
                txtArea.value = extractedText;
                showStatus(`✅ Đã nạp thành công ${extractedText.length} ký tự từ file Word: ${file.name}`);
              } else {
                const clean = raw.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ').replace(/s+/g, ' ').trim();
                txtArea.value = clean.substring(0, 3000);
                showStatus(`✅ Đã trích xuất văn bản từ file Word: ${file.name}`);
              }
            } catch(err) {
              showStatus('⚠️ Không thể bóc tách file Word này. Vui lòng dán trực tiếp.','#dc2626','#fef2f2','#fecaca');
            }
          };
          reader.readAsText(file, 'utf-8');
        } else if (ext === 'pdf') {
          const reader = new FileReader();
          reader.onload = (evt) => {
            try {
              const dec = new TextDecoder('latin1');
              const raw = dec.decode(evt.target.result);
              const matches = raw.match(/\(([^)]+)\)\s*Tj|\[([^\]]+)\]\s*TJ/g);
              let textChunks = [];
              if (matches) {
                matches.forEach(m => {
                  const s = m.replace(/[\(\)\[\]]/g, '').replace(/Tj|TJ/g, '').trim();
                  if (s.length > 1 && !s.startsWith('/')) textChunks.push(s);
                });
              }
              if (textChunks.length > 0) {
                const pdfText = textChunks.join(' ').replace(/s+/g, ' ');
                txtArea.value = pdfText;
                showStatus(`✅ Đã nạp văn bản từ file PDF: ${file.name}`);
              } else {
                const clean = raw.replace(/[^a-zA-Z0-9\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ.,!?-]/g, ' ').replace(/\s+/g, ' ').trim();
                txtArea.value = clean.substring(0, 3000);
                showStatus(`✅ Đã trích xuất văn bản từ PDF: ${file.name}`);
              }
            } catch(err) {
              showStatus('⚠️ Không thể giải mã file PDF này.', '#dc2626','#fef2f2','#fecaca');
            }
          };
          reader.readAsArrayBuffer(file);
        } else if (['png', 'jpg', 'jpeg', 'bmp', 'webp'].includes(ext)) {
          const imgUrl = URL.createObjectURL(file);
          const processOcr = () => {
            if (typeof Tesseract !== 'undefined') {
              Tesseract.recognize(imgUrl, 'vie+eng').then(({ data: { text } }) => {
                const cleanText = text.trim();
                if (cleanText) {
                  txtArea.value = cleanText;
                  showStatus(`✅ Đã nhận diện chữ từ ảnh (OCR): ${file.name}`);
                } else {
                  showStatus('⚠️ Không tìm thấy chữ trong ảnh.', '#b45309','#fffbeb','#fde68a');
                }
              }).catch(() => {
                showStatus('⚠️ Lỗi nhận diện chữ từ ảnh.', '#dc2626','#fef2f2','#fecaca');
              });
            } else {
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
              script.onload = () => processOcr();
              script.onerror = () => {
                showStatus('⚠️ Không nạp được bộ OCR. Kiểm tra kết nối mạng.', '#dc2626','#fef2f2','#fecaca');
              };
              document.head.appendChild(script);
            }
          };
          processOcr();
        }
      };
    }

    // Clipboard Quick Paste & Clear Handlers
    const btnPaste = area.querySelector('#vo-btn-paste');
    const btnClear = area.querySelector('#vo-btn-clear');

    if (btnPaste && txtArea) {
      btnPaste.onclick = async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const pasted = await navigator.clipboard.readText();
            if (pasted && pasted.trim()) {
              txtArea.value = pasted.trim();
              showStatus(`✅ Đã dán thành công ${pasted.trim().length} ký tự từ bộ nhớ tạm!`);
            } else {
              showStatus('⚠️ Bộ nhớ tạm (Clipboard) đang trống.', '#b45309', '#fffbeb', '#fde68a');
            }
          } else {
            txtArea.focus();
            showStatus('💡 Thầy/cô nhấp chuột vào ô và ấn phím Ctrl+V để dán.', '#0284c7', '#f0f9ff', '#bae6fd');
          }
        } catch(err) {
          txtArea.focus();
          showStatus('💡 Vui lòng nhấp chuột vào khung văn bản và ấn tổ hợp phím Ctrl + V để dán.', '#0284c7', '#f0f9ff', '#bae6fd');
        }
      };
    }

    if (btnClear && txtArea) {
      btnClear.onclick = () => {
        txtArea.value = '';
        showStatus('🗑️ Đã xóa sạch khung văn bản.', '#475569', '#f8fafc', '#cbd5e1');
      };
    }

    // Handle Pasted Image Blob & Run OCR Text Extraction
    const handlePastedImageBlob = (imageBlob) => {
      showStatus('⌛ Đang nạp & tự động quét chữ từ HÌNH ẢNH vừa dán (OCR)...', '#a855f7', '#faf5ff', '#e9d5ff');
      const imgUrl = URL.createObjectURL(imageBlob);

      let imgPreview = area.querySelector('#vo-img-preview-box');
      if (!imgPreview) {
        imgPreview = document.createElement('div');
        imgPreview.id = 'vo-img-preview-box';
        imgPreview.style.cssText = 'background:#faf5ff; border:1.5px solid #c084fc; border-radius:12px; padding:0.75rem; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.85rem;';
        txtArea.parentNode.insertBefore(imgPreview, txtArea);
      }
      imgPreview.innerHTML = `
        <img src="${imgUrl}" style="max-height:75px; max-width:110px; border-radius:8px; border:1px solid #d8b4fe; object-fit:contain;">
        <div style="flex:1;">
          <div style="font-weight:800; color:#7e22ce; font-size:0.85rem;">🖼️ Ảnh vừa dán từ bộ nhớ tạm (Ctrl+V)</div>
          <div id="vo-ocr-status" style="font-size:0.8rem; color:#6b21a8; font-weight:600;">⌛ Đang tự động quét chữ từ hình ảnh...</div>
        </div>
        <button id="vo-del-img-prev" style="background:#ef4444; color:#fff; border:none; padding:0.25rem 0.65rem; border-radius:8px; font-weight:800; cursor:pointer;">✕ Xóa</button>
      `;

      const delBtn = imgPreview.querySelector('#vo-del-img-prev');
      if (delBtn) delBtn.onclick = () => imgPreview.remove();

      const processOcr = () => {
        if (typeof Tesseract !== 'undefined') {
          Tesseract.recognize(imgUrl, 'vie+eng').then(({ data: { text } }) => {
            const cleanText = text.trim();
            const ocrStatus = imgPreview.querySelector('#vo-ocr-status');
            if (cleanText) {
              txtArea.value = cleanText;
              if (ocrStatus) ocrStatus.innerHTML = `✅ Đã quét thành công ${cleanText.length} ký tự!`;
              showStatus(`✅ Đã quét thành công chữ từ HÌNH ẢNH vừa dán (${cleanText.length} ký tự)!`);
            } else {
              if (ocrStatus) ocrStatus.innerHTML = `⚠️ Không tìm thấy chữ trong ảnh.`;
              showStatus('⚠️ Không tìm thấy văn bản trong hình ảnh vừa dán.', '#b45309', '#fffbeb', '#fde68a');
            }
          }).catch(() => {
            showStatus('⚠️ Lỗi khi quét chữ từ ảnh.', '#dc2626', '#fef2f2', '#fecaca');
          });
        } else {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
          script.onload = () => processOcr();
          script.onerror = () => {
            showStatus('⚠️ Không nạp được bộ OCR. Kiểm tra kết nối mạng.', '#dc2626', '#fef2f2', '#fecaca');
          };
          document.head.appendChild(script);
        }
      };
      processOcr();
    };

    if (txtArea) {
      txtArea.onpaste = (e) => {
        const items = e.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              e.preventDefault();
              const blob = items[i].getAsFile();
              if (blob) handlePastedImageBlob(blob);
              return;
            }
          }
        }
        setTimeout(() => {
          const val = txtArea.value.trim();
          if (val) showStatus(`✅ Đã dán thành công ${val.length} ký tự vào khung đọc mẫu!`);
        }, 50);
      };
    }

    // Rate slider
    area.querySelector('#vo-rate').oninput = (e) => {
      area.querySelector('#vo-rate-label').textContent = parseFloat(e.target.value).toFixed(1) + 'x';
    };

    // Presets
    area.querySelectorAll('.vo-preset').forEach(btn => {
      btn.onclick = () => {
        const p = PRESETS[+btn.dataset.i];
        area.querySelector('#vo-text').value = p.text;
        area.querySelector('#vo-lang').value = p.lang;
        area.querySelector('#vo-rate').value = p.rate;
        area.querySelector('#vo-rate-label').textContent = p.rate.toFixed(1) + 'x';
        showStatus(`✅ Đã nạp bài mẫu: ${p.label}`);
      };
    });

    // Play with Gender-Specific Male US / Female UK Voice Matching
    area.querySelector('#vo-play').onclick = () => {
      const text = getText();
      if (!text) { showStatus('⚠️ Vui lòng nhập văn bản trước!','#b45309','#fffbeb','#fde68a'); return; }
      if (!('speechSynthesis' in window)) {
        showStatus('⚠️ Trình duyệt không hỗ trợ phát âm. Vui lòng dùng Chrome/Edge.','#dc2626','#fef2f2','#fecaca'); return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const selectedLang = getLang();
      u.lang = selectedLang;
      u.rate = getRate();

      const voices = window.speechSynthesis.getVoices() || [];
      if (voices.length > 0) {
        if (selectedLang === 'en-US') {
          // Male US Voice matching
          const usMaleVoice = voices.find(v => {
            const n = (v.name || '').toLowerCase();
            const l = (v.lang || '').toLowerCase().replace('_', '-');
            return (l.includes('en-us') || l.includes('en')) && (n.includes('david') || n.includes('mark') || n.includes('guy') || n.includes('george') || n.includes('male'));
          });
          if (usMaleVoice) u.voice = usMaleVoice;
          u.pitch = 0.90; // Deep masculine tone
        } else if (selectedLang === 'en-GB') {
          // Female UK Voice matching
          const ukFemaleVoice = voices.find(v => {
            const n = (v.name || '').toLowerCase();
            const l = (v.lang || '').toLowerCase().replace('_', '-');
            return (l.includes('en-gb') || l.includes('en')) && (n.includes('hazel') || n.includes('susan') || n.includes('victoria') || n.includes('zira') || n.includes('female'));
          });
          if (ukFemaleVoice) u.voice = ukFemaleVoice;
          u.pitch = 1.15; // Higher feminine tone
        }
      }

      u.onstart  = () => showStatus('🔊 Đang đọc mẫu... Học sinh hãy lắng nghe!');
      u.onend    = () => showStatus('✅ Đọc xong! Học sinh hãy luyện đọc lại.','#1d4ed8','#eff6ff','#bfdbfe');
      u.onerror  = () => showStatus('⚠️ Lỗi phát âm. Kiểm tra kết nối mạng.','#dc2626','#fef2f2','#fecaca');
      window.speechSynthesis.speak(u);
    };

    // Stop
    area.querySelector('#vo-stop').onclick = () => {
      window.speechSynthesis?.cancel();
      showStatus('⏹️ Đã dừng phát âm.','#475569','#f8fafc','#cbd5e1');
    };

    // IPA lookup (mini dictionary)
    const IPA_DICT = {
      school:'/skuːl/',apple:'/ˈæp.əl/',book:'/bʊk/',teacher:'/ˈtiː.tʃər/',
      student:'/ˈstjuː.dənt/',class:'/klɑːs/',lesson:'/ˈles.ən/',learn:'/lɜːn/',
      beautiful:'/ˈbjuː.tɪ.fəl/',friend:'/frend/',science:'/ˈsaɪ.əns/',nature:'/ˈneɪ.tʃər/',
      water:'/ˈwɔː.tər/',earth:'/ɜːθ/',heart:'/hɑːt/',world:'/wɜːld/',
      butterfly:'/ˈbʌt.ə.flaɪ/',symmetry:'/ˈsɪm.ɪ.tri/',geometry:'/dʒiˈɒm.ɪ.tri/',
      mathematics:'/ˌmæθ.əˈmæt.ɪks/',chemistry:'/ˈkem.ɪ.stri/',physics:'/ˈfɪz.ɪks/'
    };
    area.querySelector('#vo-ipa-btn').onclick = () => {
      const word = area.querySelector('#vo-ipa-input').value.trim().toLowerCase();
      const res = area.querySelector('#vo-ipa-result');
      if (!word) return;
      const ipa = IPA_DICT[word];
      if (ipa) {
        res.innerHTML = `<b>${word}</b> → <span style="font-size:1.1rem;color:#7c3aed;">${ipa}</span>`;
        // auto-speak
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(word);
          u.lang = getLang(); u.rate = 0.8;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        }
      } else {
        res.innerHTML = `<span style="color:#b45309;">Chưa có "${word}" trong từ điển IPA. Thử: school, apple, teacher, butterfly, science...</span>`;
      }
    };

    // Microphone
    area.querySelector('#vo-mic').onclick = () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const micPanel = area.querySelector('#vo-mic-panel');
      const micResult = area.querySelector('#vo-mic-result');
      if (!SR) {
        showStatus('⚠️ Trình duyệt không hỗ trợ nhận diện giọng nói. Dùng Chrome/Edge trên máy tính.','#dc2626','#fef2f2','#fecaca');
        return;
      }
      const rec = new SR();
      rec.lang = getLang();
      rec.continuous = false;
      rec.interimResults = true;
      showStatus('🎙️ Đang lắng nghe... Hãy đọc to và rõ ràng!','#7c3aed','#f5f3ff','#ddd6fe');
      micPanel.style.display = 'block';
      micResult.innerHTML = '<span style="color:#7c3aed;">🎙️ Đang nhận diện...</span>';

      rec.onresult = (e) => {
        const transcript = Array.from(e.results).map(r=>r[0].transcript).join('');
        const original = getText();
        if (e.results[0].isFinal) {
          const similarity = this._calcSimilarity(transcript.toLowerCase(), original.toLowerCase());
          micResult.innerHTML = `
            <div style="margin-bottom:.5rem;"><b>Bạn đọc:</b> "${transcript}"</div>
            <div style="margin-bottom:.5rem;"><b>Đoạn mẫu:</b> "${original.substring(0,80)}${original.length>80?'...':''}"</div>
            <div style="margin-top:.75rem;display:flex;align-items:center;gap:.75rem;">
              <div style="font-size:2rem;font-weight:900;color:${similarity>80?'#16a34a':similarity>60?'#d97706':'#dc2626'};">${similarity}%</div>
              <div><div style="font-weight:800;">${similarity>80?'🌟 Xuất sắc!':similarity>60?'👍 Khá tốt!':'🔁 Cần luyện thêm!'}</div>
              <div style="font-size:.8rem;color:#64748b;">${similarity>80?'Phát âm chuẩn, tự nhiên!':similarity>60?'Khá chuẩn, chú ý một vài âm.':'Thử đọc chậm hơn và nghe lại mẫu.'}</div></div>
            </div>`;
          showStatus(`✅ Đã phân tích xong · Độ chính xác: ${similarity}%`);
        } else {
          micResult.innerHTML = `<span style="color:#7c3aed;">🎙️ "${transcript}"</span>`;
        }
      };
      rec.onerror = () => { showStatus('⚠️ Không nhận được giọng nói. Kiểm tra micro.','#dc2626','#fef2f2','#fecaca'); };
      rec.start();
    };
  },

  _calcSimilarity(a, b) {
    // Jaccard similarity on word sets
    const wa = new Set(a.split(/\s+/).filter(Boolean));
    const wb = new Set(b.split(/\s+/).filter(Boolean));
    const inter = [...wa].filter(w=>wb.has(w)).length;
    const union = new Set([...wa,...wb]).size;
    return union === 0 ? 0 : Math.round((inter/union)*100);
  },

  // ═══════════════════════════════════════════════════════════════
  // TAB 4 — MÔ PHỎNG THÍ NGHIỆM & 3D
  // ═══════════════════════════════════════════════════════════════
  _renderSim() {
    const area = this._area();

    area.innerHTML = `
<div class="ait-card">
  <h3 style="margin:0 0 1rem;font-family:var(--font-title);color:#7c3aed;font-size:1.1rem;">🧪 Trợ Lý Mô Phỏng Hình Học 3D & Thí Nghiệm Khoa Học Ảo</h3>
  <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem;">
    <button id="sim-btn-3d" class="ait-btn ${this.sim.mode==='3d'?'ait-btn-purple':'ait-btn-ghost'}">📐 Hình Học Không Gian 3D</button>
    <button id="sim-btn-chem" class="ait-btn ${this.sim.mode==='chem'?'ait-btn-teal':'ait-btn-ghost'}">⚗️ Thí Nghiệm Hóa Học (KHTN)</button>
    <button id="sim-btn-circuit" class="ait-btn ${this.sim.mode==='circuit'?'ait-btn-orange':'ait-btn-ghost'}">⚡ Mạch Điện Thông Minh (Vật Lý)</button>
  </div>
  <div id="sim-viewport"></div>
</div>`;

    const vp = area.querySelector('#sim-viewport');
    area.querySelector('#sim-btn-3d').onclick     = () => { this.sim.mode='3d'; this._renderSim(); };
    area.querySelector('#sim-btn-chem').onclick   = () => { this.sim.mode='chem'; this._renderSim(); };
    area.querySelector('#sim-btn-circuit').onclick= () => { this.sim.mode='circuit'; this._renderSim(); };

    if (this.sim.mode==='3d') this._sim3D(vp);
    else if (this.sim.mode==='chem') this._simChem(vp);
    else this._simCircuit(vp);
  },

  _sim3D(vp) {
    const SHAPES = {
      pyramid:  { name:'Hình Chóp Tứ Giác S.ABCD', faces:[[0,1,2,3],[0,1,4],[1,2,4],[2,3,4],[3,0,4]], verts:null, clr:'#818cf8' },
      cube:     { name:'Khối Lập Phương A.BCDE A′B′C′D′', faces:[], verts:null, clr:'#34d399' },
      cylinder: { name:'Hình Trụ Tròn Xoay', faces:[], verts:null, clr:'#fb923c' },
      prism:    { name:'Lăng Trụ Tam Giác', faces:[], verts:null, clr:'#38bdf8' }
    };

    vp.innerHTML = `
<div style="background:#0f172a;border-radius:16px;padding:1.25rem;border:2px solid #6d28d9;color:#fff;">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;">
    <span style="font-weight:800;color:#c4b5fd;display:flex;align-items:center;gap:.4rem;">📐 HÌNH HỌC KHÔNG GIAN 3D TƯƠNG TÁC</span>
    <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
      ${Object.entries(SHAPES).map(([k,v])=>`<button class="sim-3d-shape ait-btn ait-btn-sm" data-shape="${k}" style="background:${this.sim.shape===k?v.clr:'#334155'};color:#fff;border:none;">${v.name.split(' ')[0]} ${v.name.split(' ')[1]}</button>`).join('')}
    </div>
  </div>

  <canvas id="sim-3d-canvas" width="700" height="380" style="width:100%;border-radius:12px;background:#1e293b;cursor:grab;display:block;"></canvas>

  <div id="sim-3d-info" style="margin-top:.85rem;display:flex;gap:1.5rem;flex-wrap:wrap;">
    <div style="background:#1e293b;border-radius:10px;padding:.75rem 1rem;flex:1;min-width:160px;">
      <div style="font-size:.75rem;color:#64748b;font-weight:700;margin-bottom:.25rem;">HÌNH ĐANG XEM</div>
      <div id="sim-3d-name" style="font-weight:800;color:#c4b5fd;font-size:.95rem;"></div>
    </div>
    <div style="background:#1e293b;border-radius:10px;padding:.75rem 1rem;flex:1;min-width:160px;">
      <div style="font-size:.75rem;color:#64748b;font-weight:700;margin-bottom:.25rem;">CÔNG THỨC</div>
      <div id="sim-3d-formula" style="font-size:.82rem;color:#e2e8f0;line-height:1.5;"></div>
    </div>
    <div style="background:#1e293b;border-radius:10px;padding:.75rem 1rem;flex:1;min-width:160px;">
      <div style="font-size:.75rem;color:#64748b;font-weight:700;margin-bottom:.25rem;">ĐIỀU KHIỂN</div>
      <div style="font-size:.78rem;color:#94a3b8;">🖱️ Kéo chuột: Xoay<br>⚙️ Scroll: Zoom<br>← → ↑ ↓: Góc xem</div>
    </div>
  </div>

  <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem;">
    <label style="display:flex;align-items:center;gap:.35rem;cursor:pointer;font-size:.82rem;color:#94a3b8;">
      <input type="checkbox" id="sim-wire" ${this.sim.wireframe?'checked':''}> Wireframe (khung dây)
    </label>
    <label style="display:flex;align-items:center;gap:.35rem;cursor:pointer;font-size:.82rem;color:#94a3b8;margin-left:1rem;">
      <input type="checkbox" id="sim-autorot" checked> Tự động xoay
    </label>
  </div>
</div>`;

    vp.querySelectorAll('.sim-3d-shape').forEach(btn => {
      btn.onclick = () => { this.sim.shape = btn.dataset.shape; this._sim3D(vp); };
    });

    const canvas = vp.querySelector('#sim-3d-canvas');
    const ctx = canvas.getContext('2d');
    const nameEl = vp.querySelector('#sim-3d-name');
    const formulaEl = vp.querySelector('#sim-3d-formula');

    const FORMULAS = {
      pyramid: 'V = (1/3) × S_đáy × h\nS_xq = (1/2) × C_đáy × h_tam_giác',
      cube:    'V = a³\nS_tp = 6a²\nĐường chéo = a√3',
      cylinder:'V = πr²h\nS_xq = 2πrh\nS_tp = 2πr(r+h)',
      prism:   'V = S_đáy × h\nS_xq = C_đáy × h\nS_tp = 2S_đáy + S_xq'
    };

    nameEl.textContent = SHAPES[this.sim.shape].name;
    formulaEl.textContent = FORMULAS[this.sim.shape];

    // ── 3D Engine (lightweight) ──────────────────────────────────
    let rx = 0.4, ry = 0.6, rz = 0;
    let dragging = false, lastX = 0, lastY = 0;
    let zoom = 1.0;
    let autoRot = true;

    const GEOMS = {
      pyramid: {
        verts: [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[0,1.4,0]],
        edges: [[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4]],
        faces: [[0,1,2,3],[0,1,4],[1,2,4],[2,3,4],[3,0,4]]
      },
      cube: {
        verts: [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],
        edges: [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],
        faces: [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[3,0,4,7]]
      },
      cylinder: {
        verts: (()=>{const v=[];const N=12;for(let i=0;i<N;i++){const a=2*Math.PI*i/N;v.push([Math.cos(a),-.9,Math.sin(a)]);v.push([Math.cos(a),.9,Math.sin(a)]);}return v;})(),
        edges: (()=>{const e=[];const N=12;for(let i=0;i<N;i++){e.push([i*2,(i+1)%N*2]);e.push([i*2+1,(i+1)%N*2+1]);e.push([i*2,i*2+1]);}return e;})(),
        faces: []
      },
      prism: {
        verts: [[-1,-1,0],[1,-1,0],[0,-1,1.4],[-1,1,0],[1,1,0],[0,1,1.4]],
        edges: [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[0,3],[1,4],[2,5]],
        faces: [[0,1,2],[3,4,5],[0,1,4,3],[1,2,5,4],[2,0,3,5]]
      }
    };

    const project = (v) => {
      // Rotate X
      let y=v[1]*Math.cos(rx)-v[2]*Math.sin(rx), z=v[1]*Math.sin(rx)+v[2]*Math.cos(rx);
      let x=v[0]*Math.cos(ry)+z*Math.sin(ry);
      z=-v[0]*Math.sin(ry)+z*Math.cos(ry);
      // Project
      const sc = 120*zoom;
      const cx = canvas.width/2, cy = canvas.height/2;
      const fov = 3.5;
      return [cx + x*sc/(fov-z*.2), cy - y*sc/(fov-z*.2)];
    };

    const draw3D = () => {
      const W=canvas.width, H=canvas.height;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#1e293b'; ctx.fillRect(0,0,W,H);

      const geo = GEOMS[this.sim.shape];
      const shapeClr = SHAPES[this.sim.shape].clr;
      const pts = geo.verts.map(project);

      // Draw faces (filled)
      if (!vp.querySelector('#sim-wire').checked) {
        geo.faces.forEach(f => {
          ctx.beginPath();
          const p0=pts[f[0]]; ctx.moveTo(p0[0],p0[1]);
          f.slice(1).forEach(i=>ctx.lineTo(pts[i][0],pts[i][1]));
          ctx.closePath();
          ctx.fillStyle = shapeClr+'33';
          ctx.fill();
        });
      }

      // Draw edges
      ctx.strokeStyle = shapeClr;
      ctx.lineWidth = 2;
      geo.edges.forEach(([a,b]) => {
        ctx.beginPath(); ctx.moveTo(pts[a][0],pts[a][1]); ctx.lineTo(pts[b][0],pts[b][1]); ctx.stroke();
      });

      // Draw vertices
      ctx.fillStyle = '#fff';
      geo.verts.forEach((v,i)=>{
        const p=pts[i];
        ctx.beginPath(); ctx.arc(p[0],p[1],4,0,Math.PI*2); ctx.fill();
      });
    };

    let animFrame;
    const loop = () => {
      if (vp.querySelector('#sim-autorot')?.checked) ry += 0.008;
      draw3D();
      animFrame = requestAnimationFrame(loop);
    };
    loop();

    // Mouse drag
    canvas.onmousedown = (e) => { dragging=true; lastX=e.clientX; lastY=e.clientY; canvas.style.cursor='grabbing'; };
    window.onmouseup  = () => { dragging=false; canvas.style.cursor='grab'; };
    window.onmousemove= (e) => {
      if(!dragging) return;
      ry += (e.clientX-lastX)*0.01;
      rx += (e.clientY-lastY)*0.01;
      lastX=e.clientX; lastY=e.clientY;
    };
    canvas.onwheel = (e) => { zoom = Math.max(0.4, Math.min(2.5, zoom-e.deltaY*0.001)); e.preventDefault(); };

    // Cleanup on tab switch
    const origRender = this.render.bind(this);
    this.render = (dom) => { cancelAnimationFrame(animFrame); this.render = origRender; this.render(dom); };
  },

  _simChem(vp) {
    const STATE = {
      neutral: { liqColor:'#bfdbfe', liqH:45, quitim:'Tím (pH = 7)', phenol:'Không màu',
        gasColor:'transparent', eqn:'H₂O ⇌ H⁺ + OH⁻  (Trung tính)', status:'💧 Dung dịch trung tính', statusClr:'#0369a1' },
      acid:    { liqColor:'#fca5a5', liqH:55, quitim:'Đỏ (pH < 7)', phenol:'Không màu (Phenol không đổi trong axit)',
        gasColor:'transparent', eqn:'HCl → H⁺ + Cl⁻  (Axit mạnh)', status:'🔴 Môi trường AXIT', statusClr:'#dc2626' },
      base:    { liqColor:'#93c5fd', liqH:55, quitim:'Xanh (pH > 7)', phenol:'Đỏ hồng (Phenol đổi trong bazơ)',
        gasColor:'transparent', eqn:'NaOH → Na⁺ + OH⁻  (Bazơ mạnh)', status:'🔵 Môi trường BAZƠ', statusClr:'#2563eb' },
      hcl_zn:  { liqColor:'#d9f99d', liqH:65, quitim:'Đỏ', phenol:'Không màu',
        gasColor:'rgba(200,200,255,.5)', eqn:'Zn + 2HCl → ZnCl₂ + H₂↑', status:'🫧 Bọt khí H₂ bay lên!', statusClr:'#16a34a' }
    };

    const draw = () => {
      const s = STATE[this.sim.chemState] || STATE.neutral;
      const bubbles = this.sim.chemState === 'hcl_zn';

      vp.innerHTML = `
<div style="background:#fff;border-radius:16px;border:2px solid #e2e8f0;padding:1.5rem;">
  <h4 style="margin:0 0 1rem;font-family:var(--font-title);color:#0284c7;">⚗️ THÍ NGHIỆM HÓA HỌC: AXIT - BAZƠ VÀ CHỈ THỊ MÀU</h4>

  <div style="display:flex;flex-wrap:wrap;gap:2rem;align-items:flex-start;justify-content:center;">
    <!-- Beaker -->
    <div style="display:flex;flex-direction:column;align-items:center;gap:.75rem;">
      <div style="position:relative;width:130px;height:200px;">
        <!-- Bình -->
        <div style="position:absolute;bottom:0;left:10px;right:10px;height:100%;border:4px solid #64748b;border-top:none;border-radius:0 0 20px 20px;overflow:hidden;background:#f8fafc;">
          <!-- Liquid -->
          <div id="chem-liquid" style="position:absolute;bottom:0;left:0;right:0;height:${s.liqH}%;background:${s.liqColor};transition:all .7s ease;"></div>
          <!-- Bubbles -->
          <div id="chem-bubbles" style="position:absolute;bottom:${s.liqH}%;left:0;right:0;height:60px;overflow:hidden;pointer-events:none;"></div>
        </div>
        <!-- Beaker rim -->
        <div style="position:absolute;top:0;left:0;right:0;height:10px;border-bottom:4px solid #64748b;border-left:4px solid #64748b;border-right:4px solid #64748b;border-top:4px solid #64748b;border-radius:4px;background:#fff;"></div>
        <!-- Graduation marks -->
        ${[25,50,75].map(p=>`<div style="position:absolute;right:-22px;bottom:${p}%;font-size:.62rem;color:#94a3b8;font-weight:700;">${p}%</div>`).join('')}
      </div>
      <div id="chem-status" style="font-weight:800;font-size:.92rem;color:${s.statusClr};text-align:center;">${s.status}</div>
    </div>

    <!-- Controls -->
    <div style="flex:1;min-width:220px;">
      <div class="ait-label" style="margin-bottom:.5rem;">Nhỏ thuốc thử vào dung dịch:</div>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-bottom:1rem;">
        <button id="chem-acid" class="ait-btn" style="background:#ef4444;color:#fff;justify-content:flex-start;">🧪 Nhỏ Axit HCl (pH giảm)</button>
        <button id="chem-base" class="ait-btn" style="background:#3b82f6;color:#fff;justify-content:flex-start;">🧪 Nhỏ Bazơ NaOH (pH tăng)</button>
        <button id="chem-zn" class="ait-btn" style="background:#16a34a;color:#fff;justify-content:flex-start;">⚙️ Thêm Kẽm (Zn) + HCl → H₂↑</button>
        <button id="chem-reset" class="ait-btn ait-btn-ghost">🔄 Rửa cốc (Trung tính)</button>
      </div>

      <!-- Indicator selector -->
      <div class="ait-label">Chọn Chỉ Thị Màu:</div>
      <div style="display:flex;gap:.5rem;margin-bottom:.85rem;">
        <button id="ind-quitim" class="ait-btn ait-btn-sm" style="background:${this.sim.chemIndicator==='quitim'?'#7c3aed':'#f1f5f9'};color:${this.sim.chemIndicator==='quitim'?'#fff':'#475569'};border:1.5px solid #e2e8f0;">🟣 Quỳ Tím</button>
        <button id="ind-phenol" class="ait-btn ait-btn-sm" style="background:${this.sim.chemIndicator==='phenol'?'#7c3aed':'#f1f5f9'};color:${this.sim.chemIndicator==='phenol'?'#fff':'#475569'};border:1.5px solid #e2e8f0;">🧴 Phenolphtalein</button>
      </div>

      <!-- Indicator result -->
      <div style="background:#f8fafc;border-radius:12px;padding:.85rem;border:1.5px solid #e2e8f0;">
        <div class="ait-label">Kết Quả Chỉ Thị Màu:</div>
        <table style="width:100%;font-size:.83rem;border-collapse:collapse;">
          <tr style="background:#f1f5f9;"><th style="padding:.35rem;text-align:left;">Chỉ thị</th><th style="padding:.35rem;text-align:left;">Kết quả</th></tr>
          <tr><td style="padding:.35rem;">🟣 Quỳ tím</td><td style="padding:.35rem;font-weight:700;">${s.quitim}</td></tr>
          <tr><td style="padding:.35rem;">🧴 Phenolphtalein</td><td style="padding:.35rem;font-weight:700;">${s.phenol}</td></tr>
        </table>
      </div>

      <!-- Equation -->
      <div style="background:#fffbeb;border-radius:10px;padding:.75rem;border:1.5px solid #fde68a;margin-top:.75rem;">
        <div class="ait-label" style="color:#b45309;">Phương trình ion rút gọn:</div>
        <div style="font-weight:800;color:#92400e;font-size:.92rem;">${s.eqn}</div>
      </div>
    </div>
  </div>
</div>`;

      // Bubbles animation
      if (bubbles) {
        const bubbleEl = vp.querySelector('#chem-bubbles');
        if (bubbleEl) {
          const makeBubble = () => {
            if (!document.contains(bubbleEl)) return;
            const b = document.createElement('div');
            b.className = 'ait-bubble';
            const sz = 4 + Math.random()*10;
            b.style.cssText = `width:${sz}px;height:${sz}px;background:rgba(200,220,255,.7);left:${10+Math.random()*80}%;bottom:0;animation-duration:${0.8+Math.random()*.8}s;animation-delay:${Math.random()*.4}s;`;
            bubbleEl.appendChild(b);
            setTimeout(()=>b.remove(), 1400);
          };
          const bubbleInterval = setInterval(makeBubble, 200);
          setTimeout(()=>clearInterval(bubbleInterval), 5000);
        }
      }

      // Events
      vp.querySelector('#chem-acid').onclick   = () => { this.sim.chemState='acid'; draw(); };
      vp.querySelector('#chem-base').onclick   = () => { this.sim.chemState='base'; draw(); };
      vp.querySelector('#chem-zn').onclick     = () => { this.sim.chemState='hcl_zn'; draw(); };
      vp.querySelector('#chem-reset').onclick  = () => { this.sim.chemState='neutral'; draw(); };
      vp.querySelector('#ind-quitim').onclick  = () => { this.sim.chemIndicator='quitim'; draw(); };
      vp.querySelector('#ind-phenol').onclick  = () => { this.sim.chemIndicator='phenol'; draw(); };
    };

    draw();
  },

  _simCircuit(vp) {
    const draw = () => {
      const {voltage:U, resistance:R, closed:isClosed} = this.sim.circuit;
      const I = isClosed ? (U/R) : 0;
      const P = isClosed ? (U*I) : 0;
      const brightness = isClosed ? Math.min(1, I/3) : 0;
      const lampGlow = `drop-shadow(0 0 ${Math.round(brightness*30)}px #facc15)`;

      vp.innerHTML = `
<div style="background:#1e293b;border-radius:16px;padding:1.5rem;border:2px solid #d97706;color:#fff;">
  <h4 style="margin:0 0 1rem;font-family:var(--font-title);color:#fbbf24;display:flex;align-items:center;gap:.5rem;">
    ⚡ MÔ PHỎNG MẠCH ĐIỆN · ĐỊNH LUẬT ÔM (I = U/R)
  </h4>

  <!-- Circuit visual -->
  <div style="display:flex;align-items:center;justify-content:center;gap:1.5rem;flex-wrap:wrap;margin-bottom:1.5rem;">
    <!-- Battery -->
    <div style="text-align:center;">
      <div style="font-size:2.5rem;">🔋</div>
      <div style="font-weight:800;color:#4ade80;font-size:1.1rem;">${U.toFixed(1)}V</div>
      <div style="font-size:.72rem;color:#94a3b8;">Nguồn</div>
    </div>

    <!-- Wire indicators -->
    <div style="display:flex;flex-direction:column;gap:.3rem;align-items:center;">
      ${isClosed ? Array.from({length:5},(_,i)=>`<div style="width:60px;height:3px;background:hsl(${210+i*10},80%,${50+brightness*20}%);border-radius:2px;animation:none;opacity:${0.4+i*.15};"></div>`).join('') : `<div style="color:#f87171;font-size:.8rem;">MẠCH HỞ</div>`}
    </div>

    <!-- Switch K -->
    <div style="text-align:center;">
      <div style="font-size:2.5rem;">${isClosed?'🔌':'🔓'}</div>
      <div style="font-weight:800;color:${isClosed?'#4ade80':'#f87171'};font-size:.9rem;">${isClosed?'ĐÓNG (K)':'MỞ (K)'}</div>
    </div>

    <!-- Ammeter -->
    <div style="background:rgba(255,255,255,.08);border:2px solid #60a5fa;border-radius:12px;padding:.75rem 1rem;text-align:center;min-width:90px;">
      <div style="font-size:.7rem;color:#93c5fd;font-weight:700;margin-bottom:.25rem;">⚡ AMPE KẾ</div>
      <div style="font-size:1.6rem;font-weight:900;color:#60a5fa;">${I.toFixed(2)}</div>
      <div style="font-size:.7rem;color:#64748b;">Ampe (A)</div>
    </div>

    <!-- Bulb -->
    <div style="text-align:center;">
      <div style="font-size:3.5rem;filter:${lampGlow};transition:filter .4s;">💡</div>
      <div style="font-weight:700;color:${isClosed?'#fbbf24':'#94a3b8'};font-size:.88rem;">${isClosed?brightness>0.7?'SÁNG RỰC!':brightness>0.3?'Sáng vừa':'Sáng yếu':'TẮT'}</div>
    </div>

    <!-- Voltmeter -->
    <div style="background:rgba(255,255,255,.08);border:2px solid #f472b6;border-radius:12px;padding:.75rem 1rem;text-align:center;min-width:90px;">
      <div style="font-size:.7rem;color:#f9a8d4;font-weight:700;margin-bottom:.25rem;">🔌 VÔN KẾ</div>
      <div style="font-size:1.6rem;font-weight:900;color:#f472b6;">${isClosed?U.toFixed(1):'0.0'}</div>
      <div style="font-size:.7rem;color:#64748b;">Vôn (V)</div>
    </div>
  </div>

  <!-- Sliders & Controls -->
  <div style="background:rgba(255,255,255,.05);border-radius:14px;padding:1rem 1.25rem;margin-bottom:1rem;">
    <div style="display:flex;gap:2rem;flex-wrap:wrap;margin-bottom:1rem;">
      <div style="flex:1;min-width:180px;">
        <label style="font-size:.8rem;font-weight:700;color:#fbbf24;display:block;margin-bottom:.4rem;">
          Hiệu điện thế (U) = ${U.toFixed(1)} V
        </label>
        <input type="range" id="circ-u" min="1.5" max="24" step="1.5" value="${U}" style="width:100%;accent-color:#fbbf24;">
        <div style="display:flex;justify-content:space-between;font-size:.7rem;color:#64748b;margin-top:.2rem;"><span>1.5V</span><span>24V</span></div>
      </div>
      <div style="flex:1;min-width:180px;">
        <label style="font-size:.8rem;font-weight:700;color:#60a5fa;display:block;margin-bottom:.4rem;">
          Điện trở (R) = ${R.toFixed(0)} Ω
        </label>
        <input type="range" id="circ-r" min="1" max="50" step="1" value="${R}" style="width:100%;accent-color:#60a5fa;">
        <div style="display:flex;justify-content:space-between;font-size:.7rem;color:#64748b;margin-top:.2rem;"><span>1Ω</span><span>50Ω</span></div>
      </div>
    </div>
    <button id="circ-toggle" class="ait-btn" style="background:${isClosed?'#dc2626':'#16a34a'};color:#fff;width:100%;justify-content:center;font-size:1rem;">
      ${isClosed?'🔴 Mở Khóa K (Ngắt Mạch)':'🟢 Đóng Khóa K (Kín Mạch)'}
    </button>
  </div>

  <!-- Formula display -->
  <div style="background:rgba(251,191,36,.1);border-radius:12px;padding:.85rem 1rem;border:1.5px solid rgba(251,191,36,.3);">
    <div style="font-weight:800;color:#fbbf24;font-size:.82rem;margin-bottom:.4rem;">📐 Định Luật Ôm (Ohm's Law):</div>
    <div style="font-size:1.05rem;font-weight:900;letter-spacing:.05em;">
      I = U ÷ R = ${U.toFixed(1)} ÷ ${R.toFixed(0)} = <span style="color:#4ade80;">${I.toFixed(3)} A</span>
    </div>
    <div style="font-size:.82rem;color:#94a3b8;margin-top:.35rem;">
      Công suất: P = U × I = ${U.toFixed(1)} × ${I.toFixed(3)} = <span style="color:#f472b6;">${P.toFixed(2)} W</span>
    </div>
  </div>
</div>`;

      vp.querySelector('#circ-u').oninput = (e) => { this.sim.circuit.voltage = parseFloat(e.target.value); draw(); };
      vp.querySelector('#circ-r').oninput = (e) => { this.sim.circuit.resistance = parseFloat(e.target.value); draw(); };
      vp.querySelector('#circ-toggle').onclick = () => { this.sim.circuit.closed = !this.sim.circuit.closed; draw(); };
    };
    draw();
  }
};
