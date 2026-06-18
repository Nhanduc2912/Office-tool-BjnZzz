import { useState } from 'react';

const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [text, setText] = useState('');

  const generateLorem = () => {
    let result = [];
    for (let p = 0; p < paragraphs; p++) {
      let paraArr = [];
      for (let w = 0; w < wordsPerParagraph; w++) {
        const randomWord = loremWords[Math.floor(Math.random() * loremWords.length)];
        if (w === 0) {
          paraArr.push(randomWord.charAt(0).toUpperCase() + randomWord.slice(1));
        } else {
          paraArr.push(randomWord);
        }
      }
      result.push(paraArr.join(' ') + '.');
    }
    setText(result.join('\n\n'));
  };

  // Generate on mount
  useState(() => generateLorem(), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Số đoạn văn</label>
          <input type="number" min="1" max="100" value={paragraphs} onChange={e => setParagraphs(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)' }} />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Số từ mỗi đoạn</label>
          <input type="number" min="5" max="500" value={wordsPerParagraph} onChange={e => setWordsPerParagraph(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)' }} />
        </div>
        <button onClick={generateLorem} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#000', fontWeight: 600, cursor: 'pointer', height: '42px' }}>
          Tạo Text
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => { navigator.clipboard.writeText(text); alert('Đã copy!'); }}
          style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'var(--text)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
        >
          Copy All
        </button>
        <textarea
          readOnly
          value={text}
          style={{
            width: '100%', height: '350px', padding: '16px 16px 16px 16px', borderRadius: '16px',
            border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)',
            color: 'var(--text)', fontSize: '15px', lineHeight: 1.6, resize: 'vertical',
            fontFamily: 'serif'
          }}
        />
      </div>
    </div>
  );
}
