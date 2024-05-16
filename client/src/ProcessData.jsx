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
