import { getCurrentUser } from '../services/auth.js';
import { trackCartAdd } from '../services/analytics.js';

let cart = JSON.parse(localStorage.getItem('glamm_cart')) || [];

export function initCart() {
  updateCartUI();

  const toggleBtn = document.getElementById('cart-toggle');
  const closeBtn = document.getElementById('cart-close');
  const overlay = document.getElementById('cart-overlay');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  if (toggleBtn) toggleBtn.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', proceedCheckout);
}

export function addToCart(product) {
  if (!product || !product.id) return;

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      ...product,
      qty: 1,
      image: product.image || 'assets/images/placeholder.jpg'
    });
  }

  saveCart();
  const user = getCurrentUser();
  trackCartAdd(product.id, user?.uid || null);
  showToast(`${product.name} added to cart!`, 'success');
}

export function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart();
  }
}

export function updateQuantity(index, qty) {
  if (qty < 1) {
    removeFromCart(index);
    return;
  }
  if (cart[index]) {
    cart[index].qty = qty;
    saveCart();
  }
}

export function clearCart() {
  cart = [];
  saveCart();
}

function saveCart() {
  localStorage.setItem('glamm_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const badge = document.getElementById('cart-count-badge');
  if (badge) badge.textContent = totalItems;

  const itemCount = document.getElementById('cart-item-count');
  if (itemCount) itemCount.textContent = totalItems;

  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cart-items-list');
  const totalEl = document.getElementById('cart-total-price');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart"><i class="fa-regular fa-face-frown"></i>Your bag is empty.</div>`;
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    html += `
      <div class="cart-item" data-index="${index}">
        <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.name}">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-price">₹${item.price}</div>
          <div class="item-qty">
            <button class="qty-btn" data-action="dec" data-index="${index}">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-index="${index}">+</button>
          </div>
        </div>
        <span class="remove-item" data-index="${index}">&times;</span>
      </div>
    `;
  });

  container.innerHTML = html;
  if (totalEl) totalEl.textContent = '₹' + total;

  // ─── Event delegation for cart item actions ───
  container.addEventListener('click', function(e) {
    const target = e.target.closest('button, .remove-item');
    if (!target) return;

    const index = parseInt(target.dataset.index, 10);
    if (isNaN(index) || index < 0 || index >= cart.length) return;

    if (target.classList.contains('remove-item')) {
      removeFromCart(index);
      return;
    }

    if (target.classList.contains('qty-btn')) {
      const action = target.dataset.action;
      if (action === 'inc') {
        updateQuantity(index, cart[index].qty + 1);
      } else if (action === 'dec') {
        updateQuantity(index, cart[index].qty - 1);
      }
    }
  });
}

function openCart(e) {
  if (e) e.preventDefault();
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

function closeCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function proceedCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  const user = getCurrentUser();
  if (!user) {
    if (confirm('Please login to proceed with checkout.')) {
      window.openAuthModal();
    }
    return;
  }
  closeCart();
  window.navigateTo('checkout');
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.className = 'toast ' + type + ' show';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ─── Global exports (for inline onclick usage) ───
window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;