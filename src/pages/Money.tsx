import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { AgentPanel } from '../components/AgentPanel'
import type { Account, Transaction } from '../types'
import { inr } from '../format'

type Mode = 'deposit' | 'withdraw' | 'transfer'

const copy: Record<Mode, { title: string; sub: string; verb: string }> = {
  deposit:  { title: 'Deposit',  sub: 'Add funds to an account',           verb: 'Deposit' },
  withdraw: { title: 'Withdraw', sub: 'Take funds out of an account',      verb: 'Withdraw' },
  transfer: { title: 'Transfer', sub: 'Move money between two accounts',   verb: 'Transfer' },
}

export function Money({ mode }: { mode: Mode }) {
  const { customerid = '' } = useParams()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [txns, setTxns] = useState<Transaction[]>([])
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ;(async () => {
      const accs = await api.getAccounts(customerid)
      setAccounts(accs)
      if (accs[0]) { setSource(String(accs[0].accountId)); setTxns(await api.getTransactions(accs[0].accountId)) }
      if (accs[1]) setTarget(String(accs[1].accountId))
    })()
  }, [customerid])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    setError(null); setResult(null)
    if (!Number.isFinite(value) || value <= 0) { setError('Enter an amount greater than zero.'); return }
    if (mode === 'transfer' && source === target) { setError('Pick two different accounts.'); return }

    setBusy(true)
    try {
      if (mode === 'deposit')  await api.deposit(Number(source), value)
      if (mode === 'withdraw') await api.withdraw(Number(source), value)
      if (mode === 'transfer') await api.transfer(Number(source), Number(target), value)
      setResult(`${copy[mode].verb} of ${inr(value)} completed.`)
      setAmount('')
      setAccounts(await api.getAccounts(customerid))
    } catch {
      setError('The service rejected that operation.')
    } finally {
      setBusy(false)
    }
  }

  const selected = accounts.find((a) => a.accountId === Number(source)) ?? null

  return (
    <>
      <div className="content">
        <div className="page-head">
          <div>
            <h1>{copy[mode].title}</h1>
            <p className="page-sub">{copy[mode].sub}</p>
          </div>
        </div>

        <form className="card" style={{ maxWidth: 440 }} onSubmit={submit}>
          <div className="field">
            <label htmlFor="source">{mode === 'transfer' ? 'From account' : 'Account'}</label>
            <select id="source" value={source} onChange={(e) => setSource(e.target.value)}>
              {accounts.map((a) => (
                <option key={a.accountId} value={a.accountId}>
                  {a.accountType} #{a.accountId} — {inr(a.currentBalance)}
                </option>
              ))}
            </select>
          </div>

          {mode === 'transfer' && (
            <div className="field">
              <label htmlFor="target">To account</label>
              <select id="target" value={target} onChange={(e) => setTarget(e.target.value)}>
                {accounts.map((a) => (
                  <option key={a.accountId} value={a.accountId}>
                    {a.accountType} #{a.accountId} — {inr(a.currentBalance)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="field">
            <label htmlFor="amount">Amount</label>
            <input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          </div>

          <button className="btn" disabled={busy || accounts.length === 0}>
            {busy ? 'Working…' : copy[mode].verb}
          </button>
          {result && <div style={{ color: 'var(--accent)', fontSize: 13, marginTop: 11 }}>{result}</div>}
          {error && <div className="error">{error}</div>}
        </form>
      </div>
      <AgentPanel account={selected} txns={txns} />
    </>
  )
}
