import { useState } from 'react';

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState(10000000); // Tiền gốc ban đầu
  const [monthlyContribution, setMonthlyContribution] = useState(2000000); // Góp hàng tháng
  const [years, setYears] = useState(10); // Số năm
  const [rate, setRate] = useState(7); // Lãi suất %/năm

  // Công thức tính lãi kép có góp đều đặn hàng tháng
  // A = P(1+r/n)^(nt) + PMT * (((1+r/n)^(nt) - 1) / (r/n))
  // n = 12 (kỳ ghép lãi mỗi tháng)
  const calculate = () => {
    const r = rate / 100;
    const n = 12;
    const t = years;
    const P = principal;
    const PMT = monthlyContribution;

    const principalGrowth = P * Math.pow(1 + r/n, n * t);
    const contributionGrowth = PMT * ((Math.pow(1 + r/n, n * t) - 1) / (r/n));
    const totalAmount = principalGrowth + contributionGrowth;
    const totalInvested = P + (PMT * 12 * t);
    const totalInterest = totalAmount - totalInvested;

    return { totalAmount, totalInvested, totalInterest };
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const result = calculate();

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* Form Nhập Liệu */}
      <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: 'clamp(16px,4vw,24px)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div>
          <label>Số tiền gốc ban đầu (VNĐ)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} min="0" step="1000000" />
        </div>
        <div>
          <label>Góp thêm mỗi tháng (VNĐ)</label>
          <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} min="0" step="100000" />
        </div>
        <div>
          <label>Thời gian đầu tư: <strong style={{ color: 'var(--accent)' }}>{years} năm</strong></label>
          <input type="range" min="1" max="40" value={years} onChange={e => setYears(Number(e.target.value))} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
            <span>1 năm</span><span>20 năm</span><span>40 năm</span>
          </div>
        </div>
        <div>
          <label>Lãi suất kỳ vọng: <strong style={{ color: 'var(--accent)' }}>{rate}%/năm</strong></label>
          <input type="range" min="1" max="30" step="0.5" value={rate} onChange={e => setRate(Number(e.target.value))} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
            <span>1%</span><span>7% (cổ phiếu)</span><span>30%</span>
          </div>
        </div>
      </div>

      {/* Hiển thị kết quả */}
      <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(52,211,153,0.1))', border: '2px solid rgba(74,222,128,0.3)', padding: 'clamp(16px,4vw,24px)', borderRadius: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px', fontWeight: 600 }}>Tổng số tiền nhận được</div>
          <div style={{ fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--accent)', letterSpacing: '-1px', lineHeight: 1 }}>
            {formatCurrency(result.totalAmount)}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
            ROI: <strong style={{ color: 'var(--accent)' }}>{((result.totalInterest / result.totalInvested) * 100).toFixed(1)}%</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 700 }}>💰 Tổng vốn góp</div>
            <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--text)' }}>{formatCurrency(result.totalInvested)}</div>
          </div>
          <div style={{ background: 'rgba(74,222,128,0.08)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(74,222,128,0.2)' }}>
            <div style={{ fontSize: '11px', color: '#4ade80', marginBottom: '6px', fontWeight: 700 }}>📈 Lãi kép</div>
            <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#4ade80' }}>+{formatCurrency(result.totalInterest)}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
            <span>🔵 Vốn ({((result.totalInvested/result.totalAmount)*100).toFixed(0)}%)</span>
            <span>🟢 Lãi ({((result.totalInterest/result.totalAmount)*100).toFixed(0)}%)</span>
          </div>
          <div style={{ height: '10px', borderRadius: '999px', background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(result.totalInvested/result.totalAmount)*100}%`, background: '#60a5fa', borderRadius: '999px', transition: 'width 0.5s' }} />
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
          * Kỳ ghép lãi hàng tháng (compound monthly). Kết quả chỉ mang tính tham khảo.
        </p>
      </div>
    </div>
  );
}
