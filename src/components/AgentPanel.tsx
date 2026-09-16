import { useMemo, useState } from 'react'
import type { Account, Transaction } from '../types'
import { agentRuns, ask, deriveInsights } from '../agents/engine'

/**
 * The agent surface. Everything shown is derived from the account currently on
 * screen, so the panel never claims something the data does not support.
 */
export function AgentPanel({ account, txns }: { account: Account | null; txns: Transaction[] }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)

  const insights = useMemo(() => (account ? deriveInsights(account, txns) : []), [account, txns])
  const runs = useMemo(() => agentRuns(txns), [txns])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    setAnswer(ask(question, account, txns))
    setQuestion('')
  }

  return (
    <aside className="agent-panel">
      <div>
        <div className="agent-title"><span className="pulse" /> Assistant</div>
        <form onSubmit={submit} className="ask-box" style={{ marginTop: 12 }}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this account"
            aria-label="Ask the assistant about this account"
          />
          <button className="btn" type="submit">Ask</button>
        </form>
        {answer && <div className="answer" style={{ marginTop: 11 }}>{answer}</div>}
      </div>

      {insights.length > 0 && (
        <div>
          <div className="agent-title">Insights</div>
          <div style={{ display: 'grid', gap: 13, marginTop: 12 }}>
            {insights.map((i) => (
              <div key={i.id} className={`insight ${i.tone}`}>
                <div className="insight-agent">{i.agent}</div>
                <div className="insight-head">{i.headline}</div>
                <div className="insight-detail">{i.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="agent-title">Agent activity</div>
        <div style={{ marginTop: 8 }}>
          {runs.map((r) => (
            <div key={r.id} className="run">
              <span className={`run-dot ${r.status === 'flagged' ? 'flagged' : ''}`} />
              <span>
                <span className="run-agent">{r.agent}</span>
                <br />
                {r.task}
              </span>
              <span className="run-ms">{r.status === 'flagged' ? 'FLAGGED' : `${r.ms}ms`}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
