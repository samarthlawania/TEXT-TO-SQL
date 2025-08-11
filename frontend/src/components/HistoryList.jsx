import React from 'react';

const HistoryList = ({ history }) => {
  if (!history || history.length === 0) {
    return <p>No query history found.</p>;
  }

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {history.map((item) => (
        <div key={item.query_id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
          <p><strong>Question:</strong> {item.natural_language_query}</p>
          <p><strong>SQL Query:</strong> <code>{item.sql_query}</code></p>
          <p><strong>Executed At:</strong> {new Date(item.executed_at).toLocaleString()}</p>
          <p><strong>Status:</strong> <span style={{ color: item.status === 'success' ? 'green' : item.status === 'error' ? 'red' : 'orange' }}>{item.status}</span></p>
          <p><strong>Destructive:</strong> {item.is_destructive ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;