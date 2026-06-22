import { functions } from '../config/firebase.js';
import { httpsCallable } from 'firebase/functions';

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

export function generateUPIQR(upiId, amount, transactionNote = 'Glamm Fashion Order') {
  return `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
}