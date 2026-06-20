import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tools } from '../data/tools';
import { motion } from 'framer-motion';
import { Star, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ToolView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tool = tools.find(t => t.id === id);
  const { favorites, toggleFavorite, addRecent } = useAppContext();

  useEffect(() => {
    if (tool) addRecent(tool.id);
  }, [tool, addRecent]);

  if (!tool) {
    return (
      <div style={{ padding: '60px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ margin: '0 0 12px', fontFamily: 'Syne, sans-serif' }}>Không tìm thấy công cụ</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Công cụ này không tồn tại hoặc đã bị xóa.</p>
        <Link
          to="/dashboard"
          style={{
            padding: '12px 24px', borderRadius: '10px', background: 'var(--accent)',
            color: '#000', textDecoration: 'none', fontWeight: 700,
          }}
        >
          ← Quay lại Dashboard
        </Link>
      </div>
    );
  }

  const Component = tool.component;
  const isFavorite = favorites.includes(tool.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <header style={{
        padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 32px)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
        position: 'sticky', top: 0, zIndex: 30,
      }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
          style={{
            width: '40px', height: '40px', borderRadius: '10px',
            border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)',
            color: 'var(--text)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <ArrowLeft size={18} />
        </button>

        {/* Tool info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 'clamp(22px, 5vw, 28px)', flexShrink: 0 }}>{tool.emoji}</span>
          <div style={{ minWidth: 0 }}>
            <h2 style={{
              margin: 0, fontSize: 'clamp(16px, 4vw, 22px)',
              fontWeight: 700, fontFamily: 'Syne,sans-serif',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {tool.name}
            </h2>
            <p style={{
              margin: '2px 0 0', fontSize: 'clamp(12px, 2.5vw, 14px)',
              color: 'var(--muted)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {tool.desc}
            </p>
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(tool.id)}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={isFavorite}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: 'clamp(8px, 2vw, 10px) clamp(10px, 3vw, 16px)',
            borderRadius: '12px', border: '1px solid var(--border)',
            background: isFavorite ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
            color: isFavorite ? 'var(--accent)' : 'var(--text)',
            cursor: 'pointer', fontWeight: 600, fontSize: '14px',
            transition: 'all 0.2s', flexShrink: 0, fontFamily: 'DM Sans, sans-serif',
          }}
        >
          <Star size={16} fill={isFavorite ? 'var(--accent)' : 'transparent'} />
          <span className="hide-mobile">{isFavorite ? 'Đã lưu' : 'Lưu'}</span>
        </button>
      </header>

      {/* Tool Content */}
      <div style={{
        padding: 'clamp(16px, 4vw, 32px)',
        flex: 1, maxWidth: '1000px',
        margin: '0 auto', width: '100%',
      }}>
        <div style={{
          background: 'var(--card)',
          padding: 'clamp(20px, 5vw, 32px)',
          borderRadius: 'clamp(16px, 4vw, 24px)',
          border: `1px solid ${tool.color}25`,
          boxShadow: `0 10px 40px rgba(0,0,0,0.15), 0 0 20px ${tool.color}08`,
        }}>
          <Component />
        </div>
      </div>
    </motion.div>
  );
}
