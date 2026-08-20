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

const DB_KEY = 'THCS_LMS_DATABASE_STATE_V2';

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

const DEFAULT_TEACHERS = [
  { id: 'gv_huong', name: 'Nguyễn Thị Hương', username: 'thcsamtl_huongnt', password: 'gv123456', email: 'huong.nt@school.edu.vn', phone: '0987654321', subjectId: 'toan', classes: ['6A', '6B', '7A'], isHomeroom: '6A', dob: '' },
  { id: 'gv_nam', name: 'Trần Hải Nam', username: 'thcsamtl_namth', password: 'gv123456', email: 'nam.th@school.edu.vn', phone: '0912345678', subjectId: 'van', classes: ['6A', '7A', '8A'], isHomeroom: '7A', dob: '' },
  { id: 'gv_lan', name: 'Lê Thu Lan', username: 'thcsamtl_lanlt', password: 'gv123456', email: 'lan.lt@school.edu.vn', phone: '0934567890', subjectId: 'anh', classes: ['6A', '6B', '8A'], isHomeroom: null, dob: '' },
  { id: 'gv_cuong', name: 'Phạm Quốc Cường', username: 'thcsamtl_cuongpq', password: 'gv123456', email: 'cuong.pq@school.edu.vn', phone: '0945678901', subjectId: 'khtn', classes: ['6A', '7A', '9A'], isHomeroom: null, dob: '' }
];

