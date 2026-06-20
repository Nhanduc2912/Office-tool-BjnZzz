import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function genPalette(hex) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl(r, g, b);
  return [10, 25, 40, 55, 70, 85, 95].map(l => {
    const light = l / 100;
    const _s = s / 100;
    const c = (1 - Math.abs(2 * light - 1)) * _s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = light - c / 2;
    let rr, gg, bb;
    if (h < 60)      { rr=c; gg=x; bb=0; }
    else if (h < 120){ rr=x; gg=c; bb=0; }
    else if (h < 180){ rr=0; gg=c; bb=x; }
    else if (h < 240){ rr=0; gg=x; bb=c; }
    else if (h < 300){ rr=x; gg=0; bb=c; }
    else             { rr=c; gg=0; bb=x; }
    const toHex = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
  });
}

export default function ColorPicker() {
  const { addToast } = useToast();
  const [color, setColor] = useState('#4ade80');
  const [inputHex, setInputHex] = useState('#4ade80');
  const [palette, setPalette] = useState(genPalette('#4ade80'));

  const updateColor = (hex) => {
    setColor(hex);
    setInputHex(hex);
    setPalette(genPalette(hex));
  };

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast(`Đã sao chép: ${label || text}`, 'success');
  };

  const { r, g, b } = hexToRgb(color);
  const { h, s, l } = rgbToHsl(r, g, b);

  const formats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, 1)` },
    { label: 'CSS var', value: `--color: ${color};` },
    { label: 'Tailwind', value: `[${color}]` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Color Picker + Hex Input */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <label>Chọn màu</label>
          <input
            type="color" value={color}
            onChange={e => updateColor(e.target.value)}
            style={{ width: '80px', height: '80px', padding: '4px', borderRadius: '14px', cursor: 'pointer' }}
          />
        </div>
        <div style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label>Nhập mã HEX</label>
            <input
              value={inputHex}
              onChange={e => {
                setInputHex(e.target.value);
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) updateColor(e.target.value);
              }}
              placeholder="#4ade80"
              style={{ fontFamily: 'JetBrains Mono', letterSpacing: '0.05em' }}
            />
          </div>
          {/* Large color preview swatch */}
          <div style={{
            height: '48px', borderRadius: '12px', background: color,
            border: '1px solid var(--border)',
            boxShadow: `0 4px 20px ${color}40`,
            transition: 'background 0.2s, box-shadow 0.2s',
          }} />
        </div>
      </div>

      {/* Color Format Buttons */}
      <div>
        <label>Sao chép định dạng</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))',
          gap: '8px',
          marginTop: '6px',
        }}>
          {formats.map(f => (
            <motion.button
              key={f.label}
              whileTap={{ scale: 0.96 }}
              onClick={() => copy(f.value, f.label)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.03)', cursor: 'pointer',
                transition: 'all 0.2s', textAlign: 'left', width: '100%',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.background = color + '10'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, flexShrink: 0 }}>{f.label}</span>
              <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '8px', flex: 1, textAlign: 'right' }}>
                {f.value}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Palette */}
      <div>
        <label>Bảng màu tương tự (nhấn để chọn)</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          {palette.map((c, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { updateColor(c); copy(c, 'HEX'); }}
              title={c}
              style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: c, border: color === c ? '3px solid white' : '2px solid transparent',
                cursor: 'pointer', transition: 'border-color 0.2s',
                boxShadow: `0 2px 10px ${c}50`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contrast Checker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{
          padding: '14px', borderRadius: '12px',
          background: color, color: '#000', textAlign: 'center',
          border: '1px solid transparent',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.7 }}>Chữ đen</div>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>Aa Bb 123</div>
        </div>
        <div style={{
          padding: '14px', borderRadius: '12px',
          background: color, color: '#fff', textAlign: 'center',
          border: '1px solid transparent',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.7 }}>Chữ trắng</div>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>Aa Bb 123</div>
        </div>
      </div>
    </div>
  );
}
