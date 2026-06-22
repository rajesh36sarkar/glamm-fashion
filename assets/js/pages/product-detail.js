import { getProductById, getProducts } from '../services/firestore.js';
import { formatCurrency } from '../utils/helpers.js';
import { addToCart, showToast } from '../components/cart.js';
import { openProductModal as openGlobalModal } from '../components/modal.js';

/**
 * Render the full product detail page (for #product?id=...)
 * @param {URLSearchParams} params - URL query parameters
 */
export async function renderProductDetail(params) {
  const container = document.getElementById('page-content');
  const id = params.get('id');

  if (!id) {
    container.innerHTML = `<p class="text-center py-12 text-gray-500">Product ID missing.</p>`;
    return;
  }

  const product = await getProductById(id);
  if (!product) {
    container.innerHTML = `<p class="text-center py-12 text-gray-500">Product not found. <a href="#products" class="text-maroon underline">Browse all products</a></p>`;
    return;
  }

  // Get related products (same category, excluding current)
  const allProducts = await getProducts();
  const related = allProducts
    .filter(p => p.id !== id && p.category === product.category)
    .slice(0, 4);

  // Build the HTML
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8 animate-fadeUp">
      <!-- Breadcrumb -->
      <div class="text-sm text-gray-400 mb-4">
        <a href="#home" class="hover:text-maroon">Home</a> / 
        <a href="#products" class="hover:text-maroon">Products</a> / 
        <span class="text-gray-600">${product.name}</span>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Image -->
        <div class="relative">
          <img src="${product.imageUrl || 'assets/images/placeholder.jpg'}" 
               alt="${product.name}" 
               class="w-full rounded-xl shadow-lg object-cover aspect-square" />
          ${product.badge ? `<span class="absolute top-3 left-3 bg-maroon text-white text-xs font-bold px-3 py-1 rounded-full">${product.badge}</span>` : ''}
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-3">
          <p class="text-sm text-gray-400 uppercase tracking-wider">${product.category || 'Uncategorized'}</p>
          <h1 class="font-heading text-3xl font-bold text-gray-800">${product.name}</h1>
          
          <div class="flex items-center gap-3">
            <span class="text-2xl font-bold text-maroon">${formatCurrency(product.price)}</span>
            ${product.originalPrice ? `<span class="text-gray-400 line-through">${formatCurrency(product.originalPrice)}</span>` : ''}
            ${product.originalPrice ? `<span class="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">-${Math.round((1 - product.price / product.originalPrice) * 100)}%</span>` : ''}
          </div>

          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span><i class="fa-regular fa-star"></i> ${product.rating || 4.5} (${product.reviews || 0} reviews)</span>
            <span><i class="fa-regular fa-eye"></i> ${product.views || 0} views</span>
          </div>

          <p class="text-gray-600 leading-relaxed mt-2">${product.description || 'No description available.'}</p>

          <div class="flex flex-wrap gap-4 mt-2 text-sm">
            <span><strong>SKU:</strong> ${product.sku || 'N/A'}</span>
            <span><strong>Category:</strong> ${product.category || 'N/A'}</span>
          </div>

          <button id="detail-add-cart" 
                  class="mt-4 bg-maroon text-white px-8 py-3 rounded-full font-bold hover:bg-[#5a0c2a] transition flex items-center justify-center gap-3 shadow-lg shadow-maroon/20 hover:-translate-y-0.5">
            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
          </button>
        </div>
      </div>

      <!-- Related Products -->
      ${related.length > 0 ? `
        <div class="mt-16">
          <h3 class="font-heading text-2xl text-center text-maroon mb-6">You May Also Like</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            ${related.map(p => `
              <a href="#product?id=${p.id}" class="block bg-white rounded-xl shadow hover:shadow-lg transition p-3 group">
                <img src="${p.imageUrl || 'assets/images/placeholder.jpg'}" alt="${p.name}" class="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition" />
                <p class="font-semibold mt-2 text-sm truncate">${p.name}</p>
                <p class="text-maroon font-bold text-sm">${formatCurrency(p.price)}</p>
              </a>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Add to Cart button
  document.getElementById('detail-add-cart').addEventListener('click', () => {
    addToCart(product);
    showToast(`${product.name} added to cart!`, 'success');
  });
}

/**
 * Open the product detail modal (used for quick view from product cards)
 * This function delegates to the global modal component.
 * @param {string} id - Product ID
 */
export async function openProductModal(id) {
  // Use the global modal handler from components/modal.js
  await openGlobalModal(id);
}

// Expose for global use (if needed)
window.openProductModal = openProductModal;