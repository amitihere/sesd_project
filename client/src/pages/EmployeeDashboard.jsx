import { useState, useEffect } from 'react';
import { expenseApi } from '../api/index.js';
import { ExpenseRow, formatINR } from '../components/Shared.jsx';

const TYPES = ['Travel', 'Food', 'Medical', 'Accommodation', 'Equipment', 'Software', 'Training', 'Other'];

const AUTO_APPROVE_BELOW   = 1500;
const MANAGER_APPROVE_BELOW = 10000;

function routingLabel(amount) {
  if (amount < AUTO_APPROVE_BELOW)   return { label: 'Auto Approved',             cls: 'route-auto' };
  if (amount < MANAGER_APPROVE_BELOW) return { label: 'Needs Manager Approval',    cls: 'route-manager' };
  return                                      { label: 'Manager → Finance Approval', cls: 'route-finance' };
}

export default function EmployeeDashboard() {
  const [expenses, setExpenses]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [form, setForm]           = useState({ type: 'Travel', amount: '', description: '' });

  const fetchExpenses = async () => {
    try {
      const data = await expenseApi.getMine();
      setExpenses(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await expenseApi.create({ ...form, amount: Number(form.amount) });
      await fetchExpenses();
      setShowForm(false);
      setForm({ type: 'Travel', amount: '', description: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (id) => {
    setError('');
    try {
      await expenseApi.submit(id);
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const total   = expenses.reduce((s, e) => s + e.amount, 0);
  const pending = expenses.filter((e) => ['submitted', 'approved'].includes(e.status)).length;
  const paid    = expenses.filter((e) => e.status === 'paid').reduce((s, e) => s + e.amount, 0);
  const drafts  = expenses.filter((e) => e.status === 'draft').length;

  const amountNum = Number(form.amount);
  const routing   = amountNum > 0 ? routingLabel(amountNum) : null;

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Claimed</div>
          <div className="stat-value">{formatINR(total)}</div>
        </div>
        <div className="stat-card stat-highlight">
          <div className="stat-label">Pending Review</div>
          <div className="stat-value">{pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Reimbursed</div>
          <div className="stat-value accent">{formatINR(paid)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Drafts</div>
          <div className="stat-value">{drafts}</div>
        </div>
      </div>

      <div className="section-header">
        <h2>My Expenses</h2>
        {!showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + New Expense
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h3>New Expense Claim</h3>
          <form onSubmit={handleCreate} className="expense-form">
            <div className="form-row">
              <div className="field">
                <label>Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field field-sm">
                <label>Amount (₹)</label>
                <input
                  name="amount"
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {routing && (
              <div className={`routing-badge ${routing.cls}`}>
                🔀 {routing.label}
              </div>
            )}

            <div className="field">
              <label>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Client dinner, flight ticket…"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save as Draft'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Loading your expenses…</div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🧾</span>
          <p>No expense claims yet. Create your first one!</p>
        </div>
      ) : (
        <div className="card table-card">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  showLifecycle={true}
                  actions={
                    expense.status === 'draft' ? (
                      <button
                        className="btn-accent btn-xs"
                        onClick={() => handleSubmit(expense.id)}
                      >
                        Submit
                      </button>
                    ) : null
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
