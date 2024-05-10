// Define a function to fetch tab data and update state
let activeTabId = null;
function fetchData() {
  chrome.tabs.query({}, function (tabs) {
    // Object to store tab URLs
    var tabUrls = {};
    tabs.forEach(function (tab) {
      tabUrls[tab.id] = new URL(tab.url).hostname;
    });

    chrome.runtime.sendMessage({ cmd: 'getActiveTabID' }, response => {
      if (response != null) {
        activeTabId = response;

      }
      console.log('Active Tab ID:', activeTabId);
    });

    // Send message to background script to get tab times
    chrome.runtime.sendMessage({ cmd: 'getTabTimes' }, function (response) {
      console.log('Atab:', response);
      // Object to store tab URLs and their times
      var urlTimes = {};
      var renderTimes = {};
      var tabIDs = [];
      Object.keys(response).forEach(function (tabId) {
        tabIDs.push(tabId);
        var url = tabUrls[tabId];
        if (url) {
          if (!urlTimes[url]) {
            urlTimes[url] = 0;
            renderTimes[url] = 0;
          }
          urlTimes[url] += response[tabId] + ' ' + tabId;
          renderTimes[url] += response[tabId] + ' ' + tabId;
          // Assign tab ID to renderTimes object
          // renderTimes['_tabId'] = tabId;
          // urlTimes['tabId'] = tabId;
          // urlTimes['url'] = url;

          var duration = calculateDuration(urlTimes[url] * 1000); // Convert seconds to milliseconds
          var formatedDuration = url + ': ' + formatDuration(duration);
          urlTimes['formatedDuration'] = formatedDuration;

        }
      });

      // Render tab data
      renderTabData(renderTimes);


      // Send tab data to the server
      sendTabDataToServer(urlTimes);
    });
  });
}

// Define a function to render tab data
function renderTabData(tabData) {

  var timeList = document.getElementById("timeList");
  timeList.innerHTML = ''; // Clear previous data

  Object.entries(tabData).forEach(([url, id]) => {
    var listItem = document.createElement("li");
    var value = id.split(' ');


    var duration = calculateDuration(value[0] * 1000); // Convert seconds to milliseconds
    if (value[1] == activeTabId) {
      listItem.style.backgroundColor = '#00ffa6'; // green background
      listItem.style.color = '#666666';

    } else {
      listItem.style.backgroundColor = '#ededed'; // Light red background
      listItem.style.color = '#666666';
    }

    listItem.textContent = url + ': ' + formatDuration(duration);

    // Create the "Block" button
    var blockButton = document.createElement("button");
    var unBlockButton = document.createElement("button");

    blockButton.textContent = "Block";
    unBlockButton.textContent = "Un-Block";

    blockButton.classList.add("blockButton");
    unBlockButton.classList.add("blockButton");

    // Apply CSS styles directly
    blockButton.style.fontSize = "10px"; // Set font size to 10px
    blockButton.style.border = "none";
    blockButton.style.marginLeft = "20px";
    blockButton.style.backgroundColor = "#d40d0d"; //#0dd42b
    blockButton.style.color = "white";
    blockButton.style.padding = "5px 10px";
    blockButton.style.borderRadius = "5px";
    blockButton.style.cursor = "pointer";

    unBlockButton.style.fontSize = "10px"; // Set font size to 10px
    unBlockButton.style.border = "none";
    unBlockButton.style.marginLeft = "20px";
    unBlockButton.style.backgroundColor = "#0dd42b";
    unBlockButton.style.color = "white";
    unBlockButton.style.padding = "5px 10px";
    unBlockButton.style.borderRadius = "5px";
    unBlockButton.style.cursor = "pointer";

    // Add click event listener to the "Block" button
    blockButton.addEventListener("click", function (event) {
      // Execute your function when the "Block" button is clicked
      console.log("Block button clicked for URL: " + url);

      // Get the URL associated with this button (replace 'url' with the actual URL)
    var urlToBlock = url ; //'https://example.com/url_to_block';
    
    // Send a message to the background script with the URL to block
    chrome.runtime.sendMessage({ action: 'blockUrl', url: urlToBlock });
    });

    // Add click event listener to the "Block" button
    unBlockButton.addEventListener("click", function (event) {
      // Execute your function when the "Block" button is clicked
      console.log("UnBlock button clicked for URL: " + url);

      // Get the URL associated with this button (replace 'url' with the actual URL)
    var urlToBlock = url ; //'https://example.com/url_to_block';
    
    // Send a message to the background script with the URL to block
    chrome.runtime.sendMessage({ action: 'unblockUrl', url: urlToBlock });
    });

    // Append the "Block" button to the list item
    listItem.appendChild(blockButton);
    listItem.appendChild(unBlockButton);
    timeList.appendChild(listItem);

  });

}

// Function to execute when the "Block" button is clicked
function blockButtonClicked() {
  // Add your code here to handle the block action
  console.log("Block button clicked!");
}

