import { useState, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';

const FLAG_OPTIONS = [
  { flag: 'g', label: 'Global', desc: 'Tìm tất cả khớp' },
  { flag: 'i', label: 'Ignore case', desc: 'Không phân biệt hoa/thường' },
  { flag: 'm', label: 'Multiline', desc: '^$ khớp mỗi dòng' },
  { flag: 's', label: 'DotAll', desc: '. khớp cả xuống dòng' },
];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMatches(text, matches) {
  if (!matches || matches.length === 0) return [{ text, match: false }];
  const parts = [];
  let last = 0;
  for (const m of matches) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), match: false });
    parts.push({ text: m[0], match: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), match: false });
  return parts;
}

export default function RegexTester() {
  const { addToast } = useToast();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState(new Set(['g']));
  const [testStr, setTestStr] = useState('Xin chào! Email: hello@example.com và user@test.org\nSố điện thoại: 0901234567 hoặc 0987654321');
  const [error, setError] = useState('');

  const toggleFlag = (f) => {
    setFlags(prev => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  };

  const { regex, matches, groups } = useMemo(() => {
    if (!pattern) { setError(''); return { regex: null, matches: [], groups: [] }; }
    try {
      const flagStr = Array.from(flags).join('');
      const r = new RegExp(pattern, flagStr);
      setError('');
      const allMatches = [];
      let m;
      if (flags.has('g')) {
        while ((m = r.exec(testStr)) !== null) {
          allMatches.push(m);
          if (m.index === r.lastIndex) r.lastIndex++;
        }
      } else {
        m = r.exec(testStr);
        if (m) allMatches.push(m);
      }
      const grps = allMatches.flatMap(match =>
        Object.entries(match.groups || {}).map(([name, val]) => ({ name, value: val, index: match.index }))
      );
      return { regex: r, matches: allMatches, groups: grps };
    } catch (e) {
      setError(e.message);
      return { regex: null, matches: [], groups: [] };
    }
  }, [pattern, flags, testStr]);

  const parts = useMemo(() => highlightMatches(testStr, matches), [testStr, matches]);

  const copy = () => {
    navigator.clipboard.writeText(`/${pattern}/${Array.from(flags).join('')}`);
    addToast('Đã sao chép regex!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Pattern input */}
      <div>
        <label>
          Regular Expression{' '}
          <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '12px' }}>
            (không cần dấu / ở đầu/cuối)
          </span>
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          <span style={{
            padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)', borderRight: 'none',
            borderRadius: '8px 0 0 8px', color: 'var(--muted)', fontFamily: 'JetBrains Mono',
            fontSize: '16px', userSelect: 'none',
          }}>/</span>
          <input
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="[a-z]+@[a-z]+\.[a-z]+"
            style={{
              borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: '14px',
              border: '1px solid var(--border)', borderRight: 'none',
            }}
          />
          <span style={{
            padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)', borderLeft: 'none',
            borderRadius: '0 8px 8px 0', color: 'var(--muted)', fontFamily: 'JetBrains Mono',
            fontSize: '14px', userSelect: 'none', whiteSpace: 'nowrap',
          }}>
            /{Array.from(flags).join('')}
          </span>
        </div>
      </div>

      {/* Flags */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {FLAG_OPTIONS.map(({ flag, label, desc }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            title={desc}
            style={{
              padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${flags.has(flag) ? 'rgba(74,222,128,0.5)' : 'var(--border)'}`,
              background: flags.has(flag) ? 'rgba(74,222,128,0.12)' : 'transparent',
              color: flags.has(flag) ? 'var(--accent)' : 'var(--muted)',
              fontFamily: 'JetBrains Mono', fontSize: '13px', fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {flag} <span style={{ fontSize: '11px', fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>{label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#fca5a5', fontFamily: 'JetBrains Mono' }}>
            ❌ Lỗi Regex: {error}
          </p>
        </div>
      )}

      {/* Test String */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ marginBottom: 0 }}>Chuỗi test</label>
          {matches.length > 0 && (
            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700 }}>
              ✓ {matches.length} khớp tìm thấy
            </span>
          )}
          {pattern && matches.length === 0 && !error && (
            <span style={{ fontSize: '12px', color: '#f59e0b' }}>Không tìm thấy khớp</span>
          )}
        </div>
        <textarea
          rows={5} value={testStr}
          onChange={e => setTestStr(e.target.value)}
          style={{ fontFamily: 'JetBrains Mono', fontSize: '13px', resize: 'vertical' }}
        />
      </div>

      {/* Highlighted Preview */}
      {pattern && !error && (
        <div>
          <label>Kết quả highlight</label>
          <div style={{
            padding: '14px', borderRadius: '10px',
            background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
            fontFamily: 'JetBrains Mono', fontSize: '13px', lineHeight: 1.7,
            maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>
            {parts.map((part, i) => (
              part.match ? (
                <mark key={i} style={{
                  background: 'rgba(74,222,128,0.35)', color: '#fff',
                  borderRadius: '3px', padding: '1px 3px',
                  border: '1px solid rgba(74,222,128,0.5)',
                }}>
                  {part.text}
                </mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            ))}
          </div>
        </div>
      )}

      {/* Matches detail */}
      {matches.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ marginBottom: 0 }}>Chi tiết các khớp</label>
            <button
              onClick={copy}
              style={{
                padding: '4px 10px', borderRadius: '6px', border: 'none',
                background: 'rgba(74,222,128,0.1)', color: 'var(--accent)',
                cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Copy Regex
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
            {matches.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: '8px',
                background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)',
              }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>#{i + 1} @ index {m.index}</span>
                <code style={{ fontSize: '13px', color: '#4ade80', fontFamily: 'JetBrains Mono', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  {m[0] || '<empty>'}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
