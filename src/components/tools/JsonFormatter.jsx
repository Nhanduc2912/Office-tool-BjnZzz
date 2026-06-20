import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Editor from '@monaco-editor/react';

function getDepth(obj, d = 0) {
  if (typeof obj !== 'object' || obj === null) return d;
  return Math.max(...Object.values(obj).map(v => getDepth(v, d + 1)), d);
}

export default function JsonFormatter() {
  const { addToast } = useToast();
  const [input, setInput] = useState('{\n  "hello": "world",\n  "version": 1\n}');
  const [output, setOutput] = useState('');
  const [error, setError]   = useState('');
  const [parsed, setParsed] = useState(null);

  const formatJson = () => {
    try {
      if (!input.trim()) { setOutput(''); setError(''); setParsed(null); return; }
      const p = JSON.parse(input);
      setOutput(JSON.stringify(p, null, 2));
      setParsed(p);
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
      setParsed(null);
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      const p = JSON.parse(input);
      setOutput(JSON.stringify(p));
      setParsed(p);
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const copyResult = () => {
    if (output) { navigator.clipboard.writeText(output); addToast('Đã sao chép JSON!', 'success'); }
  };

  const downloadJson = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.json';
    a.click();
    addToast('Đã tải file JSON!', 'success');
  };

  const stats = parsed ? [
    ['🔑', typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : '—', 'Key gốc'],
    ['📦', JSON.stringify(parsed).length, 'Ký tự (minified)'],
    ['📏', getDepth(parsed), 'Độ sâu'],
  ] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Input */}
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label>📝 Input JSON</label>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <Editor height="300px" defaultLanguage="json" theme="vs-dark" value={input}
              onChange={val => { setInput(val || ''); setOutput(''); setParsed(null); setError(''); }}
              options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={formatJson} className="btn-primary" style={{ flex: 1, padding: '10px', minHeight: 'unset', fontSize: '14px' }}>✨ Format</button>
            <button onClick={minifyJson} className="btn-secondary" style={{ flex: 1, padding: '10px', minHeight: 'unset', fontSize: '14px' }}>🗜 Minify</button>
          </div>
        </div>

        {/* Output */}
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ marginBottom: 0 }}>✅ Kết quả</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={downloadJson} disabled={!output} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--muted)', cursor: output ? 'pointer' : 'not-allowed', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>⬇ .json</button>
              <button onClick={copyResult} disabled={!output} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.08)', color: 'var(--accent)', cursor: output ? 'pointer' : 'not-allowed', fontSize: '12px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>📋 Copy</button>
            </div>
          </div>
          {error ? (
            <div style={{ height: '300px', padding: '16px', borderRadius: '12px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', fontFamily: 'JetBrains Mono', fontSize: '13px', overflowY: 'auto', lineHeight: 1.6 }}>
              <strong>❌ Lỗi JSON:</strong><br /><br />{error}
            </div>
          ) : (
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <Editor height="300px" defaultLanguage="json" theme="vs-dark" value={output}
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }} />
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {stats.map(([icon, val, label]) => (
            <div key={label} style={{ flex: '1 1 80px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '18px' }}>{icon}</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '18px', color: 'var(--accent)' }}>{val}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
