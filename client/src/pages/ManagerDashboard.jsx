import { useState, useEffect } from 'react';
import { expenseApi } from '../api/index.js';
import { ExpenseRow, RejectModal, formatINR } from '../components/Shared.jsx';

export default function ManagerDashboard() {
  const [expenses, setExpenses]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [filter, setFilter]           = useState('submitted');

  const fetchExpenses = async () => {
    try {
      const data = await expenseApi.getAll();
      setExpenses(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleApprove = async (id) => {
    setError('');
    try {
      await expenseApi.approve(id);
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id, _reason) => {
    setError('');
    try {
      await expenseApi.reject(id);
      setRejectTarget(null);
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered   = filter === 'all' ? expenses : expenses.filter((e) => e.status === filter);
  const submitted  = expenses.filter((e) => e.status === 'submitted').length;
  const approved   = expenses.filter((e) => e.status === 'approved').length;
  const totalValue = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-highlight">
          <div className="stat-label">Awaiting Review</div>
          <div className="stat-value">{submitted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved (Pending Finance)</div>
          <div className="stat-value">{approved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Claims Value</div>
          <div className="stat-value">{formatINR(totalValue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Claims</div>
          <div className="stat-value">{expenses.length}</div>
        </div>
      </div>

      {/* Section Header + Filters */}
      <div className="section-header">
        <h2>Team Expenses</h2>
        <div className="filter-tabs">
          {['all', 'submitted', 'approved', 'rejected', 'paid'].map((s) => (
            <button
              key={s}
              className={filter === s ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s === 'submitted' && submitted > 0 && (
                <span className="tab-badge">{submitted}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading team expenses…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>No expenses in this category.</p>
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
                <th>Employee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((expense) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  showUser={true}
                  actions={
                    expense.status === 'submitted' ? (
                      <>
                        <button
                          className="btn-success btn-xs"
                          onClick={() => handleApprove(expense.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-danger btn-xs"
                          onClick={() => setRejectTarget(expense.id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : null
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          onConfirm={(reason) => handleReject(rejectTarget, reason)}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}
