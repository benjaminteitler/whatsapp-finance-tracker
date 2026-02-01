const { Client, LocalAuth } = require('whatsapp-web.js');
const { GROUP_ID } = require('./config');
const { handleMessage } = require('./handler');

console.log('Starting WhatsApp client...');
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

module.exports = client;
