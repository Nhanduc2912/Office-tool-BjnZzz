import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

export default function ExcelJSONConverter() {
  const [mode, setMode] = useState('excel-to-json'); // 'excel-to-json' | 'json-to-excel'
  const [output, setOutput] = useState('');
  const [inputJson, setInputJson] = useState('');
  const [fileName, setFileName] = useState('');

  const onDropExcel = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setOutput(JSON.stringify(json, null, 2));
      } catch (err) {
        console.error(err);
        alert('Có lỗi khi đọc file Excel/CSV.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps: getExcelRootProps, getInputProps: getExcelInputProps, isDragActive: isExcelDragActive } = useDropzone({
    onDrop: onDropExcel,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleJsonToExcel = () => {
    try {
      const data = JSON.parse(inputJson);
      const arrData = Array.isArray(data) ? data : [data]; // Force array
      
      const worksheet = XLSX.utils.json_to_sheet(arrData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `exported_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      alert('JSON không hợp lệ. Vui lòng kiểm tra lại.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Đã copy JSON!');
  };

  const downloadJson = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.split('.')[0] || 'data'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Mode Selector */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
        <button
          onClick={() => { setMode('excel-to-json'); setOutput(''); setFileName(''); }}
          style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: mode === 'excel-to-json' ? 'var(--accent)' : 'transparent', color: mode === 'excel-to-json' ? '#000' : 'var(--text)', fontWeight: 600, transition: 'all 0.2s' }}
        >
          Excel/CSV → JSON
        </button>
        <button
          onClick={() => { setMode('json-to-excel'); setInputJson(''); }}
          style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: mode === 'json-to-excel' ? 'var(--accent)' : 'transparent', color: mode === 'json-to-excel' ? '#000' : 'var(--text)', fontWeight: 600, transition: 'all 0.2s' }}
        >
          JSON → Excel
        </button>
      </div>

      {mode === 'excel-to-json' ? (
        <>
          <div {...getExcelRootProps()} style={{
            border: `2px dashed ${isExcelDragActive ? '#4ade80' : 'var(--border)'}`,
            borderRadius: '12px', padding: '40px 20px', textAlign: 'center',
            background: isExcelDragActive ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.02)',
            cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <input {...getExcelInputProps()} />
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
            <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>
              {isExcelDragActive ? 'Thả file vào đây...' : 'Kéo thả file Excel (.xlsx, .xls) hoặc CSV vào đây'}
            </p>
          </div>

          {output && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>Kết quả JSON:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={copyToClipboard} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: '12px' }}>Copy</button>
                  <button onClick={downloadJson} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--accent)', color: '#000', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>Tải JSON</button>
                </div>
              </div>
              <textarea
                readOnly
                value={output}
                style={{
                  width: '100%', height: '300px', padding: '16px', borderRadius: '12px',
                  border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)',
                  color: '#a78bfa', fontFamily: 'monospace', fontSize: '13px', resize: 'vertical'
                }}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
              Nhập mã JSON (Mảng Object):
            </label>
            <textarea
              value={inputJson}
              onChange={e => setInputJson(e.target.value)}
              placeholder='[ { "Tên": "Nguyen Van A", "Tuổi": 25 }, { "Tên": "Tran Thị B", "Tuổi": 30 } ]'
              style={{
                width: '100%', height: '200px', padding: '16px', borderRadius: '12px',
                border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)',
                color: 'var(--text)', fontFamily: 'monospace', fontSize: '13px', resize: 'vertical'
              }}
            />
          </div>
          
          <button
            onClick={handleJsonToExcel}
            disabled={!inputJson.trim()}
            style={{
              padding: '14px', borderRadius: '10px', border: 'none',
              background: !inputJson.trim() ? 'var(--border)' : '#10b981',
              color: !inputJson.trim() ? 'var(--muted)' : '#fff',
              fontWeight: 700, fontSize: '15px', cursor: !inputJson.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Xuất file Excel (.xlsx)
          </button>
        </>
      )}

    </div>
  );
}
