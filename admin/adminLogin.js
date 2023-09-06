document.addEventListener('DOMContentLoaded', () => { //on page load..
    const loginForm = document.getElementById('admin-login-form'); //create variable that is the login form
    
    loginForm.addEventListener('submit', function (event) { //on sign in button pressed.. note that the first parameter is the type
        event.preventDefault();
        
        let username = document.getElementById('inputUsername').value; //create variable for the users input for username
        let password = document.getElementById('inputPassword').value; //create variable for the users input for password

        fetch("http://localhost:8080/adminLogin", { //POST created for endpoint @localhost:8080/adminLogin to send login credentials 
            method: 'POST', //type POST, all POST fetches require this body format as opposed to GET, which does not
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}), //body of POST http request contains the username and password variables, must also convert JS values into JSON
        })
        .then(response => response.json()) //".then" is the first promise for retrieving request. "response.json()" is called within the first promise and parses the response body into JSON
        .then(data => { //second promise that takes in the previously parsed JSON data, where the parsed data can be manipulated or used for allowing or disallowing a successful login redirect
            console.log(data);

            if (data.success) {
                window.location.href = 'http://localhost:5500/admin/interface.html';
            }
            else {
                console.error("login failed", data.error);
            }
        })
        .catch(error => {
            console.error("Error logging in", error); //fetch must have catch
        });
    });
});


