import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

function base64UrlDecode(str) {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function decodeJwt(token) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('JWT không hợp lệ — phải có đúng 3 phần (xxx.yyy.zzz)');
  const header  = base64UrlDecode(parts[0]);
  const payload = base64UrlDecode(parts[1]);
  if (!header || !payload) throw new Error('Không thể giải mã — dữ liệu JWT bị sai');
  return { header, payload, signature: parts[2] };
}

function getExpStatus(exp) {
  if (!exp) return null;
  const now = Math.floor(Date.now() / 1000);
  const diff = exp - now;
  if (diff < 0) return { label: `Đã hết hạn ${Math.abs(Math.floor(diff / 60))} phút trước`, color: '#ef4444', expired: true };
  if (diff < 300) return { label: `Sắp hết hạn trong ${diff}s`, color: '#f59e0b', expired: false };
  return { label: `Còn hạn ${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`, color: '#4ade80', expired: false };
}

function JsonBlock({ data, label }) {
  const { addToast } = useToast();
  const json = JSON.stringify(data, null, 2);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ color: 'var(--accent)', fontWeight: 700 }}>{label}</label>
        <button
          onClick={() => { navigator.clipboard.writeText(json); addToast('Đã sao chép!', 'success'); }}
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
      <pre style={{
        margin: 0, padding: '14px', borderRadius: '10px',
        background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
        fontFamily: 'JetBrains Mono', fontSize: '13px', color: '#a78bfa',
        overflow: 'auto', maxHeight: '260px', lineHeight: 1.6,
        whiteSpace: 'pre-wrap', wordBreak: 'break-all',
      }}>
        {json}
      </pre>
    </div>
  );
}

export default function JwtDecoder() {
  const { addToast } = useToast();
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');

  const decode = () => {
    if (!token.trim()) {
      addToast('Nhập JWT token cần giải mã.', 'warning');
      return;
    }
    try {
      const result = decodeJwt(token);
      setDecoded(result);
      setError('');
    } catch (e) {
      setError(e.message);
      setDecoded(null);
    }
  };

  const expStatus = decoded?.payload?.exp ? getExpStatus(decoded.payload.exp) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
          🔓 Giải mã JWT token để xem Header và Payload. Chú ý: không cần secret key nhưng cũng không verify chữ ký — chỉ decode để đọc nội dung.
        </p>
      </div>

      <div>
        <label>JWT Token</label>
        <textarea
          rows={4} value={token}
          onChange={e => { setToken(e.target.value); setDecoded(null); setError(''); }}
          placeholder="Dán JWT token vào đây... (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
          style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', resize: 'vertical' }}
        />
      </div>

      <button className="btn-primary" onClick={decode} style={{ width: '100%' }}>
        🔓 Giải mã JWT
      </button>

      {error && (
        <div style={{
          padding: '14px', borderRadius: '10px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
        }}>
          <p style={{ margin: 0, color: '#fca5a5', fontSize: '14px' }}>
            ❌ {error}
          </p>
        </div>
      )}

      {decoded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Token Status */}
          {expStatus && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px',
              background: expStatus.color + '15', border: `1px solid ${expStatus.color}40`,
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '20px' }}>{expStatus.expired ? '⏰' : '✅'}</span>
              <div>
                <div style={{ fontWeight: 700, color: expStatus.color, fontSize: '14px' }}>
                  {expStatus.expired ? 'Token đã hết hạn' : 'Token còn hiệu lực'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{expStatus.label}</div>
              </div>
              {decoded.payload.exp && (
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Hết hạn lúc</div>
                  <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}>
                    {new Date(decoded.payload.exp * 1000).toLocaleString('vi-VN')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Algorithm Badge */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              ['Thuật toán', decoded.header.alg || '?'],
              ['Loại token', decoded.header.typ || '?'],
              ['Subject', decoded.payload.sub || '—'],
              ['Issuer', decoded.payload.iss || '—'],
            ].map(([k, v]) => (
              <div key={k} style={{
                padding: '6px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: '13px', fontFamily: 'JetBrains Mono', color: '#60a5fa' }}>{v}</div>
              </div>
            ))}
          </div>

          <JsonBlock data={decoded.header} label="📋 Header" />
          <JsonBlock data={decoded.payload} label="📦 Payload" />

          <div>
            <label style={{ color: 'var(--muted)' }}>🔏 Chữ ký (Signature — chưa verify)</label>
            <div style={{
              padding: '10px 14px', borderRadius: '10px',
              background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)',
              fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--muted)',
              wordBreak: 'break-all', lineHeight: 1.6,
            }}>
              {decoded.signature}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