const DEFAULT_STUDENTS = [
  {
    "id": "hs_6a_1",
    "name": "Trần Đức Đức",
    "classId": "6A",
    "dob": "2014-02-02",
    "gender": "Nam",
    "parentName": "Trần Minh Dũng",
    "parentPhone": "0914101234"
  },
  {
    "id": "hs_6a_2",
    "name": "Lê Ngọc Ngọc",
    "classId": "6A",
    "dob": "2014-03-03",
    "gender": "Nữ",
    "parentName": "Lê Quốc Nam",
    "parentPhone": "0935102468"
  },
  {
    "id": "hs_6a_3",
    "name": "Phạm Gia Hùng",
    "classId": "6A",
    "dob": "2014-04-04",
    "gender": "Nam",
    "parentName": "Phạm Đức Hải",
    "parentPhone": "0983103702"
  },
  {
    "id": "hs_6a_4",
    "name": "Hoàng Khánh Trang",
    "classId": "6A",
    "dob": "2014-05-05",
    "gender": "Nữ",
    "parentName": "Hoàng Hải Tuấn",
    "parentPhone": "0972104936"
  },
  {
    "id": "hs_6a_5",
    "name": "Vũ Hải Phong",
    "classId": "6A",
    "dob": "2014-06-06",
    "gender": "Nam",
    "parentName": "Vũ Văn Hà",
    "parentPhone": "0905106170"
  },
  {
    "id": "hs_6a_6",
    "name": "Đặng Gia Anh",
    "classId": "6A",
    "dob": "2014-07-07",
    "gender": "Nữ",
    "parentName": "Đặng Minh Cường",
    "parentPhone": "0914107404"
  },
  {
    "id": "hs_6a_7",
    "name": "Bùi Văn Bình",
    "classId": "6A",
    "dob": "2014-08-08",
    "gender": "Nam",
    "parentName": "Nguyễn Quốc Thành",
    "parentPhone": "0935108638"
  },
  {
    "id": "hs_6a_8",
    "name": "Đỗ Trúc Nhi",
    "classId": "6A",
    "dob": "2014-09-09",
    "gender": "Nữ",
    "parentName": "Trần Đức Sơn",
    "parentPhone": "0983109872"
  },
  {
    "id": "hs_6a_9",
    "name": "Hồ Hoàng Phúc",
    "classId": "6A",
    "dob": "2014-10-10",
    "gender": "Nam",
    "parentName": "Lê Hải Bình",
    "parentPhone": "0972111106"
  },
  {
    "id": "hs_6a_10",
    "name": "Y Thị Quỳnh",
    "classId": "6A",
    "dob": "2014-11-11",
    "gender": "Nữ",
    "parentName": "Phạm Văn Hùng",
    "parentPhone": "0905112340"
  },
  {
    "id": "hs_6a_11",
    "name": "Nông Đức Huy",
    "classId": "6A",
    "dob": "2014-12-12",
    "gender": "Nam",
    "parentName": "Hoàng Minh Dũng",
    "parentPhone": "0914113574"
  },
  {
    "id": "hs_6a_12",
    "name": "Nguyễn Ngọc Yến",
    "classId": "6A",
    "dob": "2014-01-13",
    "gender": "Nữ",
    "parentName": "Vũ Quốc Nam",
    "parentPhone": "0935114808"
  },
  {
    "id": "hs_6a_13",
    "name": "Trần Gia Sơn",
    "classId": "6A",
    "dob": "2014-02-14",
    "gender": "Nam",
    "parentName": "Đặng Đức Hải",
    "parentPhone": "0983116042"
  },
  {
    "id": "hs_6a_14",
    "name": "Lê Khánh Lam",
    "classId": "6A",
    "dob": "2014-03-15",
    "gender": "Nữ",
    "parentName": "Nguyễn Hải Tuấn",
    "parentPhone": "0972117276"
  },
  {
    "id": "hs_6a_15",
    "name": "Phạm Hải Triết",
    "classId": "6A",
    "dob": "2014-04-16",
    "gender": "Nam",
    "parentName": "Trần Văn Hà",
    "parentPhone": "0905118510"
  },
  {
    "id": "hs_6a_16",
    "name": "Hoàng Gia Vân",
    "classId": "6A",
    "dob": "2014-05-17",
    "gender": "Nữ",
    "parentName": "Lê Minh Cường",
    "parentPhone": "0914119744"
  },
  {
    "id": "hs_6a_17",
    "name": "Vũ Văn Lâm",
    "classId": "6A",
    "dob": "2014-06-18",
    "gender": "Nam",
    "parentName": "Phạm Quốc Thành",
    "parentPhone": "0935120978"
  },
  {
    "id": "hs_6a_18",
    "name": "Đặng Trúc Mai",
    "classId": "6A",
    "dob": "2014-07-19",
    "gender": "Nữ",
    "parentName": "Hoàng Đức Sơn",
    "parentPhone": "0983122212"
  },
  {
    "id": "hs_6a_19",
    "name": "Bùi Hoàng Tâm",
    "classId": "6A",
    "dob": "2014-08-20",
    "gender": "Nam",
    "parentName": "Vũ Hải Bình",
    "parentPhone": "0972123446"
  },
  {
    "id": "hs_6a_20",
    "name": "Đỗ Thị Vy",
    "classId": "6A",
    "dob": "2014-09-21",
    "gender": "Nữ",
    "parentName": "Đặng Văn Hùng",
    "parentPhone": "0905124680"
  },
  {
    "id": "hs_6a_21",
    "name": "Hồ Đức Đức",
    "classId": "6A",
    "dob": "2014-10-22",
    "gender": "Nam",
    "parentName": "Nguyễn Minh Dũng",
    "parentPhone": "0914125914"
  },
  {
    "id": "hs_6a_22",
    "name": "Y Ngọc Ngọc",
    "classId": "6A",
    "dob": "2014-11-23",
    "gender": "Nữ",
    "parentName": "Trần Quốc Nam",
    "parentPhone": "0935127148"
  },
  {
    "id": "hs_6a_23",
    "name": "Nông Gia Hùng",
    "classId": "6A",
    "dob": "2014-12-24",
    "gender": "Nam",
    "parentName": "Lê Đức Hải",
    "parentPhone": "0983128382"
  },
  {
    "id": "hs_6a_24",
    "name": "Nguyễn Khánh Trang",
    "classId": "6A",
    "dob": "2014-01-25",
    "gender": "Nữ",
    "parentName": "Phạm Hải Tuấn",
    "parentPhone": "0972129616"
  },
  {
    "id": "hs_6a_25",
    "name": "Trần Hải Phong",
    "classId": "6A",
    "dob": "2014-02-26",
    "gender": "Nam",
    "parentName": "Hoàng Văn Hà",
    "parentPhone": "0905130850"
  },
  {
    "id": "hs_6a_26",
    "name": "Lê Gia Anh",
    "classId": "6A",
    "dob": "2014-03-27",
    "gender": "Nữ",
    "parentName": "Vũ Minh Cường",
    "parentPhone": "0914132084"
  },
  {
    "id": "hs_6a_27",
    "name": "Phạm Văn Bình",
    "classId": "6A",
    "dob": "2014-04-28",
    "gender": "Nam",
    "parentName": "Đặng Quốc Thành",
    "parentPhone": "0935133318"
  },
  {
    "id": "hs_6a_28",
    "name": "Hoàng Trúc Nhi",
    "classId": "6A",
    "dob": "2014-05-01",
    "gender": "Nữ",
    "parentName": "Nguyễn Đức Sơn",
    "parentPhone": "0983134552"
  },
  {
    "id": "hs_6a_29",
    "name": "Vũ Hoàng Phúc",
    "classId": "6A",
    "dob": "2014-06-02",
    "gender": "Nam",
    "parentName": "Trần Hải Bình",
    "parentPhone": "0972135786"
  },
  {
    "id": "hs_6a_30",
    "name": "Đặng Thị Quỳnh",
    "classId": "6A",
    "dob": "2014-07-03",
    "gender": "Nữ",
    "parentName": "Lê Văn Hùng",
    "parentPhone": "0905137020"
  },
  {
    "id": "hs_6a_31",
    "name": "Bùi Đức Huy",
    "classId": "6A",
    "dob": "2014-08-04",
    "gender": "Nam",
    "parentName": "Phạm Minh Dũng",
    "parentPhone": "0914138254"
  },
  {
    "id": "hs_6a_32",
    "name": "Đỗ Ngọc Yến",
    "classId": "6A",
    "dob": "2014-09-05",
    "gender": "Nữ",
    "parentName": "Hoàng Quốc Nam",
    "parentPhone": "0935139488"
  },
  {
    "id": "hs_6a_33",
    "name": "Hồ Gia Sơn",
    "classId": "6A",
    "dob": "2014-10-06",
    "gender": "Nam",
    "parentName": "Vũ Đức Hải",
    "parentPhone": "0983140722"
  },
  {
    "id": "hs_6a_34",
    "name": "Y Khánh Lam",
    "classId": "6A",
    "dob": "2014-11-07",
    "gender": "Nữ",
    "parentName": "Đặng Hải Tuấn",
    "parentPhone": "0972141956"
  },
  {
    "id": "hs_6a_35",
    "name": "Nông Hải Triết",
    "classId": "6A",
    "dob": "2014-12-08",
    "gender": "Nam",
    "parentName": "Nguyễn Văn Hà",
    "parentPhone": "0905143190"
  },
  {
    "id": "hs_6b_1",
    "name": "Trần Đức Đức",
    "classId": "6B",
    "dob": "2014-02-02",
    "gender": "Nam",
    "parentName": "Trần Minh Dũng",
    "parentPhone": "0914101234"
  },
  {
    "id": "hs_6b_2",
    "name": "Lê Ngọc Ngọc",
    "classId": "6B",
    "dob": "2014-03-03",
    "gender": "Nữ",
    "parentName": "Lê Quốc Nam",
    "parentPhone": "0935102468"
  },
  {
    "id": "hs_6b_3",
    "name": "Phạm Gia Hùng",
    "classId": "6B",
    "dob": "2014-04-04",
    "gender": "Nam",
    "parentName": "Phạm Đức Hải",
    "parentPhone": "0983103702"
  },
  {
    "id": "hs_6b_4",
    "name": "Hoàng Khánh Trang",
    "classId": "6B",
    "dob": "2014-05-05",
    "gender": "Nữ",
    "parentName": "Hoàng Hải Tuấn",
    "parentPhone": "0972104936"
  },
  {
    "id": "hs_6b_5",
    "name": "Vũ Hải Phong",
    "classId": "6B",
    "dob": "2014-06-06",
    "gender": "Nam",
    "parentName": "Vũ Văn Hà",
    "parentPhone": "0905106170"
  },
  {
    "id": "hs_6b_6",
    "name": "Đặng Gia Anh",
    "classId": "6B",
    "dob": "2014-07-07",
    "gender": "Nữ",
    "parentName": "Đặng Minh Cường",
    "parentPhone": "0914107404"
  },
  {
    "id": "hs_6b_7",
    "name": "Bùi Văn Bình",
    "classId": "6B",
    "dob": "2014-08-08",
    "gender": "Nam",
    "parentName": "Nguyễn Quốc Thành",
    "parentPhone": "0935108638"
  },
  {
    "id": "hs_6b_8",
    "name": "Đỗ Trúc Nhi",
    "classId": "6B",
    "dob": "2014-09-09",
    "gender": "Nữ",
    "parentName": "Trần Đức Sơn",
    "parentPhone": "0983109872"
  },
  {
    "id": "hs_6b_9",
    "name": "Hồ Hoàng Phúc",
    "classId": "6B",
    "dob": "2014-10-10",
    "gender": "Nam",
    "parentName": "Lê Hải Bình",
    "parentPhone": "0972111106"
  },
  {
    "id": "hs_6b_10",
    "name": "Y Thị Quỳnh",
    "classId": "6B",
    "dob": "2014-11-11",
    "gender": "Nữ",
    "parentName": "Phạm Văn Hùng",
    "parentPhone": "0905112340"
  },
  {
    "id": "hs_6b_11",
    "name": "Nông Đức Huy",
    "classId": "6B",
    "dob": "2014-12-12",
    "gender": "Nam",
    "parentName": "Hoàng Minh Dũng",
    "parentPhone": "0914113574"
  },
  {
    "id": "hs_6b_12",
    "name": "Nguyễn Ngọc Yến",
    "classId": "6B",
    "dob": "2014-01-13",
    "gender": "Nữ",
    "parentName": "Vũ Quốc Nam",
    "parentPhone": "0935114808"
  },
  {
    "id": "hs_6b_13",
    "name": "Trần Gia Sơn",
    "classId": "6B",
    "dob": "2014-02-14",
    "gender": "Nam",
    "parentName": "Đặng Đức Hải",
    "parentPhone": "0983116042"
  },
  {
    "id": "hs_6b_14",
    "name": "Lê Khánh Lam",
    "classId": "6B",
    "dob": "2014-03-15",
    "gender": "Nữ",
    "parentName": "Nguyễn Hải Tuấn",
    "parentPhone": "0972117276"
  },
  {
    "id": "hs_6b_15",
    "name": "Phạm Hải Triết",
    "classId": "6B",
    "dob": "2014-04-16",
    "gender": "Nam",
    "parentName": "Trần Văn Hà",
    "parentPhone": "0905118510"
  },
  {
    "id": "hs_6b_16",
    "name": "Hoàng Gia Vân",
    "classId": "6B",
    "dob": "2014-05-17",
    "gender": "Nữ",
    "parentName": "Lê Minh Cường",
    "parentPhone": "0914119744"
  },
  {
    "id": "hs_6b_17",
    "name": "Vũ Văn Lâm",
    "classId": "6B",
    "dob": "2014-06-18",
    "gender": "Nam",
    "parentName": "Phạm Quốc Thành",
    "parentPhone": "0935120978"
  },
  {
    "id": "hs_6b_18",
    "name": "Đặng Trúc Mai",
    "classId": "6B",
    "dob": "2014-07-19",
    "gender": "Nữ",
    "parentName": "Hoàng Đức Sơn",
    "parentPhone": "0983122212"
  },
  {
    "id": "hs_6b_19",
    "name": "Bùi Hoàng Tâm",
    "classId": "6B",
    "dob": "2014-08-20",
    "gender": "Nam",
    "parentName": "Vũ Hải Bình",
    "parentPhone": "0972123446"
  },
  {
    "id": "hs_6b_20",
    "name": "Đỗ Thị Vy",
    "classId": "6B",
    "dob": "2014-09-21",
    "gender": "Nữ",
    "parentName": "Đặng Văn Hùng",
    "parentPhone": "0905124680"
  },
  {
    "id": "hs_6b_21",
    "name": "Hồ Đức Đức",
    "classId": "6B",
    "dob": "2014-10-22",
    "gender": "Nam",
    "parentName": "Nguyễn Minh Dũng",
    "parentPhone": "0914125914"
  },
  {
    "id": "hs_6b_22",
    "name": "Y Ngọc Ngọc",
    "classId": "6B",
    "dob": "2014-11-23",
    "gender": "Nữ",
    "parentName": "Trần Quốc Nam",
    "parentPhone": "0935127148"
  },
  {
    "id": "hs_6b_23",
    "name": "Nông Gia Hùng",
    "classId": "6B",
    "dob": "2014-12-24",
    "gender": "Nam",
    "parentName": "Lê Đức Hải",
    "parentPhone": "0983128382"
  },
  {
    "id": "hs_6b_24",
    "name": "Nguyễn Khánh Trang",
    "classId": "6B",
    "dob": "2014-01-25",
    "gender": "Nữ",
    "parentName": "Phạm Hải Tuấn",
    "parentPhone": "0972129616"
  },
  {
    "id": "hs_6b_25",
    "name": "Trần Hải Phong",
    "classId": "6B",
    "dob": "2014-02-26",
    "gender": "Nam",
    "parentName": "Hoàng Văn Hà",
    "parentPhone": "0905130850"
  },
  {
    "id": "hs_6b_26",
    "name": "Lê Gia Anh",
    "classId": "6B",
    "dob": "2014-03-27",
    "gender": "Nữ",
    "parentName": "Vũ Minh Cường",
    "parentPhone": "0914132084"
  },
  {
    "id": "hs_6b_27",
    "name": "Phạm Văn Bình",
    "classId": "6B",
    "dob": "2014-04-28",
    "gender": "Nam",
    "parentName": "Đặng Quốc Thành",
    "parentPhone": "0935133318"
  },
  {
    "id": "hs_6b_28",
    "name": "Hoàng Trúc Nhi",
    "classId": "6B",
    "dob": "2014-05-01",
    "gender": "Nữ",
    "parentName": "Nguyễn Đức Sơn",
    "parentPhone": "0983134552"
  },
  {
    "id": "hs_6b_29",
    "name": "Vũ Hoàng Phúc",
    "classId": "6B",
    "dob": "2014-06-02",
    "gender": "Nam",
    "parentName": "Trần Hải Bình",
    "parentPhone": "0972135786"
  },
  {
    "id": "hs_6b_30",
    "name": "Đặng Thị Quỳnh",
    "classId": "6B",
    "dob": "2014-07-03",
    "gender": "Nữ",
    "parentName": "Lê Văn Hùng",
    "parentPhone": "0905137020"
  },
  {
    "id": "hs_6b_31",
    "name": "Bùi Đức Huy",
    "classId": "6B",
    "dob": "2014-08-04",
    "gender": "Nam",
    "parentName": "Phạm Minh Dũng",
    "parentPhone": "0914138254"
  },
  {
    "id": "hs_6b_32",
    "name": "Đỗ Ngọc Yến",
    "classId": "6B",
    "dob": "2014-09-05",
    "gender": "Nữ",
    "parentName": "Hoàng Quốc Nam",
    "parentPhone": "0935139488"
  },
  {
    "id": "hs_6b_33",
    "name": "Hồ Gia Sơn",
    "classId": "6B",
    "dob": "2014-10-06",
    "gender": "Nam",
    "parentName": "Vũ Đức Hải",
    "parentPhone": "0983140722"
  },
  {
    "id": "hs_6b_34",
    "name": "Y Khánh Lam",
    "classId": "6B",
    "dob": "2014-11-07",
    "gender": "Nữ",
    "parentName": "Đặng Hải Tuấn",
    "parentPhone": "0972141956"
  },
  {
    "id": "hs_6b_35",
    "name": "Nông Hải Triết",
    "classId": "6B",
    "dob": "2014-12-08",
    "gender": "Nam",
    "parentName": "Nguyễn Văn Hà",
    "parentPhone": "0905143190"
  },
  {
    "id": "hs_7a_1",
    "name": "Trần Đức Đức",
    "classId": "7A",
    "dob": "2013-02-02",
    "gender": "Nam",
    "parentName": "Trần Minh Dũng",
    "parentPhone": "0914101234"
  },
  {
    "id": "hs_7a_2",
    "name": "Lê Ngọc Ngọc",
    "classId": "7A",
    "dob": "2013-03-03",
    "gender": "Nữ",
    "parentName": "Lê Quốc Nam",
    "parentPhone": "0935102468"
  },
  {
    "id": "hs_7a_3",
    "name": "Phạm Gia Hùng",
    "classId": "7A",
    "dob": "2013-04-04",
    "gender": "Nam",
    "parentName": "Phạm Đức Hải",
    "parentPhone": "0983103702"
  },
  {
    "id": "hs_7a_4",
    "name": "Hoàng Khánh Trang",
    "classId": "7A",
    "dob": "2013-05-05",
    "gender": "Nữ",
    "parentName": "Hoàng Hải Tuấn",
    "parentPhone": "0972104936"
  },
  {
    "id": "hs_7a_5",
    "name": "Vũ Hải Phong",
    "classId": "7A",
    "dob": "2013-06-06",
    "gender": "Nam",
    "parentName": "Vũ Văn Hà",
    "parentPhone": "0905106170"
  },
  {
    "id": "hs_7a_6",
    "name": "Đặng Gia Anh",
    "classId": "7A",
    "dob": "2013-07-07",
    "gender": "Nữ",
    "parentName": "Đặng Minh Cường",
    "parentPhone": "0914107404"
  },
  {
    "id": "hs_7a_7",
    "name": "Bùi Văn Bình",
    "classId": "7A",
    "dob": "2013-08-08",
    "gender": "Nam",
    "parentName": "Nguyễn Quốc Thành",
    "parentPhone": "0935108638"
  },
  {
    "id": "hs_7a_8",
    "name": "Đỗ Trúc Nhi",
    "classId": "7A",
    "dob": "2013-09-09",
    "gender": "Nữ",
    "parentName": "Trần Đức Sơn",
    "parentPhone": "0983109872"
  },
  {
    "id": "hs_7a_9",
    "name": "Hồ Hoàng Phúc",
    "classId": "7A",
    "dob": "2013-10-10",
    "gender": "Nam",
    "parentName": "Lê Hải Bình",
    "parentPhone": "0972111106"
  },
  {
    "id": "hs_7a_10",
    "name": "Y Thị Quỳnh",
    "classId": "7A",
    "dob": "2013-11-11",
    "gender": "Nữ",
    "parentName": "Phạm Văn Hùng",
    "parentPhone": "0905112340"
  },
  {
    "id": "hs_7a_11",
    "name": "Nông Đức Huy",
    "classId": "7A",
    "dob": "2013-12-12",
    "gender": "Nam",
    "parentName": "Hoàng Minh Dũng",
    "parentPhone": "0914113574"
  },
  {
    "id": "hs_7a_12",
    "name": "Nguyễn Ngọc Yến",
    "classId": "7A",
    "dob": "2013-01-13",
    "gender": "Nữ",
    "parentName": "Vũ Quốc Nam",
    "parentPhone": "0935114808"
  },
  {
    "id": "hs_7a_13",
    "name": "Trần Gia Sơn",
    "classId": "7A",
    "dob": "2013-02-14",
    "gender": "Nam",
    "parentName": "Đặng Đức Hải",
    "parentPhone": "0983116042"
  },
  {
    "id": "hs_7a_14",
    "name": "Lê Khánh Lam",
    "classId": "7A",
    "dob": "2013-03-15",
    "gender": "Nữ",
    "parentName": "Nguyễn Hải Tuấn",
    "parentPhone": "0972117276"
  },
  {
    "id": "hs_7a_15",
    "name": "Phạm Hải Triết",
    "classId": "7A",
    "dob": "2013-04-16",
    "gender": "Nam",
    "parentName": "Trần Văn Hà",
    "parentPhone": "0905118510"
  },
  {
    "id": "hs_7a_16",
    "name": "Hoàng Gia Vân",
    "classId": "7A",
    "dob": "2013-05-17",
    "gender": "Nữ",
    "parentName": "Lê Minh Cường",
    "parentPhone": "0914119744"
  },
  {
    "id": "hs_7a_17",
    "name": "Vũ Văn Lâm",
    "classId": "7A",
    "dob": "2013-06-18",
    "gender": "Nam",
    "parentName": "Phạm Quốc Thành",
    "parentPhone": "0935120978"
  },
  {
    "id": "hs_7a_18",
    "name": "Đặng Trúc Mai",
    "classId": "7A",
    "dob": "2013-07-19",
    "gender": "Nữ",
    "parentName": "Hoàng Đức Sơn",
    "parentPhone": "0983122212"
  },
  {
    "id": "hs_7a_19",
    "name": "Bùi Hoàng Tâm",
    "classId": "7A",
    "dob": "2013-08-20",
    "gender": "Nam",
    "parentName": "Vũ Hải Bình",
    "parentPhone": "0972123446"
  },
  {
    "id": "hs_7a_20",
    "name": "Đỗ Thị Vy",
    "classId": "7A",
    "dob": "2013-09-21",
    "gender": "Nữ",
    "parentName": "Đặng Văn Hùng",
    "parentPhone": "0905124680"
  },
  {
    "id": "hs_7a_21",
    "name": "Hồ Đức Đức",
    "classId": "7A",
    "dob": "2013-10-22",
    "gender": "Nam",
    "parentName": "Nguyễn Minh Dũng",
    "parentPhone": "0914125914"
  },
  {
    "id": "hs_7a_22",
    "name": "Y Ngọc Ngọc",
    "classId": "7A",
    "dob": "2013-11-23",
    "gender": "Nữ",
    "parentName": "Trần Quốc Nam",
    "parentPhone": "0935127148"
  },
  {
    "id": "hs_7a_23",
    "name": "Nông Gia Hùng",
    "classId": "7A",
    "dob": "2013-12-24",
    "gender": "Nam",
    "parentName": "Lê Đức Hải",
    "parentPhone": "0983128382"
  },
  {
    "id": "hs_7a_24",
    "name": "Nguyễn Khánh Trang",
    "classId": "7A",
    "dob": "2013-01-25",
    "gender": "Nữ",
    "parentName": "Phạm Hải Tuấn",
    "parentPhone": "0972129616"
  },
  {
    "id": "hs_7a_25",
    "name": "Trần Hải Phong",
    "classId": "7A",
    "dob": "2013-02-26",
    "gender": "Nam",
    "parentName": "Hoàng Văn Hà",
    "parentPhone": "0905130850"
  },
  {
    "id": "hs_7a_26",
    "name": "Lê Gia Anh",
    "classId": "7A",
    "dob": "2013-03-27",
    "gender": "Nữ",
    "parentName": "Vũ Minh Cường",
    "parentPhone": "0914132084"
  },
  {
    "id": "hs_7a_27",
    "name": "Phạm Văn Bình",
    "classId": "7A",
    "dob": "2013-04-28",
    "gender": "Nam",
    "parentName": "Đặng Quốc Thành",
    "parentPhone": "0935133318"
  },
  {
    "id": "hs_7a_28",
    "name": "Hoàng Trúc Nhi",
    "classId": "7A",
    "dob": "2013-05-01",
    "gender": "Nữ",
    "parentName": "Nguyễn Đức Sơn",
    "parentPhone": "0983134552"
  },
  {
    "id": "hs_7a_29",
    "name": "Vũ Hoàng Phúc",
    "classId": "7A",
    "dob": "2013-06-02",
    "gender": "Nam",
    "parentName": "Trần Hải Bình",
    "parentPhone": "0972135786"
  },
  {
    "id": "hs_7a_30",
    "name": "Đặng Thị Quỳnh",
    "classId": "7A",
    "dob": "2013-07-03",
    "gender": "Nữ",
    "parentName": "Lê Văn Hùng",
    "parentPhone": "0905137020"
  },
  {
    "id": "hs_7a_31",
    "name": "Bùi Đức Huy",
    "classId": "7A",
    "dob": "2013-08-04",
    "gender": "Nam",
    "parentName": "Phạm Minh Dũng",
    "parentPhone": "0914138254"
  },
  {
    "id": "hs_7a_32",
    "name": "Đỗ Ngọc Yến",
    "classId": "7A",
    "dob": "2013-09-05",
    "gender": "Nữ",
    "parentName": "Hoàng Quốc Nam",
    "parentPhone": "0935139488"
  },
  {
    "id": "hs_7a_33",
    "name": "Hồ Gia Sơn",
    "classId": "7A",
    "dob": "2013-10-06",
    "gender": "Nam",
    "parentName": "Vũ Đức Hải",
    "parentPhone": "0983140722"
  },
  {
    "id": "hs_7a_34",
    "name": "Y Khánh Lam",
    "classId": "7A",
    "dob": "2013-11-07",
    "gender": "Nữ",
    "parentName": "Đặng Hải Tuấn",
    "parentPhone": "0972141956"
  },
  {
    "id": "hs_7a_35",
    "name": "Nông Hải Triết",
    "classId": "7A",
    "dob": "2013-12-08",
    "gender": "Nam",
    "parentName": "Nguyễn Văn Hà",
    "parentPhone": "0905143190"
  },
  {
    "id": "hs_8a_1",
    "name": "Trần Đức Đức",
    "classId": "8A",
    "dob": "2012-02-02",
    "gender": "Nam",
    "parentName": "Trần Minh Dũng",
    "parentPhone": "0914101234"
  },
  {
    "id": "hs_8a_2",
    "name": "Lê Ngọc Ngọc",
    "classId": "8A",
    "dob": "2012-03-03",
    "gender": "Nữ",
    "parentName": "Lê Quốc Nam",
    "parentPhone": "0935102468"
  },
  {
    "id": "hs_8a_3",
    "name": "Phạm Gia Hùng",
    "classId": "8A",
    "dob": "2012-04-04",
    "gender": "Nam",
    "parentName": "Phạm Đức Hải",
    "parentPhone": "0983103702"
  },
  {
    "id": "hs_8a_4",
    "name": "Hoàng Khánh Trang",
    "classId": "8A",
    "dob": "2012-05-05",
    "gender": "Nữ",
    "parentName": "Hoàng Hải Tuấn",
    "parentPhone": "0972104936"
  },
  {
    "id": "hs_8a_5",
    "name": "Vũ Hải Phong",
    "classId": "8A",
    "dob": "2012-06-06",
    "gender": "Nam",
    "parentName": "Vũ Văn Hà",
    "parentPhone": "0905106170"
  },
  {
    "id": "hs_8a_6",
    "name": "Đặng Gia Anh",
    "classId": "8A",
    "dob": "2012-07-07",
    "gender": "Nữ",
    "parentName": "Đặng Minh Cường",
    "parentPhone": "0914107404"
  },
  {
    "id": "hs_8a_7",
    "name": "Bùi Văn Bình",
    "classId": "8A",
    "dob": "2012-08-08",
    "gender": "Nam",
    "parentName": "Nguyễn Quốc Thành",
    "parentPhone": "0935108638"
  },
  {
    "id": "hs_8a_8",
    "name": "Đỗ Trúc Nhi",
    "classId": "8A",
    "dob": "2012-09-09",
    "gender": "Nữ",
    "parentName": "Trần Đức Sơn",
    "parentPhone": "0983109872"
  },
  {
    "id": "hs_8a_9",
    "name": "Hồ Hoàng Phúc",
    "classId": "8A",
    "dob": "2012-10-10",
    "gender": "Nam",
    "parentName": "Lê Hải Bình",
    "parentPhone": "0972111106"
  },
  {
    "id": "hs_8a_10",
    "name": "Y Thị Quỳnh",
    "classId": "8A",
    "dob": "2012-11-11",
    "gender": "Nữ",
    "parentName": "Phạm Văn Hùng",
    "parentPhone": "0905112340"
  },
  {
    "id": "hs_8a_11",
    "name": "Nông Đức Huy",
    "classId": "8A",
    "dob": "2012-12-12",
    "gender": "Nam",
    "parentName": "Hoàng Minh Dũng",
    "parentPhone": "0914113574"
  },
  {
    "id": "hs_8a_12",
    "name": "Nguyễn Ngọc Yến",
    "classId": "8A",
    "dob": "2012-01-13",
    "gender": "Nữ",
    "parentName": "Vũ Quốc Nam",
    "parentPhone": "0935114808"
  },
  {
    "id": "hs_8a_13",
    "name": "Trần Gia Sơn",
    "classId": "8A",
    "dob": "2012-02-14",
    "gender": "Nam",
    "parentName": "Đặng Đức Hải",
    "parentPhone": "0983116042"
  },
  {
    "id": "hs_8a_14",
    "name": "Lê Khánh Lam",
    "classId": "8A",
    "dob": "2012-03-15",
    "gender": "Nữ",
    "parentName": "Nguyễn Hải Tuấn",
    "parentPhone": "0972117276"
  },
  {
    "id": "hs_8a_15",
    "name": "Phạm Hải Triết",
    "classId": "8A",
    "dob": "2012-04-16",
    "gender": "Nam",
    "parentName": "Trần Văn Hà",
    "parentPhone": "0905118510"
  },
  {
    "id": "hs_8a_16",
    "name": "Hoàng Gia Vân",
    "classId": "8A",
    "dob": "2012-05-17",
    "gender": "Nữ",
    "parentName": "Lê Minh Cường",
    "parentPhone": "0914119744"
  },
  {
    "id": "hs_8a_17",
    "name": "Vũ Văn Lâm",
    "classId": "8A",
    "dob": "2012-06-18",
    "gender": "Nam",
    "parentName": "Phạm Quốc Thành",
    "parentPhone": "0935120978"
  },
  {
    "id": "hs_8a_18",
    "name": "Đặng Trúc Mai",
    "classId": "8A",
    "dob": "2012-07-19",
    "gender": "Nữ",
    "parentName": "Hoàng Đức Sơn",
    "parentPhone": "0983122212"
  },
  {
    "id": "hs_8a_19",
    "name": "Bùi Hoàng Tâm",
    "classId": "8A",
    "dob": "2012-08-20",
    "gender": "Nam",
    "parentName": "Vũ Hải Bình",
    "parentPhone": "0972123446"
  },
  {
    "id": "hs_8a_20",
    "name": "Đỗ Thị Vy",
    "classId": "8A",
    "dob": "2012-09-21",
    "gender": "Nữ",
    "parentName": "Đặng Văn Hùng",
    "parentPhone": "0905124680"
  },
  {
    "id": "hs_8a_21",
    "name": "Hồ Đức Đức",
    "classId": "8A",
    "dob": "2012-10-22",
    "gender": "Nam",
    "parentName": "Nguyễn Minh Dũng",
    "parentPhone": "0914125914"
  },
  {
    "id": "hs_8a_22",
    "name": "Y Ngọc Ngọc",
    "classId": "8A",
    "dob": "2012-11-23",
    "gender": "Nữ",
    "parentName": "Trần Quốc Nam",
    "parentPhone": "0935127148"
  },
  {
    "id": "hs_8a_23",
    "name": "Nông Gia Hùng",
    "classId": "8A",
    "dob": "2012-12-24",
    "gender": "Nam",
    "parentName": "Lê Đức Hải",
    "parentPhone": "0983128382"
  },
  {
    "id": "hs_8a_24",
    "name": "Nguyễn Khánh Trang",
    "classId": "8A",
    "dob": "2012-01-25",
    "gender": "Nữ",
    "parentName": "Phạm Hải Tuấn",
    "parentPhone": "0972129616"
  },
  {
    "id": "hs_8a_25",
    "name": "Trần Hải Phong",
    "classId": "8A",
    "dob": "2012-02-26",
    "gender": "Nam",
    "parentName": "Hoàng Văn Hà",
    "parentPhone": "0905130850"
  },
  {
    "id": "hs_8a_26",
    "name": "Lê Gia Anh",
    "classId": "8A",
    "dob": "2012-03-27",
    "gender": "Nữ",
    "parentName": "Vũ Minh Cường",
    "parentPhone": "0914132084"
  },
  {
    "id": "hs_8a_27",
    "name": "Phạm Văn Bình",
    "classId": "8A",
    "dob": "2012-04-28",
    "gender": "Nam",
    "parentName": "Đặng Quốc Thành",
    "parentPhone": "0935133318"
  },
  {
    "id": "hs_8a_28",
    "name": "Hoàng Trúc Nhi",
    "classId": "8A",
    "dob": "2012-05-01",
    "gender": "Nữ",
    "parentName": "Nguyễn Đức Sơn",
    "parentPhone": "0983134552"
  },
  {
    "id": "hs_8a_29",
    "name": "Vũ Hoàng Phúc",
    "classId": "8A",
    "dob": "2012-06-02",
    "gender": "Nam",
    "parentName": "Trần Hải Bình",
    "parentPhone": "0972135786"
  },
  {
    "id": "hs_8a_30",
    "name": "Đặng Thị Quỳnh",
    "classId": "8A",
    "dob": "2012-07-03",
    "gender": "Nữ",
    "parentName": "Lê Văn Hùng",
    "parentPhone": "0905137020"
  },
  {
    "id": "hs_8a_31",
    "name": "Bùi Đức Huy",
    "classId": "8A",
    "dob": "2012-08-04",
    "gender": "Nam",
    "parentName": "Phạm Minh Dũng",
    "parentPhone": "0914138254"
  },
  {
    "id": "hs_8a_32",
    "name": "Đỗ Ngọc Yến",
    "classId": "8A",
    "dob": "2012-09-05",
    "gender": "Nữ",
    "parentName": "Hoàng Quốc Nam",
    "parentPhone": "0935139488"
  },
  {
    "id": "hs_8a_33",
    "name": "Hồ Gia Sơn",
    "classId": "8A",
    "dob": "2012-10-06",
    "gender": "Nam",
    "parentName": "Vũ Đức Hải",
    "parentPhone": "0983140722"
  },
  {
    "id": "hs_8a_34",
    "name": "Y Khánh Lam",
    "classId": "8A",
    "dob": "2012-11-07",
    "gender": "Nữ",
    "parentName": "Đặng Hải Tuấn",
    "parentPhone": "0972141956"
  },
  {
    "id": "hs_8a_35",
    "name": "Nông Hải Triết",
    "classId": "8A",
    "dob": "2012-12-08",
    "gender": "Nam",
    "parentName": "Nguyễn Văn Hà",
    "parentPhone": "0905143190"
  },
  {
    "id": "hs_9a_1",
    "name": "Trần Đức Đức",
    "classId": "9A",
    "dob": "2011-02-02",
    "gender": "Nam",
    "parentName": "Trần Minh Dũng",
    "parentPhone": "0914101234"
  },
  {
    "id": "hs_9a_2",
    "name": "Lê Ngọc Ngọc",
    "classId": "9A",
    "dob": "2011-03-03",
    "gender": "Nữ",
    "parentName": "Lê Quốc Nam",
    "parentPhone": "0935102468"
  },
  {
    "id": "hs_9a_3",
    "name": "Phạm Gia Hùng",
    "classId": "9A",
    "dob": "2011-04-04",
    "gender": "Nam",
    "parentName": "Phạm Đức Hải",
    "parentPhone": "0983103702"
  },
  {
    "id": "hs_9a_4",
    "name": "Hoàng Khánh Trang",
    "classId": "9A",
    "dob": "2011-05-05",
    "gender": "Nữ",
    "parentName": "Hoàng Hải Tuấn",
    "parentPhone": "0972104936"
  },
  {
    "id": "hs_9a_5",
    "name": "Vũ Hải Phong",
    "classId": "9A",
    "dob": "2011-06-06",
    "gender": "Nam",
    "parentName": "Vũ Văn Hà",
    "parentPhone": "0905106170"
  },
  {
    "id": "hs_9a_6",
    "name": "Đặng Gia Anh",
    "classId": "9A",
    "dob": "2011-07-07",
    "gender": "Nữ",
    "parentName": "Đặng Minh Cường",
    "parentPhone": "0914107404"
  },
  {
    "id": "hs_9a_7",
    "name": "Bùi Văn Bình",
    "classId": "9A",
    "dob": "2011-08-08",
    "gender": "Nam",
    "parentName": "Nguyễn Quốc Thành",
    "parentPhone": "0935108638"
  },
  {
    "id": "hs_9a_8",
    "name": "Đỗ Trúc Nhi",
    "classId": "9A",
    "dob": "2011-09-09",
    "gender": "Nữ",
    "parentName": "Trần Đức Sơn",
    "parentPhone": "0983109872"
  },
  {
    "id": "hs_9a_9",
    "name": "Hồ Hoàng Phúc",
    "classId": "9A",
    "dob": "2011-10-10",
    "gender": "Nam",
    "parentName": "Lê Hải Bình",
    "parentPhone": "0972111106"
  },
  {
    "id": "hs_9a_10",
    "name": "Y Thị Quỳnh",
    "classId": "9A",
    "dob": "2011-11-11",
    "gender": "Nữ",
    "parentName": "Phạm Văn Hùng",
    "parentPhone": "0905112340"
  },
  {
    "id": "hs_9a_11",
    "name": "Nông Đức Huy",
    "classId": "9A",
    "dob": "2011-12-12",
    "gender": "Nam",
    "parentName": "Hoàng Minh Dũng",
    "parentPhone": "0914113574"
  },
  {
    "id": "hs_9a_12",
    "name": "Nguyễn Ngọc Yến",
    "classId": "9A",
    "dob": "2011-01-13",
    "gender": "Nữ",
    "parentName": "Vũ Quốc Nam",
    "parentPhone": "0935114808"
  },
  {
    "id": "hs_9a_13",
    "name": "Trần Gia Sơn",
    "classId": "9A",
    "dob": "2011-02-14",
    "gender": "Nam",
    "parentName": "Đặng Đức Hải",
    "parentPhone": "0983116042"
  },
  {
    "id": "hs_9a_14",
    "name": "Lê Khánh Lam",
    "classId": "9A",
    "dob": "2011-03-15",
    "gender": "Nữ",
    "parentName": "Nguyễn Hải Tuấn",
    "parentPhone": "0972117276"
  },
  {
    "id": "hs_9a_15",
    "name": "Phạm Hải Triết",
    "classId": "9A",
    "dob": "2011-04-16",
    "gender": "Nam",
    "parentName": "Trần Văn Hà",
    "parentPhone": "0905118510"
  },
  {
    "id": "hs_9a_16",
    "name": "Hoàng Gia Vân",
    "classId": "9A",
    "dob": "2011-05-17",
    "gender": "Nữ",
    "parentName": "Lê Minh Cường",
    "parentPhone": "0914119744"
  },
  {
    "id": "hs_9a_17",
    "name": "Vũ Văn Lâm",
    "classId": "9A",
    "dob": "2011-06-18",
    "gender": "Nam",
    "parentName": "Phạm Quốc Thành",
    "parentPhone": "0935120978"
  },
  {
    "id": "hs_9a_18",
    "name": "Đặng Trúc Mai",
    "classId": "9A",
    "dob": "2011-07-19",
    "gender": "Nữ",
    "parentName": "Hoàng Đức Sơn",
    "parentPhone": "0983122212"
  },
  {
    "id": "hs_9a_19",
    "name": "Bùi Hoàng Tâm",
    "classId": "9A",
    "dob": "2011-08-20",
    "gender": "Nam",
    "parentName": "Vũ Hải Bình",
    "parentPhone": "0972123446"
  },
  {
    "id": "hs_9a_20",
    "name": "Đỗ Thị Vy",
    "classId": "9A",
    "dob": "2011-09-21",
    "gender": "Nữ",
    "parentName": "Đặng Văn Hùng",
    "parentPhone": "0905124680"
  },
  {
    "id": "hs_9a_21",
    "name": "Hồ Đức Đức",
    "classId": "9A",
    "dob": "2011-10-22",
    "gender": "Nam",
    "parentName": "Nguyễn Minh Dũng",
    "parentPhone": "0914125914"
  },
  {
    "id": "hs_9a_22",
    "name": "Y Ngọc Ngọc",
    "classId": "9A",
    "dob": "2011-11-23",
    "gender": "Nữ",
    "parentName": "Trần Quốc Nam",
    "parentPhone": "0935127148"
  },
  {
    "id": "hs_9a_23",
    "name": "Nông Gia Hùng",
    "classId": "9A",
    "dob": "2011-12-24",
    "gender": "Nam",
    "parentName": "Lê Đức Hải",
    "parentPhone": "0983128382"
  },
  {
    "id": "hs_9a_24",
    "name": "Nguyễn Khánh Trang",
    "classId": "9A",
    "dob": "2011-01-25",
    "gender": "Nữ",
    "parentName": "Phạm Hải Tuấn",
    "parentPhone": "0972129616"
  },
  {
    "id": "hs_9a_25",
    "name": "Trần Hải Phong",
    "classId": "9A",
    "dob": "2011-02-26",
    "gender": "Nam",
    "parentName": "Hoàng Văn Hà",
    "parentPhone": "0905130850"
  },
  {
    "id": "hs_9a_26",
    "name": "Lê Gia Anh",
    "classId": "9A",
    "dob": "2011-03-27",
    "gender": "Nữ",
    "parentName": "Vũ Minh Cường",
    "parentPhone": "0914132084"
  },
  {
    "id": "hs_9a_27",
    "name": "Phạm Văn Bình",
    "classId": "9A",
    "dob": "2011-04-28",
    "gender": "Nam",
    "parentName": "Đặng Quốc Thành",
    "parentPhone": "0935133318"
  },
  {
    "id": "hs_9a_28",
    "name": "Hoàng Trúc Nhi",
    "classId": "9A",
    "dob": "2011-05-01",
    "gender": "Nữ",
    "parentName": "Nguyễn Đức Sơn",
    "parentPhone": "0983134552"
  },
  {
    "id": "hs_9a_29",
    "name": "Vũ Hoàng Phúc",
    "classId": "9A",
    "dob": "2011-06-02",
    "gender": "Nam",
    "parentName": "Trần Hải Bình",
    "parentPhone": "0972135786"
  },
  {
    "id": "hs_9a_30",
    "name": "Đặng Thị Quỳnh",
    "classId": "9A",
    "dob": "2011-07-03",
    "gender": "Nữ",
    "parentName": "Lê Văn Hùng",
    "parentPhone": "0905137020"
  },
  {
    "id": "hs_9a_31",
    "name": "Bùi Đức Huy",
    "classId": "9A",
    "dob": "2011-08-04",
    "gender": "Nam",
    "parentName": "Phạm Minh Dũng",
    "parentPhone": "0914138254"
  },
  {
    "id": "hs_9a_32",
    "name": "Đỗ Ngọc Yến",
    "classId": "9A",
    "dob": "2011-09-05",
    "gender": "Nữ",
    "parentName": "Hoàng Quốc Nam",
    "parentPhone": "0935139488"
  },
  {
    "id": "hs_9a_33",
    "name": "Hồ Gia Sơn",
    "classId": "9A",
    "dob": "2011-10-06",
    "gender": "Nam",
    "parentName": "Vũ Đức Hải",
    "parentPhone": "0983140722"
  },
  {
    "id": "hs_9a_34",
    "name": "Y Khánh Lam",
    "classId": "9A",
    "dob": "2011-11-07",
    "gender": "Nữ",
    "parentName": "Đặng Hải Tuấn",
    "parentPhone": "0972141956"
  },
  {
    "id": "hs_9a_35",
    "name": "Nông Hải Triết",
    "classId": "9A",
    "dob": "2011-12-08",
    "gender": "Nam",
    "parentName": "Nguyễn Văn Hà",
    "parentPhone": "0905143190"
  }
];

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

