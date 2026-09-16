import { useState } from 'react'
import { api } from '../api/client'
import type { User } from '../types'

export function Login({ onLogin }: { onLogin: (u: User) => void }) {
  const [userid, setUserid] = useState('admin')
  const [password, setPassword] = useState('unigps')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null)
    try {
      const user = await api.login(userid, password)
      if (user.authToken) localStorage.setItem('authToken', user.authToken)
      onLogin(user)
    } catch {
      setError('Those credentials were not accepted.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-hero">
          <div className="brand-mark" style={{ margin: '0 auto 14px', width: 42, height: 42, fontSize: 19, borderRadius: 12 }}>G</div>
          <h1>Global Bank</h1>
          <p>Banking with agents in the loop</p>
        </div>
        <form className="card" onSubmit={submit}>
          <div className="field">
            <label htmlFor="userid">User ID</label>
            <input id="userid" value={userid} onChange={(e) => setUserid(e.target.value)} autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button className="btn" style={{ width: '100%' }} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <p className="hint">
          Seeded users: <code>admin</code> / <code>eric</code> / <code>john</code> / <code>ratan</code><br />
          password <code>unigps</code>
        </p>
      </div>
    </div>
  )
}
