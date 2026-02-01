process.env.TZ = 'Asia/Jerusalem';
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jerusalem');

require('./src/server');
const whatsapp = require('./src/whatsapp');

whatsapp.initialize();
