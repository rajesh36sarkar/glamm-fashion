import { formatCurrency } from '../utils/helpers.js';

/**
 * Render a product card HTML
 * @param {Object} product - Product data object
 * @param {string} product.id - Unique ID
 * @param {string} product.name - Product name
 * @param {number} product.price - Current price
 * @param {number} product.originalPrice - Original price (optional)
 * @param {string} product.imageUrl - Image URL
 * @param {string} product.category - Category name
 * @param {string} product.badge - Badge text (bestseller, new, sale)
 * @returns {string} HTML string
 */
export function renderProductCard(product) {
  return `
    <div class="product-card bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group" data-id="${product.id}">
      <div class="relative overflow-hidden">
        <img src="${product.imageUrl || 'assets/images/placeholder.jpg'}" 
             alt="${product.name}" 
             class="w-full aspect-square object-cover group-hover:scale-105 transition duration-500" />
        ${product.badge ? `<span class="absolute top-2 left-2 bg-maroon text-white text-xs font-bold px-3 py-0.5 rounded-full">${product.badge}</span>` : ''}
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
          <button class="quick-view bg-white text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-maroon hover:text-white transition" data-id="${product.id}">Quick View</button>
        </div>
      </div>
      <div class="p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider">${product.category || 'Uncategorized'}</p>
        <h3 class="font-semibold text-lg truncate">${product.name}</h3>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-maroon font-bold">${formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span class="text-gray-400 line-through text-sm">${formatCurrency(product.originalPrice)}</span>` : ''}
        </div>
        <button class="add-cart-btn w-full mt-3 bg-maroon text-white py-2 rounded-full font-semibold hover:bg-[#5a0c2a] transition flex items-center justify-center gap-2" data-id="${product.id}">
          <i class="fa-solid fa-bag-shopping"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}