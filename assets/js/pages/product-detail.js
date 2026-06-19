import { getProductById, getProducts } from '../services/firestore.js';
import { trackView } from '../services/analytics.js';
import { getCurrentUser } from '../services/auth.js';
import { getImageUrl } from '../utils/helpers.js';

export async function renderProductDetail() {
  const container = document.getElementById('page-content');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) {
    container.innerHTML = `<p>Product not found.</p>`;
    return;
  }

  const product = await getProductById(productId);
  if (!product) {
    container.innerHTML = `<p>Product not found.</p>`;
    return;
  }

  const user = getCurrentUser();
  trackView(productId, user?.uid || null);

  const allProducts = await getProducts();
  const related = allProducts.filter(p => p.category === product.category && p.id !== productId).slice(0, 4);

  const hasOld = product.oldPrice && product.oldPrice > 0;
  const discount = hasOld ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  container.innerHTML = `
    <div class="product-detail-page">
      <div class="product-detail-grid">
        <div class="product-detail-image">
          <img src="${getImageUrl(product.imageUrl)}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
          <span class="product-category">${product.category}</span>
          <h1>${product.name}</h1>
          <div class="product-rating">
            <span class="stars">★★★★★</span>
            <span class="count">(${product.rating?.count || 0})</span>
          </div>
          <div class="product-price">
            <span class="current">₹${product.price}</span>
            ${hasOld ? `<span class="old">₹${product.oldPrice}</span>` : ''}
            ${hasOld && discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
          </div>
          <p class="description">${product.description || 'No description available.'}</p>
          <button class="btn-add-cart-large" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${getImageUrl(product.imageUrl)}">
            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
          </button>
        </div>
      </div>
      ${related.length ? `
        <section class="related-products">
          <h3>You may also like</h3>
          <div class="product-grid">
            ${related.map(p => createProductCard(p)).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `;

  document.querySelector('.btn-add-cart-large').addEventListener('click', function() {
    window.addToCart({
      id: this.dataset.id,
      name: this.dataset.name,
      price: parseFloat(this.dataset.price),
      image: this.dataset.image
    });
  });

  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      window.addToCart({
        id: this.dataset.id,
        name: this.dataset.name,
        price: parseFloat(this.dataset.price),
        image: this.dataset.image
      });
    });
  });
}

function createProductCard(product) {
  const hasOld = product.oldPrice && product.oldPrice > 0;
  const discount = hasOld ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  let badge = '';
  if (product.badge === 'bestseller') badge = `<span class="product-badge bestseller">⭐ Bestseller</span>`;
  else if (product.badge === 'new') badge = `<span class="product-badge new">✨ New</span>`;
  else if (hasOld && discount >= 20) badge = `<span class="product-badge sale">🔥 ${discount}% OFF</span>`;

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-img-wrapper">
        <img src="${getImageUrl(product.imageUrl)}" alt="${product.name}" loading="lazy">
        ${badge}
        <div class="product-actions">
          <button class="quick-btn quick-view" data-id="${product.id}"><i class="fa-regular fa-eye"></i> Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">
          <span class="current-price">₹${product.price}</span>
          ${hasOld ? `<span class="old-price">₹${product.oldPrice}</span>` : ''}
        </div>
        <button class="btn-add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${getImageUrl(product.imageUrl)}">
          <i class="fa-solid fa-bag-shopping"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}