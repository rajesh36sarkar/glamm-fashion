import { formatCurrency } from '../utils/helpers.js';

export function initCart() {
  renderCartItems();
  setupCartEvents();
}

export function getCart() {
  return JSON.parse(localStorage.getItem('glamm_cart') || '[]');
}

export function saveCart(cart) {
  localStorage.setItem('glamm_cart', JSON.stringify(cart));
  renderCartItems();
  updateCartBadge();
}

function renderCartItems() {
  const cart = getCart();
  const list = document.getElementById('cart-items-list');
  const totalEl = document.getElementById('cart-total-price');
  const countEl = document.getElementById('cart-item-count');

  if (cart.length === 0) {
    list.innerHTML = `<div class="text-center text-gray-400 py-16"><i class="fa-regular fa-face-frown text-4xl block mb-3"></i>Your bag is empty.</div>`;
    totalEl.textContent = '₹0';
    countEl.textContent = '0';
    return;
  }

  let html = '';
  let total = 0;
  let count = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;
    html += `
      <div class="cart-item flex gap-3 items-center border-b border-gray-100 py-3">
        <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg bg-gray-100" />
        <div class="flex-1">
          <div class="font-semibold text-sm">${item.name}</div>
          <div class="text-xs text-gray-500">${item.category || ''}</div>
          <div class="flex items-center gap-2 mt-1">
            <button class="qty-minus w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-sm" data-index="${index}">-</button>
            <span class="text-sm font-bold">${item.qty}</span>
            <button class="qty-plus w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-sm" data-index="${index}">+</button>
            <span class="text-maroon font-bold ml-2">${formatCurrency(item.price * item.qty)}</span>
          </div>
        </div>
        <button class="remove-item text-gray-400 hover:text-red-500 text-xl" data-index="${index}">&times;</button>
      </div>
    `;
  });

  list.innerHTML = html;
  totalEl.textContent = formatCurrency(total);
  countEl.textContent = count;
}

function setupCartEvents() {
  document.getElementById('cart-items-list').addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;
    const index = parseInt(target.dataset.index);
    const cart = getCart();

    if (target.classList.contains('qty-minus')) {
      if (cart[index].qty > 1) {
        cart[index].qty--;
      } else {
        cart.splice(index, 1);
      }
    } else if (target.classList.contains('qty-plus')) {
      cart[index].qty++;
    } else if (target.classList.contains('remove-item')) {
      cart.splice(index, 1);
    }
    saveCart(cart);
  });

  document.getElementById('cart-close').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.remove('translate-x-0');
    document.getElementById('cart-overlay').classList.add('hidden');
  });
  document.getElementById('cart-overlay').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.remove('translate-x-0');
    document.getElementById('cart-overlay').classList.add('hidden');
  });

  document.getElementById('cart-checkout-btn').addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    window.navigateTo('checkout');
    document.getElementById('cart-sidebar').classList.remove('translate-x-0');
    document.getElementById('cart-overlay').classList.add('hidden');
  });
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || 'assets/images/placeholder.jpg',
      category: product.category,
      qty: 1
    });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart`, 'success');
}

export function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  msgEl.textContent = msg;
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3 rounded-full shadow-xl font-semibold flex items-center gap-4 text-sm sm:text-base ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

export function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = count;
}