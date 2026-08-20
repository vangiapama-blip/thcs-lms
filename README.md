# Hệ thống LMS THCS Chu Văn An - Tích hợp Trợ lý AI (GDPT 2018)

Dự án này là một ứng dụng web Single Page Application (SPA) cao cấp, mô phỏng toàn bộ quy trình vận hành của một hệ thống quản lý học tập (LMS) dành cho cấp Trung học cơ sở (THCS).

## ✨ Điểm nổi bật
1. **Premium Glassmorphism UX/UI**: Thiết kế hiện đại với tông màu tối huyền ảo, bo góc mềm mại, đổ bóng sâu và các hiệu ứng chuyển động mượt mà (micro-animations).
2. **Role Switcher tiện lợi**: Thanh công cụ phía trên cho phép bạn chuyển đổi nhanh giữa 4 vai trò:
   - **Quản trị viên (Admin)**: Khởi tạo trường học, xếp lớp, quản lý năm học mới, sao lưu/phục hồi dữ liệu, xuất Excel/PDF, kết thúc năm học.
   - **Giáo viên (Teacher)**: Thiết lập chương trình giảng dạy, quản lý học liệu, soạn bài giảng, tạo ngân hàng đề thi trắc nghiệm & tự luận, giao bài tập, điểm danh chuyên cần, liên lạc phụ huynh.
   - **Học sinh (Student)**: Học bài, làm bài tập về nhà, thi trắc nghiệm trực tuyến có đếm ngược thời gian tự động, xem điểm thi và học bạ.
   - **Phụ huynh (Parent)**: Giám sát kết quả học tập của con, theo dõi chuyên cần và nhắn tin trao đổi với giáo viên bộ môn.
3. **Trợ lý AI thông minh (AI Assistant Hub)**: Hỗ trợ giáo viên sinh tự động giáo án HTML chi tiết, sinh danh sách câu hỏi trắc nghiệm/tự luận theo chủ đề kiến thức, và gợi ý nhận xét kết quả học bạ tức thì.
4. **LocalStorage Persistence**: Dữ liệu được lưu trữ tự động trong trình duyệt của bạn, giúp duy trì trạng thái khi tải lại trang (F5).

## 🚀 Hướng dẫn khởi chạy ứng dụng
Có hai cách để khởi chạy ứng dụng:

### Cách 1: Chạy trực tiếp (Không cần cài đặt)
Mở trực tiếp tệp tin `index.html` bằng trình duyệt web của bạn (Double click vào file `index.html` hoặc chuột phải chọn Open with Chrome/Edge/Firefox).

### Cách 2: Chạy qua Live Server (Khuyên dùng)
Nếu bạn có Node.js cài sẵn trên máy:
1. Mở cửa sổ terminal tại thư mục này.
2. Chạy lệnh:
   ```bash
   npx live-server
   # hoặc chạy bằng vite
   npx -y vite
   ```
3. Truy cập địa chỉ hiển thị trên màn hình terminal (thường là `http://localhost:8080` hoặc `http://localhost:5173`).

---
Chúc bạn có những trải nghiệm tuyệt vời cùng Hệ thống LMS THCS Chu Văn An!
