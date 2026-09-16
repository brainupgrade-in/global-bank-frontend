import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { AgentPanel } from '../components/AgentPanel'
import type { Account, Transaction } from '../types'
import { inr } from '../format'

export function Accounts() {
  const { customerid = '' } = useParams()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [txns, setTxns] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const accs = await api.getAccounts(customerid)
      if (cancelled) return
      setAccounts(accs)
      if (accs[0]) setTxns(await api.getTransactions(accs[0].accountId))
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [customerid])

  const total = accounts.reduce((s, a) => s + a.currentBalance, 0)

  return (
    <>
      <div className="content">
        <div className="page-head">
          <div>
            <h1>Accounts</h1>
            <p className="page-sub">Everything held under {customerid}</p>
          </div>
          <div className="stat-row">
            <div>
              <div className="stat-label">Total holdings</div>
              <div className="stat-value">{inr(total)}</div>
            </div>
            <div>
              <div className="stat-label">Accounts</div>
              <div className="stat-value">{accounts.length}</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="empty">Loading accounts…</div>
        ) : accounts.length === 0 ? (
          <div className="card empty">No accounts under this customer yet.</div>
        ) : (
          <div className="grid grid-3">
            {accounts.map((a) => (
              <Link key={a.accountId} to={`/account/${a.accountId}/transactions`} className="card account-card">
                <div className="account-type">{a.accountType}</div>
                <div className="account-no">#{a.accountId}</div>
                <div className="balance">{inr(a.currentBalance)}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>{a.ownerName}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <AgentPanel account={accounts[0] ?? null} txns={txns} />
    </>
  )
}
