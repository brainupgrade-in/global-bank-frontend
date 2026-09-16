// Mirrors the Spring Boot service contracts exactly. Field names come from the
// JSON the services return, so nothing is renamed on the way in.

export interface User {
  userid: string
  username?: string
  password?: string
  authToken?: string
  role?: string
}

export interface Transaction {
  id: number
  amount: number
  initiationDate: string
  reference: string
  sourceAccountId: number
  sourceOwnerName: string
  targetAccountId: number
  targetOwnerName: string
}

export interface Account {
  accountId: number
  customerId: string
  currentBalance: number
  accountType: string
  ownerName: string
  transactions?: Transaction[]
}

export interface Customer {
  userid: string
  username: string
  address: string
  dateOfBirth: string
  pan: string
  password?: string
  accounts?: Account[]
}

/** What the agent surfaces render. Shaped so a real model can fill it later. */
export interface AgentInsight {
  id: string
  agent: string
  headline: string
  detail: string
  tone: 'positive' | 'neutral' | 'warning'
}

export interface AgentRun {
  id: string
  agent: string
  task: string
  status: 'queued' | 'running' | 'done' | 'flagged'
  ms?: number
}
