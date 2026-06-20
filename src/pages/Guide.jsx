import { motion } from 'framer-motion';

const faqs = [
  {
    q: '❓ Dữ liệu của tôi có bị tải lên máy chủ không?',
    a: 'Không. Tuyệt đối không! Toàn bộ 100% công cụ trên OfficeKit (Gộp PDF, Excel ↔ JSON, OCR, Hash, v.v.) đều chạy bằng JavaScript/WebAssembly trực tiếp trong trình duyệt của bạn. Dữ liệu của bạn chưa bao giờ rời khỏi thiết bị.',
  },
  {
    q: '🔍 Làm sao để tìm một công cụ?',
    a: 'Sử dụng thanh tìm kiếm ở góc trên bên phải của Dashboard để tìm theo tên hoặc chức năng. Hoặc nhấp vào các danh mục ở thanh điều hướng bên trái (Tài liệu & PDF, Hình ảnh, Lập trình, Tài chính, Tiện ích).',
  },
  {
    q: '📷 Công cụ OCR hoạt động thế nào?',
    a: 'Khi bạn tải ảnh lên, công cụ sẽ tải một tệp dữ liệu ngôn ngữ nhỏ (hỗ trợ Tiếng Việt & Tiếng Anh) vào cache trình duyệt lần đầu tiên. Sau đó quét ảnh cục bộ và trả về văn bản. Ảnh mờ hoặc độ phân giải thấp sẽ giảm độ chính xác.',
  },
  {
    q: '📴 Ứng dụng có chạy được offline không?',
    a: 'Bạn cần mạng để tải trang web lần đầu. Sau khi đã load các thư viện vào cache, hầu hết các công cụ đều hoạt động offline.',
  },
  {
    q: '📱 Có dùng được trên điện thoại không?',
    a: 'Có! OfficeKit v4.0 được thiết kế mobile-first, responsive hoàn toàn. Tất cả công cụ đều hoạt động tốt trên điện thoại và tablet.',
  },
  {
    q: '🔐 Hash Generator dùng thuật toán gì?',
    a: 'Công cụ sử dụng Web Crypto API được tích hợp sẵn trong trình duyệt, hỗ trợ SHA-1, SHA-256, SHA-384, SHA-512. Không cần thư viện ngoài.',
  },
  {
    q: '💱 Tỷ giá tiền tệ có realtime không?',
    a: 'Tỷ giá trong Currency Converter là tỷ giá tham khảo (cập nhật định kỳ), không phải realtime. Để đảm bảo 100% offline và không cần API, chúng tôi dùng tỷ giá cố định. Chỉ dùng để tham khảo nhanh.',
  },
  {
    q: '🧮 Tính thuế TNCN áp dụng quy định nào?',
    a: 'Công cụ Tính Thuế TNCN áp dụng quy định Việt Nam 2024 với 7 bậc thuế lũy tiến và các mức giảm trừ hiện hành (giảm trừ bản thân 11tr/tháng, người phụ thuộc 4.4tr/người).',
  },
];

export default function Guide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ flex: 1, padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px)', maxWidth: '800px', margin: '0 auto', width: '100%' }}
    >
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 7vw, 42px)', marginBottom: '8px', color: '#60a5fa' }}>
        Hướng dẫn sử dụng
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
        OfficeKit được thiết kế trực quan nhất có thể. Đây là những thắc mắc phổ biến:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((faq, i) => (
          <details
            key={i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              padding: '0',
              overflow: 'hidden',
            }}
          >
            <summary
              style={{
                cursor: 'pointer', padding: '18px 20px',
                fontWeight: 700, fontSize: '15px',
                color: 'var(--text)', lineHeight: 1.4,
                listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              {faq.q}
              <span style={{ fontSize: '20px', color: 'var(--muted)', flexShrink: 0, marginLeft: '12px' }}>﹀</span>
            </summary>
            <div style={{
              padding: '0 20px 18px',
              fontSize: '15px', lineHeight: 1.7,
              color: 'var(--muted)',
              borderTop: '1px solid var(--border)',
              paddingTop: '14px',
            }}>
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div style={{ marginTop: '32px', padding: '20px', borderRadius: '16px', background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)', textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: '16px' }}>
          💬 Vẫn còn thắc mắc?
        </p>
        <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '14px' }}>
          Mở Issue trên GitHub hoặc liên hệ trực tiếp với tác giả.
        </p>
        <a
          href="https://github.com/Nhanduc2912"
          target="_blank" rel="noreferrer"
          style={{
            display: 'inline-block', padding: '10px 24px', borderRadius: '10px',
            background: 'rgba(96,165,250,0.15)', color: '#60a5fa',
            border: '1px solid rgba(96,165,250,0.3)', textDecoration: 'none',
            fontWeight: 700, fontSize: '14px', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(96,165,250,0.15)'}
        >
          🐙 Mở GitHub Issue
        </a>
      </div>
    </motion.div>
  );
}
