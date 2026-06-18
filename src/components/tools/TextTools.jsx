import { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = ['Đếm từ', 'Đổi chữ hoa/thường', 'Xóa khoảng trắng', 'Đảo ngược text'];

export default function TextTools() {
  const [activeTab, setActiveTab] = useState(0);
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const lines = text ? text.split('\n').length : 0;
  const sentences = text ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
  const readTime = Math.ceil(words / 200);

  const process = (type) => {
    let r = text;
    switch (type) {
      case 0: return; // stats only
      case 1: setResult(r.toLowerCase()); break;
      case 2: setResult(r.toUpperCase()); break;
      case 3: setResult(r.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')); break;
      case 4: setResult(r.replace(/\s+/g, ' ').trim()); break;
      case 5: setResult(r.split('').reverse().join('')); break;
      case 6: setResult(r.split('\n').map(l => l.trim()).filter(l => l).join('\n')); break;
      case 7: {
        const lines = r.split('\n');
        const sorted = [...lines].sort();
        setResult(sorted.join('\n'));
        break;
      }
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result || text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <label>Nhập văn bản</label>
        <textarea
          rows={6}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Nhập hoặc dán văn bản vào đây..."
          style={{ resize: 'vertical', lineHeight: '1.6' }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          ['📝', 'Từ', words],
          ['🔤', 'Ký tự', chars],
          ['📄', 'Dòng', lines],
          ['💬', 'Câu', sentences],
          ['⏱️', 'Phút đọc', readTime],
          ['🔡', 'Không dấu cách', charsNoSpace],
        ].map(([icon, label, val]) => (
          <div key={label} className="p-3 rounded-lg text-center"
            style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid var(--border)' }}>
            <div className="text-xl">{icon}</div>
            <div className="text-lg font-bold text-green-400">{val}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div>
        <label className="mb-2 block">Công cụ chuyển đổi</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            [1, '🔡 Chữ thường'],
            [2, '🔠 Chữ hoa'],
            [3, '📝 Viết hoa đầu từ'],
            [4, '✂️ Xóa khoảng trắng thừa'],
            [5, '🔄 Đảo ngược'],
            [6, '🧹 Xóa dòng trống'],
            [7, '📊 Sắp xếp dòng A-Z'],
          ].map(([type, label]) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.96 }}
              onClick={() => process(type)}
              className="btn-secondary text-left text-sm py-2 px-3"
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-1">
            <label>Kết quả</label>
            <button onClick={copy} className="text-xs px-2 py-1 rounded"
              style={{ background: copied ? 'rgba(74,222,128,0.2)' : 'rgba(74,222,128,0.08)', color: 'var(--accent)', border: '1px solid rgba(74,222,128,0.3)' }}>
              {copied ? '✓ Đã sao chép' : '📋 Sao chép'}
            </button>
          </div>
          <textarea rows={4} value={result} readOnly style={{ resize: 'vertical', lineHeight: '1.6', color: 'var(--accent)' }} />
        </motion.div>
      )}
    </div>
  );
}
