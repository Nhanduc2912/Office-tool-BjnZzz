import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import existing tools
import QRGenerator from './components/tools/QRGenerator';
import ImageConverter from './components/tools/ImageConverter';
import ImageCompressor from './components/tools/ImageCompressor';
import PasswordGenerator from './components/tools/PasswordGenerator';
import ColorPicker from './components/tools/ColorPicker';
import PomodoroTimer from './components/tools/PomodoroTimer';
import TextTools from './components/tools/TextTools';
import TaxCalculator from './components/tools/TaxCalculator';
import SignatureTool from './components/tools/SignatureTool';
import UnitConverter from './components/tools/UnitConverter';
import MergePDF from './components/tools/MergePDF';
import SplitPDF from './components/tools/SplitPDF';
import ExcelJSONConverter from './components/tools/ExcelJSONConverter';
import WordToPDF from './components/tools/WordToPDF';
import ImageOCR from './components/tools/ImageOCR';
import JsonFormatter from './components/tools/JsonFormatter';
import Base64Tool from './components/tools/Base64Tool';
import CompoundInterest from './components/tools/CompoundInterest';
import LoremIpsum from './components/tools/LoremIpsum';
import BmiCalculator from './components/tools/BmiCalculator';
import BcryptTool from './components/tools/BcryptTool';

const categories = [
  { id: 'all', name: 'Tất cả', icon: '🌌' },
  { id: 'doc', name: 'Tài liệu & PDF', icon: '📄' },
  { id: 'img', name: 'Hình ảnh', icon: '🖼️' },
  { id: 'dev', name: 'Lập trình & Data', icon: '💻' },
  { id: 'utility', name: 'Tiện ích', icon: '🧰' },
  { id: 'finance', name: 'Tài chính', icon: '💰' },
];

const tools = [
  { id:'bcrypt', categoryId:'dev', name:'Bcrypt Generator', desc:'Tạo và kiểm tra mã băm Bcrypt', emoji:'🛡️', component:BcryptTool, tags:['bảo mật','mã hóa','lập trình'], color:'#8b5cf6' },
  { id:'json-format', categoryId:'dev', name:'JSON Formatter', desc:'Làm đẹp, nén và kiểm tra lỗi file JSON', emoji:'{ }', component:JsonFormatter, tags:['dữ liệu','json','lập trình'], color:'#fcd34d' },
  { id:'base64', categoryId:'dev', name:'Base64 Encode', desc:'Mã hóa và giải mã chuỗi Base64', emoji:'🔒', component:Base64Tool, tags:['bảo mật','chuỗi','lập trình'], color:'#6ee7b7' },
  { id:'excel-json', categoryId:'dev', name:'Excel & JSON', desc:'Chuyển đổi qua lại giữa Bảng tính và JSON', emoji:'📊', component:ExcelJSONConverter, tags:['dữ liệu','excel','json'], color:'#10b981' },
  { id:'color', categoryId:'dev', name:'Bảng màu', desc:'HEX, RGB, HSL và palette', emoji:'🎨', component:ColorPicker, tags:['thiết kế','màu sắc'], color:'#f472b6' },

  { id:'word-pdf', categoryId:'doc', name:'Word sang PDF', desc:'Chuyển file .docx thành định dạng PDF', emoji:'📝', component:WordToPDF, tags:['tài liệu','pdf','word'], color:'#3b82f6' },
  { id:'merge-pdf', categoryId:'doc', name:'Gộp PDF', desc:'Ghép nhiều file PDF thành 1 file duy nhất', emoji:'📑', component:MergePDF, tags:['tài liệu','pdf','gộp'], color:'#3b82f6' },
  { id:'split-pdf', categoryId:'doc', name:'Tách PDF', desc:'Trích xuất các trang từ file PDF', emoji:'✂️', component:SplitPDF, tags:['tài liệu','pdf','tách'], color:'#ef4444' },
  { id:'signature', categoryId:'doc', name:'Chữ ký số', desc:'Vẽ tay hoặc gõ, xuất PNG trong suốt', emoji:'✍️', component:SignatureTool, tags:['tài liệu','chữ ký'], color:'#818cf8' },
  
  { id:'image-ocr', categoryId:'img', name:'Trích xuất chữ (OCR)', desc:'Lấy văn bản từ hình ảnh (Hỗ trợ Tiếng Việt)', emoji:'👁️', component:ImageOCR, tags:['ảnh','văn bản','ocr'], color:'#f472b6' },
  { id:'img-compress', categoryId:'img', name:'Nén ảnh', desc:'Giảm dung lượng không mất chất lượng', emoji:'📦', component:ImageCompressor, tags:['ảnh','tối ưu'], color:'#f59e0b' },
  { id:'img-convert', categoryId:'img', name:'Chuyển đổi ảnh', desc:'PNG, JPG, WebP, BMP, GIF', emoji:'🔄', component:ImageConverter, tags:['ảnh','chuyển đổi'], color:'#60a5fa' },
  
  { id:'compound-interest', categoryId:'finance', name:'Lãi suất kép', desc:'Tính toán lợi nhuận đầu tư và tiết kiệm', emoji:'📈', component:CompoundInterest, tags:['tài chính','đầu tư'], color:'#34d399' },
  { id:'tax', categoryId:'finance', name:'Tính thuế TNCN', desc:'Lương gross → net theo luật VN', emoji:'🧮', component:TaxCalculator, tags:['tài chính','việt nam'], color:'#fbbf24' },

  { id:'lorem-ipsum', categoryId:'utility', name:'Tạo Lorem Ipsum', desc:'Tạo đoạn văn bản giả để thiết kế', emoji:'📃', component:LoremIpsum, tags:['tiện ích','văn bản'], color:'#a78bfa' },
  { id:'bmi', categoryId:'utility', name:'Tính chỉ số BMI', desc:'Kiểm tra tình trạng sức khỏe cơ thể', emoji:'⚖️', component:BmiCalculator, tags:['sức khỏe','tiện ích'], color:'#f87171' },
  { id:'qr', categoryId:'utility', name:'Tạo mã QR', desc:'URL, WiFi, danh thiếp, văn bản', emoji:'▣', component:QRGenerator, tags:['tiện ích','chia sẻ'], color:'#4ade80' },
  { id:'password', categoryId:'utility', name:'Tạo mật khẩu', desc:'Mật khẩu mạnh và bảo mật', emoji:'🔑', component:PasswordGenerator, tags:['bảo mật'], color:'#a78bfa' },
  { id:'pomodoro', categoryId:'utility', name:'Pomodoro Timer', desc:'Tập trung làm việc hiệu quả', emoji:'🍅', component:PomodoroTimer, tags:['năng suất'], color:'#ef4444' },
  { id:'text', categoryId:'utility', name:'Công cụ Text', desc:'Đếm từ, chuyển chữ hoa/thường, sắp xếp', emoji:'📝', component:TextTools, tags:['văn bản','tiện ích'], color:'#34d399' },
  { id:'convert', categoryId:'utility', name:'Đổi đơn vị', desc:'Độ dài, khối lượng, nhiệt độ...', emoji:'📐', component:UnitConverter, tags:['đo lường','tính toán'], color:'#2dd4bf' },
];

