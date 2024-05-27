/*
- Add buttons for saving and loading default parameters.
- Add the functionality to handle clearing values with Alt + C.
- Handle the functionality for loading default parameters with Alt + W
*/

import React, { useState, useRef, useEffect } from 'react';
import './DataLogger.css';
import { saveDataToFile, getFilteredRows, handleSort, saveDefaultParameters, loadDefaultParameters } from './ProcessData_2';


const DataLogger_2 = () => {
  const [rows, setRows] = useState([{ parameter: '', value: '' }]);
  const [filterText, setFilterText] = useState('');
  const rowRefs = useRef([]);

  const handleKeyDown = (e, index, field) => {
    console.log(`Key down: ${e.key}, Index: ${index}, Field: ${field}`);

    if (e.altKey && e.key === 'n') {
      setRows([...rows, { parameter: '', value: '' }]);
      console.log('New row added');
    } else if (e.altKey && e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveDataToFile(rows).then(() => {
        setRows(rows.map(row => ({ ...row, value: '' })));
      });
      console.log('Data saved to file');
    } else if (e.altKey && e.key === 'c') {
      setRows(rows.map(row => ({ ...row, value: '' })));
      console.log('Values cleared');
    } else if (e.altKey && e.key === 'w') {
      e.preventDefault();
      loadDefaultParameters().then(defaultRows => {
        setRows(defaultRows);
      });
      console.log('Default parameters loaded');
    } else if (e.altKey) {
      const navigateKeys = { h: -1, l: 1, j: 1, k: -1 };

      if (navigateKeys[e.key] !== undefined) {
        const rowChange = e.key === 'j' || e.key === 'k';

        const newIndex = rowChange
          ? (index + navigateKeys[e.key] + rows.length) % rows.length
          : index;

        const newField = rowChange ? field : field === 'parameter' ? 'value' : 'parameter';

        rowRefs.current[newIndex][newField].focus();
        console.log(`Focus moved to: Index: ${newIndex}, Field: ${newField}`);
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

  const handleSaveDefaultParameters = () => {
    saveDefaultParameters(rows);
    console.log('Default parameters saved');
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
        <button onClick={handleSaveDefaultParameters}>Save as Default Parameters</button>
        <button onClick={() => loadDefaultParameters().then(defaultRows => setRows(defaultRows))}>
          Load Default Parameters
        </button>
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

export default DataLogger_2;
