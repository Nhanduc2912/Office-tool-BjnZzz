import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

function ToastItem({ toast, onRemove }) {
  const configs = {
    success: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.35)', icon: '✅', color: '#4ade80' },
    error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  icon: '❌', color: '#ef4444' },
    info:    { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)', icon: 'ℹ️', color: '#60a5fa' },
    warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', icon: '⚠️', color: '#f59e0b' },
  };
  const cfg = configs[toast.type] || configs.success;

  return (
    <div
      role="alert"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        padding: '14px 16px', borderRadius: '14px',
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        backdropFilter: 'blur(16px)',
        color: 'var(--text)', fontSize: '14px', fontWeight: 500,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        minWidth: '240px', maxWidth: '340px',
        animation: 'toastSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        fontFamily: 'DM Sans, sans-serif',
        lineHeight: 1.4,
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{cfg.icon}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onRemove}
        aria-label="Đóng thông báo"
        style={{
          background: 'none', border: 'none', color: 'var(--muted)',
          cursor: 'pointer', fontSize: '18px', padding: 0, lineHeight: 1,
          flexShrink: 0, transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          zIndex: 9999, display: 'flex', flexDirection: 'column',
          gap: '10px', pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast phải dùng trong ToastProvider');
  return ctx;
};
