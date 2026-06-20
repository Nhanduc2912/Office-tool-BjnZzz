import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

// Static rates relative to USD (updated 2025-06)
const RATES = {
  USD: 1,
  VND: 25450,
  EUR: 0.921,
  GBP: 0.787,
  JPY: 157.8,
  SGD: 1.349,
  KRW: 1381,
  CNY: 7.266,
  AUD: 1.537,
  CAD: 1.364,
  THB: 35.4,
  MYR: 4.718,
  HKD: 7.829,
  TWD: 32.7,
};

const CURRENCY_INFO = {
  USD: { name: 'Đô la Mỹ',          flag: '🇺🇸', symbol: '$' },
  VND: { name: 'Đồng Việt Nam',     flag: '🇻🇳', symbol: '₫' },
  EUR: { name: 'Euro',              flag: '🇪🇺', symbol: '€' },
  GBP: { name: 'Bảng Anh',          flag: '🇬🇧', symbol: '£' },
  JPY: { name: 'Yên Nhật',           flag: '🇯🇵', symbol: '¥' },
  SGD: { name: 'Đô la Singapore',   flag: '🇸🇬', symbol: 'S$' },
  KRW: { name: 'Won Hàn Quốc',      flag: '🇰🇷', symbol: '₩' },
  CNY: { name: 'Nhân dân tệ',       flag: '🇨🇳', symbol: '¥' },
  AUD: { name: 'Đô la Úc',          flag: '🇦🇺', symbol: 'A$' },
  CAD: { name: 'Đô la Canada',      flag: '🇨🇦', symbol: 'C$' },
  THB: { name: 'Baht Thái',          flag: '🇹🇭', symbol: '฿' },
  MYR: { name: 'Ringgit Malaysia',  flag: '🇲🇾', symbol: 'RM' },
  HKD: { name: 'Đô la Hồng Kông',   flag: '🇭🇰', symbol: 'HK$' },
  TWD: { name: 'Đô la Đài Loan',    flag: '🇹🇼', symbol: 'NT$' },
};

const currencies = Object.keys(RATES);

function fmt(val, code) {
  if (val < 0.001) return '0';
  if (val > 1000000) return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(val);
  if (val > 100) return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(val);
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 4 }).format(val);
}

export default function CurrencyConverter() {
  const { addToast } = useToast();
  const [amount, setAmount] = useState('1000000');
  const [from, setFrom] = useState('VND');
  const [to, setTo] = useState('USD');

  const numAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
  const usd = numAmount / RATES[from];
  const result = usd * RATES[to];
  const rate = RATES[to] / RATES[from];

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const copy = (val) => {
    navigator.clipboard.writeText(fmt(val));
    addToast(`Đã sao chép ${fmt(val)} ${to}!`, 'success');
  };

  const CurrencySelect = ({ value, onChange }) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: '15px' }}
    >
      {currencies.map(c => (
        <option key={c} value={c}>
          {CURRENCY_INFO[c].flag} {c} — {CURRENCY_INFO[c].name}
        </option>
      ))}
    </select>
  );

  // Quick amounts
  const quickAmounts = from === 'VND'
    ? [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000]
    : [1, 5, 10, 50, 100];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
          📅 Tỷ giá tham khảo (cập nhật tháng 6/2025). Không phải tỷ giá ngân hàng chính thức — chỉ dùng để tham khảo.
        </p>
      </div>

      {/* Amount Input */}
      <div>
        <label>Số tiền</label>
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          type="number"
          min="0"
          style={{ fontSize: '20px', fontFamily: 'JetBrains Mono', fontWeight: 600 }}
        />
        {/* Quick amounts */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          {quickAmounts.map(q => (
            <button
              key={q}
              onClick={() => setAmount(String(q))}
              style={{
                padding: '4px 10px', borderRadius: '7px', border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.04)', color: 'var(--muted)',
                cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--muted)'; }}
            >
              {new Intl.NumberFormat('vi-VN').format(q)}
            </button>
          ))}
        </div>
      </div>

      {/* Currency Selectors */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 160px' }}>
          <label>Từ</label>
          <CurrencySelect value={from} onChange={setFrom} />
        </div>

        <button
          onClick={swap}
          title="Đổi chiều"
          style={{
            padding: '10px', borderRadius: '10px', border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.05)', color: 'var(--text)',
            cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s',
            flexShrink: 0, height: '44px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          ⇄
        </button>

        <div style={{ flex: '1 1 160px' }}>
          <label>Sang</label>
          <CurrencySelect value={to} onChange={setTo} />
        </div>
      </div>

      {/* Result */}
      <div style={{
        padding: '24px', borderRadius: '20px',
        background: 'rgba(74,222,128,0.06)',
        border: '2px solid rgba(74,222,128,0.2)',
        textAlign: 'center', cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
        onClick={() => copy(result)}
        title="Click để copy"
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)'}
      >
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
          {CURRENCY_INFO[from].flag} {fmt(numAmount)} {from} =
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono', fontWeight: 800,
          fontSize: 'clamp(28px, 6vw, 42px)',
          color: 'var(--accent)', lineHeight: 1, letterSpacing: '-1px',
        }}>
          {CURRENCY_INFO[to].symbol} {fmt(result)}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
          {CURRENCY_INFO[to].flag} {CURRENCY_INFO[to].name}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '12px', opacity: 0.7 }}>
          (Click để copy kết quả)
        </div>
      </div>

      {/* Rate info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '8px',
      }}>
        {[
          [`1 ${from}`, `= ${fmt(rate)} ${to}`],
          [`1 ${to}`,   `= ${fmt(1/rate)} ${from}`],
        ].map(([label, val]) => (
          <div key={label} style={{
            padding: '10px 14px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{label}</span>
            <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono', color: 'var(--text)', fontWeight: 600 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
