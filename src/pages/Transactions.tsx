import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { AgentPanel } from '../components/AgentPanel'
import type { Account, Transaction } from '../types'
import { inr, shortDate } from '../format'

export function Transactions({ title = 'Transactions' }: { title?: string }) {
  const { accountid = '' } = useParams()
  const [account, setAccount] = useState<Account | null>(null)
  const [txns, setTxns] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [acc, list] = await Promise.all([api.getAccount(accountid), api.getTransactions(accountid)])
      if (cancelled) return
      setAccount(acc); setTxns(list); setLoading(false)
    })()
    return () => { cancelled = true }
  }, [accountid])

  const id = Number(accountid)

  return (
    <>
      <div className="content">
        <div className="page-head">
          <div>
            <h1>{title}</h1>
            <p className="page-sub">
              Account #{accountid}
              {account && ` · ${account.accountType} · ${inr(account.currentBalance)}`}
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="empty">Loading transactions…</div>
          ) : txns.length === 0 ? (
            <div className="empty">No transactions on this account.</div>
          ) : (
            <table>
              <thead>
                <tr><th>Date</th><th>Reference</th><th>Counterparty</th><th style={{ textAlign: 'right' }}>Amount</th></tr>
              </thead>
              <tbody>
                {txns.map((t) => {
                  const out = t.sourceAccountId === id
                  return (
                    <tr key={t.id}>
                      <td className="mono">{shortDate(t.initiationDate)}</td>
                      <td>{t.reference}</td>
                      <td style={{ color: 'var(--muted)' }}>{out ? t.targetOwnerName : t.sourceOwnerName}</td>
                      <td className={`mono ${out ? 'amount-out' : 'amount-in'}`} style={{ textAlign: 'right' }}>
                        {out ? '−' : '+'}{inr(t.amount)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <AgentPanel account={account} txns={txns} />
    </>
  )
}
