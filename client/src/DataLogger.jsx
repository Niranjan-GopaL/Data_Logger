/*
- Add buttons for saving and loading default parameters.
- Add the functionality to handle clearing values with Alt + C.
- Handle the functionality for loading default parameters with Alt + W
*/

import React, { useState, useRef } from 'react';
import './DataLogger.css';
import { saveDataToFile, getFilteredRows, handleSort } from './ProcessData';


const DataLogger = () => {

    const [rows, setRows] = useState([{ parameter: '', value: '' }]);
    const [filterText, setFilterText] = useState('');
    const rowRefs = useRef([]);


    const handleKeyDown = (e, index, field) => {

    // All KeyDown events will be displayed in the Console 
    console.log(`Key down: ${e.key}, Index: ${index}, Field: ${field}`);

    // New Parameter : Value
    if (e.altKey  && e.key === 'n') {
        // adds the new {parameter: '' , value: ''} to the `rows` json object
        setRows([...rows, { parameter: '', value: '' }]);
        console.log('New row added');

    } 
    

    // Save to file 
    else if (e.altKey && e.ctrlKey && e.key === 's') {

        e.preventDefault();

        saveDataToFile(rows);
        console.log('Data saved to file');
      }
    
    
    //   NAVIGATION KEYBINDINGS !!
    else if (e.altKey) {
        const navigateKeys = { h: -1, l: 1, j: 1, k: -1 };

        // Alt + anything will come inside this if statement
        if (navigateKeys[e.key] !== undefined) {
            const rowChange = e.key === 'j' || e.key === 'k';

            // THE MAGIC HAPPENS HERE
            // THIS CHANGES ROW also applies circular rotation by modding with the len
            const newIndex = rowChange
            ? (index + navigateKeys[e.key] + rows.length) % rows.length
            : index;

            // THIS  CHANGES COLUMN 
            const newField = rowChange ? field :  ( field === 'parameter' ? 'value' : 'parameter' ) ;
            
            // REACT MAGIC ;
            // todo :- understand what happens here exactly ; ALONG WITH useState, useEffect, useRef PROPERLY
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


// todo :- Differance between export default AND export const default
export default DataLogger;
