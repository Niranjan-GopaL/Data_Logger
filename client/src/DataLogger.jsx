import React, { useState, useRef } from 'react';
import './DataLogger.css';
import { saveDataToFile, getFilteredRows, handleSort } from './ProcessData';

const DataLogger = () => {
  const [rows, setRows] = useState([{ parameter: '', value: '' }]);
  const [filterText, setFilterText] = useState('');
  const rowRefs = useRef([]);

  const handleKeyDown = (e, index, field) => {
    console.log(`Key down: ${e.key}, Index: ${index}, Field: ${field}`);
    if (e.altKey && e.key === 'n') {
      setRows([...rows, { parameter: '', value: '' }]);
      console.log('New row added');
    } else if (e.ctrlKey && e.altKey) {
      const navigateKeys = { h: -1, l: 1, j: 1, k: -1 };
      if (navigateKeys[e.key] !== undefined) {
        const rowChange = e.key === 'j' || e.key === 'k';
        const newIndex = rowChange
          ? (index + navigateKeys[e.key] + rows.length) % rows.length
          : index;
        const newField = rowChange ? field : field === 'parameter' ? 'value' : 'parameter';
        rowRefs.current[newIndex][newField].focus();
        console.log(`Focus moved to: Index: ${newIndex}, Field: ${newField}`);
      } else if (e.key === 's') {
        e.preventDefault();
        saveDataToFile(rows);
        console.log('Data saved to file');
      }
    }
  };

  const handleChange = (e, index, field) => {
    const newRows = [...rows];
    newRows[index][field] = e.target.value;
    setRows(newRows);
    console.log(`Changed: Index: ${index}, Field: ${field}, Value: ${e.target.value}`);
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    console.log(`Filter changed: ${e.target.value}`);
  };

  const handleSortRows = (field) => {
    const sortedRows = handleSort(rows, field);
    setRows(sortedRows);
    console.log(`Rows sorted by: ${field}`);
  };

  return (
    <div className="data-logger">
      <div className="controls">
        <input
          type="text"
          placeholder="Filter..."
          value={filterText}
          onChange={handleFilterChange}
        />
        <button onClick={() => handleSortRows('parameter')}>Sort by Parameter</button>
        <button onClick={() => handleSortRows('value')}>Sort by Value</button>
      </div>
      {getFilteredRows(rows, filterText).map((row, index) => (
        <div key={index} className="row">
          <input
            type="text"
            value={row.parameter}
            onChange={(e) => handleChange(e, index, 'parameter')}
            onKeyDown={(e) => handleKeyDown(e, index, 'parameter')}
            ref={(el) => (rowRefs.current[index] = { ...rowRefs.current[index], parameter: el })}
          />
          <input
            type="text"
            value={row.value}
            onChange={(e) => handleChange(e, index, 'value')}
            onKeyDown={(e) => handleKeyDown(e, index, 'value')}
            ref={(el) => (rowRefs.current[index] = { ...rowRefs.current[index], value: el })}
          />
        </div>
      ))}
    </div>
  );
};

export default DataLogger;