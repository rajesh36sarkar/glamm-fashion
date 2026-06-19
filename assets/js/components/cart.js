import { getCurrentUser } from '../services/auth.js';
import { trackCartAdd } from '../services/analytics.js';

let cart = JSON.parse(localStorage.getItem('glamm_cart')) || [];

export function initCart() {
  updateCartUI();
  document.getElementById('cart-toggle').addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });
  document.getElementById('cart-close').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);
  document.getElementById('cart-checkout-btn').addEventListener('click', proceedCheckout);
}

export function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  const user = getCurrentUser();
  trackCartAdd(product.id, user?.uid || null);
  showToast(`${product.name} added to cart!`, 'success');
}

export function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

export function updateQuantity(index, qty) {
  if (qty < 1) return removeFromCart(index);
  cart[index].qty = qty;
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
    totalEl.textContent = '₹0';
    return;
  }
  let html = '';
  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    html += `
      <div class="cart-item">
        <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.name}">
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-price">₹${item.price}</div>
          <div class="item-qty">
            <button class="qty-dec" data-index="${index}">−</button>
            <span>${item.qty}</span>
            <button class="qty-inc" data-index="${index}">+</button>
          </div>
        </div>
        <span class="remove-item" data-index="${index}">&times;</span>
      </div>
    `;
  });
  container.innerHTML = html;
  totalEl.textContent = '₹' + total;

  container.querySelectorAll('.qty-inc, .qty-dec, .remove-item').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      if (this.classList.contains('qty-inc')) {
        updateQuantity(index, cart[index].qty + 1);
      } else if (this.classList.contains('qty-dec')) {
        updateQuantity(index, cart[index].qty - 1);
      } else {
        removeFromCart(index);
      }
    });
  });
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
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
  window.navigateTo('checkout');
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast) return;
  msgEl.textContent = msg;
  toast.className = 'toast ' + type + ' show';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;