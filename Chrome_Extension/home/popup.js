 
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve data from sync storage
    chrome.storage.sync.get(['user'], function(result) {
      const userData = result.user;
      // Retrieve user data from session storage
      // Check if user data exists
      if (userData) {
        // Do something with the user data
        window.location.href = 'dashboard.html';
        // Do something with the user data
      }  
    });


    var button = document.getElementById('clickMeButton');
    
    button.addEventListener('click', function() {
      // Example: Change the text of the button when clicked
      console.log("button cliecked");
      button.textContent = 'Button Clicked!';
      
      // You can add more functionality here, such as sending messages to content scripts or background scripts,
      // modifying the DOM of the current tab, etc.
    });
  });
  