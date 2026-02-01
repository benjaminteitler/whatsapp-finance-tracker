const moment = require('moment-timezone');
const { TZ, DATE_FORMAT } = require('./config');

function getCurrentDate() {
  return moment().tz(TZ).format(DATE_FORMAT);
}

function getYesterdayDate() {
  return moment().tz(TZ).subtract(1, 'day').format(DATE_FORMAT);
}

function getTimestamp() {
  return moment().tz(TZ).format('MM/DD/YYYY HH:mm');
}

module.exports = {
  getCurrentDate,
  getYesterdayDate,
  getTimestamp,
};
