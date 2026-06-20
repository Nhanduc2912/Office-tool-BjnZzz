import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const charSets = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { level: 'Yếu',       color: '#ef4444', pct: 15 };
  if (score <= 4) return { level: 'Trung bình', color: '#f59e0b', pct: 50 };
  if (score <= 6) return { level: 'Mạnh',       color: '#22c55e', pct: 80 };
  return             { level: 'Rất mạnh',    color: '#4ade80', pct: 100 };
}

export default function PasswordGenerator() {
  const { addToast } = useToast();
  const [length, setLength]   = useState(16);
  const [opts, setOpts]       = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [count, setCount]     = useState(1);
  const [passwords, setPasswords] = useState([]);
  const [copied, setCopied]   = useState(null);

  const generate = () => {
    let chars = '';
    if (opts.upper)   chars += charSets.upper;
    if (opts.lower)   chars += charSets.lower;
    if (opts.numbers) chars += charSets.numbers;
    if (opts.symbols) chars += charSets.symbols;
    if (!chars) { addToast('Chọn ít nhất một loại ký tự.', 'warning'); return; }
    const pws = Array.from({ length: count }, () =>
      Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    );
    setPasswords(pws);
  };

  const copy = (pw, idx) => {
    navigator.clipboard.writeText(pw);
    setCopied(idx);
    addToast('Đã sao chép mật khẩu!', 'success');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(passwords.join('\n'));
    addToast(`Đã sao chép ${passwords.length} mật khẩu!`, 'success');
  };

  const strength = passwords[0] ? calcStrength(passwords[0]) : null;

  const optionLabels = {
    upper:   'Chữ hoa (A-Z)',
    lower:   'Chữ thường (a-z)',
    numbers: 'Số (0-9)',
    symbols: 'Ký tự đặc biệt (!@#...)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
        <div>
          <label>Độ dài: <strong style={{ color: 'var(--accent)' }}>{length} ký tự</strong></label>
          <input
            type="range" min={6} max={64} value={length}
            onChange={e => setLength(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
            <span>6</span><span>16 (khuyên)</span><span>64</span>
          </div>
        </div>
        <div>
          <label>Số lượng: <strong style={{ color: 'var(--accent)' }}>{count} mật khẩu</strong></label>
          <input
            type="range" min={1} max={10} value={count}
            onChange={e => setCount(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Options */}
      <div>
        <label>Loại ký tự</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
          gap: '8px', marginTop: '8px',
        }}>
          {Object.entries(optionLabels).map(([k, v]) => (
            <label
              key={k}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                border: `1px solid ${opts[k] ? 'rgba(74,222,128,0.4)' : 'var(--border)'}`,
                background: opts[k] ? 'rgba(74,222,128,0.07)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s', color: 'var(--text)', marginBottom: 0,
              }}
            >
              <input
                type="checkbox"
                checked={opts[k]}
                onChange={e => setOpts(o => ({ ...o, [k]: e.target.checked }))}
                style={{ width: 'auto', accentColor: '#4ade80', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{v}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={generate} style={{ width: '100%', fontSize: '15px' }}>
        🔑 Tạo mật khẩu
      </button>

      {/* Strength Meter */}
      <AnimatePresence>
        {strength && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--muted)' }}>Độ bảo mật</span>
              <span style={{ color: strength.color, fontWeight: 700 }}>{strength.level}</span>
            </div>
            <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: '999px', background: strength.color }}
                initial={{ width: 0 }}
                animate={{ width: `${strength.pct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password List */}
      <AnimatePresence>
        {passwords.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {passwords.length > 1 && (
              <button
                onClick={copyAll}
                style={{
                  padding: '8px', border: '1px solid var(--border)', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)', color: 'var(--muted)',
                  cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                }}
              >
                📋 Sao chép tất cả {passwords.length} mật khẩu
              </button>
            )}
            {passwords.map((pw, i) => (
              <motion.div
                key={`${pw}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px',
                  borderRadius: '12px', border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <span style={{
                  flex: 1, fontFamily: 'JetBrains Mono', fontSize: '14px',
                  wordBreak: 'break-all', lineHeight: 1.5, color: 'var(--text)',
                }}>
                  {pw}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copy(pw, i)}
                  style={{
                    flexShrink: 0, padding: '6px 12px', borderRadius: '8px',
                    border: '1px solid rgba(74,222,128,0.3)',
                    background: copied === i ? 'rgba(74,222,128,0.2)' : 'rgba(74,222,128,0.08)',
                    color: 'var(--accent)', cursor: 'pointer', fontSize: '12px',
                    fontWeight: 600, fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
                  }}
                >
                  {copied === i ? '✓ Đã copy' : 'Copy'}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
