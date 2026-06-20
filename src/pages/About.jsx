import { motion } from 'framer-motion';

const features = [
  { icon: '🔒', title: '100% Riêng tư', desc: 'Mọi dữ liệu xử lý tại trình duyệt. Không upload server.' },
  { icon: '⚡', title: 'Tốc độ cao',    desc: 'Không cần API call, kết quả ngay lập tức.' },
  { icon: '🆓', title: 'Miễn phí',      desc: 'Không có phí, không có quảng cáo, không có tricks.' },
  { icon: '📱', title: 'Đa nền tảng',   desc: 'Hoạt động trên mọi thiết bị: máy tính, tablet, điện thoại.' },
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ flex: 1, padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px)', maxWidth: '800px', margin: '0 auto', width: '100%' }}
    >
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 7vw, 42px)', marginBottom: '8px', color: 'var(--accent)' }}>
        Về OfficeKit
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '32px', lineHeight: 1.6 }}>
        Bộ công cụ văn phòng siêu mạnh — miễn phí, không quảng cáo, không cần cài đặt.
      </p>

      <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <p>
          <strong>OfficeKit</strong> là một bộ sưu tập <strong>29+ công cụ web</strong> hoàn toàn miễn phí, được thiết kế
          đặc biệt để giúp dân văn phòng, lập trình viên, nhà thiết kế và mọi người xử lý các
          tác vụ hàng ngày một cách nhanh chóng và an toàn.
        </p>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))', gap: '16px' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 6px', fontSize: '15px', color: 'var(--text)' }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(74,222,128,0.06)', padding: '20px 24px', borderRadius: '16px', border: '1px solid rgba(74,222,128,0.2)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--accent)', marginBottom: '8px' }}>🎯 Sứ mệnh</h3>
          <p style={{ margin: 0 }}>
            Tạo ra những công cụ hữu ích nhất, xử lý trực tiếp ngay trên thiết bị của bạn mà không
            cần đẩy dữ liệu lên máy chủ. <strong>Bảo mật 100%. Tốc độ tối đa. Miễn phí mãi mãi.</strong>
          </p>
        </div>

        <div>
          <h3>👨‍💻 Ai là người đứng sau dự án này?</h3>
          <p>
            Dự án được phát triển và duy trì bởi <strong>ducnguyener</strong>.
            Bạn có thể theo dõi và liên hệ qua:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              🌐 Website:{' '}
              <a href="https://ducnguyener.top" target="_blank" rel="noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                ducnguyener.top
              </a>
            </li>
            <li>
              🐙 GitHub:{' '}
              <a href="https://github.com/Nhanduc2912" target="_blank" rel="noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                github.com/Nhanduc2912
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3>🤝 Đóng góp (Contribute)</h3>
          <p>
            OfficeKit là một dự án mã nguồn mở. Nếu bạn có ý tưởng công cụ mới
            hoặc tìm thấy lỗi, đừng ngần ngại gửi Issue hoặc Pull Request trên GitHub nhé!
          </p>
        </div>

        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--muted)' }}>Phiên bản</p>
          <p style={{ margin: 0, fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--accent)' }}>
            v4.0 Studio — 29 Công cụ
          </p>
        </div>
      </div>
    </motion.div>
  );
}
