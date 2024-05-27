const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Middleware to handle JSON request bodies
app.use(bodyParser.json());



// Function to format date
const formatDate = (date) => {
        
    const pad = (n) => (n < 10 ? `0${n}` : n);

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}_${month}_${year}_T_${hours}_${minutes}.txt`;
};



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
  const fileName = formatDate(date);
  
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

// Route to save default parameters
app.post('/save-default-parameters', (req, res) => {
  const { rows } = req.body;
  console.log('Received default parameters to save:', rows);
  const filePath = path.join(__dirname, 'Data', 'Default.txt');

  let fileContent = '';
  rows.forEach((row) => {
    fileContent += `${row.parameter}\n`;
  });

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.status(500).send('Server error');
    } else {
      console.log(`Default parameters saved successfully`);
      res.status(200).send('Default parameters saved successfully');
    }
  });
});

// Route to load default parameters
app.get('/load-default-parameters', (req, res) => {
  const filePath = path.join(__dirname, 'Data', 'Default.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading default parameters file:', err);
      res.status(500).send('Server error');
    } else {
      const parameters = data.split('\n').filter(Boolean).map(param => ({ parameter: param, value: '' }));
      console.log(`Default parameters loaded successfully: ${parameters}`);
      res.status(200).json(parameters);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
