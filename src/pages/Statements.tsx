import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { AgentPanel } from '../components/AgentPanel'
import type { Account, Transaction } from '../types'
import { inr, shortDate } from '../format'

/** A per-account statement: every account the customer holds, with its movements. */
export function Statements() {
  const { customerid = '' } = useParams()
  const [rows, setRows] = useState<{ account: Account; txns: Transaction[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const accounts = await api.getAccounts(customerid)
      const withTxns = await Promise.all(
        accounts.map(async (account) => ({ account, txns: await api.getTransactions(account.accountId) })),
      )
      setRows(withTxns); setLoading(false)
    })()
  }, [customerid])

  const all = rows.flatMap((r) => r.txns)

  return (
    <>
      <div className="content">
        <div className="page-head">
          <div>
            <h1>Statements</h1>
            <p className="page-sub">Every account held by {customerid}</p>
          </div>
        </div>

        {loading ? <div className="empty">Building statements…</div> : rows.map(({ account, txns }) => (
          <div key={account.accountId} className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '15px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div className="account-type">{account.accountType}</div>
                <div className="account-no">#{account.accountId}</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 18 }}>{inr(account.currentBalance)}</div>
            </div>
            {txns.length === 0 ? <div className="empty">No movements.</div> : (
              <table>
                <tbody>
                  {txns.map((t) => {
                    const out = t.sourceAccountId === account.accountId
                    return (
                      <tr key={t.id}>
                        <td className="mono" style={{ width: 120 }}>{shortDate(t.initiationDate)}</td>
                        <td>{t.reference}</td>
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
        ))}
      </div>
      <AgentPanel account={rows[0]?.account ?? null} txns={all} />
    </>
  )
}
