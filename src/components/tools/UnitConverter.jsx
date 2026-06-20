import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = {
  'Độ dài': {
    icon: '📏',
    units: { 'km': 1000, 'm': 1, 'cm': 0.01, 'mm': 0.001, 'inch': 0.0254, 'foot': 0.3048, 'yard': 0.9144, 'mile': 1609.34 },
  },
  'Khối lượng': {
    icon: '⚖️',
    units: { 'tấn': 1000, 'kg': 1, 'g': 0.001, 'mg': 0.000001, 'lb': 0.453592, 'oz': 0.028350 },
  },
  'Nhiệt độ': {
    icon: '🌡️',
    special: true,
    units: ['°C', '°F', 'K'],
  },
  'Diện tích': {
    icon: '📐',
    units: { 'km²': 1e6, 'm²': 1, 'cm²': 0.0001, 'ha': 10000, 'acre': 4046.86, 'ft²': 0.0929 },
  },
  'Tốc độ': {
    icon: '🚀',
    units: { 'km/h': 1, 'm/s': 3.6, 'mph': 1.60934, 'knot': 1.852 },
  },
  'Lưu trữ': {
    icon: '💾',
    units: { 'TB': 1e12, 'GB': 1e9, 'MB': 1e6, 'KB': 1e3, 'B': 1 },
  },
  'Thể tích': {
    icon: '🫙',
    units: { 'L': 1, 'mL': 0.001, 'gallon': 3.78541, 'quart': 0.946353, 'cup': 0.236588, 'fl.oz': 0.0295735, 'm³': 1000 },
  },
};

function convertTemp(val, from, to) {
  let celsius;
  if (from === '°C')      celsius = val;
  else if (from === '°F') celsius = (val - 32) * 5 / 9;
  else                    celsius = val - 273.15;
  if (to === '°C')       return celsius;
  if (to === '°F')       return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

function fmtResult(n) {
  if (Math.abs(n) === 0) return '0';
  if (Math.abs(n) < 0.0001) return n.toExponential(4);
  if (Math.abs(n) > 1e10)   return n.toExponential(4);
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 6 }).format(n);
}

export default function UnitConverter() {
  const { addToast } = useToast();
  const [cat, setCat]         = useState('Độ dài');
  const [val, setVal]         = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit]   = useState('km');
  const [result, setResult]   = useState(null);

  const catData = CATEGORIES[cat];
  const units = catData.special ? catData.units : Object.keys(catData.units);

  const convert = () => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      addToast('Nhập một số hợp lệ để chuyển đổi.', 'warning');
      return;
    }
    let res;
    if (catData.special) {
      res = convertTemp(num, fromUnit, toUnit);
    } else {
      const base = num * catData.units[fromUnit];
      res = base / catData.units[toUnit];
    }
    setResult(res);
  };

  const switchCat = (c) => {
    setCat(c);
    const ulist = CATEGORIES[c].special ? CATEGORIES[c].units : Object.keys(CATEGORIES[c].units);
    setFromUnit(ulist[0]);
    setToUnit(ulist[1] || ulist[0]);
    setResult(null);
    setVal('');
  };

  const swap = () => {
    const tmp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tmp);
    setResult(null);
  };

  const copy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(`${fmtResult(result)} ${toUnit}`);
      addToast('Đã sao chép kết quả!', 'success');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {Object.entries(CATEGORIES).map(([name, { icon }]) => (
          <button
            key={name}
            onClick={() => switchCat(name)}
            style={{
              padding: '7px 12px', borderRadius: '10px', border: 'none',
              background: cat === name ? 'var(--accent)' : 'rgba(74,222,128,0.08)',
              color: cat === name ? '#000' : 'var(--accent)',
              border: `1px solid ${cat === name ? 'transparent' : 'rgba(74,222,128,0.2)'}`,
              fontWeight: cat === name ? 700 : 500,
              cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {icon} {name}
          </button>
        ))}
      </div>

      {/* Conversion Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px', alignItems: 'flex-end' }}>
        <div>
          <label>Giá trị</label>
          <input
            type="number" value={val}
            onChange={e => { setVal(e.target.value); setResult(null); }}
            onKeyDown={e => e.key === 'Enter' && convert()}
            placeholder="Nhập số..."
            style={{ fontSize: '16px', fontFamily: 'JetBrains Mono' }}
          />
        </div>

        <button
          onClick={swap}
          title="Đổi chiều"
          style={{
            padding: '10px', borderRadius: '10px', border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.05)', color: 'var(--text)',
            cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s',
            flexShrink: 0, height: '44px', alignSelf: 'flex-end',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          ⇄
        </button>

        <div>
          <label>Đơn vị đích</label>
          <select value={toUnit} onChange={e => { setToUnit(e.target.value); setResult(null); }}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* From Unit Select */}
      <div>
        <label>Đơn vị nguồn</label>
        <select value={fromUnit} onChange={e => { setFromUnit(e.target.value); setResult(null); }}>
          {units.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      <button className="btn-primary" onClick={convert} style={{ width: '100%', fontSize: '15px' }}>
        🔄 Chuyển đổi
      </button>

      <AnimatePresence>
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
              padding: '24px', borderRadius: '18px', textAlign: 'center',
              background: 'rgba(74,222,128,0.06)', border: '2px solid rgba(74,222,128,0.25)',
              cursor: 'pointer',
            }}
            onClick={copy}
            title="Click để sao chép"
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.25)'}
          >
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 6px' }}>
              {val} {fromUnit} =
            </p>
            <p style={{
              fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 800,
              color: 'var(--accent)', fontFamily: 'JetBrains Mono',
              margin: '0 0 6px', letterSpacing: '-1px',
            }}>
              {fmtResult(result)} {toUnit}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, opacity: 0.7 }}>
              (Click để sao chép)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
