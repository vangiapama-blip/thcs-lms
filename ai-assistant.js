// AI Assistant Simulator module for THCS LMS
// Generates lectures, quiz questions, and comments in Vietnamese

var AIAssistant = {
  // Simulate AI generating a lesson
  generateLesson: async (subjectId, prompt) => {
    // Artificial delay to make it feel like AI is thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowercasePrompt = prompt.toLowerCase();
    let title = prompt || 'Bài học mới do AI thiết lập';
    let content = '';
    let materials = {
      video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      pdf: 'AI-Generated-Notes.pdf',
      slide: 'AI-Generated-Slides.pptx',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500'
    };

    if (subjectId === 'toan' || lowercasePrompt.includes('toán') || lowercasePrompt.includes('số') || lowercasePrompt.includes('hình')) {
      title = title.includes('toán') ? title : `Toán học: ${title}`;
      content = `
        <div class="ai-generated-badge">✨ Tạo bởi Trí tuệ Nhân tạo</div>
        <h4>I. Mục tiêu bài học</h4>
        <p>Giúp học sinh nắm vững các khái niệm lý thuyết cốt lõi về <strong>${prompt}</strong>, rèn luyện kỹ năng giải các dạng toán cơ bản và vận dụng vào bài tập thực tế.</p>
        
        <h4>II. Kiến thức trọng tâm</h4>
        <div class="theory-box">
          <h5>1. Định nghĩa và công thức chính</h5>
          <p>Áp dụng các định lý cơ bản, ghi nhớ các bước phân tích bài toán và thực hiện phép tính chính xác. Đặc biệt lưu ý điều kiện xác định của các biến số.</p>
          <h5>2. Ví dụ minh họa</h5>
          <div class="example-case">
            <strong>Ví dụ 1:</strong> Tìm x biết x là số tự nhiên thỏa mãn yêu cầu bài toán.<br>
            <em>Giải chi tiết:</em> Phân tích bài toán, thiết lập phương trình/bất phương trình, tiến hành giải từng bước để tìm ra kết quả cuối cùng và đối chiếu điều kiện.
          </div>
        </div>
        
        <h4>III. Phương pháp giải bài tập</h4>
        <ul>
          <li><strong>Bước 1:</strong> Đọc kỹ đề bài, xác định dữ kiện đã cho và đại lượng cần tìm.</li>
          <li><strong>Bước 2:</strong> Thiết lập công thức liên hệ trực tiếp.</li>
          <li><strong>Bước 3:</strong> Giải toán từng bước tỉ mỉ, tránh sai sót tính toán cơ bản.</li>
          <li><strong>Bước 4:</strong> Kết luận và kiểm tra lại kết quả.</li>
        </ul>
      `;
    } else if (subjectId === 'van' || lowercasePrompt.includes('văn') || lowercasePrompt.includes('thơ') || lowercasePrompt.includes('truyện')) {
      title = title.includes('văn') ? title : `Ngữ văn: ${title}`;
      content = `
        <div class="ai-generated-badge">✨ Tạo bởi Trí tuệ Nhân tạo</div>
        <h4>I. Đọc - Hiểu văn bản</h4>
        <p>Tìm hiểu các giá trị nội dung và nghệ thuật của tác phẩm/chủ đề <strong>${prompt}</strong>. Nhận biết được ngôi kể, nhân vật, cốt truyện hoặc phương thức biểu đạt chính.</p>
        
        <h4>II. Phân tích chi tiết</h4>
        <div class="theory-box">
          <h5>1. Giá trị nội dung</h5>
          <p>Tác phẩm thể hiện sâu sắc tình cảm yêu nước, nhân đạo hoặc phản ánh bức tranh hiện thực đời sống xã hội. Qua đó gửi gắm bài học nhân văn sâu sắc cho thế hệ trẻ.</p>
          <h5>2. Đặc sắc nghệ thuật</h5>
          <ul>
            <li>Xây dựng hình tượng nghệ thuật độc đáo, ngôn từ giàu tính biểu cảm.</li>
            <li>Sử dụng các biện pháp tu từ như nhân hóa, so sánh, ẩn dụ một cách khéo léo.</li>
            <li>Giọng điệu kể chuyện tự nhiên, lôi cuốn người đọc.</li>
          </ul>
        </div>
        
        <h4>III. Ý nghĩa rút ra</h4>
        <p>Bồi dưỡng tình yêu quê hương, đất nước, gia đình và bạn bè. Ý thức trách nhiệm của mỗi cá nhân đối với xã hội.</p>
      `;
    } else {
      title = `Học liệu: ${title}`;
      content = `
        <div class="ai-generated-badge">✨ Tạo bởi Trí tuệ Nhân tạo</div>
        <h4>I. Giới thiệu tổng quan</h4>
        <p>Nội dung học tập chi tiết xoay quanh chủ đề <strong>${prompt}</strong> theo định hướng phát triển phẩm chất và năng lực học sinh THCS.</p>
        
        <h4>II. Nội dung cốt lõi</h4>
        <div class="theory-box">
          <h5>Khái niệm cơ bản</h5>
          <p>Học sinh cần nắm vững cấu trúc lý thuyết cơ bản, liên hệ thực tế đời sống để hiểu rõ bản chất của hiện tượng và kiến thức.</p>
        </div>
        
        <h4>III. Hoạt động luyện tập</h4>
        <p>Thực hiện các câu hỏi trắc nghiệm khách quan và bài tập tình huống để củng cố kiến thức đã học ngay tại lớp.</p>
      `;
    }

    return { title, content, materials };
  },

  // Simulate AI generating quiz/essay questions
  generateQuestions: async (subjectId, prompt, quantity = 3, type = 'trac_nghiem', difficulty = 'nhan_biet') => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const questions = [];
    const diffLabel = {
      'nhan_biet': 'Nhận biết',
      'thong_hieu': 'Thông hiểu',
      'van_dung': 'Vận dụng',
      'van_dung_cao': 'Vận dụng cao'
    }[difficulty] || 'Nhận biết';

    for (let i = 1; i <= quantity; i++) {
      const qId = `ai_q_${Date.now()}_${i}`;
      if (type === 'trac_nghiem') {
        let questionText = `[AI Sinh] Câu hỏi ${i} (${diffLabel}) về "${prompt}": `;
        let options = [];
        let correctAnswer = 0;
        let explanation = '';

        if (subjectId === 'toan') {
          questionText += `Kết quả của phép toán cơ bản liên quan đến nội dung ôn tập là bao nhiêu?`;
          options = [
            `Đáp án A (Đúng nhất theo lý thuyết)`,
            `Đáp án B (Phương án gây nhiễu loại 1)`,
            `Đáp án C (Phương án gây nhiễu loại 2)`,
            `Đáp án D (Phương án sai cơ bản)`
          ];
          correctAnswer = 0;
          explanation = `Theo định lý và tính chất cơ bản môn Toán học cấp THCS, khi triển khai tính toán ta thu được đáp án A là chính xác nhất.`;
        } else if (subjectId === 'van') {
          questionText += `Đặc điểm nghệ thuật nổi bật nhất được thể hiện trong tác phẩm là gì?`;
          options = [
            `Sử dụng nghệ thuật ẩn dụ và nhân hóa độc đáo`,
            `Xây dựng tình huống truyện kịch tính bất ngờ`,
            `Miêu tả diễn biến tâm lý nhân vật sắc sảo`,
            `Cả 3 phương án trên đều sai`
          ];
          correctAnswer = 0;
          explanation = `Biện pháp ẩn dụ và nhân hóa là đặc trưng nghệ thuật nổi bật của bài viết để làm sinh động hóa hình tượng tác phẩm.`;
        } else {
          questionText += `Kiến thức cốt lõi nào sau đây phản ánh chính xác nhất về nội dung này?`;
          options = [
            `Định nghĩa chuẩn xác theo sách giáo khoa`,
            `Giải thích sơ lược nhưng chưa đầy đủ`,
            `Ý kiến chủ quan chưa được kiểm chứng`,
            `Khái niệm lỗi thời không còn áp dụng`
          ];
          correctAnswer = 0;
          explanation = `Đọc kỹ phần kiến thức cốt lõi trong sách giáo khoa để lựa chọn định nghĩa chuẩn xác nhất.`;
        }

        questions.push({
          id: qId,
          subjectId,
          chapterId: '',
          type,
          difficulty,
          questionText,
          options,
          correctAnswer,
          explanation,
          approved: false // Requires teacher review
        });
      } else {
        // Essay question
        let questionText = `[AI Sinh] Câu hỏi tự luận ${i} (${diffLabel}): `;
        let explanation = '';

        if (subjectId === 'toan') {
          questionText += `Trình bày thuật toán và các bước giải phương trình cụ thể liên quan đến đề tài "${prompt}".`;
          explanation = `Yêu cầu học sinh chỉ ra điều kiện xác định, thực hiện đúng các bước biến đổi tương đương và kết luận tập nghiệm.`;
        } else if (subjectId === 'van') {
          questionText += `Viết đoạn văn ngắn nêu cảm nhận của em về chi tiết nghệ thuật đắt giá nhất trong tác phẩm "${prompt}".`;
          explanation = `Đánh giá khả năng cảm thụ văn học, nêu đúng tên tác phẩm, tác giả, chỉ ra chi tiết nghệ thuật tiêu biểu và phân tích tác dụng biểu cảm.`;
        } else {
          questionText += `Trình bày ý kiến cá nhân và giải pháp thực tế liên quan đến hiện tượng khoa học xã hội "${prompt}".`;
          explanation = `Yêu cầu phân tích được thực trạng, nguyên nhân, hệ quả và đề xuất giải pháp khả thi từ góc độ cá nhân học sinh.`;
        }

        questions.push({
          id: qId,
          subjectId,
          chapterId: '',
          type,
          difficulty,
          questionText,
          options: [],
          correctAnswer: null,
          explanation,
          approved: false
        });
      }
    }

    return questions;
  },

  // Simulate AI generating a student comment
  generateComment: async (studentName, mathScore, vanScore, attendanceRate) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const avg = (mathScore + vanScore) / 2;
    let comment = `Học sinh **${studentName}**: `;

    if (avg >= 8.5) {
      comment += `Có học lực Xuất sắc/Giỏi. Tiếp thu bài rất nhanh, có tư duy logic tốt ở môn Toán (${mathScore} điểm) và khả năng viết văn trôi chảy, cảm xúc ở môn Ngữ văn (${vanScore} điểm). `;
    } else if (avg >= 6.5) {
      comment += `Học lực Khá. Nắm vững kiến thức cơ bản, bài thi đạt kết quả tốt (Toán: ${mathScore}, Văn: ${vanScore}). `;
    } else {
      comment += `Học lực Trung bình/Yếu. Cần cố gắng nhiều hơn để bù đắp hổng kiến thức, bài làm còn nhiều sai sót (Toán: ${mathScore}, Văn: ${vanScore}). `;
    }

    if (attendanceRate >= 95) {
      comment += `Chuyên cần rất tốt, đi học đầy đủ (${attendanceRate}%), tích cực xây dựng bài giảng trên lớp.`;
    } else if (attendanceRate >= 85) {
      comment += `Chuyên cần đạt yêu cầu (${attendanceRate}%), đôi khi còn lơ là, cần chú ý nghe giảng hơn.`;
    } else {
      comment += `Vắng học nhiều (${attendanceRate}%), nghỉ học có/không phép vượt quá quy định, ảnh hưởng trực tiếp đến kết quả học tập. Đề nghị gia đình phối hợp đôn đốc cháu.`;
    }

    if (avg >= 8.5) {
      comment += ` Khuyên cháu tiếp tục phát huy tinh thần tự học, tích cực tham gia các kỳ thi chọn học sinh giỏi.`;
    } else if (avg < 6.5) {
      comment += ` Giáo viên bộ môn sẽ phụ đạo thêm cho cháu vào các buổi chiều, mong phụ huynh kèm cặp thêm ở nhà.`;
    }

    return comment;
  }
};

if (typeof window !== 'undefined') {
  window.AIAssistant = AIAssistant;
}
