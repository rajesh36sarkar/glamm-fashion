import { getProductById, getProducts } from '../services/firestore.js';
import { trackView } from '../services/analytics.js';
import { getCurrentUser } from '../services/auth.js';
import { getImageUrl } from '../utils/helpers.js';

export async function renderProductDetail() {
  const container = document.getElementById('page-content');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    container.innerHTML = `<p class="not-found">Product not found.</p>`;
    return;
  }

  // Show loading skeleton
  container.innerHTML = `
    <div class="product-detail-page">
      <div class="product-detail-grid">
        <div class="product-detail-image skeleton-img"></div>
        <div class="product-detail-info">
          <div class="skeleton-text" style="width:60%;"></div>
          <div class="skeleton-text" style="width:40%;"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
        </div>
      </div>
    </div>
  `;

  const product = await getProductById(productId);
  if (!product) {
    container.innerHTML = `<p class="not-found">Product not found.</p>`;
    return;
  }

  const user = getCurrentUser();
  trackView(productId, user?.uid || null);

  const allProducts = await getProducts();
  const related = allProducts.filter(p => p.category === product.category && p.id !== productId).slice(0, 4);

  const hasOld = product.oldPrice && product.oldPrice > 0;
  const discount = hasOld ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const rating = product.rating || { stars: 4.5, count: 120 };
  const fullStars = Math.floor(rating.stars);
  const hasHalf = rating.stars % 1 >= 0.5;
  let starsHtml = '';
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) starsHtml += '<i class="fa-solid fa-star"></i>';
    else if (i === fullStars && hasHalf) starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    else starsHtml += '<i class="fa-regular fa-star"></i>';
  }

  container.innerHTML = `
    <div class="product-detail-page">
      <div class="product-detail-grid animate-fade-up">
        <div class="product-detail-image">
          <div class="image-zoom">
            <img src="${getImageUrl(product.imageUrl)}" alt="${product.name}" id="detail-main-image">
            <div class="zoom-overlay"><i class="fa-regular fa-expand"></i></div>
          </div>
        </div>
        <div class="product-detail-info">
          <span class="product-category">${product.category}</span>
          <h1>${product.name}</h1>
          <div class="product-rating">
            <span class="stars">${starsHtml}</span>
            <span class="count">(${rating.count} reviews)</span>
          </div>
          <div class="product-price">
            <span class="current">₹${product.price}</span>
            ${hasOld ? `<span class="old">₹${product.oldPrice}</span>` : ''}
            ${hasOld && discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
          </div>
          <div class="product-meta">
            <span><i class="fa-regular fa-circle-check"></i> In stock</span>
            <span><i class="fa-regular fa-tag"></i> SKU: ${product.sku || 'GLM-001'}</span>
          </div>
          <p class="description">${product.description || 'No description available.'}</p>
          <div class="product-actions-detail">
            <button class="btn-add-cart-large" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${getImageUrl(product.imageUrl)}">
              <i class="fa-solid fa-bag-shopping"></i> Add to Cart
            </button>
            <button class="btn-wishlist-detail" data-id="${product.id}">
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
        </div>
      </div>

      ${related.length ? `
        <section class="related-products animate-fade-up" style="animation-delay:0.2s;">
          <h3>You may also like</h3>
          <div class="product-grid">
            ${related.map(p => createProductCard(p)).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `;

  // ─── Events ───
  document.querySelector('.btn-add-cart-large').addEventListener('click', function() {
    window.addToCart({
      id: this.dataset.id,
      name: this.dataset.name,
      price: parseFloat(this.dataset.price),
      image: this.dataset.image
    });
  });

  document.querySelector('.btn-wishlist-detail')?.addEventListener('click', function() {
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
    icon.style.color = icon.classList.contains('fa-solid') ? '#e74c3c' : '';
    if (icon.classList.contains('fa-solid')) {
      import('../services/analytics.js').then(({ trackLike }) => trackLike(product.id));
    }
  });

  // ─── Image zoom on hover ───
  const zoomContainer = document.querySelector('.image-zoom');
  const zoomImg = document.getElementById('detail-main-image');
  if (zoomContainer && zoomImg) {
    zoomContainer.addEventListener('mousemove', (e) => {
      const rect = zoomContainer.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      zoomImg.style.transformOrigin = `${x}% ${y}%`;
      zoomImg.style.transform = 'scale(1.4)';
    });
    zoomContainer.addEventListener('mouseleave', () => {
      zoomImg.style.transform = 'scale(1)';
    });
  }

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

  document.querySelectorAll('.quick-view').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      window.navigateTo('product?id=' + this.dataset.id);
    });
  });
}

// ─── Related product card ───
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