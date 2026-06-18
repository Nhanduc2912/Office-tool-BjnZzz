import { useState } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import ToolView from './pages/ToolView';
import About from './pages/About';
import Guide from './pages/Guide';

import { tools, categories } from './data/tools';

export default function App() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSearch('');
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      {/* Sidebar Layout */}
      <motion.aside
        initial={{ x:-260 }}
        animate={{ x:0 }}
        style={{
          width:'260px', borderRight:'1px solid var(--border)',
          background:'rgba(10,15,13,0.95)', display:'flex', flexDirection:'column',
          position:'fixed', top:0, bottom:0, left:0, zIndex:40
        }}
      >
        <div style={{ padding:'24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>⚡</div>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'20px', color:'var(--accent)', margin:0 }}>OfficeKit</h1>
            <div style={{ fontSize:'11px', color:'var(--muted)' }}>v3.0 • React Router</div>
          </div>
        </div>

        <nav style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'4px', flex:1, overflowY:'auto' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'8px', paddingLeft:'8px' }}>Điều hướng</div>
          
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ x:4, background:'rgba(255,255,255,0.05)' }}
              whileTap={{ scale:0.98 }}
              style={{
                display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px',
                borderRadius:'10px', border:'none', cursor:'pointer', textAlign:'left',
                background: location.pathname === '/' && activeCategory === 'all' ? 'var(--accent)' : 'transparent',
                color: location.pathname === '/' && activeCategory === 'all' ? '#000' : 'var(--text)',
                fontWeight: location.pathname === '/' && activeCategory === 'all' ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onClick={() => handleCategoryClick('all')}
            >
              <span style={{ fontSize:'18px' }}>🌌</span>
              <span style={{ fontSize:'14px' }}>Trang chủ Dashboard</span>
            </motion.div>
          </Link>

          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', margin:'16px 0 8px', paddingLeft:'8px' }}>Danh mục Công cụ</div>
          {categories.filter(c => c.id !== 'all').map(cat => (
            <motion.button
              key={cat.id}
              whileHover={{ x:4, background:'rgba(255,255,255,0.05)' }}
              whileTap={{ scale:0.98 }}
              onClick={() => handleCategoryClick(cat.id)}
              style={{
                display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px',
                borderRadius:'10px', border:'none', cursor:'pointer', textAlign:'left',
                background: location.pathname === '/' && activeCategory === cat.id ? 'var(--accent)' : 'transparent',
                color: location.pathname === '/' && activeCategory === cat.id ? '#000' : 'var(--text)',
                fontWeight: location.pathname === '/' && activeCategory === cat.id ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize:'18px' }}>{cat.icon}</span>
              <span style={{ fontSize:'14px' }}>{cat.name}</span>
            </motion.button>
          ))}

          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', margin:'16px 0 8px', paddingLeft:'8px' }}>Hỗ trợ</div>
          
          <Link to="/guide" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ x:4, background:'rgba(255,255,255,0.05)' }}
              whileTap={{ scale:0.98 }}
              style={{
                display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px',
                borderRadius:'10px', border:'none', cursor:'pointer', textAlign:'left',
                background: location.pathname === '/guide' ? 'var(--accent)' : 'transparent',
                color: location.pathname === '/guide' ? '#000' : 'var(--text)',
                fontWeight: location.pathname === '/guide' ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize:'18px' }}>📖</span>
              <span style={{ fontSize:'14px' }}>Hướng dẫn sử dụng</span>
            </motion.div>
          </Link>

          <Link to="/about" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ x:4, background:'rgba(255,255,255,0.05)' }}
              whileTap={{ scale:0.98 }}
              style={{
                display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px',
                borderRadius:'10px', border:'none', cursor:'pointer', textAlign:'left',
                background: location.pathname === '/about' ? 'var(--accent)' : 'transparent',
                color: location.pathname === '/about' ? '#000' : 'var(--text)',
                fontWeight: location.pathname === '/about' ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize:'18px' }}>✨</span>
              <span style={{ fontSize:'14px' }}>Về dự án</span>
            </motion.div>
          </Link>
        </nav>
        
        <div style={{ padding:'20px', borderTop:'1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize:'12px', color:'var(--muted)', lineHeight:1.5 }}>
             Mọi file được xử lý an toàn 100% ngay trên trình duyệt của bạn.
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="https://github.com/Nhanduc2912" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', transition: 'color 0.2s', textDecoration: 'none', fontSize: '18px' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'} title="GitHub">
              🐙
            </a>
            <a href="https://ducnguyener.top" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', transition: 'color 0.2s', textDecoration: 'none', fontSize: '18px' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'} title="Website">
              🌐
            </a>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main style={{ flex:1, marginLeft:'260px', display:'flex', flexDirection:'column', minHeight:'100vh', position:'relative' }}>
        
        {/* Router View */}
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                tools={tools} 
                categories={categories} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
                search={search} 
                setSearch={setSearch} 
              />
            } 
          />
          <Route path="/tool/:id" element={<ToolView />} />
          <Route path="/about" element={<About />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>

        {/* Footer */}
        <footer style={{ borderTop:'1px solid var(--border)', padding:'24px', textAlign:'center', background: 'rgba(10,15,13,0.8)', marginTop: 'auto' }}>
          <p style={{ fontSize:'13px', color:'var(--muted)', margin:'0 0 12px' }}>
            © {new Date().getFullYear()} <span style={{ color:'var(--accent)', fontWeight:600 }}>OfficeKit</span> — Developed by <a href="https://ducnguyener.top" target="_blank" rel="noreferrer" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>ducnguyener.top</a>.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <a href="https://github.com/Nhanduc2912" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
              <span style={{ fontSize: '16px' }}>🐙</span> GitHub
            </a>
            <a href="https://ducnguyener.top" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
              <span style={{ fontSize: '16px' }}>🌐</span> Website
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
