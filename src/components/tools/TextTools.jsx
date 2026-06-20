import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

export default function TextTools() {
  const { addToast } = useToast();
  const [text, setText]     = useState('');
  const [result, setResult] = useState('');

  const words      = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars      = text.length;
  const charsNoSp  = text.replace(/\s/g, '').length;
  const lines      = text ? text.split('\n').length : 0;
  const sentences  = text ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
  const readTime   = Math.ceil(words / 200) || 0;
  const paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;

  const process = (type) => {
    if (!text.trim() && type !== 0) {
      addToast('Vui lòng nhập văn bản trước.', 'warning');
      return;
    }
    let r = text;
    switch (type) {
      case 1:  setResult(r.toLowerCase()); break;
      case 2:  setResult(r.toUpperCase()); break;
      case 3:  setResult(r.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')); break;
      case 4:  setResult(r.replace(/[a-zA-Z]/g, c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())); break;
      case 5:  setResult(r.replace(/\s+/g, ' ').trim()); break;
      case 6:  setResult(r.split('').reverse().join('')); break;
      case 7:  setResult(r.split('\n').map(l => l.trim()).filter(l => l).join('\n')); break;
      case 8:  setResult([...new Set(r.split('\n'))].join('\n')); break;
      case 9:  setResult(r.split('\n').sort().join('\n')); break;
      case 10: setResult(r.split('\n').sort().reverse().join('\n')); break;
      case 11: setResult(r.replace(/<[^>]*>/g, '')); break;
      case 12: setResult(r.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim()); break;
    }
  };

  const copy = (src) => {
    const txt = src === 'result' ? result : text;
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    addToast(`Đã sao chép ${src === 'result' ? 'kết quả' : 'văn bản gốc'}!`, 'success');
  };

  const useResult = () => {
    if (!result) return;
    setText(result);
    setResult('');
  };

  const stats = [
    ['📝', words,      'Từ'],
    ['🔤', chars,      'Ký tự'],
    ['📄', lines,      'Dòng'],
    ['💬', sentences,  'Câu'],
    ['📖', paragraphs, 'Đoạn'],
    ['⏱️', readTime,   'Phút đọc'],
  ];

  const operations = [
    [1,  '🔡 Chữ thường'],
    [2,  '🔠 Chữ HOA'],
    [3,  '📝 Viết Hoa Đầu Từ'],
    [4,  '🔀 Đảo hoa/thường'],
    [5,  '✂️ Xóa khoảng trắng thừa'],
    [6,  '🔄 Đảo ngược chuỗi'],
    [7,  '🧹 Xóa dòng trống'],
    [8,  '🚫 Xóa dòng trùng lặp'],
    [9,  '🔼 Sắp xếp A → Z'],
    [10, '🔽 Sắp xếp Z → A'],
    [11, '🏷️ Xóa thẻ HTML'],
    [12, '↩️ Gộp thành 1 dòng'],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Text Input */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ marginBottom: 0 }}>Nhập văn bản</label>
          {text && (
            <button
              onClick={() => { setText(''); setResult(''); }}
              style={{
                fontSize: '12px', color: 'var(--muted)', background: 'none',
                border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}
            >
              ✕ Xóa
            </button>
          )}
        </div>
        <textarea
          rows={6}
          value={text}
          onChange={e => { setText(e.target.value); setResult(''); }}
          placeholder="Nhập hoặc dán văn bản vào đây..."
          style={{ resize: 'vertical', lineHeight: 1.7 }}
        />
        {text && (
          <button
            onClick={() => copy('text')}
            style={{
              position: 'absolute', bottom: '12px', right: '12px',
              padding: '4px 10px', borderRadius: '6px', border: 'none',
              background: 'rgba(255,255,255,0.1)', color: 'var(--muted)',
              cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
            }}
          >
            📋 Copy gốc
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 100px), 1fr))',
        gap: '8px',
      }}>
        {stats.map(([icon, val, label]) => (
          <div
            key={label}
            style={{
              padding: '12px 8px', borderRadius: '12px', textAlign: 'center',
              background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)',
            }}
          >
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '3px', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Operation Buttons */}
      <div>
        <label>Công cụ chuyển đổi (12 thao tác)</label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))',
          gap: '6px', marginTop: '8px',
        }}>
          {operations.map(([type, label]) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.95 }}
              onClick={() => process(type)}
              className="btn-secondary"
              style={{ textAlign: 'left', padding: '9px 12px', fontSize: '13px', minHeight: 'unset' }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ marginBottom: 0, color: 'var(--accent)', fontWeight: 700 }}>Kết quả</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={useResult}
                  style={{
                    padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border)',
                    background: 'rgba(255,255,255,0.05)', color: 'var(--muted)',
                    cursor: 'pointer', fontSize: '12px', fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  ↑ Dùng làm input
                </button>
                <button
                  onClick={() => copy('result')}
                  style={{
                    padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.3)',
                    background: 'rgba(74,222,128,0.08)', color: 'var(--accent)',
                    cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  📋 Sao chép
                </button>
              </div>
            </div>
            <textarea
              rows={5}
              value={result}
              readOnly
              style={{
                resize: 'vertical', lineHeight: 1.7,
                color: 'var(--accent)',
                background: 'rgba(74,222,128,0.04)',
                borderColor: 'rgba(74,222,128,0.25)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
