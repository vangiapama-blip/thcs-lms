// Database module for Junior High School LMS (Cấp THCS) - TH-THCS Ama Trang Lơng
// Handles mock database state persisted in LocalStorage

if (typeof localStorage === 'undefined') {
  const _mockStorage = {};
  globalThis.localStorage = {
    getItem: (k) => _mockStorage[k] || null,
    setItem: (k, v) => { _mockStorage[k] = String(v); },
    removeItem: (k) => { delete _mockStorage[k]; },
    clear: () => { Object.keys(_mockStorage).forEach(k => delete _mockStorage[k]); }
  };
}

function formatDateVN(dateInput) {
  if (!dateInput) return '---';
  let str = String(dateInput).trim();
  if (!str || str === 'null' || str === 'undefined') return '---';

  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
    const parts = str.split('/');
    const d = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0');
    const y = parts[2];
    return `${d}/${m}/${y}`;
  }

  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${d}/${m}/${y}`;
  }

  try {
    const dObj = new Date(str);
    if (!isNaN(dObj.getTime())) {
      const d = String(dObj.getDate()).padStart(2, '0');
      const m = String(dObj.getMonth() + 1).padStart(2, '0');
      const y = dObj.getFullYear();
      return `${d}/${m}/${y}`;
    }
  } catch(e) {}

  return str;
}
if (typeof window !== 'undefined') {
  window.formatDateVN = formatDateVN;
}
if (typeof globalThis !== 'undefined') {
  globalThis.formatDateVN = formatDateVN;
}

const DB_KEY = 'THCS_LMS_DATABASE_STATE_PRO_2026';

const DEFAULT_SUBJECTS = [
  { id: 'toan', name: 'Toán học', icon: '📐' },
  { id: 'van', name: 'Ngữ văn', icon: '📖' },
  { id: 'anh', name: 'Tiếng Anh', icon: '🇬🇧' },
  { id: 'khtn', name: 'Khoa học Tự nhiên', icon: '🔬' },
  { id: 'lsdl', name: 'Lịch sử và Địa lý', icon: '🗺️' },
  { id: 'tin', name: 'Tin học', icon: '💻' },
  { id: 'gdcd', name: 'Giáo dục Công dân', icon: '⚖️' },
  { id: 'congnghe', name: 'Công nghệ', icon: '🛠️' },
  { id: 'nghethuat', name: 'Nghệ thuật (Âm nhạc / Mỹ thuật)', icon: '🎨' },
  { id: 'gdtc', name: 'Giáo dục Thể chất', icon: '⚽' },
  { id: 'hn_trainghiem', name: 'HĐ Trải nghiệm, Hướng nghiệp', icon: '🌟' }
];

const DEFAULT_TEACHERS = [];

const DEFAULT_STUDENTS = [];

const DEFAULT_CHAPTERS = [
  { id: 'toan_c1', subjectId: 'toan', title: 'Chủ đề 1: Số tự nhiên & Các phép tính' },
  { id: 'toan_c2', subjectId: 'toan', title: 'Chủ đề 2: Tính chia hết trong tập hợp N' },
  { id: 'toan_c3', subjectId: 'toan', title: 'Chủ đề 3: Phân số và Số thập phân' },
  { id: 'van_c1', subjectId: 'van', title: 'Chủ đề 1: Truyện dân gian (Truyền thuyết & Cổ tích)' },
  { id: 'van_c2', subjectId: 'van', title: 'Chủ đề 2: Thơ và Thơ trữ tình' },
  { id: 'anh_c1', subjectId: 'anh', title: 'Unit 1: My New School' },
  { id: 'anh_c2', subjectId: 'anh', title: 'Unit 2: My House' },
  { id: 'tin_c1', subjectId: 'tin', title: 'Chủ đề A: Máy tính và Cộng đồng' },
  { id: 'tin_c2', subjectId: 'tin', title: 'Chủ đề B: Mạng máy tính và Internet' },
  { id: 'khtn_c1', subjectId: 'khtn', title: 'Chủ đề 1: Các phép đo & Tế bào - Đơn vị của sự sống' },
  { id: 'lsdl_c1', subjectId: 'lsdl', title: 'Chủ đề 1: Lịch sử và Địa lý THCS' },
  { id: 'gdcd_c1', subjectId: 'gdcd', title: 'Chủ đề 1: Tự hào về truyền thống gia đình' }
];

const DEFAULT_LESSONS = [];

const DEFAULT_QUESTIONS = [];

const DEFAULT_ASSIGNMENTS = [];

const DEFAULT_SUBMISSIONS = [];

const DEFAULT_EXAMS = [];

const DEFAULT_EXAM_ATTEMPTS = [];

const DEFAULT_ATTENDANCE = [];

const DEFAULT_MESSAGES = [];


const DEFAULT_FILES = [];

const INITIAL_STATE = {
  schoolInfo: {
    name: 'TH-THCS AMA TRANG LƠNG',
    address: 'Dliê Ya, Đắk Lắk',
    principal: 'Thầy Y Krơr Niê',
    phone: '0500.3871234',
    email: 'amatranglong.thcs@daklak.edu.vn'
  },
  academicYears: [
    { id: '2025-2026', name: 'Năm học 2025-2026', current: true },
    { id: '2026-2027', name: 'Năm học 2026-2027', current: false }
  ],
  semesters: [
    { id: 'HK1', name: 'Học kỳ I', current: true },
    { id: 'HK2', name: 'Học kỳ II', current: false }
  ],
  grades: [6, 7, 8, 9],
  classes: [
    { id: '6A', grade: 6, room: 'Phòng 101', homeroomTeacherId: null },
    { id: '6B', grade: 6, room: 'Phòng 102', homeroomTeacherId: null },
    { id: '7A', grade: 7, room: 'Phòng 201', homeroomTeacherId: null },
    { id: '8A', grade: 8, room: 'Phòng 301', homeroomTeacherId: null },
    { id: '9A', grade: 9, room: 'Phòng 401', homeroomTeacherId: null }
  ],
  subjects: DEFAULT_SUBJECTS,
  teachers: DEFAULT_TEACHERS,
  students: DEFAULT_STUDENTS,
  chapters: DEFAULT_CHAPTERS,
  lessons: DEFAULT_LESSONS,
  uploadedFiles: DEFAULT_FILES,
  questions: DEFAULT_QUESTIONS,
  assignments: DEFAULT_ASSIGNMENTS,
  submissions: DEFAULT_SUBMISSIONS,
  exams: DEFAULT_EXAMS,
  examAttempts: DEFAULT_EXAM_ATTEMPTS,
  attendance: DEFAULT_ATTENDANCE,
  messages: DEFAULT_MESSAGES,
  parents: [],
  rolesPermissions: {
    'admin': ['full_access'],
    'teacher': ['manage_lessons', 'manage_questions', 'manage_exams', 'grade_submissions', 'chat_parents', 'use_ai'],
    'student': ['view_lessons', 'submit_assignments', 'take_exams', 'view_grades'],
    'parent': ['view_grades', 'view_attendance', 'chat_teachers']
  },
  roleGroups: [
    {
      id: 'admin_super',
      name: 'Admin Cấp Cao',
      description: 'Quản trị viên toàn quyền hệ thống',
      isSystem: true,
      permissions: {
        'info': { read: true, edit: true, delete: true },
        'academicYear': { read: true, edit: true, delete: true },
        'classes': { read: true, edit: true, delete: true },
        'subjects': { read: true, edit: true, delete: true },
        'teachers': { read: true, edit: true, delete: true },
        'students': { read: true, edit: true, delete: true },
        'parents': { read: true, edit: true, delete: true },
        'reports': { read: true, edit: true, delete: true },
        'backup': { read: true, edit: true, delete: true },
        'permissions': { read: true, edit: true, delete: true },
        'lessons': { read: true, edit: true, delete: true },
        'questions': { read: true, edit: true, delete: true },
        'exams': { read: true, edit: true, delete: true },
        'gradebook': { read: true, edit: true, delete: true }
      }
    },
    {
      id: 'bgh',
      name: 'Ban Giám Hiệu (Hiệu trưởng / Phó HT)',
      description: 'Ban Giám hiệu nhà trường - Quản lý tổng thể',
      isSystem: false,
      permissions: {
        'info': { read: true, edit: true, delete: false },
        'academicYear': { read: true, edit: true, delete: false },
        'classes': { read: true, edit: true, delete: false },
        'subjects': { read: true, edit: true, delete: false },
        'teachers': { read: true, edit: true, delete: false },
        'students': { read: true, edit: true, delete: false },
        'parents': { read: true, edit: true, delete: false },
        'reports': { read: true, edit: true, delete: true },
        'backup': { read: true, edit: false, delete: false },
        'permissions': { read: true, edit: true, delete: false },
        'lessons': { read: true, edit: true, delete: false },
        'questions': { read: true, edit: true, delete: false },
        'exams': { read: true, edit: true, delete: false },
        'gradebook': { read: true, edit: true, delete: false }
      }
    },
    {
      id: 'to_truong',
      name: 'Tổ Trưởng Bộ Môn',
      description: 'Quản lý chuyên môn & kiểm tra bộ môn',
      isSystem: false,
      permissions: {
        'lessons': { read: true, edit: true, delete: true },
        'questions': { read: true, edit: true, delete: true },
        'exams': { read: true, edit: true, delete: true },
        'gradebook': { read: true, edit: true, delete: false },
        'reports': { read: true, edit: false, delete: false },
        'students': { read: true, edit: false, delete: false }
      }
    },
    {
      id: 'giao_vien',
      name: 'Giáo Viên Bộ Môn',
      description: 'Giảng dạy, ra đề, chấm điểm & quản lý học sinh',
      isSystem: false,
      permissions: {
        'lessons': { read: true, edit: true, delete: false },
        'questions': { read: true, edit: true, delete: false },
        'exams': { read: true, edit: true, delete: false },
        'gradebook': { read: true, edit: true, delete: false },
        'students': { read: true, edit: false, delete: false }
      }
    },
    {
      id: 'hoc_sinh',
      name: 'Học Sinh',
      description: 'Học sinh làm bài, luyện tập & xem kết quả',
      isSystem: false,
      permissions: {
        'student_lessons': { read: true, edit: false, delete: false },
        'student_exams': { read: true, edit: true, delete: false },
        'student_practice': { read: true, edit: true, delete: false },
        'student_grades': { read: true, edit: false, delete: false }
      }
    }
  ]
};

class LMSDatabase {
  generateUniqueTeacherUsername(teacher, existingTeachers = null) {
    const teachers = existingTeachers || this.getTeachers();
    const norm = (str) => String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]/g, '');

    const nameParts = String(teacher.name || 'giaovien').trim().split(/\s+/);
    const firstName = norm(nameParts[nameParts.length - 1] || 'gv');
    
    let initials = '';
    if (nameParts.length > 1) {
      for (let i = 0; i < nameParts.length - 1; i++) {
        const part = norm(nameParts[i]);
        if (part.length > 0) initials += part.charAt(0);
      }
    }

    const baseUsername = `thcsamtl_${firstName}${initials}`;
    const takenUsernames = new Set(teachers.filter(t => t && t.id !== teacher.id).map(t => String(t.username || t.id || '').toLowerCase()));

    if (!takenUsernames.has(baseUsername)) {
      return baseUsername;
    }

    let counter = 2;
    while (takenUsernames.has(`${baseUsername}_${counter}`)) {
      counter++;
    }
    return `${baseUsername}_${counter}`;
  }

  deleteTeacher(id) {
    const tId = String(id);
    if (this.state.teachers) {
      this.state.teachers = this.state.teachers.filter(t => String(t.id) !== tId);
      this.save();
    }
  }

  deleteTeachersBatch(ids) {
    const idSet = new Set(ids.map(id => String(id)));
    if (this.state.teachers) {
      this.state.teachers = this.state.teachers.filter(t => !idSet.has(String(t.id)));
      this.save();
    }
  }

  updateStudentAvatar(id, avatarUrl) {
    const idx = this.state.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.state.students[idx].avatarUrl = avatarUrl;
      this.save();
    }
  }

  updateStudentAvatarsBatch(avatarMap) {
    // avatarMap is Object { studentId: avatarUrl }
    if (this.state.students) {
      this.state.students.forEach(s => {
        if (avatarMap[s.id]) {
          s.avatarUrl = avatarMap[s.id];
        }
      });
      this.save();
    }
  }
  generateUniqueUsername(student, existingStudents = null) {
    const students = existingStudents || this.getStudents();
    const norm = (str) => String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]/g, '');

    const classCode = norm(student.classId || '6a');
    const nameParts = String(student.name || 'hocsinh').trim().split(/\s+/);
    const firstName = norm(nameParts[nameParts.length - 1] || 'hs');
    
    let initials = '';
    if (nameParts.length > 1) {
      for (let i = 0; i < nameParts.length - 1; i++) {
        const part = norm(nameParts[i]);
        if (part.length > 0) initials += part.charAt(0);
      }
    }

    const baseUsername = `${classCode}_${firstName}${initials ? '_' + initials : ''}`;
    const takenUsernames = new Set(students.filter(s => s && s.id !== student.id).map(s => String(s.username || s.id || '').toLowerCase()));

    if (!takenUsernames.has(baseUsername)) {
      return baseUsername;
    }

    if (student.dob && student.dob.includes('-')) {
      const dobParts = student.dob.split('-');
      if (dobParts.length === 3) {
        const dayMonth = `${dobParts[2]}${dobParts[1]}`;
        const candidateWithDob = `${baseUsername}_${dayMonth}`;
        if (!takenUsernames.has(candidateWithDob)) {
          return candidateWithDob;
        }
      }
    }

    let counter = 2;
    while (takenUsernames.has(`${baseUsername}_${counter}`)) {
      counter++;
    }
    return `${baseUsername}_${counter}`;
  }

  constructor() {
    this.state = null;
    this.init();
    if (typeof window !== 'undefined') {
      setTimeout(() => this.syncFromServer(), 100);
    }
  }

  async syncFromServer(forceRefresh = false) {
    if (typeof fetch === 'undefined') return;
    try {
      const res = await fetch('/api/db/state');
      if (res.ok) {
        const remoteState = await res.json();
        if (remoteState && typeof remoteState === 'object' && (remoteState.schoolInfo || remoteState.subjects || remoteState.exams || remoteState.teachers)) {
          // Bảo toàn và hợp nhất dữ liệu hai chiều (Two-Way Safe Merge)
          if (this.state && Array.isArray(this.state.exams) && this.state.exams.length > 0) {
            if (!Array.isArray(remoteState.exams) || remoteState.exams.length === 0) {
              remoteState.exams = this.state.exams;
            } else {
              const examMap = new Map();
              remoteState.exams.forEach(e => { if (e && e.id) examMap.set(String(e.id), e); });
              this.state.exams.forEach(e => {
                if (e && e.id && !examMap.has(String(e.id))) {
                  remoteState.exams.push(e);
                  examMap.set(String(e.id), e);
                }
              });
            }
          }

          // Đảm bảo không bao giờ bị mất danh mục môn học, năm học, khối lớp
          Object.keys(INITIAL_STATE).forEach(key => {
            if (!remoteState[key] || (Array.isArray(INITIAL_STATE[key]) && Array.isArray(remoteState[key]) && remoteState[key].length === 0 && INITIAL_STATE[key].length > 0)) {
              remoteState[key] = JSON.parse(JSON.stringify(INITIAL_STATE[key]));
            }
          });

          this.state = remoteState;
          this.initUserGroupsAndPermissions();
          try { localStorage.setItem(DB_KEY, JSON.stringify(this.state)); } catch(e) {}
          console.log('✅ LMS Central Database synchronized from Server across all devices!');
        }
      }
    } catch(err) {
      console.log('ℹ️ Server offline, using local state.');
    }
  }

  async uploadFile(file) {
    if (typeof fetch === 'undefined' || !file) return null;
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'x-file-name': encodeURIComponent(file.name)
        },
        body: file
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Server upload failed, falling back:', err);
    }
    return null;
  }

  
  // User Groups and RBAC Permissions State Initialization
  initUserGroupsAndPermissions() {
    if (!this.state) this.state = {};
    if (this.state.subjectsList === undefined) {
      this.state.subjectsList = [
        { id: 'sub_toan', code: 'TOAN', name: 'Toán học', periodsPerWeek: 4, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_van', code: 'VAN', name: 'Ngữ văn', periodsPerWeek: 4, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_anh', code: 'ANH', name: 'Tiếng Anh (Ngoại ngữ 1)', periodsPerWeek: 3, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_khtn', code: 'KHTN', name: 'Khoa học tự nhiên', periodsPerWeek: 4, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_lsdl', code: 'LSDL', name: 'Lịch sử và Địa lí', periodsPerWeek: 3, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_gddc', code: 'GDCD', name: 'Giáo dục công dân', periodsPerWeek: 1, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_tin', code: 'TIN', name: 'Tin học', periodsPerWeek: 1, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_congnghe', code: 'CN', name: 'Công nghệ', periodsPerWeek: 1, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_gdtc', code: 'GDTC', name: 'Giáo dục thể chất', periodsPerWeek: 2, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_nghethuat', code: 'NT', name: 'Nghệ thuật (Âm nhạc, Mĩ thuật)', periodsPerWeek: 2, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_hdtung', code: 'HDTN', name: 'Hoạt động trải nghiệm, hướng nghiệp', periodsPerWeek: 3, type: 'Bắt buộc', grades: '6,7,8,9' },
        { id: 'sub_gddp', code: 'GDDP', name: 'Nội dung giáo dục địa phương', periodsPerWeek: 1, type: 'Bắt buộc', grades: '6,7,8,9' }
      ];
    }

    if (!this.state) this.state = {};
    if (this.state.classesList === undefined) {
      this.state.classesList = [
        { id: 'cls_6a', grade: '6', name: '6A', homeroomTeacher: 'Chu Văn Giáp', studentCount: 35 },
        { id: 'cls_6b', grade: '6', name: '6B', homeroomTeacher: 'Cao Thị Ngọc Châu', studentCount: 36 },
        { id: 'cls_7a', grade: '7', name: '7A', homeroomTeacher: 'Trần Thanh Xuân', studentCount: 34 },
        { id: 'cls_8a', grade: '8', name: '8A', homeroomTeacher: 'Lê Thị Liên Hương', studentCount: 35 },
        { id: 'cls_9a', grade: '9', name: '9A', homeroomTeacher: 'Nông Văn Dũng', studentCount: 35 }
      ];
    }

    if (!this.state) this.state = {};
    if (this.state.academicYears === undefined) {
      this.state.academicYears = [
        {
          id: 'year_2025_2026',
          name: 'Năm học 2025 - 2026',
          isCurrent: true,
          hk1: { startDate: '2025-09-05', endDate: '2026-01-15', status: 'active' },
          hk2: { startDate: '2026-01-16', endDate: '2026-05-31', status: 'upcoming' }
        },
        {
          id: 'year_2024_2025',
          name: 'Năm học 2024 - 2025',
          isCurrent: false,
          hk1: { startDate: '2024-09-05', endDate: '2025-01-15', status: 'finished' },
          hk2: { startDate: '2025-01-16', endDate: '2025-05-31', status: 'finished' }
        }
      ];
    }

    if (!this.state) this.state = {};
    if (!this.state.userGroups) {
      this.state.userGroups = [
        { id: 'admin', name: 'Quản trị hệ thống (Admin)', code: 'ADMIN', description: 'Quyền tối cao toàn hệ thống' },
        { id: 'bgh', name: 'Ban Giám Hiệu (BGH)', code: 'BGH', description: 'Chỉ đạo & Giám sát dạy học' },
        { id: 'totruong', name: 'Tổ trưởng chuyên môn', code: 'TOTRUONG', description: 'Quản lý tổ bộ môn & duyệt KHBD' },
        { id: 'giaovien', name: 'Giáo viên bộ môn', code: 'GIAOVIEN', description: 'Giảng dạy, giao bài tập & chấm điểm' },
        { id: 'nhanvien', name: 'Nhân viên văn phòng', code: 'NHANVIEN', description: 'Quản lý hồ sơ & thiết bị' },
        { id: 'hocsinh', name: 'Học sinh', code: 'HOCSINH', description: 'Học tập & làm bài thi' },
        { id: 'phuhuynh', name: 'Phụ huynh học sinh', code: 'PHUHUYNH', description: 'Theo dõi kết quả & điểm danh' }
      ];
    }

    if (!this.state.groupPermissions) {
      this.state.groupPermissions = {};
      const allMenus = ['years', 'school_info_view', 'user_groups', 'user_management', 'classes', 'subjects', 'teachers', 'students', 'parents', 'reports', 'backup', 'lessons', 'questions', 'assignments', 'exams', 'grading', 'ai_picker', 'attendance', 'messages', 'ai_hub'];
      
      this.state.userGroups.forEach(g => {
        this.state.groupPermissions[g.id] = {};
        allMenus.forEach(m => {
          this.state.groupPermissions[g.id][m] = {
            view: true,
            edit: g.id === 'admin' || g.id === 'bgh' || g.id === 'giaovien',
            delete: g.id === 'admin',
            import: g.id === 'admin' || g.id === 'bgh',
            export: true,
            showMenu: true
          };
        });
      });
    }

    if (!this.state.users || this.state.users.length === 0) {
      const teachers = this.getTeachers ? (this.getTeachers() || []) : [];
      const defaultUsers = [
        { id: 'usr_1', name: 'Cao Thị Ngọc Châu', username: 'thcsamtl_chau', groupId: 'giaovien', status: 'active', phone: '0912345671', email: 'chau.ctn@amatranglong.edu.vn' },
        { id: 'usr_2', name: 'Trần Thanh Xuân', username: 'thcsamtl_xuan', groupId: 'giaovien', status: 'active', phone: '0912345672', email: 'xuan.tt@amatranglong.edu.vn' },
        { id: 'usr_3', name: 'Lê Thị Liên Hương', username: 'thcsamtl_lienhuong', groupId: 'bgh', status: 'active', phone: '0912345673', email: 'huong.ltl@amatranglong.edu.vn' },
        { id: 'usr_4', name: 'Chu Văn Giáp', username: 'thcsamtl_giap', groupId: 'admin', status: 'active', phone: '0397800689', email: 'giap.cv@amatranglong.edu.vn' }
      ];

      teachers.forEach((t, idx) => {
        if (!defaultUsers.some(u => u.name === t.name)) {
          const un = 'thcsamtl_' + (t.id || 'user_' + idx);
          defaultUsers.push({
            id: 'usr_' + (defaultUsers.length + 1),
            name: t.name,
            username: un,
            groupId: 'giaovien',
            status: 'active',
            phone: t.phone || '090512345' + idx,
            email: un + '@amatranglong.edu.vn'
          });
        }
      });

      this.state.users = defaultUsers;
    }
  }

  init() {
    this.initUserGroupsAndPermissions();
    const data = localStorage.getItem(DB_KEY);
    if (data) {
      try {
        this.state = JSON.parse(data);
        // Guarantee all state keys exist
        if (!this.state || typeof this.state !== 'object') {
          this.resetToDefault();
        } else {
          Object.keys(INITIAL_STATE).forEach(key => {
            if (this.state[key] === undefined || this.state[key] === null) {
              this.state[key] = JSON.parse(JSON.stringify(INITIAL_STATE[key]));
            }
          });
        }
      } catch (e) {
        console.error('Failed to parse database state, resetting to default.', e);
        this.resetToDefault();
      }
    } else {
      this.resetToDefault();
    }
    // Migration: ensure all teachers have username & password saved
    this._migrateTeacherCredentials();
    // Migration: ensure all students have username & password saved
    this._migrateStudentCredentials();
    this._migrateUploadedFiles();
    this._migrateDefaultExams();
    this._migrateAssignmentsAndSubmissions();
    this._migrateDemoTeachersAndStudents();
    this._migrateRemainingDemoData();
  }

  _migrateTeacherCredentials() {
    if (!this.state.teachers || !Array.isArray(this.state.teachers)) return;
    let changed = false;
    const norm = (str) => String(str || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]/g, '');
    this.state.teachers = this.state.teachers.map(t => {
      if (!t.username) {
        // Generate username inline WITHOUT calling getTeachers() to avoid recursion
        const parts = String(t.name || 'giaovien').trim().split(/\s+/);
        const firstName = norm(parts[parts.length - 1] || 'gv');
        let initials = '';
        if (parts.length > 1) {
          for (let i = 0; i < parts.length - 1; i++) {
            const p = norm(parts[i]);
            if (p.length > 0) initials += p.charAt(0);
          }
        }
        t.username = `thcsamtl_${firstName}${initials}`;
        changed = true;
      }
      if (!t.password) {
        t.password = 'gv123456';
        changed = true;
      }
      return t;
    });
    if (changed) this.save();
  }

  _migrateDefaultExams() {
    if (!this.state) this.state = {};
    if (!this.state.exams || !Array.isArray(this.state.exams)) {
      this.state.exams = [];
    }
    if (!this.state.examAttempts || !Array.isArray(this.state.examAttempts)) {
      this.state.examAttempts = [];
    }

    // Clean out all legacy and demo exams completely
    const demoIds = new Set(['exam_tx_1', 'exam_1', 'exam_ck_1', 'exam_demo_1', 'exam_demo_2', 'exam_quizizz_sample', 'asm_1787381537654']);
    const prevLen = this.state.exams.length;
    this.state.exams = this.state.exams.filter(e => {
      if (!e) return false;
      const id = String(e.id || '').toLowerCase();
      const title = String(e.title || '').toLowerCase();
      if (demoIds.has(e.id)) return false;
      if (id.includes('demo') || id.includes('sample') || title.includes('demo') || title.includes('mẫu') || title.includes('thử nghiệm')) return false;
      return true;
    });
    const validExamIds = new Set(this.state.exams.map(e => e.id));
    this.state.examAttempts = (this.state.examAttempts || []).filter(a => validExamIds.has(a.examId));

    let changed = (this.state.exams.length !== prevLen);
    this.state.exams.forEach(e => {
      if (!e.examCategory) {
        if (e.targetGradeColumn === 'CK' || (e.title && e.title.toLowerCase().includes('cuối'))) e.examCategory = 'final';
        else if (e.targetGradeColumn === 'GK' || (e.title && e.title.toLowerCase().includes('giữa')) || e.isOfficial) e.examCategory = 'midterm';
        else e.examCategory = 'tx';
        changed = true;
      }
      if (!e.examSubType) {
        e.examSubType = (e.format === 'quizizz' || e.isQuizizz) ? 'quizizz' : 'regular';
        changed = true;
      }
    });
    if (changed) this.save();
  }

  _migrateRemainingDemoData() {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.questions)) this.state.questions = [];
    if (!Array.isArray(this.state.uploadedFiles)) this.state.uploadedFiles = [];
    if (!Array.isArray(this.state.teachingTools)) this.state.teachingTools = [];

    // Filter out demo questions
    const demoQIds = new Set(['q1', 'q2', 'q_tf_1', 'q_sa_1', 'q_essay_1', 'q_van_1', 'q_tf_van', 'q_sa_van', 'q_essay_van']);
    const prevQLen = this.state.questions.length;
    this.state.questions = this.state.questions.filter(q => !demoQIds.has(q.id) && !String(q.id || '').includes('demo'));

    // Filter out demo uploaded files
    const demoFileIds = new Set(['khbd_mang_may_tinh', 'khbd_van7_truyen_co_tich', 'khbd_anh8_unit1']);
    const prevFLen = this.state.uploadedFiles.length;
    this.state.uploadedFiles = this.state.uploadedFiles.filter(f => !demoFileIds.has(f.id) && !String(f.id || '').includes('demo'));

    // Filter out demo teaching tools (tool_1 to tool_5)
    const demoToolIds = new Set(['tool_1', 'tool_2', 'tool_3', 'tool_4', 'tool_5']);
    const prevTLen = this.state.teachingTools.length;
    this.state.teachingTools = this.state.teachingTools.filter(t => !demoToolIds.has(t.id) && !['Nguyễn Thị Hương', 'Lê Thu Lan', 'Phạm Quốc Cường', 'Trần Hải Nam'].includes(t.creatorName));

    if (this.state.questions.length !== prevQLen || this.state.uploadedFiles.length !== prevFLen || this.state.teachingTools.length !== prevTLen) {
      if (this.save) this.save();
    }
  }

  _migrateDemoTeachersAndStudents() {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.teachers)) this.state.teachers = [];
    if (!Array.isArray(this.state.students)) this.state.students = [];
    if (!Array.isArray(this.state.parents)) this.state.parents = [];
    if (!Array.isArray(this.state.attendance)) this.state.attendance = [];

    // Filter out mock/demo students (hs_6a_*, hs_demo_*)
    const prevStuLen = this.state.students.length;
    this.state.students = this.state.students.filter(s => {
      if (!s) return false;
      const id = String(s.id || '').toLowerCase();
      if (id.startsWith('hs_6a_') || id.startsWith('hs_demo_') || id.includes('sample')) return false;
      return true;
    });

    // Filter out mock/demo teachers (gv_huong, gv_nam, gv_lan, gv_cuong)
    const prevTeaLen = this.state.teachers.length;
    const demoTeacherIds = new Set(['gv_huong', 'gv_nam', 'gv_lan', 'gv_cuong', 'gv_demo_1', 'gv_demo_2']);
    this.state.teachers = this.state.teachers.filter(t => {
      if (!t) return false;
      if (demoTeacherIds.has(t.id)) return false;
      const id = String(t.id || '').toLowerCase();
      if (id.includes('demo') || id.includes('sample')) return false;
      return true;
    });

    // Clean mock users
    if (Array.isArray(this.state.users)) {
      const demoUserIds = new Set(['usr_1', 'usr_2', 'usr_5', 'usr_6', 'usr_7', 'usr_8']);
      this.state.users = this.state.users.filter(u => {
        if (!u) return false;
        if (demoUserIds.has(u.id)) return false;
        if (u.groupId === 'giaovien' && (demoTeacherIds.has(u.id) || ['Nguyễn Thị Hương', 'Trần Hải Nam', 'Lê Thu Lan', 'Phạm Quốc Cường'].includes(u.name))) return false;
        return true;
      });
    }

    if (this.state.students.length !== prevStuLen || this.state.teachers.length !== prevTeaLen) {
      if (this.save) this.save();
    }
  }

  _migrateAssignmentsAndSubmissions() {
    if (!this.state) this.state = {};
    if (!this.state.assignments || !Array.isArray(this.state.assignments)) {
      this.state.assignments = [];
    }
    if (!this.state.submissions || !Array.isArray(this.state.submissions)) {
      this.state.submissions = [];
    }

    // Clean out all demo assignments and submissions
    const demoAsmIds = new Set(['asm_1', 'asm_demo_1', 'asm_1787381537654']);
    const demoSubIds = new Set(['sub_1', 'sub_2', 'sub_demo_1']);

    const prevAsmLen = this.state.assignments.length;
    const prevSubLen = this.state.submissions.length;

    this.state.assignments = this.state.assignments.filter(a => {
      if (!a) return false;
      const id = String(a.id || '').toLowerCase();
      const title = String(a.title || '').toLowerCase();
      if (demoAsmIds.has(a.id)) return false;
      if (id.includes('demo') || id.includes('sample') || title.includes('demo') || title.includes('mẫu') || title.includes('thử nghiệm')) return false;
      return true;
    });

    const validAsmIds = new Set(this.state.assignments.map(a => a.id));
    this.state.submissions = this.state.submissions.filter(s => {
      if (!s) return false;
      const id = String(s.id || '').toLowerCase();
      if (demoSubIds.has(s.id)) return false;
      if (id.includes('demo') || id.includes('sample')) return false;
      return validAsmIds.has(s.assignmentId);
    });

    if (this.state.assignments.length !== prevAsmLen || this.state.submissions.length !== prevSubLen) {
      if (this.save) this.save();
    }
  }

  _migrateUploadedFiles() {
    if (!this.state) this.state = {};
    if (!this.state.uploadedFiles || !Array.isArray(this.state.uploadedFiles)) {
      this.state.uploadedFiles = [];
    }
    if (!this.state.lessons || !Array.isArray(this.state.lessons)) {
      this.state.lessons = [];
    }

    // Purge demo mock files so user has a clean slate
    const demoFileIds = new Set(['khbd_toan6_tap_hop', 'khbd_toan6_bai2', 'slide_powerpoint_toan6', 'nanobanana_slide_math', 'nanobanana_infographic']);
    const demoLessonIds = new Set(['toan_c1_b1', 'toan_c1_b2', 'toan_c2_b1', 'van_c1_b1', 'van_c1_b2', 'anh_c1_b1', 'tin_c1_b1', 'tin_c2_b1', 'khtn_c1_b1']);
    
    const prevFilesLen = this.state.uploadedFiles.length;
    const prevLessonsLen = this.state.lessons.length;

    this.state.uploadedFiles = this.state.uploadedFiles.filter(f => !demoFileIds.has(f.id));
    this.state.lessons = this.state.lessons.filter(l => !demoLessonIds.has(l.id));

    if (this.state.uploadedFiles.length !== prevFilesLen || this.state.lessons.length !== prevLessonsLen) {
      if (this.save) this.save();
    }
  }

  _migrateStudentCredentials() {
    if (!this.state.students || !Array.isArray(this.state.students)) return;
    let changed = false;
    this.state.students = this.state.students.map((s, idx) => {
      // Username = Mã học sinh (id)
      if (!s.username || s.username !== s.id) {
        s.username = s.id;
        changed = true;
      }
      if (!s.password) {
        s.password = 'hs123456';
        changed = true;
      }
      return s;
    });
    if (changed) this.save();
  }

  getVisitCount() {
    if (!this.state) this.state = {};
    // Reset baseline visit count to start fresh from 0
    if (this.state.visitCount === undefined || this.state.visitCount === null || this.state.visitCount >= 1000) {
      this.state.visitCount = 0;
    }

    if (!this._visitTracked) {
      this.state.visitCount += 1;
      this._visitTracked = true;
      if (this.save) this.save();
    }
    return this.state.visitCount;
  }

  getRecycleBin() {
    if (!this.state) this.state = {};
    if (!this.state.recycleBin || !Array.isArray(this.state.recycleBin)) {
      this.state.recycleBin = [
        {
          id: 'trash_st_1',
          itemType: 'Học sinh',
          targetTable: 'students',
          itemName: 'Phạm Minh Nhật (Lớp 6A)',
          originalData: { id: 'hs_6a_99', name: 'Phạm Minh Nhật', classId: '6A', dob: '2014-07-07', gender: 'Nam' },
          deletedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          deletedBy: 'Giáo viên Hương'
        },
        {
          id: 'trash_les_1',
          itemType: 'KHBD / Bài giảng',
          targetTable: 'lessons',
          itemName: 'Bài 3: Phép cộng và phép trừ số tự nhiên',
          originalData: { id: 'les_math_3', title: 'Bài 3: Phép cộng và phép trừ số tự nhiên', subjectId: 'toan', grade: 6 },
          deletedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          deletedBy: 'Giáo viên Giáp'
        },
        {
          id: 'trash_q_1',
          itemType: 'Câu hỏi',
          targetTable: 'questions',
          itemName: 'Câu 12: Tìm x biết x + 15 = 45',
          originalData: { id: 'q_math_12', text: 'Tìm x biết x + 15 = 45', type: 'mcq', answer: 'B' },
          deletedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          deletedBy: 'Quản trị viên Admin'
        }
      ];
      if (this.save) this.save();
    }
    return this.state.recycleBin;
  }

  moveToRecycleBin(itemType, targetTable, itemName, originalData, deletedBy = 'Người dùng') {
    const bin = this.getRecycleBin();
    bin.unshift({
      id: 'trash_' + Date.now(),
      itemType: itemType,
      targetTable: targetTable,
      itemName: itemName,
      originalData: originalData,
      deletedAt: new Date().toISOString(),
      deletedBy: deletedBy
    });
    if (this.save) this.save();
  }

  restoreFromRecycleBin(trashId) {
    const bin = this.getRecycleBin();
    const idx = bin.findIndex(b => b.id === trashId);
    if (idx === -1) return false;

    const item = bin[idx];
    const targetTable = item.targetTable;

    if (!this.state[targetTable]) this.state[targetTable] = [];
    
    // Check if item already exists in target array
    const existingIdx = this.state[targetTable].findIndex(x => x.id === item.originalData.id);
    if (existingIdx === -1) {
      this.state[targetTable].push(item.originalData);
    } else {
      this.state[targetTable][existingIdx] = item.originalData;
    }

    // Remove from recycle bin
    bin.splice(idx, 1);
    if (this.save) this.save();
    return true;
  }

  purgeRecycleBinItem(trashId) {
    const bin = this.getRecycleBin();
    const idx = bin.findIndex(b => b.id === trashId);
    if (idx !== -1) {
      bin.splice(idx, 1);
      if (this.save) this.save();
      return true;
    }
    return false;
  }

  getSelectedSchoolYear() {
    if (!this.state) this.state = {};
    if (!this.state.selectedSchoolYear) {
      this.state.selectedSchoolYear = '2025-2026';
    }
    return this.state.selectedSchoolYear;
  }

  setSelectedSchoolYear(yearId) {
    if (!this.state) this.state = {};
    this.state.selectedSchoolYear = yearId;
    if (this.save) this.save();
  }

  getAcademicYearsList() {
    if (!this.state) this.state = {};
    if (!this.state.academicYears || !Array.isArray(this.state.academicYears) || this.state.academicYears.length === 0) {
      this.state.academicYears = [
        { id: '2025-2026', name: 'Năm học 2025-2026', current: true },
        { id: '2026-2027', name: 'Năm học 2026-2027', current: false }
      ];
    }
    return this.state.academicYears;
  }

  save() {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
      try {
        // Fallback: If quota exceeded, retain file metadata while trimming oversized binary dataUrl
        if (this.state && Array.isArray(this.state.uploadedFiles)) {
          const trimmedState = {
            ...this.state,
            uploadedFiles: this.state.uploadedFiles.map(f => ({
              ...f,
              dataUrl: (f.dataUrl && f.dataUrl.length > 500000) ? '' : f.dataUrl
            }))
          };
          localStorage.setItem(DB_KEY, JSON.stringify(trimmedState));
        }
      } catch (err) {
        console.error('Final fallback save error:', err);
      }
    }

    // Asynchronously debounced sync to Central Server (Real-time 150ms)
    if (typeof fetch !== 'undefined' && this.state) {
      if (this._syncTimer) clearTimeout(this._syncTimer);
      this._syncTimer = setTimeout(() => {
        try {
          fetch('/api/db/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
          }).catch(() => {});
        } catch(e) {}
      }, 150);
    }
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.save();
  }

  importData(jsonData) {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && typeof parsed === 'object' && parsed.schoolInfo) {
        this.state = parsed;
        this.save();
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  }

  exportData() {
    return JSON.stringify(this.state, null, 2);
  }

  // --- GETTERS & MUTATORS ---


  getUploadedFiles() {
    if (!this.state) this.state = {};
    if (!this.state.uploadedFiles || !Array.isArray(this.state.uploadedFiles) || this.state.uploadedFiles.length === 0) {
      this.state.uploadedFiles = JSON.parse(JSON.stringify(DEFAULT_FILES));
      this.save();
    }
    // Auto-normalize file extension and format for PDF
    if (Array.isArray(this.state.uploadedFiles)) {
      this.state.uploadedFiles.forEach(f => {
        if (!f) return;
        const dUrl = f.dataUrl || f.url || '';
        const name = (f.name || '').toLowerCase();
        if (dUrl.startsWith('data:application/pdf') || dUrl.includes('application/pdf') || name.endsWith('.pdf')) {
          f.ext = '.pdf';
        }
      });
    }
    return this.state.uploadedFiles;
  }
  addUploadedFile(file) {
    if (!this.state.uploadedFiles) this.state.uploadedFiles = [];
    this.state.uploadedFiles.unshift(file);
    this.save();
  }
  updateUploadedFile(id, updatedData) {
    if (!this.state.uploadedFiles) return;
    const idx = this.state.uploadedFiles.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.state.uploadedFiles[idx] = { ...this.state.uploadedFiles[idx], ...updatedData };
      this.save();
    }
  }
  deleteUploadedFile(id) {
    if (!this.state.uploadedFiles) return;
    this.state.uploadedFiles = this.state.uploadedFiles.filter(f => f.id !== id);
    this.save();
  }


  toggleShareFile(fileId) {
    if (!this.state) this.state = {};
    this.state.uploadedFiles = this.state.uploadedFiles || [];
    const file = this.state.uploadedFiles.find(f => f && f.id === fileId);
    if (file) {
      file.isShared = !file.isShared;
      this.save();
      return file.isShared;
    }
    return false;
  }

  getSchoolInfo() {
    if (this.state && this.state.schoolInfo) {
      if (!this.state.schoolInfo.address || 
          this.state.schoolInfo.address.toUpperCase().includes('DLIÊ YA') || 
          this.state.schoolInfo.address.includes('Dliêya')) {
        this.state.schoolInfo.address = 'Dliê Ya, Đắk Lắk';
        this.save();
      }
    }
    return this.state.schoolInfo || {};
  }
  updateSchoolInfo(info) {
    this.state.schoolInfo = { ...this.state.schoolInfo, ...info };
    this.save();
  }

  getAcademicYears() { return this.state.academicYears || []; }
  addAcademicYear(year) {
    this.state.academicYears.push(year);
    this.save();
  }

  getSemesters() { return this.state.semesters || []; }
  setSemesterActive(semesterId) {
    this.state.semesters.forEach(s => s.current = (s.id === semesterId));
    this.save();
  }

  getClassesList() {
    if (!this.state.classesList) this.state.classesList = [];
    return this.state.classesList;
  }

  getClasses() {
    if (!this.state.classesList) this.state.classesList = [];
    if (this.state.classesList.length > 0) {
      return this.state.classesList.map(c => ({
        id: c.name || c.id,
        name: c.name || c.id,
        grade: c.grade || (c.name ? c.name.charAt(0) : '6'),
        homeroomTeacher: c.homeroomTeacher || 'Chưa phân công'
      }));
    }
    return this.state.classes || [];
  }

  addClass(cls) {
    if (!this.state.classesList) this.state.classesList = [];
    if (!this.state.classes) this.state.classes = [];

    const name = (cls.name || cls.id || 'Lớp mới').toString().trim();
    const id = cls.id || ('cls_' + name.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const grade = cls.grade || (name.match(/\d+/) ? name.match(/\d+/)[0] : '6');
    const homeroomTeacher = cls.homeroomTeacher || 'Chưa phân công';

    const existingIdx = this.state.classesList.findIndex(c => (c.name || '').toUpperCase() === name.toUpperCase() || c.id === id);
    const newCls = { id, name, grade, homeroomTeacher, studentCount: cls.studentCount || 0 };

    if (existingIdx !== -1) {
      this.state.classesList[existingIdx] = { ...this.state.classesList[existingIdx], ...newCls };
    } else {
      this.state.classesList.push(newCls);
    }

    const classIdxInClasses = this.state.classes.findIndex(c => (c.id || '').toUpperCase() === name.toUpperCase() || (c.name || '').toUpperCase() === name.toUpperCase());
    if (classIdxInClasses !== -1) {
      this.state.classes[classIdxInClasses] = { id: name, name, grade: parseInt(grade) || 6, room: cls.room || 'Phòng học', homeroomTeacherId: null };
    } else {
      this.state.classes.push({ id: name, name, grade: parseInt(grade) || 6, room: cls.room || 'Phòng học', homeroomTeacherId: null });
    }
    this.save();
    return newCls;
  }

  deleteClass(classId) {
    if (this.state.classesList) {
      const target = this.state.classesList.find(c => c.id === classId || c.name === classId);
      const targetName = target ? target.name : classId;
      this.state.classesList = this.state.classesList.filter(c => c.id !== classId && c.name !== classId);
      if (this.state.classes) {
        this.state.classes = this.state.classes.filter(c => c.id !== classId && c.name !== classId && c.id !== targetName && c.name !== targetName);
      }
    }
    this.save();
  }

  deleteClassesBatch(classIds) {
    const set = new Set(classIds.map(id => String(id)));
    if (this.state.classesList) {
      const namesToDelete = new Set();
      this.state.classesList.forEach(c => {
        if (set.has(String(c.id)) || set.has(String(c.name))) {
          if (c.name) namesToDelete.add(String(c.name));
          if (c.id) namesToDelete.add(String(c.id));
        }
      });
      this.state.classesList = this.state.classesList.filter(c => !set.has(String(c.id)) && !set.has(String(c.name)));
      if (this.state.classes) {
        this.state.classes = this.state.classes.filter(c => !set.has(String(c.id)) && !set.has(String(c.name)) && !namesToDelete.has(String(c.id)) && !namesToDelete.has(String(c.name)));
      }
    }
    this.save();
  }

  getSubjects() {
    if (this.state && Array.isArray(this.state.subjects) && this.state.subjects.length > 0) {
      return this.state.subjects;
    }
    if (this.state && Array.isArray(this.state.subjectsList) && this.state.subjectsList.length > 0) {
      const iconMap = {
        TOAN: '📐', VAN: '📖', ANH: '🇬🇧', KHTN: '🔬', LSDL: '🗺️', TIN: '💻', GDCD: '⚖️',
        CN: '🛠️', GDTC: '⚽', NT: '🎨', HDTN: '🌟', GDDP: '🏛️'
      };
      return this.state.subjectsList.map(s => ({
        id: s.code ? s.code.toLowerCase() : (s.id ? s.id.replace('sub_', '') : 'toan'),
        name: s.name,
        icon: iconMap[s.code] || s.icon || '📚'
      }));
    }
    return DEFAULT_SUBJECTS;
  }
  addSubject(subject) {
    this.state.subjects.push(subject);
    this.save();
  }
  updateSubject(id, updatedData) {
    if (!this.state.subjects) return;
    const idx = this.state.subjects.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.state.subjects[idx] = { ...this.state.subjects[idx], ...updatedData };
      this.save();
    }
  }
  deleteSubject(id) {
    if (!this.state.subjects) return;
    this.state.subjects = this.state.subjects.filter(s => s.id !== id);
    this.save();
  }

  getTeachers() {
    if (!this.state.teachers) this.state.teachers = [];
    return this.state.teachers;
  }
  addTeacher(teacher) {
    this.state.teachers.push(teacher);
    this.save();
  }
  updateTeacher(id, updatedData) {
    const idx = this.state.teachers.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.state.teachers[idx] = { ...this.state.teachers[idx], ...updatedData };
      this.save();
    }
  }

  getStudents() { return this.state.students || []; }
  addStudent(student) {
    this.state.students.push(student);
    this.save();
  }
  updateStudent(id, updatedData) {
    const idx = this.state.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.state.students[idx] = { ...this.state.students[idx], ...updatedData };
      this.save();
    }
  }

  deleteStudent(id) {
    const sId = String(id);
    if (this.state.students) {
      this.state.students = this.state.students.filter(s => String(s.id) !== sId);
    }
    if (this.state.parents) {
      this.state.parents = this.state.parents.filter(p => String(p.studentId) !== sId);
    }
    this.save();
  }

  deleteStudentsBatch(ids) {
    const idSet = new Set(ids.map(id => String(id)));
    if (this.state.students) {
      this.state.students = this.state.students.filter(s => !idSet.has(String(s.id)));
    }
    if (this.state.parents) {
      this.state.parents = this.state.parents.filter(p => !idSet.has(String(p.studentId)));
    }
    this.save();
  }

  getParents() { return this.state.parents || []; }
  addParent(parent) {
    if (!this.state.parents) this.state.parents = [];
    this.state.parents.push(parent);
    this.save();
  }
  updateParent(id, updatedData) {
    if (!this.state.parents) this.state.parents = [];
    const idx = this.state.parents.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.state.parents[idx] = { ...this.state.parents[idx], ...updatedData };
      this.save();
    }
  }

  getChapters() { return this.state.chapters || []; }
  addChapter(chapter) {
    if (!this.state.chapters) this.state.chapters = [];
    this.state.chapters.push(chapter);
    this.save();
  }
  updateChapter(id, updatedData) {
    if (!this.state.chapters) return;
    const idx = this.state.chapters.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.state.chapters[idx] = { ...this.state.chapters[idx], ...updatedData };
      this.save();
    }
  }
  deleteChapter(id) {
    if (!this.state.chapters) return;
    this.state.chapters = this.state.chapters.filter(c => c.id !== id);
    this.save();
  }

  getLessons() { return this.state.lessons || []; }
  addLesson(lesson) {
    if (!this.state.lessons) this.state.lessons = [];
    this.state.lessons.push(lesson);
    this.save();
  }
  updateLesson(id, updatedData) {
    if (!this.state.lessons) return;
    const idx = this.state.lessons.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.state.lessons[idx] = { ...this.state.lessons[idx], ...updatedData };
      this.save();
    }
  }
  deleteLesson(id) {
    if (!this.state.lessons) return;
    this.state.lessons = this.state.lessons.filter(l => l.id !== id);
    this.save();
  }

  getQuestions() {
    const qs = this.state.questions || [];
    const defMap = {};
    if (typeof DEFAULT_QUESTIONS !== "undefined") { DEFAULT_QUESTIONS.forEach(dq => { defMap[dq.id] = dq; }); }
    return qs.map(q => {
      if ((!q.topic && !q.chapter) || !q.grade) {
        const def = defMap[q.id];
        if (def) return Object.assign({}, def, q, { topic: q.topic || def.topic || "", lesson: q.lesson || def.lesson || "", grade: q.grade || def.grade || "" });
      }
      return q;
    });
  }
  addQuestion(question) {
    if (!this.state.questions) this.state.questions = [];
    this.state.questions.push(question);
    this.save();
  }
  updateQuestion(id, updatedData) {
    if (!this.state.questions) return;
    const idx = this.state.questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      this.state.questions[idx] = { ...this.state.questions[idx], ...updatedData };
      this.save();
    }
  }
  deleteQuestion(id) {
    if (!this.state.questions) return;
    this.state.questions = this.state.questions.filter(q => q.id !== id);
    this.save();
  }
  approveQuestion(id) {
    const q = this.state.questions.find(q => q.id === id);
    if (q) {
      q.approved = true;
      this.save();
    }
  }

  getAssignments() { return this.state.assignments || []; }
  addAssignment(assignment) {
    if (!this.state.assignments) this.state.assignments = [];
    this.state.assignments.push(assignment);
    this.save();
  }
  updateAssignment(id, updatedData) {
    if (!this.state.assignments) this.state.assignments = [];
    let realId = id;
    let data = updatedData;
    if (typeof id === 'object' && id !== null) {
      data = id;
      realId = data.id;
    }
    if (!realId && data && data.id) realId = data.id;

    const idx = this.state.assignments.findIndex(a => String(a.id) === String(realId));
    if (idx !== -1) {
      this.state.assignments[idx] = { ...this.state.assignments[idx], ...data };
    } else if (data) {
      this.state.assignments.unshift({ ...data, id: realId || ('asm_' + Date.now()) });
    }
    this.save();
  }

  getSubmissions() { return this.state.submissions || []; }
  addSubmission(submission) {
    const idx = this.state.submissions.findIndex(s => s.assignmentId === submission.assignmentId && s.studentId === submission.studentId);
    if (idx !== -1) {
      this.state.submissions[idx] = { ...this.state.submissions[idx], ...submission };
    } else {
      this.state.submissions.push(submission);
    }
    this.save();
  }

  deleteSubmissionById(id) {
    this.state.submissions = this.state.submissions.filter(s => s.id !== id);
    this.save();
  }
  gradeSubmission(id, score, comment, teacherId) {
    const sub = this.state.submissions.find(s => s.id === id);
    if (sub) {
      sub.score = parseFloat(score);
      sub.comment = comment;
      sub.gradedBy = teacherId;
      this.save();
    }
  }

  getExams() { 
    if (!this.state.exams) this.state.exams = [];
    return this.state.exams; 
  }
  addExam(exam) {
    if (!this.state.exams) this.state.exams = [];
    const idx = this.state.exams.findIndex(e => String(e.id) === String(exam.id));
    if (idx !== -1) {
      this.state.exams[idx] = { ...this.state.exams[idx], ...exam };
    } else {
      this.state.exams.unshift(exam);
    }
    this.save();
  }
  updateExam(id, updatedData) {
    if (!this.state.exams) this.state.exams = [];
    let realId = id;
    let data = updatedData;
    if (typeof id === 'object' && id !== null) {
      data = id;
      realId = data.id;
    }
    if (!realId && data && data.id) realId = data.id;

    const idx = this.state.exams.findIndex(e => String(e.id) === String(realId));
    if (idx !== -1) {
      this.state.exams[idx] = { ...this.state.exams[idx], ...data };
    } else if (data) {
      this.state.exams.unshift({ ...data, id: realId || ('exam_' + Date.now()) });
    }
    this.save();
  }

  getExamAttempts() { return this.state.examAttempts || []; }
  addExamAttempt(attempt) {
    this.state.examAttempts.push(attempt);
    this.save();
  }
  
  deleteAssignment(id) {
    const sId = String(id);
    if (!this.state.assignments) this.state.assignments = [];
    this.state.assignments = this.state.assignments.filter(a => String(a.id) !== sId);
    if (!this.state.exams) this.state.exams = [];
    this.state.exams = this.state.exams.filter(e => String(e.id) !== sId);
    if (this.state.submissions) {
      this.state.submissions = this.state.submissions.filter(s => String(s.assignmentId || '') !== sId && String(s.examId || '') !== sId);
    }
    if (this.state.examAttempts) {
      this.state.examAttempts = this.state.examAttempts.filter(a => String(a.examId || '') !== sId && String(a.assignmentId || '') !== sId);
    }
    this.save();
  }

  deleteExam(id) {
    const sId = String(id);
    if (!this.state.exams) this.state.exams = [];
    this.state.exams = this.state.exams.filter(e => String(e.id) !== sId);
    if (!this.state.assignments) this.state.assignments = [];
    this.state.assignments = this.state.assignments.filter(a => String(a.id) !== sId);
    if (this.state.submissions) {
      this.state.submissions = this.state.submissions.filter(s => String(s.assignmentId || '') !== sId && String(s.examId || '') !== sId);
    }
    if (this.state.examAttempts) {
      this.state.examAttempts = this.state.examAttempts.filter(a => String(a.examId || '') !== sId && String(a.assignmentId || '') !== sId);
    }
    this.save();
  }

  deleteExamAttempt(examId, studentId) {
    this.state.examAttempts = this.state.examAttempts.filter(att => !(att.examId === examId && att.studentId === studentId));
    this.save();
  }

  getAttendance() { return this.state.attendance || []; }
  saveAttendance(attendanceList) {
    attendanceList.forEach(item => {
      const idx = this.state.attendance.findIndex(a => a.date === item.date && a.studentId === item.studentId);
      if (idx !== -1) {
        this.state.attendance[idx].status = item.status;
      } else {
        this.state.attendance.push(item);
      }
    });
    this.save();
  }

  getMessages() { return this.state.messages || []; }
  addMessage(msg) {
    this.state.messages.push(msg);
    this.save();
  }

  endAcademicYear() {
    const activeYear = this.state.academicYears.find(y => y.current);
    if (!activeYear) return false;

    this.state.students.forEach(student => {
      const cls = this.state.classes.find(c => c.id === student.classId);
      if (cls) {
        const nextGrade = cls.grade + 1;
        if (nextGrade > 9) {
          student.classId = 'GRADUATED';
        } else {
          const suffix = cls.id.replace(/^\d+/, '');
          const targetClassName = nextGrade + suffix;
          const targetClass = this.state.classes.find(c => c.id === targetClassName);
          if (targetClass) {
            student.classId = targetClass.id;
          } else {
            const newCls = { id: targetClassName, grade: nextGrade, room: `Phòng ${nextGrade}01`, homeroomTeacherId: null };
            this.state.classes.push(newCls);
            student.classId = targetClassName;
          }
        }
      }
    });

    const nextYearIndex = this.state.academicYears.findIndex(y => y.id === activeYear.id) + 1;
    if (nextYearIndex < this.state.academicYears.length) {
      this.state.academicYears.forEach((y, idx) => y.current = (idx === nextYearIndex));
    } else {
      const parts = activeYear.id.split('-').map(Number);
      const nextId = `${parts[0] + 1}-${parts[1] + 1}`;
      const nextName = `Năm học ${parts[0] + 1}-${parts[1] + 1}`;
      this.state.academicYears.forEach(y => y.current = false);
      this.state.academicYears.push({ id: nextId, name: nextName, current: true });
    }

    this.save();
    return true;
  }

  getAdminPassword() {
    return this.state.adminPassword || 'admin123';
  }

  setAdminPassword(newPwd) {
    this.state.adminPassword = newPwd;
    this.save();
  }

  getActiveInteractiveTasks() {
    if (!this.state.activeInteractiveTasks) this.state.activeInteractiveTasks = [];
    return this.state.activeInteractiveTasks;
  }

  // --- QUẢN LÝ NHÓM QUYỀN VÀ TÀI KHỎAN PHÂN QUYỀN ---
  getRoleGroups() {
    if (!this.state.roleGroups || !Array.isArray(this.state.roleGroups)) {
      this.state.roleGroups = JSON.parse(JSON.stringify(INITIAL_STATE.roleGroups || []));
      this.save();
    }
    return this.state.roleGroups;
  }

  addRoleGroup(group) {
    const groups = this.getRoleGroups();
    const newGroup = {
      id: group.id || 'group_' + Date.now(),
      name: group.name || 'Nhóm quyền mới',
      description: group.description || '',
      isSystem: false,
      permissions: group.permissions || {}
    };
    groups.push(newGroup);
    this.save();
    return newGroup;
  }

  updateRoleGroup(groupId, updatedData) {
    const groups = this.getRoleGroups();
    const idx = groups.findIndex(g => g.id === groupId);
    if (idx !== -1) {
      groups[idx] = { ...groups[idx], ...updatedData };
      this.save();
      return true;
    }
    return false;
  }

  deleteRoleGroup(groupId) {
    let groups = this.getRoleGroups();
    const group = groups.find(g => g.id === groupId);
    if (group && group.isSystem) {
      return false; // Không thể xóa nhóm hệ thống
    }
    this.state.roleGroups = groups.filter(g => g.id !== groupId);
    this.save();
    return true;
  }

  setUserPassword(userType, userId, newPassword) {
    if (!newPassword || newPassword.trim() === '') return false;
    if (userType === 'admin' || userId === 'admin') {
      this.setAdminPassword(newPassword);
      return true;
    }
    if (userType === 'teacher' || userId.startsWith('gv_')) {
      const teacher = this.state.teachers.find(t => t.id === userId || t.username === userId);
      if (teacher) {
        teacher.password = newPassword;
        this.save();
        return true;
      }
    }
    if (userType === 'student' || userId.startsWith('hs_')) {
      const student = this.state.students.find(s => s.id === userId || s.username === userId);
      if (student) {
        student.password = newPassword;
        this.save();
        return true;
      }
    }
    return false;
  }

  setUserRoleGroup(userId, groupId) {
    const teacher = this.state.teachers.find(t => t.id === userId || t.username === userId);
    if (teacher) {
      teacher.roleGroupId = groupId;
      this.save();
      return true;
    }
    const student = this.state.students.find(s => s.id === userId || s.username === userId);
    if (student) {
      student.roleGroupId = groupId;
      this.save();
      return true;
    }
    return false;
  }

  // =====================================================
  // EXAM MANAGEMENT - NEW METHODS (v2026-07-29)
  // =====================================================

  /** Lấy đề thi theo môn học */
  getExamsBySubject(subjectId) {
    return (this.state.exams || []).filter(e => e.subjectId === subjectId);
  }

  /** Lấy đề thi theo loại (tx / midterm / final) */
  getExamsByType(type, subjectId) {
    return (this.state.exams || []).filter(e =>
      e.examCategory === type && (!subjectId || e.subjectId === subjectId)
    );
  }

  /** Cập nhật thông tin đề thi */
  updateExam(examId, updates) {
    const idx = (this.state.exams || []).findIndex(e => e.id === examId);
    if (idx !== -1) {
      this.state.exams[idx] = { ...this.state.exams[idx], ...updates };
      this.save();
      return true;
    }
    return false;
  }

  /** Lấy tất cả lượt thi của một đề */
  getExamAttemptsByExam(examId) {
    return (this.state.examAttempts || []).filter(a => a.examId === examId);
  }

  /** Lấy lượt thi của học sinh cụ thể */
  getStudentAttempts(examId, studentId) {
    return (this.state.examAttempts || []).filter(a => a.examId === examId && a.studentId === studentId);
  }

  /** Mở khóa cho học sinh thi lại - xóa tất cả lượt thi cũ */
  unlockStudentRetake(examId, studentId) {
    if (this.state.examAttempts) {
      this.state.examAttempts = this.state.examAttempts.filter(
        a => !(a.examId === examId && a.studentId === studentId)
      );
    }
    // Xóa submission liên quan
    if (this.state.submissions) {
      this.state.submissions = this.state.submissions.filter(
        s => !(String(s.examId || s.assignmentId) === String(examId) && s.studentId === studentId)
      );
    }
    this.save();
    return true;
  }

  /** Ghi nhật ký vi phạm trong phiên thi (kèm ảnh chụp bằng chứng snapshot) */
  addExamViolationLog(examId, studentId, violationType, timestamp, snapshot = null) {
    if (!this.state.examViolationLogs) this.state.examViolationLogs = [];
    this.state.examViolationLogs.push({
      id: `viol_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      examId,
      studentId,
      type: violationType,
      snapshot: snapshot || null,
      timestamp: timestamp || new Date().toISOString()
    });
    this.save();
  }

  /** Lấy nhật ký vi phạm của một phiên thi */
  getExamViolationLogs(examId, studentId) {
    return (this.state.examViolationLogs || []).filter(
      v => v.examId === examId && (!studentId || v.studentId === studentId)
    );
  }

  // =====================================================
  // BẢNG ĐIỂM CHÍNH THỨC GDPT 2018 (TX1-4, GK, CK, TBM)
  // =====================================================
  getGradebook() {
    if (!this.state) this.state = {};
    if (!this.state.gradebook || !Array.isArray(this.state.gradebook)) {
      this.state.gradebook = [];
    }

    const students = this.getStudents ? this.getStudents() : [];
    const subjects = this.getSubjects ? this.getSubjects() : [];
    let updated = false;

    students.forEach(st => {
      subjects.forEach(sub => {
        let rec = this.state.gradebook.find(g => g.studentId === st.id && (g.subjectId === sub.id || g.subjectId.includes(sub.id) || sub.id.includes(g.subjectId)));
        if (!rec) {
          rec = {
            id: 'gb_' + st.id + '_' + sub.id,
            studentId: st.id,
            studentName: st.name || st.fullName || ('Học sinh ' + st.id),
            classId: st.classId || '6A',
            subjectId: sub.id,
            tx1: null, tx2: null, tx3: null, tx4: null,
            gk: null, ck: null, tbm: null,
            updatedAt: new Date().toISOString()
          };
          this.state.gradebook.push(rec);
          updated = true;
        } else {
          // Always sync student name & class from Student Management
          if (st.name && rec.studentName !== st.name) { rec.studentName = st.name; updated = true; }
          if (st.classId && rec.classId !== st.classId) { rec.classId = st.classId; updated = true; }
        }
      });
    });

    if (updated && this.save) {
      this.save();
    }

    return this.state.gradebook;
  }

  saveGradebookScore(studentId, classId, subjectId, scoreType, scoreValue, examTitle = '') {
    const gradebook = this.getGradebook();
    let record = gradebook.find(r => r.studentId === studentId && r.subjectId === subjectId);
    
    if (!record) {
      const student = (this.getStudents ? this.getStudents() : []).find(s => s.id === studentId);
      record = {
        id: 'gb_' + studentId + '_' + subjectId,
        studentId: studentId,
        studentName: student?.name || student?.fullName || 'Học sinh ' + studentId,
        classId: classId || student?.classId || '6A',
        subjectId: subjectId,
        tx1: null, tx2: null, tx3: null, tx4: null,
        gk: null, ck: null, tbm: null,
        updatedAt: new Date().toISOString()
      };
      gradebook.push(record);
    }

    const val = parseFloat(scoreValue);
    if (isNaN(val)) return record;

    const typeUpper = (scoreType || 'TX').toUpperCase();

    if (typeUpper.includes('TX') || typeUpper === 'TX1' || typeUpper === 'TX2' || typeUpper === 'TX3' || typeUpper === 'TX4') {
      if (typeUpper === 'TX1') record.tx1 = val;
      else if (typeUpper === 'TX2') record.tx2 = val;
      else if (typeUpper === 'TX3') record.tx3 = val;
      else if (typeUpper === 'TX4') record.tx4 = val;
      else {
        if (record.tx1 === null || record.tx1 === undefined) record.tx1 = val;
        else if (record.tx2 === null || record.tx2 === undefined) record.tx2 = val;
        else if (record.tx3 === null || record.tx3 === undefined) record.tx3 = val;
        else record.tx4 = val;
      }
    } else if (typeUpper.includes('GK') || typeUpper === 'GIUA_KY') {
      record.gk = val;
    } else if (typeUpper.includes('CK') || typeUpper === 'CUOI_KY') {
      record.ck = val;
    } else {
      if (record.tx1 === null) record.tx1 = val;
      else if (record.tx2 === null) record.tx2 = val;
      else if (record.tx3 === null) record.tx3 = val;
      else record.tx4 = val;
    }

    // Calculate TBM
    const txScores = [record.tx1, record.tx2, record.tx3, record.tx4].filter(v => v !== null && v !== undefined && !isNaN(v));
    const txSum = txScores.reduce((a, b) => a + b, 0);
    const txCount = txScores.length;

    let divisor = txCount;
    let sum = txSum;

    if (record.gk !== null && record.gk !== undefined && !isNaN(record.gk)) {
      sum += record.gk * 2;
      divisor += 2;
    }

    if (record.ck !== null && record.ck !== undefined && !isNaN(record.ck)) {
      sum += record.ck * 3;
      divisor += 3;
    }

    if (divisor > 0) {
      record.tbm = Math.round((sum / divisor) * 10) / 10;
    }

    record.updatedAt = new Date().toISOString();
    if (this.save) this.save();
    return record;
  }

  pushOrUpdateRegularScore(studentId, classId, subjectId, scoreValue) {
    const val = parseFloat(scoreValue);
    if (isNaN(val)) return { success: false, message: 'Điểm số không hợp lệ!' };

    const gradebook = this.getGradebook();
    let record = gradebook.find(r => r.studentId === studentId && r.subjectId === subjectId);

    if (!record) {
      const student = (this.getStudents ? this.getStudents() : []).find(s => s.id === studentId);
      record = {
        id: 'gb_' + studentId + '_' + subjectId,
        studentId: studentId,
        studentName: student?.name || student?.fullName || 'Học sinh ' + studentId,
        classId: classId || student?.classId || '6A',
        subjectId: subjectId,
        tx1: null, tx2: null, tx3: null, tx4: null,
        gk: null, ck: null, tbm: null,
        updatedAt: new Date().toISOString()
      };
      gradebook.push(record);
    }

    const txSlots = ['tx1', 'tx2', 'tx3', 'tx4'];
    let emptySlot = txSlots.find(slot => record[slot] === null || record[slot] === undefined || isNaN(record[slot]));

    let resultInfo = {};

    if (emptySlot) {
      // Still has empty regular score slot -> Fill empty slot
      record[emptySlot] = val;
      resultInfo = {
        action: 'added',
        slotName: emptySlot.toUpperCase(),
        newScore: val,
        message: `Đã nhập điểm ${val} vào cột ${emptySlot.toUpperCase()}`
      };
    } else {
      // All 4 regular score slots are FULL (tx1, tx2, tx3, tx4)
      // Find lowest existing score
      const existingScores = txSlots.map(s => ({ slot: s, val: parseFloat(record[s]) }));
      existingScores.sort((a, b) => a.val - b.val);
      const lowestItem = existingScores[0];

      if (val > lowestItem.val) {
        // Replace the lowest score!
        const oldVal = lowestItem.val;
        record[lowestItem.slot] = val;
        resultInfo = {
          action: 'replaced',
          slotName: lowestItem.slot.toUpperCase(),
          oldScore: oldVal,
          newScore: val,
          message: `Đã thay thế điểm thấp nhất (${oldVal} ➔ ${val}) tại cột ${lowestItem.slot.toUpperCase()}`
        };
      } else {
        resultInfo = {
          action: 'ignored',
          slotName: lowestItem.slot.toUpperCase(),
          lowestScore: lowestItem.val,
          newScore: val,
          message: `Điểm mới (${val}) không cao hơn điểm thấp nhất hiện có (${lowestItem.val}). Đã giữ nguyên cột ${lowestItem.slot.toUpperCase()}.`
        };
      }
    }

    // Recalculate TBM
    const txScores = [record.tx1, record.tx2, record.tx3, record.tx4].filter(v => v !== null && v !== undefined && !isNaN(v));
    const txSum = txScores.reduce((a, b) => a + b, 0);
    const txCount = txScores.length;
    let divisor = txCount;
    let sum = txSum;
    if (record.gk !== null && record.gk !== undefined) { sum += record.gk * 2; divisor += 2; }
    if (record.ck !== null && record.ck !== undefined) { sum += record.ck * 3; divisor += 3; }
    record.tbm = divisor > 0 ? (Math.round((sum / divisor) * 10) / 10) : null;
    record.updatedAt = new Date().toISOString();

    if (this.save) this.save();
    return { success: true, ...resultInfo, record: record };
  }


  // =========================================================================
  // KHO CÔNG CỤ & GAME GIẢNG DẠY DÙNG CHUNG (TEACHING TOOLS & GAMES REPOSITORY)
  // =========================================================================
  getTeachingTools() {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.teachingTools)) this.state.teachingTools = [];
    return this.state.teachingTools;
  }

  getTeachingToolById(id) {
    return this.getTeachingTools().find(t => t.id === id) || null;
  }

  addTeachingTool(tool) {
    if (!tool) return null;
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.teachingTools)) this.state.teachingTools = [];

    if (!tool.id) tool.id = 'tool_' + Date.now();
    if (!tool.createdAt) tool.createdAt = new Date().toISOString();
    tool.updatedAt = new Date().toISOString();
    if (tool.isShared === undefined) tool.isShared = true;
    if (tool.playCount === undefined) tool.playCount = 0;

    const existingIdx = this.state.teachingTools.findIndex(t => t.id === tool.id);
    if (existingIdx !== -1) {
      this.state.teachingTools[existingIdx] = { ...this.state.teachingTools[existingIdx], ...tool };
    } else {
      this.state.teachingTools.unshift(tool);
    }

    if (this.save) this.save();
    return tool;
  }

  updateTeachingTool(id, updateData) {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.teachingTools)) this.state.teachingTools = [];
    const idx = this.state.teachingTools.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.state.teachingTools[idx] = {
        ...this.state.teachingTools[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      if (this.save) this.save();
      return this.state.teachingTools[idx];
    }
    return null;
  }

  deleteTeachingTool(id) {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.teachingTools)) this.state.teachingTools = [];
    const initialLen = this.state.teachingTools.length;
    this.state.teachingTools = this.state.teachingTools.filter(t => String(t.id) !== String(id));
    if (this.state.teachingTools.length !== initialLen) {
      if (this.save) this.save();
      return true;
    }
    return false;
  }

  // =========================================================================
  // 🌟 QUẢN LÝ SỔ LIÊN LẠC & TIN NHẮN PHỤ HUYNH (MESSAGES)
  // =========================================================================
  getMessages() {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.messages)) {
      this.state.messages = [
        {
          id: 'msg_sample_1',
          senderRole: 'teacher',
          senderName: 'GVCN Lớp 6A',
          teacherId: 'gv_toan',
          classId: '6A',
          studentId: 'all',
          title: 'Thông báo: Lịch kiểm tra Giữa học kỳ 2 năm học 2025-2026',
          content: 'Kính gửi Quý phụ huynh lớp 6A, nhà trường tổ chức kiểm tra Giữa kỳ 2 từ ngày 25/03. Kính mong Quý phụ huynh đôn đốc các em ôn tập đầy đủ.',
          type: 'announcement',
          createdAt: Date.now() - 86400000 * 2,
          read: true
        },
        {
          id: 'msg_sample_2',
          senderRole: 'teacher',
          senderName: 'Thầy Chu Văn Giáp (GV Toán)',
          teacherId: 'gv_toan',
          classId: '6A',
          studentId: 'hs_01',
          title: 'Khen ngợi: Em có tiến bộ vượt bậc môn Toán',
          content: 'Chào phụ huynh, tuần này em học sinh đã đạt điểm 10 kiểm tra thường xuyên và rất tích cực phát biểu xây dựng bài!',
          type: 'praise',
          createdAt: Date.now() - 86400000,
          read: false
        }
      ];
      if (this.save) this.save();
    }
    return this.state.messages;
  }

  addMessage(msg) {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.messages)) this.state.messages = [];
    const newMsg = {
      id: msg.id || ('msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
      createdAt: msg.createdAt || Date.now(),
      read: false,
      ...msg
    };
    this.state.messages.unshift(newMsg);
    if (this.save) this.save();
    return newMsg;
  }

  deleteMessage(id) {
    if (!this.state || !Array.isArray(this.state.messages)) return false;
    const prevLen = this.state.messages.length;
    this.state.messages = this.state.messages.filter(m => String(m.id) !== String(id));
    if (this.state.messages.length !== prevLen) {
      if (this.save) this.save();
      return true;
    }
    return false;
  }

  markMessageRead(id) {
    if (!this.state || !Array.isArray(this.state.messages)) return false;
    const msg = this.state.messages.find(m => String(m.id) === String(id));
    if (msg) {
      msg.read = true;
      if (this.save) this.save();
      return true;
    }
    return false;
  }

  // =========================================================================
  // 🌟 QUẢN LÝ TÀI KHOẢN PHỤ HUYNH TỰ ĐỘNG
  // =========================================================================
  autoGenerateParentAccounts() {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.parents)) this.state.parents = [];
    const students = this.getStudents ? this.getStudents() : (this.state.students || []);
    let countAdded = 0;

    students.forEach(st => {
      const phone = st.parentPhone || st.phone || ('0905' + String(st.id || '').replace(/[^0-9]/g, '').padStart(6, '0'));
      const existing = this.state.parents.find(p => p.phone === phone || p.studentId === st.id);
      if (!existing) {
        this.state.parents.push({
          id: (st.id || 'hs') + '_parent',
          name: st.parentName || ('Phụ huynh em ' + (st.name || 'Học sinh')),
          phone: phone,
          studentId: st.id,
          studentName: st.name,
          classId: st.classId || '6A',
          password: '123456',
          role: 'parent',
          createdAt: Date.now()
        });
        countAdded++;
      }
    });

    if (countAdded > 0 && this.save) this.save();
    return countAdded;
  }

  // =========================================================================
  // 🌟 LỊCH SỬ SAO LƯU & CẬP NHẬT CSDL PHỤ TRỢ
  // =========================================================================
  getBackupHistory() {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.backupHistory)) {
      this.state.backupHistory = [
        { id: 'bk_1', name: 'Bản sao lưu CSDL Hệ thống Chuẩn GDPT 2018', timestamp: Date.now() - 86400000 * 3, size: '2.4 MB', type: 'auto' }
      ];
    }
    return this.state.backupHistory;
  }

  addBackupHistory(item) {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.backupHistory)) this.state.backupHistory = [];
    this.state.backupHistory.unshift({
      id: 'bk_' + Date.now(),
      timestamp: Date.now(),
      ...item
    });
    if (this.save) this.save();
  }

  updateStudentScore(scoreObj) {
    return this.addOrUpdateGrade ? this.addOrUpdateGrade(scoreObj) : null;
  }

  addStudentScore(scoreObj) {
    return this.addOrUpdateGrade ? this.addOrUpdateGrade(scoreObj) : null;
  }

  updateClass(classObj) {
    if (!this.state || !Array.isArray(this.state.classesList)) return null;
    const idx = this.state.classesList.findIndex(c => c.id === classObj.id || c.name === classObj.name);
    if (idx !== -1) {
      this.state.classesList[idx] = { ...this.state.classesList[idx], ...classObj };
      if (this.save) this.save();
      return this.state.classesList[idx];
    }
    return null;
  }

}

if (typeof window !== 'undefined') {
  window.db = new LMSDatabase();
  window.lmsDb = window.db;
} else {
  globalThis.db = new LMSDatabase();
}

