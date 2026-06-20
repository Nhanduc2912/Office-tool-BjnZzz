import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const modes = [
  { id: 'work',  label: '🍅 Làm việc',  minutes: 25, color: '#4ade80' },
  { id: 'short', label: '☕ Nghỉ ngắn', minutes: 5,  color: '#60a5fa' },
  { id: 'long',  label: '🌴 Nghỉ dài',  minutes: 15, color: '#f59e0b' },
];

// Web Audio API beep — works reliably without external audio files
function playBeep(frequency = 440, duration = 0.6, volume = 0.4) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* Audio not supported — silent fail */
  }
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState(modes[0]);
  const [timeLeft, setTimeLeft] = useState(modes[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customMins, setCustomMins] = useState('');
  const intervalRef = useRef(null);
  const total = mode.minutes * 60;

  const handleComplete = useCallback(() => {
    setRunning(false);
    if (mode.id === 'work') setSessions(s => s + 1);
    // Play success beep sequence
    playBeep(523, 0.2, 0.4); // C5
    setTimeout(() => playBeep(659, 0.2, 0.4), 200); // E5
    setTimeout(() => playBeep(784, 0.4, 0.5), 400); // G5
    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification('OfficeKit Pomodoro', {
        body: mode.id === 'work' ? '🎉 Hoàn thành phiên làm việc!' : '💪 Hết thời gian nghỉ!',
        icon: '⚡',
      });
    }
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            handleComplete();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, handleComplete]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const switchMode = (m) => {
    clearInterval(intervalRef.current);
    setMode(m);
    setTimeLeft(m.minutes * 60);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(mode.minutes * 60);
  };

  const applyCustom = () => {
    const m = parseInt(customMins);
    if (m > 0 && m <= 120) {
      const custom = { id: 'custom', label: '⏱ Tùy chỉnh', minutes: m, color: '#a78bfa' };
      clearInterval(intervalRef.current);
      setMode(custom);
      setTimeLeft(m * 60);
      setRunning(false);
    }
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const progress = total > 0 ? (1 - timeLeft / total) : 0;
  const circumference = 2 * Math.PI * 88;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => switchMode(m)}
            style={{
              padding: '8px 16px', borderRadius: '10px', border: `1px solid ${mode.id === m.id ? m.color + '60' : 'var(--border)'}`,
              background: mode.id === m.id ? m.color + '18' : 'transparent',
              color: mode.id === m.id ? m.color : 'var(--muted)',
              fontWeight: mode.id === m.id ? 700 : 500,
              cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="100" cy="100" r="88" fill="none"
              stroke={mode.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono', fontSize: '42px', fontWeight: 700,
              color: mode.color, lineHeight: 1, letterSpacing: '-2px',
            }}>
              {mins}:{secs}
            </span>
            <span style={{ fontSize: '12px', marginTop: '6px', color: 'var(--muted)', fontWeight: 600 }}>
              {mode.label}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setRunning(r => !r)}
          className="btn-primary"
          style={{ background: mode.color, minWidth: '140px', fontSize: '16px' }}
        >
          {running ? '⏸ Tạm dừng' : '▶ Bắt đầu'}
        </motion.button>
        <button onClick={reset} className="btn-secondary">
          ↺ Đặt lại
        </button>
      </div>

      {/* Session Count */}
      {sessions > 0 && (
        <div style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', background: 'rgba(74,222,128,0.06)', border: '1px solid var(--border)' }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>
            Phiên hoàn thành: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
              {'🍅'.repeat(Math.min(sessions, 8))} {sessions > 8 ? `+${sessions - 8}` : ''} ({sessions} phiên)
            </span>
          </p>
        </div>
      )}

      {/* Custom Time */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label>Tùy chỉnh thời gian (phút, tối đa 120)</label>
          <input
            type="number" min={1} max={120}
            value={customMins}
            onChange={e => setCustomMins(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && applyCustom()}
            placeholder="Nhập số phút..."
          />
        </div>
        <button
          className="btn-secondary"
          onClick={applyCustom}
          style={{ flexShrink: 0 }}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
}
