import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Dashboard({ tools, categories, activeCategory, search, setSearch }) {
  const navigate = useNavigate();

  const filteredTools = tools.filter(t => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      t.name.toLowerCase().includes(q) ||
      t.desc.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q));
    const matchesCategory = activeCategory === 'all' || t.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryName = categories.find(c => c.id === activeCategory)?.name || 'Tất cả';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

      {/* Top Header */}
      <header style={{
        padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 32px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg2)', backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 30, gap: '12px', flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>
            {categoryName}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
            {filteredTools.length} công cụ{activeCategory !== 'all' ? ' chuyên biệt' : ''}
          </p>
        </div>

        <div style={{ position: 'relative', width: 'min(300px, 100%)', flex: '1 1 200px', maxWidth: '320px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
          <input
            id="tool-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm công cụ..."
            aria-label="Tìm kiếm công cụ"
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              borderRadius: '10px', border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '14px',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Xóa tìm kiếm"
              style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer',
                fontSize: '16px', padding: '2px',
              }}
            >✕</button>
          )}
        </div>
      </header>

      {/* Tool Grid */}
      <div style={{ padding: 'clamp(16px, 4vw, 32px)', flex: 1 }}>
        <AnimatePresence mode="wait">
          {filteredTools.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '80px 0' }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>Không tìm thấy công cụ</h3>
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: '14px' }}>
                Thử tìm với từ khóa khác hoặc xóa bộ lọc.
              </p>
              <button
                onClick={() => setSearch('')}
                style={{
                  marginTop: '16px', padding: '10px 24px', borderRadius: '10px',
                  background: 'var(--accent)', color: '#000', border: 'none',
                  fontWeight: 700, cursor: 'pointer', fontSize: '14px',
                }}
              >
                Xóa tìm kiếm
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                gap: 'clamp(12px, 3vw, 20px)',
              }}
            >
              <AnimatePresence>
                {filteredTools.map((tool, index) => (
                  <motion.article
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(index * 0.025, 0.3), duration: 0.25 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/tool/${tool.id}`)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${tool.name}: ${tool.desc}`}
                    onKeyDown={e => e.key === 'Enter' && navigate(`/tool/${tool.id}`)}
                    style={{
                      cursor: 'pointer', borderRadius: '16px', padding: 'clamp(14px, 3vw, 20px)',
                      background: 'var(--card)', border: '1px solid rgba(74,222,128,0.1)',
                      backdropFilter: 'blur(12px)', transition: 'border-color 0.2s, box-shadow 0.2s',
                      display: 'flex', flexDirection: 'column',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = tool.color + '55';
                      e.currentTarget.style.boxShadow = `0 0 24px ${tool.color}15`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(74,222,128,0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '28px', lineHeight: 1, flexShrink: 0 }}>{tool.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontFamily: 'Syne,sans-serif', fontWeight: 700,
                          fontSize: '15px', margin: '0 0 4px', color: 'var(--text)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {tool.name}
                        </h3>
                        <p style={{
                          fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.5,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {tool.desc}
                        </p>
                      </div>
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {tool.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '10px', padding: '2px 8px', borderRadius: '999px',
                            background: tool.color + '15', color: tool.color,
                            border: `1px solid ${tool.color}30`, fontWeight: 600,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
