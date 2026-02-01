const { parseFinanceMessage } = require('./llm');
const { appendExpense, appendIncome } = require('./sheets');
const { getTimestamp } = require('./utils');

async function handleMessage(msg) {
  const text = msg.body;
  const aiResult = await parseFinanceMessage(text);
  if (!aiResult) return;

  const timestamp = getTimestamp();
  if (aiResult.type === 'expense') {
    await appendExpense([
      timestamp,
      aiResult.date,
      aiResult.description,
      aiResult.amount,
      aiResult.categoryOrSource,
    ]);
  } else if (aiResult.type === 'income') {
    await appendIncome([
      timestamp,
      aiResult.date,
      aiResult.categoryOrSource,
      aiResult.description,
      aiResult.amount,
    ]);
  }
}

module.exports = { handleMessage };
