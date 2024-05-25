export const saveDataToFile = async (rows) => {
  console.log("Saving data to file :- ", rows);

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




// POST the default parameters from user TO SERVER
// SERVER will then store them in a Default.txt  
// todo : Ability of user to save multiple Default parameters 
export const saveDefaultParameters = async (rows) => {
    console.log("Saving default parameters", rows);
    try {

        const response = await fetch('http://localhost:3001/save-default-parameters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rows }),
        });
  
        if (!response.ok) { throw new Error('Network response was not ok'); }

        // HUZZAH !!
      const result = await response.text();
      console.log(result);

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};
  


// GET ing back the default parameter FROM SERVER
// that was saved in Data/Default.txt 
// todo :- support selecting which default parameter to GET
export const loadDefaultParameters = async () => {
    console.log("Loading default parameters");

    try {
        const response = await fetch('http://localhost:3001/load-default-parameters', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
        });
  
        if (!response.ok) { throw new Error('Network response was not ok'); }
  
        //  HUZZAH !! 
        const parameters = await response.json();
        console.log(parameters);
        return parameters;

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
};
  

// Simple filtering from GPT
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
