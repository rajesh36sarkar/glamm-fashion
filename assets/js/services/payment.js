import { functions } from '../config/firebase.js';
import { httpsCallable } from 'firebase/functions';

/**
 * Create a PhonePe payment order
 * @param {string} orderId - Firestore order ID
 * @param {number} amount - Total amount in rupees
 * @param {string} email - Customer email
 * @returns {Promise<Object|null>} { paymentLink, merchantTransactionId } or null
 */
export async function createPhonePeOrder(orderId, amount, email) {
  const createOrder = httpsCallable(functions, 'createPhonePeOrder');
  try {
    const result = await createOrder({ orderId, amount, email });
    return result.data;
  } catch (error) {
    console.error('PhonePe order error:', error);
    return null;
  }
}

/**
 * Verify payment status (optional, can be used after redirect)
 * @param {Object} paymentData - The payment response from gateway
 * @returns {Promise<Object|null>} Verification result
 */
export async function verifyPayment(paymentData) {
  const verify = httpsCallable(functions, 'verifyPhonePePayment');
  try {
    const result = await verify(paymentData);
    return result.data;
  } catch (error) {
    console.error('Payment verification error:', error);
    return null;
  }
}

/**
 * Generate UPI QR code string (for static QR or dynamic)
 * @param {string} upiId - UPI ID (e.g., glammfashion@upi)
 * @param {number} amount - Amount
 * @param {string} transactionNote - Optional note
 * @returns {string} UPI URI
 */
export function generateUPIQR(upiId, amount, transactionNote = 'Glamm Fashion Order') {
  return `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
}