const DEFAULT_LESSONS = [
  { id: 'toan_c1_b1', chapterId: 'toan_c1', subjectId: 'toan', title: 'Bài 1: Tập hợp. Phần tử của tập hợp' },
  { id: 'toan_c1_b2', chapterId: 'toan_c1', subjectId: 'toan', title: 'Bài 2: Các phép tính cộng, trừ, nhân, chia số tự nhiên' },
  { id: 'toan_c2_b1', chapterId: 'toan_c2', subjectId: 'toan', title: 'Bài 1: Quan hệ chia hết và Tính chất chia hết' },
  { id: 'van_c1_b1', chapterId: 'van_c1', subjectId: 'van', title: 'Bài 1: Truyền thuyết Thánh Gióng' },
  { id: 'van_c1_b2', chapterId: 'van_c1', subjectId: 'van', title: 'Bài 2: Truyện cổ tích Thạch Sanh' },
  { id: 'anh_c1_b1', chapterId: 'anh_c1', subjectId: 'anh', title: 'Lesson 1: Vocabulary & Grammar (Present Simple)' },
  { id: 'tin_c1_b1', chapterId: 'tin_c1', subjectId: 'tin', title: 'Bài 1: Thông tin và Dữ liệu' },
  { id: 'tin_c2_b1', chapterId: 'tin_c2', subjectId: 'tin', title: 'Bài 1: Khái niệm Mạng máy tính và Internet' },
  { id: 'khtn_c1_b1', chapterId: 'khtn_c1', subjectId: 'khtn', title: 'Bài 1: Giới thiệu về Khoa học Tự nhiên và Phép đo' }
];

const DEFAULT_QUESTIONS = [
  // --- PHẦN 1: TRẮC NGHIỆM CHỌN ĐÁP ÁN (3.0 điểm - TNKQ) ---
  {
    id: 'q1',
    grade: 6,
    topic: 'So tu nhien', lesson: 'Tap hop va phan tu',
    subjectId: 'toan',
    chapterId: 'toan_c1',
    type: 'trac_nghiem', // trắc nghiệm nhiều lựa chọn
    difficulty: 'nhan_biet',
    questionText: 'Cho tập hợp A = {x ∈ N | x < 5}. Tập hợp A viết dưới dạng liệt kê phần tử là:',
    options: [
      'A = {1; 2; 3; 4}',
      'A = {0; 1; 2; 3; 4}',
      'A = {1; 2; 3; 4; 5}',
      'A = {0; 1; 2; 3; 4; 5}'
    ],
    correctAnswer: 1,
    explanation: 'Tập hợp các số tự nhiên N bắt đầu từ số 0. Do đó, các số tự nhiên nhỏ hơn 5 là: 0, 1, 2, 3, 4.',
    approved: true
  },
  {
    id: 'q2',
    grade: 6,
    topic: 'So tu nhien', lesson: 'Tap hop va phan tu',
    subjectId: 'toan',
    chapterId: 'toan_c1',
    type: 'trac_nghiem',
    difficulty: 'thong_hieu',
    questionText: 'Cho tập hợp B = {2; 4; 6; 8}. Phát biểu nào sau đây là SAI?',
    options: [
      '2 ∈ B',
      '5 ∉ B',
      '{4; 6} ⊂ B',
      '8 ∉ B'
    ],
    correctAnswer: 3,
    explanation: 'Số 8 rõ ràng nằm trong tập hợp B, vì vậy phát biểu "8 không thuộc B" (8 ∉ B) là sai.',
    approved: true
  },

  // --- PHẦN 2: TRẮC NGHIỆM ĐÚNG - SAI (2.0 điểm - 4 ý mỗi câu) ---
  {
    id: 'q_tf_1',
    grade: 6,
    topic: 'So tu nhien', lesson: 'Uoc va boi',
    subjectId: 'toan',
    chapterId: 'toan_c1',
    type: 'dung_sai',
    difficulty: 'thong_hieu',
    questionText: 'Cho tập hợp M = {x ∈ N* | x là số chẵn nhỏ hơn 10}. Xét tính Đúng/Sai của các nhận định sau:',
    subQuestions: [
      'a) Tập hợp M có 4 phần tử.',
      'b) Số 0 là một phần tử thuộc tập hợp M.',
      'c) Số 8 thuộc tập hợp M.',
      'd) Viết tập hợp M dưới dạng liệt kê là M = {2; 4; 6; 8}.'
    ],
    correctAnswers: [true, false, true, true],
    explanation: 'Môn Toán học: N* không chứa số 0. Số chẵn dương bé hơn 10 là {2; 4; 6; 8}. Do đó, M có 4 phần tử. 8 thuộc M. 0 không thuộc M.',
    approved: true
  },

  // --- PHẦN 3: TRẮC NGHIỆM TRẢ LỜI NGẮN (2.0 điểm - Điền đáp án) ---
  {
    id: 'q_sa_1',
    grade: 6,
    topic: 'So tu nhien', lesson: 'Uoc va boi',
    subjectId: 'toan',
    chapterId: 'toan_c1',
    type: 'tra_loi_ngan',
    difficulty: 'van_dung',
    questionText: 'Tìm số tự nhiên x lớn nhất biết rằng 120 chia hết cho x và 200 chia hết cho x.',
    correctAnswer: '40',
    explanation: 'x là ước chung lớn nhất của 120 và 200. ƯCLN(120, 200) = 40.',
    approved: true
  },

  // --- PHẦN 4: TỰ LUẬN (3.0 điểm - Essay) ---
  {
    id: 'q_essay_1',
    grade: 6,
    topic: 'So tu nhien', lesson: 'Uoc va boi',
    subjectId: 'toan',
    chapterId: 'toan_c1',
    type: 'tu_luan',
    difficulty: 'van_dung_cao',
    questionText: 'Một trường THCS tổ chức cho học sinh đi tham quan bằng xe ô tô. Nếu xếp 30 học sinh hay 45 học sinh lên một xe thì đều vừa đủ. Tính số học sinh đi tham quan, biết số học sinh nằm trong khoảng từ 500 đến 600 em.',
    options: [],
    correctAnswer: null,
    explanation: 'Số học sinh là bội chung của 30 và 45. BCNN(30, 45) = 90. Các bội của 90 trong khoảng từ 500 đến 600 là 540. Vậy số học sinh đi tham quan là 540 em.',
    approved: true
  },

  // Văn học tương ứng cho môn Ngữ văn
  {
    id: 'q_van_1',
    grade: 6,
    topic: 'Truyen dan gian', lesson: 'Thanh Giong',
    subjectId: 'van',
    chapterId: 'van_c1',
    type: 'trac_nghiem',
    difficulty: 'nhan_biet',
    questionText: 'Văn bản "Thánh Gióng" thuộc thể loại truyện dân gian nào?',
    options: [
      'Truyền thuyết',
      'Truyện cổ tích',
      'Truyện ngụ ngôn',
      'Truyện cười'
    ],
    correctAnswer: 0,
    explanation: 'Văn bản Thánh Gióng kể về người anh hùng giữ nước thời Hùng Vương, chứa các yếu tố kỳ ảo và liên quan đến lịch sử nên thuộc thể loại truyền thuyết.',
    approved: true
  },
  {
    id: 'q_tf_van',
    grade: 6,
    topic: 'Truyen dan gian', lesson: 'Son Tinh Thuy Tinh',
    subjectId: 'van',
    chapterId: 'van_c1',
    type: 'dung_sai',
    difficulty: 'thong_hieu',
    questionText: 'Xét các phát biểu sau đây về nội dung tác phẩm "Sơn Tinh, Thủy Tinh":',
    subQuestions: [
      'a) Thủy Tinh đại diện cho sức mạnh tàn phá của thiên tai, lũ lụt.',
      'b) Sơn Tinh đại diện cho sức mạnh và ước vọng chế ngự bão lũ của nhân dân.',
      'c) Kết thúc truyện, Sơn Tinh đã cưới Mỵ Nương và Thủy Tinh rút quân về hoàn toàn không quay lại.',
      'd) Truyện Sơn Tinh Thủy Tinh giải thích hiện tượng bão lũ xảy ra hằng năm ở miền Bắc nước ta.'
    ],
    correctAnswers: [true, true, false, true],
    explanation: 'Ý c) sai vì Thủy Tinh năm nào cũng dâng nước đánh Sơn Tinh chứ không phải rút quân vĩnh viễn.',
    approved: true
  },
  {
    id: 'q_sa_van',
    grade: 6,
    topic: 'Truyen dan gian', lesson: 'Thanh Giong',
    subjectId: 'van',
    chapterId: 'van_c1',
    type: 'tra_loi_ngan',
    difficulty: 'van_dung',
    questionText: 'Điền từ còn thiếu vào chỗ trống: "Truyền thuyết là loại truyện dân gian kể về các nhân vật và sự kiện có liên quan đến [...] thời quá khứ."',
    correctAnswer: 'lịch sử',
    explanation: 'Truyền thuyết luôn gắn với các sự kiện hoặc nhân vật lịch sử.',
    approved: true
  },
  {
    id: 'q_essay_van',
    grade: 6,
    topic: 'Truyen dan gian', lesson: 'Thanh Giong',
    subjectId: 'van',
    chapterId: 'van_c1',
    type: 'tu_luan',
    difficulty: 'van_dung_cao',
    questionText: 'Viết một đoạn văn ngắn (5 - 7 câu) phát biểu cảm nghĩ của em về người anh hùng Thánh Gióng.',
    options: [],
    correctAnswer: null,
    explanation: 'Học sinh cần nêu được lòng yêu nước, ý chí kiên cường chống giặc và vẻ đẹp tráng lệ của hình tượng Thánh Gióng.',
    approved: true
  }
];

