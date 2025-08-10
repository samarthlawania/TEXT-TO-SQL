import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import QueryInterface from './components/QueryInterface';
import HistoryList from './components/HistoryList'; // The missing import
import { getQueryHistory } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
      fetchHistory();
    }
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getQueryHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setHistory([]);
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App" style={{ fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>SQL Explorer</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <hr />
      <QueryInterface onQuerySuccess={fetchHistory} />
      <hr />
      <h2>Query History</h2>
      {loading && <p>Loading history...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <HistoryList history={history} />
    </div>
  );
}

export default App;