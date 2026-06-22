import { getProducts, getCategories } from '../services/firestore.js';
import { renderProductCard } from '../components/product-card.js';

// ─── Hardcoded Sample Products (show when Firestore empty) ──
const SAMPLE_PRODUCTS = [
  {
    id: 'sample-1',
    name: 'Rose Gold Elegance Ring',
    price: 499,
    originalPrice: 899,
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23fdf6f0"/%3E%3Ctext x="50" y="120" font-family="Arial" font-size="16" fill="%23b8860b"%3E💍 Rose Gold%3C/text%3E%3Ctext x="30" y="160" font-family="Arial" font-size="12" fill="%23999"%3EElegance Ring%3C/text%3E%3C/svg%3E',
    category: 'Rings',
    badge: 'Bestseller',
    isSample: true
  },
  {
    id: 'sample-2',
    name: 'Pearl Drop Earrings',
    price: 349,
    originalPrice: 599,
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23f0f8ff"/%3E%3Ctext x="50" y="120" font-family="Arial" font-size="16" fill="%23999999"%3E🦪 Pearl Drop%3C/text%3E%3Ctext x="40" y="160" font-family="Arial" font-size="12" fill="%23999"%3EEarrings%3C/text%3E%3C/svg%3E',
    category: 'Earrings',
    badge: 'New',
    isSample: true
  },
  {
    id: 'sample-3',
    name: 'Gold Plated Bracelet Set',
    price: 699,
    originalPrice: 1299,
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23fff8e7"/%3E%3Ctext x="40" y="120" font-family="Arial" font-size="16" fill="%23d4af37"%3E📿 Gold Plated%3C/text%3E%3Ctext x="30" y="160" font-family="Arial" font-size="12" fill="%23999"%3EBracelet Set%3C/text%3E%3C/svg%3E',
    category: 'Bracelets & Bangles',
    badge: 'Sale',
    isSample: true
  },
  {
    id: 'sample-4',
    name: 'Diamond Pendant Necklace',
    price: 899,
    originalPrice: 1599,
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23f5f0ff"/%3E%3Ctext x="40" y="120" font-family="Arial" font-size="16" fill="%234a69d4"%3E💎 Diamond Pendant%3C/text%3E%3Ctext x="40" y="160" font-family="Arial" font-size="12" fill="%23999"%3ENecklace%3C/text%3E%3C/svg%3E',
    category: 'Pendants & Necklaces',
    badge: 'Bestseller',
    isSample: true
  },
  {
    id: 'sample-5',
    name: 'Pearl Anklet',
    price: 249,
    originalPrice: 399,
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23fef3e2"/%3E%3Ctext x="55" y="120" font-family="Arial" font-size="16" fill="%23999999"%3E🦪 Pearl Anklet%3C/text%3E%3Ctext x="40" y="160" font-family="Arial" font-size="12" fill="%23999"%3EAnklet%3C/text%3E%3C/svg%3E',
    category: 'Anklets',
    badge: 'New',
    isSample: true
  },
  {
    id: 'sample-6',
    name: 'Hair Chain with Beads',
    price: 199,
    originalPrice: 299,
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23f8f0e5"/%3E%3Ctext x="40" y="120" font-family="Arial" font-size="16" fill="%23b8860b"%3E📿 Hair Chain%3C/text%3E%3Ctext x="40" y="160" font-family="Arial" font-size="12" fill="%23999"%3EHair Accessories%3C/text%3E%3C/svg%3E',
    category: 'Hair Accessories',
    badge: '',
    isSample: true
  },
  {
    id: 'sample-7',
    name: 'Crystal Stud Earrings',
    price: 299,
    originalPrice: 499,
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23f0f5ff"/%3E%3Ctext x="40" y="120" font-family="Arial" font-size="16" fill="%234a69d4"%3E💎 Crystal Stud%3C/text%3E%3Ctext x="40" y="160" font-family="Arial" font-size="12" fill="%23999"%3EEarrings%3C/text%3E%3C/svg%3E',
    category: 'Earrings',
    badge: 'Sale',
    isSample: true
  },
  {
    id: 'sample-8',
    name: 'Antique Gold Bangles',
    price: 599,
    originalPrice: 999,
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%23fdf0d5"/%3E%3Ctext x="40" y="120" font-family="Arial" font-size="16" fill="%23d4af37"%3E📿 Antique Gold%3C/text%3E%3Ctext x="40" y="160" font-family="Arial" font-size="12" fill="%23999"%3EBangles%3C/text%3E%3C/svg%3E',
    category: 'Bracelets & Bangles',
    badge: 'Bestseller',
    isSample: true
  }
];