// Function to format the duration
function formatDuration(duration) {
  var formatted = '';
  if (duration.years > 0) {
    formatted += duration.years + ' years ';
  }
  if (duration.months > 0) {
    formatted += duration.months + ' months ';
  }
  if (duration.days > 0) {
    formatted += duration.days + ' days ';
  }
  if (duration.hours > 0) {
    formatted += duration.hours + ' hours ';
  }
  if (duration.minutes > 0) {
    formatted += duration.minutes + ' minutes ';
  }
  if (duration.seconds > 0) {
    formatted += duration.seconds + ' seconds ';
  }
  return formatted.trim();
}

// Define a function to calculate the duration
function calculateDuration(milliseconds) {
  // Convert milliseconds to seconds
  var seconds = milliseconds / 1000;

  // Calculate minutes
  var minutes = Math.floor(seconds / 60);
  seconds %= 60;

  // Calculate hours
  var hours = Math.floor(minutes / 60);
  minutes %= 60;

  // Calculate days
  var days = Math.floor(hours / 24);
  hours %= 24;

  // Calculate months
  var months = Math.floor(days / 30.436875); // Average days in a month
  days %= 30.436875;

  // Calculate years
  var years = Math.floor(months / 12);
  months %= 12;

  return {
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

// Define a function to send tab data to the server
function sendTabDataToServer(timeList) {
  // Retrieve data from sync storage
  chrome.storage.sync.get(['user'], function (result) {
    const userData = result.user;
    // Retrieve user data from session storage
    // Check if user data exists
    if (userData) {
      // window.location.href = 'dashboard.html';
      // Do something with the user data

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        var duration = 0;
        Object.entries(timeList).forEach(([url, id]) => {
          var value = id.split(' ');
          if (value[1] == activeTabId) {
            duration = calculateDuration(value[0] * 1000);
          }
        })
        var tabData = {
          id: activeTab.id,
          url: activeTab.url,
          time: formatDuration(duration) // Add the current time
        };
        // console.log(tabData)
        // Send tab data to the server
        fetch("http://127.0.0.1:3000/save_web_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": userData.token
          },
          body: JSON.stringify(tabData)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            console.log("Tab data sent successfully");
          })
          .catch(error => {
            console.error("Error sending tab data:", error);
          });
      });

    } else {

    }
  });
}

// Define an interval function to fetch data every 5 seconds
function startInterval() {
  fetchData();
  var intervalId = setInterval(fetchData, 5000);

  // Cleanup on unmount
  return function () {
    clearInterval(intervalId);
  };
}

// Initialize state
var tabData = {};

// Fetch data on component mount and start interval
startInterval();


document.getElementById('logoutBtn').addEventListener('click', function () {
  var logoutConfirmed = confirm("Are you sure you want to logout?");
  if (logoutConfirmed) {
    chrome.storage.sync.remove('user', function () {
      alert("Logout Successful!");
      window.location.href = '../home/popup.html';
      console.log('User data removed from sync storage');
    });
    // Perform logout action
    // Replace with your logout function
  } else {
    // User canceled logout
    alert("Logout Canceled!");
  }
});


// Function to show the dialog
function showDialog() {
  document.getElementById('dialog').style.display = 'block';
}

// Function to hide the dialog
function hideDialog() {
  document.getElementById('dialog').style.display = 'none';
}

// Event listener for account button click
document.getElementById('chartIcon').addEventListener('click', function () {
  // Retrieve data from sync storage
  chrome.storage.sync.get(['user'], function (result) {
    const data = result.user;
    // Retrieve user data from session storage
    // Check if user data exists
    if (data) {
      window.location.href = '../chart_Dashboard/chart_dashboard.html';
      // Set user name and email in the dialog
      document.getElementById('userName').textContent = data.name;
      document.getElementById('userEmail').textContent = data.email;

      // Show the dialog
      showDialog();
    }
  });
});

// Event listener for chartIcon button click
document.getElementById('accountBtn').addEventListener('click', function () {
  // Retrieve data from sync storage
  chrome.storage.sync.get(['user'], function (result) {
    const data = result.user;
    // Retrieve user data from session storage
    // Check if user data exists
    if (data) {

      // Set user name and email in the dialog
      document.getElementById('userName').textContent = data.name;
      document.getElementById('userEmail').textContent = data.email;

      // Show the dialog
      showDialog();
    }
  });
});

// Event listener for close button click
document.getElementById('closeBtn').addEventListener('click', function () {
  // Hide the dialog
  hideDialog();
});

// Event listener for close button click
document.getElementById('settingsIcon').addEventListener('click', function () {
  // Retrieve data from sync storage
  chrome.storage.sync.get(['user'], function (result) {
    const data = result.user;
    // Retrieve user data from session storage
    // Check if user data exists
    if (data) {
      window.location.href = '../settings/settings.html';
    } else {
      alert('An error occurred.Please login or Please try again later.');
    }
  });
});



