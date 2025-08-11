import React, { useState } from 'react';
import ResultTable from './ResultTable';
import { runSandboxQuery, syncQuery } from '../api';

const QueryInterface = ({ onQuerySuccess }) => {
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [sandboxResults, setSandboxResults] = useState(null);
    const [generatedSql, setGeneratedSql] = useState('');
    const [error, setError] = useState(null);
    const [syncLoading, setSyncLoading] = useState(false);
    
    // In a real app, dbId would be passed as a prop from DBListScreen
    const dbId = 'some-selected-db-id';

    const handleInputChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleSandboxSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            setError('Please enter a question.');
            return;
        }
        setLoading(true);
        setError(null);
        setSandboxResults(null);
        try {
            const data = await runSandboxQuery(question, dbId);
            setSandboxResults(data.results);
            setGeneratedSql(data.sql);
            onQuerySuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncLoading(true);
        setError(null);
        try {
            await syncQuery(generatedSql, dbId);
            alert('Changes synced to live database successfully!');
            onQuerySuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setSyncLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <form onSubmit={handleSandboxSubmit}>
                <h3 style={{ marginBottom: '10px' }}>Ask a question about your data:</h3>
                <input
                    type="text"
                    value={question}
                    onChange={handleInputChange}
                    placeholder="e.g., Show me the top 5 customers by total sales."
                    style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
                />
                <button
                    type="submit"
                    disabled={loading || syncLoading}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: loading || syncLoading ? 'not-allowed' : 'pointer',
                        backgroundColor: loading || syncLoading ? '#ccc' : '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                    }}
                >
                    {loading ? 'Processing...' : 'Run in Sandbox'}
                </button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}

            {sandboxResults && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Sandbox Results</h4>
                    <p>Generated SQL: <code>{generatedSql}</code></p>
                    <ResultTable data={sandboxResults.data} columns={sandboxResults.columns} />
                    <button
                        onClick={handleSync}
                        disabled={syncLoading}
                        style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        {syncLoading ? 'Syncing...' : 'Sync to Live DB'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QueryInterface;