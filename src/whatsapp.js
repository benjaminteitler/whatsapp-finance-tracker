const { Client, LocalAuth } = require('whatsapp-web.js');
const { GROUP_ID } = require('./config');
const { handleMessage } = require('./handler');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('message', async (msg) => {
  console.log('Message from:', msg.from);
  if (msg.from !== GROUP_ID) return;
  await handleMessage(msg);
});

client.on('ready', () => {
  console.log('WhatsApp client is ready.');
});

module.exports = client;
