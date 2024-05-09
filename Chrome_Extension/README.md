# Website Time Tracker Chrome Extension

This Chrome extension tracks the time spent on different websites and sends the data to a Ruby on Rails server for analysis.

## Features

- Tracks time spent on each website.
- Sends tab data to a Ruby on Rails server every 5 seconds.
- Calculates and formats the duration of time spent on each website.
- Provides a dashboard interface to visualize the time spent on websites.

## Installation

1. Clone this repository to your local machine.
2. Open Google Chrome and go to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the directory where you cloned the repository.

## Usage

1. Once the extension is installed, click on the extension icon in the Chrome toolbar to open the dashboard.
2. The dashboard will display the time spent on each website in a list format.
3. The extension will automatically send tab data to the server every 5 seconds.

## Server Integration

To integrate the extension with your Ruby on Rails server, you'll need to set up an endpoint to receive and handle the tab data sent by the extension. The extension sends tab data as JSON objects containing the tab ID, URL, and time spent.

Example JSON object sent by the extension:

```json
{
  "id": 123,
  "url": "https://example.com",
  "time": "2024-05-21T12:30:45.000Z"
}
