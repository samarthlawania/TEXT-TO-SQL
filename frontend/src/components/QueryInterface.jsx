import React, { useState } from 'react';
import ResultTable from './ResultTable';
import { submitQuery } from '../api';

const QueryInterface = ({ onQuerySuccess }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await submitQuery(question);
      setResults(data);
      onQuerySuccess(); // Trigger a history refresh
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <form onSubmit={handleSubmit}>
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
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: loading ? '#ccc' : '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          {loading ? 'Processing...' : 'Submit Query'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}

      {results && (
        <div style={{ marginTop: '20px' }}>
          <h4>Query Results</h4>
          <ResultTable data={results.data} columns={results.columns} />
        </div>
      )}
    </div>
  );
};

export default QueryInterface;