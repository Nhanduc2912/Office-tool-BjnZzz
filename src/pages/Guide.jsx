import { motion } from 'framer-motion';

export default function Guide() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ flex: 1, padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}
    >
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '36px', marginBottom: '24px', color: '#60a5fa' }}>Hướng dẫn sử dụng</h1>
      
      <div style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <p style={{ fontSize: '16px', color: 'var(--muted)' }}>
          OfficeKit được thiết kế để trực quan và dễ sử dụng nhất có thể. Dưới đây là một số giải đáp cho các thắc mắc phổ biến.
        </p>

        <div>
          <h3 style={{ color: '#fff', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>1. Dữ liệu của tôi có bị tải lên máy chủ không?</h3>
          <p>
            <strong>Không. Tuyệt đối không!</strong> Toàn bộ 100% công cụ trên OfficeKit (bao gồm Gộp PDF, Excel sang JSON, Nhận diện chữ OCR, v.v.) đều hoạt động bằng mã nguồn JavaScript/WebAssembly chạy trực tiếp trên trình duyệt của bạn (Client-side). Dữ liệu của bạn chưa bao giờ rời khỏi thiết bị.
          </p>
        </div>

        <div>
          <h3 style={{ color: '#fff', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>2. Làm sao để tìm một công cụ?</h3>
          <p>
            Bạn có thể sử dụng thanh tìm kiếm (🔍) ở góc trên bên phải của Trang chủ để tìm kiếm theo tên hoặc chức năng. Hoặc bạn có thể nhấp vào các phân mục ở thanh điều hướng bên trái (Ví dụ: Tài liệu & PDF, Hình ảnh, Tiện ích).
          </p>
        </div>

        <div>
          <h3 style={{ color: '#fff', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>3. Công cụ OCR (Nhận diện chữ từ ảnh) hoạt động thế nào?</h3>
          <p>
            Khi bạn kéo thả một hình ảnh vào công cụ, nó sẽ tải một tệp dữ liệu ngôn ngữ nhỏ (hỗ trợ Tiếng Việt & Tiếng Anh) vào cache trình duyệt. Sau đó, nó sẽ quét hình ảnh cục bộ và trả về văn bản. Đôi khi hình ảnh mờ sẽ khiến thời gian quét lâu hơn bình thường.
          </p>
        </div>

        <div>
          <h3 style={{ color: '#fff', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>4. Ứng dụng này có chạy được offline (không cần mạng) không?</h3>
          <p>
            Hiện tại bạn vẫn cần mạng để tải trang web lần đầu. Tuy nhiên, sau khi các công cụ (và thư viện) đã được tải xong vào bộ nhớ đệm, hầu hết các tính năng đều có thể sử dụng ngay cả khi mạng bị ngắt.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
