import { getProducts, getCategories } from '../services/firestore.js';
import { getImageUrl } from '../utils/helpers.js';

export async function renderProducts() {
  const container = document.getElementById('page-content');
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('category');
  const searchQuery = urlParams.get('search');

  const categories = await getCategories();
  let products = await getProducts();

  if (categoryId) {
    products = products.filter(p => p.categoryId === categoryId); // use categoryId
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  container.innerHTML = `
    <div class="page-header">
      <h1>Our Collection</h1>
      <p>Discover our premium jewellery</p>
    </div>
    <section class="products-section">
      <div class="product-filters" id="products-filter-buttons">
        <button class="filter-btn active" data-filter="all">All</button>
        ${categories.map(cat => `<button class="filter-btn" data-filter="${cat.id}">${cat.name}</button>`).join('')}
      </div>
      <div class="product-grid" id="products-product-grid">
        ${products.map(p => createProductCard(p)).join('')}
      </div>
    </section>
  `;

  // Filter
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
        } else {
          card.style.display = (card.dataset.categoryId === filter) ? 'block' : 'none';
        }
      });
    });
  });

  attachProductEvents();
}

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
    <div class="product-card" data-id="${product.id}" data-category-id="${product.categoryId || ''}">
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