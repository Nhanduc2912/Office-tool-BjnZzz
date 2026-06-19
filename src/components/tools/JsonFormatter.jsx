import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function JsonFormatter() {
  const [input, setInput] = useState('{\n  "hello": "world"\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      alert('Đã copy kết quả!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600 }}>Input JSON:</label>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <Editor
              height="300px"
              defaultLanguage="json"
              theme="vs-dark"
              value={input}
              onChange={(val) => setInput(val || '')}
              options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={formatJson} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', fontWeight: 600, cursor: 'pointer' }}>
              Format (Làm đẹp)
            </button>
            <button onClick={minifyJson} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--border)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer' }}>
              Minify (Nén)
            </button>
          </div>
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Kết quả:</label>
            <button onClick={copyToClipboard} style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'var(--text)', cursor: 'pointer', fontSize: '12px' }}>
              Copy
            </button>
          </div>
          {error ? (
            <div style={{ width: '100%', height: '300px', padding: '16px', borderRadius: '12px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontFamily: 'monospace', fontSize: '13px', overflowY: 'auto' }}>
              <strong>Lỗi JSON không hợp lệ:</strong><br /><br />{error}
            </div>
          ) : (
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <Editor
                height="300px"
                defaultLanguage="json"
                theme="vs-dark"
                value={output}
                options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
