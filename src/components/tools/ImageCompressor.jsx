import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

export default function ImageCompressor() {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(75);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback((accepted) => {
    setFiles(accepted.map(f => ({ file: f, preview: URL.createObjectURL(f) })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, multiple: true,
  });

  const compress = async () => {
    setProcessing(true);
    const out = [];
    for (const { file, preview } of files) {
      const img = new Image();
      img.src = preview;
      await new Promise(res => { img.onload = res; });
      const canvas = document.createElement('canvas');
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mime, quality / 100);
      const compressedSize = Math.round(dataUrl.length * 0.75 / 1024);
      const origSize = Math.round(file.size / 1024);
      const ratio = Math.round((1 - compressedSize / origSize) * 100);
      out.push({ name: file.name, url: dataUrl, origSize, compressedSize, ratio, mime });
    }
    setResults(out);
    setProcessing(false);
  };

  return (
    <div className="space-y-5">
      <motion.div
        {...getRootProps()}
        whileHover={{ borderColor: 'rgba(74,222,128,0.5)' }}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-green-400 bg-green-400/5' : 'border-green-400/20'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-3xl mb-2">📦</div>
        <p className="text-green-400 font-medium">Kéo ảnh vào để nén</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Hỗ trợ JPG, PNG, WebP</p>
      </motion.div>

      {files.length > 0 && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Đã chọn {files.length} file</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Chất lượng: {quality}%</label>
          <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} />
        </div>
        <div>
          <label>Chiều rộng tối đa: {maxWidth}px</label>
          <input type="range" min={640} max={4096} step={128} value={maxWidth} onChange={e => setMaxWidth(Number(e.target.value))} />
        </div>
      </div>

      <button className="btn-primary w-full" onClick={compress} disabled={!files.length || processing}>
        {processing ? '⏳ Đang nén...' : '📦 Nén ảnh ngay'}
      </button>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid var(--border)' }}
              >
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    {r.origSize} KB → {r.compressedSize} KB
                    {r.ratio > 0 && <span className="text-green-400 ml-2">▼{r.ratio}%</span>}
                  </p>
                </div>
                <a href={r.url} download={r.name} className="btn-secondary text-sm py-1 px-3">Tải xuống</a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
