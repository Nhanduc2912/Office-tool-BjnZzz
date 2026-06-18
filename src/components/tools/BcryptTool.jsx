import { useState } from 'react';
import bcrypt from 'bcryptjs';

export default function BcryptTool() {
  const [activeTab, setActiveTab] = useState('hash'); // 'hash' | 'compare'
  
  // Hash state
  const [plainText, setPlainText] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hashResult, setHashResult] = useState('');
  const [isHashing, setIsHashing] = useState(false);

  // Compare state
  const [compareText, setCompareText] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [compareResult, setCompareResult] = useState(null); // null | true | false
  const [isComparing, setIsComparing] = useState(false);

  const handleHash = () => {
    if (!plainText) return;
    setIsHashing(true);
    // Use timeout to allow UI to update before heavy synchronous task
    setTimeout(() => {
      try {
        const salt = bcrypt.genSaltSync(rounds);
        const hash = bcrypt.hashSync(plainText, salt);
        setHashResult(hash);
      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi mã hóa.');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Tabs */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
        <button
          onClick={() => setActiveTab('hash')}
          style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'hash' ? 'var(--accent)' : 'transparent', color: activeTab === 'hash' ? '#000' : 'var(--text)', fontWeight: 600, transition: 'all 0.2s' }}
        >
          Tạo mã Hash
        </button>
        <button
          onClick={() => { setActiveTab('compare'); setCompareResult(null); }}
          style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'compare' ? 'var(--accent)' : 'transparent', color: activeTab === 'compare' ? '#000' : 'var(--text)', fontWeight: 600, transition: 'all 0.2s' }}
        >
          Kiểm tra (Compare)
        </button>
      </div>

      {activeTab === 'hash' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Chuỗi cần mã hóa (Password):</label>
            <input 
              type="text" 
              value={plainText} 
              onChange={e => setPlainText(e.target.value)} 
              placeholder="Ví dụ: mysecretpassword123"
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', fontSize: '15px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Số vòng lặp (Salt Rounds): <strong>{rounds}</strong></label>
            <input 
              type="range" min="4" max="15" 
              value={rounds} 
              onChange={e => setRounds(Number(e.target.value))} 
              style={{ width: '100%', accentColor: 'var(--accent)' }} 
            />
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Lưu ý: Số vòng càng lớn, mã hóa càng chậm nhưng càng bảo mật (Khuyên dùng: 10).</span>
          </div>

          <button 
            onClick={handleHash} 
            disabled={!plainText || isHashing}
            style={{ padding: '14px', borderRadius: '10px', border: 'none', background: (!plainText || isHashing) ? 'var(--border)' : 'var(--accent)', color: (!plainText || isHashing) ? 'var(--muted)' : '#000', fontWeight: 700, fontSize: '15px', cursor: (!plainText || isHashing) ? 'not-allowed' : 'pointer' }}
          >
            {isHashing ? 'Đang mã hóa...' : 'Tạo Bcrypt Hash'}
          </button>

          {hashResult && (
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>Kết quả Hash:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={hashResult} 
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid var(--accent)', background: 'rgba(74,222,128,0.05)', color: 'var(--text)', fontSize: '14px', fontFamily: 'monospace' }} 
                />
                <button 
                  onClick={() => { navigator.clipboard.writeText(hashResult); alert('Đã copy mã Hash!'); }}
                  style={{ padding: '0 20px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Mã Hash (Bcrypt):</label>
            <input 
              type="text" 
              value={compareHash} 
              onChange={e => { setCompareHash(e.target.value); setCompareResult(null); }} 
              placeholder="$2a$10$..."
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', fontSize: '14px', fontFamily: 'monospace' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Chuỗi văn bản (Password cần kiểm tra):</label>
            <input 
              type="text" 
              value={compareText} 
              onChange={e => { setCompareText(e.target.value); setCompareResult(null); }} 
              placeholder="Nhập password..."
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text)', fontSize: '15px' }} 
            />
          </div>

          <button 
            onClick={handleCompare} 
            disabled={!compareText || !compareHash || isComparing}
            style={{ padding: '14px', borderRadius: '10px', border: 'none', background: (!compareText || !compareHash || isComparing) ? 'var(--border)' : '#60a5fa', color: (!compareText || !compareHash || isComparing) ? 'var(--muted)' : '#000', fontWeight: 700, fontSize: '15px', cursor: (!compareText || !compareHash || isComparing) ? 'not-allowed' : 'pointer' }}
          >
            {isComparing ? 'Đang kiểm tra...' : 'Kiểm tra khớp (Compare)'}
          </button>

          {compareResult !== null && (
            <div style={{ 
              marginTop: '16px', padding: '20px', borderRadius: '12px', textAlign: 'center',
              background: compareResult ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${compareResult ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`
            }}>
              {compareResult ? (
                <>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                  <div style={{ color: '#4ade80', fontSize: '18px', fontWeight: 700 }}>Khớp (Match)</div>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '4px 0 0' }}>Mật khẩu hoàn toàn trùng khớp với mã Hash.</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>❌</div>
                  <div style={{ color: '#ef4444', fontSize: '18px', fontWeight: 700 }}>Không khớp (No Match)</div>
                  <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '4px 0 0' }}>Mật khẩu không đúng hoặc mã Hash không hợp lệ.</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
