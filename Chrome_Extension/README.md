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


# Website Time Tracker

This Chrome extension tracks the time spent on different websites and sends the data to a Ruby on Rails server for analysis.

## Ruby on Rails Setup

1. **Install Ruby**: Ensure you have Ruby installed on your system. You can install it using a version manager like RVM or rbenv.

2. **Install Rails**: Install the Ruby on Rails gem using the following command:

3. **Create a New Rails Application**: Create a new Rails application using the following command:

4. **Set Up MySQL Database**: Configure your Rails application to use MySQL as the database by updating the `config/database.yml` file.

5. **Generate Scaffold**: Generate a scaffold for the data model you want to track in your Rails application. For example:


6. **Run Migrations**: Run migrations to create the necessary database tables:


7. **Start the Rails Server**: Start the Rails server using the following command:


## MySQL Setup

1. **Install MySQL**: Install MySQL on your system. You can download and install it from the official MySQL website.

2. **Create a Database**: Use the MySQL command line or a GUI tool to create a new database for your Rails application.

3. **Configure Rails**: Update the `config/database.yml` file in your Rails application to specify the MySQL database settings.

4. **Test Connection**: Test the connection to the MySQL database by running your Rails application and performing database operations.

## Chrome Extension Setup

1. **Create Manifest File**: Create a `manifest.json` file for your Chrome extension. Define necessary permissions and settings.

2. **Background Script**: Create a background script (e.g., `background.js`) to handle extension functionality like tracking time spent on websites and sending data to the server.

3. **Content Script**: Optionally, create a content script to interact with the web pages and gather additional data.

4. **Popup/Dashboard**: Create the popup or dashboard interface for your extension to display tracked data and user interface elements.

5. **Interact with Rails Server**: Use XMLHttpRequest or the Fetch API in your extension's background script to send data to the Rails server endpoint.

6. **Test Extension**: Test your Chrome extension by loading it into Chrome and verifying that it functions as expected.

## Usage

1. Once the extension is installed, click on the extension icon in the Chrome toolbar to open the dashboard.
2. The dashboard will display the time spent on each website in a list format.
3. The extension will automatically send tab data to the server every 5 seconds.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

