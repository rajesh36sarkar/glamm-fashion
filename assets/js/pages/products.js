import { getProducts, getCategories } from '../services/firestore.js';
import { renderProductCard } from '../components/product-card.js';

/**
 * Render the Products page
 * - Category filter buttons (from Firestore)
 * - Search query support (via ?search=...)
 * - Product grid using shared product-card component
 * - Event delegation for Quick View and Add to Cart
 */
export async function renderProducts(params) {
  const container = document.getElementById('page-content');
  const [allProducts, categories] = await Promise.all([getProducts(), getCategories()]);

  const categoryId = params.get('category');
  const search = params.get('search');

  let filtered = allProducts;
  if (categoryId) {
    filtered = filtered.filter(p => p.categoryId === categoryId || p.category === categoryId);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="font-heading text-3xl text-maroon text-center mb-2">Our Collection</h1>
      <p class="text-center text-gray-500 text-sm mb-6">Discover timeless elegance</p>

      <!-- Category filters -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <a href="#products" class="filter-btn px-4 py-1.5 rounded-full border border-gray-300 text-sm font-medium hover:bg-maroon hover:text-white transition ${!categoryId && !search ? 'bg-maroon text-white border-maroon' : 'bg-white'}">All</a>
        ${categories.map(c => `
          <a href="#products?category=${c.id}" class="filter-btn px-4 py-1.5 rounded-full border border-gray-300 text-sm font-medium hover:bg-maroon hover:text-white transition ${categoryId === c.id ? 'bg-maroon text-white border-maroon' : 'bg-white'}">${c.name}</a>
        `).join('')}
      </div>

      ${search ? `<p class="text-sm text-gray-500 mb-4 text-center">Showing results for: <strong>"${search}"</strong></p>` : ''}

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${filtered.length > 0 ? filtered.map(p => renderProductCard(p)).join('') : `
          <p class="text-center text-gray-400 col-span-full py-12">No products found. Try a different filter.</p>
        `}
      </div>
    </div>
  `;
}

// ─── Event Delegation for Quick View & Add to Cart ───
document.getElementById('page-content').addEventListener('click', async (e) => {
  const target = e.target.closest('button');
  if (!target) return;

  // Quick View
  if (target.classList.contains('quick-view')) {
    const id = target.dataset.id;
    // Import modal function dynamically to avoid circular imports
    const { openProductModal } = await import('./product-detail.js');
    openProductModal(id);
    return;
  }

  // Add to Cart
  if (target.classList.contains('add-cart-btn')) {
    const card = target.closest('.product-card');
    if (!card) return;
    const id = card.dataset.id;
    // Fetch product data from Firestore (or use cached)
    const { getProductById } = await import('../services/firestore.js');
    const product = await getProductById(id);
    if (product) {
      const { addToCart, showToast } = await import('../components/cart.js');
      addToCart(product);
      showToast(`${product.name} added to cart!`, 'success');
    }
  }
});