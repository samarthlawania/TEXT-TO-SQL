import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import DBListScreen from './components/DBListScreen';
import QueryInterface from './components/QueryInterface';
import HistoryList from './components/HistoryList';
import { getQueryHistory } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('dbList'); // 'dbList', 'query', 'history', 'userManagement'

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
    setCurrentView('dbList');
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dbList':
        return <DBListScreen onSelectDb={() => setCurrentView('query')} />;
      case 'query':
        return <QueryInterface onQuerySuccess={fetchHistory} />;
      case 'history':
        return <HistoryList history={history} />;
      // case 'userManagement':
      //   return <UserManagement />;
      default:
        return <DBListScreen onSelectDb={() => setCurrentView('query')} />;
    }
  };

  return (
    <div className="App" style={{ fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>SQL Explorer</h1>
        <nav>
          <button onClick={() => setCurrentView('dbList')}>Databases</button>
          <button onClick={() => setCurrentView('history')}>History</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <hr />
      {renderView()}
    </div>
  );
}

export default App;