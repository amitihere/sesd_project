import { useState, useEffect } from 'react';
import { expenseApi } from '../api/index.js';
import { ExpenseRow, RejectModal, formatINR } from '../components/Shared.jsx';

// High-value threshold — must match backend config (managerApproveBelow = 10000)
const HIGH_VALUE_THRESHOLD = 10000;

export default function FinanceDashboard() {
  const [expenses, setExpenses]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [filter, setFilter]             = useState('approved');
  const [activeReport, setActiveReport] = useState(null); // 'overview' | 'category' | null

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

  const handleFinalApprove = async (id) => {
    setError('');
    try {
      await expenseApi.approve(id);
      await fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkPaid = async (id) => {
    setError('');
    try {
      await expenseApi.markPaid(id);
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

  // Report computations
  const paid           = expenses.filter((e) => e.status === 'paid');
  const approved       = expenses.filter((e) => e.status === 'approved');
  const highValue      = approved.filter((e) => e.amount >= HIGH_VALUE_THRESHOLD);
  const totalPaid      = paid.reduce((s, e) => s + e.amount, 0);
  const pendingPayout  = approved.reduce((s, e) => s + e.amount, 0);

  // Category breakdown by expense type
  const categoryMap = {};
  expenses.forEach((e) => {
    const key = e.type ?? 'Other';
    categoryMap[key] = (categoryMap[key] ?? 0) + e.amount;
  });
  const categoryBreakdown = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const maxCatAmount = categoryBreakdown[0]?.[1] ?? 1;

  const filtered = filter === 'all' ? expenses : expenses.filter((e) => e.status === filter);

  return (
    <div className="dashboard">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-highlight">
          <div className="stat-label">Pending Payout</div>
          <div className="stat-value accent">{formatINR(pendingPayout)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">High-Value Pending</div>
          <div className="stat-value">{highValue.length}</div>
          <div className="stat-sublabel">≥ {formatINR(HIGH_VALUE_THRESHOLD)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Paid Out</div>
          <div className="stat-value">{formatINR(totalPaid)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">All Claims</div>
          <div className="stat-value">{expenses.length}</div>
        </div>
      </div>

      {/* Reports Toggle */}
      <div className="report-bar">
        <button
          className={activeReport === 'overview' ? 'btn-accent' : 'btn-ghost'}
          onClick={() => setActiveReport(activeReport === 'overview' ? null : 'overview')}
        >
          📊 Overview Report
        </button>
        <button
          className={activeReport === 'category' ? 'btn-accent' : 'btn-ghost'}
          onClick={() => setActiveReport(activeReport === 'category' ? null : 'category')}
        >
          🗂 Category Breakdown
        </button>
      </div>

      {/* Overview Report */}
      {activeReport === 'overview' && (
        <div className="card report-card">
          <h3>Financial Overview</h3>
          <div className="report-grid">
            {['draft', 'submitted', 'approved', 'rejected', 'paid'].map((status) => {
              const items = expenses.filter((e) => e.status === status);
              const labels = { draft: 'Draft', submitted: 'Submitted', approved: 'Approved', rejected: 'Rejected', paid: 'Paid' };
              return (
                <div key={status} className="report-row">
                  <span className="report-label">{labels[status]}</span>
                  <span className="report-count">{items.length} claims</span>
                  <span className="report-amount">
                    {formatINR(items.reduce((s, e) => s + e.amount, 0))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {activeReport === 'category' && (
        <div className="card report-card">
          <h3>By Category</h3>
          <div className="report-grid">
            {categoryBreakdown.map(([cat, amt]) => (
              <div key={cat} className="report-row">
                <span className="report-label">{cat}</span>
                <div className="report-bar-wrap">
                  <div
                    className="report-bar-fill"
                    style={{ width: `${Math.round((amt / maxCatAmount) * 100)}%` }}
                  />
                </div>
                <span className="report-amount">{formatINR(amt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="section-header">
        <h2>All Expenses</h2>
        <div className="filter-tabs">
          {['all', 'approved', 'paid', 'rejected', 'submitted'].map((s) => (
            <button
              key={s}
              className={filter === s ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s === 'approved' && approved.length > 0 && (
                <span className="tab-badge">{approved.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading financial data…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">💰</span>
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
                    <>
                      {/* High-value (≥ 10k) approved expenses need final finance approval */}
                      {expense.status === 'approved' && expense.amount >= HIGH_VALUE_THRESHOLD && (
                        <button
                          className="btn-success btn-xs"
                          onClick={() => handleFinalApprove(expense.id)}
                        >
                          Final Approve
                        </button>
                      )}
                      {expense.status === 'approved' && (
                        <button
                          className="btn-accent btn-xs"
                          onClick={() => handleMarkPaid(expense.id)}
                        >
                          Mark Paid
                        </button>
                      )}
                      {expense.status === 'approved' && (
                        <button
                          className="btn-danger btn-xs"
                          onClick={() => setRejectTarget(expense.id)}
                        >
                          Reject
                        </button>
                      )}
                    </>
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
