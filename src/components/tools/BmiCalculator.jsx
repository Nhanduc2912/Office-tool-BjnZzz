import { useState } from 'react';

export default function BmiCalculator() {
  const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(65); // kg

  const bmi = weight / Math.pow(height / 100, 2);
  
  let status;
  let color;
  let message;

  if (bmi < 18.5) {
    status = 'Thiếu cân';
    color = '#60a5fa';
    message = 'Bạn cần bổ sung thêm dinh dưỡng để cơ thể khỏe mạnh hơn nhé!';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    status = 'Bình thường';
    color = '#4ade80';
    message = 'Tuyệt vời! Cơ thể bạn đang ở trạng thái rất cân đối.';
  } else if (bmi >= 25 && bmi < 29.9) {
    status = 'Thừa cân';
    color = '#f59e0b';
    message = 'Bạn nên chú ý ăn uống và tập luyện để giảm một chút cân nặng.';
  } else {
    status = 'Béo phì';
    color = '#ef4444';
    message = 'Cảnh báo! Bạn cần có chế độ giảm cân khoa học để tránh rủi ro sức khỏe.';
  }

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Input */}
      <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Chiều cao</label>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{height} cm</span>
          </div>
          <input 
            type="range" min="100" max="220" value={height} onChange={e => setHeight(Number(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--accent)' }} 
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Cân nặng</label>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{weight} kg</span>
          </div>
          <input 
            type="range" min="30" max="150" value={weight} onChange={e => setWeight(Number(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--accent)' }} 
          />
        </div>
      </div>

      {/* Result */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', padding: '32px 24px', borderRadius: '16px', border: `1px solid ${color}40`, textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chỉ số BMI của bạn</div>
        <div style={{ fontSize: '64px', fontWeight: 800, fontFamily: 'Syne, sans-serif', lineHeight: 1, color: color, marginBottom: '16px' }}>
          {bmi.toFixed(1)}
        </div>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '999px', background: `${color}20`, color: color, fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>
          {status}
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
          {message}
        </p>
      </div>

    </div>
  );
}
