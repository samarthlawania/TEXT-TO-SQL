import React, { useState } from 'react';
import { connectDatabase } from '../api';
import { useSelector } from 'react-redux';
import '../../ConnectDBModal.css'; // Import a separate CSS file for the modal

const ConnectDBModal = ({ onClose, onDbConnected }) => {
    const [dbName, setDbName] = useState('');
    const [dbUrl, setDbUrl] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            console.log('User', user);
            const data = await connectDatabase(dbName, dbUrl, user);
            onDbConnected({ name: dbName, id: data.db_id });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3 className="modal-title">Connect New Database</h3>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Database Name:</label>
                        <input
                            type="text"
                            value={dbName}
                            onChange={(e) => setDbName(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Database URL:</label>
                        <input
                            type="text"
                            value={dbUrl}
                            onChange={(e) => setDbUrl(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className={`btn btn-primary ${loading ? 'loading' : ''}`}>
                            {loading ? <div className="spinner"></div> : 'Connect'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConnectDBModal;