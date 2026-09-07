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

function cleanQuestionText(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/^\s*\[[^\]]+\]\s*/i, '')
    .replace(/^\s*Câu\s*\d+\s*[\:\.\-]\s*/i, '')
    .trim();
}
if (typeof window !== 'undefined') {
  window.cleanQuestionText = cleanQuestionText;
}
if (typeof globalThis !== 'undefined') {
  globalThis.cleanQuestionText = cleanQuestionText;
}

function cleanChoiceText(text) {
  if (text === null || text === undefined) return '';
  return String(text).replace(/^(\s*[\(\[]?[A-Da-d0-9][\.\)\:\-\]\s]+)+/i, '').trim();
}
if (typeof window !== 'undefined') {
  window.cleanChoiceText = cleanChoiceText;
}
if (typeof globalThis !== 'undefined') {
  globalThis.cleanChoiceText = cleanChoiceText;
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
  {
    "id": "tin_6_c1",
    "subjectId": "tin",
    "grade": 6,
    "title": "Chủ đề 1: Máy tính và cộng đồng"
  },
  {
    "id": "tin_6_c2",
    "subjectId": "tin",
    "grade": 6,
    "title": "Chủ đề 2: Mạng máy tính và Internet"
  },
  {
    "id": "tin_6_c3",
    "subjectId": "tin",
    "grade": 6,
    "title": "Chủ đề 3: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin"
  },
  {
    "id": "tin_6_c4",
    "subjectId": "tin",
    "grade": 6,
    "title": "Chủ đề 4: Đạo đức, pháp luật và văn hóa trong môi trường số"
  },
  {
    "id": "tin_6_c5",
    "subjectId": "tin",
    "grade": 6,
    "title": "Chủ đề 5: Ứng dụng tin học (Soạn thảo & Trình chiếu)"
  },
  {
    "id": "tin_6_c6",
    "subjectId": "tin",
    "grade": 6,
    "title": "Chủ đề 6: Giải quyết vấn đề với sự trợ giúp của máy tính"
  },
  {
    "id": "tin_7_c1",
    "subjectId": "tin",
    "grade": 7,
    "title": "Chủ đề 1: Máy tính và cộng đồng (Thiết bị vào - ra)"
  },
  {
    "id": "tin_7_c2",
    "subjectId": "tin",
    "grade": 7,
    "title": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin"
  },
  {
    "id": "tin_7_c4",
    "subjectId": "tin",
    "grade": 7,
    "title": "Chủ đề 4: Ứng dụng tin học (Bảng tính điện tử Excel)"
  },
  {
    "id": "tin_7_c5",
    "subjectId": "tin",
    "grade": 7,
    "title": "Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính (Thuật toán)"
  },
  {
    "id": "tin_8_c1",
    "subjectId": "tin",
    "grade": 8,
    "title": "Chủ đề 1: Máy tính và cộng đồng (Lịch sử máy tính)"
  },
  {
    "id": "tin_8_c4",
    "subjectId": "tin",
    "grade": 8,
    "title": "Chủ đề 4: Khai thác bảng tính nâng cao"
  },
  {
    "id": "tin_8_c5",
    "subjectId": "tin",
    "grade": 8,
    "title": "Chủ đề 5: Giải quyết vấn đề với sự trợ giúp của máy tính (Lập trình trực quan)"
  },
  {
    "id": "tin_9_c1",
    "subjectId": "tin",
    "grade": 9,
    "title": "Chủ đề 1: Máy tính và cộng đồng"
  },
  {
    "id": "tin_9_c2",
    "subjectId": "tin",
    "grade": 9,
    "title": "Chủ đề 2: Tổ chức lưu trữ, tìm kiếm và trao đổi thông tin"
  },
  {
    "id": "tin_9_c3",
    "subjectId": "tin",
    "grade": 9,
    "title": "Chủ đề 3: Đạo đức, pháp luật và văn hóa trong môi trường số"
  },
  {
    "id": "tin_9_c4",
    "subjectId": "tin",
    "grade": 9,
    "title": "Chủ đề 4: Ứng dụng tin học"
  },
  {
    "id": "tin_9_c5",
    "subjectId": "tin",
    "grade": 9,
    "title": "Chủ đề 5: Hướng nghiệp với tin học"
  },
  {
    "id": "toan_6_c1",
    "subjectId": "toan",
    "grade": 6,
    "title": "Chương I: Tập hợp các số tự nhiên"
  },
  {
    "id": "toan_6_c2",
    "subjectId": "toan",
    "grade": 6,
    "title": "Chương II: Tính chia hết trong tập hợp các số tự nhiên"
  },
  {
    "id": "toan_6_c3",
    "subjectId": "toan",
    "grade": 6,
    "title": "Chương III: Số nguyên (Z)"
  },
  {
    "id": "toan_6_c4",
    "subjectId": "toan",
    "grade": 6,
    "title": "Chương IV: Một số hình phẳng trong thực tiễn"
  },
  {
    "id": "toan_6_c5",
    "subjectId": "toan",
    "grade": 6,
    "title": "Chương V: Tính đối xứng của hình phẳng trong tự nhiên"
  },
  {
    "id": "toan_6_c6",
    "subjectId": "toan",
    "grade": 6,
    "title": "Chương VI: Phân số & Số thập phân"
  },
  {
    "id": "toan_7_c1",
    "subjectId": "toan",
    "grade": 7,
    "title": "Chương I: Số hữu tỉ (Q)"
  },
  {
    "id": "toan_7_c2",
    "subjectId": "toan",
    "grade": 7,
    "title": "Chương II: Số thực (R) & Căn bậc hai số học"
  },
  {
    "id": "toan_7_c3",
    "subjectId": "toan",
    "grade": 7,
    "title": "Chương III: Góc và đường thẳng song song"
  },
  {
    "id": "toan_7_c4",
    "subjectId": "toan",
    "grade": 7,
    "title": "Chương IV: Tam giác bằng nhau & Định lí Py-ta-go"
  },
  {
    "id": "toan_7_c6",
    "subjectId": "toan",
    "grade": 7,
    "title": "Chương VI: Tỉ lệ thức và Đại lượng tỉ lệ"
  },
  {
    "id": "toan_7_c7",
    "subjectId": "toan",
    "grade": 7,
    "title": "Chương VII: Biểu thức đại số và Đa thức một biến"
  },
  {
    "id": "toan_8_c1",
    "subjectId": "toan",
    "grade": 8,
    "title": "Chương I: Đa thức nhiều biến"
  },
  {
    "id": "toan_8_c2",
    "subjectId": "toan",
    "grade": 8,
    "title": "Chương II: Hằng đẳng thức đáng nhớ & Phân tích đa thức"
  },
  {
    "id": "toan_8_c3",
    "subjectId": "toan",
    "grade": 8,
    "title": "Chương III: Tứ giác (Hình thang, HBH, HCN, Thoi, Vuông)"
  },
  {
    "id": "toan_8_c4",
    "subjectId": "toan",
    "grade": 8,
    "title": "Chương IV: Định lí Thalès trong tam giác"
  },
  {
    "id": "toan_8_c6",
    "subjectId": "toan",
    "grade": 8,
    "title": "Chương VI: Phân thức đại số"
  },
  {
    "id": "toan_8_c7",
    "subjectId": "toan",
    "grade": 8,
    "title": "Chương VII: Phương trình bậc nhất & Hàm số bậc nhất"
  },
  {
    "id": "toan_9_c1",
    "subjectId": "toan",
    "grade": 9,
    "title": "Chương I: Phương trình và Hệ phương trình bậc nhất hai ẩn"
  },
  {
    "id": "toan_9_c3",
    "subjectId": "toan",
    "grade": 9,
    "title": "Chương III: Căn bậc hai & Căn bậc ba"
  },
  {
    "id": "toan_9_c4",
    "subjectId": "toan",
    "grade": 9,
    "title": "Chương IV: Hệ thức lượng trong tam giác vuông & Tỉ số lượng giác"
  },
  {
    "id": "toan_9_c5",
    "subjectId": "toan",
    "grade": 9,
    "title": "Chương V: Đường tròn & Góc với đường tròn"
  },
  {
    "id": "toan_9_c6",
    "subjectId": "toan",
    "grade": 9,
    "title": "Chương VI: Hàm số y = ax² & Phương trình bậc hai (Vi-ét)"
  },
  {
    "id": "van_6_c1",
    "subjectId": "van",
    "grade": 6,
    "title": "Bài 1: Tôi và các bạn (Truyện đồng thoại)"
  },
  {
    "id": "van_6_c2",
    "subjectId": "van",
    "grade": 6,
    "title": "Bài 2: Gõ cửa trái tim (Thơ)"
  },
  {
    "id": "van_6_c3",
    "subjectId": "van",
    "grade": 6,
    "title": "Bài 3: Yêu thương và chia sẻ (Truyện cổ tích & truyện ngắn)"
  },
  {
    "id": "van_6_c4",
    "subjectId": "van",
    "grade": 6,
    "title": "Bài 4: Quê hương yêu dấu (Thơ lục bát)"
  },
  {
    "id": "van_6_c5",
    "subjectId": "van",
    "grade": 6,
    "title": "Bài 5: Những nẻo đường xứ sở (Văn bản kí)"
  },
  {
    "id": "van_7_c1",
    "subjectId": "van",
    "grade": 7,
    "title": "Bài 1: Bầu trời tuổi thơ (Truyện ngắn)"
  },
  {
    "id": "van_7_c2",
    "subjectId": "van",
    "grade": 7,
    "title": "Bài 2: Khúc nhạc tâm hồn (Thơ bốn chữ, năm chữ)"
  },
  {
    "id": "van_7_c3",
    "subjectId": "van",
    "grade": 7,
    "title": "Bài 3: Cội nguồn yêu thương (Nghị luận xã hội & Tản văn)"
  },
  {
    "id": "van_8_c1",
    "subjectId": "van",
    "grade": 8,
    "title": "Bài 1: Câu chuyện của lịch sử (Truyện lịch sử)"
  },
  {
    "id": "van_8_c2",
    "subjectId": "van",
    "grade": 8,
    "title": "Bài 2: Vẻ đẹp cổ điển (Thơ Đường luật)"
  },
  {
    "id": "van_8_c3",
    "subjectId": "van",
    "grade": 8,
    "title": "Bài 3: Lời sông núi (Văn bản nghị luận trung đại)"
  },
  {
    "id": "van_9_c1",
    "subjectId": "van",
    "grade": 9,
    "title": "Bài 1: Thế giới kì ảo (Truyện truyền kì)"
  },
  {
    "id": "van_9_c2",
    "subjectId": "van",
    "grade": 9,
    "title": "Bài 2: Khát vọng cống hiến (Thơ và truyện hiện đại)"
  },
  {
    "id": "anh_6_c1",
    "subjectId": "anh",
    "grade": 6,
    "title": "Unit 1: My New School"
  },
  {
    "id": "anh_6_c2",
    "subjectId": "anh",
    "grade": 6,
    "title": "Unit 2: My House"
  },
  {
    "id": "anh_6_c3",
    "subjectId": "anh",
    "grade": 6,
    "title": "Unit 3: My Friends"
  },
  {
    "id": "anh_6_c4",
    "subjectId": "anh",
    "grade": 6,
    "title": "Unit 4: My Neighbourhood"
  },
  {
    "id": "anh_7_c1",
    "subjectId": "anh",
    "grade": 7,
    "title": "Unit 1: Hobbies"
  },
  {
    "id": "anh_7_c2",
    "subjectId": "anh",
    "grade": 7,
    "title": "Unit 2: Healthy Living"
  },
  {
    "id": "anh_7_c3",
    "subjectId": "anh",
    "grade": 7,
    "title": "Unit 3: Community Service"
  },
  {
    "id": "anh_8_c1",
    "subjectId": "anh",
    "grade": 8,
    "title": "Unit 1: Leisure Time"
  },
  {
    "id": "anh_8_c2",
    "subjectId": "anh",
    "grade": 8,
    "title": "Unit 2: Life in the Countryside"
  },
  {
    "id": "anh_9_c1",
    "subjectId": "anh",
    "grade": 9,
    "title": "Unit 1: Local Community"
  },
  {
    "id": "anh_9_c2",
    "subjectId": "anh",
    "grade": 9,
    "title": "Unit 2: City Life"
  },
  {
    "id": "khtn_6_c1",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Chủ đề 1: Các phép đo (Độ dài, khối lượng, thời gian, nhiệt độ)"
  },
  {
    "id": "khtn_6_c2",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Chủ đề 2: Các thể của chất và Sự chuyển thể"
  },
  {
    "id": "khtn_6_c3",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Chủ đề 3: Tế bào - Đơn vị cơ bản của sự sống"
  },
  {
    "id": "khtn_6_c4",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Chủ đề 4: Lực và Chuyển động"
  },
  {
    "id": "khtn_7_c1",
    "subjectId": "khtn",
    "grade": 7,
    "title": "Chủ đề 1: Nguyên tử - Nguyên tố hóa học & Bảng tuần hoàn"
  },
  {
    "id": "khtn_7_c2",
    "subjectId": "khtn",
    "grade": 7,
    "title": "Chủ đề 2: Tốc độ chuyển động (v = s/t)"
  },
  {
    "id": "khtn_7_c3",
    "subjectId": "khtn",
    "grade": 7,
    "title": "Chủ đề 3: Âm thanh & Ánh sáng (Phản xạ ánh sáng)"
  },
  {
    "id": "khtn_7_c4",
    "subjectId": "khtn",
    "grade": 7,
    "title": "Chủ đề 4: Trao đổi chất và chuyển hóa năng lượng (Quang hợp)"
  },
  {
    "id": "khtn_8_c1",
    "subjectId": "khtn",
    "grade": 8,
    "title": "Chủ đề 1: Phản ứng hóa học & Định luật bảo toàn khối lượng"
  },
  {
    "id": "khtn_8_c2",
    "subjectId": "khtn",
    "grade": 8,
    "title": "Chủ đề 2: Khối lượng riêng, Áp suất và Lực đẩy Ác-si-mét"
  },
  {
    "id": "khtn_8_c3",
    "subjectId": "khtn",
    "grade": 8,
    "title": "Chủ đề 3: Tác dụng của dòng điện & Định luật Ôm"
  },
  {
    "id": "khtn_9_c1",
    "subjectId": "khtn",
    "grade": 9,
    "title": "Chủ đề 1: Hóa học hữu cơ (Hiđrocacbon Metan, Etilen)"
  },
  {
    "id": "khtn_9_c2",
    "subjectId": "khtn",
    "grade": 9,
    "title": "Chủ đề 2: Di truyền học Men-đen & Cấu trúc ADN"
  },
  {
    "id": "lsdl_6_c1",
    "subjectId": "lsdl",
    "grade": 6,
    "title": "Chủ đề 1: Nguồn gốc loài người & Xã hội nguyên thủy"
  },
  {
    "id": "lsdl_6_c2",
    "subjectId": "lsdl",
    "grade": 6,
    "title": "Chủ đề 2: Các quốc gia cổ đại & Nước Văn Lang - Âu Lạc"
  },
  {
    "id": "lsdl_6_c3",
    "subjectId": "lsdl",
    "grade": 6,
    "title": "Chủ đề 3: Trái Đất - Hành tinh của Hệ Mặt Trời"
  },
  {
    "id": "lsdl_7_c1",
    "subjectId": "lsdl",
    "grade": 7,
    "title": "Chủ đề 1: Tây Âu thời Trung đại"
  },
  {
    "id": "lsdl_7_c2",
    "subjectId": "lsdl",
    "grade": 7,
    "title": "Chủ đề 2: Đại Việt thời Lý - Trần"
  },
  {
    "id": "lsdl_8_c1",
    "subjectId": "lsdl",
    "grade": 8,
    "title": "Chủ đề 1: Cách mạng tư sản và sự phát triển của chủ nghĩa tư bản"
  },
  {
    "id": "lsdl_8_c2",
    "subjectId": "lsdl",
    "grade": 8,
    "title": "Chủ đề 2: Phong trào Tây Sơn & Thống nhất đất nước"
  },
  {
    "id": "lsdl_9_c1",
    "subjectId": "lsdl",
    "grade": 9,
    "title": "Chủ đề 1: Thế giới từ sau năm 1945 đến nay"
  },
  {
    "id": "lsdl_9_c2",
    "subjectId": "lsdl",
    "grade": 9,
    "title": "Chủ đề 2: Việt Nam trong thời kì kháng chiến chống Pháp và Mĩ"
  },
  {
    "id": "gdcd_6_c1",
    "subjectId": "gdcd",
    "grade": 6,
    "title": "Chủ đề 1: Tự hào về truyền thống gia đình, dòng họ"
  },
  {
    "id": "gdcd_6_c2",
    "subjectId": "gdcd",
    "grade": 6,
    "title": "Chủ đề 2: Yêu thương con người & Siêng năng, kiên trì"
  },
  {
    "id": "gdcd_7_c1",
    "subjectId": "gdcd",
    "grade": 7,
    "title": "Chủ đề 1: Tự hào về truyền thống quê hương"
  },
  {
    "id": "gdcd_7_c2",
    "subjectId": "gdcd",
    "grade": 7,
    "title": "Chủ đề 2: Bảo tồn di sản văn hóa"
  },
  {
    "id": "gdcd_8_c1",
    "subjectId": "gdcd",
    "grade": 8,
    "title": "Chủ đề 1: Tự hào về truyền thống dân tộc Việt Nam"
  },
  {
    "id": "gdcd_8_c2",
    "subjectId": "gdcd",
    "grade": 8,
    "title": "Chủ đề 2: Phòng, chống bạo lực học đường"
  },
  {
    "id": "gdcd_9_c1",
    "subjectId": "gdcd",
    "grade": 9,
    "title": "Chủ đề 1: Sống có lý tưởng & Trách nhiệm của thanh niên"
  },
  {
    "id": "gdcd_9_c2",
    "subjectId": "gdcd",
    "grade": 9,
    "title": "Chủ đề 2: Bảo vệ hòa bình và Hợp tác quốc tế"
  },
  {
    "id": "congnghe_6_c1",
    "subjectId": "congnghe",
    "grade": 6,
    "title": "Chương 1: Nhà ở & Ngôi nhà thông minh"
  },
  {
    "id": "congnghe_6_c2",
    "subjectId": "congnghe",
    "grade": 6,
    "title": "Chương 2: Bảo quản và chế biến thực phẩm"
  },
  {
    "id": "congnghe_7_c1",
    "subjectId": "congnghe",
    "grade": 7,
    "title": "Chương 1: Trồng trọt và Bảo vệ cây trồng"
  },
  {
    "id": "congnghe_7_c2",
    "subjectId": "congnghe",
    "grade": 7,
    "title": "Chương 2: Chăn nuôi và Thủy sản"
  },
  {
    "id": "congnghe_8_c1",
    "subjectId": "congnghe",
    "grade": 8,
    "title": "Chương 1: Vẽ kĩ thuật cơ bản"
  },
  {
    "id": "congnghe_8_c2",
    "subjectId": "congnghe",
    "grade": 8,
    "title": "Chương 2: Cơ khí và Gia công cơ khí"
  },
  {
    "id": "congnghe_9_c1",
    "subjectId": "congnghe",
    "grade": 9,
    "title": "Chương 1: Mạng điện trong nhà & An toàn điện"
  },
  {
    "id": "congnghe_9_c2",
    "subjectId": "congnghe",
    "grade": 9,
    "title": "Chương 2: Định hướng nghề nghiệp công nghệ"
  }
];

