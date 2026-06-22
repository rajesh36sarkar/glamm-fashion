import { getCategories } from '../services/firestore.js';
import { getCurrentUser } from '../services/auth.js';
import { updateCartBadge } from './cart.js';

export async function renderHeader() {
  const placeholder = document.getElementById('header-placeholder');
  const categories = await getCategories();
  const user = getCurrentUser();

  placeholder.innerHTML = `
    <header class="sticky top-0 z-50 bg-peach border-b border-gray-200">
      <div class="bg-maroon text-white text-center text-sm py-1.5 overflow-hidden">
        <div class="flex animate-marquee whitespace-nowrap">
          <span class="mx-8">✨ Free Shipping on orders above ₹599</span>
          <span class="mx-8">📦 100% Authentic Jewellery</span>
          <span class="mx-8">💎 Glamm Fashion – Wear The Elegant</span>
        </div>
      </div>
      <div class="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <a href="#home" class="flex items-center gap-2">
          <img src="assets/images/logo.png" alt="Glamm" class="h-10 sm:h-12" />
        </a>
        <nav class="hidden md:flex items-center gap-6 font-semibold text-sm">
          <a href="#home" class="hover:text-maroon transition">Home</a>
          <a href="#products" class="hover:text-maroon transition">Products</a>
          <a href="#about" class="hover:text-maroon transition">About</a>
          <a href="#contact" class="hover:text-maroon transition">Contact</a>
          ${user ? `<a href="#dashboard" class="hover:text-maroon transition">Dashboard</a>` : ''}
          ${user?.role === 'admin' ? `<a href="#admin" class="hover:text-maroon transition">Admin</a>` : ''}
        </nav>
        <div class="flex items-center gap-4 text-xl">
          <button id="search-toggle" class="hover:text-maroon transition"><i class="fa-solid fa-search"></i></button>
          <button id="cart-toggle" class="relative hover:text-maroon transition">
            <i class="fa-solid fa-bag-shopping"></i>
            <span id="cart-badge" class="absolute -top-2 -right-2 bg-maroon text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full">0</span>
          </button>
          <button id="auth-toggle" class="hover:text-maroon transition"><i class="fa-regular fa-user"></i></button>
          <button id="mobile-menu-toggle" class="md:hidden text-2xl hover:text-maroon transition"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
      <div id="mobile-nav" class="md:hidden hidden bg-white border-t border-gray-100 px-4 py-3">
        <a href="#home" class="block py-2 hover:text-maroon">Home</a>
        <a href="#products" class="block py-2 hover:text-maroon">Products</a>
        <a href="#about" class="block py-2 hover:text-maroon">About</a>
        <a href="#contact" class="block py-2 hover:text-maroon">Contact</a>
        ${user ? `<a href="#dashboard" class="block py-2 hover:text-maroon">Dashboard</a>` : ''}
        ${user?.role === 'admin' ? `<a href="#admin" class="block py-2 hover:text-maroon">Admin</a>` : ''}
      </div>
      <div class="flex overflow-x-auto gap-2 px-4 py-2 bg-gray-50 border-t border-gray-100 scrollbar-hide">
        <a href="#products" class="category-link whitespace-nowrap px-4 py-1 bg-white rounded-full border border-gray-200 text-sm font-medium hover:bg-maroon hover:text-white transition">All</a>
        ${categories.map(c => `
          <a href="#products?category=${c.id}" class="category-link whitespace-nowrap px-4 py-1 bg-white rounded-full border border-gray-200 text-sm font-medium hover:bg-maroon hover:text-white transition">${c.name}</a>
        `).join('')}
      </div>
    </header>
  `;

  // Mobile toggle
  document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.toggle('hidden');
  });

  // Cart toggle
  document.getElementById('cart-toggle').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.toggle('translate-x-0');
    document.getElementById('cart-overlay').classList.toggle('hidden');
  });

  // Auth toggle
  document.getElementById('auth-toggle').addEventListener('click', () => {
    if (getCurrentUser()) {
      window.navigateTo('dashboard');
    } else {
      document.getElementById('auth-modal').classList.add('open');
    }
  });

  updateCartBadge();
}