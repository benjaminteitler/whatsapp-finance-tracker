process.env.TZ = 'Asia/Jerusalem';
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jerusalem');

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

require('./src/server');
const whatsapp = require('./src/whatsapp');

console.log('Initializing WhatsApp client...');
whatsapp.initialize().then(() => {
  console.log('WhatsApp client initialization started.');
}).catch((err) => {
  console.error('WhatsApp client initialization failed:', err);
});
