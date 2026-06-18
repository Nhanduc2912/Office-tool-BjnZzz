import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index - 1];
    newFiles[index - 1] = newFiles[index];
    newFiles[index] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index + 1];
    newFiles[index + 1] = newFiles[index];
    newFiles[index] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Vui lòng chọn ít nhất 2 file PDF để gộp.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gộp file. File có thể bị hỏng hoặc được bảo vệ bằng mật khẩu.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div {...getRootProps()} style={{
        border: `2px dashed ${isDragActive ? '#4ade80' : 'var(--border)'}`,
        borderRadius: '12px', padding: '40px 20px', textAlign: 'center',
        background: isDragActive ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.02)',
        cursor: 'pointer', transition: 'all 0.2s'
      }}>
        <input {...getInputProps()} />
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
        <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>
          {isDragActive ? 'Thả file vào đây...' : 'Kéo thả hoặc click để chọn file PDF'}
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
          Bạn có thể chọn nhiều file cùng lúc
        </p>
      </div>

      {files.length > 0 && (
        <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--muted)' }}>Danh sách file ({files.length}):</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px', border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }}>
                  {index + 1}. {file.name}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => moveUp(index)} disabled={index === 0} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: 'var(--border)', color: 'var(--text)', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                  <button onClick={() => moveDown(index)} disabled={index === files.length - 1} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: 'var(--border)', color: 'var(--text)', cursor: index === files.length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                  <button onClick={() => removeFile(index)} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: '#ef444430', color: '#ef4444', cursor: 'pointer', marginLeft: '8px' }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleMerge}
        disabled={isProcessing || files.length < 2}
        style={{
          padding: '14px', borderRadius: '10px', border: 'none',
          background: files.length < 2 ? 'var(--border)' : 'var(--accent)',
          color: files.length < 2 ? 'var(--muted)' : '#000',
          fontWeight: 700, fontSize: '15px', cursor: files.length < 2 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s', marginTop: '10px'
        }}
      >
        {isProcessing ? 'Đang xử lý...' : 'Gộp PDF ngay'}
      </button>
    </div>
  );
}
