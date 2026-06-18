import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 2024 VN personal income tax brackets
const brackets = [
  { max: 5_000_000, rate: 0.05 },
  { max: 10_000_000, rate: 0.10 },
  { max: 18_000_000, rate: 0.15 },
  { max: 32_000_000, rate: 0.20 },
  { max: 52_000_000, rate: 0.25 },
  { max: 80_000_000, rate: 0.30 },
  { max: Infinity, rate: 0.35 },
];

const PERSONAL_DEDUCTION = 11_000_000;
const DEPENDENT_DEDUCTION = 4_400_000;

function calcTax(taxableIncome) {
  let tax = 0;
  let prev = 0;
  for (const { max, rate } of brackets) {
    if (taxableIncome <= prev) break;
    const portion = Math.min(taxableIncome, max) - prev;
    tax += portion * rate;
    prev = max;
  }
  return Math.max(0, tax);
}

function fmt(n) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(n));
}

export default function TaxCalculator() {
  const [grossStr, setGrossStr] = useState('');
  const [dependents, setDependents] = useState(0);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const gross = parseFloat(grossStr.replace(/[^0-9.]/g, ''));
    if (!gross || gross <= 0) return;

    const bhxh = gross * 0.08;
    const bhyt = gross * 0.015;
    const bhtn = gross * 0.01;
    const totalInsurance = bhxh + bhyt + bhtn;
    const afterInsurance = gross - totalInsurance;
    const totalDeduction = PERSONAL_DEDUCTION + dependents * DEPENDENT_DEDUCTION;
    const taxableIncome = Math.max(0, afterInsurance - totalDeduction);
    const tax = calcTax(taxableIncome);
    const net = gross - totalInsurance - tax;

    setResult({ gross, bhxh, bhyt, bhtn, totalInsurance, afterInsurance, totalDeduction, taxableIncome, tax, net });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          🇻🇳 Tính thuế TNCN theo quy định Việt Nam năm 2024 — Giảm trừ bản thân: 11 triệu/tháng, người phụ thuộc: 4.4 triệu/người
        </p>
      </div>

      <div>
        <label>Lương gross (VNĐ/tháng)</label>
        <input
          value={grossStr}
          onChange={e => setGrossStr(e.target.value)}
          placeholder="Ví dụ: 30000000"
          type="number"
        />
      </div>

      <div>
        <label>Số người phụ thuộc: {dependents}</label>
        <input type="range" min={0} max={5} value={dependents} onChange={e => setDependents(Number(e.target.value))} />
      </div>

      <button className="btn-primary w-full" onClick={calculate}>🧮 Tính ngay</button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              {[
                ['💰 Lương gross', result.gross, 'var(--text)'],
                ['🏥 BHXH (8%)', -result.bhxh, '#ef4444'],
                ['🏥 BHYT (1.5%)', -result.bhyt, '#ef4444'],
                ['🏥 BHTN (1%)', -result.bhtn, '#ef4444'],
                ['📉 Thu nhập tính thuế', result.taxableIncome, 'var(--muted)'],
                ['📊 Thuế TNCN', -result.tax, '#f59e0b'],
              ].map(([label, val, color]) => (
                <div key={label} className="p-3 rounded-lg flex justify-between items-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
                  <span className="text-sm font-mono font-semibold" style={{ color }}>
                    {val < 0 ? '-' : ''}{fmt(Math.abs(val))}đ
                  </span>
                </div>
              ))}
            </div>

            <motion.div
              className="p-4 rounded-xl text-center"
              style={{ background: 'rgba(74,222,128,0.1)', border: '2px solid rgba(74,222,128,0.3)' }}
            >
              <p className="text-sm" style={{ color: 'var(--muted)', marginBottom: '4px' }}>Lương NET thực nhận</p>
              <p className="text-3xl font-bold text-green-400" style={{ fontFamily: 'JetBrains Mono' }}>
                {fmt(result.net)}đ
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                Hiệu quả: {Math.round(result.net / result.gross * 100)}% lương gross
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
