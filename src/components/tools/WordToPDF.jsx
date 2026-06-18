import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';

export default function WordToPDF() {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const contentRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const selected = acceptedFiles[0];
    if (!selected) return;
    setFile(selected);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value || "<p>File trống hoặc không đọc được nội dung.</p>"); 
      } catch (err) {
        console.error(err);
        alert('Không thể đọc file Word này.');
      }
    };
    reader.readAsArrayBuffer(selected);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1
  });

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;
    setIsProcessing(true);
    
    const opt = {
      margin:       15,
      filename:     `${file.name.replace('.docx', '')}_converted.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(contentRef.current).save().then(() => {
      setIsProcessing(false);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!file ? (
        <div {...getRootProps()} style={{
          border: `2px dashed ${isDragActive ? '#4ade80' : 'var(--border)'}`,
          borderRadius: '12px', padding: '40px 20px', textAlign: 'center',
          background: isDragActive ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.02)',
          cursor: 'pointer', transition: 'all 0.2s'
        }}>
          <input {...getInputProps()} />
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📝</div>
          <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>
            {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file Word (.docx) vào đây'}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
            Lưu ý: Hỗ trợ văn bản, bảng cơ bản. File sẽ được chuyển thành PDF 100% trên trình duyệt.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
              <div style={{ fontSize: '12px', color: '#10b981' }}>Đã đọc nội dung thành công</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setFile(null); setHtmlContent(''); }} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--border)', cursor: 'pointer', color: 'var(--text)', fontSize: '12px' }}>Đổi file</button>
              <button onClick={handleDownloadPDF} disabled={isProcessing} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--accent)', cursor: isProcessing ? 'not-allowed' : 'pointer', color: '#000', fontSize: '12px', fontWeight: 600 }}>
                {isProcessing ? 'Đang xuất...' : 'Tải File PDF'}
              </button>
            </div>
          </div>

          <div style={{ 
            border: '1px solid var(--border)', borderRadius: '12px', background: '#fff', 
            color: '#000', maxHeight: '500px', overflowY: 'auto', padding: '30px' 
          }}>
            {/* Displaying extracted HTML */}
            <div 
              ref={contentRef} 
              style={{ fontFamily: '"Times New Roman", Times, serif', lineHeight: 1.5, fontSize: '16px' }} 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
