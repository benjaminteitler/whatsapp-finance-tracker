const { GEMINI_API_KEY } = require('./config');
const { getCurrentDate, getYesterdayDate } = require('./utils');
const axios = require('axios');

const SYSTEM_INSTRUCTION = () => `The current date in Israel is ${getCurrentDate()}. If the user says 'today', use this date. If 'yesterday', calculate accordingly. Always output the date as MM/DD/YYYY.`;

async function parseFinanceMessage(message) {
  try {
    const prompt = `${SYSTEM_INSTRUCTION()}\nMessage: ${message}\nRespond ONLY in this JSON format: { "type": "income" | "expense", "date": "MM/DD/YYYY", "amount": number, "categoryOrSource": string, "description": string }`;
    const res = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
      }
    );
    const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const json = JSON.parse(text);
    // Handle 'today'/'yesterday' in date
    if (json.date === 'today') json.date = getCurrentDate();
    if (json.date === 'yesterday') json.date = getYesterdayDate();
    return json;
  } catch (e) {
    console.error('Gemini parse error:', e.message);
    return null;
  }
}

module.exports = { parseFinanceMessage };
