import { useState, useEffect } from 'react';

const loremWords = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'];

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLorem = (p = paragraphs, w = wordsPerParagraph) => {
    const result = [];
    for (let i = 0; i < p; i++) {
      const paraArr = [];
      for (let j = 0; j < w; j++) {
        const word = loremWords[Math.floor(Math.random() * loremWords.length)];
        paraArr.push(j === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
      }
      result.push(paraArr.join(' ') + '.');
    }
    setText(result.join('\n\n'));
  };

  // Generate on mount — FIX: was using useState incorrectly
  useEffect(() => {
    generateLorem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end',
        background: 'rgba(255,255,255,0.02)', padding: '20px',
        borderRadius: '16px', border: '1px solid var(--border)',
      }}>
        <div style={{ flex: '1 1 140px', minWidth: '120px' }}>
          <label>Số đoạn văn</label>
          <input type="number" min="1" max="100" value={paragraphs}
            onChange={e => setParagraphs(Number(e.target.value))} />
        </div>
        <div style={{ flex: '1 1 140px', minWidth: '120px' }}>
          <label>Số từ mỗi đoạn</label>
          <input type="number" min="5" max="300" value={wordsPerParagraph}
            onChange={e => setWordsPerParagraph(Number(e.target.value))} />
        </div>
        <button
          className="btn-primary"
          onClick={() => generateLorem()}
          style={{ height: '44px', paddingLeft: '24px', paddingRight: '24px' }}
        >
          🔄 Tạo Text
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <button
          onClick={copy}
          style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 2,
            padding: '6px 14px', borderRadius: '8px', border: 'none',
            background: copied ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)',
            color: copied ? 'var(--accent)' : 'var(--text)',
            cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
          }}
        >
          {copied ? '✓ Đã copy' : '📋 Copy All'}
        </button>
        <textarea
          readOnly
          value={text}
          style={{
            width: '100%', minHeight: '320px', padding: '16px',
            borderRadius: '16px', border: '1px solid var(--border)',
            background: 'rgba(0,0,0,0.2)', color: 'var(--text)',
            fontSize: '15px', lineHeight: 1.8, resize: 'vertical',
            fontFamily: 'serif',
          }}
        />
      </div>
    </div>
  );
}
