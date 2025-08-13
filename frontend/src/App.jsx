import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import DBListScreen from './components/DBListScreen';
import QueryInterface from './components/QueryInterface';
import HistoryList from './components/HistoryList';
import { getQueryHistory } from './api';
import Register from './components/Register';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../store';
import './App.css'; // Import the new CSS file

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [currentView, setCurrentView] = useState('dbList');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchHistory();
    }
  }, []);

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
    dispatch(clearUser());
    setIsAuthenticated(false);
    setHistory([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container app-auth">
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
      // case 'userManagement':
      // return <UserManagement dbId="some-db-id" />;
      default:
        return <DBListScreen onSelectDb={() => setCurrentView('query')} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-title">SQL Explorer</h1>
        <nav className="app-nav">
          <button
            className={`nav-btn ${currentView === 'dbList' ? 'active' : ''}`}
            onClick={() => setCurrentView('dbList')}
          >
            Databases
          </button>
          <button
            className={`nav-btn ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            History
          </button>
          <button className="nav-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <hr className="divider" />
      {renderView()}
    </div>
  );
}

export default App;