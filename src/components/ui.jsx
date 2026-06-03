// ─── ICONS ──────────────────────────────────────────────────────────────────
const PATHS = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  orders: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  dollar: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  bar: "M18 20V10M12 20V4M6 20v-6",
  plus: "M12 5v14M5 12h14",
  x: "M18 6L6 18M6 6l12 12",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  check: "M20 6L9 17l-5-5",
  arrow: "M5 12h14M12 5l7 7-7 7",
  warn: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
}

export const Icon = ({ n, size = 18, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {(PATHS[n] || '').split(' M').map((seg, i) => (
      <path key={i} d={i === 0 ? seg : 'M' + seg} />
    ))}
  </svg>
)

// ─── STATUS ──────────────────────────────────────────────────────────────────
export const STATUS_COLOR = {
  'Новый': '#3b82f6',
  'Производство': '#f59e0b',
  'Готов': '#8b5cf6',
  'Доставка': '#06b6d4',
  'Завершён': '#10b981',
}

export const Badge = ({ status }) => (
  <span style={{
    background: (STATUS_COLOR[status] || '#888') + '20',
    color: STATUS_COLOR[status] || '#888',
    border: `1px solid ${(STATUS_COLOR[status] || '#888')}40`,
    borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
  }}>{status}</span>
)

// ─── MODAL ───────────────────────────────────────────────────────────────────
export const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: 'fixed', inset: 0, background: '#000000bb', zIndex: 1000,
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  }} onClick={onClose}>
    <div style={{
      background: '#15171c', border: '1px solid #252830',
      borderRadius: '20px 20px 0 0', padding: '20px 20px 40px',
      width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto',
    }} onClick={e => e.stopPropagation()}>
      <div style={{ width: 36, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 18px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 17, color: '#fff', fontWeight: 700 }}>{title}</h3>
        <button onClick={onClose} style={{
          background: '#252830', border: 'none', color: '#888',
          cursor: 'pointer', borderRadius: 8, padding: 6, display: 'flex',
        }}><Icon n="x" size={16} /></button>
      </div>
      {children}
    </div>
  </div>
)

// ─── CONFIRM ─────────────────────────────────────────────────────────────────
export const Confirm = ({ msg, onYes, onNo }) => (
  <div style={{ position: 'fixed', inset: 0, background: '#000000cc', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ background: '#15171c', border: '1px solid #252830', borderRadius: 16, padding: 24, maxWidth: 300, width: '100%', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <div style={{ color: '#ddd', marginBottom: 20, fontSize: 15, lineHeight: 1.5 }}>{msg}</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onYes} style={{ flex: 1, background: '#ef444420', color: '#ef4444', border: '1px solid #ef444440', borderRadius: 10, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Удалить</button>
        <button onClick={onNo} style={{ flex: 1, background: '#252830', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Отмена</button>
      </div>
    </div>
  </div>
)

// ─── TOAST ───────────────────────────────────────────────────────────────────
export const Toast = ({ msg, type = 'success' }) => (
  <div style={{
    position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
    background: type === 'error' ? '#ef4444' : '#10b981',
    color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13,
    fontWeight: 700, zIndex: 3000, whiteSpace: 'nowrap',
    boxShadow: `0 4px 20px ${type === 'error' ? '#ef444440' : '#10b98140'}`,
  }}>{msg}</div>
)

// ─── CARD ────────────────────────────────────────────────────────────────────
export const Card = ({ children, accent, style }) => (
  <div style={{
    background: '#15171c', border: '1px solid #1e2028', borderRadius: 14,
    padding: 16, borderLeft: accent ? `3px solid ${accent}` : undefined,
    ...style,
  }}>{children}</div>
)

// ─── FORM ATOMS ──────────────────────────────────────────────────────────────
const baseInput = {
  width: '100%', background: '#0e1016', border: '1px solid #252830',
  borderRadius: 10, padding: '11px 13px', color: '#fff', fontSize: 14,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

export const Field = ({ label, children }) => (
  <div style={{ marginBottom: 13 }}>
    <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    {children}
  </div>
)

export const Inp = ({ style, ...p }) => (
  <input {...p} style={{ ...baseInput, ...style }} />
)

export const Sel = ({ children, style, ...p }) => (
  <select {...p} style={{ ...baseInput, appearance: 'none', ...style }}>{children}</select>
)

export const Textarea = ({ style, ...p }) => (
  <textarea {...p} style={{ ...baseInput, minHeight: 70, resize: 'vertical', ...style }} />
)

export const Btn = ({ children, variant = 'gold', sm, style, ...p }) => (
  <button {...p} style={{
    background: variant === 'gold' ? 'linear-gradient(135deg,#c9a96e,#e8c98a)'
      : variant === 'red' ? '#ef444418'
      : '#1e2028',
    color: variant === 'gold' ? '#0e1016' : variant === 'red' ? '#ef4444' : '#ccc',
    border: variant === 'red' ? '1px solid #ef444430' : 'none',
    borderRadius: 10, padding: sm ? '7px 12px' : '11px 18px',
    fontSize: sm ? 12 : 14, fontWeight: 700, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
    ...style,
  }}>{children}</button>
)

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
export const STATUSES = ['Новый', 'Производство', 'Готов', 'Доставка', 'Завершён']
export const SOURCES = ['Instagram', 'WhatsApp', 'Telegram', 'Сайт', 'Другое']
export const EXP_CATS = ['Материалы', 'Подрядчик', 'Доставка', 'Зарплата', 'Реклама', 'Другое']
export const fmt = (n) => (+(n) || 0).toLocaleString('ru-RU') + ' с'
export const today = () => new Date().toISOString().slice(0, 10)
