# global-bank-frontend

The Global Bank web client. React 19 + TypeScript on Vite, talking to the five Spring Boot
services behind it.

## Running it

```bash
npm install
npm run dev        # http://localhost:4200
```

The dev server proxies `/auth`, `/customer`, `/account`, `/transaction` and `/rules` to
localhost:8084–8090, mirroring what nginx does in the container. The app only ever calls
same-origin paths, so nothing in the code knows where the services live.

```bash
npm run build      # type-checks, then emits dist/
npm run preview    # serve the build
```

## It works with the backend down

Every call tries the real service first and falls back to data seeded from the services' own
`data.sql`. The sidebar shows which is in play — **LIVE API** or **DEMO DATA** — so demo
numbers are never mistaken for real ones.

That is deliberate: a workshop demo that needs five Spring Boot services running is a demo
that breaks in front of an audience.

## The agent surfaces

`src/agents/engine.ts` drives the assistant, the insights and the activity feed. Nothing calls
a model yet — the insights are deterministic reads over the account's real transactions, so
what the UI claims is always true of the data beside it. A panel that invents plausible
numbers is worse than no panel.

The seam is the point: replace those functions with a gateway call and every surface starts
speaking for a real agent, with no component changes.

## Layout

```
src/
  api/client.ts     real calls + fallback; `state.live` records which happened
  api/mock.ts       seed data, mirroring the services' data.sql
  agents/engine.ts  insights, agent runs, assistant answers
  components/       Layout (shell + nav), AgentPanel
  pages/            Login, Accounts, Transactions, Money, Statements, Employee
```

## Deployment

`Dockerfile` is multi-stage and builds the app itself — `docker build .` is the whole story.
The previous one assumed you had already run `ng build` and copied `dist/` in by hand.

`nginx.conf` proxies to Kubernetes Service names (`auth`, `customer`, `account`,
`transaction`, `rules`), not a hardcoded LAN address, and falls back to `index.html` so deep
links resolve.
