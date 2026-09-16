import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { state } from '../api/client'
import type { User } from '../types'

export function Layout({ user, onLogout }: { user: User; onLogout: () => void }) {
  const navigate = useNavigate()
  const isEmployee = user.role === 'EMPLOYEE'

  return (
    <div className="shell">
      <nav className="sidebar">
        <div className="brand">
          <div className="brand-mark">G</div>
          <div>
            <div className="brand-name">Global Bank</div>
            <div className="brand-sub">AGENTIC</div>
          </div>
        </div>

        {!isEmployee && <><div className="nav-section">Banking</div>
        <NavLink to={`/customer/${user.userid}`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Accounts</NavLink>
        <NavLink to={`/customer/${user.userid}/deposit`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Deposit</NavLink>
        <NavLink to={`/customer/${user.userid}/withdraw`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Withdraw</NavLink>
        <NavLink to={`/customer/${user.userid}/transfer`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Transfer</NavLink>
        <NavLink to={`/customer/${user.userid}/statements`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Statements</NavLink></>}

        {isEmployee && (
          <>
            <div className="nav-section">Operations</div>
            <NavLink to="/employee/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>Customers</NavLink>
            <NavLink to="/employee/customers/create-customer" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>New customer</NavLink>
          </>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <div className={`badge ${state.live ? 'live' : 'demo'}`} title={state.live ? 'Connected to the Spring Boot services' : 'Services unreachable — showing seeded demo data'}>
            {state.live ? 'LIVE API' : 'DEMO DATA'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', margin: '12px 0 8px' }}>
            {user.username ?? user.userid}
            {user.role && <span style={{ opacity: .6 }}> · {user.role.toLowerCase()}</span>}
          </div>
          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => { onLogout(); navigate('/login') }}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="main"><Outlet /></div>
    </div>
  )
}
