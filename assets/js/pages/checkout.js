import { getCurrentUser } from '../services/auth.js';
import { createOrder } from '../services/firestore.js';
import { createPhonePeOrder } from '../services/payment.js';

export async function renderCheckout() {
  const container = document.getElementById('page-content');
  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = `<p>Please login to checkout. <a href="#" onclick="window.openAuthModal()">Login</a></p>`;
    return;
  }

  const cart = JSON.parse(localStorage.getItem('glamm_cart')) || [];
  if (cart.length === 0) {
    container.innerHTML = `<p>Your cart is empty. <a href="#" onclick="window.navigateTo('products')">Shop now</a></p>`;
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  container.innerHTML = `
    <div class="checkout-page" style="max-width:600px;margin:40px auto;padding:20px;">
      <h1>Checkout</h1>
      <div class="cart-summary">
        ${cart.map(item => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
            <span>${item.name} x ${item.qty}</span>
            <span>₹${item.price * item.qty}</span>
          </div>
        `).join('')}
        <div style="font-weight:bold;font-size:1.2rem;margin-top:10px;">Total: ₹${total}</div>
      </div>
      <form id="checkout-form">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="checkout-name" required value="${user.displayName || ''}">
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" id="checkout-phone" required value="${user.phoneNumber || ''}">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="checkout-email" required value="${user.email}">
        </div>
        <div class="form-group">
          <label>Shipping Address</label>
          <textarea id="checkout-address" required></textarea>
        </div>
        <button type="submit" class="btn-primary" style="width:100%;padding:14px;">Pay with PhonePe</button>
      </form>
      <div id="payment-status"></div>
    </div>
  `;

  document.getElementById('checkout-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const email = document.getElementById('checkout-email').value;
    const address = document.getElementById('checkout-address').value;
    const orderData = {
      userId: user.uid,
      customerName: name,
      phone,
      email,
      address,
      items: cart,
      total,
      status: 'pending'
    };

    const orderResult = await createOrder(orderData);
    if (!orderResult) {
      document.getElementById('payment-status').innerHTML = `<span style="color:red;">Order creation failed.</span>`;
      return;
    }

    const paymentResult = await createPhonePeOrder(orderResult.id, total, user.email);
    if (paymentResult && paymentResult.paymentLink) {
      window.location.href = paymentResult.paymentLink;
    } else {
      document.getElementById('payment-status').innerHTML = `<span style="color:red;">Payment initiation failed.</span>`;
    }
  });
}