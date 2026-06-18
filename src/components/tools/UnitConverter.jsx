import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = {
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
};

function convertTemp(val, from, to) {
  let celsius;
  if (from === '°C') celsius = val;
  else if (from === '°F') celsius = (val - 32) * 5/9;
  else celsius = val - 273.15;
  if (to === '°C') return celsius;
  if (to === '°F') return celsius * 9/5 + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [cat, setCat] = useState('Độ dài');
  const [val, setVal] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [result, setResult] = useState(null);

  const catData = categories[cat];
  const units = catData.special ? catData.units : Object.keys(catData.units);

  const convert = () => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
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
    const ulist = categories[c].special ? categories[c].units : Object.keys(categories[c].units);
    setFromUnit(ulist[0]);
    setToUnit(ulist[1] || ulist[0]);
    setResult(null);
    setVal('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {Object.entries(categories).map(([name, { icon }]) => (
          <button key={name} onClick={() => switchCat(name)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              cat === name ? 'bg-green-400 text-gray-900 font-semibold' : 'text-green-400 border border-green-400/20 hover:border-green-400/40'
            }`}>
            {icon} {name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 items-end">
        <div>
          <label>Giá trị</label>
          <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Nhập số..." />
        </div>
        <div>
          <label>Từ</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label>Sang</label>
          <select value={toUnit} onChange={e => setToUnit(e.target.value)}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <button className="btn-primary w-full" onClick={convert}>🔄 Chuyển đổi</button>

      <AnimatePresence>
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl text-center"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)' }}
          >
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{val} {fromUnit} =</p>
            <p className="text-3xl font-bold text-green-400 font-mono">
              {result.toLocaleString('vi-VN', { maximumFractionDigits: 6 })} {toUnit}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
