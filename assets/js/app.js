import { initCart } from './components/cart.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { initModal } from './components/modal.js';
import { handleRoute } from './utils/router.js';
import { onAuthStateChange } from './services/auth.js';
import { getCategories, getProducts } from './services/firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Pre-fetch data (non-blocking)
  getCategories().catch(() => {});
  getProducts().catch(() => {});

  await renderHeader();
  renderFooter();
  initCart();
  initModal();
  handleRoute();

  // ─── Re‑render route on auth change ───
  onAuthStateChange(() => {
    renderHeader();      // update user icon
    handleRoute();       // refresh current page
  });

  window.addEventListener('hashchange', handleRoute);

  // ─── Ensure modals are closed ───
  document.getElementById('product-modal')?.classList.remove('open');
  document.getElementById('admin-modal')?.classList.remove('open');

  // ─── Search logic ───
  document.getElementById('search-toggle').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('search-modal').classList.add('open');
    document.getElementById('search-input').focus();
  });
  document.getElementById('search-close').addEventListener('click', () => {
    document.getElementById('search-modal').classList.remove('open');
  });
  document.getElementById('search-submit').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
      window.navigateTo('products?search=' + encodeURIComponent(query));
      document.getElementById('search-modal').classList.remove('open');
    }
  });
  document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('search-submit').click();
  });

  console.log('✅ Glamm SPA ready.');
});


// ─── TEMPORARY: Expose firestore for testing ───
window.testFirestore = async function() {
  const { getProducts, getCategories } = await import('./services/firestore.js');
  const products = await getProducts();
  const categories = await getCategories();
  console.log('📦 Products:', products);
  console.log('📂 Categories:', categories);
};

// ============================================================
//  PRELOADER – HIDES AFTER 2.5 SECONDS (SAFETY TIMEOUT)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const countdownEl = document.getElementById('countdownNumber');

  if (!preloader || !countdownEl) {
    console.warn('Preloader elements missing.');
    return;
  }

  document.body.classList.add('loading');

  let count = 100;
  const totalSteps = 100;
  const duration = 2000;
  const intervalMs = duration / totalSteps;

  const timer = setInterval(() => {
    countdownEl.textContent = count;
    if (count === 0) {
      clearInterval(timer);
      hidePreloader();
      return;
    }
    count--;
  }, intervalMs);

  const safetyTimeout = setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      hidePreloader();
      clearInterval(timer);
    }
  }, 2500);

  function hidePreloader() {
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
    clearTimeout(safetyTimeout);
    clearInterval(timer);
  }
});