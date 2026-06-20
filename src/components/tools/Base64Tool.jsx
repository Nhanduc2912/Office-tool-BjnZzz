import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Editor from '@monaco-editor/react';

export default function Base64Tool() {
  const { addToast } = useToast();
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

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600 }}>Đầu vào ({mode === 'encode' ? 'Text' : 'Base64'}):</label>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <Editor
              height="250px"
              defaultLanguage="text"
              theme="vs-dark"
              value={input}
              onChange={(val) => processText(val || '', mode)}
              options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, wordWrap: 'on' }}
            />
          </div>
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Kết quả ({mode === 'encode' ? 'Base64' : 'Text'}):</label>
            <button
              onClick={() => { navigator.clipboard.writeText(output); addToast('Đã sao chép!', 'success'); }}
              disabled={!output || output.startsWith('❌')}
              style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.08)', color: 'var(--accent)', cursor: (!output || output.startsWith('❌')) ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}
            >
              📋 Copy
            </button>
          </div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <Editor
              height="250px"
              defaultLanguage="text"
              theme="vs-dark"
              value={output}
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, wordWrap: 'on' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

