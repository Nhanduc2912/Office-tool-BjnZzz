import { useState } from 'react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' | 'decode'

  const processText = (text, currentMode) => {
    setInput(text);
    try {
      if (!text.trim()) {
        setOutput('');
        return;
      }
      if (currentMode === 'encode') {
        // Hỗ trợ unicode
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setOutput('❌ Chuỗi đầu vào không hợp lệ!');
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    processText(input, newMode);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
        <button
          onClick={() => handleModeChange('encode')}
          style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: mode === 'encode' ? 'var(--accent)' : 'transparent', color: mode === 'encode' ? '#000' : 'var(--text)', fontWeight: 600, transition: 'all 0.2s' }}
        >
          Mã hóa (Encode)
        </button>
        <button
          onClick={() => handleModeChange('decode')}
          style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: mode === 'decode' ? 'var(--accent)' : 'transparent', color: mode === 'decode' ? '#000' : 'var(--text)', fontWeight: 600, transition: 'all 0.2s' }}
        >
          Giải mã (Decode)
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: 600 }}>Đầu vào ({mode === 'encode' ? 'Text' : 'Base64'}):</label>
        <textarea
          value={input}
          onChange={(e) => processText(e.target.value, mode)}
          placeholder="Nhập nội dung vào đây..."
          style={{
            width: '100%', height: '150px', padding: '16px', borderRadius: '12px',
            border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)',
            color: 'var(--text)', fontSize: '14px', resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 600 }}>Kết quả ({mode === 'encode' ? 'Base64' : 'Text'}):</label>
          <button 
            onClick={() => { navigator.clipboard.writeText(output); alert('Đã copy!'); }} 
            disabled={!output || output.startsWith('❌')}
            style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'var(--text)', cursor: (!output || output.startsWith('❌')) ? 'not-allowed' : 'pointer', fontSize: '12px' }}
          >
            Copy
          </button>
        </div>
        <textarea
          readOnly
          value={output}
          placeholder="Kết quả..."
          style={{
            width: '100%', height: '150px', padding: '16px', borderRadius: '12px',
            border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)',
            color: output.startsWith('❌') ? '#ef4444' : '#60a5fa', fontSize: '14px', resize: 'vertical'
          }}
        />
      </div>
    </div>
  );
}
