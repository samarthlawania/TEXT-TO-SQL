import React, { useState } from 'react';
import { inviteUser, setRole } from '../api';

const UserManagement = ({ dbId }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [userIdToChange, setUserIdToChange] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await inviteUser({ email, role, dbId });
      setMessage(`Invitation sent to ${email} with role ${role}.`);
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await setRole({ userId: userIdToChange, role: newRole, dbId });
      setMessage(`Role for user ${userIdToChange} changed to ${newRole}.`);
      setUserIdToChange('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px' }}>
        <h3>Invite New User</h3>
        <form onSubmit={handleInvite}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="User email"
            required
            style={{ marginRight: '10px' }}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" style={{ marginLeft: '10px' }}>Invite</button>
        </form>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '15px' }}>
        <h3>Change User Role</h3>
        <form onSubmit={handleRoleChange}>
          <input
            type="text"
            value={userIdToChange}
            onChange={(e) => setUserIdToChange(e.target.value)}
            placeholder="User ID"
            required
            style={{ marginRight: '10px' }}
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="user">User</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" style={{ marginLeft: '10px' }}>Set Role</button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;