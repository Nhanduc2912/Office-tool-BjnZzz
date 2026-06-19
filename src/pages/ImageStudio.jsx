import { useState, useRef } from 'react';
import { Upload, Download, Palette, Trash2 } from 'lucide-react';

export default function ImageStudio() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0,
    blur: 0,
  });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          drawImage(img, filters);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImage = (img, currentFilters) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to image size
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Apply filters
    ctx.filter = `
      brightness(${currentFilters.brightness}%) 
      contrast(${currentFilters.contrast}%) 
      grayscale(${currentFilters.grayscale}%) 
      sepia(${currentFilters.sepia}%) 
      blur(${currentFilters.blur}px)
    `;
    
    ctx.drawImage(img, 0, 0);
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    if (image) drawImage(image, newFilters);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = "officekit_edited_image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{ padding: '16px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(10,15,13,0.8)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Palette size={24} color="var(--accent)" />
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>Image Studio Pro</h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>Trình biên tập ảnh Canvas thời gian thực</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: 'var(--accent)', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
            <Upload size={18} /> Tải ảnh lên
            <input type="file" hidden accept="image/*" onChange={handleUpload} />
          </label>
          <button onClick={downloadImage} disabled={!image} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', border: '1px solid var(--border)', fontWeight: 600, cursor: image ? 'pointer' : 'not-allowed', fontSize: '14px' }}>
            <Download size={18} /> Xuất ảnh
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Toolbar Left */}
        <aside style={{ width: '280px', borderRight: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', padding: '24px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '20px' }}>Bộ lọc & Điều chỉnh</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { label: 'Độ sáng', name: 'brightness', min: 0, max: 200 },
              { label: 'Độ tương phản', name: 'contrast', min: 0, max: 200 },
              { label: 'Đen trắng', name: 'grayscale', min: 0, max: 100 },
              { label: 'Hoài cổ (Sepia)', name: 'sepia', min: 0, max: 100 },
              { label: 'Làm mờ (Blur)', name: 'blur', min: 0, max: 20 },
            ].map(f => (
              <div key={f.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500 }}>{f.label}</label>
                  <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{filters[f.name]}</span>
                </div>
                <input 
                  type="range" min={f.min} max={f.max} 
                  value={filters[f.name]} 
                  onChange={e => handleFilterChange(f.name, Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }} 
                />
              </div>
            ))}
          </div>

          <button 
            onClick={() => { setFilters({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0, blur: 0 }); if(image) drawImage(image, { brightness: 100, contrast: 100, grayscale: 0, sepia: 0, blur: 0 }); }}
            style={{ width: '100%', marginTop: '32px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: '#ef4444', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Trash2 size={16} /> Reset tất cả
          </button>
        </aside>

        {/* Workspace Center */}
        <main style={{ flex: 1, background: '#050706', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', overflow: 'auto' }}>
          {!image ? (
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' }}>🖼️</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 12px' }}>Bắt đầu chỉnh sửa</h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6 }}>Tải một bức ảnh lên để mở khóa các công cụ chỉnh sửa chuyên nghiệp. Mọi thao tác đều được xử lý 100% tại máy của bạn.</p>
            </div>
          ) : (
            <div style={{ boxShadow: '0 20px 80px rgba(0,0,0,0.8)', background: '#000', borderRadius: '4px', overflow: 'hidden' }}>
              <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '70vh', display: 'block' }} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
