import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Accounts } from './pages/Accounts'
import { Transactions } from './pages/Transactions'
import { Money } from './pages/Money'
import { Statements } from './pages/Statements'
import { Customers, CustomerAccounts, CreateCustomer } from './pages/Employee'
import type { User } from './types'

const STORED = 'globalbank.user'

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    try { const raw = localStorage.getItem(STORED); return raw ? (JSON.parse(raw) as User) : null } catch { return null }
  })

  function login(u: User) {
    setUser(u)
    try { localStorage.setItem(STORED, JSON.stringify(u)) } catch { /* private mode */ }
  }
  function logout() {
    setUser(null)
    try { localStorage.removeItem(STORED); localStorage.removeItem('authToken') } catch { /* private mode */ }
  }

  // Employees have no accounts of their own, so sending them to the customer
  // view lands them on an empty page. Their work starts at the customer list.
  const home = user?.role === 'EMPLOYEE' ? '/employee/customers' : `/customer/${user?.userid}`

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login onLogin={login} />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} onLogout={logout} />}>
          <Route path="/" element={<Navigate to={home} replace />} />
          <Route path="/login" element={<Navigate to={home} replace />} />

          <Route path="/customer/:customerid" element={<Accounts />} />
          <Route path="/customer/:customerid/deposit" element={<Money mode="deposit" />} />
          <Route path="/customer/:customerid/withdraw" element={<Money mode="withdraw" />} />
          <Route path="/customer/:customerid/transfer" element={<Money mode="transfer" />} />
          <Route path="/customer/:customerid/statements" element={<Statements />} />
          <Route path="/customers/:customerid/accounts" element={<Accounts />} />
          <Route path="/account/:accountid/transactions" element={<Transactions />} />

          <Route path="/employee" element={<Navigate to="/employee/customers" replace />} />
          <Route path="/employee/customers" element={<Customers />} />
          <Route path="/employee/customers/create-customer" element={<CreateCustomer />} />
          <Route path="/employee/customers/:customerid/accounts" element={<CustomerAccounts />} />
          <Route path="/employee/customers/:customerid/accounts/create-account" element={<CustomerAccounts />} />
          <Route path="/employee/customers/:customerid/accounts/:accountid/transactions" element={<Transactions />} />

          <Route path="*" element={<Navigate to={home} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
