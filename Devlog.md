## Things to Implement
- Write and read from file ; Client and Server Interaction [DONE_SUCCESSFULLY]
- Have an option to define DEFAULY parameter names [DONE_SUCCESSFULLY]

#### Additional
- Date parameter and have an eay way to input date
- Value validation for DEFUALT parameters

### Problem to solve :-

#### Simple error ; Took a while though

```sh
Received data to save: [
  { parameter: 'Age', value: '20' },
  { parameter: 'ID', value: '543' },
  { parameter: 'Name', value: 'ni' },
  { parameter: 'Weight', value: '61' }
]
Error writing file: [Error: ENOENT: no such file or directory, open 'D:\Code Practise\Data_Logger\server\data\2024-05-16T19-04-09-788Z.txt'] {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\Code Practise\\Data_Logger\\server\\data\\2024-05-16T19-04-09-788Z.txt'
}
```



# CURRENT PROMPT



Current Prompt 

import React, { useState, useRef } from 'react';
import './DataLogger.css';
import { saveDataToFile, getFilteredRows, handleSort } from './ProcessData';

const DataLogger = () => {
  const [rows, setRows] = useState([{ parameter: '', value: '' }]);
  const [filterText, setFilterText] = useState('');
  const rowRefs = useRef([]);

  const handleKeyDown = (e, index, field) => {

    console.log(`Key down: ${e.key}, Index: ${index}, Field: ${field}`);


    if (e.altKey  && e.key === 'n') {
      setRows([...rows, { parameter: '', value: '' }]);
      console.log('New row added');

    } 
    
    else if (e.altKey && e.ctrlKey && e.key === 's') {

        e.preventDefault();

        saveDataToFile(rows);
        console.log('Data saved to file');
      }
    
    
    else if (e.altKey) {

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





export const saveDataToFile = async (rows) => {
  console.log("Saving data to file", rows);
  try {
    const response = await fetch('http://localhost:3001/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rows }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

export const getFilteredRows = (rows, filterText) => {
  console.log('Filtering rows with text:', filterText);
  return rows.filter(
    row =>
      row.parameter.toLowerCase().includes(filterText.toLowerCase()) ||
      row.value.toLowerCase().includes(filterText.toLowerCase())
  );
};

export const handleSort = (rows, field) => {
  console.log(`Sorting rows by field: ${field}`);
  return [...rows].sort((a, b) => {
    if (a[field] < b[field]) return -1;
    if (a[field] > b[field]) return 1;
    return 0;
  });
};


server.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Middleware to handle JSON request bodies
app.use(bodyParser.json());

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Route to save data
app.post('/save-data', (req, res) => {
  const { rows } = req.body;
  console.log('Received data to save:', rows);
  const date = new Date();
  const fileName = `${date.toISOString().replace(/[:.]/g, '-')}.txt`;
  
  const dirPath = path.join(__dirname, 'Data');
  const filePath = path.join(dirPath, fileName);

  // Ensure the data directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  let fileContent = '';
  rows.forEach((row) => {
    fileContent += `${row.parameter} : ${row.value}\n`;
  });

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.status(500).send('Server error');
    } else {
      console.log(`File saved successfully: ${fileName}`);
      res.status(200).send('File saved successfully');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});









Now I want to do few things :-

- I want to provide user the ability to define DEFAULT parameter names 
    1.  have button called save as default parameters which will save the written parameters by the user (  SEND THESE to the server, and server will write the default parameters to a file in the Data/Default.txt ) 
   2. there is another button called load a list of default parameter ( which can be envoked by pressing alt + w ) What happens here is the server will send the list of parameters from the text file Data/Default.txt to the client and client will load the parameters automatically 
     
- if you press alt + c all the VALUES will be cleared ; and everytime we save after saving automatically all the values needs to be cleared 





## Initial thoughts
- building electron app
- following some quickstart guides
- Basic electron applicaiton


