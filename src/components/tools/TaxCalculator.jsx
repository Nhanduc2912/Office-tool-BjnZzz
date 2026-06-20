import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

// 2024 VN personal income tax brackets
const brackets = [
  { max: 5_000_000,  rate: 0.05 },
  { max: 10_000_000, rate: 0.10 },
  { max: 18_000_000, rate: 0.15 },
  { max: 32_000_000, rate: 0.20 },
  { max: 52_000_000, rate: 0.25 },
  { max: 80_000_000, rate: 0.30 },
  { max: Infinity,   rate: 0.35 },
];

const PERSONAL_DEDUCTION  = 11_000_000;
const DEPENDENT_DEDUCTION = 4_400_000;

function calcTax(taxableIncome) {
  let tax = 0, prev = 0;
  for (const { max, rate } of brackets) {
    if (taxableIncome <= prev) break;
    tax += (Math.min(taxableIncome, max) - prev) * rate;
    prev = max;
  }
  return Math.max(0, tax);
}

function fmt(n) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(n));
}

export default function TaxCalculator() {
  const { addToast } = useToast();
  const [grossStr, setGrossStr] = useState('');
  const [dependents, setDependents] = useState(0);
  const [result, setResult] = useState(null);

  const calculate = () => {
    const gross = parseFloat(grossStr.replace(/[^0-9.]/g, ''));
    if (!gross || gross <= 0) {
      addToast('Vui lòng nhập lương gross hợp lệ.', 'warning');
      return;
    }
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

  const effRate = result ? Math.round((result.tax / result.gross) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(74,222,128,0.06)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--muted)', margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
          🇻🇳 Tính thuế TNCN theo quy định Việt Nam 2024 — Giảm trừ bản thân: 11tr/tháng · Người phụ thuộc: 4.4tr/người
        </p>
      </div>

      {/* Inputs */}
      <div>
        <label>Lương Gross (VNĐ/tháng)</label>
        <input
          value={grossStr}
          onChange={e => setGrossStr(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && calculate()}
          placeholder="Ví dụ: 30000000"
          type="number"
          min="0"
        />
      </div>

      <div>
        <label>Số người phụ thuộc: <strong style={{ color: 'var(--accent)' }}>{dependents} người</strong></label>
        <input
          type="range" min={0} max={5} value={dependents}
          onChange={e => setDependents(Number(e.target.value))}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
          {[0,1,2,3,4,5].map(n => <span key={n}>{n}</span>)}
        </div>
      </div>

      <button className="btn-primary w-full" onClick={calculate} style={{ width: '100%' }}>
        🧮 Tính ngay
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {/* Detail rows — 1 column on mobile, 2 on larger */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
              gap: '8px',
            }}>
              {[
                ['💰 Lương Gross', result.gross, 'var(--text)'],
                ['🏥 BHXH (8%)',   -result.bhxh,  '#ef4444'],
                ['🏥 BHYT (1.5%)', -result.bhyt,  '#ef4444'],
                ['🏥 BHTN (1%)',   -result.bhtn,  '#ef4444'],
                ['📉 Thu nhập tính thuế', result.taxableIncome, 'var(--muted)'],
                [`📊 Thuế TNCN (hiệu quả ${effRate}%)`, -result.tax, '#f59e0b'],
              ].map(([label, val, color]) => (
                <div
                  key={label}
                  style={{
                    padding: '12px', borderRadius: '10px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--muted)', flex: 1 }}>{label}</span>
                  <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono', fontWeight: 600, color, flexShrink: 0 }}>
                    {val < 0 ? '-' : ''}{fmt(Math.abs(val))}đ
                  </span>
                </div>
              ))}
            </div>

            {/* Net Result */}
            <motion.div
              className="p-4 rounded-xl text-center"
              style={{
                padding: '20px', textAlign: 'center',
                background: 'rgba(74,222,128,0.08)',
                border: '2px solid rgba(74,222,128,0.25)',
                borderRadius: '16px',
              }}
            >
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px', margin: '0 0 6px' }}>
                Lương NET thực nhận hàng tháng
              </p>
              <p style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'JetBrains Mono', margin: '0 0 6px', letterSpacing: '-1px' }}>
                {fmt(result.net)}đ
              </p>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                Hiệu quả lương: {Math.round(result.net / result.gross * 100)}% gross
                {' · '}Bảo hiểm: {fmt(result.totalInsurance)}đ
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
