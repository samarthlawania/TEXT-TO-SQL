const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed.');
  }
  return data;
};

export const register = async (username,email, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed.');
  }
  return data;
};

export const connectDatabase = async (name, dbUrl) => {
  const res = await fetch(`${API_URL}/connect-db`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ name, dbUrl }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to connect database.');
  }
  return data;
};

export const runSandboxQuery = async (question, dbId) => {
  const res = await fetch(`${API_URL}/query/sandbox`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ question, dbId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Sandbox query failed.');
  }
  return data;
};

export const syncQuery = async (sqlQuery, dbId) => {
  const res = await fetch(`${API_URL}/query/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ sqlQuery, dbId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Sync failed.');
  }
  return data;
};

export const getQueryHistory = async () => {
  const res = await fetch(`${API_URL}/history`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch history.');
  }
  return data;
};