import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Math.round(n));
const fmtNum = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n));

function calcMonthly(principal, annualRate, months) {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function LoanCalculator() {
  const [principal, setPrincipal]   = useState(500_000_000);
  const [rate, setRate]             = useState(9.5);
  const [term, setTerm]             = useState(20);
  const [termUnit, setTermUnit]     = useState('years');
  const [showTable, setShowTable]   = useState(false);

  const months = termUnit === 'years' ? term * 12 : term;

  const { monthly, totalPaid, totalInterest, schedule } = useMemo(() => {
    if (!principal || !months) return { monthly: 0, totalPaid: 0, totalInterest: 0, schedule: [] };
    const m = calcMonthly(principal, rate, months);
    const total = m * months;
    const interest = total - principal;
    const r = rate / 100 / 12;
    let balance = principal;
    const sched = [];
    for (let i = 1; i <= Math.min(months, 24); i++) {
      const interestPmt = balance * r;
      const principalPmt = m - interestPmt;
      balance -= principalPmt;
      sched.push({ month: i, payment: m, principal: principalPmt, interest: interestPmt, balance: Math.max(0, balance) });
    }
    return { monthly: m, totalPaid: total, totalInterest: interest, schedule: sched };
  }, [principal, rate, months]);

  const interestRatio = totalPaid > 0 ? (totalInterest / totalPaid * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        <div>
          <label>Số tiền vay (VNĐ)</label>
          <input
            type="number" value={principal}
            onChange={e => setPrincipal(Number(e.target.value))}
            min="0" step="1000000"
          />
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0' }}>
            ≈ {fmtNum(principal / 1_000_000)} triệu
          </p>
        </div>
        <div>
          <label>Lãi suất (%/năm)</label>
          <input
            type="number" value={rate}
            onChange={e => setRate(Number(e.target.value))}
            min="0" max="50" step="0.1"
          />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ marginBottom: 0 }}>Kỳ hạn vay</label>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '2px' }}>
              {['years', 'months'].map(u => (
                <button
                  key={u}
                  onClick={() => setTermUnit(u)}
                  style={{
                    padding: '3px 10px', border: 'none', borderRadius: '4px',
                    background: termUnit === u ? 'var(--accent)' : 'transparent',
                    color: termUnit === u ? '#000' : 'var(--muted)',
                    cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {u === 'years' ? 'Năm' : 'Tháng'}
                </button>
              ))}
            </div>
          </div>
          <input
            type="number" value={term}
            onChange={e => setTerm(Number(e.target.value))}
            min="1" max={termUnit === 'years' ? 30 : 360}
          />
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0' }}>
            {termUnit === 'years' ? `${months} tháng` : `${Math.round(term/12 * 10) / 10} năm`}
          </p>
        </div>
      </div>

      {/* Results */}
      {monthly > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* Main Result */}
          <div style={{
            padding: '24px', borderRadius: '20px', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(74,222,128,0.12), rgba(96,165,250,0.08))',
            border: '2px solid rgba(74,222,128,0.25)', marginBottom: '12px',
          }}>
            <p style={{ color: 'var(--muted)', margin: '0 0 6px', fontSize: '13px' }}>Trả hàng tháng</p>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 'clamp(28px, 6vw, 40px)', color: 'var(--accent)', letterSpacing: '-1px' }}>
              {fmt(monthly)}
            </div>
          </div>

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px', marginBottom: '12px' }}>
            {[
              { label: 'Tổng trả',     value: fmt(totalPaid),    color: 'var(--text)' },
              { label: 'Tiền gốc',     value: fmt(principal),    color: '#60a5fa' },
              { label: 'Tổng lãi',     value: fmt(totalInterest), color: '#f59e0b' },
              { label: 'Lãi / Tổng',   value: `${interestRatio.toFixed(1)}%`, color: '#ef4444' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                padding: '14px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              }}>
                <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--muted)' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color, fontFamily: 'JetBrains Mono' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Progress bar: principal vs interest */}
          <div style={{ borderRadius: '10px', border: '1px solid var(--border)', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
              <span>🔵 Tiền gốc ({(100 - interestRatio).toFixed(0)}%)</span>
              <span>🟡 Tiền lãi ({interestRatio.toFixed(0)}%)</span>
            </div>
            <div style={{ height: '10px', borderRadius: '999px', background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${100 - interestRatio}%`, background: '#60a5fa', borderRadius: '999px', transition: 'width 0.5s' }} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Amortization Table */}
      {monthly > 0 && (
        <div>
          <button
            onClick={() => setShowTable(t => !t)}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            {showTable ? '▲ Ẩn' : '▼ Xem'} bảng trả nợ ({months <= 24 ? months : 24} tháng đầu)
          </button>

          <AnimatePresence>
            {showTable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginTop: '8px' }}
              >
                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(74,222,128,0.06)' }}>
                        {['Tháng', 'Trả/tháng', 'Gốc', 'Lãi', 'Dư nợ'].map(h => (
                          <th key={h} style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map(row => (
                        <tr key={row.month} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--muted)', fontFamily: 'JetBrains Mono' }}>{row.month}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{fmtNum(row.payment)}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', color: '#60a5fa' }}>{fmtNum(row.principal)}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', color: '#f59e0b' }}>{fmtNum(row.interest)}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono', color: 'var(--muted)' }}>{fmtNum(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {months > 24 && (
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', textAlign: 'center' }}>
                    * Hiển thị 24 tháng đầu / tổng {months} tháng
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
