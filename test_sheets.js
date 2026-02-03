const { appendExpense, appendIncome } = require('./src/sheets');
const { getCurrentDate } = require('./src/utils');

async function test() {
  try {
    const today = getCurrentDate();
    // Try appending a test row to Expenses
    await appendExpense([
      'TEST_TIMESTAMP',
      today,
      'Test Item',
      123,
      'Groceries'
    ]);
    console.log('✅ Successfully wrote to Expenses sheet!');

    // Try appending a test row to Income
    await appendIncome([
      'TEST_TIMESTAMP',
      today,
      'Dovi',
      'Test Description',
      456
    ]);
    console.log('✅ Successfully wrote to Income sheet!');
  } catch (err) {
    console.error('❌ Error writing to Google Sheets:', err);
  }
}

test();
