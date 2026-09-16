import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Account, Customer } from '../types'
import { inr } from '../format'

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getCustomers().then((c) => { setCustomers(c); setLoading(false) }) }, [])

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Customers</h1>
          <p className="page-sub">Everyone onboarded to the bank</p>
        </div>
        <Link to="/employee/customers/create-customer" className="btn" style={{ textDecoration: 'none' }}>New customer</Link>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="empty">Loading customers…</div> : (
          <table>
            <thead><tr><th>User ID</th><th>Name</th><th>Address</th><th>PAN</th><th></th></tr></thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.userid}>
                  <td className="mono">{c.userid}</td>
                  <td>{c.username}</td>
                  <td style={{ color: 'var(--muted)' }}>{c.address}</td>
                  <td className="mono">{c.pan}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/employee/customers/${c.userid}/accounts`} style={{ color: 'var(--accent)', fontSize: 13 }}>Accounts →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export function CustomerAccounts() {
  const { customerid = '' } = useParams()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [type, setType] = useState('Savings')
  const [busy, setBusy] = useState(false)

  useEffect(() => { api.getAccounts(customerid).then(setAccounts) }, [customerid])

  async function create() {
    setBusy(true)
    await api.createAccount(customerid, type)
    setAccounts(await api.getAccounts(customerid))
    setBusy(false)
  }

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Accounts</h1>
          <p className="page-sub">Held by {customerid}</p>
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: 130 }}>
            <option>Savings</option><option>Current</option>
          </select>
          <button className="btn" onClick={create} disabled={busy}>{busy ? 'Opening…' : 'Open account'}</button>
        </div>
      </div>

      <div className="grid grid-3">
        {accounts.map((a) => (
          <Link key={a.accountId} to={`/account/${a.accountId}/transactions`} className="card account-card">
            <div className="account-type">{a.accountType}</div>
            <div className="account-no">#{a.accountId}</div>
            <div className="balance">{inr(a.currentBalance)}</div>
          </Link>
        ))}
        {accounts.length === 0 && <div className="card empty">No accounts yet.</div>}
      </div>
    </div>
  )
}

export function CreateCustomer() {
  const navigate = useNavigate()
  const [form, setForm] = useState<Customer>({ userid: '', username: '', address: '', dateOfBirth: '', pan: '', password: '' })
  const [busy, setBusy] = useState(false)
  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    await api.createCustomer(form)
    navigate('/employee/customers')
  }

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>New customer</h1>
          <p className="page-sub">Onboard someone to the bank</p>
        </div>
      </div>
      <form className="card" style={{ maxWidth: 440 }} onSubmit={submit}>
        <div className="field"><label htmlFor="userid">User ID</label><input id="userid" value={form.userid} onChange={set('userid')} required /></div>
        <div className="field"><label htmlFor="username">Full name</label><input id="username" value={form.username} onChange={set('username')} required /></div>
        <div className="field"><label htmlFor="address">Address</label><input id="address" value={form.address} onChange={set('address')} /></div>
        <div className="field"><label htmlFor="dob">Date of birth</label><input id="dob" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} /></div>
        <div className="field"><label htmlFor="pan">PAN</label><input id="pan" value={form.pan} onChange={set('pan')} /></div>
        <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={form.password ?? ''} onChange={set('password')} /></div>
        <button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Create customer'}</button>
      </form>
    </div>
  )
}
