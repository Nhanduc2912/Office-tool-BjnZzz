import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

const formats = ['png', 'jpg', 'webp', 'bmp', 'gif'];

export default function ImageConverter() {
  const [files, setFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState('png');
  const [quality, setQuality] = useState(92);
  const [results, setResults] = useState([]);
  const [converting, setConverting] = useState(false);

  const onDrop = useCallback((accepted) => {
    const newFiles = accepted.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const convertAll = async () => {
    setConverting(true);
    const converted = [];
    for (const { file, preview } of files) {
      const img = new Image();
      img.src = preview;
      await new Promise(res => { img.onload = res; });
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (targetFormat === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const mimeType = targetFormat === 'jpg' ? 'image/jpeg' : `image/${targetFormat}`;
      const dataUrl = canvas.toDataURL(mimeType, quality / 100);
      const origName = file.name.replace(/\.[^.]+$/, '');
      converted.push({ name: `${origName}.${targetFormat}`, url: dataUrl, size: Math.round(dataUrl.length * 0.75 / 1024) });
    }
    setResults(converted);
    setConverting(false);
  };

  const removeFile = (idx) => setFiles(f => f.filter((_, i) => i !== idx));

  return (
    <div className="space-y-5">
      <motion.div
        {...getRootProps()}
        whileHover={{ borderColor: 'rgba(74,222,128,0.5)' }}
        whileTap={{ scale: 0.99 }}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-green-400 bg-green-400/5' : 'border-green-400/20'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-3xl mb-2">🖼️</div>
        <p className="text-green-400 font-medium">Kéo & thả ảnh vào đây</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Hỗ trợ PNG, JPG, WebP, BMP, GIF</p>
      </motion.div>

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {files.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-lg overflow-hidden group"
              style={{ border: '1px solid var(--border)' }}
            >
              <img src={f.preview} alt="" className="w-full h-24 object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => removeFile(i)} className="text-white text-xl">✕</button>
              </div>
              <p className="text-xs p-1 truncate" style={{ color: 'var(--muted)' }}>{f.file.name}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Chuyển sang định dạng</label>
          <select value={targetFormat} onChange={e => setTargetFormat(e.target.value)}>
            {formats.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
          </select>
        </div>
        {(targetFormat === 'jpg' || targetFormat === 'webp') && (
          <div>
            <label>Chất lượng: {quality}%</label>
            <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(Number(e.target.value))} />
          </div>
        )}
      </div>

      <motion.button
        className="btn-primary w-full"
        onClick={convertAll}
        disabled={files.length === 0 || converting}
        whileTap={{ scale: 0.97 }}
      >
        {converting ? '⏳ Đang chuyển đổi...' : `🔄 Chuyển đổi ${files.length > 0 ? files.length + ' ảnh' : ''}`}
      </motion.button>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <p className="text-sm font-medium text-green-400">✅ Hoàn thành — {results.length} file</p>
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
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>~{r.size} KB</p>
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
