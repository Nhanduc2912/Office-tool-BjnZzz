import { useState } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Image as ImageIcon, Code, Wrench, CircleDollarSign, BookOpen, Info, Moon, Sun, Star, Clock, Palette } from 'lucide-react';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ToolView from './pages/ToolView';
import About from './pages/About';
import Guide from './pages/Guide';
import ImageStudio from './pages/ImageStudio';

import { tools, categories } from './data/tools';
import { useAppContext } from './context/AppContext';

const CATEGORY_ICONS = {
  doc: <FileText size={18} />,
  img: <ImageIcon size={18} />,
  dev: <Code size={18} />,
  utility: <Wrench size={18} />,
  finance: <CircleDollarSign size={18} />
};

export default function App() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, favorites, recent } = useAppContext();

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSearch('');
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  if (location.pathname === '/') {
    return <Landing />;
  }

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
        <div style={{ padding:'24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent: 'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>⚡</div>
            <div>
              <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'20px', color:'var(--accent)', margin:0 }}>OfficeKit</h1>
              <div style={{ fontSize:'11px', color:'var(--muted)' }}>v4.0 • Studio Edition</div>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex' }}
            title={theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <nav style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'4px', flex:1, overflowY:'auto' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'8px', paddingLeft:'8px' }}>Điều hướng</div>
          
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ x:4, background:'rgba(255,255,255,0.05)' }}
              whileTap={{ scale:0.98 }}
              style={{
                display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px',
                borderRadius:'10px', border:'none', cursor:'pointer', textAlign:'left',
                background: location.pathname === '/dashboard' && activeCategory === 'all' ? 'var(--accent)' : 'transparent',
                color: location.pathname === '/dashboard' && activeCategory === 'all' ? '#000' : 'var(--text)',
                fontWeight: location.pathname === '/dashboard' && activeCategory === 'all' ? 600 : 500,
                transition: 'all 0.2s'
              }}
              onClick={() => handleCategoryClick('all')}
            >
              <LayoutDashboard size={18} />
              <span style={{ fontSize:'14px' }}>Tất cả Công cụ</span>
            </motion.div>
          </Link>

          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', margin:'16px 0 8px', paddingLeft:'8px' }}>Pro Workspaces</div>
          
          <Link to="/image-studio" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ x:4, background:'rgba(255,255,255,0.05)' }}
              whileTap={{ scale:0.98 }}
              style={{
                display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px',
                borderRadius:'10px', border:'none', cursor:'pointer', textAlign:'left',
                background: location.pathname === '/image-studio' ? 'var(--accent)' : 'transparent',
                color: location.pathname === '/image-studio' ? '#000' : 'var(--text)',
                fontWeight: location.pathname === '/image-studio' ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              <Palette size={18} />
              <span style={{ fontSize:'14px' }}>Image Studio Pro</span>
            </motion.div>
          </Link>

          {(favorites.length > 0 || recent.length > 0) && (
            <>
              <div style={{ fontSize:'11px', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', margin:'16px 0 8px', paddingLeft:'8px' }}>Yêu thích & Gần đây</div>
              
              {favorites.map(id => {
                const t = tools.find(x => x.id === id);
                if(!t) return null;
                return (
                  <Link key={`fav-${id}`} to={`/tool/${id}`} style={{ textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{ x:4, background:'rgba(255,255,255,0.05)' }}
                      whileTap={{ scale:0.98 }}
                      style={{
                        display:'flex', alignItems:'center', gap:'12px', padding:'8px 12px',
                        borderRadius:'10px', color: 'var(--text)', transition: 'all 0.2s'
                      }}
                    >
                      <Star size={16} fill="var(--accent)" color="var(--accent)" />
                      <span style={{ fontSize:'13px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.name}</span>
                    </motion.div>
                  </Link>
                );
              })}

              {recent.filter(id => !favorites.includes(id)).map(id => {
                const t = tools.find(x => x.id === id);
                if(!t) return null;
                return (
                  <Link key={`rec-${id}`} to={`/tool/${id}`} style={{ textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{ x:4, background:'rgba(255,255,255,0.05)' }}
                      whileTap={{ scale:0.98 }}
                      style={{
                        display:'flex', alignItems:'center', gap:'12px', padding:'8px 12px',
                        borderRadius:'10px', color: 'var(--muted)', transition: 'all 0.2s'
                      }}
                    >
                      <Clock size={16} />
                      <span style={{ fontSize:'13px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </>
          )}

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
                background: location.pathname === '/dashboard' && activeCategory === cat.id ? 'var(--accent)' : 'transparent',
                color: location.pathname === '/dashboard' && activeCategory === cat.id ? '#000' : 'var(--text)',
                fontWeight: location.pathname === '/dashboard' && activeCategory === cat.id ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              {CATEGORY_ICONS[cat.id]}
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
              <BookOpen size={18} />
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
              <Info size={18} />
              <span style={{ fontSize:'14px' }}>Về dự án</span>
            </motion.div>
          </Link>
        </nav>
        
        <div style={{ padding:'20px', borderTop:'1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize:'12px', color:'var(--muted)', lineHeight:1.5 }}>
             Mọi file được xử lý an toàn 100% ngay trên trình duyệt của bạn.
          </div>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="https://github.com/Nhanduc2912" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', transition: 'color 0.2s', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: '20px' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'} title="GitHub">
              🐙
            </a>
            <a href="https://ducnguyener.top" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', transition: 'color 0.2s', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: '20px' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'} title="Website">
              🌐
            </a>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main style={{ flex:1, marginLeft:'260px', display:'flex', flexDirection:'column', minHeight:'100vh', position:'relative' }}>
        
        {/* Router View */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/image-studio" element={<ImageStudio />} />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                tools={tools} 
                categories={categories} 
                activeCategory={activeCategory} 
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