const DEFAULT_ASSIGNMENTS = [
  {
    id: 'asm_1',
    title: 'Bài tập tuần 1: Tập hợp & Phần tử',
    subjectId: 'toan',
    classId: '6A',
    dueDate: '2026-07-20T23:59',
    description: 'Yêu cầu các em làm bài tập 1, 2, 3 trang 8 SGK Toán 6 (Tập 1). Chụp ảnh bài làm trong vở và đính kèm file ảnh tại đây để cô chấm điểm.',
    teacherId: 'gv_huong'
  }
];

const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub_1',
    assignmentId: 'asm_1',
    studentId: 'hs_khoi',
    submitDate: '2026-07-13T10:30',
    content: 'Em thưa cô, em đã hoàn thành bài tập tuần 1 trong vở bài tập Toán ạ. Em gửi cô file ảnh bài làm.',
    fileUrl: 'bai_lam_toan_khoi.jpg',
    score: 9,
    comment: 'Bài làm rất sạch sẽ, giải đúng tất cả các câu hỏi tập hợp. Trình bày rõ ràng. Cố gắng phát huy nhé!',
    gradedBy: 'gv_huong'
  },
  {
    id: 'sub_2',
    assignmentId: 'asm_1',
    studentId: 'hs_vy',
    submitDate: '2026-07-13T11:15',
    content: 'Em gửi bài tập về nhà ạ.',
    fileUrl: 'bai_lam_toan_vy.jpg',
    score: null,
    comment: '',
    gradedBy: null
  }
];

const DEFAULT_EXAMS = [
  {
    id: 'exam_tx_1',
    title: 'Kiểm tra Thường Xuyên số 1 - Toán 6 (Tập hợp & Số tự nhiên)',
    subjectId: 'toan',
    classId: '6A',
    classIds: ['6A'],
    targetClasses: ['6A'],
    durationMinutes: 15,
    timeLimit: 15,
    maxAttempts: 1,
    dueDate: '2026-07-28T12:00',
    questionIds: ['q1', 'q2', 'q_tf_1', 'q_sa_1', 'q_essay_1'],
    teacherId: 'gv_huong',
    published: true,
    isOfficial: false,
    examCategory: 'tx',
    category: 'tx',
    examSubType: 'regular',
    format: 'standard',
    targetGradeColumn: 'TX1',
    mode: 'thi_that',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'exam_1',
    title: 'Bài kiểm tra Định kỳ Giữa kỳ I - Toán 6 (Theo CV 7991)',
    subjectId: 'toan',
    classId: '6A',
    classIds: ['6A'],
    targetClasses: ['6A'],
    durationMinutes: 45,
    timeLimit: 45,
    maxAttempts: 1,
    dueDate: '2026-07-28T12:00',
    questionIds: ['q1', 'q2', 'q_tf_1', 'q_sa_1', 'q_essay_1'],
    teacherId: 'gv_huong',
    published: true,
    isOfficial: true,
    examCategory: 'midterm',
    category: 'midterm',
    examSubType: 'regular',
    format: 'standard',
    targetGradeColumn: 'GK',
    mode: 'thi_that',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'exam_ck_1',
    title: 'Bài kiểm tra Định kỳ Cuối kỳ II - Toán 6 (Tổng hợp kiến thức cả năm)',
    subjectId: 'toan',
    classId: '6A',
    classIds: ['6A'],
    targetClasses: ['6A'],
    durationMinutes: 60,
    timeLimit: 60,
    maxAttempts: 1,
    dueDate: '2026-07-28T12:00',
    questionIds: ['q1', 'q2', 'q_tf_1', 'q_sa_1', 'q_essay_1'],
    teacherId: 'gv_huong',
    published: true,
    isOfficial: true,
    examCategory: 'final',
    category: 'final',
    examSubType: 'regular',
    format: 'standard',
    targetGradeColumn: 'CK',
    mode: 'thi_that',
    createdAt: Date.now()
  }
];

const DEFAULT_EXAM_ATTEMPTS = [
  {
    id: 'att_1',
    examId: 'exam_1',
    studentId: 'hs_khoi',
    startTime: '2026-07-13T09:00',
    submitTime: '2026-07-13T09:12',
    answers: { 'q1': 1, 'q2': 1, 'q_tf_1': [true, false, true, true], 'q_sa_1': '40', 'q_essay_1': 'Bài làm tự luận tự động sinh của Khôi.' },
    score: 8.5,
    details: 'Trắc nghiệm: Đúng 2/2. Đúng-Sai: Đúng 4/4. Trả lời ngắn: Đúng.'
  }
];

const DEFAULT_ATTENDANCE = [
  { date: '2026-07-13', studentId: 'hs_khoi', status: 'present' },
  { date: '2026-07-13', studentId: 'hs_vy', status: 'present' },
  { date: '2026-07-13', studentId: 'hs_duc', status: 'absent_excused' },
  { date: '2026-07-13', studentId: 'hs_chi', status: 'present' }
];

const DEFAULT_MESSAGES = [
  { id: 'msg_1', senderId: 'hs_khoi_parent', receiverId: 'gv_huong', content: 'Thưa cô, tôi muốn hỏi thăm về tình hình học tập môn Toán của cháu Khôi ở lớp dạo này thế nào ạ?', timestamp: '2026-07-13T08:30:00+07:00' },
  { id: 'msg_2', senderId: 'gv_huong', receiverId: 'hs_khoi_parent', content: 'Chào anh, cháu Khôi học tập rất tốt, bài tập về nhà nộp đầy đủ và làm đúng. Điểm thi giữa kì của cháu vừa rồi là 8.5 điểm, cháu tiếp thu bài rất nhanh.', timestamp: '2026-07-13T09:30:00+07:00' }
];


