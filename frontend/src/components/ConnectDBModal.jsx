import React, { useState } from 'react';
import { connectDatabase } from '../api';

const ConnectDBModal = ({ onClose, onDbConnected }) => {
    const [dbName, setDbName] = useState('');
    const [dbUrl, setDbUrl] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await connectDatabase(dbName, dbUrl);
            onDbConnected({ name: dbName, id: data.db_id });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                <h3 style={{ marginTop: 0 }}>Connect New Database</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Database Name:</label>
                        <input type="text" value={dbName} onChange={(e) => setDbName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Database URL:</label>
                        <input type="text" value={dbUrl} onChange={(e) => setDbUrl(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Connecting...' : 'Connect'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConnectDBModal;