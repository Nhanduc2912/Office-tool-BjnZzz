import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden',
    }}>

      {/* Background Effects */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Header */}
      <header style={{
        padding: 'clamp(16px, 4vw, 24px) clamp(20px, 5vw, 40px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10, flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
          }}>⚡</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(20px, 5vw, 24px)', color: 'var(--accent)' }}>
            OfficeKit
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/Nhanduc2912"
            target="_blank" rel="noreferrer"
            style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '15px', fontWeight: 600, padding: '8px 12px', borderRadius: '8px', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            GitHub
          </a>
          <Link
            to="/dashboard"
            style={{
              padding: '10px 20px', borderRadius: '10px', background: 'var(--accent)',
              color: '#000', textDecoration: 'none', fontWeight: 700, fontSize: '15px',
              transition: 'transform 0.2s, box-shadow 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,222,128,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Mở Ứng dụng →
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', padding: '40px clamp(20px, 5vw, 40px)',
        zIndex: 10,
      }}>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '7px 20px', borderRadius: '999px',
            background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
            fontSize: 'clamp(11px, 3vw, 13px)', color: 'var(--accent)', marginBottom: '32px',
            fontWeight: 600, letterSpacing: '0.04em', flexWrap: 'wrap', justifyContent: 'center',
          }}
        >
          ✦ 29+ Công cụ miễn phí · Không cài đặt · Xử lý tại Local
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(36px, 8vw, 80px)', lineHeight: 1.1,
            margin: '0 0 24px', maxWidth: '900px',
          }}
        >
          Siêu công cụ văn phòng{' '}
          <br />
          <span style={{ color: 'var(--accent)' }}>tất cả trong một</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontSize: 'clamp(15px, 3vw, 18px)', color: 'var(--muted)',
            maxWidth: '620px', margin: '0 auto 48px', lineHeight: 1.7,
          }}
        >
          Từ ghép PDF, chuyển đổi Excel, OCR nhận diện chữ, tính thuế TNCN, đến mã hóa bảo mật.
          Mọi thứ bạn cần đều chạy ngay trên trình duyệt — an toàn và nhanh chóng.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="cta-buttons"
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link
            to="/dashboard"
            style={{
              padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px)',
              borderRadius: '14px', background: 'var(--accent)', color: '#000',
              textDecoration: 'none', fontWeight: 800, fontSize: 'clamp(15px, 3vw, 18px)',
              boxShadow: '0 10px 30px rgba(74,222,128,0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(74,222,128,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(74,222,128,0.25)'; }}
          >
            Vào Bảng Điều Khiển →
          </Link>
          <Link
            to="/guide"
            style={{
              padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px)',
              borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: 'var(--text)',
              border: '1px solid var(--border)', textDecoration: 'none',
              fontWeight: 700, fontSize: 'clamp(15px, 3vw, 18px)',
              transition: 'background 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Tìm hiểu thêm
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'flex', gap: 'clamp(24px, 6vw, 48px)', marginTop: '64px',
            flexWrap: 'wrap', justifyContent: 'center',
          }}
        >
          {[
            ['29+', 'Công cụ'],
            ['100%', 'Miễn phí'],
            ['0', 'Upload server'],
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(24px, 5vw, 32px)', color: 'var(--accent)' }}>{num}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid var(--border)', zIndex: 10 }}>
        <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>
          © {new Date().getFullYear()} OfficeKit. Phát triển bởi{' '}
          <a href="https://ducnguyener.top" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            ducnguyener.top
          </a>
        </p>
      </footer>
    </div>
  );
}
