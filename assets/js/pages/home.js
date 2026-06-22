import { getHeroes, getProducts, getCategories } from '../services/firestore.js';
import { getImageUrl } from '../utils/helpers.js';

let slideInterval = null;
let currentSlide = 0;
let testimonialInterval = null;
let currentTestimonial = 0;

export async function renderHome() {
  const container = document.getElementById('page-content');

  // Show loading spinner
  container.innerHTML = `
    <div class="loading-spinner">
      <i class="fa-solid fa-spinner fa-spin"></i> Loading...
    </div>
  `;

  // Fetch all data in parallel
  const [allHeroes, categories, products] = await Promise.all([
    getHeroes(),
    getCategories(),
    getProducts()
  ]);

  // Filter heroes for 'home' page, fallback to all if none
  let homeHeroes = allHeroes.filter(h => h.page === 'home');
  if (homeHeroes.length === 0) homeHeroes = allHeroes.slice(0, 3);

  const displayProducts = products.slice(0, 6);

  // ---------- HERO CAROUSEL ----------
  const heroSlidesHtml = homeHeroes.map((hero, index) => {
    const isVideo = hero.videoUrl && hero.videoUrl.trim() !== '';
    return `
      <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
        ${isVideo ? `
          <video autoplay muted loop playsinline>
            <source src="${hero.videoUrl}" type="video/mp4">
          </video>
        ` : `
          <img src="${getImageUrl(hero.imageUrl)}" alt="${hero.altText || 'Hero'}" loading="lazy">
        `}
        <div class="hero-overlay">
          <div class="hero-text">
            <h2>${hero.title || 'Glamm Fashion'}</h2>
            <p>${hero.altText || 'Wear the Elegant'}</p>
            <a href="#" onclick="window.navigateTo('products')" class="hero-btn">Shop Now</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const dotsHtml = homeHeroes.map((_, index) => `
    <span class="hero-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
  `).join('');

  const heroHtml = homeHeroes.length > 0 ? `
    <section class="hero-carousel">
      <div class="hero-slides" id="hero-slides">
        ${heroSlidesHtml}
      </div>
      <div class="hero-dots" id="hero-dots">
        ${dotsHtml}
      </div>
      <button class="hero-prev" id="hero-prev"><i class="fa-solid fa-chevron-left"></i></button>
      <button class="hero-next" id="hero-next"><i class="fa-solid fa-chevron-right"></i></button>
    </section>
  ` : `
    <section class="hero-carousel">
      <div class="hero-slides">
        <div class="hero-slide active">
          <img src="assets/images/hero-banner-1.webp" alt="Glamm Fashion">
          <div class="hero-overlay">
            <div class="hero-text">
              <h2>Glamm Fashion</h2>
              <p>Wear the Elegant</p>
              <a href="#" onclick="window.navigateTo('products')" class="hero-btn">Shop Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // ---------- TESTIMONIALS DATA ----------
  const testimonials = [
    {
      name: "Priya S.",
      text: "I absolutely love my new earrings! The quality is exceptional and they look even more beautiful in person.",
      rating: 5
    },
    {
      name: "Aisha K.",
      text: "Glamm Fashion is my go‑to for gifting. Every piece is so elegant and well‑made.",
      rating: 5
    },
    {
      name: "Meera P.",
      text: "I’ve ordered multiple times and I’m always impressed. The designs are unique and the prices are unbeatable.",
      rating: 5
    },
    {
      name: "Ravi M.",
      text: "Fast shipping, great packaging, and the jewellery is stunning. Highly recommended!",
      rating: 5
    }
  ];

  // Build testimonial slides
  const testimonialSlidesHtml = testimonials.map((t, index) => `
    <div class="testimonial-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
      <div class="testimonial-content">
        <div class="stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
        <p>“${t.text}”</p>
        <h5>– ${t.name}</h5>
      </div>
    </div>
  `).join('');

  const testimonialDotsHtml = testimonials.map((_, index) => `
    <span class="testimonial-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
  `).join('');

  // ---------- BUILD PAGE ----------
  container.innerHTML = `
    ${heroHtml}

    <!-- Promotional Banner -->
    <section class="promo-banner animate-on-scroll">
      <div class="promo-content">
        <span>✨ Free Shipping on orders above ₹599</span>
        <span>🌿 Skin‑Friendly Jewellery</span>
        <span>💎 500+ Unique Designs</span>
      </div>
    </section>

    <!-- About Section -->
    <section class="home-about animate-on-scroll">
      <div class="home-about-content">
        <div class="about-text">
          <h2>About Glamm Fashion</h2>
          <p>Glamm Fashion is a contemporary jewellery brand specializing in high‑quality imitation jewellery. We bridge the gap between expensive fine jewellery and fast‑fashion pieces, ensuring every woman can access luxury designs without the luxury price tag.</p>
          <p>Proudly based in Bangalore – the heart of India's fashion and technology hub – we draw inspiration from the city's vibrant culture and forward‑thinking spirit.</p>
          <a href="#" onclick="window.navigateTo('about')" class="btn-primary">Read More</a>
        </div>
        <div class="about-image">
          <img src="assets/images/rings.jpg" alt="Glamm Fashion Craftsmanship" loading="lazy">
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories animate-on-scroll">
      <h3 class="section-title">OUR COLLECTION</h3>
      <div class="category-grid">
        ${categories.map(cat => `
          <div class="category-item" data-category="${cat.id}">
            <div class="img-wrapper"><img src="${getImageUrl(cat.imageUrl)}" alt="${cat.name}" class="cat-img" loading="lazy"></div>
            <h4>${cat.name.toUpperCase()}</h4>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Products -->
    <section class="products-section animate-on-scroll">
      <h3 class="section-title">SHOP NOW</h3>
      <div class="product-grid" id="home-product-grid">
        ${displayProducts.map(p => createProductCard(p)).join('')}
      </div>
    </section>

    <!-- Testimonial Carousel -->
    <section class="home-testimonial animate-on-scroll">
      <h3 class="section-title">What Our Customers Say</h3>
      <div class="testimonial-carousel" id="testimonial-carousel">
        ${testimonialSlidesHtml}
      </div>
      <div class="testimonial-dots" id="testimonial-dots">
        ${testimonialDotsHtml}
      </div>
    </section>
  `;

  // ---------- HERO CAROUSEL LOGIC ----------
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  if (slides.length > 1) {
    const goToSlide = (index) => {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      currentSlide = index;
    };

    const nextSlide = () => {
      goToSlide((currentSlide + 1) % slides.length);
    };

    const prevSlide = () => {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
    };

    // Auto‑play
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);

    if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(slideInterval); nextSlide(); slideInterval = setInterval(nextSlide, 5000); });
    if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(slideInterval); prevSlide(); slideInterval = setInterval(nextSlide, 5000); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        goToSlide(parseInt(dot.dataset.index));
        slideInterval = setInterval(nextSlide, 5000);
      });
    });
  }

  // ---------- TESTIMONIAL CAROUSEL LOGIC ----------
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');

  if (testimonialSlides.length > 1) {
    const goToTestimonial = (index) => {
      testimonialSlides.forEach((s, i) => s.classList.toggle('active', i === index));
      testimonialDots.forEach((d, i) => d.classList.toggle('active', i === index));
      currentTestimonial = index;
    };

    const nextTestimonial = () => {
      goToTestimonial((currentTestimonial + 1) % testimonialSlides.length);
    };

    if (testimonialInterval) clearInterval(testimonialInterval);
    testimonialInterval = setInterval(nextTestimonial, 6000);

    testimonialDots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(testimonialInterval);
        goToTestimonial(parseInt(dot.dataset.index));
        testimonialInterval = setInterval(nextTestimonial, 6000);
      });
    });
  }

  // ---------- CATEGORY CLICKS ----------
  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      window.navigateTo('products?category=' + item.dataset.category);
    });
  });

  // ---------- VIDEO SOUND TOGGLE ----------
  document.querySelectorAll('.hero-slide video').forEach(video => {
    const parent = video.closest('.hero-slide');
    if (parent) {
      const btn = document.createElement('button');
      btn.className = 'sound-btn';
      btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        btn.innerHTML = video.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
      });
      parent.appendChild(btn);
    }
  });

  // ---------- SCROLL ANIMATIONS ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  attachProductEvents();
}

// ---------- PRODUCT CARD ----------
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

// ---------- EVENT ATTACHMENT ----------
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
        import('../services/analytics.js').then(({ trackLike }) => trackLike(this.dataset.id));
      }
    });
  });
}