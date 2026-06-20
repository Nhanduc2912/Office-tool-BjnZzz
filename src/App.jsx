import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Image as ImageIcon, Code, Wrench,
  CircleDollarSign, BookOpen, Info, Moon, Sun, Star, Clock,
  Palette, Menu, X
} from 'lucide-react';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ToolView from './pages/ToolView';
import About from './pages/About';
import Guide from './pages/Guide';
import ImageStudio from './pages/ImageStudio';

import { tools, categories } from './data/tools';
import { useAppContext } from './context/AppContext';

const CATEGORY_ICONS = {
  doc:     <FileText size={18} />,
  img:     <ImageIcon size={18} />,
  dev:     <Code size={18} />,
  utility: <Wrench size={18} />,
  finance: <CircleDollarSign size={18} />,
};

export default function App() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, favorites, recent } = useAppContext();

  // Responsive detection
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSearch('');
    if (location.pathname !== '/dashboard') navigate('/dashboard');
  };

  if (location.pathname === '/') return <Landing />;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{
        padding: '20px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            flexShrink: 0,
          }}>⚡</div>
          <div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '18px', color: 'var(--accent)', margin: 0 }}>OfficeKit</h1>
            <div style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 1 }}>v4.0 Studio</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text)',
              cursor: 'pointer', padding: '6px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Đóng menu"
              style={{
                background: 'transparent', border: 'none', color: 'var(--muted)',
                cursor: 'pointer', padding: '6px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, overflowY: 'auto' }}>
        
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '8px 0 6px', paddingLeft: '8px' }}>
          Điều hướng
        </div>

        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div
            className={`sidebar-nav-item ${location.pathname === '/dashboard' && activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('all')}
            role="button"
          >
            <LayoutDashboard size={17} />
            <span>Tất cả Công cụ</span>
          </div>
        </Link>

        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '12px 0 6px', paddingLeft: '8px' }}>
          Pro Workspace
        </div>

        <Link to="/image-studio" style={{ textDecoration: 'none' }}>
          <div className={`sidebar-nav-item ${location.pathname === '/image-studio' ? 'active' : ''}`} role="button">
            <Palette size={17} />
            <span>Image Studio Pro</span>
          </div>
        </Link>

        {(favorites.length > 0 || recent.length > 0) && (
          <>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '12px 0 6px', paddingLeft: '8px' }}>
              Yêu thích & Gần đây
            </div>

            {favorites.map(id => {
              const t = tools.find(x => x.id === id);
              if (!t) return null;
              return (
                <Link key={`fav-${id}`} to={`/tool/${id}`} style={{ textDecoration: 'none' }}>
                  <div className={`sidebar-nav-item ${location.pathname === `/tool/${id}` ? 'active' : ''}`} role="button">
                    <Star size={15} fill="var(--accent)" color="var(--accent)" />
                    <span style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                  </div>
                </Link>
              );
            })}

            {recent.filter(id => !favorites.includes(id)).map(id => {
              const t = tools.find(x => x.id === id);
              if (!t) return null;
              return (
                <Link key={`rec-${id}`} to={`/tool/${id}`} style={{ textDecoration: 'none' }}>
                  <div className={`sidebar-nav-item ${location.pathname === `/tool/${id}` ? 'active' : ''}`} role="button">
                    <Clock size={15} color="var(--muted)" />
                    <span style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--muted)' }}>{t.name}</span>
                  </div>
                </Link>
              );
            })}
          </>
        )}

        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '12px 0 6px', paddingLeft: '8px' }}>
          Danh mục
        </div>

        {categories.filter(c => c.id !== 'all').map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`sidebar-nav-item ${location.pathname === '/dashboard' && activeCategory === cat.id ? 'active' : ''}`}
            style={{ color: location.pathname === '/dashboard' && activeCategory === cat.id ? '#000' : 'var(--text)' }}
          >
            {CATEGORY_ICONS[cat.id]}
            <span>{cat.name}</span>
            <span style={{
              marginLeft: 'auto', fontSize: '11px', fontWeight: 600,
              background: 'rgba(255,255,255,0.08)', padding: '1px 6px',
              borderRadius: '999px', color: 'var(--muted)',
            }}>
              {tools.filter(t => t.categoryId === cat.id).length}
            </span>
          </button>
        ))}

        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '12px 0 6px', paddingLeft: '8px' }}>
          Hỗ trợ
        </div>

        <Link to="/guide" style={{ textDecoration: 'none' }}>
          <div className={`sidebar-nav-item ${location.pathname === '/guide' ? 'active' : ''}`} role="button">
            <BookOpen size={17} />
            <span>Hướng dẫn sử dụng</span>
          </div>
        </Link>

        <Link to="/about" style={{ textDecoration: 'none' }}>
          <div className={`sidebar-nav-item ${location.pathname === '/about' ? 'active' : ''}`} role="button">
            <Info size={17} />
            <span>Về dự án</span>
          </div>
        </Link>
      </nav>

      {/* Footer of sidebar */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '10px' }}>
          🔒 Xử lý an toàn 100% tại trình duyệt của bạn.
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <a
            href="https://github.com/Nhanduc2912" target="_blank" rel="noreferrer"
            aria-label="GitHub"
            style={{ color: 'var(--muted)', transition: 'color 0.2s', textDecoration: 'none', fontSize: '20px' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
          >🐙</a>
          <a
            href="https://ducnguyener.top" target="_blank" rel="noreferrer"
            aria-label="Website cá nhân"
            style={{ color: 'var(--muted)', transition: 'color 0.2s', textDecoration: 'none', fontSize: '20px' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
          >🌐</a>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── MOBILE OVERLAY ── */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 45,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside
        aria-label="Thanh điều hướng"
        style={{
          width: '260px',
          borderRight: '1px solid var(--border)',
          background: 'var(--bg2)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: isMobile && !sidebarOpen ? 'translateX(-260px)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'hidden',
        }}
      >
        {sidebarContent}
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      {isMobile && (
        <header
          style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            height: '60px', background: 'var(--bg2)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', padding: '0 16px',
            zIndex: 40, gap: '12px',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu"
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
              color: 'var(--text)', cursor: 'pointer', padding: '8px',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}
          >
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '18px', color: 'var(--accent)' }}>
              OfficeKit
            </span>
          </div>
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
            style={{
              marginLeft: 'auto', background: 'transparent', border: 'none',
              color: 'var(--text)', cursor: 'pointer', padding: '8px',
              borderRadius: '8px', display: 'flex', alignItems: 'center',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
      )}

      {/* ── MAIN CONTENT ── */}
      <main style={{
        flex: 1,
        marginLeft: isMobile ? 0 : '260px',
        marginTop: isMobile ? '60px' : 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: isMobile ? 'calc(100vh - 60px)' : '100vh',
        position: 'relative',
      }}>
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
        <footer style={{
          borderTop: '1px solid var(--border)', padding: '20px 24px',
          textAlign: 'center', background: 'rgba(10,15,13,0.5)', marginTop: 'auto',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 10px' }}>
            © {new Date().getFullYear()}{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>OfficeKit</span>{' '}
            — Developed by{' '}
            <a href="https://ducnguyener.top" target="_blank" rel="noreferrer" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>
              ducnguyener.top
            </a>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <a href="https://github.com/Nhanduc2912" target="_blank" rel="noreferrer"
               style={{ color: 'var(--muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none' }}
               onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <span style={{ fontSize: '16px' }}>🐙</span> GitHub
            </a>
            <a href="https://ducnguyener.top" target="_blank" rel="noreferrer"
               style={{ color: 'var(--muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textDecoration: 'none' }}
               onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
               onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
            >
              <span style={{ fontSize: '16px' }}>🌐</span> Website
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
