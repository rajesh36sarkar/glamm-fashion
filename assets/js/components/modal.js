import { addToCart, showToast } from './cart.js';
import { signIn, signUp, signInWithGoogle } from '../services/auth.js';
import { getProductById } from '../services/firestore.js';
import { formatCurrency } from '../utils/helpers.js';

export { showToast };

export function initModal() {
  const authModal = document.getElementById('auth-modal');
  const authClose = document.getElementById('auth-close');

  authClose.addEventListener('click', () => authModal.classList.remove('open'));
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.remove('open');
  });

  document.getElementById('switch-to-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.add('active');
  });
  document.getElementById('switch-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
  });

  document.getElementById('login-form-fields').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const result = await signIn(email, password);
    if (result.success) {
      authModal.classList.remove('open');
      showToast('Welcome back!', 'success');
    } else {
      showToast(result.error, 'error');
    }
  });

  document.getElementById('signup-form-fields').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const result = await signUp(firstName, lastName, email, phone, password);
    if (result.success) {
      authModal.classList.remove('open');
      showToast('Account created!', 'success');
    } else {
      showToast(result.error, 'error');
    }
  });

  document.getElementById('google-login-btn').addEventListener('click', async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      authModal.classList.remove('open');
      showToast('Signed in with Google', 'success');
    } else {
      showToast(result.error, 'error');
    }
  });
  document.getElementById('google-signup-btn').addEventListener('click', async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      authModal.classList.remove('open');
      showToast('Signed up with Google', 'success');
    } else {
      showToast(result.error, 'error');
    }
  });

  // Product Modal
  const productModal = document.getElementById('product-modal');
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    productModal.style.display = 'none';
  });
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.style.display = 'none';
  });

  // Admin Modal
  const adminModal = document.getElementById('admin-modal');
  document.getElementById('admin-modal-cancel').addEventListener('click', () => {
    adminModal.classList.remove('open');
  });
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) adminModal.classList.remove('open');
  });
}

export async function openProductModal(productId) {
  const product = await getProductById(productId);
  if (!product) {
    showToast('Product not found', 'error');
    return;
  }

  const modal = document.getElementById('product-modal');
  document.getElementById('modal-image').src = product.imageUrl || 'assets/images/placeholder.jpg';
  document.getElementById('modal-name').textContent = product.name;
  document.getElementById('modal-category').textContent = product.category || 'Uncategorized';
  document.getElementById('modal-current-price').textContent = formatCurrency(product.price);
  document.getElementById('modal-old-price').textContent = product.originalPrice ? formatCurrency(product.originalPrice) : '';
  document.getElementById('modal-discount').textContent = product.originalPrice ? `-${Math.round((1 - product.price / product.originalPrice) * 100)}%` : '';
  document.getElementById('modal-description').textContent = product.description || 'No description available.';
  document.getElementById('modal-meta-category').textContent = product.category || 'N/A';
  document.getElementById('modal-sku').textContent = product.sku || 'N/A';
  document.getElementById('modal-stars').textContent = '★'.repeat(Math.round(product.rating || 4.5));
  document.getElementById('modal-rating-count').textContent = `(${product.reviews || 0})`;
  document.getElementById('modal-badge').textContent = product.badge || 'Bestseller';

  document.getElementById('modal-add-to-cart').onclick = () => {
    addToCart(product);
    modal.style.display = 'none';
    showToast(`${product.name} added to cart!`, 'success');
  };

  modal.style.display = 'flex';
}