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

  const db = {
    orders: ordersDb,
    clients: clientsDb,
    catalog: catalogDb,
    expenses: expensesDb,
  }

  const toast = (msg, type) => {
    setToastMsg({ msg, type })
    setTimeout(() => setToastMsg(null), 2200)
  }

  const activeOrders = orders.filter(o => o.status !== 'Завершён').length

  const pageProps = { orders, clients, catalog, expenses, db, toast }

  return (
    <div style={{ background: '#0e1016', minHeight: '100vh', display: 'flex', flexDirection: 'column', maxWidth: 520, margin: '0 auto', position: 'relative' }}>
      {}
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return null
  return (<AuthProvider>{user ? <CRM /> : <Login />}</AuthProvider>)
}
