import { functions } from '../config/firebase.js';
import { httpsCallable } from 'firebase/functions';

/**
 * Create a shipment using Shiprocket (Admin only)
 * @param {string} orderId - Firestore order document ID
 * @returns {Promise<Object|null>} Shipment data or null on error
 */
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

/**
 * Track a shipment via Shiprocket
 * @param {string} shipmentId - Shiprocket AWB or order ID
 * @returns {Promise<Object|null>} Tracking data or null
 */
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

/**
 * Update order delivery status after shipment creation
 * @param {string} orderId - Firestore order ID
 * @param {Object} deliveryData - { shipmentId, trackingUrl, courier }
 * @returns {Promise<boolean>}
 */
export async function updateOrderDelivery(orderId, deliveryData) {
  const { updateOrder } = await import('./firestore.js');
  const result = await updateOrder(orderId, { delivery: deliveryData, status: 'shipped' });
  return result.success;
}