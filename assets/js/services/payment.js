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
  // Call a Cloud Function to verify payment (optional)
  const verify = httpsCallable(functions, 'verifyPhonePePayment');
  try {
    const result = await verify(paymentData);
    return result.data;
  } catch (error) {
    console.error('Payment verification error:', error);
    return null;
  }
}