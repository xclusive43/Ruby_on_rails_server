fetchData();
let data = [];
function fetchData(){
    // Retrieve data from sync storage
  chrome.storage.sync.get(['user'], function (result) {
    const userData = result.user;
    // Retrieve user data from session storage
    // Check if user data exists
    if (userData) {
      // window.location.href = 'dashboard.html';
      // Do something with the user data

        // console.log(tabData)
        // Send tab data to the server
        fetch("http://127.0.0.1:3000/get_all_web_data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": userData.token
          },
        })  .then(response => {
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
            // Do something with the user data
            this.data = data.data;
            createChart();
           
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
          });
  
    } 
});
}

// Step 1: Parse the data

function createChart(){
// Step 2: Calculate data for the chart
const tabTimes = {};
this.data.forEach(entry => {
    if(entry?.time && entry?.time !== undefined | null && entry?.time !== ''){
    const url = entry.url;
    const timeSpent = parseTime(entry?.time) ; // Helper function to parse time
    if (!tabTimes[url] || tabTimes[url] < timeSpent) {
        tabTimes[url] = timeSpent;
    }
}
});

// Step 3: Choose a chart library (Chart.js)
// Assume you've already included Chart.js in your page
// Step 4: Implement the chart
let labels = Object.keys(tabTimes);
const times = Object.values(tabTimes);
// Modify the labels
const maxLength = 20;
 labels = Object.keys(tabTimes).map(label => {
    if (label.length > maxLength) {
        return label.substring(0, maxLength - 3) + '...'; // Truncate and add ellipsis
    } else {
        return label;
    }
});
// Convert time strings to minutes
// const timesInMinutes = times.map(timeString => calculateMinutes(timeString));

const dataForChart = {
    labels: labels,
    datasets: [{
        label: 'Time Spent (minutes)',
        data: times,
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fill color
        borderColor: 'rgba(255, 99, 132, 1)', // Border color
        borderWidth: 2, // Border width
        pointBackgroundColor: 'rgba(255, 99, 132, 1)', // Point color
        pointRadius: 5, // Point radius
        pointHoverRadius: 8, // Point hover radius
        tension: 0.4 // Line tension
    }]
};

const config = {
    type: 'line',
    data: dataForChart,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)' // Grid lines color
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.7)', // Tick color
                    font: {
                        weight: 'bold' // Bold font for ticks
                    }
                },
                title: {
                    display: true,
                    text: 'Time Spent (minutes)',
                    color: 'rgba(0, 0, 0, 0.8)', // Y-axis label color
                    font: {
                        size: 14 // Font size for label
                    }
                }
            },
            x: {
                grid: {
                    display: false // Hide X-axis grid lines
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.7)', // Tick color
                    font: {
                        weight: 'bold' // Bold font for ticks
                    }
                },
                title: {
                    display: true,
                    text: 'Date',
                    color: 'rgba(0, 0, 0, 0.8)', // X-axis label color
                    font: {
                        size: 14 // Font size for label
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false // Hide legend
            },
            // Custom plugin for CSS styling
            customCSS: {
                afterUpdate: function(chart) {
                    chart.canvas.parentNode.style.backgroundColor = 'black';
                    // Custom CSS styling for chart
                    chart.canvas.parentNode.style.border = '2px solid rgba(0, 0, 0, 0.1)';
                    chart.canvas.parentNode.style.borderRadius = '10px';
                    chart.canvas.parentNode.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }
            }
        }
    }
};

// Assuming you have a canvas element in your HTML with id "myChart"
const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, config);

}

// Helper function to parse time in seconds
function parseTime(timeString) {

    const timeParts = timeString.split(' ');
    let totalMinutes = 0;
    let currentUnit = 0;
    
    for (let i = 0; i < timeParts.length; i += 2) {
        const value = parseInt(timeParts[i]);
        const unit = timeParts[i + 1];
        
        if (unit.includes('year')) {
            currentUnit = 365 * 24 * 60; // Convert years to minutes
        } else if (unit.includes('hour')) {
            currentUnit = 60; // Convert hours to minutes
        } else if (unit.includes('minute')) {
            currentUnit = 1; // Minutes
        } else if (unit.includes('second')) {
            currentUnit = 1 / 60; // Convert seconds to minutes
        }
        
        totalMinutes += value * currentUnit;
    }
    
    return totalMinutes;
}


document.addEventListener('DOMContentLoaded', function () {
    var back = document.getElementById('back');
    back.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent link navigation
        window.history.back();
      });
    
});

