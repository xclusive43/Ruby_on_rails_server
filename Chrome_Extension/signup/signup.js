document.addEventListener('DOMContentLoaded', function() {
    var signupForm = document.getElementById('signupForm');
    var signupButton = document.getElementById('signupButton');
    var back = document.getElementById('back');

    signupButton.addEventListener('click', function() {
      var username = document.getElementById('username').value;
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
  
      // Perform user registration logic here
      // For demonstration purposes, we'll just log the user's information to the console
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Password:", password);

      // Define the user data
    const userData = {
      user: {
        name: username,
        email: email,
        password: password
      }
    };

// Define the URL of your Rails signup endpoint
const url = "http://127.0.0.1:3000/signup"; // Update the URL with your actual endpoint

// Make a POST request to the signup endpoint
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(userData)
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Signup failed");
    }
    return response.json();
  })
  .then(data => {
    window.alert("Signup successful: " + 'redirecting to login page');
       // After successful registration, you can redirect the user to another page
       window.location.href = "../login/login.html"; // Redirect to login page
      console.log("Signup successful:", data);
  })
  .catch(error => {
    window.alert("Error signing up: " + error.message);
    console.error("Error signing up:", error);
  });

  
   
    });

    back.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent link navigation
        window.history.back();
      });
  });
  