import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const tools = [
  { id:'qr', name:'Tạo mã QR', desc:'URL, WiFi, danh thiếp, văn bản', emoji:'▣', component:QRGenerator, tags:['tiện ích','chia sẻ'], color:'#4ade80' },
  { id:'img-convert', name:'Chuyển đổi ảnh', desc:'PNG, JPG, WebP, BMP, GIF', emoji:'🔄', component:ImageConverter, tags:['ảnh','chuyển đổi'], color:'#60a5fa' },
  { id:'img-compress', name:'Nén ảnh', desc:'Giảm dung lượng không mất chất lượng', emoji:'📦', component:ImageCompressor, tags:['ảnh','tối ưu'], color:'#f59e0b' },
  { id:'password', name:'Tạo mật khẩu', desc:'Mật khẩu mạnh và bảo mật', emoji:'🔑', component:PasswordGenerator, tags:['bảo mật'], color:'#a78bfa' },
  { id:'color', name:'Bảng màu', desc:'HEX, RGB, HSL và palette', emoji:'🎨', component:ColorPicker, tags:['thiết kế','màu sắc'], color:'#f472b6' },
  { id:'pomodoro', name:'Pomodoro Timer', desc:'Tập trung làm việc hiệu quả', emoji:'🍅', component:PomodoroTimer, tags:['năng suất'], color:'#ef4444' },
  { id:'text', name:'Công cụ Text', desc:'Đếm từ, chuyển chữ hoa/thường, sắp xếp', emoji:'📝', component:TextTools, tags:['văn bản','tiện ích'], color:'#34d399' },
  { id:'tax', name:'Tính thuế TNCN', desc:'Lương gross → net theo luật VN 2024', emoji:'🧮', component:TaxCalculator, tags:['tài chính','việt nam'], color:'#fbbf24' },
  { id:'signature', name:'Chữ ký số', desc:'Vẽ tay hoặc gõ, xuất PNG', emoji:'✍️', component:SignatureTool, tags:['tài liệu','chữ ký'], color:'#818cf8' },
  { id:'convert', name:'Đổi đơn vị', desc:'Độ dài, khối lượng, nhiệt độ...', emoji:'📐', component:UnitConverter, tags:['đo lường','tính toán'], color:'#2dd4bf' },
];

function Particle({ x, y, size, delay, duration }) {
  return (
    <motion.div
      style={{ position:'absolute', width:size, height:size, borderRadius:'50%', background:'rgba(74,222,128,0.12)', left:`${x}%`, top:`${y}%`, pointerEvents:'none' }}
      animate={{ y:[0,-25,0], opacity:[0.2,0.7,0.2] }}
      transition={{ duration, repeat:Infinity, delay, ease:'easeInOut' }}
    />
  );
}

const particles = Array.from({length:18},(_,i)=>({
  id:i, x:Math.random()*100, y:Math.random()*100,
  size:Math.random()*3+1, delay:Math.random()*5, duration:Math.random()*5+4,
}));

