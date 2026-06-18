import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const selected = acceptedFiles[0];
    setFile(selected);
    
    // Read total pages
    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdf.getPageCount());
      setPageRange(`1-${pdf.getPageCount()}`);
    } catch (e) {
      console.error(e);
      alert('Không thể đọc file PDF này. File có thể bị hỏng hoặc có mật khẩu.');
      setFile(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const parsePageRange = (rangeStr, max) => {
    const pages = new Set();
    const parts = rangeStr.split(',');
    for (let part of parts) {
      part = part.trim();
      if (!part) continue;
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= max) pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num) && num >= 1 && num <= max) {
          pages.add(num - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    
    const pagesToExtract = parsePageRange(pageRange, totalPages);
    if (pagesToExtract.length === 0) {
      alert("Vui lòng nhập khoảng trang hợp lệ.");
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const copiedPages = await newPdf.copyPages(originalPdf, pagesToExtract);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const splitPdfFile = await newPdf.save();
      const blob = new Blob([splitPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `extracted_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tách file.");
    } finally {
      setIsProcessing(false);
    }
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
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✂️</div>
          <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>
            {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file PDF vào đây để tách trang'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Tổng số trang: {totalPages}</div>
            </div>
            <button onClick={() => setFile(null)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--border)', cursor: 'pointer', color: 'var(--text)', fontSize: '12px' }}>Đổi file</button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
              Nhập trang cần tách (VD: 1-5, 8, 11-13)
            </label>
            <input
              type="text"
              value={pageRange}
              onChange={e => setPageRange(e.target.value)}
              placeholder="VD: 1, 3-5"
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.02)', color: 'var(--text)', fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handleSplit}
            disabled={isProcessing || !pageRange}
            style={{
              padding: '14px', borderRadius: '10px', border: 'none',
              background: !pageRange ? 'var(--border)' : '#60a5fa',
              color: !pageRange ? 'var(--muted)' : '#000',
              fontWeight: 700, fontSize: '15px', cursor: !pageRange ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', marginTop: '10px'
            }}
          >
            {isProcessing ? 'Đang xử lý...' : 'Trích xuất trang PDF'}
          </button>
        </div>
      )}
    </div>
  );
}
