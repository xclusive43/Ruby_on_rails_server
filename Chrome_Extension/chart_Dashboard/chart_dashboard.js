// Step 1: Parse the data
const data = [
    {
        "id": 102726831,
        "url": "https://chatgpt.com/",
        "time": "1 hours 3 minutes 30 seconds",
        "created_at": "2024-05-09T18:32:35.165Z",
        "updated_at": "2024-05-09T18:38:52.198Z"
    },
    {
        "id": 102726831,
        "url": "https://googlr.com/",
        "time": "0 year 0 hours 0 minutes 7 seconds",
        "created_at": "2024-05-09T18:32:35.165Z",
        "updated_at": "2024-05-09T18:38:52.198Z"
    },
    {
        "id": 102726831,
        "url": "https://babaerr.com/",
        "time": "9 seconds",
        "created_at": "2024-05-09T18:32:35.165Z",
        "updated_at": "2024-05-09T18:38:52.198Z"
    },
    {
        "id": 10272612831,
        "url": "https://chatgpt1.com/",
        "time": "2 hours 3 minutes 30 seconds",
        "created_at": "2024-05-09T18:32:35.165Z",
        "updated_at": "2024-05-09T18:38:52.198Z"
    },
    {
        "id": 10273226831,
        "url": "https://googlr2.com/",
        "time": "0 year 0 hours 0 minutes 70 seconds",
        "created_at": "2024-05-09T18:32:35.165Z",
        "updated_at": "2024-05-09T18:38:52.198Z"
    },
    {
        "id": 10273226831,
        "url": "https://babaerr3.com/",
        "time": "90 seconds",
        "created_at": "2024-05-09T18:32:35.165Z",
        "updated_at": "2024-05-09T18:38:52.198Z"
    },
    // Other data entries...
];

// Step 2: Calculate data for the chart
const tabTimes = {};
data.forEach(entry => {
    console.log(entry.time, parseTime(entry.time))
    const url = entry.url;
    const timeSpent = parseTime(entry.time); // Helper function to parse time
    if (!tabTimes[url] || tabTimes[url] < timeSpent) {
        tabTimes[url] = timeSpent;
    }
});

// Step 3: Choose a chart library (Chart.js)
// Assume you've already included Chart.js in your page
// Step 4: Implement the chart
const labels = Object.keys(tabTimes);
const times = Object.values(tabTimes);

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