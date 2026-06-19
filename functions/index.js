const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

// ============= PHONEPE =============
const PHONEPE_MERCHANT_ID = functions.config().phonepe.merchant_id;
const PHONEPE_SALT_KEY = functions.config().phonepe.salt_key;
const PHONEPE_SALT_INDEX = functions.config().phonepe.salt_index || 1;
const PHONEPE_BASE_URL = functions.config().phonepe.env === 'prod' 
  ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
  : 'https://api.phonepe.com/apis/hermes/pg/v1/pay'; // Use sandbox if needed

exports.createPhonePeOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { orderId, amount, email } = data;
  const merchantTransactionId = `TXN_${Date.now()}`;

  const payload = {
    merchantId: PHONEPE_MERCHANT_ID,
    merchantTransactionId,
    merchantUserId: context.auth.uid,
    amount: amount * 100, // paise
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

// ============= SHIPROCKET =============
const SHIPROCKET_EMAIL = functions.config().shiprocket.email;
const SHIPROCKET_PASSWORD = functions.config().shiprocket.password;
let shiprocketToken = null;
let tokenExpiry = 0;

async function getShiprocketToken() {
  if (shiprocketToken && Date.now() < tokenExpiry) return shiprocketToken;
  const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
    email: SHIPROCKET_EMAIL,
    password: SHIPROCKET_PASSWORD
  });
  shiprocketToken = response.data.token;
  tokenExpiry = Date.now() + 3600 * 1000; // 1 hour
  return shiprocketToken;
}

exports.createShiprocketOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');

  const { orderId } = data;
  const orderSnap = await db.collection('orders').doc(orderId).get();
  if (!orderSnap.exists) throw new functions.https.HttpsError('not-found', 'Order not found');
  const order = orderSnap.data();

  const token = await getShiprocketToken();
  const payload = {
    order_id: orderId,
    order_date: new Date().toISOString().split('T')[0],
    pickup_location: 'Bangalore',
    billing_customer_name: order.customerName,
    billing_address: order.address,
    billing_city: 'Bangalore',
    billing_pincode: '560087',
    billing_state: 'Karnataka',
    billing_country: 'India',
    billing_email: order.email,
    billing_phone: order.phone,
    shipping_customer_name: order.customerName,
    shipping_address: order.address,
    shipping_city: 'Bangalore',
    shipping_pincode: '560087',
    shipping_state: 'Karnataka',
    shipping_country: 'India',
    shipping_phone: order.phone,
    order_items: order.items.map(item => ({
      name: item.name,
      sku: item.id,
      units: item.qty,
      selling_price: item.price,
      discount: 0,
      tax: 0,
      hsn: 999999
    })),
    payment_method: 'Prepaid',
    total_discount: 0,
    sub_total: order.total,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5
  };

  const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', payload, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.data && response.data.order_id) {
    await db.collection('orders').doc(orderId).update({
      'delivery.shipmentId': response.data.order_id,
      'delivery.trackingUrl': `https://track.shiprocket.in/${response.data.order_id}`,
      'delivery.courier': response.data.courier_name || 'Shiprocket'
    });
    return response.data;
  } else {
    throw new functions.https.HttpsError('internal', 'Shiprocket failed');
  }
});

exports.trackShipment = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');
  const { shipmentId } = data;
  const token = await getShiprocketToken();
  const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${shipmentId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
});