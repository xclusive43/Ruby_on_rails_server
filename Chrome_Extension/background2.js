let activeTabId = null;
let tabTimes = {};



chrome.tabs.onActivated.addListener(activeInfo => {
  activeTabId = activeInfo.tabId;
  if (!tabTimes[activeTabId]) {
    tabTimes[activeTabId] = 0;
  }
});

chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    activeTabId = null;
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      activeTabId = tabs[0].id;
      if (!tabTimes[activeTabId]) {
        tabTimes[activeTabId] = 0;
      }
    });
  }
});

setInterval(() => {
  if (activeTabId) {
    tabTimes[activeTabId]++;
  }
}, 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.cmd === 'getTabTimes') {
    sendResponse(tabTimes);
  }
  if (request.cmd === 'getActiveTabID') {
    sendResponse(activeTabId); // Send the activeTabId variable
  }
});

//URL Blocking Logic
// Array to store blocked URLs
var blockedURLs = [];
var blockedURLsSaved;
// Listen for messages from content scripts

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Check if the message is to block or unblock a URL
  if (message.action === 'blockUrl') {
    // Check if the URL is not already in the list of blocked URLs
    if (!blockedURLsSaved.includes(message.url)) {
      // Add the URL to the list of blocked URLs
      blockedURLs.push(message.url);
      // Update the list of blocked URLs in Chrome Storage
      updateBlockedURLs(blockedURLs);
    }
  } else if (message.action === 'unblockUrl') {
    // Find the index of the URL in the list of blocked URLs
    var index = blockedURLsSaved.indexOf(message.url);
    // Check if the URL exists in the list of blocked URLs
    if (index !== -1) {
      // Remove the URL from the list of blocked URLs
      blockedURLs.splice(index, 1);
      // Update the list of blocked URLs in Chrome Storage
      updateBlockedURLs(blockedURLs);
    }
  }

  // Load the list of blocked URLs from Chrome Storage
  getBlockedURLsFromStorage(function (storedBlockedURLs) {
    // Initialize the blockedURLs array with the stored data
    blockedURLsSaved = storedBlockedURLs;
  });

  websiteBlocker(message.action);
});

// Function to update the list of blocked URLs in Chrome Storage
function updateBlockedURLs(blockedURLs) {
  // Store the updated list of blocked URLs in Chrome Storage
  chrome.storage.local.set({ blockedURLs: blockedURLs }, function () {
  });
}


// Function to retrieve the list of blocked URLs from Chrome Storage
function getBlockedURLsFromStorage(callback) {
  chrome.storage.local.get('blockedURLs', function (data) {
    var storedBlockedURLs = data.blockedURLs || [];
    callback(storedBlockedURLs);
  });
}





const websiteBlocker = (type) => {
  if (blockedURLsSaved !== undefined | null) {
    var updatedList = [];
    // Convert single quotes to double quotes
    blockedURLsSaved?.map(function (item) {
      return updatedList.push(item);
    });

    blockedURLsSaved = updatedList;
    // Define your blocked URLs
    const blockedUrls = blockedURLsSaved;
    // Define your rules for the declarativeNetRequest API
    let rules = {};
    if (type === 'unblockUrl') {
      console.log('type', type)
      // Example usage to unblock URLs
      rules = generateRules(blockedUrls, 'allow');
    } else {
      rules = generateRules(blockedUrls, 'block');
    }


    console.log(rules)

    // Add your rules
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });

    // Listen for when a tab is updated
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      const tabHostname = new URL(tab.url).hostname;
      const isBlocked = blockedUrls.some(blockedUrl => tabHostname.endsWith(blockedUrl));
      if (isBlocked) {
        // Redirect to error page
        chrome.tabs.update(tabId, { url: "redirect-website/index.html" });
      }
    });

  }
}

// Function to generate rules for blocking and unblocking URLs
function generateRules(blockedUrls, actionType) {
  return blockedUrls?.map((url, index) => ({
    id: parseInt(Date.now() / 1000) + index, // Generate a unique ID based on the current time
    priority: 1,
    action: { type: actionType }, // 'block' for blocking, 'unblock' for unblocking
    condition: {
      urlFilter: url,
      resourceTypes: ['main_frame']
    }
  }));
}

websiteBlocker('blockUrl');
