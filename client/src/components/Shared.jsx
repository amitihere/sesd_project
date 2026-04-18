import { useState, useEffect } from 'react';
import { expenseApi } from '../api/index.js';

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_MAP = {
  draft:     { label: 'Draft',     cls: 'badge-draft' },
  submitted: { label: 'Submitted', cls: 'badge-submitted' },
  approved:  { label: 'Approved',  cls: 'badge-approved' },
  rejected:  { label: 'Rejected',  cls: 'badge-rejected' },
  paid:      { label: 'Paid',      cls: 'badge-paid' },
};

export function StatusBadge({ status }) {
  const { label, cls } = STATUS_MAP[status] ?? { label: status, cls: '' };
  return <span className={`badge ${cls}`}>{label}</span>;
}

const STEPS = ['draft', 'submitted', 'approved', 'paid'];

export function LifecycleStepper({ status }) {
  if (status === 'rejected') {
    return (
      <div className="lifecycle-rejected">
        <span className="lifecycle-icon">✕</span>
        <span>Rejected</span>
      </div>
    );
  }

  const activeIdx = STEPS.indexOf(status);

  return (
    <div className="lifecycle">
      {STEPS.map((step, i) => {
        const done    = i < activeIdx;
        const current = i === activeIdx;
        const cls = done ? 'step-done' : current ? 'step-current' : 'step-todo';
        return (
          <div key={step} className="step-wrap">
            <div className={`step ${cls}`}>
              <div className="step-dot">{done ? '✓' : i + 1}</div>
              <div className="step-label">{STATUS_MAP[step]?.label ?? step}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-line ${done ? 'step-line-done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function LogsModal({ expenseId, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    expenseApi
      .getLogs(expenseId)
      .then(setLogs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [expenseId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Activity Log</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {loading ? (
            <p className="muted">Loading…</p>
          ) : logs.length === 0 ? (
            <p className="muted">No activity yet.</p>
          ) : (
            <ul className="log-list">
              {logs.map((log, i) => (
                <li key={log.id ?? i} className="log-item">
                  <span className="log-action">{log.action}</span>
                  {log.note && <span className="log-note">"{log.note}"</span>}
                  <span className="log-meta">
                    by {log.actorName ?? log.actorId ?? 'system'} ·{' '}
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString('en-IN')
                      : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export function RejectModal({ onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Reject Expense</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label>Reason for rejection</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a clear reason…"
            />
          </div>
          <div className="modal-actions">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className="btn-danger"
              disabled={!reason.trim()}
              onClick={() => onConfirm(reason)}
            >
              Confirm Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExpenseRow({ expense, actions, showUser = false, showLifecycle = false }) {
  const [showLogs, setShowLogs] = useState(false);
  const [showLifecycleModal, setShowLifecycleModal] = useState(false);

  return (
    <>
      <tr className="expense-row">
        <td>
          <div className="exp-title">{expense.type ?? expense.title ?? '—'}</div>
          {expense.description && (
            <div className="exp-category">{expense.description}</div>
          )}
        </td>
        <td className="exp-amount">{formatINR(expense.amount)}</td>
        <td><StatusBadge status={expense.status} /></td>
        <td className="exp-date">
          {expense.createdAt
            ? new Date(expense.createdAt).toLocaleDateString('en-IN')
            : '—'}
        </td>
        {showUser && (
          <td className="exp-user">{expense.userName ?? expense.userId ?? '—'}</td>
        )}
        <td>
          <div className="row-actions">
            {showLifecycle && (
              <button
                className="btn-ghost btn-xs"
                onClick={() => setShowLifecycleModal(true)}
              >
                Track
              </button>
            )}
            <button
              className="btn-ghost btn-xs"
              onClick={() => setShowLogs(true)}
            >
              Logs
            </button>
            {actions}
          </div>
        </td>
      </tr>

      {showLifecycleModal && (
        <tr>
          <td colSpan={showUser ? 6 : 5} style={{ padding: '0 16px 16px' }}>
            <LifecycleStepper status={expense.status} />
          </td>
        </tr>
      )}

      {showLogs && (
        <LogsModal
          expenseId={expense.id}
          onClose={() => setShowLogs(false)}
        />
      )}
    </>
  );
}
