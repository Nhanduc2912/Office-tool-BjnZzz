import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function pad(n) { return String(n).padStart(2, '0'); }

const PRESETS = [
  { label: '🎆 Tết Nguyên Đán 2026', date: '2026-01-29T00:00' },
  { label: '📅 Năm mới 2027',        date: '2027-01-01T00:00' },
  { label: '💻 Năm học mới 2025',     date: '2025-09-05T08:00' },
];

export default function CountdownTimer() {
  const [targetDate, setTargetDate] = useState('');
  const [label, setLabel] = useState('Sự kiện');
  const [countdown, setCountdown] = useState(null);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  const start = (date) => {
    clearInterval(intervalRef.current);
    setFinished(false);

    const update = () => {
      const now = new Date().getTime();
      const target = new Date(date).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        setFinished(true);
        clearInterval(intervalRef.current);
        return;
      }
      setCountdown({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
        secs:  Math.floor((diff % 60000) / 1000),
      });
    };

    update();
    intervalRef.current = setInterval(update, 1000);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const handleStart = () => { if (targetDate) start(targetDate); };

  const usePreset = (p) => {
    setTargetDate(p.date);
    setLabel(p.label);
    start(p.date);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Presets */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => usePreset(p)}
            style={{
              padding: '7px 14px', borderRadius: '10px', cursor: 'pointer',
              border: '1px solid rgba(74,222,128,0.25)',
              background: 'rgba(74,222,128,0.08)', color: 'var(--accent)',
              fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.08)'}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        <div>
          <label>Tên sự kiện</label>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Tên sự kiện của bạn..." />
        </div>
        <div>
          <label>Ngày &amp; giờ mục tiêu</label>
          <input type="datetime-local" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn-primary" onClick={handleStart} disabled={!targetDate} style={{ width: '100%' }}>
            ▶ Bắt đầu đếm
          </button>
        </div>
      </div>

      {/* Countdown Display */}
      <AnimatePresence>
        {countdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center' }}
          >
            {finished ? (
              <div style={{
                padding: '40px', borderRadius: '20px',
                background: 'rgba(74,222,128,0.08)',
                border: '2px solid rgba(74,222,128,0.3)',
              }}>
                <div style={{ fontSize: '64px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ color: 'var(--accent)', fontFamily: 'Syne', fontSize: '24px', margin: '0 0 8px' }}>
                  {label}
                </h3>
                <p style={{ color: 'var(--muted)', margin: 0 }}>Sự kiện đã diễn ra rồi!</p>
              </div>
            ) : (
              <div style={{
                padding: 'clamp(20px, 5vw, 40px)',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '20px', border: '1px solid var(--border)',
              }}>
                <h3 style={{ fontFamily: 'Syne', color: 'var(--accent)', margin: '0 0 24px', fontSize: 'clamp(16px, 4vw, 20px)' }}>
                  ⏳ {label}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 'clamp(8px, 3vw, 20px)',
                  maxWidth: '480px', margin: '0 auto',
                }}>
                  {[
                    [countdown.days,  'Ngày'],
                    [countdown.hours, 'Giờ'],
                    [countdown.mins,  'Phút'],
                    [countdown.secs,  'Giây'],
                  ].map(([val, unit]) => (
                    <div key={unit} style={{
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '14px', padding: 'clamp(10px, 3vw, 20px) 8px',
                    }}>
                      <motion.div
                        key={val}
                        initial={{ scale: 1.3, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                          fontFamily: 'JetBrains Mono', fontWeight: 700,
                          fontSize: 'clamp(24px, 6vw, 42px)',
                          color: 'var(--accent)', lineHeight: 1,
                        }}
                      >
                        {pad(val)}
                      </motion.div>
                      <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: 'var(--muted)', marginTop: '8px', fontWeight: 600 }}>
                        {unit}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Target date info */}
                <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--muted)' }}>
                  Đích đến: {new Date(targetDate).toLocaleString('vi-VN', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
