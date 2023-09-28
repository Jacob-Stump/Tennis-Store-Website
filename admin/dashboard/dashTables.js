//this js file, at this point, allows for three buttons to retrieve data for:
//the customer, orders, and products stored in the database and lists them in a table.
//the code is structured in functional order from top to bottom with the exception of the clearTable
//function. Important to understand the table population code. Not sure if this
//flexible approach of populating the buttons is good or bad yet but it's cool as hell.


document.addEventListener('DOMContentLoaded', () => { //for dynamically assigning a button an eventListener and endpoint on page load
    setupButton('orders-btn', 'http://localhost:8080/allOrders'); //orders endpoint
    setupButton('products-btn', 'http://localhost:8080/getProducts');//products endpoint 
    setupButton('customers-btn', 'http://localhost:8080/allCustomers');//customers endpoint
    newProductButton();
});

function setupButton(buttonId, endpoint) { //for all buttons that require endpoint for functionality 
    let button = document.getElementById(buttonId); //grabbing button via parameter buttonId
    button.addEventListener('click', () => { //what will this button do on click?
        getData(endpoint); //it will need to fetch content from the server endpoint in order to later populate the respective table
    });
}

function getData (endpoint) { //sending GET request to various endpoints on server. endpoint == http://localhost:8080/getProducts etc.
    fetch(endpoint) //fetching from endpoint
        .then((response) => response.json()) //getting json strings
        .then((jsonData) => { // making array of objects
            populateTable(jsonData); //using order array to populate table
            
        })
        .catch((error) => console.error('Error fetching products:', error));
}

function populateTable(data) { //dynamic table creation for any all types of query
    //console.log("here");
    clearTable(); //clears table to make room for current clicked table
    let columnHeaders = Object.keys(data[0]); //grabs the keys values of the json object to be used for column headers
    let table = document.getElementById('data-table');

    // Create the table header
    let thead = table.createTHead(); //creating table header via thead var
    let headerRow = thead.insertRow(); //making variable for the row
    columnHeaders.forEach((header) => { // for every object in the json array..
        let th = document.createElement('th'); //create a new table header
        th.textContent = header; //assigning the column name to the current header (current key)
        headerRow.appendChild(th); //appending the new header to the header row
    });

    // Create the table body
    let tbody = table.createTBody(); //creating new table body
    data.forEach((row) => { //for every row (for every object in json array)
        let tr = tbody.insertRow(); //make new html table row onto the tbody
        columnHeaders.forEach((column) => { //for every column header..
            let td = tr.insertCell(); //insert a new cell
            td.textContent = row[column];//insert value 
        });
    });
}


//creating seperate function for clearing the table
function clearTable() {
    let dataTable = document.getElementById('data-table'); //grabbing table
    let tbody = dataTable.querySelector('tbody'); //selecting body
    let theader = dataTable.querySelector('thead') //selecting head
    if (tbody) { //if a body exists (if there is a table displayed)
       dataTable.removeChild(tbody); // Remove the existing tbody element and contents
       dataTable.removeChild(theader); //remove the existing theader element and contents
    }
}

function newProductButton() {
    let newProductButton = document.getElementById('new-product-redirect');
    newProductButton.addEventListener('click', () => {
        console.log("here");
        window.location.href = 'http://localhost:5500/admin/dashboard/addProduct.html';
    });
}



