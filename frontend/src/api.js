const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed.');
  }
  return data;
};

export const submitQuery = async (question) => {
  const res = await fetch(`${API_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ question }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Query failed.');
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