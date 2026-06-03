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

  const inp = {
    width: '100%', background: '#0e1016', border: '1px solid #252830',
    borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14,
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
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
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="manager@uyahome.kg"
              required
              style={inp}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inp}
            />
          </div>

          {error && (
            <div style={{ background: '#ef444415', border: '1px solid #ef444430', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg,#c9a96e,#e8c98a)', color: '#0e1016', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#444' }}>
          Доступ только для сотрудников UYA HOME
        </div>
      </div>
    </div>
  )
}
