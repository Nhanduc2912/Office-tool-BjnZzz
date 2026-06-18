import { useRef, useState, useEffect } from 'react';

export default function SignatureTool() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#4ade80');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [mode, setMode] = useState('draw'); // draw | type
  const [typedSig, setTypedSig] = useState('');
  const [font, setFont] = useState('Dancing Script');
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'transparent';
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
    setEmpty(false);
    e.preventDefault();
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    e.preventDefault();
  };

  const stopDraw = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setEmpty(true);
  };

  const renderTyped = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `56px '${font}'`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedSig, canvas.width / 2, canvas.height / 2);
    setEmpty(!typedSig);
  };

  const download = (format) => {
    const canvas = canvasRef.current;
    if (format === 'png') {
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      const link = document.createElement('a');
      link.download = 'signature-white.png';
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const octx = offscreen.getContext('2d');
      octx.fillStyle = '#ffffff';
      octx.fillRect(0, 0, offscreen.width, offscreen.height);
      octx.drawImage(canvas, 0, 0);
      link.href = offscreen.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Pacifico&family=Caveat:wght@600&family=Sacramento&display=swap" rel="stylesheet" />

      <div className="flex gap-2">
        {['draw', 'type'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m ? 'bg-green-400 text-gray-900' : 'text-green-400 border border-green-400/20'
            }`}>
            {m === 'draw' ? '✏️ Vẽ tay' : '⌨️ Gõ chữ'}
          </button>
        ))}
      </div>

      {mode === 'type' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label>Tên / Chữ ký</label>
            <input value={typedSig} onChange={e => setTypedSig(e.target.value)} placeholder="Nguyễn Văn A" />
          </div>
          <div>
            <label>Font chữ ký</label>
            <select value={font} onChange={e => setFont(e.target.value)}>
              <option value="Dancing Script">Dancing Script</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Caveat">Caveat</option>
              <option value="Sacramento">Sacramento</option>
            </select>
          </div>
          <div className="col-span-2">
            <button className="btn-secondary w-full" onClick={renderTyped}>Tạo chữ ký</button>
          </div>
        </div>
      )}

      {mode === 'draw' && (
        <div className="grid grid-cols-3 gap-3">
          <div><label>Màu mực</label><input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ height: '42px', padding: '4px' }} /></div>
          <div><label>Độ dày: {strokeWidth}px</label><input type="range" min={1} max={8} value={strokeWidth} onChange={e => setStrokeWidth(Number(e.target.value))} /></div>
        </div>
      )}

      <div className="relative rounded-xl overflow-hidden" style={{ border: '2px dashed rgba(74,222,128,0.3)' }}>
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
            width: '100%',
            height: '200px',
            cursor: mode === 'draw' ? 'crosshair' : 'default',
            display: 'block',
          }}
        />
        {empty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm" style={{ color: 'rgba(74,222,128,0.3)' }}>
              {mode === 'draw' ? 'Vẽ chữ ký của bạn ở đây...' : 'Chữ ký sẽ hiển thị ở đây'}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button className="btn-secondary flex-1" onClick={clear}>🗑️ Xóa</button>
        <button className="btn-primary flex-1" onClick={() => download('png')} disabled={empty}>⬇ PNG trong suốt</button>
        <button className="btn-secondary flex-1" onClick={() => download('white')} disabled={empty}>⬇ PNG trắng</button>
      </div>
    </div>
  );
}
