const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SPREADSHEET_ID: process.env.SPREADSHEET_ID,
  GROUP_ID: process.env.GROUP_ID,
  GOOGLE_CREDS: process.env.GOOGLE_CREDS,
  TZ: 'Asia/Jerusalem',
  DATE_FORMAT: 'MM/DD/YYYY',
};
