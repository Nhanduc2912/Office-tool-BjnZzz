import { useParams, useNavigate, Link } from 'react-router-dom';
import { tools } from '../data/tools';
import { motion } from 'framer-motion';

export default function ToolView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tool = tools.find(t => t.id === id);

  if (!tool) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Không tìm thấy công cụ này</h2>
        <Link to="/" style={{ color: 'var(--accent)' }}>Quay lại Trang chủ</Link>
      </div>
    );
  }

  const Component = tool.component;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <header style={{ padding:'24px 32px', borderBottom:'1px solid var(--border)', background:'rgba(10,15,13,0.8)', backdropFilter:'blur(10px)', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}
        >
          ←
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{tool.emoji}</span>
            <div>
              <h2 style={{ margin:0, fontSize:'24px', fontWeight:700, fontFamily:'Syne,sans-serif' }}>
                {tool.name}
              </h2>
              <p style={{ margin:'4px 0 0', fontSize:'14px', color:'var(--muted)' }}>
                {tool.desc}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div style={{ padding: '32px', flex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <div style={{ background: 'var(--card)', padding: '32px', borderRadius: '24px', border: `1px solid ${tool.color}30`, boxShadow: `0 10px 40px rgba(0,0,0,0.2), 0 0 20px ${tool.color}10` }}>
          <Component />
        </div>
      </div>
    </motion.div>
  );
}
