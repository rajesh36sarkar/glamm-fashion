import { getHeroByPage, getProducts, getCategories } from '../services/firestore.js';
import { getImageUrl } from '../utils/helpers.js';

export async function renderHome() {
  const container = document.getElementById('page-content');

  // Show loading spinner immediately
  container.innerHTML = `
    <div class="loading-spinner">
      <i class="fa-solid fa-spinner fa-spin"></i> Loading...
    </div>
  `;

  // Fetch all data in parallel
  const [hero, categories, products] = await Promise.all([
    getHeroByPage('home'),
    getCategories(),
    getProducts()
  ]);

  const heroHtml = hero ? `
    <section class="hero">
      ${hero.videoUrl ? `
        <div class="hero-video-container">
          <video id="hero-video" autoplay muted loop playsinline>
            <source src="${hero.videoUrl}" type="video/mp4">
          </video>
          <button id="sound-toggle" class="sound-btn"><i class="fa-solid fa-volume-xmark"></i></button>
        </div>
      ` : `
        <img src="${getImageUrl(hero.imageUrl)}" alt="${hero.altText || 'Hero'}" class="hero-image">
      `}
    </section>
  ` : `
    <section class="hero">
      <img src="assets/images/hero-banner-1.webp" alt="Glamm Fashion" class="hero-image">
    </section>
  `;

  const displayProducts = products.slice(0, 6);

  container.innerHTML = `
    ${heroHtml}
    <section class="categories">
      <h3 class="section-title">OUR COLLECTION</h3>
      <div class="category-grid">
        ${categories.map(cat => `
          <div class="category-item" data-category="${cat.id}">
            <div class="img-wrapper"><img src="${getImageUrl(cat.imageUrl)}" alt="${cat.name}" class="cat-img"></div>
            <h4>${cat.name.toUpperCase()}</h4>
          </div>
        `).join('')}
      </div>
    </section>
    <section class="products-section">
      <h3 class="section-title">SHOP NOW</h3>
      <div class="product-grid" id="home-product-grid">
        ${displayProducts.map(p => createProductCard(p)).join('')}
      </div>
    </section>
  `;

  // ---- Event Listeners ----
  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      window.navigateTo('products?category=' + item.dataset.category);
    });
  });

  const video = document.getElementById('hero-video');
  const soundBtn = document.getElementById('sound-toggle');
  if (video && soundBtn) {
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      soundBtn.innerHTML = video.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
    });
  }

  attachProductEvents();
}

// ---------- helper functions (unchanged) ----------
function createProductCard(product) {
  const hasOld = product.oldPrice && product.oldPrice > 0;
  const discount = hasOld ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  let badge = '';
  if (product.badge === 'bestseller') badge = `<span class="product-badge bestseller">⭐ Bestseller</span>`;
  else if (product.badge === 'new') badge = `<span class="product-badge new">✨ New</span>`;
  else if (hasOld && discount >= 20) badge = `<span class="product-badge sale">🔥 ${discount}% OFF</span>`;

  const rating = product.rating || { stars: 4.5, count: 120 };
  const fullStars = Math.floor(rating.stars);
  const hasHalf = rating.stars % 1 >= 0.5;
  let starsHtml = '';
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) starsHtml += '<i class="fa-solid fa-star"></i>';
    else if (i === fullStars && hasHalf) starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    else starsHtml += '<i class="fa-regular fa-star"></i>';
  }

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-img-wrapper">
        <img src="${getImageUrl(product.imageUrl)}" alt="${product.name}" loading="lazy">
        ${badge}
        <div class="product-actions">
          <button class="quick-btn quick-view" data-id="${product.id}"><i class="fa-regular fa-eye"></i> Quick View</button>
          <button class="quick-btn quick-wishlist" data-id="${product.id}"><i class="fa-regular fa-heart"></i></button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${starsHtml}</span>
          <span class="count">(${rating.count})</span>
        </div>
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

function attachProductEvents() {
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
  document.querySelectorAll('.quick-wishlist').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const icon = this.querySelector('i');
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
      icon.style.color = icon.classList.contains('fa-solid') ? '#e74c3c' : '';
      if (icon.classList.contains('fa-solid')) {
        const { trackLike } = import('../services/analytics.js');
        trackLike(this.dataset.id);
      }
    });
  });
}