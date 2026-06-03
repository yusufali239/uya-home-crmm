import { useState } from 'react'
import { AuthProvider, useAuth } from './lib/auth'
import { useOrders, useClients, useCatalog, useExpenses } from './lib/useDb'
import { Icon, Toast } from './components/ui'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Clients from './pages/Clients'
import { Catalog, Finance, Analytics } from './pages/Other'

const TABS = [
  { id: 'dashboard', label: 'Главная', icon: 'home' },
  { id: 'orders', label: 'Заказы', icon: 'orders' },
  { id: 'clients', label: 'Клиенты', icon: 'users' },
  { id: 'catalog', label: 'Каталог', icon: 'grid' },
  { id: 'finance', label: 'Финансы', icon: 'dollar' },
  { id: 'analytics', label: 'Аналитика', icon: 'bar' },
]

function CRM() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState('dashboard')
  const [toastMsg, setToastMsg] = useState(null)

  const { rows: orders, ...ordersDb } = useOrders()
  const { rows: clients, ...clientsDb } = useClients()
  const { rows: catalog, ...catalogDb } = useCatalog()
  const { rows: expenses, ...expensesDb } = useExpenses()

  const db = { orders: ordersDb, clients: clientsDb, catalog: catalogDb, expenses: expensesDb }

  const toast = (msg, type) => {
    setToastMsg({ msg, type })
    setTimeout(() => setToastMsg(null), 2200)
  }

  const activeOrders = orders.filter(o => o.status !== 'Завершён').length
  const pageProps = { orders, clients, catalog, expenses, db, toast }

  return (
    <div style={{ background: '#0e1016', minHeight: '100vh', display: 'flex', flexDirection: 'column', maxWidth: 520, margin: '0 auto', position: 'relative' }}>
      <div style={{ background: '#15171c', borderBottom: '1px solid #1e2028', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#c9a96e,#e8c98a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#0e1016' }}>U</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1 }}>UYA HOME</div>
            <div style={{ fontSize: 10, color: '#444' }}>{user?.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#10b98115', border: '1px solid #10b98130', borderRadius: 8, padding: '3px 10px', fontSize: 12, color: '#10b981', fontWeight: 600 }}>
            {activeOrders} активных
          </div>
          <button onClick={signOut} style={{ background: '#1e2028', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', color: '#666', display: 'flex' }}>
            <Icon n="logout" size={15} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 16px 90px', overflowX: 'hidden' }}>
        {tab === 'dashboard' && <Dashboard orders={orders} clients={clients} expenses={expenses} />}
        {tab === 'orders' && <Orders {...pageProps} />}
        {tab === 'clients' && <Clients {...pageProps} />}
        {tab === 'catalog' && <Catalog {...pageProps} />}
        {tab === 'finance' && <Finance {...pageProps} />}
        {tab === 'analytics' && <Analytics {...pageProps} />}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 520, background: '#15171c', borderTop: '1px solid #1e2028', display: 'flex', zIndex: 200, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {TABS.map(t => {
          const active = tab === t.id
          const badge = t.id === 'orders' ? orders.filter(o => o.status === 'Новый').length : 0
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '9px 4px 11px', background: 'none', border: 'none', cursor: 'pointer', color: active ? '#c9a96e' : '#444', borderTop: active ? '2px solid #c9a96e' : '2px solid transparent', position: 'relative' }}>
              <Icon n={t.icon} size={18} />
              <span style={{ fontSize: 9, fontWeight: active ? 700 : 500 }}>{t.label}</span>
              {badge > 0 && (
                <span style={{ position: 'absolute', top: 6, right: '50%', marginRight: -18, background: '#ef4444', color: '#fff', borderRadius: 10, fontSize: 9, fontWeight: 800, padding: '1px 5px', minWidth: 14, textAlign: 'center' }}>{badge}</span>
              )}
            </button>
          )
        })}
      </div>

      {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} />}
    </div>
  )
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ background: '#0e1016', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#c9a96e,#e8c98a)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#0e1016' }}>U</div>
      <div style={{ color: '#444', fontSize: 14 }}>Загрузка...</div>
    </div>
  )

  return user ? <CRM /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
