import type { Account, Customer, Transaction } from '../types'

// Seeded from the services' own data.sql so the fallback shows the same people
// the real backend would. This is what keeps a demo alive when nothing is running.

export const mockCustomers: Customer[] = [
  { userid: 'eric',  username: 'Eric',  address: 'Canada',    dateOfBirth: '1970-01-10', pan: 'ADKIM3241D' },
  { userid: 'john',  username: 'John',  address: 'USA',       dateOfBirth: '2001-02-04', pan: 'AFNIG8472A' },
  { userid: 'ratan', username: 'Ratan', address: 'Bangalore', dateOfBirth: '1985-12-23', pan: 'FRMAI8204U' },
]

export const mockAccounts: Account[] = [
  { accountId: 10000, customerId: 'eric',  currentBalance: 100000, accountType: 'Savings', ownerName: 'Eric D' },
  { accountId: 20000, customerId: 'john',  currentBalance: 100000, accountType: 'Savings', ownerName: 'John Rhodes' },
  { accountId: 20001, customerId: 'john',  currentBalance: 20000,  accountType: 'Current', ownerName: 'John Rhodes' },
  { accountId: 30000, customerId: 'ratan', currentBalance: 100000, accountType: 'Savings', ownerName: 'Ratan Sharma' },
  { accountId: 30001, customerId: 'ratan', currentBalance: 20000,  accountType: 'Current', ownerName: 'Ratan Sharma' },
]

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

export const mockTransactions: Transaction[] = [
  { id: 1, amount: 2500,  initiationDate: daysAgo(1),  reference: 'UPI-GROCERY',  sourceAccountId: 10000, sourceOwnerName: 'Eric D',       targetAccountId: 20000, targetOwnerName: 'John Rhodes' },
  { id: 2, amount: 18000, initiationDate: daysAgo(3),  reference: 'RENT-SEP',     sourceAccountId: 10000, sourceOwnerName: 'Eric D',       targetAccountId: 30000, targetOwnerName: 'Ratan Sharma' },
  { id: 3, amount: 640,   initiationDate: daysAgo(4),  reference: 'CARD-FUEL',    sourceAccountId: 20001, sourceOwnerName: 'John Rhodes',  targetAccountId: 10000, targetOwnerName: 'Eric D' },
  { id: 4, amount: 45000, initiationDate: daysAgo(8),  reference: 'SALARY-CREDIT',sourceAccountId: 30000, sourceOwnerName: 'Ratan Sharma', targetAccountId: 10000, targetOwnerName: 'Eric D' },
  { id: 5, amount: 1250,  initiationDate: daysAgo(11), reference: 'SUBSCRIPTION', sourceAccountId: 10000, sourceOwnerName: 'Eric D',       targetAccountId: 20001, targetOwnerName: 'John Rhodes' },
  { id: 6, amount: 7800,  initiationDate: daysAgo(15), reference: 'TRAVEL-BOOK',  sourceAccountId: 20000, sourceOwnerName: 'John Rhodes',  targetAccountId: 30001, targetOwnerName: 'Ratan Sharma' },
]

export const mockUsers = [
  { userid: 'admin',  username: 'admin',  role: 'EMPLOYEE' },
  { userid: 'simran', username: 'Simran', role: 'EMPLOYEE' },
  { userid: 'murthy', username: 'Murthy', role: 'EMPLOYEE' },
  { userid: 'eric',   username: 'Eric',   role: 'CUSTOMER' },
]
