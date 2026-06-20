import { useRef, useState, useEffect } from 'react';

// Font imports moved to CSS (not JSX link tag)
const FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Pacifico&family=Caveat:wght@600&family=Sacramento&display=swap');
`;

export default function SignatureTool() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#4ade80');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [mode, setMode] = useState('draw');
  const [typedSig, setTypedSig] = useState('');
  const [font, setFont] = useState('Dancing Script');
  const [empty, setEmpty] = useState(true);
  const [downloaded, setDownloaded] = useState(false);
  const lastPos = useRef(null);

  // Inject Google Fonts safely
  useEffect(() => {
    if (!document.getElementById('sig-fonts')) {
      const style = document.createElement('style');
      style.id = 'sig-fonts';
      style.textContent = FONT_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = e.touches?.[0] || e;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);
    lastPos.current = pos;
    setDrawing(true);
    setEmpty(false);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    setDrawing(false);
    lastPos.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setEmpty(true);
    setTypedSig('');
  };

  const renderTyped = () => {
    if (!typedSig) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `60px '${font}'`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedSig, canvas.width / 2, canvas.height / 2);
    setEmpty(!typedSig);
  };

  const download = (bg) => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    if (bg === 'transparent') {
      link.download = 'signature.png';
      link.href = canvas.toDataURL('image/png');
    } else {
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const octx = offscreen.getContext('2d');
      octx.fillStyle = bg;
      octx.fillRect(0, 0, offscreen.width, offscreen.height);
      octx.drawImage(canvas, 0, 0);
      link.download = `signature-${bg === '#ffffff' ? 'white' : 'black'}.png`;
      link.href = offscreen.toDataURL('image/png');
    }
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
        {['draw', 'type'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer',
              background: mode === m ? 'var(--accent)' : 'transparent',
              color: mode === m ? '#000' : 'var(--text)',
              fontWeight: 600, transition: 'all 0.2s',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {m === 'draw' ? '✏️ Vẽ tay' : '⌨️ Gõ chữ'}
          </button>
        ))}
      </div>

      {/* Type Mode Options */}
      {mode === 'type' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          <div>
            <label>Tên / Chữ ký</label>
            <input value={typedSig} onChange={e => setTypedSig(e.target.value)} placeholder="Nguyễn Văn A" onKeyDown={e => e.key === 'Enter' && renderTyped()} />
          </div>
          <div>
            <label>Font chữ</label>
            <select value={font} onChange={e => setFont(e.target.value)}>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Caveat">Caveat</option>
              <option value="Sacramento">Sacramento</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={renderTyped}>
              ✨ Tạo chữ ký
            </button>
          </div>
        </div>
      )}

      {/* Draw Mode Options */}
      {mode === 'draw' && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 1 auto' }}>
            <label>Màu mực</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '80px' }} />
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label>Độ dày nét: <strong style={{ color: 'var(--accent)' }}>{strokeWidth}px</strong></label>
            <input type="range" min={1} max={10} value={strokeWidth} onChange={e => setStrokeWidth(Number(e.target.value))} />
          </div>
        </div>
      )}

      {/* Canvas */}
      <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '2px dashed rgba(74,222,128,0.3)' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          onMouseDown={mode === 'draw' ? startDraw : undefined}
          onMouseMove={mode === 'draw' ? draw : undefined}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={mode === 'draw' ? startDraw : undefined}
          onTouchMove={mode === 'draw' ? draw : undefined}
          onTouchEnd={stopDraw}
          style={{
            width: '100%', height: '200px',
            cursor: mode === 'draw' ? 'crosshair' : 'default',
            display: 'block', touchAction: 'none',
          }}
        />
        {empty && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <p style={{ fontSize: '14px', color: 'rgba(74,222,128,0.3)', fontStyle: 'italic' }}>
              {mode === 'draw' ? 'Vẽ chữ ký của bạn ở đây...' : 'Chữ ký gõ sẽ hiện ở đây'}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button className="btn-secondary" onClick={clear} style={{ flex: '1 1 80px' }}>🗑️ Xóa</button>
        <button
          className="btn-primary"
          onClick={() => download('transparent')}
          disabled={empty}
          style={{ flex: '2 1 160px' }}
        >
          {downloaded ? '✓ Đã tải' : '⬇ PNG trong suốt'}
        </button>
        <button
          className="btn-secondary"
          onClick={() => download('#ffffff')}
          disabled={empty}
          style={{ flex: '1 1 120px' }}
        >
          ⬇ Nền trắng
        </button>
      </div>
    </div>
  );
}
