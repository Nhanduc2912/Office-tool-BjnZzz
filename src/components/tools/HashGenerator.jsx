import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

const ALGORITHMS = [
  { id: 'SHA-1',   label: 'SHA-1',   bits: 160 },
  { id: 'SHA-256', label: 'SHA-256', bits: 256 },
  { id: 'SHA-384', label: 'SHA-384', bits: 384 },
  { id: 'SHA-512', label: 'SHA-512', bits: 512 },
];

async function hashText(text, algorithm) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const { addToast } = useToast();
  const [input, setInput] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('text');  // 'text' | 'file'

  const generate = async () => {
    if (!input.trim()) {
      addToast('Nhập văn bản cần hash.', 'warning');
      return;
    }
    setLoading(true);
    const out = {};
    for (const algo of ALGORITHMS) {
      try {
        out[algo.id] = await hashText(input, algo.id);
      } catch {
        out[algo.id] = 'Không hỗ trợ';
      }
    }
    setResults(out);
    setLoading(false);
  };

  const generateFromFile = async (file) => {
    if (!file) return;
    setLoading(true);
    const buffer = await file.arrayBuffer();
    const out = {};
    for (const algo of ALGORITHMS) {
      try {
        const hashBuffer = await crypto.subtle.digest(algo.id, buffer);
        const arr = Array.from(new Uint8Array(hashBuffer));
        out[algo.id] = arr.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch {
        out[algo.id] = 'Lỗi';
      }
    }
    setResults(out);
    setLoading(false);
  };

  const copy = (hash) => {
    navigator.clipboard.writeText(hash);
    addToast('Đã sao chép hash!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
          🔒 Tạo mã băm bằng Web Crypto API — xử lý 100% tại trình duyệt. Hỗ trợ SHA-1, SHA-256, SHA-384, SHA-512.
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
        {[{id:'text', label:'📝 Văn bản'}, {id:'file', label:'📁 File'}].map(m => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setResults({}); }}
            style={{
              flex: 1, padding: '9px', border: 'none', borderRadius: '8px',
              background: mode === m.id ? 'var(--accent)' : 'transparent',
              color: mode === m.id ? '#000' : 'var(--text)',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'text' ? (
        <div>
          <label>Văn bản cần hash</label>
          <textarea
            rows={4} value={input}
            onChange={e => { setInput(e.target.value); setResults({}); }}
            placeholder="Nhập văn bản hoặc mật khẩu cần tạo hash..."
            style={{ resize: 'vertical' }}
          />
        </div>
      ) : (
        <div>
          <label>Chọn file để hash</label>
          <input
            type="file"
            onChange={e => { if (e.target.files[0]) generateFromFile(e.target.files[0]); }}
            style={{ padding: '12px' }}
          />
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
            Có thể hash bất kỳ loại file nào. Dùng để kiểm tra tính toàn vẹn (checksum).
          </p>
        </div>
      )}

      {mode === 'text' && (
        <button className="btn-primary" onClick={generate} disabled={loading || !input.trim()} style={{ width: '100%' }}>
          {loading ? <><span className="spinner" style={{ width: 16, height: 16, marginRight: 8 }} />Đang tính...</> : '🔐 Tạo Hash'}
        </button>
      )}

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ALGORITHMS.map(algo => (
            <div key={algo.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{algo.label}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '999px' }}>
                    {algo.bits} bit
                  </span>
                </div>
                <button
                  onClick={() => copy(results[algo.id])}
                  style={{
                    padding: '4px 10px', borderRadius: '6px', border: 'none',
                    background: 'rgba(74,222,128,0.1)', color: 'var(--accent)',
                    cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  📋 Copy
                </button>
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: '10px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                fontFamily: 'JetBrains Mono', fontSize: '12px', color: '#a78bfa',
                wordBreak: 'break-all', lineHeight: 1.6,
              }}>
                {results[algo.id]}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
