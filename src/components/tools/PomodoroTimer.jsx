import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modes = [
  { id: 'work', label: 'Làm việc', minutes: 25, color: '#4ade80' },
  { id: 'short', label: 'Nghỉ ngắn', minutes: 5, color: '#60a5fa' },
  { id: 'long', label: 'Nghỉ dài', minutes: 15, color: '#f59e0b' },
];

export default function PomodoroTimer() {
  const [mode, setMode] = useState(modes[0]);
  const [timeLeft, setTimeLeft] = useState(modes[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customMins, setCustomMins] = useState('');
  const intervalRef = useRef(null);
  const total = mode.minutes * 60;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode.id === 'work') setSessions(s => s + 1);
            try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA...').play(); } catch {}
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const switchMode = (m) => {
    setMode(m);
    setTimeLeft(m.minutes * 60);
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    setTimeLeft(mode.minutes * 60);
  };

  const applyCustom = () => {
    const m = parseInt(customMins);
    if (m > 0 && m <= 120) {
      const custom = { id: 'custom', label: 'Tuỳ chỉnh', minutes: m, color: '#a78bfa' };
      setMode(custom);
      setTimeLeft(m * 60);
      setRunning(false);
    }
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const progress = 1 - timeLeft / total;
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => switchMode(m)}
            className="px-3 py-1.5 rounded-lg text-sm transition-all"
            style={{
              background: mode.id === m.id ? m.color + '22' : 'transparent',
              color: mode.id === m.id ? m.color : 'var(--muted)',
              border: `1px solid ${mode.id === m.id ? m.color + '50' : 'var(--border)'}`,
              fontWeight: mode.id === m.id ? 600 : 400,
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="relative" style={{ width: 200, height: 200 }}>
          <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle
              cx="100" cy="100" r="90" fill="none"
              stroke={mode.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '42px', fontWeight: 700, color: mode.color, lineHeight: 1 }}>
              {mins}:{secs}
            </span>
            <span className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{mode.label}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning(r => !r)}
          className="btn-primary px-8"
          style={{ background: mode.color, minWidth: '120px' }}
        >
          {running ? '⏸ Tạm dừng' : '▶ Bắt đầu'}
        </motion.button>
        <button onClick={reset} className="btn-secondary px-4">↺ Đặt lại</button>
      </div>

      {sessions > 0 && (
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Đã hoàn thành: {'🍅'.repeat(sessions)} <span className="font-semibold text-green-400">{sessions} phiên</span>
          </p>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label>Tuỳ chỉnh thời gian (phút)</label>
          <input type="number" min={1} max={120} value={customMins} onChange={e => setCustomMins(e.target.value)} placeholder="Nhập số phút..." />
        </div>
        <button className="btn-secondary" onClick={applyCustom} style={{ marginBottom: 0, paddingBottom: '10px', paddingTop: '10px' }}>Áp dụng</button>
      </div>
    </div>
  );
}