function ToolCard({ tool, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity:0, y:24 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:index*0.07, duration:0.4 }}
      whileHover={{ y:-6, scale:1.025 }}
      whileTap={{ scale:0.97 }}
      onClick={() => onClick(tool)}
      style={{
        cursor:'pointer', borderRadius:'16px', padding:'20px',
        background:'rgba(20,31,24,0.85)', border:'1px solid rgba(74,222,128,0.1)',
        backdropFilter:'blur(12px)', transition:'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=tool.color+'55'; e.currentTarget.style.boxShadow=`0 0 28px ${tool.color}18`; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(74,222,128,0.1)'; e.currentTarget.style.boxShadow='none'; }}
    >
      <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'12px' }}>
        <div style={{ fontSize:'28px', lineHeight:1 }}>{tool.emoji}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'15px', margin:'0 0 3px', color:'var(--text)' }}>{tool.name}</h3>
          <p style={{ fontSize:'12px', color:'var(--muted)', margin:0, lineHeight:1.5 }}>{tool.desc}</p>
        </div>
      </div>
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
        {tool.tags.map(tag=>(
          <span key={tag} style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'999px', background:tool.color+'18', color:tool.color, border:`1px solid ${tool.color}30`, fontWeight:500 }}>{tag}</span>
        ))}
      </div>
      <div style={{ fontSize:'12px', color:tool.color, fontWeight:600, display:'flex', alignItems:'center', gap:'4px' }}>
        Mở công cụ
        <motion.span animate={{ x:[0,4,0] }} transition={{ duration:1.5, repeat:Infinity }}>→</motion.span>
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
        position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'flex-start',
        justifyContent:'center', paddingTop:'60px', paddingBottom:'40px',
        background:'rgba(0,0,0,0.75)', backdropFilter:'blur(10px)', overflowY:'auto',
      }}
    >
      <motion.div
        initial={{ opacity:0, scale:0.88, y:32 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.88, y:32 }}
        transition={{ type:'spring', damping:26, stiffness:320 }}
        style={{
          width:'100%', maxWidth:'640px', margin:'0 16px',
          background:'var(--card)', borderRadius:'20px',
          border:`1px solid ${tool.color}45`, boxShadow:`0 0 60px ${tool.color}20`,
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
            whileHover={{ rotate:90, background:'rgba(255,255,255,0.12)' }}
            whileTap={{ scale:0.9 }}
            onClick={onClose}
            style={{ width:'32px', height:'32px', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.07)', border:'1px solid var(--border)', color:'var(--muted)', cursor:'pointer', fontSize:'16px', flexShrink:0, transition:'background 0.2s' }}
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeTool ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeTool]);

  const filtered = tools.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some(tag => tag.includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight:'100vh', position:'relative' }}>
      {/* Particles */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
        {particles.map(p => <Particle key={p.id} {...p} />)}
        <div style={{ position:'absolute', top:'-150px', right:'-150px', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-150px', left:'-150px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)', pointerEvents:'none' }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity:0, y:-20 }}
        animate={{ opacity:1, y:0 }}
        style={{
          position:'sticky', top:0, zIndex:40,
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          background: scrolled ? 'rgba(10,15,13,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition:'all 0.3s',
        }}
      >
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <motion.div
              whileHover={{ rotate:15 }}
              style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(74,222,128,0.18)', border:'1px solid rgba(74,222,128,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}
            >⚡</motion.div>
            <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'20px', color:'var(--accent)' }}>OfficeKit</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'var(--muted)' }}>
            <span>{tools.length} công cụ miễn phí</span>
            <motion.div
              animate={{ scale:[1,1.4,1], opacity:[1,0.5,1] }}
              transition={{ duration:2, repeat:Infinity }}
              style={{ width:'7px', height:'7px', borderRadius:'50%', background:'var(--accent)' }}
            />
          </div>
        </div>
      </motion.header>

      <main style={{ maxWidth:'1200px', margin:'0 auto', padding:'50px 24px 80px', position:'relative', zIndex:1 }}>

        {/* Hero */}
        <section style={{ textAlign:'center', marginBottom:'64px' }}>
          <motion.div
            initial={{ opacity:0, scale:0.85 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.1 }}
            style={{ display:'inline-block', padding:'5px 16px', borderRadius:'999px', background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.3)', fontSize:'12px', color:'var(--accent)', marginBottom:'24px', fontWeight:600, letterSpacing:'0.05em' }}
          >
            ✦ Miễn phí · Không đăng ký · Không quảng cáo · Bảo mật tuyệt đối
          </motion.div>

          <motion.h1
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2 }}
            style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'clamp(30px, 5vw, 60px)', lineHeight:1.1, margin:'0 0 20px' }}
          >
            Công cụ văn phòng<br />
            <span style={{ color:'var(--accent)' }}>tất cả trong một</span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.3 }}
            style={{ fontSize:'16px', color:'var(--muted)', maxWidth:'480px', margin:'0 auto 36px', lineHeight:1.7 }}
          >
            Bộ công cụ tiện ích dành cho dân văn phòng Việt — không cần đăng nhập, không cần cài đặt, chạy ngay trên trình duyệt.
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.4 }}
            style={{ maxWidth:'420px', margin:'0 auto', position:'relative' }}
          >
            <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'16px', pointerEvents:'none' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm công cụ..."
              style={{ paddingLeft:'44px', fontSize:'15px', height:'48px' }}
            />
          </motion.div>
        </section>

        {/* Tools Grid */}
        <motion.section layout>
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'64px 0' }}>
              <div style={{ fontSize:'40px', marginBottom:'12px' }}>🔍</div>
              <p style={{ color:'var(--muted)' }}>Không tìm thấy công cụ phù hợp</p>
            </motion.div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'16px' }}>
              {filtered.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} onClick={setActiveTool} />
              ))}
            </div>
          )}
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.9 }}
          style={{ marginTop:'64px' }}
        >
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'12px' }}>
            {[
              ['⚡','Siêu nhanh','Xử lý trực tiếp trên trình duyệt, không upload server'],
              ['🔒','Riêng tư tuyệt đối','Dữ liệu không rời khỏi thiết bị của bạn'],
              ['🌐','Mọi thiết bị','Tương thích PC, tablet, điện thoại'],
              ['♾️','Miễn phí mãi mãi','Không giới hạn, không cần tài khoản'],
            ].map(([icon,title,desc],i)=>(
              <motion.div
                key={i}
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:1+i*0.1 }}
                style={{ padding:'16px', borderRadius:'14px', textAlign:'center', background:'rgba(255,255,255,0.025)', border:'1px solid var(--border)' }}
              >
                <div style={{ fontSize:'22px', marginBottom:'8px' }}>{icon}</div>
                <h4 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'13px', margin:'0 0 4px' }}>{title}</h4>
                <p style={{ fontSize:'11px', color:'var(--muted)', margin:0, lineHeight:1.5 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid var(--border)', padding:'24px', textAlign:'center', position:'relative', zIndex:1 }}>
        <p style={{ fontSize:'13px', color:'var(--muted)', margin:0 }}>
          © {new Date().getFullYear()} <span style={{ color:'var(--accent)', fontWeight:600 }}>OfficeKit</span> — Made with ❤️ for the Vietnamese office community. All tools run locally in your browser.
        </p>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {activeTool && <ToolModal tool={activeTool} onClose={() => setActiveTool(null)} />}
      </AnimatePresence>
    </div>
  );
}
