import { getCurrentUser } from '../services/auth.js';
import { createOrder } from '../services/firestore.js';
import { createPhonePeOrder } from '../services/payment.js';

// We'll load QRCode library dynamically (no need to install)
let QRCode = null;

export async function renderCheckout() {
  const container = document.getElementById('page-content');
  const user = getCurrentUser();

  if (!user) {
    container.innerHTML = `
      <div class="checkout-login-prompt">
        <i class="fa-regular fa-circle-user"></i>
        <h3>Please Login to Checkout</h3>
        <p>You need to be logged in to place an order.</p>
        <button class="btn-primary" onclick="window.openAuthModal()">Login / Sign Up</button>
      </div>
    `;
    return;
  }

  const cart = JSON.parse(localStorage.getItem('glamm_cart')) || [];
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="checkout-empty">
        <i class="fa-regular fa-face-frown"></i>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button class="btn-primary" onclick="window.navigateTo('products')">Start Shopping</button>
      </div>
    `;
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 599 ? 0 : 40;
  const total = subtotal + shipping;

  // Load QRCode library
  if (!QRCode) {
    await loadQRCodeLibrary();
  }

  container.innerHTML = `
    <div class="checkout-wrapper animate-fade-up">
      <div class="checkout-header">
        <h1>Checkout</h1>
        <p>Review your order and complete payment</p>
        <div class="checkout-steps">
          <span class="step active">1. Cart</span>
          <span class="step active">2. Details</span>
          <span class="step">3. Payment</span>
        </div>
      </div>

      <div class="checkout-grid">
        <!-- Left: Order Summary -->
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="summary-items">
            ${cart.map(item => `
              <div class="summary-item">
                <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.name}">
                <div class="item-details">
                  <span class="item-name">${item.name}</span>
                  <span class="item-qty">Qty: ${item.qty}</span>
                </div>
                <span class="item-price">₹${(item.price * item.qty).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="summary-totals">
            <div class="subtotal"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
            <div class="shipping"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(2)}</span></div>
            <div class="total"><span>Total</span><span>₹${total.toFixed(2)}</span></div>
          </div>
        </div>

        <!-- Right: Form + Payment -->
        <div class="checkout-form-wrapper">
          <form id="checkout-form">
            <h3>Shipping Details</h3>
            <div class="form-group floating-label">
              <input type="text" id="checkout-name" required value="${user.displayName || ''}">
              <label for="checkout-name">Full Name</label>
            </div>
            <div class="form-row">
              <div class="form-group floating-label">
                <input type="email" id="checkout-email" required value="${user.email}">
                <label for="checkout-email">Email</label>
              </div>
              <div class="form-group floating-label">
                <input type="tel" id="checkout-phone" required value="${user.phoneNumber || ''}">
                <label for="checkout-phone">Phone</label>
              </div>
            </div>
            <div class="form-group floating-label">
              <textarea id="checkout-address" rows="3" required placeholder=" "></textarea>
              <label for="checkout-address">Shipping Address</label>
            </div>

            <h3>Payment Method</h3>
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" name="payment" value="phonepe" checked>
                <span class="option-content">
                  <i class="fa-brands fa-google-pay"></i> PhonePe (Redirect)
                </span>
              </label>
              <label class="payment-option">
                <input type="radio" name="payment" value="upi">
                <span class="option-content">
                  <i class="fa-solid fa-qrcode"></i> UPI QR Code
                </span>
              </label>
            </div>

            <div id="upi-qr-section" style="display:none; margin-top:16px; text-align:center;">
              <div id="qr-code-container"></div>
              <p class="qr-instruction">Scan with any UPI app to pay</p>
              <p class="qr-amount">Amount: ₹${total.toFixed(2)}</p>
            </div>

            <button type="submit" class="btn-primary checkout-btn">
              <i class="fa-solid fa-lock"></i> Place Order & Pay
            </button>
          </form>
          <div id="payment-status" class="payment-status"></div>
        </div>
      </div>
    </div>
  `;

  // ─── Event Listeners ───
  const form = document.getElementById('checkout-form');
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const upiSection = document.getElementById('upi-qr-section');
  const qrContainer = document.getElementById('qr-code-container');

  // Toggle QR section
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'upi') {
        upiSection.style.display = 'block';
        generateUPIQR(total, user.email);
      } else {
        upiSection.style.display = 'none';
      }
    });
  });

  // Generate QR on load if UPI selected by default (but redirect is default)
  // We'll generate when user selects.

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('checkout-name').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const address = document.getElementById('checkout-address').value.trim();

    if (!name || !email || !phone || !address) {
      showPaymentStatus('Please fill all required fields.', 'error');
      return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    const orderData = {
      userId: user.uid,
      customerName: name,
      email,
      phone,
      address,
      items: cart,
      subtotal,
      shipping,
      total,
      status: 'pending',
      paymentMethod
    };

    // Create order in Firestore
    const orderResult = await createOrder(orderData);
    if (!orderResult) {
      showPaymentStatus('Order creation failed. Please try again.', 'error');
      return;
    }

    const orderId = orderResult.id;

    // If UPI selected, we just show the QR and update order with a note
    if (paymentMethod === 'upi') {
      // We'll mark order as pending, user must pay via UPI.
      // Show instructions
      showPaymentStatus('Scan the QR code with your UPI app to complete payment. We\'ll confirm after we receive the payment.', 'success');
      // Optionally, we could set a timeout to check payment status (but we'll rely on webhook)
      // For now, we inform the user.
      // Also, we could save the transaction ID (orderId) in the UPI string for reference.
      // The order remains pending, and we'll update via webhook.
      return;
    }

    // ─── PhonePe Redirect ───
    const paymentResult = await createPhonePeOrder(orderId, total, user.email);
    if (paymentResult && paymentResult.paymentLink) {
      // Redirect to PhonePe payment page
      window.location.href = paymentResult.paymentLink;
    } else {
      showPaymentStatus('Payment initiation failed. Please try again.', 'error');
    }
  });

  // ─── Helper: show payment status ───
  function showPaymentStatus(message, type = 'info') {
    const statusEl = document.getElementById('payment-status');
    statusEl.innerHTML = `<div class="status-${type}">${message}</div>`;
  }

  // ─── Helper: generate UPI QR ───
  function generateUPIQR(amount, email) {
    if (!QRCode) {
      qrContainer.innerHTML = '<p>Loading QR library...</p>';
      return;
    }
    // Construct UPI URI (use merchant's UPI ID – replace with your own)
    const upiId = 'glammfashion@upi'; // Replace with actual UPI ID
    const upiUrl = `upi://pay?pa=${upiId}&pn=Glamm Fashion&am=${amount.toFixed(2)}&cu=INR&tn=Order Payment`;
    qrContainer.innerHTML = ''; // clear
    new QRCode(qrContainer, {
      text: upiUrl,
      width: 200,
      height: 200,
      colorDark: '#7B113A',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }
}

// ─── Load QRCode library from CDN ───
function loadQRCodeLibrary() {
  return new Promise((resolve, reject) => {
    if (typeof QRCode !== 'undefined') {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
    script.onload = () => {
      QRCode = window.QRCode;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}