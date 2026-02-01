const { GoogleSpreadsheet } = require('google-spreadsheet');
const { SPREADSHEET_ID, GOOGLE_CREDS } = require('./config');

const creds = JSON.parse(Buffer.from(GOOGLE_CREDS, 'base64').toString('utf8'));

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

async function appendExpense(row) {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Expenses'];
  await sheet.addRow(row);
}

async function appendIncome(row) {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Income'];
  await sheet.addRow(row);
}

module.exports = { appendExpense, appendIncome };
