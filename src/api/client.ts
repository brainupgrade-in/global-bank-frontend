import type { Account, Customer, Transaction, User } from '../types'
import { mockAccounts, mockCustomers, mockTransactions, mockUsers } from './mock'

/**
 * Every call hits the real service first and falls back to seeded data when the
 * backend is unreachable. `live` records which happened, so the UI can say so
 * rather than quietly pretending demo numbers are real.
 */
export const state = { live: false, checked: false }

const TIMEOUT_MS = 2500

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    state.live = true
    state.checked = true
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

/** Try the service; on any failure return the seeded equivalent. */
async function withFallback<T>(path: string, fallback: () => T, init?: RequestInit): Promise<T> {
  try {
    return await request<T>(path, init)
  } catch {
    state.live = false
    state.checked = true
    return fallback()
  }
}

const token = () => localStorage.getItem('authToken') ?? ''
const auth = () => ({ Authorization: `Bearer ${token()}` })

export const api = {
  async login(userid: string, password: string): Promise<User> {
    return withFallback<User>(
      '/auth/login',
      () => {
        const found = mockUsers.find((u) => u.userid === userid)
        if (!found) throw new Error('Unknown user')
        return { ...found, authToken: 'demo-token' }
      },
      { method: 'POST', body: JSON.stringify({ userid, password }) },
    )
  },

  getCustomers: () =>
    withFallback<Customer[]>('/customer/getCustomers', () => mockCustomers, { headers: auth() }),

  getCustomer: (userid: string) =>
    withFallback<Customer>(
      `/customer/getCustomerDetails/${userid}`,
      () => mockCustomers.find((c) => c.userid === userid) ?? mockCustomers[0],
      { headers: auth() },
    ),

  createCustomer: (customer: Customer) =>
    withFallback<Customer>('/customer/createCustomer', () => customer, {
      method: 'POST',
      headers: auth(),
      body: JSON.stringify(customer),
    }),

  getAccounts: (customerId: string) =>
    withFallback<Account[]>(
      `/account/getAccounts/${customerId}`,
      () => mockAccounts.filter((a) => a.customerId === customerId),
      { headers: auth() },
    ),

  getAccount: (accountId: number | string) =>
    withFallback<Account>(
      `/account/getAccount/${accountId}`,
      () => mockAccounts.find((a) => a.accountId === Number(accountId)) ?? mockAccounts[0],
      { headers: auth() },
    ),

  createAccount: (customerId: string, accountType: string) =>
    withFallback<Account>(
      `/account/createAccount/${customerId}`,
      () => ({
        accountId: Math.floor(Math.random() * 90000) + 10000,
        customerId,
        currentBalance: 0,
        accountType,
        ownerName: customerId,
      }),
      { method: 'POST', headers: auth(), body: JSON.stringify({ accountType }) },
    ),

  getTransactions: (accountId: number | string) =>
    withFallback<Transaction[]>(
      `/transaction/getAllTransByAccId/${accountId}`,
      () =>
        mockTransactions.filter(
          (t) => t.sourceAccountId === Number(accountId) || t.targetAccountId === Number(accountId),
        ),
      { headers: auth() },
    ),

  deposit: (accountId: number, amount: number) =>
    withFallback<Account>(
      '/account/deposit',
      () => {
        const acc = mockAccounts.find((a) => a.accountId === accountId)!
        acc.currentBalance += amount
        return acc
      },
      { method: 'POST', headers: auth(), body: JSON.stringify({ accountId, amount }) },
    ),

  withdraw: (accountId: number, amount: number) =>
    withFallback<Account>(
      '/account/withdraw',
      () => {
        const acc = mockAccounts.find((a) => a.accountId === accountId)!
        acc.currentBalance -= amount
        return acc
      },
      { method: 'POST', headers: auth(), body: JSON.stringify({ accountId, amount }) },
    ),

  transfer: (sourceAccountId: number, targetAccountId: number, amount: number) =>
    withFallback<Transaction>(
      '/transaction/transactions',
      () => {
        const src = mockAccounts.find((a) => a.accountId === sourceAccountId)
        const tgt = mockAccounts.find((a) => a.accountId === targetAccountId)
        if (src) src.currentBalance -= amount
        if (tgt) tgt.currentBalance += amount
        return {
          id: Date.now(),
          amount,
          initiationDate: new Date().toISOString(),
          reference: 'TRANSFER',
          sourceAccountId,
          sourceOwnerName: src?.ownerName ?? '',
          targetAccountId,
          targetOwnerName: tgt?.ownerName ?? '',
        }
      },
      { method: 'POST', headers: auth(), body: JSON.stringify({ sourceAccountId, targetAccountId, amount }) },
    ),
}
