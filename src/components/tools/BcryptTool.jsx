import { useState } from 'react';
import bcrypt from 'bcryptjs';
import { useToast } from '../../context/ToastContext';

export default function BcryptTool() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('hash');
  const [plainText, setPlainText] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hashResult, setHashResult] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [compareText, setCompareText] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleHash = () => {
    if (!plainText) return;
    setIsHashing(true);
    setTimeout(() => {
      try {
        const salt = bcrypt.genSaltSync(rounds);
        const hash = bcrypt.hashSync(plainText, salt);
        setHashResult(hash);
      } catch {
        addToast('Có lỗi xảy ra khi mã hóa.', 'error');
      }
      setIsHashing(false);
    }, 50);
  };

  const handleCompare = () => {
    if (!compareText || !compareHash) return;
    setIsComparing(true);
    setTimeout(() => {
      try {
        const match = bcrypt.compareSync(compareText, compareHash);
        setCompareResult(match);
      } catch {
        setCompareResult(false);
      }
      setIsComparing(false);
    }, 50);
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hashResult);
    addToast('Đã sao chép mã Hash!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
        {[
          { id: 'hash',    label: '🔐 Tạo mã Hash' },
          { id: 'compare', label: '🔍 So sánh Hash' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setCompareResult(null); }}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
              cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? '#000' : 'var(--text)',
              fontWeight: 600, transition: 'all 0.2s',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'hash' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Chuỗi cần mã hóa (Password)</label>
            <input
              type="text" value={plainText}
              onChange={e => setPlainText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isHashing && handleHash()}
              placeholder="Ví dụ: mysecretpassword123"
            />
          </div>

          <div>
            <label>
              Số vòng lặp (Salt Rounds):{' '}
              <strong style={{ color: 'var(--accent)' }}>{rounds}</strong>
              <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '8px' }}>
                (khuyên dùng: 10)
              </span>
            </label>
            <input
              type="range" min="4" max="15"
              value={rounds} onChange={e => setRounds(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
              <span>4 (Nhanh)</span><span>10 (Khuyên)</span><span>15 (Chậm nhưng an toàn)</span>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleHash}
            disabled={!plainText || isHashing}
            style={{ width: '100%' }}
          >
            {isHashing ? (
              <><span className="spinner" style={{ width: 16, height: 16, marginRight: 8 }} />Đang mã hóa...</>
            ) : '🔐 Tạo Bcrypt Hash'}
          </button>

          {hashResult && (
            <div>
              <label style={{ color: 'var(--accent)' }}>Kết quả Hash:</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                <input
                  readOnly value={hashResult}
                  style={{
                    flex: 1, fontFamily: 'JetBrains Mono', fontSize: '13px',
                    borderColor: 'rgba(74,222,128,0.4)', background: 'rgba(74,222,128,0.04)',
                  }}
                />
                <button
                  className="btn-secondary"
                  onClick={copyHash}
                  style={{ flexShrink: 0, padding: '0 16px' }}
                >
                  📋 Copy
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Mã Hash Bcrypt ($2a$10$...)</label>
            <input
              type="text" value={compareHash}
              onChange={e => { setCompareHash(e.target.value); setCompareResult(null); }}
              placeholder="$2a$10$..."
              style={{ fontFamily: 'JetBrains Mono', fontSize: '13px' }}
            />
          </div>
          <div>
            <label>Password cần kiểm tra</label>
            <input
              type="text" value={compareText}
              onChange={e => { setCompareText(e.target.value); setCompareResult(null); }}
              onKeyDown={e => e.key === 'Enter' && !isComparing && handleCompare()}
              placeholder="Nhập password..."
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleCompare}
            disabled={!compareText || !compareHash || isComparing}
            style={{ width: '100%', background: '#60a5fa', color: '#000' }}
          >
            {isComparing ? (
              <><span className="spinner" style={{ width: 16, height: 16, marginRight: 8 }} />Đang kiểm tra...</>
            ) : '🔍 So sánh Hash'}
          </button>

          {compareResult !== null && (
            <div style={{
              padding: '20px', borderRadius: '14px', textAlign: 'center',
              background: compareResult ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${compareResult ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>{compareResult ? '✅' : '❌'}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: compareResult ? '#4ade80' : '#ef4444' }}>
                {compareResult ? 'Khớp — Match!' : 'Không khớp — No Match'}
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '6px 0 0' }}>
                {compareResult ? 'Password hoàn toàn trùng khớp với mã Hash.' : 'Password không đúng hoặc Hash không hợp lệ.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