const DEFAULT_FILES = [
  {
    id: 'khbd_toan6_tap_hop',
    name: '1+2-ThongTin-va-DuLieu.docx',
    fileType: 'khbd',
    ext: '.docx',
    subjectId: 'toan',
    grade: 6,
    author: 'Nguyễn Thị Hương',
    uploadDate: '2026-07-20',
    isShared: true,
    description: 'Kế hoạch bài dạy chi tiết môn Toán/Tin học lớp 6 - Thông tin và Dữ liệu (Theo CV 5512/BGDĐT)',
    content: `<div style="font-family:'Times New Roman', Times, serif; line-height:1.75; color:#0f172a; padding:0.5rem;">
  <p style="margin:0 0 1rem 0; font-size:1.05rem; color:#1e293b; border-bottom:1.5px solid #cbd5e1; padding-bottom:0.75rem;">
    <strong>Môn học:</strong> TIN HỌC - Khối 6 | <strong>Tên bài dạy:</strong> THÔNG TIN VÀ DỮ LIỆU
  </p>
  
  <h3 style="color:#0369a1; margin-top:1.2rem;">I. MỤC TIÊU BÀI HỌC</h3>
  <p><strong>1. Về kiến thức:</strong></p>
  <ul>
    <li>Nhận biết và phân biệt được khái niệm Thông tin, Dữ liệu và Vật mang tin.</li>
    <li>Nêu được các dạng dữ liệu cơ bản: dữ liệu số, dữ liệu chữ, dữ liệu hình ảnh, âm thanh.</li>
    <li>Hiểu được vai trò quan trọng của thông tin trong đời sống và học tập.</li>
  </ul>
  
  <p><strong>2. Về năng lực:</strong></p>
  <ul>
    <li>Năng lực tự chủ và tự học: Tự nghiên cứu bài học SGK và làm bài tập theo hướng dẫn.</li>
    <li>Năng lực giao tiếp và hợp tác: Thảo luận nhóm 4 người giải quyết tình huống bài học.</li>
    <li>Năng lực giải quyết vấn đề: Phân tích các ví dụ thông tin thực tế từ môi trường xung quanh.</li>
  </ul>
  
  <p><strong>3. Về phẩm chất:</strong></p>
  <ul>
    <li>Chăm chỉ, trung thực, có tinh thần trách nhiệm cao khi tham gia làm việc nhóm.</li>
  </ul>
  
  <h3 style="color:#0369a1; margin-top:1.5rem;">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
  <p><strong>1. Giáo viên:</strong> Máy tính, máy chiếu, bài giảng PowerPoint, phiếu học tập nhóm số 1 & 2.</p>
  <p><strong>2. Học sinh:</strong> Sách giáo khoa, vở ghi bài, dụng cụ học tập.</p>
  
  <h3 style="color:#0369a1; margin-top:1.5rem;">III. TIẾN TRÌNH DẠY HỌC CHI TIẾT (4 HOẠT ĐỘNG DẠY HỌC TRỌNG TÂM)</h3>
  
  <h4 style="color:#047857; margin-top:1.2rem;">1. HOẠT ĐỘNG 1: MỞ ĐẦU (KHỞI ĐỘNG - 5 PHÚT)</h4>
  <p><strong>a) Mục tiêu:</strong> Tạo tâm thế hứng thú học tập, kết nối tri thức thực tế của học sinh dẫn dắt vào bài học mới.</p>
  <p><strong>b) Nội dung:</strong> GV chiếu hình ảnh bảng tin trường và đặt câu hỏi gợi mở: <em>"Em nhìn thấy những thông tin gì trên bảng tin?"</em>.</p>
  <p><strong>c) Sản phẩm:</strong> Câu trả lời cá nhân của học sinh về các thông tin bài đăng, hình ảnh và số liệu trên bảng tin.</p>
  <p><strong>d) Tổ chức thực hiện:</strong></p>
  <ul>
    <li><em>Bước 1: Chuyển giao nhiệm vụ:</em> GV chiếu màn hình, chia lớp thành các nhóm đôi và yêu cầu quan sát trả lời câu hỏi.</li>
    <li><em>Bước 2: Thực hiện nhiệm vụ:</em> Học sinh thảo luận theo cặp đôi trong thời gian 2 phút.</li>
    <li><em>Bước 3: Báo cáo, thảo luận:</em> GV gọi đại diện 2-3 học sinh xung phong trả lời. Học sinh khác lắng nghe, nhận xét.</li>
    <li><em>Bước 4: Kết luận, nhận xét:</em> GV đánh giá câu trả lời, chốt lại ý kiến đúng và dẫn dắt trực tiếp vào Bài 1: Thông tin và Dữ liệu.</li>
  </ul>
  
  <h4 style="color:#047857; margin-top:1.5rem;">2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (25 PHÚT)</h4>
  <p style="color:#0284c7; font-weight: 400;">Mục 1: Tìm hiểu khái niệm Thông tin và Dữ liệu</p>
  <p><strong>a) Mục tiêu:</strong> Học sinh phân biệt rõ ràng khái niệm Thông tin, Dữ liệu và Vật mang tin.</p>
  <p><strong>b) Nội dung:</strong> HS nghiên cứu SGK trang 5, 6 và làm việc nhóm 4 người hoàn thành Phiếu học tập số 1.</p>
  <p><strong>c) Sản phẩm:</strong> Phiếu học tập số 1 đã hoàn thành phân loại các dạng dữ liệu số, chữ, hình ảnh, âm thanh.</p>
  <p><strong>d) Tổ chức thực hiện:</strong></p>
  <ul>
    <li><em>Bước 1 (Giao nhiệm vụ):</em> GV chia lớp thành 4 nhóm, phát Phiếu học tập số 1 cho các nhóm.</li>
    <li><em>Bước 2 (Thực hiện):</em> Các nhóm thảo luận thống nhất đáp án trong 7 phút. GV di chuyển giữa các nhóm hỗ trợ.</li>
    <li><em>Bước 3 (Báo cáo):</em> Đại diện Nhóm 1 trình bày kết quả, Nhóm 2 phản biện, bổ sung ý kiến.</li>
    <li><em>Bước 4 (Đánh giá):</em> GV chiếu đáp án chuẩn, nhận xét tinh thần làm việc của các nhóm và kết luận kiến thức trọng tâm.</li>
  </ul>

  <p style="color:#0284c7; font-weight: 400; margin-top:1rem;">Mục 2: Tìm hiểu khái niệm Vật mang tin</p>
  <p><strong>a) Mục tiêu:</strong> Hiểu được thế nào là vật mang tin và kể tên được các vật mang tin thông dụng.</p>
  <p><strong>b) Nội dung:</strong> HS làm việc cá nhân quan sát các vật dụng xung quanh lớp học (sách, thẻ nhớ, USB, bảng tin).</p>
  <p><strong>c) Sản phẩm:</strong> Danh sách các vật mang tin được ghi vào vở cá nhân.</p>
  <p><strong>d) Tổ chức thực hiện:</strong> GV tổ chức trò chơi "Ai nhanh hơn", HS nêu tên vật mang tin ➔ GV chốt khái niệm Vật mang tin.</p>
  
  <h4 style="color:#047857; margin-top:1.5rem;">3. HOẠT ĐỘNG 3: LUYỆN TẬP (10 PHÚT)</h4>
  <p><strong>a) Mục tiêu:</strong> Củng cố kiến thức đã học, rèn luyện kỹ năng nhận biết thông tin và dữ liệu qua bài tập thực hành.</p>
  <p><strong>b) Nội dung:</strong> Học sinh giải Bài tập 1, Bài tập 2 trong SGK trang 7 và trả lời câu hỏi trắc nghiệm nhanh trên máy chiếu.</p>
  <p><strong>c) Sản phẩm:</strong> Đáp án bài tập 1, 2 vào vở và kết quả phiếu trắc nghiệm cá nhân.</p>
  <p><strong>d) Tổ chức thực hiện:</strong></p>
  <ul>
    <li>GV chiếu 4 câu hỏi trắc nghiệm củng cố ➔ Học sinh suy nghĩ làm bài cá nhân trong 5 phút.</li>
    <li>GV gọi 3 HS đọc đáp án ➔ Chữa bài trực tiếp trên máy chiếu ➔ Tuyên dương học sinh làm tốt.</li>
  </ul>
  
  <h4 style="color:#047857; margin-top:1.5rem;">4. HOẠT ĐỘNG 4: VẬN DỤNG & DẶN DÒ (5 PHÚT)</h4>
  <p><strong>a) Mục tiêu:</strong> Vận dụng kiến thức bài học vào xử lý các tình huống thực tiễn hàng ngày.</p>
  <p><strong>b) Nội dung:</strong> Yêu cầu học sinh tìm 3 ví dụ về dữ liệu và thông tin mà em tiếp nhận được khi đi từ nhà đến trường.</p>
  <p><strong>c) Sản phẩm:</strong> Bài thu hoạch cá nhân viết vào vở bài tập.</p>
  <p><strong>d) Tổ chức thực hiện:</strong> GV dặn dò học sinh hoàn thành bài tập vận dụng ở nhà, truy cập hệ thống THCS LMS làm bài kiểm tra 10 phút và đọc trước bài học mới.</p>
</div>`
  },
  {
    id: 'khbd_mang_may_tinh',
    name: '7+8-MangMayTinh.docx',
    fileType: 'khbd',
    ext: '.docx',
    subjectId: 'tin',
    grade: 6,
    author: 'Chu Văn Giáp',
    uploadDate: '2026-07-25',
    isShared: true,
    description: 'Kế hoạch bài dạy môn Tin học 6 - Bài 7 & 8: Mạng máy tính và Internet (Chuẩn CV 5512)',
    content: `<div style="font-family:'Times New Roman', Times, serif; line-height:1.75; color:#0f172a;">
        <h2 style="text-align:center; color:#1e3a8a; font-weight: 400; margin-bottom:0.2rem;">KẾ HOẠCH BÀI DẠY (GIÁO ÁN THEO CÔNG VĂN 5512/BGDĐT)</h2>
        <p style="text-align:center; font-weight: 400; margin-top:0;">Trường TH-THCS Ama Trang Lơng | Tổ Khối Chuyên Môn THCS</p>
        <hr style="border:none; border-top:1.5px solid #cbd5e1; margin:1rem 0;">
        
        <p><strong>Môn học:</strong> TOÁN HỌC / TIN HỌC / NGỮ VĂN | <strong>Khối lớp:</strong> Khối 6 - THCS</p>
        <p><strong>Tên bài dạy:</strong> BÀI HỌC VÀ TIẾN TRÌNH DẠY HỌC TRỌNG TÂM</p>
        <p><strong>Thời lượng thực hiện:</strong> 02 Tiết (90 phút)</p>
        
        <h3 style="color:#0369a1; border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-top:1.5rem;">I. MỤC TIÊU BÀI HỌC</h3>
        <p><strong>1. Về kiến thức:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li>Học sinh nhận biết và nắm vững các khái niệm, định nghĩa và nguyên lý cốt lõi của bài học.</li>
          <li>Phân biệt rõ ràng các khái niệm trọng tâm, ứng dụng lý thuyết vào giải quyết các bài tập thực hành.</li>
          <li>Hiểu được vai trò và ý nghĩa thực tiễn của bài học trong đời sống xã hội và học tập.</li>
        </ul>
        
        <p><strong>2. Về năng lực:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li><em>Năng lực chung:</em> Năng lực tự chủ và tự học (chủ động đọc SGK, hoàn thành phiếu học tập cá nhân); Năng lực giao tiếp và hợp tác (thảo luận nhóm tích cực); Năng lực giải quyết vấn đề và sáng tạo.</li>
          <li><em>Năng lực đặc thù môn học:</em> Năng lực tư duy logic, phân tích tổng hợp dữ liệu, năng lực ứng dụng công nghệ và thực hành trực quan.</li>
        </ul>
        
        <p><strong>3. Về phẩm chất:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li>Chăm chỉ, trung thực, có tinh thần trách nhiệm cao trong các hoạt động học tập tập thể.</li>
          <li>Yêu thích môn học, có ý thức vận dụng tri thức vào thực tiễn cuộc sống hàng ngày.</li>
        </ul>
        
        <h3 style="color:#0369a1; border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-top:1.5rem;">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
        <p><strong>1. Giáo viên:</strong> Bài giảng điện tử PowerPoint sinh động, máy tính kết nối máy chiếu, các hình ảnh và video minh họa trực quan, phiếu học tập nhóm, thước thẳng, bảng phụ.</p>
        <p><strong>2. Học sinh:</strong> Sách giáo khoa, vở ghi bài, đồ dùng học tập cá nhân, đọc trước nội dung bài mới theo dặn dò của giáo viên.</p>
        
        <h3 style="color:#0369a1; border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-top:1.5rem;">III. TIẾN TRÌNH DẠY HỌC CHI TIẾT (CÁC HOẠT ĐỘNG DẠY HỌC)</h3>
        
        <h4 style="color:#047857; margin-bottom:0.3rem;">1. HOẠT ĐỘNG 1: MỞ ĐẦU (KHỞI ĐỘNG - 7 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Tạo tâm thế hứng thú học tập, kết nối tri thức thực tế của học sinh dẫn dắt vào bài học mới.</p>
        <p><strong>b) Nội dung:</strong> GV chiếu hình ảnh tình huống thực tế và đặt câu hỏi gợi mở yêu cầu học sinh quan sát, suy nghĩ trả lời.</p>
        <p><strong>c) Sản phẩm:</strong> Câu trả lời cá nhân của học sinh và sự tò mò khám phá nội dung bài mới.</p>
        <p><strong>d) Tổ chức thực hiện:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li><em>Bước 1: Chuyển giao nhiệm vụ:</em> GV phổ biến câu hỏi và yêu cầu HS quan sát màn hình chiếu.</li>
          <li><em>Bước 2: Thực hiện nhiệm vụ:</em> HS làm việc cá nhân trong 2 phút.</li>
          <li><em>Bước 3: Báo cáo thảo luận:</em> GV mời 2-3 HS trình bày ý kiến trước lớp.</li>
          <li><em>Bước 4: Kết luận, nhận xét:</em> GV đánh giá ý kiến HS và dẫn dắt trực tiếp vào bài học mới.</li>
        </ul>
        
        <h4 style="color:#047857; margin-bottom:0.3rem; margin-top:1.2rem;">2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (25 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Học sinh tự khám phá, thảo luận và hình thành nên các khái niệm, quy tắc trọng tâm của bài học.</p>
        <p><strong>b) Nội dung:</strong> HS đọc SGK, hoạt động nhóm 4 người hoàn thành Phiếu học tập số 1 và số 2.</p>
        <p><strong>c) Sản phẩm:</strong> Kết quả điền trên Phiếu học tập của các nhóm và nội dung ghi vở của học sinh.</p>
        <p><strong>d) Tổ chức thực hiện:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li><em>Nội dung 1 (Tìm hiểu khái niệm cốt lõi):</em> GV chia nhóm ➔ Các nhóm thảo luận 7 phút ➔ Đại diện nhóm 1 và nhóm 3 báo cáo ➔ Các nhóm khác nhận xét phản biện ➔ GV chốt đáp án chuẩn.</li>
          <li><em>Nội dung 2 (Phân tích tính chất & quy tắc):</em> GV hướng dẫn HS phân tích các ví dụ mẫu SGK ➔ Rút ra định lý/quy tắc trọng tâm ➔ HS ghi bài vào vở.</li>
        </ul>
        
        <h4 style="color:#047857; margin-bottom:0.3rem; margin-top:1.2rem;">3. HOẠT ĐỘNG 3: LUYỆN TẬP (10 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Củng cố và nâng cao kỹ năng vận dụng lý thuyết vừa học vào giải các bài tập thực hành.</p>
        <p><strong>b) Nội dung:</strong> Giải Bài tập 1, Bài tập 2 trong SGK theo hình thức cá nhân và cặp đôi.</p>
        <p><strong>c) Sản phẩm:</strong> Bài giải hoàn chỉnh trong vở bài tập của học sinh.</p>
        <p><strong>d) Tổ chức thực hiện:</strong> GV phát phiếu trắc nghiệm nhanh ➔ HS làm bài ➔ GV thu bài ngẫu nhiên 5 HS để chấm điểm và gọi HS lên bảng chữa bài ➔ GV nhận xét bài làm.</li>
        
        <h4 style="color:#047857; margin-bottom:0.3rem; margin-top:1.2rem;">4. HOẠT ĐỘNG 4: VẬN DỤNG & DẶN DÒ (3 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Vận dụng tri thức đã học vào thực tiễn cuộc sống và rèn luyện tự học ở nhà.</p>
        <p><strong>b) Nội dung:</strong> GV giao thử thách tìm 2 ví dụ thực tế liên quan đến bài học và chuẩn bị bài mới.</p>
        <p><strong>c) Sản phẩm:</strong> Bài làm nộp trên hệ thống THCS LMS của học sinh.</p>
        <p><strong>d) Tổ chức thực hiện:</strong> GV dặn dò HS ôn tập lý thuyết, hoàn thành bài tập về nhà và làm kiểm tra trực tuyến trên Cổng trường học số LMS.</p>
      </div>`
  },
  {
    id: 'khbd_van7_truyen_co_tich',
    name: 'GiaoAn_NguVan7_TruyenCoTich.pdf',
    fileType: 'khbd',
    ext: '.pdf',
    subjectId: 'van',
    grade: 7,
    author: 'Lê Thu Lan',
    uploadDate: '2026-07-22',
    isShared: true,
    description: 'Giáo án Ngữ văn 7 - Chủ đề Truyện cổ tích Việt Nam & Thế giới (Định dạng PDF)',
    content: `<div style="font-family:'Times New Roman', Times, serif; line-height:1.75; color:#0f172a;">
        <h2 style="text-align:center; color:#1e3a8a; font-weight: 400; margin-bottom:0.2rem;">KẾ HOẠCH BÀI DẠY (GIÁO ÁN THEO CÔNG VĂN 5512/BGDĐT)</h2>
        <p style="text-align:center; font-weight: 400; margin-top:0;">Trường TH-THCS Ama Trang Lơng | Tổ Khối Chuyên Môn THCS</p>
        <hr style="border:none; border-top:1.5px solid #cbd5e1; margin:1rem 0;">
        
        <p><strong>Môn học:</strong> TOÁN HỌC / TIN HỌC / NGỮ VĂN | <strong>Khối lớp:</strong> Khối 6 - THCS</p>
        <p><strong>Tên bài dạy:</strong> BÀI HỌC VÀ TIẾN TRÌNH DẠY HỌC TRỌNG TÂM</p>
        <p><strong>Thời lượng thực hiện:</strong> 02 Tiết (90 phút)</p>
        
        <h3 style="color:#0369a1; border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-top:1.5rem;">I. MỤC TIÊU BÀI HỌC</h3>
        <p><strong>1. Về kiến thức:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li>Học sinh nhận biết và nắm vững các khái niệm, định nghĩa và nguyên lý cốt lõi của bài học.</li>
          <li>Phân biệt rõ ràng các khái niệm trọng tâm, ứng dụng lý thuyết vào giải quyết các bài tập thực hành.</li>
          <li>Hiểu được vai trò và ý nghĩa thực tiễn của bài học trong đời sống xã hội và học tập.</li>
        </ul>
        
        <p><strong>2. Về năng lực:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li><em>Năng lực chung:</em> Năng lực tự chủ và tự học (chủ động đọc SGK, hoàn thành phiếu học tập cá nhân); Năng lực giao tiếp và hợp tác (thảo luận nhóm tích cực); Năng lực giải quyết vấn đề và sáng tạo.</li>
          <li><em>Năng lực đặc thù môn học:</em> Năng lực tư duy logic, phân tích tổng hợp dữ liệu, năng lực ứng dụng công nghệ và thực hành trực quan.</li>
        </ul>
        
        <p><strong>3. Về phẩm chất:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li>Chăm chỉ, trung thực, có tinh thần trách nhiệm cao trong các hoạt động học tập tập thể.</li>
          <li>Yêu thích môn học, có ý thức vận dụng tri thức vào thực tiễn cuộc sống hàng ngày.</li>
        </ul>
        
        <h3 style="color:#0369a1; border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-top:1.5rem;">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
        <p><strong>1. Giáo viên:</strong> Bài giảng điện tử PowerPoint sinh động, máy tính kết nối máy chiếu, các hình ảnh và video minh họa trực quan, phiếu học tập nhóm, thước thẳng, bảng phụ.</p>
        <p><strong>2. Học sinh:</strong> Sách giáo khoa, vở ghi bài, đồ dùng học tập cá nhân, đọc trước nội dung bài mới theo dặn dò của giáo viên.</p>
        
        <h3 style="color:#0369a1; border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-top:1.5rem;">III. TIẾN TRÌNH DẠY HỌC CHI TIẾT (CÁC HOẠT ĐỘNG DẠY HỌC)</h3>
        
        <h4 style="color:#047857; margin-bottom:0.3rem;">1. HOẠT ĐỘNG 1: MỞ ĐẦU (KHỞI ĐỘNG - 7 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Tạo tâm thế hứng thú học tập, kết nối tri thức thực tế của học sinh dẫn dắt vào bài học mới.</p>
        <p><strong>b) Nội dung:</strong> GV chiếu hình ảnh tình huống thực tế và đặt câu hỏi gợi mở yêu cầu học sinh quan sát, suy nghĩ trả lời.</p>
        <p><strong>c) Sản phẩm:</strong> Câu trả lời cá nhân của học sinh và sự tò mò khám phá nội dung bài mới.</p>
        <p><strong>d) Tổ chức thực hiện:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li><em>Bước 1: Chuyển giao nhiệm vụ:</em> GV phổ biến câu hỏi và yêu cầu HS quan sát màn hình chiếu.</li>
          <li><em>Bước 2: Thực hiện nhiệm vụ:</em> HS làm việc cá nhân trong 2 phút.</li>
          <li><em>Bước 3: Báo cáo thảo luận:</em> GV mời 2-3 HS trình bày ý kiến trước lớp.</li>
          <li><em>Bước 4: Kết luận, nhận xét:</em> GV đánh giá ý kiến HS và dẫn dắt trực tiếp vào bài học mới.</li>
        </ul>
        
        <h4 style="color:#047857; margin-bottom:0.3rem; margin-top:1.2rem;">2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (25 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Học sinh tự khám phá, thảo luận và hình thành nên các khái niệm, quy tắc trọng tâm của bài học.</p>
        <p><strong>b) Nội dung:</strong> HS đọc SGK, hoạt động nhóm 4 người hoàn thành Phiếu học tập số 1 và số 2.</p>
        <p><strong>c) Sản phẩm:</strong> Kết quả điền trên Phiếu học tập của các nhóm và nội dung ghi vở của học sinh.</p>
        <p><strong>d) Tổ chức thực hiện:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li><em>Nội dung 1 (Tìm hiểu khái niệm cốt lõi):</em> GV chia nhóm ➔ Các nhóm thảo luận 7 phút ➔ Đại diện nhóm 1 và nhóm 3 báo cáo ➔ Các nhóm khác nhận xét phản biện ➔ GV chốt đáp án chuẩn.</li>
          <li><em>Nội dung 2 (Phân tích tính chất & quy tắc):</em> GV hướng dẫn HS phân tích các ví dụ mẫu SGK ➔ Rút ra định lý/quy tắc trọng tâm ➔ HS ghi bài vào vở.</li>
        </ul>
        
        <h4 style="color:#047857; margin-bottom:0.3rem; margin-top:1.2rem;">3. HOẠT ĐỘNG 3: LUYỆN TẬP (10 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Củng cố và nâng cao kỹ năng vận dụng lý thuyết vừa học vào giải các bài tập thực hành.</p>
        <p><strong>b) Nội dung:</strong> Giải Bài tập 1, Bài tập 2 trong SGK theo hình thức cá nhân và cặp đôi.</p>
        <p><strong>c) Sản phẩm:</strong> Bài giải hoàn chỉnh trong vở bài tập của học sinh.</p>
        <p><strong>d) Tổ chức thực hiện:</strong> GV phát phiếu trắc nghiệm nhanh ➔ HS làm bài ➔ GV thu bài ngẫu nhiên 5 HS để chấm điểm và gọi HS lên bảng chữa bài ➔ GV nhận xét bài làm.</li>
        
        <h4 style="color:#047857; margin-bottom:0.3rem; margin-top:1.2rem;">4. HOẠT ĐỘNG 4: VẬN DỤNG & DẶN DÒ (3 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Vận dụng tri thức đã học vào thực tiễn cuộc sống và rèn luyện tự học ở nhà.</p>
        <p><strong>b) Nội dung:</strong> GV giao thử thách tìm 2 ví dụ thực tế liên quan đến bài học và chuẩn bị bài mới.</p>
        <p><strong>c) Sản phẩm:</strong> Bài làm nộp trên hệ thống THCS LMS của học sinh.</p>
        <p><strong>d) Tổ chức thực hiện:</strong> GV dặn dò HS ôn tập lý thuyết, hoàn thành bài tập về nhà và làm kiểm tra trực tuyến trên Cổng trường học số LMS.</p>
      </div>`
  },
  {
    id: 'khbd_anh8_unit1',
    name: 'LessonPlan_English8_Unit1.doc',
    fileType: 'khbd',
    ext: '.doc',
    subjectId: 'anh',
    grade: 8,
    author: 'Trần Hải Nam',
    uploadDate: '2026-07-24',
    isShared: true,
    description: 'Lesson Plan English Grade 8 - Unit 1: Leisure Time & Hobbies (Doc Format)',
    content: `<div style="font-family:'Times New Roman', Times, serif; line-height:1.75; color:#0f172a;">
        <h2 style="text-align:center; color:#1e3a8a; font-weight: 400; margin-bottom:0.2rem;">KẾ HOẠCH BÀI DẠY (GIÁO ÁN THEO CÔNG VĂN 5512/BGDĐT)</h2>
        <p style="text-align:center; font-weight: 400; margin-top:0;">Trường TH-THCS Ama Trang Lơng | Tổ Khối Chuyên Môn THCS</p>
        <hr style="border:none; border-top:1.5px solid #cbd5e1; margin:1rem 0;">
        
        <p><strong>Môn học:</strong> TOÁN HỌC / TIN HỌC / NGỮ VĂN | <strong>Khối lớp:</strong> Khối 6 - THCS</p>
        <p><strong>Tên bài dạy:</strong> BÀI HỌC VÀ TIẾN TRÌNH DẠY HỌC TRỌNG TÂM</p>
        <p><strong>Thời lượng thực hiện:</strong> 02 Tiết (90 phút)</p>
        
        <h3 style="color:#0369a1; border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-top:1.5rem;">I. MỤC TIÊU BÀI HỌC</h3>
        <p><strong>1. Về kiến thức:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li>Học sinh nhận biết và nắm vững các khái niệm, định nghĩa và nguyên lý cốt lõi của bài học.</li>
          <li>Phân biệt rõ ràng các khái niệm trọng tâm, ứng dụng lý thuyết vào giải quyết các bài tập thực hành.</li>
          <li>Hiểu được vai trò và ý nghĩa thực tiễn của bài học trong đời sống xã hội và học tập.</li>
        </ul>
        
        <p><strong>2. Về năng lực:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li><em>Năng lực chung:</em> Năng lực tự chủ và tự học (chủ động đọc SGK, hoàn thành phiếu học tập cá nhân); Năng lực giao tiếp và hợp tác (thảo luận nhóm tích cực); Năng lực giải quyết vấn đề và sáng tạo.</li>
          <li><em>Năng lực đặc thù môn học:</em> Năng lực tư duy logic, phân tích tổng hợp dữ liệu, năng lực ứng dụng công nghệ và thực hành trực quan.</li>
        </ul>
        
        <p><strong>3. Về phẩm chất:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li>Chăm chỉ, trung thực, có tinh thần trách nhiệm cao trong các hoạt động học tập tập thể.</li>
          <li>Yêu thích môn học, có ý thức vận dụng tri thức vào thực tiễn cuộc sống hàng ngày.</li>
        </ul>
        
        <h3 style="color:#0369a1; border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-top:1.5rem;">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h3>
        <p><strong>1. Giáo viên:</strong> Bài giảng điện tử PowerPoint sinh động, máy tính kết nối máy chiếu, các hình ảnh và video minh họa trực quan, phiếu học tập nhóm, thước thẳng, bảng phụ.</p>
        <p><strong>2. Học sinh:</strong> Sách giáo khoa, vở ghi bài, đồ dùng học tập cá nhân, đọc trước nội dung bài mới theo dặn dò của giáo viên.</p>
        
        <h3 style="color:#0369a1; border-bottom:1px solid #e2e8f0; padding-bottom:0.3rem; margin-top:1.5rem;">III. TIẾN TRÌNH DẠY HỌC CHI TIẾT (CÁC HOẠT ĐỘNG DẠY HỌC)</h3>
        
        <h4 style="color:#047857; margin-bottom:0.3rem;">1. HOẠT ĐỘNG 1: MỞ ĐẦU (KHỞI ĐỘNG - 7 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Tạo tâm thế hứng thú học tập, kết nối tri thức thực tế của học sinh dẫn dắt vào bài học mới.</p>
        <p><strong>b) Nội dung:</strong> GV chiếu hình ảnh tình huống thực tế và đặt câu hỏi gợi mở yêu cầu học sinh quan sát, suy nghĩ trả lời.</p>
        <p><strong>c) Sản phẩm:</strong> Câu trả lời cá nhân của học sinh và sự tò mò khám phá nội dung bài mới.</p>
        <p><strong>d) Tổ chức thực hiện:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li><em>Bước 1: Chuyển giao nhiệm vụ:</em> GV phổ biến câu hỏi và yêu cầu HS quan sát màn hình chiếu.</li>
          <li><em>Bước 2: Thực hiện nhiệm vụ:</em> HS làm việc cá nhân trong 2 phút.</li>
          <li><em>Bước 3: Báo cáo thảo luận:</em> GV mời 2-3 HS trình bày ý kiến trước lớp.</li>
          <li><em>Bước 4: Kết luận, nhận xét:</em> GV đánh giá ý kiến HS và dẫn dắt trực tiếp vào bài học mới.</li>
        </ul>
        
        <h4 style="color:#047857; margin-bottom:0.3rem; margin-top:1.2rem;">2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (25 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Học sinh tự khám phá, thảo luận và hình thành nên các khái niệm, quy tắc trọng tâm của bài học.</p>
        <p><strong>b) Nội dung:</strong> HS đọc SGK, hoạt động nhóm 4 người hoàn thành Phiếu học tập số 1 và số 2.</p>
        <p><strong>c) Sản phẩm:</strong> Kết quả điền trên Phiếu học tập của các nhóm và nội dung ghi vở của học sinh.</p>
        <p><strong>d) Tổ chức thực hiện:</strong></p>
        <ul style="margin-top:0.2rem;">
          <li><em>Nội dung 1 (Tìm hiểu khái niệm cốt lõi):</em> GV chia nhóm ➔ Các nhóm thảo luận 7 phút ➔ Đại diện nhóm 1 và nhóm 3 báo cáo ➔ Các nhóm khác nhận xét phản biện ➔ GV chốt đáp án chuẩn.</li>
          <li><em>Nội dung 2 (Phân tích tính chất & quy tắc):</em> GV hướng dẫn HS phân tích các ví dụ mẫu SGK ➔ Rút ra định lý/quy tắc trọng tâm ➔ HS ghi bài vào vở.</li>
        </ul>
        
        <h4 style="color:#047857; margin-bottom:0.3rem; margin-top:1.2rem;">3. HOẠT ĐỘNG 3: LUYỆN TẬP (10 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Củng cố và nâng cao kỹ năng vận dụng lý thuyết vừa học vào giải các bài tập thực hành.</p>
        <p><strong>b) Nội dung:</strong> Giải Bài tập 1, Bài tập 2 trong SGK theo hình thức cá nhân và cặp đôi.</p>
        <p><strong>c) Sản phẩm:</strong> Bài giải hoàn chỉnh trong vở bài tập của học sinh.</p>
        <p><strong>d) Tổ chức thực hiện:</strong> GV phát phiếu trắc nghiệm nhanh ➔ HS làm bài ➔ GV thu bài ngẫu nhiên 5 HS để chấm điểm và gọi HS lên bảng chữa bài ➔ GV nhận xét bài làm.</li>
        
        <h4 style="color:#047857; margin-bottom:0.3rem; margin-top:1.2rem;">4. HOẠT ĐỘNG 4: VẬN DỤNG & DẶN DÒ (3 PHÚT)</h4>
        <p><strong>a) Mục tiêu:</strong> Vận dụng tri thức đã học vào thực tiễn cuộc sống và rèn luyện tự học ở nhà.</p>
        <p><strong>b) Nội dung:</strong> GV giao thử thách tìm 2 ví dụ thực tế liên quan đến bài học và chuẩn bị bài mới.</p>
        <p><strong>c) Sản phẩm:</strong> Bài làm nộp trên hệ thống THCS LMS của học sinh.</p>
        <p><strong>d) Tổ chức thực hiện:</strong> GV dặn dò HS ôn tập lý thuyết, hoàn thành bài tập về nhà và làm kiểm tra trực tuyến trên Cổng trường học số LMS.</p>
      </div>`
  },
  {
    id: 'slide_powerpoint_toan6',
    name: 'Slide_BaiGiang_PowerPoint_Toan6.pptx',
    fileType: 'slide',
    ext: '.pptx',
    subjectId: 'toan',
    grade: 6,
    author: 'Chu Văn Giáp',
    uploadDate: '2026-07-25',
    isShared: true,
    description: 'Slide bài giảng PowerPoint môn Toán 6 - Thiết kế trình chiếu 3D tương tác',
    content: `SLIDE_TITLE: 🎯 BÀI GIẢNG ĐIỆN TỬ TOÁN HỌC KHỐI 6
SUBTITLE: Bài giảng Trực quan & Trò chơi Học tập Tương tác THCS LMS
PRESENTER: Giáo viên: Chu Văn Giáp | Trường TH-THCS Ama Trang Lơng
SUBJECT: Môn: TOÁN HỌC - KHỐI 6

--- SLIDE_BREAK ---

SLIDE_HEADER: 🎯 1. Mục tiêu Bài học & Chuẩn bị
• Nắm vững kiến thức trọng tâm của bài học và vận dụng giải bài tập
• Rèn luyện kỹ năng phát biểu, tư duy nhóm và giải quyết vấn đề
• Tạo không khí thi đua sôi nổi, hứng thú học tập cao cho học sinh cả lớp

--- SLIDE_BREAK ---

SLIDE_HEADER: 📚 2. Nội dung Lý thuyết Trọng tâm
• Khái niệm 1: Định nghĩa và các ví dụ minh họa trực quan
• Tính chất 2: Phân tích công thức và sơ đồ tư duy hệ thống
• Lưu ý: Các dạng bài tập dễ nhầm lẫn và phương pháp khắc phục hiệu quả

--- SLIDE_BREAK ---

SLIDE_HEADER: ✍️ 3. Bài tập Luyện tập & Thử thách Nhanh
• Thử thách 1: Giải nhanh câu hỏi trắc nghiệm củng cố lý thuyết
• Thử thách 2: Bài tập tình huống thực tế ứng dụng trong đời sống
• Hướng dẫn giải đáp thắc mắc và chấm điểm trực tiếp cho học sinh

--- SLIDE_BREAK ---

SLIDE_HEADER: 💡 4. Củng cố Tiết học & Dặn dò Về nhà
• Tuyên dương các cá nhân và nhóm học sinh tích cực phát biểu
• Hoàn thành các bài tập về nhà trên hệ thống THCS LMS
• Ôn tập và đọc trước nội dung bài học mới cho tiết tiếp theo`
  }
];


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
    { id: '6A', grade: 6, room: 'Phòng 101', homeroomTeacherId: 'gv_huong' },
    { id: '6B', grade: 6, room: 'Phòng 102', homeroomTeacherId: 'gv_lan' },
    { id: '7A', grade: 7, room: 'Phòng 201', homeroomTeacherId: 'gv_nam' },
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
  parents: [
    { id: 'hs_khoi_parent', name: 'Nguyễn Minh Hùng', phone: '0905123456', studentId: 'hs_khoi' },
    { id: 'hs_vy_parent', name: 'Lê Mai Vy', phone: '0905111222', studentId: 'hs_vy' },
    { id: 'hs_duc_parent', name: 'Phạm Văn Nam', phone: '0905333444', studentId: 'hs_duc' },
    { id: 'hs_chi_parent', name: 'Trần Thị Hà', phone: '0905555666', studentId: 'hs_chi' }
  ],
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

  async syncFromServer() {
    if (typeof fetch === 'undefined') return;
    try {
      const res = await fetch('/api/db/state');
      if (res.ok) {
        const remoteState = await res.json();
        if (remoteState && remoteState.students && remoteState.students.length > 0) {
          this.state = remoteState;
          try { localStorage.setItem(DB_KEY, JSON.stringify(this.state)); } catch(e) {}
          console.log('✅ LMS Central Database synchronized from Server!');
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
    if (!this.state.exams || !Array.isArray(this.state.exams)) {
      this.state.exams = JSON.parse(JSON.stringify(DEFAULT_EXAMS));
      this.save();
      return;
    }
    const existingIds = new Set(this.state.exams.map(e => e.id));
    let changed = false;
    DEFAULT_EXAMS.forEach(de => {
      if (!existingIds.has(de.id)) {
        this.state.exams.push(JSON.parse(JSON.stringify(de)));
        changed = true;
      }
    });
    // Ensure all exams have examCategory
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

  _migrateUploadedFiles() {
    if (!this.state) this.state = {};
    if (!this.state.uploadedFiles || !Array.isArray(this.state.uploadedFiles) || this.state.uploadedFiles.length === 0) {
      this.state.uploadedFiles = JSON.parse(JSON.stringify(DEFAULT_FILES));
      this.save();
      return;
    }
    let changed = false;
    const fullRichKhbd = ``;

    this.state.uploadedFiles.forEach(f => {
      if (!f.fileType) {
        const nameLower = (f.name || '').toLowerCase();
        if (nameLower.includes('slide') || nameLower.includes('ppt') || nameLower.includes('bai_giang')) {
          f.fileType = 'slide';
        } else {
          f.fileType = 'khbd';
        }
        changed = true;
      }
      if (!f.ext) {
        f.ext = f.fileType === 'khbd' ? '.docx' : '.pptx';
        changed = true;
      }
      // Force update any short/old KHBD content in localStorage to the full rich 5512 lesson plan with all 4 activities!
      if (f.fileType === 'khbd' && (!f.content || !f.content.includes('HOẠT ĐỘNG 4'))) {
        f.content = fullRichKhbd;
        changed = true;
      }
    });

    if (this.state.uploadedFiles.length < 4) {
      const existingIds = new Set(this.state.uploadedFiles.map(f => f.id));
      DEFAULT_FILES.forEach(df => {
        if (!existingIds.has(df.id)) {
          this.state.uploadedFiles.push(JSON.parse(JSON.stringify(df)));
          changed = true;
        }
      });
    }

    if (changed) this.save();
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

    // Asynchronously debounced sync to Central Server
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
      }, 600);
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

  getSubjects() { return this.state.subjects || []; }
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
    const sId = String(id);
    if (!this.state.assignments) return;
    const idx = this.state.assignments.findIndex(a => String(a.id) === sId);
    if (idx !== -1) {
      this.state.assignments[idx] = { ...this.state.assignments[idx], ...updatedData };
      this.save();
    }
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
    const idx = this.state.exams.findIndex(e => String(e.id) === String(id));
    if (idx !== -1) {
      this.state.exams[idx] = { ...this.state.exams[idx], ...updatedData };
      this.save();
    }
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

  /** Ghi nhật ký vi phạm trong phiên thi */
  addExamViolationLog(examId, studentId, violationType, timestamp) {
    if (!this.state.examViolationLogs) this.state.examViolationLogs = [];
    this.state.examViolationLogs.push({
      id: `viol_${Date.now()}`,
      examId,
      studentId,
      type: violationType,
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

