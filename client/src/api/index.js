const BASE = '/api';

function getUserId() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user?.id;
}

async function request(path, method = 'GET', body) {
  const headers = { 'Content-Type': 'application/json' };

  const userId = getUserId();
  if (userId) headers['X-User-Id'] = userId;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

export const userApi = {
  signup: (body) => request('/users/signup', 'POST', body),
  getAll: () => request('/users').then(res => res.users || []),
  getById: (id) => request(`/users/${id}`).then(res => res.user),
};

export const expenseApi = {
  create: (body) => request('/expenses', 'POST', {
    ...body,
    type: body.type?.toLowerCase(),        
  }).then(r => r.expense),

  getMine: () => request('/expenses/mine').then(r => r.expenses || []),

  getAll: () => request('/expenses').then(r => r.expenses || []),

  submit: (id) => request(`/expenses/${id}/submit`, 'POST'),
  approve: (id) => request(`/expenses/${id}/approve`, 'POST'),
  reject: (id) => request(`/expenses/${id}/reject`, 'POST'),
  markPaid: (id) => request(`/expenses/${id}/pay`, 'POST'),

  getLogs: (id) => request(`/expenses/${id}/logs`).then(r => r.logs || []),
};