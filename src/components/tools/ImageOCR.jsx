import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';

export default function ImageOCR() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setText('');
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.bmp'] },
    maxFiles: 1
  });

  const handleExtractText = async () => {
    if (!image) return;
    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(
        image,
        'vie+eng', // Support both Vietnamese and English
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      setText(result.data.text);
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi nhận diện văn bản. Vui lòng thử lại với ảnh rõ nét hơn.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    alert('Đã copy văn bản!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!image ? (
        <div {...getRootProps()} style={{
          border: `2px dashed ${isDragActive ? '#4ade80' : 'var(--border)'}`,
          borderRadius: '12px', padding: '40px 20px', textAlign: 'center',
          background: isDragActive ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.02)',
          cursor: 'pointer', transition: 'all 0.2s'
        }}>
          <input {...getInputProps()} />
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👁️</div>
          <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>
            {isDragActive ? 'Thả ảnh vào đây...' : 'Kéo thả ảnh để lấy chữ (OCR)'}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
            Hỗ trợ nhận diện ngôn ngữ Tiếng Việt & Tiếng Anh
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Image Preview Area */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={image} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setImage(null); setText(''); setProgress(0); }} disabled={isProcessing} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--border)', cursor: isProcessing ? 'not-allowed' : 'pointer', color: 'var(--text)', fontWeight: 600 }}>
                Đổi ảnh khác
              </button>
              <button onClick={handleExtractText} disabled={isProcessing} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', background: '#f472b6', cursor: isProcessing ? 'not-allowed' : 'pointer', color: '#000', fontWeight: 600 }}>
                {isProcessing ? `Đang quét... ${progress}%` : 'Quét chữ ngay'}
              </button>
            </div>
          </div>

          {/* Text Output Area */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Kết quả:</span>
              {text && (
                <button onClick={copyToClipboard} style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: 'var(--accent)', color: '#000', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  Copy Text
                </button>
              )}
            </div>
            <textarea
              readOnly
              value={text}
              placeholder="Văn bản trích xuất sẽ hiển thị ở đây..."
              style={{
                flex: 1, width: '100%', minHeight: '300px', padding: '16px', borderRadius: '12px',
                border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)',
                color: 'var(--text)', fontSize: '14px', lineHeight: 1.6, resize: 'none'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
