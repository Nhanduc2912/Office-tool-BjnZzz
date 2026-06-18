import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ tools, categories, activeCategory, search, setSearch }) {
  const navigate = useNavigate();

  const filteredTools = tools.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.desc.toLowerCase().includes(search.toLowerCase()) ||
                          t.tags.some(tag => tag.includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || t.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{ padding:'20px 32px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(10,15,13,0.8)', backdropFilter:'blur(10px)', position:'sticky', top:0, zIndex:30 }}>
        <div>
          <h2 style={{ margin:0, fontSize:'20px', fontWeight:700, fontFamily:'Syne,sans-serif' }}>
            {categories.find(c => c.id === activeCategory)?.name}
          </h2>
          <p style={{ margin:'4px 0 0', fontSize:'13px', color:'var(--muted)' }}>
            {activeCategory === 'all' ? 'Khám phá tất cả công cụ' : 'Công cụ chuyên biệt'}
          </p>
        </div>
        
        <div style={{ position:'relative', width:'300px' }}>
          <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', fontSize:'14px' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, mô tả, chức năng..."
            style={{ width:'100%', padding:'10px 12px 10px 36px', borderRadius:'10px', border:'1px solid var(--border)', background:'rgba(255,255,255,0.03)', color:'var(--text)', fontSize:'14px' }}
          />
        </div>
      </header>

      {/* Content Grid */}
      <div style={{ padding:'32px', flex:1 }}>
        <motion.section layout>
          {filteredTools.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:'48px', marginBottom:'16px' }}>📭</div>
              <h3 style={{ margin:'0 0 8px', fontSize:'18px' }}>Không tìm thấy công cụ</h3>
              <p style={{ color:'var(--muted)', margin:0, fontSize:'14px' }}>Thử tìm với từ khóa khác hoặc xóa bộ lọc.</p>
            </motion.div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px' }}>
              <AnimatePresence>
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity:0, scale:0.95 }}
                    animate={{ opacity:1, scale:1 }}
                    exit={{ opacity:0, scale:0.95 }}
                    transition={{ delay:index*0.03, duration:0.3 }}
                    whileHover={{ y:-4, scale:1.02 }}
                    whileTap={{ scale:0.98 }}
                    onClick={() => navigate(`/tool/${tool.id}`)}
                    style={{
                      cursor:'pointer', borderRadius:'16px', padding:'20px',
                      background:'rgba(20,31,24,0.6)', border:'1px solid rgba(74,222,128,0.1)',
                      backdropFilter:'blur(12px)', transition:'border-color 0.2s, box-shadow 0.2s',
                      display: 'flex', flexDirection: 'column'
                    }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=tool.color+'55'; e.currentTarget.style.boxShadow=`0 0 20px ${tool.color}15`; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(74,222,128,0.1)'; e.currentTarget.style.boxShadow='none'; }}
                  >
                    <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'12px' }}>
                      <div style={{ fontSize:'28px', lineHeight:1 }}>{tool.emoji}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'15px', margin:'0 0 3px', color:'var(--text)' }}>{tool.name}</h3>
                        <p style={{ fontSize:'12px', color:'var(--muted)', margin:0, lineHeight:1.5 }}>{tool.desc}</p>
                      </div>
                    </div>
                    <div style={{ marginTop:'auto', display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      {tool.tags.map(tag=>(
                        <span key={tag} style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'999px', background:tool.color+'15', color:tool.color, border:`1px solid ${tool.color}30`, fontWeight:600 }}>{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
