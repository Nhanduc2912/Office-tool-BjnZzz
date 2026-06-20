import { useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';

const DIRECTIONS = [
  { value: '90deg',       label: '→ Ngang phải' },
  { value: '270deg',      label: '← Ngang trái' },
  { value: '180deg',      label: '↓ Dọc xuống' },
  { value: '0deg',        label: '↑ Dọc lên' },
  { value: '135deg',      label: '↘ Chéo xuống' },
  { value: '45deg',       label: '↗ Chéo lên' },
  { value: 'radial',      label: '○ Radial' },
];

const PRESETS = [
  { name: 'Sunset',   colors: ['#f97316', '#ec4899', '#8b5cf6'] },
  { name: 'Ocean',    colors: ['#06b6d4', '#3b82f6', '#8b5cf6'] },
  { name: 'Forest',   colors: ['#4ade80', '#059669', '#0f766e'] },
  { name: 'Fire',     colors: ['#fbbf24', '#f97316', '#ef4444'] },
  { name: 'Night',    colors: ['#1e1b4b', '#312e81', '#4338ca'] },
  { name: 'OfficeKit',colors: ['#4ade80', '#22c55e', '#0d9488'] },
  { name: 'Candy',    colors: ['#f472b6', '#e879f9', '#a78bfa'] },
  { name: 'Aurora',   colors: ['#34d399', '#60a5fa', '#a78bfa'] },
];

export default function GradientGenerator() {
  const { addToast } = useToast();
  const [colors, setColors] = useState(['#4ade80', '#60a5fa']);
  const [direction, setDirection] = useState('90deg');
  const [copied, setCopied] = useState('');

  const gradient = useMemo(() => {
    const stops = colors.join(', ');
    if (direction === 'radial') return `radial-gradient(circle, ${stops})`;
    return `linear-gradient(${direction}, ${stops})`;
  }, [colors, direction]);

  const cssCode = `background: ${gradient};`;
  const tailwindCode = direction === 'radial'
    ? `/* Use custom CSS for radial gradients */`
    : `bg-gradient-to-${direction === '90deg' ? 'r' : direction === '270deg' ? 'l' : direction === '180deg' ? 'b' : direction === '0deg' ? 't' : direction === '135deg' ? 'br' : 'tr'} from-[${colors[0]}]${colors[1] ? ` via-[${colors[1]}]` : ''} to-[${colors[colors.length-1]}]`;

  const addColor = () => {
    if (colors.length < 5) setColors([...colors, '#f59e0b']);
  };

  const removeColor = (i) => {
    if (colors.length <= 2) return;
    setColors(colors.filter((_, idx) => idx !== i));
  };

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    addToast(`Đã sao chép ${label}!`, 'success');
    setTimeout(() => setCopied(''), 2000);
  };

  const usePreset = (preset) => {
    setColors(preset.colors);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Gradient Preview */}
      <div style={{
        height: 'clamp(120px, 30vw, 180px)',
        borderRadius: '18px',
        background: gradient,
        border: '1px solid var(--border)',
        transition: 'background 0.3s ease',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }} />

      {/* Presets */}
      <div>
        <label>Preset nhanh</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => usePreset(p)}
              title={p.name}
              style={{
                width: '40px', height: '24px', borderRadius: '6px', cursor: 'pointer',
                border: '2px solid rgba(255,255,255,0.1)',
                background: `linear-gradient(90deg, ${p.colors.join(', ')})`,
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
          ))}
        </div>
      </div>

      {/* Color Stops */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ marginBottom: 0 }}>Màu sắc ({colors.length} màu)</label>
          {colors.length < 5 && (
            <button
              onClick={addColor}
              style={{
                padding: '4px 12px', borderRadius: '6px', border: 'none',
                background: 'rgba(74,222,128,0.1)', color: 'var(--accent)',
                cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              + Thêm màu
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {colors.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <input
                type="color"
                value={c}
                onChange={e => {
                  const next = [...colors];
                  next[i] = e.target.value;
                  setColors(next);
                }}
                style={{ width: '56px', height: '56px', cursor: 'pointer', borderRadius: '12px', padding: '4px' }}
              />
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>{c}</div>
              {colors.length > 2 && (
                <button
                  onClick={() => removeColor(i)}
                  style={{
                    background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444',
                    cursor: 'pointer', borderRadius: '6px', padding: '2px 8px',
                    fontSize: '11px', fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Direction */}
      <div>
        <label>Hướng gradient</label>
        <select value={direction} onChange={e => setDirection(e.target.value)}>
          {DIRECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>

      {/* CSS Output */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ marginBottom: 0, color: 'var(--accent)', fontWeight: 700 }}>CSS Code</label>
          <button
            onClick={() => copy(cssCode, 'CSS')}
            style={{
              padding: '5px 12px', borderRadius: '6px', border: 'none',
              background: copied === 'CSS' ? 'rgba(74,222,128,0.2)' : 'rgba(74,222,128,0.1)',
              color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
            }}
          >
            {copied === 'CSS' ? '✓ Đã copy' : '📋 Copy CSS'}
          </button>
        </div>
        <div style={{
          padding: '14px', borderRadius: '10px',
          background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
          fontFamily: 'JetBrains Mono', fontSize: '13px', color: '#a78bfa',
          wordBreak: 'break-all', lineHeight: 1.6,
          userSelect: 'all',
        }}>
          {cssCode}
        </div>
      </div>

      {/* Extra CSS custom properties */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => copy(`background: ${gradient};\nborder-radius: 12px;`, 'CSS block')} className="btn-secondary" style={{ fontSize: '13px', flex: '1 1 160px' }}>
          Copy với border-radius
        </button>
        <button onClick={() => copy(gradient, 'giá trị gradient')} className="btn-secondary" style={{ fontSize: '13px', flex: '1 1 160px' }}>
          Copy giá trị gradient
        </button>
      </div>
    </div>
  );
}
