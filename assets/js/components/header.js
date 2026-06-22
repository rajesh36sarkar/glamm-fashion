import { getCategories } from '../services/firestore.js';
import { getCurrentUser } from '../services/auth.js';
import { getCart } from './cart.js';

export async function renderHeader() {
  const placeholder = document.getElementById('header-placeholder');
  const categories = await getCategories();
  const user = getCurrentUser();

  // Preheader items
  const marqueeItems = [
    '✨ Free Shipping on orders above ₹599',
    '📦 100% Authentic Jewellery',
    '💎 Glamm Fashion – Wear The Elegant',
    '⭐ 4.8 ★ (10k+ happy customers)'
  ];

  // Build the marquee track: duplicate items to create seamless loop
  const itemsHTML = [...marqueeItems, ...marqueeItems].map(text =>
    `<span>${text}</span>`
  ).join('');

  placeholder.innerHTML = `
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <!-- Preheader -->
      <div class="bg-gradient-to-r from-maroon to-maroon/90 text-white text-center text-xs sm:text-sm py-1.5 preheader-container">
        <div class="marquee-track">
          ${itemsHTML}
        </div>
      </div>

      <!-- Main header -->
      <div class="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        <!-- Logo -->
        <a href="#home" class="flex items-center gap-2 group">
          <img src="assets/images/logo.png" alt="Glamm Fashion" class="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8 font-medium text-sm lg:text-base">
          <a href="#home" class="nav-link relative text-gray-700 hover:text-maroon transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Home</a>
          <a href="#products" class="nav-link relative text-gray-700 hover:text-maroon transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Products</a>
          <a href="#about" class="nav-link relative text-gray-700 hover:text-maroon transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 hover:after:w-full">About</a>
          <a href="#contact" class="nav-link relative text-gray-700 hover:text-maroon transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Contact</a>
          ${user ? `<a href="#dashboard" class="nav-link relative text-gray-700 hover:text-maroon transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Dashboard</a>` : ''}
          ${user?.role === 'admin' ? `<a href="#admin" class="nav-link relative text-maroon font-semibold hover:text-[#5a0c2a] transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300 hover:after:w-full">Admin</a>` : ''}
        </nav>

        <!-- Icons -->
        <div class="flex items-center gap-3 sm:gap-4 text-xl sm:text-2xl">
          <button id="search-toggle" class="text-gray-600 hover:text-maroon transition-colors duration-300 hover:scale-110 transform" aria-label="Search">
            <i class="fa-solid fa-search"></i>
          </button>
          <button id="cart-toggle" class="relative text-gray-600 hover:text-maroon transition-colors duration-300 hover:scale-110 transform" aria-label="Cart">
            <i class="fa-solid fa-bag-shopping"></i>
            <span id="cart-badge" class="cart-badge">0</span>
          </button>
          <button id="auth-toggle" class="text-gray-600 hover:text-maroon transition-colors duration-300 hover:scale-110 transform" aria-label="Account">
            <i class="fa-regular fa-user"></i>
          </button>
          <!-- Hamburger -->
          <button id="mobile-menu-toggle" class="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5 group" aria-label="Menu">
            <span class="hamburger-line block w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out group-[.active]:rotate-45 group-[.active]:translate-y-2"></span>
            <span class="hamburger-line block w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out group-[.active]:opacity-0"></span>
            <span class="hamburger-line block w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ease-in-out group-[.active]:-rotate-45 group-[.active]:-translate-y-2"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div id="mobile-nav" class="md:hidden hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-4 shadow-lg transform transition-all duration-300 ease-in-out">
        <div class="flex flex-col space-y-3 text-center">
          <a href="#home" class="mobile-link py-2 text-gray-700 hover:text-maroon font-medium transition-colors duration-200 border-b border-gray-50">Home</a>
          <a href="#products" class="mobile-link py-2 text-gray-700 hover:text-maroon font-medium transition-colors duration-200 border-b border-gray-50">Products</a>
          <a href="#about" class="mobile-link py-2 text-gray-700 hover:text-maroon font-medium transition-colors duration-200 border-b border-gray-50">About</a>
          <a href="#contact" class="mobile-link py-2 text-gray-700 hover:text-maroon font-medium transition-colors duration-200 border-b border-gray-50">Contact</a>
          ${user ? `<a href="#dashboard" class="mobile-link py-2 text-gray-700 hover:text-maroon font-medium transition-colors duration-200 border-b border-gray-50">Dashboard</a>` : ''}
          ${user?.role === 'admin' ? `<a href="#admin" class="mobile-link py-2 text-maroon font-semibold hover:text-[#5a0c2a] transition-colors duration-200 border-b border-gray-50">Admin</a>` : ''}
          ${!user ? `<a href="#home" id="mobile-login-btn" class="mobile-link py-2 text-maroon font-semibold hover:text-[#5a0c2a] transition-colors duration-200">Sign In</a>` : ''}
        </div>
      </div>

      <!-- Category pills -->
      <div class="flex overflow-x-auto gap-2 px-4 py-2 bg-gray-50/80 border-t border-gray-100 scrollbar-hide">
        <a href="#products" class="category-pill whitespace-nowrap px-4 py-1.5 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-maroon hover:text-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">All</a>
        ${categories.map(c => `
          <a href="#products?category=${c.id}" class="category-pill whitespace-nowrap px-4 py-1.5 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-maroon hover:text-white transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">${c.name}</a>
        `).join('')}
      </div>
    </header>
  `;

  // ─── Hamburger Toggle ─────────────────────────────────────────
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
    menuToggle.classList.toggle('active');
  });

  // ─── Auto‑close mobile nav on link click ─────────────────────
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
      menuToggle.classList.remove('active');
    });
  });

  // ─── Cart Toggle ──────────────────────────────────────────────
  document.getElementById('cart-toggle').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.toggle('translate-x-0');
    document.getElementById('cart-overlay').classList.toggle('hidden');
  });

  // ─── Auth Toggle ──────────────────────────────────────────────
  document.getElementById('auth-toggle').addEventListener('click', () => {
    if (getCurrentUser()) {
      window.navigateTo('dashboard');
    } else {
      document.getElementById('auth-modal').classList.add('open');
    }
  });

  // ─── Mobile Login ─────────────────────────────────────────────
  const mobileLogin = document.getElementById('mobile-login-btn');
  if (mobileLogin) {
    mobileLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('auth-modal').classList.add('open');
      mobileNav.classList.add('hidden');
      menuToggle.classList.remove('active');
    });
  }

  // ─── Update Cart Badge ────────────────────────────────────────
  updateCartBadge();
}

// ─── Update Cart Badge Function ──────────────────────────────
export function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const cart = JSON.parse(localStorage.getItem('glamm_cart') || '[]');
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count;
  if (count > 0) {
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }
}