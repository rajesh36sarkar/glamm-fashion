import { functions } from '../config/firebase.js';
import { httpsCallable } from 'firebase/functions';

export async function createDelhiveryShipment(orderId, shipmentData = {}) {
  const createShipment = httpsCallable(functions, 'createDelhiveryShipment');
  try {
    const result = await createShipment({ orderId, ...shipmentData });
    return result.data;
  } catch (error) {
    console.error('Delhivery shipment creation error:', error);
    return null;
  }
}

export async function trackDelhiveryShipment(shipmentId) {
  const track = httpsCallable(functions, 'trackDelhiveryShipment');
  try {
    const result = await track({ shipmentId });
    return result.data;
  } catch (error) {
    console.error('Delhivery tracking error:', error);
    return null;
  }
}