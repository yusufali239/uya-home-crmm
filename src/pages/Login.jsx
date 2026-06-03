import { useState } from 'react'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) setError('Неверный email или пароль')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e1016', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#c9a96e,#e8c98a)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#0e1016', margin: '0 auto 16px' }}>U</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>UYA HOME</div>
          <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>CRM · ERP система</div>
        </div>
        <form onSubmit={handle} style={{ background: '#15171c', border: '1px solid #1e2028', borderRadius: 20, padding: 28 }}>
          {error && <div style={{ background: '#ef444415', border: '1px solid #ef444430', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#c9a96e,#e8c98a)', color: '#0e1016', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>{loading ? 'Вход...' : 'Войти'}</button>
        </form>
      </div>
    </div>
  )
}
