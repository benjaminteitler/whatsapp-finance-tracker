const { Client, LocalAuth } = require('whatsapp-web.js');
const { GROUP_ID } = require('./config');
const { handleMessage } = require('./handler');
const path = require('path');

console.log('Starting WhatsApp client...');

const sessionPath = process.env.SESSION_PATH || './session';
console.log('Session path:', path.resolve(sessionPath));

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: sessionPath }),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
    ],
  },
});

client.on('qr', (qr) => {
  console.log('Scan this QR code with WhatsApp:');
  console.log(qr);
});

client.on('message', async (msg) => {
  console.log('Message from:', msg.from);
  if (msg.from !== GROUP_ID) return;
  await handleMessage(msg);
});

client.on('ready', () => {
  console.log('WhatsApp client is ready.');
});

client.on('auth_failure', (msg) => {
  console.error('AUTHENTICATION FAILURE:', msg);
});

client.on('disconnected', (reason) => {
  console.error('WhatsApp client disconnected:', reason);
});

client.on('loading_screen', (percent, message) => {
  console.log('Loading:', percent, '%', message);
});

client.on('authenticated', () => {
  console.log('WhatsApp client authenticated successfully!');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

module.exports = client;