function ToolCard({ tool, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.95 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ delay:index*0.03, duration:0.3 }}
      whileHover={{ y:-4, scale:1.02 }}
      whileTap={{ scale:0.98 }}
      onClick={() => onClick(tool)}
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
  );
}

function ToolModal({ tool, onClose }) {
  const Component = tool.component;
  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}
      style={{
        position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'flex-start',
        justifyContent:'center', paddingTop:'40px', paddingBottom:'40px',
        background:'rgba(0,0,0,0.8)', backdropFilter:'blur(12px)', overflowY:'auto',
      }}
    >
      <motion.div
        initial={{ opacity:0, scale:0.95, y:20 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95, y:20 }}
        transition={{ type:'spring', damping:25, stiffness:300 }}
        style={{
          width:'100%', maxWidth:'640px', margin:'0 16px',
          background:'var(--card)', borderRadius:'20px',
          border:`1px solid ${tool.color}40`, boxShadow:`0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${tool.color}15`,
          overflow:'hidden',
        }}
      >
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid var(--border)', background:`${tool.color}08` }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <span style={{ fontSize:'24px' }}>{tool.emoji}</span>
            <div>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'17px', margin:0 }}>{tool.name}</h2>
              <p style={{ fontSize:'12px', color:'var(--muted)', margin:0 }}>{tool.desc}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate:90, background:'rgba(255,255,255,0.1)' }}
            whileTap={{ scale:0.9 }}
            onClick={onClose}
            style={{ width:'32px', height:'32px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.05)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontSize:'16px', flexShrink:0, transition:'background 0.2s' }}
          >✕</motion.button>
        </div>
        <div style={{ padding:'24px' }}>
          <Component />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [activeTool, setActiveTool] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    document.body.style.overflow = activeTool ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeTool]);

  const filteredTools = tools.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.desc.toLowerCase().includes(search.toLowerCase()) ||
                          t.tags.some(tag => tag.includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || t.categoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
            <div style={{ fontSize:'11px', color:'var(--muted)' }}>v2.0 • Local Tools</div>
          </div>
        </div>

        <nav style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'4px', flex:1, overflowY:'auto' }}>
          <div style={{ fontSize:'11px', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'8px', paddingLeft:'8px' }}>Danh mục</div>
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              whileHover={{ x:4, background:'rgba(255,255,255,0.05)' }}
              whileTap={{ scale:0.98 }}
              onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
              style={{
                display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px',
                borderRadius:'10px', border:'none', cursor:'pointer', textAlign:'left',
                background: activeCategory === cat.id ? 'var(--accent)' : 'transparent',
                color: activeCategory === cat.id ? '#000' : 'var(--text)',
                fontWeight: activeCategory === cat.id ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize:'18px' }}>{cat.icon}</span>
              <span style={{ fontSize:'14px' }}>{cat.name}</span>
            </motion.button>
          ))}
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
                  {filteredTools.map((tool, i) => (
                    <ToolCard key={tool.id} tool={tool} index={i} onClick={setActiveTool} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.section>
        </div>

        {/* Footer */}
        <footer style={{ borderTop:'1px solid var(--border)', padding:'24px', textAlign:'center', background: 'rgba(10,15,13,0.8)' }}>
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

      {/* Modal */}
      <AnimatePresence>
        {activeTool && <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />}
      </AnimatePresence>
    </div>
  );
}
