# Whatsappweb-js

Whatsappweb-js is a Node.js application intended to run and spam health checks through WhatsApp. This application uses Puppeteer to capture screenshots from a web page and send those screenshots along with health check information to a specified WhatsApp group.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Scheduled Tasks](#scheduledtasks)
- [Dependencies](#dependencies)
- [Notes](#notes)
- [Issues](#issues)

## Installation

Clone the repository and install the necessary dependencies:

git clone https://github.com/your-username/whatsappweb-js.git
cd whatsappweb-js
npm install

## Usage

Run the application using the following command:

node main.js

## Configuration

You can send specific groups chat in the WhatsApp by their name. Update the config.js file with the groups WhatsApp ID:

module.exports = {
whatsapp: {
    groupName: 'your-group'
  }
};

## ScheduledTasks
The application uses node-cron to schedule tasks. Update the cron job as necessary to match your desired schedule.

## Dependencies
luxon - A library for working with dates and times.
node-cron - A tool for scheduling tasks in Node.js.
puppeteer - A Node library to control headless Chrome.
qr-image - A library to generate QR codes.
whatsapp-web.js - A client library to automate WhatsApp Web.

### Notes

- Ensure you have Node.js version 16.x or above installed.
- If running as a non-root user, ensure you have the necessary permissions and dependencies installed for Puppeteer to work correctly.

## Issues

If you encounter any issues, please open an issue on the GitHub repository.