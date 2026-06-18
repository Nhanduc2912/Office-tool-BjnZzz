import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Effects */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Header (Minimal) */}
      <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', color: 'var(--accent)' }}>OfficeKit</span>
        </div>
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="https://github.com/Nhanduc2912" target="_blank" rel="noreferrer" style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>GitHub</a>
          <Link to="/dashboard" style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--accent)', color: '#000', textDecoration: 'none', fontWeight: 700, fontSize: '15px', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            Mở Ứng dụng
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-block', padding: '6px 20px', borderRadius: '999px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', fontSize: '13px', color: 'var(--accent)', marginBottom: '32px', fontWeight: 600, letterSpacing: '0.05em' }}
        >
          ✦ 30+ Công cụ mạnh mẽ · Không cài đặt · Chạy tại Local
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(40px, 8vw, 80px)', lineHeight: 1.1, margin: '0 0 24px', maxWidth: '900px' }}
        >
          Siêu công cụ văn phòng <br />
          <span style={{ color: 'var(--accent)' }}>tất cả trong một</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.6 }}
        >
          Từ ghép file PDF, chuyển đổi Excel, nhận diện chữ trong ảnh (OCR), đến mã hóa bảo mật. Mọi thứ bạn cần đều nằm trên trình duyệt, an toàn và nhanh chóng.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: 'flex', gap: '16px' }}
        >
          <Link to="/dashboard" style={{ padding: '16px 40px', borderRadius: '12px', background: 'var(--accent)', color: '#000', textDecoration: 'none', fontWeight: 800, fontSize: '18px', boxShadow: '0 10px 30px rgba(74,222,128,0.3)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Vào Bảng Điều Khiển →
          </Link>
          <Link to="/guide" style={{ padding: '16px 40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', border: '1px solid var(--border)', textDecoration: 'none', fontWeight: 700, fontSize: '18px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            Tìm hiểu thêm
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '32px', textAlign: 'center', borderTop: '1px solid var(--border)', zIndex: 10 }}>
        <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>
          © {new Date().getFullYear()} OfficeKit. Phát triển bởi <a href="https://ducnguyener.top" style={{ color: 'var(--text)', textDecoration: 'none' }}>ducnguyener.top</a>.
        </p>
      </footer>
    </div>
  );
}
