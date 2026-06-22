import { getCurrentUser } from '../services/auth.js';
import { createOrder } from '../services/firestore.js';
import { formatCurrency } from '../utils/helpers.js';
import { showToast } from '../components/modal.js';

export async function renderCheckout() {
  const container = document.getElementById('page-content');
  const user = getCurrentUser();
  const cart = JSON.parse(localStorage.getItem('glamm_cart') || '[]');

  // If not logged in, prompt login
  if (!user) {
    container.innerHTML = `
      <div class="max-w-md mx-auto text-center py-16">
        <i class="fa-regular fa-circle-user text-5xl text-gray-300"></i>
        <h3 class="font-heading text-2xl text-maroon mt-4">Please Sign In</h3>
        <p class="text-gray-500 mb-6">You need to be logged in to place an order.</p>
        <button id="checkout-login-btn" class="bg-maroon text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5a0c2a] transition">Sign In</button>
      </div>
    `;
    document.getElementById('checkout-login-btn').addEventListener('click', () => {
      document.getElementById('auth-modal').classList.add('open');
    });
    return;
  }

  // If cart empty
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="max-w-md mx-auto text-center py-16">
        <i class="fa-regular fa-face-frown text-5xl text-gray-300"></i>
        <h3 class="font-heading text-2xl text-maroon mt-4">Your cart is empty</h3>
        <p class="text-gray-500 mb-6">Add some beautiful jewellery and come back.</p>
        <a href="#products" class="bg-maroon text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5a0c2a] transition">Browse Products</a>
      </div>
    `;
    return;
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 599 ? 0 : 49;
  const total = subtotal + shipping;

  // Render checkout form
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h1 class="font-heading text-3xl text-maroon text-center">Checkout</h1>
      <p class="text-center text-gray-500 text-sm mb-8">Fill in your details to complete the order</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Order Summary -->
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 order-2 md:order-1">
          <h3 class="font-heading text-xl text-maroon mb-4">Order Summary</h3>
          <div class="space-y-3 max-h-80 overflow-y-auto">
            ${cart.map(item => `
              <div class="flex items-center gap-3 border-b border-gray-200 pb-3">
                <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg" />
                <div class="flex-1">
                  <p class="font-semibold text-sm">${item.name}</p>
                  <p class="text-xs text-gray-500">Qty: ${item.qty}</p>
                </div>
                <span class="font-bold text-maroon">${formatCurrency(item.price * item.qty)}</span>
              </div>
            `).join('')}
          </div>
          <div class="border-t border-gray-300 mt-4 pt-4 space-y-1 text-sm">
            <div class="flex justify-between"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
            <div class="flex justify-between"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span></div>
            <div class="flex justify-between font-bold text-lg text-maroon border-t border-gray-300 pt-2 mt-2">
              <span>Total</span><span>${formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <!-- Billing Form -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm order-1 md:order-2">
          <h3 class="font-heading text-xl text-maroon mb-4">Shipping Address</h3>
          <form id="checkout-form">
            <div class="grid grid-cols-2 gap-3">
              <div class="mb-3">
                <label class="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                <input type="text" id="checkout-firstname" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                <input type="text" id="checkout-lastname" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
              </div>
            </div>
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
              <input type="email" id="checkout-email" value="${user.email}" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
              <input type="tel" id="checkout-phone" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Address Line 1 *</label>
              <input type="text" id="checkout-address1" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Address Line 2 (optional)</label>
              <input type="text" id="checkout-address2" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="mb-3">
                <label class="block text-sm font-semibold text-gray-700 mb-1">City *</label>
                <input type="text" id="checkout-city" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
              </div>
              <div class="mb-3">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Pincode *</label>
                <input type="text" id="checkout-pincode" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
              </div>
            </div>
            <div class="mb-3">
              <label class="block text-sm font-semibold text-gray-700 mb-1">State *</label>
              <input type="text" id="checkout-state" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold outline-none" />
            </div>

            <!-- Payment Method -->
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
              <div class="flex flex-wrap gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" value="phonepe" checked class="accent-maroon" />
                  <span class="flex items-center gap-1"><i class="fa-solid fa-credit-card"></i> PhonePe</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" value="upi" class="accent-maroon" />
                  <span class="flex items-center gap-1"><i class="fa-solid fa-qrcode"></i> UPI QR</span>
                </label>
              </div>
            </div>

            <!-- UPI QR placeholder -->
            <div id="upi-qr-section" class="hidden bg-gray-50 p-4 rounded-lg text-center mb-4">
              <p class="text-sm text-gray-600">Scan the QR code to pay:</p>
              <div class="inline-block bg-white p-2 rounded shadow mt-2">
                <img src="assets/images/upi-qr.png" alt="UPI QR" class="w-32 h-32 object-contain" />
              </div>
              <p class="text-xs text-gray-400 mt-2">Amount: <span class="font-bold text-maroon">${formatCurrency(total)}</span></p>
            </div>

            <button type="submit" id="place-order-btn" class="w-full bg-maroon text-white py-3 rounded-full font-bold hover:bg-[#5a0c2a] transition flex items-center justify-center gap-2">
              <i class="fa-solid fa-lock"></i> Place Order
            </button>
          </form>
          <p id="checkout-status" class="text-sm text-center mt-3"></p>
        </div>
      </div>
    </div>
  `;

  // Payment method toggle
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const upiSection = document.getElementById('upi-qr-section');
      if (radio.value === 'upi') {
        upiSection.classList.remove('hidden');
      } else {
        upiSection.classList.add('hidden');
      }
    });
  });

  // Form submission
  document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('place-order-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

    const firstName = document.getElementById('checkout-firstname').value;
    const lastName = document.getElementById('checkout-lastname').value;
    const email = document.getElementById('checkout-email').value;
    const phone = document.getElementById('checkout-phone').value;
    const address1 = document.getElementById('checkout-address1').value;
    const address2 = document.getElementById('checkout-address2').value || '';
    const city = document.getElementById('checkout-city').value;
    const pincode = document.getElementById('checkout-pincode').value;
    const state = document.getElementById('checkout-state').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    const fullAddress = `${address1}, ${address2}, ${city}, ${state} - ${pincode}`;

    // Build order object
    const orderData = {
      userId: user.uid,
      customerName: `${firstName} ${lastName}`,
      email,
      phone,
      address: fullAddress,
      items: cart,
      subtotal,
      shipping,
      total,
      paymentMethod,
      status: 'pending',
    };

    try {
      const result = await createOrder(orderData);
      if (result && result.id) {
        // Clear cart
        localStorage.removeItem('glamm_cart');
        // Update cart badge
        const badge = document.getElementById('cart-badge');
        if (badge) badge.textContent = '0';

        if (paymentMethod === 'phonepe') {
          // Redirect to PhonePe (simulate with a success message)
          // In production, you would call a Cloud Function to get payment link
          showToast('Order placed! Redirecting to PhonePe...', 'success');
          // Simulate redirect after a short delay
          setTimeout(() => {
            // Replace with actual PhonePe redirect
            window.location.href = `#dashboard`;
          }, 2000);
        } else {
          // UPI – show success and keep order pending
          showToast('Order placed! Please complete UPI payment.', 'success');
          window.navigateTo('dashboard');
        }
      } else {
        showToast('Failed to place order. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Something went wrong.', 'error');
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-lock"></i> Place Order';
    }
  });
}