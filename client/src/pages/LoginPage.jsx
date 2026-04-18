import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userApi } from '../api/index.js';

const ROLES = [
  { value: 'employee',      label: 'Employee' },
  { value: 'manager',       label: 'Manager' },
  { value: 'finance_admin', label: 'Finance Admin' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', role: 'employee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await userApi.signup({
          name: form.name,
          email: form.email,
          role: form.role,
        });
        login(res.user);
      } else {
        const users = await userApi.getAll();
        const match = users.find((u) => u.email === form.email);
        if (!match) throw new Error('User not found. Please sign up first.');
        login(match);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">₹</span>
          <h1>ExpenseFlow</h1>
          <p>Smart expense management &amp; reimbursement</p>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="field">
              <label>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                required
              />
            </div>
          )}

          <div className="field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="field">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? 'Please wait…'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        <div className="auth-hint">
          <p>
            {mode === 'login'
              ? 'No account? '
              : 'Already registered? '}
            <button
              type="button"
              className="link-btn"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="auth-info-box">
          <div className="auth-info-title">Approval Routing</div>
          <div className="auth-info-row">
            <span className="info-dot dot-green" />
            &lt; ₹1,500 → Auto Approved
          </div>
          <div className="auth-info-row">
            <span className="info-dot dot-blue" />
            ₹1,500 – ₹9,999 → Manager Approval
          </div>
          <div className="auth-info-row">
            <span className="info-dot dot-orange" />
            ≥ ₹10,000 → Manager → Finance
          </div>
        </div>
      </div>
    </div>
  );
}
