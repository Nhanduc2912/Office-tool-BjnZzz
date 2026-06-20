import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { useToast } from '../../context/ToastContext';

const tabs = [
  { id: 'url',   label: '🔗 URL' },
  { id: 'text',  label: '📝 Văn bản' },
  { id: 'wifi',  label: '📶 WiFi' },
  { id: 'vcard', label: '👤 Danh thiếp' },
];

export default function QRGenerator() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('url');
  const [qrUrl, setQrUrl] = useState('');
  const [text, setText] = useState('');
  const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [vcard, setVcard] = useState({ name: '', phone: '', email: '', company: '' });
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [color, setColor] = useState('#4ade80');
  const [bgColor, setBgColor] = useState('#0a0f0d');
  const [size, setSize] = useState(256);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    if (activeTab === 'url') return qrUrl;
    if (activeTab === 'text') return text;
    if (activeTab === 'wifi') return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};;`;
    if (activeTab === 'vcard') {
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcard.name}\nTEL:${vcard.phone}\nEMAIL:${vcard.email}\nORG:${vcard.company}\nEND:VCARD`;
    }
    return '';
  };

  const generate = async () => {
    const data = getData();
    if (!data || data.trim() === '' || (activeTab === 'wifi' && !wifi.ssid)) {
      addToast('Vui lòng nhập đủ thông tin.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const url = await QRCode.toDataURL(data, {
        width: size, margin: 2,
        color: { dark: color, light: bgColor },
      });
      setQrDataUrl(url);
    } catch {
      addToast('Không thể tạo mã QR. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qr-officekit.png';
    a.click();
    addToast('Đã tải mã QR!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setQrDataUrl(''); }}
            style={{
              padding: '8px 14px', borderRadius: '10px', border: 'none',
              background: activeTab === t.id ? 'var(--accent)' : 'rgba(74,222,128,0.08)',
              color: activeTab === t.id ? '#000' : 'var(--accent)',
              border: `1px solid ${activeTab === t.id ? 'transparent' : 'rgba(74,222,128,0.2)'}`,
              fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Input Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {activeTab === 'url' && (
            <div>
              <label>Đường dẫn URL</label>
              <input value={qrUrl} onChange={e => setQrUrl(e.target.value)} placeholder="https://example.com" type="url" />
            </div>
          )}
          {activeTab === 'text' && (
            <div>
              <label>Nội dung văn bản</label>
              <textarea rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Nhập văn bản..." style={{ resize: 'vertical' }} />
            </div>
          )}
          {activeTab === 'wifi' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              <div><label>Tên mạng (SSID)</label><input value={wifi.ssid} onChange={e => setWifi({...wifi, ssid: e.target.value})} placeholder="Tên WiFi" /></div>
              <div><label>Mật khẩu</label><input type="password" value={wifi.password} onChange={e => setWifi({...wifi, password: e.target.value})} placeholder="••••••••" /></div>
              <div>
                <label>Mã hóa</label>
                <select value={wifi.encryption} onChange={e => setWifi({...wifi, encryption: e.target.value})}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Không mật khẩu</option>
                </select>
              </div>
            </div>
          )}
          {activeTab === 'vcard' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              <div><label>Họ tên</label><input value={vcard.name} onChange={e => setVcard({...vcard, name: e.target.value})} placeholder="Nguyễn Văn A" /></div>
              <div><label>Số điện thoại</label><input value={vcard.phone} onChange={e => setVcard({...vcard, phone: e.target.value})} placeholder="0901234567" /></div>
              <div><label>Email</label><input type="email" value={vcard.email} onChange={e => setVcard({...vcard, email: e.target.value})} placeholder="email@example.com" /></div>
              <div><label>Công ty</label><input value={vcard.company} onChange={e => setVcard({...vcard, company: e.target.value})} placeholder="Tên công ty" /></div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Style Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
        <div>
          <label>Màu QR code</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div>
          <label>Màu nền</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
        </div>
        <div>
          <label>Kích thước: {size}px</label>
          <input type="range" min={128} max={512} step={64} value={size} onChange={e => setSize(Number(e.target.value))} />
        </div>
      </div>

      <button className="btn-primary" onClick={generate} disabled={loading} style={{ width: '100%' }}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16, marginRight: 8 }} />Đang tạo...</> : '▣ Tạo mã QR'}
      </button>

      <AnimatePresence>
        {qrDataUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
          >
            <img
              src={qrDataUrl}
              alt="QR Code"
              style={{ borderRadius: '14px', maxWidth: 'min(240px, 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
            />
            <button className="btn-secondary" onClick={download}>⬇ Tải xuống PNG</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
