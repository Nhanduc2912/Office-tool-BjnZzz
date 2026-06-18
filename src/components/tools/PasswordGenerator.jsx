import { useState } from 'react';
import { motion } from 'framer-motion';

const charSets = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { level: 'Yếu', color: '#ef4444', pct: 20 };
  if (score <= 4) return { level: 'Trung bình', color: '#f59e0b', pct: 50 };
  if (score <= 6) return { level: 'Mạnh', color: '#22c55e', pct: 80 };
  return { level: 'Rất mạnh', color: '#4ade80', pct: 100 };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState([]);
  const [copied, setCopied] = useState(null);

  const generate = () => {
    let chars = '';
    if (opts.upper) chars += charSets.upper;
    if (opts.lower) chars += charSets.lower;
    if (opts.numbers) chars += charSets.numbers;
    if (opts.symbols) chars += charSets.symbols;
    if (!chars) return;
    const pws = Array.from({ length: count }, () =>
      Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    );
    setPasswords(pws);
    setPassword(pws[0]);
  };

  const copy = (pw, idx) => {
    navigator.clipboard.writeText(pw);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  const strength = password ? calcStrength(password) : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Độ dài: {length} ký tự</label>
          <input type="range" min={6} max={64} value={length} onChange={e => setLength(Number(e.target.value))} />
        </div>
        <div>
          <label>Số lượng: {count} mật khẩu</label>
          <input type="range" min={1} max={10} value={count} onChange={e => setCount(Number(e.target.value))} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries({ upper: 'Chữ hoa (A-Z)', lower: 'Chữ thường (a-z)', numbers: 'Số (0-9)', symbols: 'Ký tự đặc biệt (!@#...)' }).map(([k, v]) => (
          <label key={k} className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text)', marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={opts[k]}
              onChange={e => setOpts(o => ({ ...o, [k]: e.target.checked }))}
              style={{ width: 'auto', accentColor: '#4ade80' }}
            />
            <span className="text-sm">{v}</span>
          </label>
        ))}
      </div>

      <button className="btn-primary w-full" onClick={generate}>🔑 Tạo mật khẩu</button>

      {strength && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span style={{ color: 'var(--muted)' }}>Độ bảo mật</span>
            <span style={{ color: strength.color, fontWeight: 600 }}>{strength.level}</span>
          </div>
          <div className="rounded-full overflow-hidden h-1.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: strength.color }}
              initial={{ width: 0 }}
              animate={{ width: `${strength.pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {passwords.map((pw, i) => (
          <motion.div
            key={pw}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 p-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}
          >
            <span className="flex-1 break-all">{pw}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => copy(pw, i)}
              className="text-sm px-3 py-1 rounded-md flex-shrink-0 transition-all"
              style={{
                background: copied === i ? 'rgba(74,222,128,0.2)' : 'rgba(74,222,128,0.08)',
                color: 'var(--accent)',
                border: '1px solid rgba(74,222,128,0.3)',
              }}
            >
              {copied === i ? '✓' : 'Sao chép'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
