document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('loginForm');
  var loginButton = document.getElementById('loginButton');
  var createAccountLink = document.getElementById('createAccountLink');
  var back = document.getElementById('back');

  loginButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Perform login logic here
    // For demonstration purposes, we'll just log the username and password to the console
    console.log("Username:", username);
    console.log("Password:", password);

    // Example usage
    login(username, password);

  });

  createAccountLink.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent link navigation
    window.location.href = "../signup/signup.html";
    // Redirect to create account page
    // For demonstration purposes, we'll just log a message to the console
    console.log("Redirecting to create account page...");
  });

  back.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent link navigation
    window.history.back();
  });

  // Function to handle login
  function login(username, password) {
    // Make an HTTP request to your backend server to authenticate the user
    fetch('http://127.0.0.1:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        password: password
      })
    })
      .then(response => {
        if (response.ok) {
          // If login is successful, save user session
          return response.json();
        } else {
          // If login fails, display an alert with the error message
          return response.json().then(data => {
            alert(data.error);
          });
        }
      })
      .then(data => {
        console.log(data)
        // // Save user session data to local storage or session storage
        // Save data to sync storage
        chrome.storage.sync.set({ 'user': data });

        // Do something with the user data
        console.log('User is logged in:', data);
        // // Redirect or perform other actions as needed
        // // For example:
        window.location.href = '../home/dashboard.html';
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      });

  }
});