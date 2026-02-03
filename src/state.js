/**
 * State management for pending confirmations.
 * Stores parsed finance data awaiting user confirmation.
 * Auto-clears after 5 minutes if no confirmation received.
 */

const CONFIRMATION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// Map: pendingId -> { data, timer, originalMsgId }
const pendingConfirmations = new Map();

/**
 * Generate a unique key for pending confirmations.
 * @param {string} groupId - The WhatsApp group ID.
 * @param {string} senderId - The sender's ID.
 * @returns {string} - Unique key.
 */
function getPendingKey(groupId, senderId) {
  return `${groupId}:${senderId}`;
}

/**
 * Store a pending confirmation.
 * @param {string} groupId - The WhatsApp group ID.
 * @param {string} senderId - The sender's ID.
 * @param {object} data - Parsed finance data.
 * @param {string} originalMsgId - The original message ID for threading.
 */
function setPending(groupId, senderId, data, originalMsgId) {
  const key = getPendingKey(groupId, senderId);

  // Clear any existing pending for this user
  clearPending(groupId, senderId);

  // Set timeout to auto-clear
  const timer = setTimeout(() => {
    console.log(`Pending confirmation expired for ${key}`);
    pendingConfirmations.delete(key);
  }, CONFIRMATION_TIMEOUT_MS);

  pendingConfirmations.set(key, { data, timer, originalMsgId });
}

/**
 * Get pending confirmation data.
 * @param {string} groupId - The WhatsApp group ID.
 * @param {string} senderId - The sender's ID.
 * @returns {object|null} - Pending data or null.
 */
function getPending(groupId, senderId) {
  const key = getPendingKey(groupId, senderId);
  const pending = pendingConfirmations.get(key);
  return pending ? pending.data : null;
}

/**
 * Get the original message ID for threading.
 * @param {string} groupId - The WhatsApp group ID.
 * @param {string} senderId - The sender's ID.
 * @returns {string|null} - Original message ID or null.
 */
function getOriginalMsgId(groupId, senderId) {
  const key = getPendingKey(groupId, senderId);
  const pending = pendingConfirmations.get(key);
  return pending ? pending.originalMsgId : null;
}

/**
 * Clear pending confirmation.
 * @param {string} groupId - The WhatsApp group ID.
 * @param {string} senderId - The sender's ID.
 */
function clearPending(groupId, senderId) {
  const key = getPendingKey(groupId, senderId);
  const pending = pendingConfirmations.get(key);
  if (pending) {
    clearTimeout(pending.timer);
    pendingConfirmations.delete(key);
  }
}

/**
 * Check if there's a pending confirmation for this user.
 * @param {string} groupId - The WhatsApp group ID.
 * @param {string} senderId - The sender's ID.
 * @returns {boolean} - True if pending exists.
 */
function hasPending(groupId, senderId) {
  const key = getPendingKey(groupId, senderId);
  return pendingConfirmations.has(key);
}

module.exports = {
  setPending,
  getPending,
  getOriginalMsgId,
  clearPending,
  hasPending,
};
