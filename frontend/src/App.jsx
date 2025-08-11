import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import DBListScreen from './components/DBListScreen';
import QueryInterface from './components/QueryInterface';
import HistoryList from './components/HistoryList';
import { getQueryHistory } from './api';
import Register from './components/Register';
// Assuming UserManagement exists
// import UserManagement from './components/UserManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('dbList');
  const [showRegister, setShowRegister] = useState(false);

  // Use a single useEffect for initial authentication check and data fetching
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchHistory();
    }
  }, []); // Empty dependency array means this runs only on mount

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
  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };
  const handleSwitchToRegister = () => {
    setShowRegister(true);
  };
  const handleSwitchToLogin = () => {
    setShowRegister(false);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setHistory([]);
    setCurrentView('dbList');
  };

  if (!isAuthenticated) {
    return (
      <div className="App flex items-center justify-center min-h-screen bg-gray-100">
        {showRegister ? (
          <Register onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={handleSwitchToLogin} />
        ) : (
          <LoginForm onLoginSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />
        )}
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dbList':
        return <DBListScreen onSelectDb={() => setCurrentView('query')} />;
      case 'query':
        return <QueryInterface onQuerySuccess={fetchHistory} />;
      case 'history':
        return <HistoryList history={history} />;
      case 'userManagement':
      // The UserManagement component is commented out, but this is where it would be rendered
      // return <UserManagement dbId="some-db-id" />;
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
          {/* <button onClick={() => setCurrentView('userManagement')}>Admin</button> */}
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <hr />
      {renderView()}
    </div>
  );
}

export default App;