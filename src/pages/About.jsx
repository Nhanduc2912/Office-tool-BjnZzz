import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ flex: 1, padding: '40px 32px', maxWidth: '800px', margin: '0 auto' }}
    >
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '36px', marginBottom: '24px', color: 'var(--accent)' }}>Về OfficeKit</h1>
      
      <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p>
          <strong>OfficeKit</strong> là một bộ sưu tập siêu ứng dụng web hoàn toàn miễn phí và không có quảng cáo, được thiết kế đặc biệt nhằm giúp dân văn phòng, lập trình viên và những người làm việc trên máy tính xử lý các tác vụ hàng ngày một cách nhanh chóng và an toàn.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 style={{ marginTop: 0, color: '#4ade80' }}>Sứ mệnh của chúng tôi</h3>
          <p style={{ margin: 0 }}>
            Tạo ra những công cụ hữu ích nhất, xử lý trực tiếp ngay trên thiết bị của bạn mà không cần đẩy dữ liệu lên máy chủ. <strong>Bảo mật 100%. Tốc độ tối đa.</strong>
          </p>
        </div>

        <h3>Ai là người đứng sau dự án này?</h3>
        <p>
          Dự án được phát triển bởi <strong>ducnguyener</strong>. Bạn có thể theo dõi và liên hệ với tôi qua:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li>🌐 Website: <a href="https://ducnguyener.top" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>ducnguyener.top</a></li>
          <li>🐙 GitHub: <a href="https://github.com/Nhanduc2912" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Nhanduc2912</a></li>
        </ul>

        <h3>Đóng góp (Contribute)</h3>
        <p>
          OfficeKit là một dự án mở. Nếu bạn có ý tưởng công cụ mới hoặc tìm thấy lỗi, đừng ngần ngại gửi Issue hoặc Pull Request trên GitHub nhé!
        </p>
      </div>
    </motion.div>
  );
}
