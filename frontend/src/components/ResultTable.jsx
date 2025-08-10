import React from 'react';

const ResultTable = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return <p>No results to display.</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px',color:'black' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            {columns.map((col, index) => (
              <th key={index} style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {cell !== null ? cell.toString() : 'NULL'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;