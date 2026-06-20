import { useState } from 'react';
import { marked } from 'marked';
import { useToast } from '../../context/ToastContext';

marked.setOptions({ breaks: true, gfm: true });

const SAMPLE = `# Chào mừng đến Markdown Preview!

## Tính năng

Đây là **Markdown Previewer** — công cụ viết và preview **Markdown** _trực tiếp_ ngay trên trình duyệt.

### Danh sách tính năng:
- ✅ Xem trước realtime
- ✅ Hỗ trợ GFM (GitHub Flavored Markdown)
- ✅ Code highlighting
- ✅ Bảng (Tables)
- ✅ Blockquotes

### Ví dụ code:
\`\`\`javascript
const hello = (name) => {
  return \`Xin chào, \${name}!\`;
};
console.log(hello('OfficeKit'));
\`\`\`

> 💡 **Mẹo:** Sử dụng bảng điều khiển ở trên để thay đổi chế độ xem.

| Cú pháp | Kết quả |
|---------|---------|
| **bold** | **bold** |
| *italic* | *italic* |
| \`code\` | \`code\` |

---
*Hỗ trợ cú pháp đầy đủ của [Markdown GFM](https://github.github.com/gfm/).*
`;

export default function MarkdownPreviewer() {
  const { addToast } = useToast();
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [layout, setLayout] = useState('split'); // 'split' | 'editor' | 'preview'
  const [wordWrap, setWordWrap] = useState(true);

  const html = marked(markdown);
  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;

  const copyMd = () => {
    navigator.clipboard.writeText(markdown);
    addToast('Đã sao chép Markdown!', 'success');
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    addToast('Đã sao chép HTML!', 'success');
  };

  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'document.md';
    a.click();
    addToast('Đã tải file .md!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Layout toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
          {[
            { id: 'editor',  icon: '📝', label: 'Chỉ editor' },
            { id: 'split',   icon: '⬛', label: 'Chia đôi' },
            { id: 'preview', icon: '👁', label: 'Chỉ preview' },
          ].map(l => (
            <button
              key={l.id}
              onClick={() => setLayout(l.id)}
              title={l.label}
              style={{
                padding: '6px 10px', border: 'none', borderRadius: '6px',
                background: layout === l.id ? 'var(--accent)' : 'transparent',
                color: layout === l.id ? '#000' : 'var(--text)',
                cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s',
              }}
            >
              {l.icon}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

        <button onClick={copyMd} className="btn-secondary" style={{ fontSize: '13px', padding: '7px 12px', minHeight: 'unset' }}>📋 Copy MD</button>
        <button onClick={copyHtml} className="btn-secondary" style={{ fontSize: '13px', padding: '7px 12px', minHeight: 'unset' }}>📋 Copy HTML</button>
        <button onClick={download} className="btn-secondary" style={{ fontSize: '13px', padding: '7px 12px', minHeight: 'unset' }}>⬇ Tải .md</button>

        <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--muted)', flexShrink: 0 }}>
          {wordCount} từ · {charCount} ký tự
        </div>
      </div>

      {/* Editor + Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: layout === 'editor' ? '1fr 0' : layout === 'preview' ? '0 1fr' : '1fr 1fr',
        gap: '12px',
        minHeight: '480px',
      }}>
        {/* Editor */}
        {layout !== 'preview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              📝 Markdown
            </div>
            <textarea
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              spellCheck={false}
              style={{
                flex: 1, width: '100%', minHeight: '450px',
                fontFamily: 'JetBrains Mono', fontSize: '13px',
                lineHeight: 1.7, resize: 'none',
                padding: '16px',
                whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                overflow: 'auto',
              }}
            />
          </div>
        )}

        {/* Preview */}
        {layout !== 'editor' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              👁 Preview
            </div>
            <div style={{
              flex: 1, padding: '20px', borderRadius: '12px', minHeight: '450px',
              border: '1px solid var(--border)', background: 'var(--bg)',
              overflowY: 'auto',
            }}>
              <div
                className="markdown-preview"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
