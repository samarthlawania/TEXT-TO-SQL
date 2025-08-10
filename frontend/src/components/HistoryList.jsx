import React from 'react';

const HistoryList = ({ history }) => {
  if (!history || history.length === 0) {
    return <p>No query history found.</p>;
  }

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {history.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
          <p><strong>Question:</strong> {item.naturalLanguageQuery}</p>
          <p><strong>SQL Query:</strong> <code>{item.sqlQuery}</code></p>
          <p><strong>Executed At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
          {/* Optional: Add a button to re-run the query or display results */}
        </div>
      ))}
    </div>
  );
};

export default HistoryList;