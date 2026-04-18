import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import FinanceDashboard from './pages/FinanceDashboard.jsx';
import './index.css';

const ROLE_LABEL = {
  employee:      'Employee',
  manager:       'Manager',
  finance_admin: 'Finance Admin',
};

const PAGE_TITLE = {
  employee:      'My Expenses',
  manager:       'Team Expenses',
  finance_admin: 'Finance Dashboard',
};

const PAGE_SUB = {
  employee:      'Submit and track your reimbursement claims',
  manager:       'Review and approve team expense claims',
  finance_admin: 'Final approvals, payments and financial reports',
};

function AppShell() {
  const { user, logout, isRole } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="logo-icon">₹</span>
          <span className="brand-name">ExpenseFlow</span>
        </div>
        <div className="nav-right">
          <div className="nav-user">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{ROLE_LABEL[user.role] ?? user.role}</span>
            </div>
          </div>
          <button className="btn-ghost btn-sm" onClick={logout}>
            Sign out
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <h1>{PAGE_TITLE[user.role] ?? 'Dashboard'}</h1>
          <p className="page-subtitle">{PAGE_SUB[user.role] ?? ''}</p>
        </div>

        {isRole('employee')      && <EmployeeDashboard />}
        {isRole('manager')       && <ManagerDashboard />}
        {isRole('finance_admin') && <FinanceDashboard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
