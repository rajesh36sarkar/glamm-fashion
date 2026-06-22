import { getCategories } from '../services/firestore.js';
import { getCurrentUser, signOutUser } from '../services/auth.js';

let headerInstance = null;

export async function renderHeader() {
  if (headerInstance) return headerInstance;
  
  const placeholder = document.getElementById('header-placeholder');
  const categories = await getCategories();

  // Build category buttons (filter active categories)
  let categoryLinks = categories
    .filter(cat => cat.isActive !== false)
    .map(cat => `
      <a href="#" data-category="${cat.id}" class="category-link">${cat.name}</a>
    `)
    .join('');

  placeholder.innerHTML = `
    <header class="main-header">
      <div class="logo header-logo">
        <a href="#" onclick="window.navigateTo('home'); return false;">
          <img src="assets/images/logo.png" alt="Glamm Fashion Logo" onerror="this.style.display='none'">
        </a>
      </div>
      <nav class="main-nav" id="main-nav">
        <ul>
          <li><a href="#" onclick="window.navigateTo('home'); return false;">Home</a></li>
          <li><a href="#" onclick="window.navigateTo('products'); return false;">Products</a></li>
          <li><a href="#" onclick="window.navigateTo('about'); return false;">About</a></li>
          <li><a href="#" onclick="window.navigateTo('contact'); return false;">Contact</a></li>
          ${getCurrentUser() ? `<li><a href="#" onclick="window.navigateTo('dashboard'); return false;">Dashboard</a></li>` : ''}
        </ul>
      </nav>
      <div class="header-icons">
        <a href="#" id="search-toggle" class="icon-hover"><i class="fa-solid fa-magnifying-glass"></i></a>
        <a href="#" class="icon-hover" id="auth-toggle">
          ${getCurrentUser() ? `<i class="fa-regular fa-user"></i>` : `<i class="fa-regular fa-circle-user"></i>`}
        </a>
        <a href="#" class="cart-icon icon-hover" id="cart-toggle">
          <i class="fa-solid fa-bag-shopping"></i>
          <span class="cart-count" id="cart-count-badge">0</span>
        </a>
        <a href="#" class="mobile-toggle" id="mobile-menu-btn"><i class="fa-solid fa-bars"></i></a>
      </div>
    </header>

    <!-- Category Bar (scrollable on mobile) -->
    <div class="category-bar" id="category-bar">
      <div class="category-bar-inner">
        ${categoryLinks || '<span class="no-categories">No categories yet</span>'}
      </div>
    </div>
  `;

  // ─── Category links: navigate to filtered products ───
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      window.navigateTo('products?category=' + this.dataset.category);
    });
  });

  // ─── Auth toggle ───
  document.getElementById('auth-toggle').addEventListener('click', (e) => {
    e.preventDefault();
    if (getCurrentUser()) {
      if (confirm('Logout?')) {
        signOutUser().then(() => window.location.reload());
      }
    } else {
      window.openAuthModal();
    }
  });

  // ─── Mobile menu toggle ───
  document.getElementById('mobile-menu-btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('main-nav').classList.toggle('active');
  });

  // ─── Close mobile menu on nav link click ───
  document.querySelectorAll('#main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('main-nav').classList.remove('active');
    });
  });

  headerInstance = placeholder.innerHTML;
  return headerInstance;
}