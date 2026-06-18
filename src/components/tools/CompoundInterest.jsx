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
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      
      {/* Form Nhập Liệu */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Số tiền gốc ban đầu (VNĐ)</label>
          <input type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', fontSize: '15px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Góp thêm mỗi tháng (VNĐ)</label>
          <input type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', fontSize: '15px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Thời gian đầu tư (Năm)</label>
          <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', fontSize: '15px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Lãi suất kỳ vọng (% / năm)</label>
          <input type="number" value={rate} step="0.1" onChange={e => setRate(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', fontSize: '15px' }} />
        </div>
      </div>

      {/* Hiển thị kết quả */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: 'var(--accent)', color: '#000', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 600, opacity: 0.8 }}>Tổng số tiền nhận được</h3>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>
            {formatCurrency(result.totalAmount)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--muted)' }}>Tổng vốn đã góp</h4>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>{formatCurrency(result.totalInvested)}</div>
          </div>
          <div style={{ background: 'rgba(74,222,128,0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(74,222,128,0.2)' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#4ade80' }}>Tổng lãi nhận được</h4>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#4ade80' }}>+{formatCurrency(result.totalInterest)}</div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5, marginTop: '8px' }}>
          * Giả định tiền lãi được nhập gốc hàng tháng (kỳ ghép lãi tháng). Kết quả chỉ mang tính chất tham khảo.
        </p>
      </div>

    </div>
  );
}
