import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const shades = [10, 20, 35, 50, 65, 80, 90];
  return shades.map(l => {
    const light = l / 100;
    const _s = s / 100;
    const c = (1 - Math.abs(2 * light - 1)) * _s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = light - c / 2;
    let rr, gg, bb;
    const hh = h;
    if (hh < 60) { rr=c; gg=x; bb=0; }
    else if (hh < 120) { rr=x; gg=c; bb=0; }
    else if (hh < 180) { rr=0; gg=c; bb=x; }
    else if (hh < 240) { rr=0; gg=x; bb=c; }
    else if (hh < 300) { rr=x; gg=0; bb=c; }
    else { rr=c; gg=0; bb=x; }
    const toHex = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
  });
}

export default function ColorPicker() {
  const [color, setColor] = useState('#4ade80');
  const [copied, setCopied] = useState('');
  const [palette, setPalette] = useState(genPalette('#4ade80'));
  const [inputHex, setInputHex] = useState('#4ade80');

  const updateColor = (hex) => {
    setColor(hex);
    setInputHex(hex);
    setPalette(genPalette(hex));
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 1500);
  };

  const { r, g, b } = hexToRgb(color);
  const { h, s, l } = rgbToHsl(r, g, b);

  const formats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'HSL', value: `hsl(${h}, ${s}%, ${l}%)` },
    { label: 'CSS', value: `color: ${color};` },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-4 items-start">
        <div>
          <label>Chọn màu</label>
          <input type="color" value={color} onChange={e => updateColor(e.target.value)}
            style={{ width: '80px', height: '80px', padding: '4px', borderRadius: '12px', cursor: 'pointer' }} />
        </div>
        <div className="flex-1">
          <label>Nhập mã HEX</label>
          <input
            value={inputHex}
            onChange={e => {
              setInputHex(e.target.value);
              if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) updateColor(e.target.value);
            }}
            placeholder="#4ade80"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {formats.map(f => (
          <motion.button
            key={f.label}
            whileTap={{ scale: 0.96 }}
            onClick={() => copy(f.value)}
            className="flex justify-between items-center p-3 rounded-lg text-left transition-all"
            style={{
              background: copied === f.value ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${copied === f.value ? 'rgba(74,222,128,0.4)' : 'var(--border)'}`,
            }}
          >
            <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{f.label}</span>
            <span className="text-sm font-mono text-green-400 truncate ml-2">{f.value}</span>
          </motion.button>
        ))}
      </div>

      <div>
        <label>Bảng màu tương tự</label>
        <div className="flex gap-2 flex-wrap">
          {palette.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { updateColor(c); copy(c); }}
              className="cursor-pointer rounded-lg"
              style={{ width: '44px', height: '44px', background: c, border: '2px solid transparent', transition: 'border-color 0.2s' }}
              title={c}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
