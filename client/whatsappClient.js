const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const qr = require('qr-image');
const path = require('path');

const tempFolderPath = path.resolve('./temp');

// Check if temp folder exists, if not, create it
if (!fs.existsSync(tempFolderPath)) {
    console.log(`Temp folder not found. Creating folder at ${tempFolderPath}`);
    fs.mkdirSync(tempFolderPath, { recursive: true });
} else {
    console.log(`Temp folder found at ${tempFolderPath}`);
}

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: tempFolderPath,
    }),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    },
});

// Generate QR code for authentication
client.on('qr', (qrString) => {
    const qrImage = qr.image(qrString, { type: 'png', size: 2 }); // Adjust size as needed
    qrImage.pipe(fs.createWriteStream('qr.png')); // Save QR code to a file
    console.log('Scan the QR code in qr.png to log in.');
});

client.on('authenticated', () => {
    console.log('Authentication successful');
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failure', msg);
});

async function sendMessageToGroup(groupName, message, mediaPath) {
    try {
        const chats = await client.getChats();
        const groupChat = chats.find(chat => chat.isGroup && chat.name === groupName);

        if (groupChat) {
            const groupId = groupChat.id._serialized;
            console.log(`Found group: ${groupName} with ID: ${groupId}`);
            const media = MessageMedia.fromFilePath(mediaPath);
            await client.sendMessage(groupId, media, { caption: message });
        } else {
            console.log(`Group '${groupName}' not found`);
        }
    } catch (error) {
        console.error('Error sending message to group:', error);
    }
}

module.exports = { sendMessageToGroup, client };