// ─── Loading Skeleton ───────────────────────────────────────────
function renderSkeletons(count = 8) {
  return Array(count).fill(`
    <div class="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="w-full aspect-square bg-gray-200"></div>
      <div class="p-4">
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        <div class="h-10 bg-gray-200 rounded-full mt-3"></div>
      </div>
    </div>
  `).join('');
}

export async function renderProducts(params) {
  const container = document.getElementById('page-content');
  const categoryId = params.get('category');
  const search = params.get('search');

  // Show loading skeletons immediately
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="font-heading text-3xl sm:text-4xl text-maroon font-bold">✨ Our Collection</h1>
        <p class="text-gray-500 text-sm mt-1">Timeless elegance for every occasion</p>
      </div>
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <div class="h-10 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        <div class="h-10 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        <div class="h-10 w-20 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${renderSkeletons(8)}
      </div>
    </div>
  `;

  // ─── Fetch real data from Firestore ──────────────────────────
  const [allProducts, categories] = await Promise.all([getProducts(), getCategories()]);

  // ─── Decide: use real data OR hardcoded fallback? ───────────
  const hasRealProducts = allProducts && allProducts.length > 0;
  let productsToShow = hasRealProducts ? allProducts : SAMPLE_PRODUCTS;

  // ─── Apply filters / search ──────────────────────────────────
  let filtered = productsToShow;
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

  // ─── Build filter buttons ─────────────────────────────────────
  const filterButtons = `
    <a href="#products" class="filter-btn px-5 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-maroon hover:text-white transition ${!categoryId && !search ? 'bg-maroon text-white border-maroon' : 'bg-white'}">All</a>
    ${categories.map(c => `
      <a href="#products?category=${c.id}" class="filter-btn px-5 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-maroon hover:text-white transition ${categoryId === c.id ? 'bg-maroon text-white border-maroon' : 'bg-white'}">${c.name}</a>
    `).join('')}
  `;

  // ─── Build product grid ──────────────────────────────────────
  const productGrid = filtered.length > 0
    ? filtered.map(p => renderProductCard(p)).join('')
    : `<p class="text-center text-gray-400 col-span-full py-12">No products found. Try a different filter.</p>`;

  // ─── Render final content ─────────────────────────────────────
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8 animate-fadeUp">
      <!-- Hero banner -->
      <div class="relative bg-gradient-to-r from-maroon/10 to-peach rounded-2xl p-6 sm:p-10 mb-8 text-center overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-maroon/5 rounded-full blur-3xl"></div>
        <div class="relative z-10">
          <h1 class="font-heading text-3xl sm:text-4xl text-maroon font-bold">✨ Our Collection</h1>
          <p class="text-gray-600 text-sm mt-1">${hasRealProducts ? 'Timeless elegance for every occasion' : 'Sample products – connect your database to see real collections'}</p>
          ${search ? `<p class="text-sm text-maroon font-medium mt-2">Showing results for: <strong>"${search}"</strong></p>` : ''}
        </div>
        <!-- Demo Mode Badge (fallback) -->
        ${!hasRealProducts ? `
        <div class="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <i class="fa-regular fa-circle-info"></i> Demo Mode
        </div>
        ` : ''}
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        ${filterButtons}
      </div>

      <!-- Product grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${productGrid}
      </div>

      ${!hasRealProducts ? `
      <div class="text-center text-sm text-gray-400 mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-center gap-3 flex-wrap">
        <i class="fa-regular fa-circle-info text-yellow-600"></i>
        <span>Showing <strong>sample products</strong> with hardcoded images. When you connect Firestore, real products with actual images will appear automatically.</span>
      </div>
      ` : `
      <div class="text-center text-xs text-gray-400 mt-8">
        <i class="fa-regular fa-circle-check text-green-500 mr-1"></i> 
        Connected to Firestore – showing real products
      </div>
      `}
    </div>
  `;
}

// ─── Global Event Delegation ──────────────────────────────────
document.getElementById('page-content').addEventListener('click', async (e) => {
  const target = e.target.closest('button');
  if (!target) return;

  // Quick View
  if (target.classList.contains('quick-view')) {
    const id = target.dataset.id;
    const { openProductModal } = await import('./product-detail.js');
    openProductModal(id);
    return;
  }

  // Add to Cart
  if (target.classList.contains('add-cart-btn')) {
    const card = target.closest('.product-card');
    if (!card) return;
    const id = card.dataset.id;
    const { getProductById } = await import('../services/firestore.js');
    let product = await getProductById(id);
    // If product not found in Firestore, try sample products
    if (!product) {
      product = SAMPLE_PRODUCTS.find(p => p.id === id);
    }
    if (product) {
      const { addToCart, showToast } = await import('../components/cart.js');
      addToCart(product);
      showToast(`${product.name} added to cart!`, 'success');
    }
  }
});