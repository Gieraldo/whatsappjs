// main.js
const { getProxy } = require("./handlers/haproxyMetrics");
const { sendMessageToGroup, client } = require('./client/whatsappClient');
const config = require('./config/config');
const puppeteer = require('puppeteer');
const { DateTime } = require('luxon'); // Mengimpor DateTime dari Luxon
const fs = require('fs'); // Mengimpor fs
const cron = require('node-cron');
require('dotenv').config(); // Memuat environment variables dari .env file

// Destructure the configurations for each cluster
const { whatsapp } = config;

// Function to delay execution using setTimeout wrapped in a Promise
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listener for client readiness
cron.schedule('0 * * * *', async () => {
    console.log('Starting scheduled task...');

    let browser;
    try {
        // Get current time in WIB (Waktu Indonesia Barat)
        const now = DateTime.now().setZone('Asia/Jakarta');
        const formattedTime = now.toFormat('HH:mm'); // Format jam menit

        // Start Puppeteer and navigate to Grafana dashboard
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setViewport({ width: 1818, height: 460 });

        // Open Grafana and login
        console.log('Navigating to Grafana login page...');
        await page.goto(process.env.URL_GRAFANA, { timeout: 80000 });
        
        // Wait for the username input to appear
        console.log('Waiting for username input...');
        await page.waitForSelector('input[name="user"]', { visible: true });

        console.log('Entering username...');
        await page.type('input[name="user"]', process.env.USER_GRAFANA);
        
        console.log('Entering password...');
        await page.type('input[name="password"]', process.env.PASSWORD_GRAFANA);
        
        console.log('Submitting login form...');
        await Promise.all([
            page.waitForNavigation(), // Wait for navigation to complete
            page.keyboard.press('Enter'), // Press "Enter" to submit form
        ]);

        // Open the specific dashboard
        console.log('Navigating to Grafana dashboard...');
        await page.goto(process.env.URL_DASHBOARD);

        // Delay for 10 seconds (10000 milliseconds)
        console.log('Delaying for 10 seconds...');
        await delay(10000);

        // Capture screenshot
        const screenshotPath = `./screenshoot/screenshot_${formattedTime.replace(':', '-')}.png`;
        console.log(`Capturing screenshot to ${screenshotPath}...`);
        await page.screenshot({ path: screenshotPath });

        // Get the proxy message
        const proxyMessage = await getProxy(); // Call getProxy to fetch Prometheus data

        // Send the screenshot and message to the WhatsApp group
        console.log(`Sending message and screenshot to WhatsApp group: ${whatsapp.groupName}...`);
        await sendMessageToGroup(whatsapp.groupName, proxyMessage, screenshotPath);
        console.log('Screenshot and message sent successfully to WhatsApp group.');

        // Remove old screenshots, keeping only the last 2 files
        console.log('Cleaning up old screenshots...');
        const screenshots = fs.readdirSync('./screenshoot').filter(file => file.startsWith('screenshot_') && file.endsWith('.png'));
        screenshots.sort((a, b) => fs.statSync(`./screenshoot/${b}`).mtime.getTime() - fs.statSync(`./screenshoot/${a}`).mtime.getTime());

        for (let i = 2; i < screenshots.length; i++) {
            fs.unlinkSync(`./screenshoot/${screenshots[i]}`);
        }

        // Close the Puppeteer browser session
        console.log('Closing session...');
        await browser.close();

    } catch (error) {
        console.error("Error capturing and sending screenshot:", error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

// Initialize WhatsApp client
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    console.log('Client initialization complete');
});

client.initialize();