const DEFAULT_LESSONS = [
  {
    "id": "tin_6_b1",
    "chapterId": "tin_6_c1",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 1: Thông tin và dữ liệu (Thông tin, Dữ liệu, Vật mang tin)"
  },
  {
    "id": "tin_6_b2",
    "chapterId": "tin_6_c1",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 2: Lưu trữ và trao đổi thông tin (Bit, Byte, KB, MB, GB, TB)"
  },
  {
    "id": "tin_6_b3",
    "chapterId": "tin_6_c1",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 3: Máy tính trong hoạt động thông tin (Thiết bị vào - ra, CPU, RAM)"
  },
  {
    "id": "tin_6_b4",
    "chapterId": "tin_6_c2",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 4: Mạng máy tính (Khái niệm mạng, Dây cáp, Switch, Wi-Fi Router)"
  },
  {
    "id": "tin_6_b5",
    "chapterId": "tin_6_c2",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 5: Internet (World Wide Web, Trình duyệt web, Tìm kiếm)"
  },
  {
    "id": "tin_6_b6",
    "chapterId": "tin_6_c3",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 6: Thư điện tử (Email) (Địa chỉ email, Gửi nhận thư điện tử)"
  },
  {
    "id": "tin_6_b7",
    "chapterId": "tin_6_c3",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 7: Tìm kiếm thông tin trên Internet (Từ khóa tìm kiếm)"
  },
  {
    "id": "tin_6_b8",
    "chapterId": "tin_6_c4",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 8: An toàn thông tin và văn hóa ứng xử trên mạng (Mật khẩu mạnh, Bản quyền)"
  },
  {
    "id": "tin_6_b9",
    "chapterId": "tin_6_c5",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 9: Soạn thảo văn bản cơ bản (Định dạng ký tự, đoạn văn, hình ảnh)"
  },
  {
    "id": "tin_6_b10",
    "chapterId": "tin_6_c5",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 10: Sơ đồ tư duy và Trình chiếu cơ bản"
  },
  {
    "id": "tin_6_b11",
    "chapterId": "tin_6_c6",
    "subjectId": "tin",
    "grade": 6,
    "title": "Bài 11: Thuật toán và mô tả thuật toán (Sơ đồ khối: Elip, Chữ nhật, Thoi)"
  },
  {
    "id": "tin_7_b1",
    "chapterId": "tin_7_c1",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 1: Thiết bị vào và thiết bị ra (Bàn phím, chuột, màn hình, máy in)"
  },
  {
    "id": "tin_7_b2",
    "chapterId": "tin_7_c1",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 2: Phần mềm ứng dụng và hệ điều hành (Windows, Android, iOS)"
  },
  {
    "id": "tin_7_b3",
    "chapterId": "tin_7_c2",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 3: Quản lý dữ liệu trong máy tính (Tệp tin và thư mục)"
  },
  {
    "id": "tin_7_b4",
    "chapterId": "tin_7_c2",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 4: Mạng xã hội và giao tiếp trên Internet"
  },
  {
    "id": "tin_7_b5",
    "chapterId": "tin_7_c4",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 5: Làm quen với bảng tính điện tử (Ô tính, hàng, cột)"
  },
  {
    "id": "tin_7_b6",
    "chapterId": "tin_7_c4",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 6: Các hàm cơ bản trong bảng tính (SUM, AVERAGE, MIN, MAX, COUNT)"
  },
  {
    "id": "tin_7_b7",
    "chapterId": "tin_7_c4",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 7: Trình bày và định dạng bảng tính"
  },
  {
    "id": "tin_7_b8",
    "chapterId": "tin_7_c4",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 8: Tạo biểu đồ trong bảng tính (Biểu đồ cột, hình quạt tròn)"
  },
  {
    "id": "tin_7_b9",
    "chapterId": "tin_7_c5",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 9: Thuật toán tìm kiếm tuần tự (Linear Search)"
  },
  {
    "id": "tin_7_b10",
    "chapterId": "tin_7_c5",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 10: Thuật toán tìm kiếm nhị phân (Binary Search)"
  },
  {
    "id": "tin_7_b11",
    "chapterId": "tin_7_c5",
    "subjectId": "tin",
    "grade": 7,
    "title": "Bài 11: Thuật toán sắp xếp nổi bọt (Bubble Sort)"
  },
  {
    "id": "tin_8_b1",
    "chapterId": "tin_8_c1",
    "subjectId": "tin",
    "grade": 8,
    "title": "Bài 1: Lịch sử phát triển máy tính (Các thế hệ máy tính)"
  },
  {
    "id": "tin_8_b2",
    "chapterId": "tin_8_c1",
    "subjectId": "tin",
    "grade": 8,
    "title": "Bài 2: Thông tin trong môi trường số & Đạo đức, bản quyền"
  },
  {
    "id": "tin_8_b3",
    "chapterId": "tin_8_c4",
    "subjectId": "tin",
    "grade": 8,
    "title": "Bài 3: Hàm điều kiện IF và Lọc dữ liệu Filter trong Excel"
  },
  {
    "id": "tin_8_b4",
    "chapterId": "tin_8_c4",
    "subjectId": "tin",
    "grade": 8,
    "title": "Bài 4: Trình bày và liên kết dữ liệu Hyperlink"
  },
  {
    "id": "tin_8_b5",
    "chapterId": "tin_8_c5",
    "subjectId": "tin",
    "grade": 8,
    "title": "Bài 5: Biến và kiểu dữ liệu trong lập trình trực quan"
  },
  {
    "id": "tin_8_b6",
    "chapterId": "tin_8_c5",
    "subjectId": "tin",
    "grade": 8,
    "title": "Bài 6: Cấu trúc rẽ nhánh trong lập trình (IF, IF-ELSE)"
  },
  {
    "id": "tin_8_b7",
    "chapterId": "tin_8_c5",
    "subjectId": "tin",
    "grade": 8,
    "title": "Bài 7: Cấu trúc lặp trong lập trình (FOR, WHILE)"
  },
  {
    "id": "tin_9_b1",
    "chapterId": "tin_9_c1",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 1: Thế giới kĩ thuật số"
  },
  {
    "id": "tin_9_b2",
    "chapterId": "tin_9_c1",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 2: Thông tin trong giải quyết vấn đề"
  },
  {
    "id": "tin_9_b3",
    "chapterId": "tin_9_c1",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 3: Thực hành: Đánh giá chất lượng thông tin"
  },
  {
    "id": "tin_9_b4",
    "chapterId": "tin_9_c1",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 4: Một số vấn đề pháp lí về sử dụng dịch vụ Internet"
  },
  {
    "id": "tin_9_b5",
    "chapterId": "tin_9_c2",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 5: Tìm hiểu phần mềm mô phỏng"
  },
  {
    "id": "tin_9_b6",
    "chapterId": "tin_9_c2",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 6: Thực hành phần mềm mô phỏng"
  },
  {
    "id": "tin_9_b7",
    "chapterId": "tin_9_c3",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 7: Trình bày thông tin trong trao đổi và hợp tác"
  },
  {
    "id": "tin_9_b8",
    "chapterId": "tin_9_c3",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 8: Thực hành sử dụng công cụ trực quan"
  },
  {
    "id": "tin_9_b9",
    "chapterId": "tin_9_c4",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 9: Sử dụng công cụ xác thực dữ liệu"
  },
  {
    "id": "tin_9_b10",
    "chapterId": "tin_9_c4",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 10: Sử dụng hàm COUNTIF"
  },
  {
    "id": "tin_9_b11",
    "chapterId": "tin_9_c4",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 11: Dịch vụ lưu trữ đám mây"
  },
  {
    "id": "tin_9_b12",
    "chapterId": "tin_9_c4",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 12: Đạo đức trong môi trường số"
  },
  {
    "id": "tin_9_b13",
    "chapterId": "tin_9_c4",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 13: Lập trình với ngôn ngữ Python"
  },
  {
    "id": "tin_9_b14",
    "chapterId": "tin_9_c4",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 14: Cấu trúc điều khiển và kiểu dữ liệu mảng"
  },
  {
    "id": "tin_9_b15",
    "chapterId": "tin_9_c5",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 15: Nghề nghiệp trong lĩnh vực công nghệ thông tin"
  },
  {
    "id": "tin_9_b16",
    "chapterId": "tin_9_c5",
    "subjectId": "tin",
    "grade": 9,
    "title": "Bài 16: Dự án nghề nghiệp số"
  },
  {
    "id": "toan_6_b1",
    "chapterId": "toan_6_c1",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 1: Tập hợp các số tự nhiên & Thứ tự thực hiện phép tính"
  },
  {
    "id": "toan_6_b2",
    "chapterId": "toan_6_c1",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 2: Lũy thừa với số mũ tự nhiên"
  },
  {
    "id": "toan_6_b3",
    "chapterId": "toan_6_c1",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 3: Dấu hiệu chia hết cho 2, 5, 3, 9"
  },
  {
    "id": "toan_6_b4",
    "chapterId": "toan_6_c2",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 4: Ước và Bội, Số nguyên tố"
  },
  {
    "id": "toan_6_b5",
    "chapterId": "toan_6_c2",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 5: Ước chung lớn nhất & Bội chung nhỏ nhất"
  },
  {
    "id": "toan_6_b6",
    "chapterId": "toan_6_c3",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 6: Số nguyên âm & Tập hợp các số nguyên Z"
  },
  {
    "id": "toan_6_b7",
    "chapterId": "toan_6_c3",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 7: Phép cộng, trừ, nhân hai số nguyên"
  },
  {
    "id": "toan_6_b8",
    "chapterId": "toan_6_c3",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 8: Quy tắc dấu ngoặc và Chuyển vế"
  },
  {
    "id": "toan_6_b9",
    "chapterId": "toan_6_c4",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 9: Tam giác đều, hình vuông, lục giác đều"
  },
  {
    "id": "toan_6_b10",
    "chapterId": "toan_6_c4",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 10: Hình chữ nhật, hình thoi, hình bình hành, hình thang cân"
  },
  {
    "id": "toan_6_b11",
    "chapterId": "toan_6_c4",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 11: Chu vi và diện tích các hình phẳng trong thực tế"
  },
  {
    "id": "toan_6_b12",
    "chapterId": "toan_6_c5",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 12: Trục đối xứng và Tâm đối xứng"
  },
  {
    "id": "toan_6_b13",
    "chapterId": "toan_6_c6",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 13: Phân số bằng nhau, Rút gọn phân số"
  },
  {
    "id": "toan_6_b14",
    "chapterId": "toan_6_c6",
    "subjectId": "toan",
    "grade": 6,
    "title": "Bài 14: Các phép tính với phân số và số thập phân"
  },
  {
    "id": "toan_7_b1",
    "chapterId": "toan_7_c1",
    "subjectId": "toan",
    "grade": 7,
    "title": "Bài 1: Tập hợp các số hữu tỉ và Phép tính số hữu tỉ Q"
  },
  {
    "id": "toan_7_b2",
    "chapterId": "toan_7_c1",
    "subjectId": "toan",
    "grade": 7,
    "title": "Bài 2: Lũy thừa với số mũ tự nhiên của số hữu tỉ"
  },
  {
    "id": "toan_7_b3",
    "chapterId": "toan_7_c2",
    "subjectId": "toan",
    "grade": 7,
    "title": "Bài 3: Số vô tỉ và Căn bậc hai số học"
  },
  {
    "id": "toan_7_b4",
    "chapterId": "toan_7_c2",
    "subjectId": "toan",
    "grade": 7,
    "title": "Bài 4: Tập hợp số thực R và Làm tròn số"
  },
  {
    "id": "toan_7_b5",
    "chapterId": "toan_7_c3",
    "subjectId": "toan",
    "grade": 7,
    "title": "Bài 5: Góc kề bù, đối đỉnh, so le trong, đồng vị"
  },
  {
    "id": "toan_7_b6",
    "chapterId": "toan_7_c3",
    "subjectId": "toan",
    "grade": 7,
    "title": "Bài 6: Định lí và chứng minh định lí song song"
  },
  {
    "id": "toan_7_b7",
    "chapterId": "toan_7_c4",
    "subjectId": "toan",
    "grade": 7,
    "title": "Bài 7: Tổng ba góc trong một tam giác"
  },
  {
    "id": "toan_7_b8",
    "chapterId": "toan_7_c4",
    "subjectId": "toan",
    "grade": 7,
    "title": "Bài 8: Các trường hợp bằng nhau của tam giác"
  },
  {
    "id": "toan_7_b9",
    "chapterId": "toan_7_c4",
    "subjectId": "toan",
    "grade": 7,
    "title": "Bài 9: Tam giác cân và Định lí Py-ta-go"
  },
  {
    "id": "toan_8_b1",
    "chapterId": "toan_8_c1",
    "subjectId": "toan",
    "grade": 8,
    "title": "Bài 1: Đơn thức và đa thức nhiều biến"
  },
  {
    "id": "toan_8_b2",
    "chapterId": "toan_8_c1",
    "subjectId": "toan",
    "grade": 8,
    "title": "Bài 2: Các phép tính cộng trừ nhân chia đa thức"
  },
  {
    "id": "toan_8_b3",
    "chapterId": "toan_8_c2",
    "subjectId": "toan",
    "grade": 8,
    "title": "Bài 3: 7 Hằng đẳng thức đáng nhớ"
  },
  {
    "id": "toan_8_b4",
    "chapterId": "toan_8_c2",
    "subjectId": "toan",
    "grade": 8,
    "title": "Bài 4: Phân tích đa thức thành nhân tử"
  },
  {
    "id": "toan_8_b5",
    "chapterId": "toan_8_c3",
    "subjectId": "toan",
    "grade": 8,
    "title": "Bài 5: Tứ giác (Hình thang cân, Hình bình hành, Hình chữ nhật)"
  },
  {
    "id": "toan_8_b6",
    "chapterId": "toan_8_c3",
    "subjectId": "toan",
    "grade": 8,
    "title": "Bài 6: Hình thoi và Hình vuông"
  },
  {
    "id": "toan_8_b7",
    "chapterId": "toan_8_c4",
    "subjectId": "toan",
    "grade": 8,
    "title": "Bài 7: Định lí Thalès trong tam giác"
  },
  {
    "id": "toan_8_b8",
    "chapterId": "toan_8_c4",
    "subjectId": "toan",
    "grade": 8,
    "title": "Bài 8: Tam giác đồng dạng"
  },
  {
    "id": "toan_9_b1",
    "chapterId": "toan_9_c1",
    "subjectId": "toan",
    "grade": 9,
    "title": "Bài 1: Phương trình bậc nhất hai ẩn & Hệ phương trình"
  },
  {
    "id": "toan_9_b2",
    "chapterId": "toan_9_c1",
    "subjectId": "toan",
    "grade": 9,
    "title": "Bài 2: Giải hệ phương trình (Phương pháp thế & Cộng đại số)"
  },
  {
    "id": "toan_9_b3",
    "chapterId": "toan_9_c3",
    "subjectId": "toan",
    "grade": 9,
    "title": "Bài 3: Căn bậc hai & Căn thức bậc hai"
  },
  {
    "id": "toan_9_b4",
    "chapterId": "toan_9_c3",
    "subjectId": "toan",
    "grade": 9,
    "title": "Bài 4: Các phép biến đổi biểu thức chứa căn"
  },
  {
    "id": "toan_9_b5",
    "chapterId": "toan_9_c4",
    "subjectId": "toan",
    "grade": 9,
    "title": "Bài 5: Tỉ số lượng giác góc nhọn (sin, cos, tan, cot)"
  },
  {
    "id": "toan_9_b6",
    "chapterId": "toan_9_c4",
    "subjectId": "toan",
    "grade": 9,
    "title": "Bài 6: Hệ thức lượng trong tam giác vuông"
  },
  {
    "id": "toan_9_b7",
    "chapterId": "toan_9_c6",
    "subjectId": "toan",
    "grade": 9,
    "title": "Bài 7: Phương trình bậc hai một ẩn ax² + bx + c = 0"
  },
  {
    "id": "toan_9_b8",
    "chapterId": "toan_9_c6",
    "subjectId": "toan",
    "grade": 9,
    "title": "Bài 8: Định lí Vi-ét và Ứng dụng tính nhẩm nghiệm"
  },
  {
    "id": "van_6_b1",
    "chapterId": "van_6_c1",
    "subjectId": "van",
    "grade": 6,
    "title": "Đọc hiểu: Bài học đường đời đầu tiên (Dế Mèn - Tô Hoài)"
  },
  {
    "id": "van_6_b2",
    "chapterId": "van_6_c1",
    "subjectId": "van",
    "grade": 6,
    "title": "Thực hành Tiếng Việt: Từ đơn, từ phức, từ láy"
  },
  {
    "id": "van_6_b3",
    "chapterId": "van_6_c2",
    "subjectId": "van",
    "grade": 6,
    "title": "Đọc hiểu: Chuyện cổ tích về loài người (Xuân Quỳnh)"
  },
  {
    "id": "van_6_b4",
    "chapterId": "van_6_c2",
    "subjectId": "van",
    "grade": 6,
    "title": "Thực hành Tiếng Việt: Biện pháp tu từ so sánh, điệp từ"
  },
  {
    "id": "van_6_b5",
    "chapterId": "van_6_c3",
    "subjectId": "van",
    "grade": 6,
    "title": "Đọc hiểu: Cô bé bán diêm (An-đéc-xen)"
  },
  {
    "id": "van_6_b6",
    "chapterId": "van_6_c3",
    "subjectId": "van",
    "grade": 6,
    "title": "Thực hành Tiếng Việt: Cụm danh từ, cụm động từ"
  },
  {
    "id": "van_6_b7",
    "chapterId": "van_6_c4",
    "subjectId": "van",
    "grade": 6,
    "title": "Đọc hiểu: Hoa bìm & Ca dao quê hương"
  },
  {
    "id": "van_6_b8",
    "chapterId": "van_6_c4",
    "subjectId": "van",
    "grade": 6,
    "title": "Thực hành Tiếng Việt: Thơ lục bát, vần chân, vần lưng"
  },
  {
    "id": "van_7_b1",
    "chapterId": "van_7_c1",
    "subjectId": "van",
    "grade": 7,
    "title": "Đọc hiểu: Bầy chim chìa vôi (Nguyễn Quang Thiều)"
  },
  {
    "id": "van_7_b2",
    "chapterId": "van_7_c1",
    "subjectId": "van",
    "grade": 7,
    "title": "Thực hành Tiếng Việt: Mở rộng trạng ngữ trong câu"
  },
  {
    "id": "van_7_b3",
    "chapterId": "van_7_c2",
    "subjectId": "van",
    "grade": 7,
    "title": "Đọc hiểu: Đồng dao mùa xuân (Nguyễn Khoa Điềm)"
  },
  {
    "id": "van_7_b4",
    "chapterId": "van_7_c2",
    "subjectId": "van",
    "grade": 7,
    "title": "Thực hành Tiếng Việt: Thơ bốn chữ, năm chữ & Ngắt nhịp"
  },
  {
    "id": "van_8_b1",
    "chapterId": "van_8_c1",
    "subjectId": "van",
    "grade": 8,
    "title": "Đọc hiểu: Lá cờ thêu sáu chữ vàng (Nguyễn Huy Tưởng)"
  },
  {
    "id": "van_8_b2",
    "chapterId": "van_8_c2",
    "subjectId": "van",
    "grade": 8,
    "title": "Đọc hiểu: Thu điếu (Nguyễn Khuyến)"
  },
  {
    "id": "van_8_b3",
    "chapterId": "van_8_c3",
    "subjectId": "van",
    "grade": 8,
    "title": "Đọc hiểu: Chiếu dời đô (Lý Công Uẩn)"
  },
  {
    "id": "van_9_b1",
    "chapterId": "van_9_c1",
    "subjectId": "van",
    "grade": 9,
    "title": "Đọc hiểu: Chuyện người con gái Nam Xương (Nguyễn Dữ)"
  },
  {
    "id": "van_9_b2",
    "chapterId": "van_9_c2",
    "subjectId": "van",
    "grade": 9,
    "title": "Đọc hiểu: Mùa xuân nho nhỏ (Thanh Hải)"
  },
  {
    "id": "anh_6_b1",
    "chapterId": "anh_6_c1",
    "subjectId": "anh",
    "grade": 6,
    "title": "Unit 1: My New School - Present Simple & Adverbs of frequency"
  },
  {
    "id": "anh_6_b2",
    "chapterId": "anh_6_c2",
    "subjectId": "anh",
    "grade": 6,
    "title": "Unit 2: My House - Prepositions of place & Rooms"
  },
  {
    "id": "anh_6_b3",
    "chapterId": "anh_6_c3",
    "subjectId": "anh",
    "grade": 6,
    "title": "Unit 3: My Friends - Personality adjectives & Appearances"
  },
  {
    "id": "anh_6_b4",
    "chapterId": "anh_6_c4",
    "subjectId": "anh",
    "grade": 6,
    "title": "Unit 4: My Neighbourhood - Comparative adjectives"
  },
  {
    "id": "anh_7_b1",
    "chapterId": "anh_7_c1",
    "subjectId": "anh",
    "grade": 7,
    "title": "Unit 1: Hobbies - Verbs of liking & Present Simple"
  },
  {
    "id": "anh_7_b2",
    "chapterId": "anh_7_c2",
    "subjectId": "anh",
    "grade": 7,
    "title": "Unit 2: Healthy Living - Simple sentences & Health advice"
  },
  {
    "id": "anh_7_b3",
    "chapterId": "anh_7_c3",
    "subjectId": "anh",
    "grade": 7,
    "title": "Unit 3: Community Service - Past Simple & Volunteer activities"
  },
  {
    "id": "anh_8_b1",
    "chapterId": "anh_8_c1",
    "subjectId": "anh",
    "grade": 8,
    "title": "Unit 1: Leisure Time - Verbs of preference + Gerunds / To-infinitives"
  },
  {
    "id": "anh_8_b2",
    "chapterId": "anh_8_c2",
    "subjectId": "anh",
    "grade": 8,
    "title": "Unit 2: Life in the Countryside - Comparative forms of adverbs"
  },
  {
    "id": "anh_9_b1",
    "chapterId": "anh_9_c1",
    "subjectId": "anh",
    "grade": 9,
    "title": "Unit 1: Local Community - Question words before to-infinitives & Phrasal verbs"
  },
  {
    "id": "anh_9_b2",
    "chapterId": "anh_9_c2",
    "subjectId": "anh",
    "grade": 9,
    "title": "Unit 2: City Life - Double comparatives (The more... the more...)"
  },
  {
    "id": "khtn_6_b1",
    "chapterId": "khtn_6_c1",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Bài 1: Các phép đo (Dụng cụ đo, GHĐ, ĐCNN, Độ dài, Khối lượng)"
  },
  {
    "id": "khtn_6_b2",
    "chapterId": "khtn_6_c2",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Bài 2: Các thể của chất (Rắn, Lỏng, Khí & Nóng chảy, Bay hơi)"
  },
  {
    "id": "khtn_6_b3",
    "chapterId": "khtn_6_c3",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Bài 3: Tế bào - Đơn vị cơ bản của sự sống (Màng sinh chất, nhân)"
  },
  {
    "id": "khtn_6_b4",
    "chapterId": "khtn_6_c3",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Bài 4: Tế bào nhân thực & nhân sơ; Tế bào thực vật & động vật"
  },
  {
    "id": "khtn_6_b5",
    "chapterId": "khtn_6_c4",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Bài 5: Lực và tác dụng của lực (Lực tiếp xúc, Lực không tiếp xúc, Trọng lực)"
  },
  {
    "id": "khtn_6_b6",
    "chapterId": "khtn_6_c4",
    "subjectId": "khtn",
    "grade": 6,
    "title": "Bài 6: Lực ma sát và lực cản trong đời sống"
  },
  {
    "id": "khtn_7_b1",
    "chapterId": "khtn_7_c1",
    "subjectId": "khtn",
    "grade": 7,
    "title": "Bài 1: Nguyên tử và cấu tạo nguyên tử (Proton, nơtron, electron)"
  },
  {
    "id": "khtn_7_b2",
    "chapterId": "khtn_7_c2",
    "subjectId": "khtn",
    "grade": 7,
    "title": "Bài 2: Tốc độ chuyển động (Công thức v = s/t)"
  },
  {
    "id": "khtn_7_b3",
    "chapterId": "khtn_7_c3",
    "subjectId": "khtn",
    "grade": 7,
    "title": "Bài 3: Phản xạ ánh sáng và Định luật phản xạ ánh sáng"
  },
  {
    "id": "khtn_7_b4",
    "chapterId": "khtn_7_c4",
    "subjectId": "khtn",
    "grade": 7,
    "title": "Bài 4: Quang hợp ở thực vật (Phương trình quang hợp & các yếu tố)"
  },
  {
    "id": "khtn_8_b1",
    "chapterId": "khtn_8_c1",
    "subjectId": "khtn",
    "grade": 8,
    "title": "Bài 1: Phản ứng hóa học và Định luật bảo toàn khối lượng"
  },
  {
    "id": "khtn_8_b2",
    "chapterId": "khtn_8_c2",
    "subjectId": "khtn",
    "grade": 8,
    "title": "Bài 2: Khối lượng riêng và Áp suất chất lỏng"
  },
  {
    "id": "khtn_8_b3",
    "chapterId": "khtn_8_c3",
    "subjectId": "khtn",
    "grade": 8,
    "title": "Bài 3: Dòng điện, nguồn điện và Mạch điện cơ bản"
  },
  {
    "id": "khtn_9_b1",
    "chapterId": "khtn_9_c1",
    "subjectId": "khtn",
    "grade": 9,
    "title": "Bài 1: Hiđrocacbon: Metan (CH4) và Etilen (C2H4)"
  },
  {
    "id": "khtn_9_b2",
    "chapterId": "khtn_9_c2",
    "subjectId": "khtn",
    "grade": 9,
    "title": "Bài 2: Các thí nghiệm của Men-đen và Cấu trúc phân tử ADN"
  },
  {
    "id": "lsdl_6_b1",
    "chapterId": "lsdl_6_c1",
    "subjectId": "lsdl",
    "grade": 6,
    "title": "Bài 1: Lịch sử và cuộc sống (Ý nghĩa của việc học lịch sử)"
  },
  {
    "id": "lsdl_6_b2",
    "chapterId": "lsdl_6_c1",
    "subjectId": "lsdl",
    "grade": 6,
    "title": "Bài 2: Nguồn gốc loài người (Quá trình tiến hóa vượn người thành người)"
  },
  {
    "id": "lsdl_6_b3",
    "chapterId": "lsdl_6_c2",
    "subjectId": "lsdl",
    "grade": 6,
    "title": "Bài 3: Nhà nước Văn Lang - Âu Lạc (Thời đại Hùng Vương & An Dương Vương)"
  },
  {
    "id": "lsdl_6_b4",
    "chapterId": "lsdl_6_c3",
    "subjectId": "lsdl",
    "grade": 6,
    "title": "Bài 4: Trái Đất trong hệ Mặt Trời & Kinh độ, Vĩ độ, Bản đồ địa lý"
  },
  {
    "id": "lsdl_7_b1",
    "chapterId": "lsdl_7_c1",
    "subjectId": "lsdl",
    "grade": 7,
    "title": "Bài 1: Quá trình hình thành và phát triển của chế độ phong kiến Tây Âu"
  },
  {
    "id": "lsdl_7_b2",
    "chapterId": "lsdl_7_c2",
    "subjectId": "lsdl",
    "grade": 7,
    "title": "Bài 2: Ba lần kháng chiến chống quân xâm lược Mông - Nguyên thời Trần"
  },
  {
    "id": "lsdl_8_b1",
    "chapterId": "lsdl_8_c2",
    "subjectId": "lsdl",
    "grade": 8,
    "title": "Bài 1: Khởi nghĩa Tây Sơn và đại thắng quân Thanh năm 1789"
  },
  {
    "id": "lsdl_9_b1",
    "chapterId": "lsdl_9_c2",
    "subjectId": "lsdl",
    "grade": 9,
    "title": "Bài 1: Chiến dịch Điện Biên Phủ 1954 lừng lẫy năm châu"
  },
  {
    "id": "gdcd_6_b1",
    "chapterId": "gdcd_6_c1",
    "subjectId": "gdcd",
    "grade": 6,
    "title": "Bài 1: Tự hào về truyền thống gia đình, dòng họ"
  },
  {
    "id": "gdcd_6_b2",
    "chapterId": "gdcd_6_c2",
    "subjectId": "gdcd",
    "grade": 6,
    "title": "Bài 2: Yêu thương con người và Tôn trọng sự thật"
  },
  {
    "id": "gdcd_7_b1",
    "chapterId": "gdcd_7_c1",
    "subjectId": "gdcd",
    "grade": 7,
    "title": "Bài 1: Tự hào về truyền thống quê hương và Di sản văn hóa"
  },
  {
    "id": "gdcd_8_b1",
    "chapterId": "gdcd_8_c2",
    "subjectId": "gdcd",
    "grade": 8,
    "title": "Bài 1: Phòng, chống bạo lực học đường và Tuân thủ pháp luật"
  },
  {
    "id": "gdcd_9_b1",
    "chapterId": "gdcd_9_c1",
    "subjectId": "gdcd",
    "grade": 9,
    "title": "Bài 1: Lý tưởng sống của thanh niên và Trách nhiệm công dân"
  },
  {
    "id": "congnghe_6_b1",
    "chapterId": "congnghe_6_c1",
    "subjectId": "congnghe",
    "grade": 6,
    "title": "Bài 1: Khái quát về nhà ở và Ngôi nhà thông minh (Smart Home)"
  },
  {
    "id": "congnghe_6_b2",
    "chapterId": "congnghe_6_c2",
    "subjectId": "congnghe",
    "grade": 6,
    "title": "Bài 2: Sử dụng và bảo quản thực phẩm an toàn trong gia đình"
  },
  {
    "id": "congnghe_7_b1",
    "chapterId": "congnghe_7_c1",
    "subjectId": "congnghe",
    "grade": 7,
    "title": "Bài 1: Giới thiệu về trồng trọt và Đất trồng cây nông nghiệp"
  },
  {
    "id": "congnghe_8_b1",
    "chapterId": "congnghe_8_c1",
    "subjectId": "congnghe",
    "grade": 8,
    "title": "Bài 1: Tiêu chuẩn bản vẽ kĩ thuật và Hình chiếu vuông góc"
  },
  {
    "id": "congnghe_9_b1",
    "chapterId": "congnghe_9_c1",
    "subjectId": "congnghe",
    "grade": 9,
    "title": "Bài 1: Dụng cụ đo kiểm điện và Lắp đặt mạch điện gia đình cơ bản"
  }
];

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
      if (this.state.users) {
        this.state.users = this.state.users.filter(u => String(u.id) !== tId && String(u.id) !== `t_${tId}` && String(u.refId) !== tId);
      }
      this.save();
      this.syncAllUsersFromEntities();
    }
  }

  deleteTeachersBatch(ids) {
    const idSet = new Set(ids.map(id => String(id)));
    if (this.state.teachers) {
      this.state.teachers = this.state.teachers.filter(t => !idSet.has(String(t.id)));
      if (this.state.users) {
        this.state.users = this.state.users.filter(u => !idSet.has(String(u.id)) && !idSet.has(String(u.refId)));
      }
      this.save();
      this.syncAllUsersFromEntities();
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
          const mergeArray = (key) => {
            if (this.state && Array.isArray(this.state[key]) && this.state[key].length > 0) {
              if (!Array.isArray(remoteState[key]) || remoteState[key].length === 0) {
                remoteState[key] = this.state[key];
              } else {
                const map = new Map();
                remoteState[key].forEach(item => { if (item && item.id) map.set(String(item.id), item); });
                this.state[key].forEach(item => {
                  if (item && item.id && !map.has(String(item.id))) {
                    remoteState[key].push(item);
                    map.set(String(item.id), item);
                  }
                });
              }
            } else if (!Array.isArray(remoteState[key])) {
              remoteState[key] = Array.isArray(this.state && this.state[key]) ? this.state[key] : (INITIAL_STATE[key] ? JSON.parse(JSON.stringify(INITIAL_STATE[key])) : []);
            }
          };

          ['teachers', 'students', 'parents', 'classesList', 'exams', 'questions', 'assignments', 'submissions', 'lessons', 'uploadedFiles', 'users'].forEach(k => mergeArray(k));

          // Đảm bảo không bao giờ bị mất danh mục môn học, năm học, khối lớp
          Object.keys(INITIAL_STATE).forEach(key => {
            if (!remoteState[key] || (Array.isArray(INITIAL_STATE[key]) && Array.isArray(remoteState[key]) && remoteState[key].length === 0 && INITIAL_STATE[key].length > 0)) {
              remoteState[key] = JSON.parse(JSON.stringify(INITIAL_STATE[key]));
            }
          });

          this.state = remoteState;
          this.initUserGroupsAndPermissions();
          try { localStorage.setItem(DB_KEY, JSON.stringify(this.state)); } catch(e) {}
          console.log('✅ LMS Central Database synchronized safely from Server across all devices!');
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
    this.syncAllUsersFromEntities();
  }

  syncAllUsersFromEntities() {
    if (!this.state) this.state = {};
    if (!this.state.users) this.state.users = [];

    const existingUsers = this.state.users;
    const userMap = new Map();

    // 1. Giữ lại các tài khoản quản trị hệ thống / users hiện có
    existingUsers.forEach(u => {
      if (u && (u.id || u.username)) {
        const key = String(u.id || u.username);
        userMap.set(key, u);
        if (u.username) userMap.set(String(u.username), u);
        if (u.refId) userMap.set(String(u.refId), u);
      }
    });

    // 2. Đồng bộ từ Giáo viên (teachers)
    const teachers = this.state.teachers || [];
    teachers.forEach((t, idx) => {
      const uid = t.id ? (String(t.id).startsWith('usr_') || String(t.id).startsWith('t_') ? String(t.id) : `t_${t.id}`) : `t_${t.username || idx}`;
      const existing = userMap.get(uid) || userMap.get(String(t.id)) || userMap.get(String(t.username));
      const userObj = {
        id: existing ? existing.id : uid,
        name: t.name || 'Giáo viên',
        username: t.username || `thcsamtl_${t.id || 'gv_' + idx}`,
        groupId: t.groupId || (t.role === 'bgh' ? 'bgh' : t.role === 'totruong' ? 'totruong' : 'giaovien'),
        status: existing ? (existing.status || 'active') : (t.status || 'active'),
        phone: t.phone || '',
        email: t.email || '',
        sourceType: 'teacher',
        refId: t.id
      };
      userMap.set(String(userObj.id), userObj);
      if (t.username) userMap.set(String(t.username), userObj);
      if (t.id) userMap.set(String(t.id), userObj);
    });

    // 3. Đồng bộ từ Học sinh (students)
    const students = this.state.students || [];
    students.forEach((s, idx) => {
      const uid = s.id ? (String(s.id).startsWith('usr_') || String(s.id).startsWith('s_') ? String(s.id) : `s_${s.id}`) : `s_${s.username || idx}`;
      const existing = userMap.get(uid) || userMap.get(String(s.id)) || userMap.get(String(s.username));
      const userObj = {
        id: existing ? existing.id : uid,
        name: s.name || 'Học sinh',
        username: s.username || `thcsamtl_${s.id || 'hs_' + idx}`,
        groupId: 'hocsinh',
        status: existing ? (existing.status || 'active') : (s.status || 'active'),
        phone: s.phone || '',
        email: s.email || '',
        classId: s.classId || '',
        sourceType: 'student',
        refId: s.id
      };
      userMap.set(String(userObj.id), userObj);
      if (s.username) userMap.set(String(s.username), userObj);
      if (s.id) userMap.set(String(s.id), userObj);
    });

    // 4. Đồng bộ từ Phụ huynh (parents)
    const parents = this.state.parents || [];
    parents.forEach((p, idx) => {
      const uid = p.id ? (String(p.id).startsWith('usr_') || String(p.id).startsWith('p_') ? String(p.id) : `p_${p.id}`) : `p_${p.username || idx}`;
      const existing = userMap.get(uid) || userMap.get(String(p.id)) || userMap.get(String(p.username));
      const userObj = {
        id: existing ? existing.id : uid,
        name: p.name || 'Phụ huynh',
        username: p.username || `ph_${p.phone || p.id || 'ph_' + idx}`,
        groupId: 'phuhuynh',
        status: existing ? (existing.status || 'active') : (p.status || 'active'),
        phone: p.phone || '',
        email: p.email || '',
        studentId: p.studentId || '',
        sourceType: 'parent',
        refId: p.id
      };
      userMap.set(String(userObj.id), userObj);
      if (p.username) userMap.set(String(p.username), userObj);
      if (p.id) userMap.set(String(p.id), userObj);
    });

    // Gom danh sách unique theo id
    const uniqueUsers = [];
    const seenIds = new Set();
    for (const u of userMap.values()) {
      if (u && u.id && !seenIds.has(u.id)) {
        seenIds.add(u.id);
        uniqueUsers.push(u);
      }
    }

    this.state.users = uniqueUsers;
    return uniqueUsers;
  }

  getAllUsers() {
    return this.syncAllUsersFromEntities();
  }

  init() {
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

    this.initUserGroupsAndPermissions();
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
  }

  _migrateRemainingDemoData() {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.questions)) this.state.questions = [];
    if (!Array.isArray(this.state.uploadedFiles)) this.state.uploadedFiles = [];
    if (!Array.isArray(this.state.teachingTools)) this.state.teachingTools = [];
  }

  _migrateDemoTeachersAndStudents() {
    if (!this.state) this.state = {};
    if (!Array.isArray(this.state.teachers)) this.state.teachers = [];
    if (!Array.isArray(this.state.students)) this.state.students = [];
    if (!Array.isArray(this.state.parents)) this.state.parents = [];
    if (!Array.isArray(this.state.attendance)) this.state.attendance = [];
    if (!Array.isArray(this.state.users)) this.state.users = [];
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
    try {
      if (typeof localStorage !== 'undefined') {
        const localSaved = localStorage.getItem('THCS_LMS_SELECTED_YEAR');
        if (localSaved) return localSaved;
      }
    } catch (e) {}

    if (!this.state) this.state = {};
    if (!this.state.selectedSchoolYear) {
      if (Array.isArray(this.state.academicYears)) {
        const active = this.state.academicYears.find(y => y.current || y.isCurrent);
        if (active && active.id) {
          this.state.selectedSchoolYear = active.id.replace('year_', '').replace('_', '-');
        }
      }
      if (!this.state.selectedSchoolYear) {
        this.state.selectedSchoolYear = '2025-2026';
      }
    }
    return this.state.selectedSchoolYear;
  }

  setSelectedSchoolYear(yearId) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('THCS_LMS_SELECTED_YEAR', yearId);
      }
    } catch (e) {}

    if (!this.state) this.state = {};
    this.state.selectedSchoolYear = yearId;

    if (Array.isArray(this.state.academicYears)) {
      this.state.academicYears.forEach(y => {
        const cleanId = (y.id || '').replace('year_', '').replace('_', '-');
        const isMatch = (y.id === yearId || cleanId === yearId || (y.name && y.name.includes(yearId)));
        y.current = isMatch;
        y.isCurrent = isMatch;
      });
    }
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
    this.syncAllUsersFromEntities();
  }
  updateTeacher(id, updatedData) {
    const idx = this.state.teachers.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.state.teachers[idx] = { ...this.state.teachers[idx], ...updatedData };
      this.save();
      this.syncAllUsersFromEntities();
    }
  }

  getStudents() { return this.state.students || []; }
  addStudent(student) {
    this.state.students.push(student);
    this.save();
    this.syncAllUsersFromEntities();
  }
  updateStudent(id, updatedData) {
    const idx = this.state.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.state.students[idx] = { ...this.state.students[idx], ...updatedData };
      this.save();
      this.syncAllUsersFromEntities();
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
    if (this.state.users) {
      this.state.users = this.state.users.filter(u => String(u.id) !== sId && String(u.id) !== `s_${sId}` && String(u.refId) !== sId);
    }
    this.save();
    this.syncAllUsersFromEntities();
  }

  deleteStudentsBatch(ids) {
    const idSet = new Set(ids.map(id => String(id)));
    if (this.state.students) {
      this.state.students = this.state.students.filter(s => !idSet.has(String(s.id)));
    }
    if (this.state.parents) {
      this.state.parents = this.state.parents.filter(p => !idSet.has(String(p.studentId)));
    }
    if (this.state.users) {
      this.state.users = this.state.users.filter(u => !idSet.has(String(u.id)) && !idSet.has(String(u.refId)));
    }
    this.save();
    this.syncAllUsersFromEntities();
  }

  getParents() { return this.state.parents || []; }
  addParent(parent) {
    if (!this.state.parents) this.state.parents = [];
    this.state.parents.push(parent);
    this.save();
    this.syncAllUsersFromEntities();
  }
  updateParent(id, updatedData) {
    if (!this.state.parents) this.state.parents = [];
    const idx = this.state.parents.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.state.parents[idx] = { ...this.state.parents[idx], ...updatedData };
      this.save();
      this.syncAllUsersFromEntities();
    }
  }

  getDeletedChapterIds() {
    if (!this.state.deletedChapterIds) this.state.deletedChapterIds = [];
    return new Set(this.state.deletedChapterIds);
  }

  getDeletedLessonIds() {
    if (!this.state.deletedLessonIds) this.state.deletedLessonIds = [];
    return new Set(this.state.deletedLessonIds);
  }

  getChapters() {
    if (!this.state.chapters) {
      const defChaps = (typeof DEFAULT_CHAPTERS !== 'undefined') ? DEFAULT_CHAPTERS : [];
      this.state.chapters = JSON.parse(JSON.stringify(defChaps));
    }
        const deleted = this.getDeletedChapterIds();
    const defChaps = (typeof DEFAULT_CHAPTERS !== 'undefined') ? DEFAULT_CHAPTERS : [];
    const defChapsMap = new Map(defChaps.map(dc => [dc.id, dc]));
    const existingIds = new Set(this.state.chapters.map(c => c.id));
    defChaps.forEach(dc => {
      if (!existingIds.has(dc.id) && !deleted.has(dc.id)) {
        this.state.chapters.push(dc);
        existingIds.add(dc.id);
      }
    });

    // Tự động đồng bộ chuẩn hóa tên chương mặc định KNTT
    this.state.chapters.forEach(c => {
      if (defChapsMap.has(c.id)) {
        const standard = defChapsMap.get(c.id);
        if (standard.title && c.title !== standard.title && !c.customUserEdited) {
          c.title = standard.title;
          c.grade = standard.grade;
        }
      }
    });

    return this.state.chapters
      .filter(c => !deleted.has(c.id))
      .map(c => {
        const g = c.grade ? parseInt(c.grade, 10) : 6;
        return { ...c, grade: g };
      });
  }

  addChapter(chapter) {
    if (!this.state.chapters) this.state.chapters = [];
    if (!this.state.deletedChapterIds) this.state.deletedChapterIds = [];
    this.state.deletedChapterIds = this.state.deletedChapterIds.filter(id => id !== chapter.id);
    chapter.grade = parseInt(chapter.grade || 6, 10);
    this.state.chapters.push(chapter);
    this.save();
  }

  updateChapter(id, updatedData) {
    if (!this.state.chapters) return;
    const idx = this.state.chapters.findIndex(c => c.id === id);
    if (idx !== -1) {
      if (updatedData.grade) updatedData.grade = parseInt(updatedData.grade, 10) || 6;
      this.state.chapters[idx] = { ...this.state.chapters[idx], ...updatedData };
      this.save();
    }
  }

  deleteChapter(id) {
    if (!this.state.chapters) this.state.chapters = [];
    if (!this.state.deletedChapterIds) this.state.deletedChapterIds = [];
    if (!this.state.deletedChapterIds.includes(id)) {
      this.state.deletedChapterIds.push(id);
    }
    this.state.chapters = this.state.chapters.filter(c => c.id !== id);

    // Cascade delete: xóa kèm tất cả các bài học thuộc chương này
    if (!this.state.lessons) {
      const defLess = (typeof DEFAULT_LESSONS !== 'undefined') ? DEFAULT_LESSONS : [];
      this.state.lessons = JSON.parse(JSON.stringify(defLess));
    }
    if (!this.state.deletedLessonIds) this.state.deletedLessonIds = [];
    
    const lessonsInChap = this.state.lessons.filter(l => l.chapterId === id);
    lessonsInChap.forEach(l => {
      if (!this.state.deletedLessonIds.includes(l.id)) {
        this.state.deletedLessonIds.push(l.id);
      }
    });
    this.state.lessons = this.state.lessons.filter(l => l.chapterId !== id);

    this.save();
  }

  getLessons() {
    const chaps = this.getChapters();
    const chapGradeMap = {};
    chaps.forEach(c => { chapGradeMap[c.id] = parseInt(c.grade || 6, 10); });

    if (!this.state.lessons) {
      const defLess = (typeof DEFAULT_LESSONS !== 'undefined') ? DEFAULT_LESSONS : [];
      this.state.lessons = JSON.parse(JSON.stringify(defLess));
    }
        const deleted = this.getDeletedLessonIds();
    const defLess = (typeof DEFAULT_LESSONS !== 'undefined') ? DEFAULT_LESSONS : [];
    const defLessMap = new Map(defLess.map(dl => [dl.id, dl]));
    const existingIds = new Set(this.state.lessons.map(l => l.id));
    defLess.forEach(dl => {
      if (!existingIds.has(dl.id) && !deleted.has(dl.id)) {
        this.state.lessons.push(dl);
        existingIds.add(dl.id);
      }
    });

    // Tự động đồng bộ chuẩn hóa tên bài học mặc định KNTT nếu phiên bản cũ lưu sai
    this.state.lessons.forEach(l => {
      if (defLessMap.has(l.id)) {
        const standard = defLessMap.get(l.id);
        if (standard.title && l.title !== standard.title && !l.customUserEdited) {
          l.title = standard.title;
          l.chapterId = standard.chapterId;
          l.grade = standard.grade;
        }
      }
    });

    return this.state.lessons
      .filter(l => !deleted.has(l.id))
      .map(l => {
        const g = l.grade ? parseInt(l.grade, 10) : (chapGradeMap[l.chapterId] || 6);
        return { ...l, grade: g };
      });
  }

  addLesson(lesson) {
    if (!this.state.lessons) this.state.lessons = [];
    if (!this.state.deletedLessonIds) this.state.deletedLessonIds = [];
    this.state.deletedLessonIds = this.state.deletedLessonIds.filter(id => id !== lesson.id);
    if (!lesson.grade && lesson.chapterId) {
      const chaps = this.getChapters();
      const ch = chaps.find(c => c.id === lesson.chapterId);
      lesson.grade = ch ? (ch.grade || 6) : 6;
    }
    lesson.grade = parseInt(lesson.grade || 6, 10);
    this.state.lessons.push(lesson);
    this.save();
  }

  updateLesson(id, updatedData) {
    if (!this.state.lessons) return;
    const idx = this.state.lessons.findIndex(l => l.id === id);
    if (idx !== -1) {
      if (updatedData.grade) updatedData.grade = parseInt(updatedData.grade, 10) || 6;
      this.state.lessons[idx] = { ...this.state.lessons[idx], ...updatedData };
      this.save();
    }
  }

  deleteLesson(id) {
    if (!this.state.lessons) this.state.lessons = [];
    if (!this.state.deletedLessonIds) this.state.deletedLessonIds = [];
    if (!this.state.deletedLessonIds.includes(id)) {
      this.state.deletedLessonIds.push(id);
    }
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

