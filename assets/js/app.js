import { initCart } from './components/cart.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';   // import footer
import { initModal } from './components/modal.js';
import { handleRoute } from './utils/router.js';
import { onAuthStateChange } from './services/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderHeader();
  renderFooter();        // initial render
  initCart();
  initModal();
  handleRoute();

  // ─── Re‑render header & footer on auth change ───
  onAuthStateChange(() => {
    renderHeader();
    renderFooter();      // now the footer will show Admin link if user is admin
    handleRoute();
  });

  window.addEventListener('hashchange', handleRoute);

  // Search logic
  document.getElementById('search-toggle').addEventListener('click', () => {
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

  // Preloader
  const preloader = document.getElementById('preloader');
  let count = 100;
  const timer = setInterval(() => {
    document.getElementById('countdownNumber').textContent = count;
    if (count === 0) {
      clearInterval(timer);
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
    }
    count--;
  }, 20);
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
    clearInterval(timer);
  }, 2500);
});