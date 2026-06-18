import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';

const tabs = [
  { id: 'url', label: 'URL / Link' },
  { id: 'text', label: 'Văn bản' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'vcard', label: 'Danh thiếp' },
];

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState('url');
  const [qrUrl, setQrUrl] = useState('');
  const [text, setText] = useState('');
  const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [vcard, setVcard] = useState({ name: '', phone: '', email: '', company: '' });
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [color, setColor] = useState('#4ade80');
  const [bgColor, setBgColor] = useState('#0a0f0d');
  const [size, setSize] = useState(256);

  const generate = async () => {
    let data = '';
    if (activeTab === 'url') data = qrUrl;
    else if (activeTab === 'text') data = text;
    else if (activeTab === 'wifi') data = `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};;`;
    else if (activeTab === 'vcard') {
      data = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcard.name}\nTEL:${vcard.phone}\nEMAIL:${vcard.email}\nORG:${vcard.company}\nEND:VCARD`;
    }
    if (!data) return;
    try {
      const url = await QRCode.toDataURL(data, {
        width: size,
        margin: 2,
        color: { dark: color, light: bgColor },
      });
      setQrDataUrl(url);
    } catch (e) { console.error(e); }
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qr-code.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.id
                ? 'bg-green-400 text-gray-900'
                : 'text-green-400 border border-green-400/20 hover:border-green-400/50'
            }`}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {activeTab === 'url' && (
            <div>
              <label>Đường dẫn URL</label>
              <input placeholder="https://example.com" value={qrUrl} onChange={e => setQrUrl(e.target.value)} />
            </div>
          )}
          {activeTab === 'text' && (
            <div>
              <label>Nội dung văn bản</label>
              <textarea rows={3} placeholder="Nhập văn bản..." value={text} onChange={e => setText(e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          )}
          {activeTab === 'wifi' && (
            <div className="space-y-3">
              <div><label>Tên mạng (SSID)</label><input placeholder="Tên WiFi" value={wifi.ssid} onChange={e => setWifi({...wifi, ssid: e.target.value})} /></div>
              <div><label>Mật khẩu</label><input type="password" placeholder="••••••••" value={wifi.password} onChange={e => setWifi({...wifi, password: e.target.value})} /></div>
              <div><label>Mã hóa</label>
                <select value={wifi.encryption} onChange={e => setWifi({...wifi, encryption: e.target.value})}>
                  <option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">Không có mật khẩu</option>
                </select>
              </div>
            </div>
          )}
          {activeTab === 'vcard' && (
            <div className="grid grid-cols-2 gap-3">
              <div><label>Họ tên</label><input placeholder="Nguyễn Văn A" value={vcard.name} onChange={e => setVcard({...vcard, name: e.target.value})} /></div>
              <div><label>Số điện thoại</label><input placeholder="0901234567" value={vcard.phone} onChange={e => setVcard({...vcard, phone: e.target.value})} /></div>
              <div><label>Email</label><input placeholder="email@example.com" value={vcard.email} onChange={e => setVcard({...vcard, email: e.target.value})} /></div>
              <div><label>Công ty</label><input placeholder="Tên công ty" value={vcard.company} onChange={e => setVcard({...vcard, company: e.target.value})} /></div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-3">
        <div><label>Màu QR</label><input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ height: '42px', padding: '4px' }} /></div>
        <div><label>Màu nền</label><input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ height: '42px', padding: '4px' }} /></div>
        <div><label>Kích thước: {size}px</label><input type="range" min={128} max={512} step={64} value={size} onChange={e => setSize(Number(e.target.value))} /></div>
      </div>

      <button className="btn-primary w-full" onClick={generate}>Tạo mã QR</button>

      <AnimatePresence>
        {qrDataUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.img
              src={qrDataUrl}
              alt="QR Code"
              style={{ borderRadius: '12px', maxWidth: '200px' }}
              whileHover={{ scale: 1.03 }}
            />
            <button className="btn-secondary" onClick={download}>⬇ Tải xuống PNG</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
