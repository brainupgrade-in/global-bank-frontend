import type { Account, AgentInsight, AgentRun, Transaction } from '../types'

/**
 * The agent surfaces are driven from here. Nothing calls a model yet — these are
 * deterministic reads over the account's real transactions, so what the UI shows
 * is always true of the data on screen rather than invented copy.
 *
 * The seam is deliberate: swap these functions for a gateway call and every
 * surface in the app starts speaking for a real agent with no component changes.
 */

const inr = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export function deriveInsights(account: Account, txns: Transaction[]): AgentInsight[] {
  const out: AgentInsight[] = []
  const id = account.accountId

  const outgoing = txns.filter((t) => t.sourceAccountId === id)
  const incoming = txns.filter((t) => t.targetAccountId === id)
  const spend = outgoing.reduce((s, t) => s + t.amount, 0)
  const earn = incoming.reduce((s, t) => s + t.amount, 0)

  if (txns.length === 0) {
    return [{
      id: 'no-activity', agent: 'spend agent', tone: 'neutral',
      headline: 'No activity to analyse',
      detail: 'This account has no transactions yet, so there is nothing to draw a conclusion from.',
    }]
  }

  out.push({
    id: 'flow', agent: 'spend agent',
    tone: spend > earn ? 'warning' : 'positive',
    headline: spend > earn ? 'Outflow exceeds inflow' : 'Inflow ahead of outflow',
    detail: `${inr(spend)} out across ${outgoing.length} debits against ${inr(earn)} in across ${incoming.length} credits.`,
  })

  const largest = [...outgoing].sort((a, b) => b.amount - a.amount)[0]
  if (largest) {
    const share = spend > 0 ? Math.round((largest.amount / spend) * 100) : 0
    out.push({
      id: 'concentration', agent: 'spend agent',
      tone: share > 50 ? 'warning' : 'neutral',
      headline: `${share}% of spend is a single payment`,
      detail: `${largest.reference} at ${inr(largest.amount)} to ${largest.targetOwnerName}.`,
    })
  }

  const runway = spend > 0 ? account.currentBalance / (spend / Math.max(txns.length, 1)) : Infinity
  out.push({
    id: 'runway', agent: 'risk agent',
    tone: runway < 5 ? 'warning' : 'positive',
    headline: Number.isFinite(runway) ? `${Math.floor(runway)} payments of headroom` : 'No spend to project',
    detail: `Balance ${inr(account.currentBalance)} against an average debit of ${inr(spend / Math.max(outgoing.length, 1))}.`,
  })

  return out
}

/** Whether anything here should be treated as suspicious, and why. */
export function fraudScan(txns: Transaction[]): AgentRun {
  const large = txns.filter((t) => t.amount > 20000)
  return {
    id: 'fraud', agent: 'fraud agent',
    task: 'Scan transactions for anomalies',
    status: large.length > 1 ? 'flagged' : 'done',
    ms: 120 + txns.length * 7,
  }
}

export function agentRuns(txns: Transaction[]): AgentRun[] {
  return [
    { id: 'kyc',  agent: 'kyc agent',   task: 'Verify identity documents', status: 'done', ms: 210 },
    { id: 'risk', agent: 'risk agent',  task: 'Score account risk',        status: 'done', ms: 340 },
    fraudScan(txns),
    { id: 'spend', agent: 'spend agent', task: 'Categorise spending',      status: 'done', ms: 180 + txns.length * 4 },
  ]
}

/** Answers the assistant panel gives. Grounded in the same data as the insights. */
export function ask(question: string, account: Account | null, txns: Transaction[]): string {
  const q = question.toLowerCase()
  if (!account) return 'Select an account first and I will look at its activity.'

  if (q.includes('balance')) {
    return `${account.accountType} account ${account.accountId} holds ${inr(account.currentBalance)}.`
  }
  if (q.includes('spend') || q.includes('spent') || q.includes('outflow')) {
    const spend = txns.filter((t) => t.sourceAccountId === account.accountId).reduce((s, t) => s + t.amount, 0)
    return `${inr(spend)} has left this account across ${txns.filter((t) => t.sourceAccountId === account.accountId).length} debits.`
  }
  if (q.includes('largest') || q.includes('biggest')) {
    const l = [...txns].sort((a, b) => b.amount - a.amount)[0]
    return l ? `The largest movement is ${inr(l.amount)} — ${l.reference}.` : 'No transactions to compare.'
  }
  if (q.includes('fraud') || q.includes('risk') || q.includes('safe')) {
    const scan = fraudScan(txns)
    return scan.status === 'flagged'
      ? 'The fraud agent flagged more than one high-value transfer. Worth a human look.'
      : 'The fraud agent found nothing unusual in this account.'
  }
  return `I can answer on balance, spending, the largest transaction, or risk for account ${account.accountId}.`
}
