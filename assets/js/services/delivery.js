import { functions } from '../config/firebase.js';
import { httpsCallable } from 'firebase/functions';

export async function trackShipment(shipmentId) {
  const track = httpsCallable(functions, 'trackShipment');
  try {
    const result = await track({ shipmentId });
    return result.data;
  } catch (error) {
    console.error('Tracking error:', error);
    return null;
  }
}

// For admin: create shipment when order shipped
export async function createShipment(orderId) {
  const create = httpsCallable(functions, 'createShiprocketOrder');
  try {
    const result = await create({ orderId });
    return result.data;
  } catch (error) {
    console.error('Shipment creation error:', error);
    return null;
  }
}