const { parseFinanceMessage, applyCorrection } = require('./llm');
const { appendExpense, appendIncome } = require('./sheets');
const { getTimestamp } = require('./utils');
const { setPending, getPending, clearPending, hasPending } = require('./state');

/**
 * Format parsed data into a confirmation message.
 */
function formatConfirmationMessage(data) {
  const store = data.store && data.store !== 'null' ? data.store : 'N/A';
  return `I've parsed this as:
💰 Amount: ${data.amount}
🛒 Store: ${store}
🏷️ Category: ${data.categoryOrSource}
📅 Date: ${data.date}
📝 Description: ${data.description}

Confirm with 'Yes', 'No', or tell me what to fix (e.g., 'Category is Eating Out').`;
}

/**
 * Check if a message is a confirmation response.
 */
function isConfirmationResponse(text) {
  const lower = text.toLowerCase().trim();
  return lower === 'yes' || lower === 'no' || lower.startsWith('change') || lower.includes(' is ');
}

/**
 * Handle incoming WhatsApp messages with confirmation flow.
 */
async function handleMessage(msg) {
  const text = msg.body.trim();
  const groupId = msg.from;
  const senderId = msg.author || msg.from; // msg.author for group messages

  console.log(`Processing message from ${senderId}: "${text}"`);

  // Check if user has a pending confirmation
  if (hasPending(groupId, senderId)) {
    const lowerText = text.toLowerCase().trim();

    // User confirms with 'Yes'
    if (lowerText === 'yes') {
      const data = getPending(groupId, senderId);
      const timestamp = getTimestamp();

      try {
        if (data.type === 'expense') {
          await appendExpense([
            timestamp,
            data.date,
            data.description,
            data.amount,
            data.categoryOrSource,
          ]);
        } else if (data.type === 'income') {
          await appendIncome([
            timestamp,
            data.date,
            data.categoryOrSource,
            data.description,
            data.amount,
          ]);
        }
        await msg.reply('✅ Logged!');
        console.log('Transaction logged successfully.');
      } catch (err) {
        console.error('Error logging to sheet:', err);
        await msg.reply('❌ Error logging to sheet. Please try again.');
      }

      clearPending(groupId, senderId);
      return;
    }

    // User cancels with 'No'
    if (lowerText === 'no') {
      clearPending(groupId, senderId);
      await msg.reply('❌ Cancelled. Try again.');
      console.log('Transaction cancelled by user.');
      return;
    }

    // User provides a correction
    const existingData = getPending(groupId, senderId);
    const updatedData = await applyCorrection(existingData, text);

    if (updatedData) {
      setPending(groupId, senderId, updatedData, msg.id._serialized);
      const confirmationMsg = formatConfirmationMessage(updatedData);
      await msg.reply(confirmationMsg);
      console.log('Correction applied, awaiting re-confirmation.');
    } else {
      await msg.reply('❌ Could not apply correction. Please try again or say "No" to cancel.');
    }
    return;
  }

  // No pending confirmation - parse new message
  const aiResult = await parseFinanceMessage(text);

  if (!aiResult) {
    console.log('Could not parse message as finance data.');
    return; // Ignore non-finance messages
  }

  // Store pending confirmation and ask for verification
  setPending(groupId, senderId, aiResult, msg.id._serialized);
  const confirmationMsg = formatConfirmationMessage(aiResult);
  await msg.reply(confirmationMsg);
  console.log('Parsed message, awaiting confirmation.');
}

module.exports = { handleMessage };
