const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

// ─── PHONEPE ────────────────────────────────────────────────
const PHONEPE_MERCHANT_ID = functions.config().phonepe.merchant_id;
const PHONEPE_SALT_KEY = functions.config().phonepe.salt_key;
const PHONEPE_SALT_INDEX = functions.config().phonepe.salt_index || 1;
const PHONEPE_BASE_URL = functions.config().phonepe.env === 'prod'
  ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
  : 'https://api.phonepe.com/apis/hermes/pg/v1/pay';

exports.createPhonePeOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { orderId, amount, email } = data;
  const merchantTransactionId = `TXN_${Date.now()}`;

  const payload = {
    merchantId: PHONEPE_MERCHANT_ID,
    merchantTransactionId,
    merchantUserId: context.auth.uid,
    amount: amount * 100,
    redirectUrl: 'https://yourdomain.com/payment-callback',
    redirectMode: 'POST',
    callbackUrl: 'https://yourdomain.com/payment-callback',
    email: email || 'customer@example.com',
    paymentInstrument: { type: 'PAY_PAGE' }
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const checksum = crypto.createHash('sha256')
    .update(base64Payload + '/pg/v1/pay' + PHONEPE_SALT_KEY)
    .digest('hex') + '###' + PHONEPE_SALT_INDEX;

  try {
    const response = await axios.post(PHONEPE_BASE_URL, { request: base64Payload }, {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-CALLBACK-URL': 'https://yourdomain.com/payment-callback'
      }
    });

    if (response.data.code === 'PAYMENT_INITIATED') {
      return { paymentLink: response.data.data.instrumentResponse.redirectInfo.url };
    } else {
      throw new Error('Payment initiation failed: ' + response.data.message);
    }
  } catch (error) {
    console.error('PhonePe error:', error);
    throw new functions.https.HttpsError('internal', 'Payment service unavailable');
  }
});

// ─── DELHIVERY ──────────────────────────────────────────────
const DELHIVERY_API_KEY = functions.config().delhivery.api_key;
const DELHIVERY_BASE_URL = functions.config().delhivery.base_url || 'https://api.delhivery.com';
const DELHIVERY_PICKUP_LOCATION = functions.config().delhivery.pickup_location || 'your_warehouse_code';

exports.createDelhiveryShipment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { orderId, pickupLocation, items, customer, totalWeight, totalLength, totalBreadth, totalHeight } = data;

  const orderSnap = await db.collection('orders').doc(orderId).get();
  if (!orderSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Order not found');
  }
  const order = orderSnap.data();

  const payload = {
    pickup_location: pickupLocation || DELHIVERY_PICKUP_LOCATION,
    shipments: [
      {
        order_id: orderId,
        order_date: new Date().toISOString().split('T')[0],
        customer_name: customer?.name || order.customerName,
        customer_address: customer?.address || order.address,
        customer_city: customer?.city || 'Bangalore',
        customer_pincode: customer?.pincode || '560087',
        customer_state: customer?.state || 'Karnataka',
        customer_country: 'India',
        customer_phone: customer?.phone || order.phone,
        customer_email: customer?.email || order.email,
        total_weight: totalWeight || 0.5,
        length: totalLength || 10,
        breadth: totalBreadth || 10,
        height: totalHeight || 10,
        order_items: items || order.items.map(item => ({
          name: item.name,
          sku: item.id,
          quantity: item.qty,
          price: item.price,
          hsn: item.hsn || '999999'
        }))
      }
    ]
  };

  try {
    const response = await axios.post(`${DELHIVERY_BASE_URL}/api/v2/shipment/create`, payload, {
      headers: {
        'Authorization': `Bearer ${DELHIVERY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.shipments && response.data.shipments[0]) {
      const shipment = response.data.shipments[0];
      const trackingUrl = `https://www.delhivery.com/track/${shipment.awb || shipment.tracking_id}`;

      await db.collection('orders').doc(orderId).update({
        'delivery.shipmentId': shipment.awb || shipment.tracking_id,
        'delivery.trackingUrl': trackingUrl,
        'delivery.courier': 'Delhivery',
        'delivery.status': 'shipped',
        status: 'shipped',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return {
        success: true,
        shipmentId: shipment.awb || shipment.tracking_id,
        trackingUrl: trackingUrl
      };
    } else {
      throw new Error('Delhivery API returned no shipment data');
    }
  } catch (error) {
    console.error('Delhivery create shipment error:', error.response?.data || error.message);
    throw new functions.https.HttpsError('internal', 'Failed to create shipment');
  }
});

exports.trackDelhiveryShipment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');
  }

  const { shipmentId } = data;
  if (!shipmentId) {
    throw new functions.https.HttpsError('invalid-argument', 'Shipment ID required');
  }

  try {
    const response = await axios.get(`${DELHIVERY_BASE_URL}/api/v2/tracking`, {
      headers: {
        'Authorization': `Bearer ${DELHIVERY_API_KEY}`
      },
      params: {
        awb: shipmentId
      }
    });

    return response.data;
  } catch (error) {
    console.error('Delhivery tracking error:', error.response?.data || error.message);
    throw new functions.https.HttpsError('internal', 'Tracking failed');
  }
});