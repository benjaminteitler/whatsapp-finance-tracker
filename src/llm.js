const { GEMINI_API_KEY } = require('./config');
const { getCurrentDate, getYesterdayDate } = require('./utils');
const axios = require('axios');

const EXPENSE_CATEGORIES = ['Bills', 'Entertainment', 'Eating out', 'Groceries', 'Health & Wellbeing', 'Other', 'Shopping', 'Baby', 'Travel', 'Gifts'];
const INCOME_SOURCES = ['Dovi', 'Bella', 'Parents help'];

const SYSTEM_INSTRUCTION = () => `The current date in Israel is ${getCurrentDate()}. If the user says 'today', use this date. If 'yesterday', calculate accordingly. Always output the date as MM/DD/YYYY.

Expense Categories: ${EXPENSE_CATEGORIES.join(', ')}.
Income Sources: ${INCOME_SOURCES.join(', ')}.`;

/**
 * Parse a finance message into structured data.
 */
async function parseFinanceMessage(message) {
  try {
    const prompt = `${SYSTEM_INSTRUCTION()}
Message: ${message}

Parse this message and respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "type": "income" or "expense",
  "date": "MM/DD/YYYY",
  "amount": number,
  "store": "store name or null if not mentioned",
  "categoryOrSource": "category for expense or source for income",
  "description": "brief description"
}`;

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
    let text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Remove markdown code fences if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
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

/**
 * Apply a correction to existing parsed data.
 */
async function applyCorrection(existingData, correctionMessage) {
  try {
    const prompt = `${SYSTEM_INSTRUCTION()}

You have previously parsed this finance data:
${JSON.stringify(existingData, null, 2)}

The user wants to make this correction: "${correctionMessage}"

Apply the correction and respond ONLY with the updated valid JSON in this exact format (no markdown, no explanation):
{
  "type": "income" or "expense",
  "date": "MM/DD/YYYY",
  "amount": number,
  "store": "store name or null if not mentioned",
  "categoryOrSource": "category for expense or source for income",
  "description": "brief description"
}`;

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
    let text = res.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Remove markdown code fences if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const json = JSON.parse(text);
    // Handle 'today'/'yesterday' in date
    if (json.date === 'today') json.date = getCurrentDate();
    if (json.date === 'yesterday') json.date = getYesterdayDate();
    return json;
  } catch (e) {
    console.error('Gemini correction error:', e.message);
    return null;
  }
}

module.exports = { parseFinanceMessage, applyCorrection, EXPENSE_CATEGORIES, INCOME_SOURCES };
