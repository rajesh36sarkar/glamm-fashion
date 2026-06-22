import { getHeroes, getProducts, getCategories } from '../services/firestore.js';
import { renderProductCard } from '../components/product-card.js';

// ─── Sample Products (hardcoded fallback – show when backend empty) ──────
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
  }
];

// ─── Sample Categories (hardcoded fallback) ───────────────────
const SAMPLE_CATEGORIES = [
  { id: 'rings', name: 'Rings', imageUrl: 'data:image/svg+xml,%3Csvg xmlns="../../images/rings.jpg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23fdf6f0"/%3E%3Ctext x="60" y="110" font-family="Arial" font-size="28" fill="%23b8860b"%3E💍%3C/text%3E%3Ctext x="45" y="150" font-family="Arial" font-size="14" fill="%23999"%3ERings%3C/text%3E%3C/svg%3E' },
  { id: 'earrings', name: 'Earrings', imageUrl: 'data:image/svg+xml,%3Csvg xmlns="../../images/earrings.jpeg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f0f8ff"/%3E%3Ctext x="60" y="110" font-family="Arial" font-size="28" fill="%23999999"%3E🦪%3C/text%3E%3Ctext x="45" y="150" font-family="Arial" font-size="14" fill="%23999"%3EEarrings%3C/text%3E%3C/svg%3E' },
  { id: 'bracelets', name: 'Bracelets', imageUrl: 'data:image/svg+xml,%3Csvg xmlns="../../images/bracelets.jpg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23fff8e7"/%3E%3Ctext x="60" y="110" font-family="Arial" font-size="28" fill="%23d4af37"%3E📿%3C/text%3E%3Ctext x="40" y="150" font-family="Arial" font-size="14" fill="%23999"%3EBracelets%3C/text%3E%3C/svg%3E' },
  { id: 'necklaces', name: 'Necklaces', imageUrl: 'data:image/svg+xml,%3Csvg xmlns="../../images/necklace.jpg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f5f0ff"/%3E%3Ctext x="60" y="110" font-family="Arial" font-size="28" fill="%234a69d4"%3E💎%3C/text%3E%3Ctext x="40" y="150" font-family="Arial" font-size="14" fill="%23999"%3ENecklaces%3C/text%3E%3C/svg%3E' }
];

export async function renderHome() {
  const container = document.getElementById('page-content');
  
  // ─── Fetch data from Firestore ──────────────────────────────
  const [heroes, products, categories] = await Promise.all([getHeroes(), getProducts(), getCategories()]);
  
  // ─── Decide: use real data OR fallback? ─────────────────────
  const hasRealProducts = products && products.length > 0;
  const hasRealCategories = categories && categories.length > 0;
  const hasRealHeroes = heroes && heroes.length > 0;
  
  const featured = hasRealProducts ? products.slice(0, 4) : SAMPLE_PRODUCTS;
  const displayCategories = hasRealCategories ? categories.slice(0, 4) : SAMPLE_CATEGORIES;
  const displayHeroes = hasRealHeroes ? heroes : [];

  // ─── Build HTML ──────────────────────────────────────────────
  container.innerHTML = `
    <!-- Hero Carousel -->
    ${displayHeroes.length > 0 ? `
    <div class="hero-carousel relative w-full h-[50vh] sm:h-[70vh] overflow-hidden bg-dark">
      <div class="hero-slides relative w-full h-full">
        ${displayHeroes.map((h, i) => `
          <div class="hero-slide absolute inset-0 transition-opacity duration-1000 ${i === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}">
            <img src="${h.imageUrl}" alt="${h.title}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-center p-4">
              <div>
                <h2 class="font-heading text-3xl sm:text-5xl font-bold">${h.title}</h2>
                <p class="text-sm sm:text-lg mt-2">${h.subtitle || ''}</p>
                <a href="#${h.buttonLink || 'products'}" class="inline-block mt-4 bg-maroon text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5a0c2a] transition">${h.buttonText || 'Shop Now'}</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="hero-prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white w-10 h-10 rounded-full hover:bg-white/40 transition text-2xl z-20">‹</button>
      <button class="hero-next absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white w-10 h-10 rounded-full hover:bg-white/40 transition text-2xl z-20">›</button>
      <div class="hero-dots absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20"></div>
    </div>
    ` : `
    <!-- Fallback Hero (if no hero images in Firestore) -->
    <div class="relative w-full h-[50vh] sm:h-[60vh] bg-gradient-to-r from-maroon to-maroon/70 flex items-center justify-center text-white text-center p-4">
      <div>
        <h1 class="font-heading text-4xl sm:text-6xl font-bold">GLAMM FASHION</h1>
        <p class="text-lg sm:text-xl mt-2 opacity-90">Wear The Elegant</p>
        <a href="#products" class="inline-block mt-6 bg-gold text-maroon px-8 py-3 rounded-full font-bold hover:bg-[#c5a030] transition">Shop Now</a>
      </div>
    </div>
    `}

    <!-- Demo Mode Banner (only when using fallback data) -->
    ${!hasRealProducts ? `
    <div class="bg-yellow-50 border-l-4 border-gold p-4 max-w-7xl mx-auto mt-4 rounded-lg shadow-sm">
      <div class="flex items-center gap-3">
        <i class="fa-regular fa-circle-info text-gold text-xl"></i>
        <div>
          <p class="text-sm text-gray-700"><strong>Demo Mode:</strong> Showing sample products. Connect your Firestore database to display real products.</p>
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Trust Badges -->
    <section class="bg-white py-8 border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div class="flex flex-col items-center group cursor-default">
          <div class="w-12 h-12 bg-peach rounded-full flex items-center justify-center text-2xl text-maroon group-hover:scale-110 transition">🔒</div>
          <h4 class="font-semibold text-sm mt-2">100% Secure</h4>
          <p class="text-xs text-gray-400">Safe payments</p>
        </div>
        <div class="flex flex-col items-center group cursor-default">
          <div class="w-12 h-12 bg-peach rounded-full flex items-center justify-center text-2xl text-maroon group-hover:scale-110 transition">🚚</div>
          <h4 class="font-semibold text-sm mt-2">Free Shipping</h4>
          <p class="text-xs text-gray-400">On orders ₹599+</p>
        </div>
        <div class="flex flex-col items-center group cursor-default">
          <div class="w-12 h-12 bg-peach rounded-full flex items-center justify-center text-2xl text-maroon group-hover:scale-110 transition">⭐</div>
          <h4 class="font-semibold text-sm mt-2">Authentic Quality</h4>
          <p class="text-xs text-gray-400">100% genuine</p>
        </div>
        <div class="flex flex-col items-center group cursor-default">
          <div class="w-12 h-12 bg-peach rounded-full flex items-center justify-center text-2xl text-maroon group-hover:scale-110 transition">↩️</div>
          <h4 class="font-semibold text-sm mt-2">Easy Returns</h4>
          <p class="text-xs text-gray-400">7-day policy</p>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="bg-peach py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="font-heading text-3xl text-center text-maroon">Shop by Category</h2>
        <p class="text-center text-gray-500 text-sm mb-8">Find your perfect piece</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          ${displayCategories.map(cat => `
            <a href="#products?category=${cat.id}" class="group block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <div class="aspect-square overflow-hidden bg-gray-50">
                <img src="${cat.imageUrl || 'assets/images/placeholder.jpg'}" alt="${cat.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div class="p-3 text-center">
                <h4 class="font-semibold text-gray-800 group-hover:text-maroon transition">${cat.name}</h4>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="font-heading text-3xl text-center text-maroon">✨ Featured Collection</h2>
      <p class="text-center text-gray-500 text-sm mb-8">${hasRealProducts ? 'Discover our most loved pieces' : 'Sample products – connect your database'}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${featured.map(p => renderProductCard(p)).join('')}
      </div>
      <div class="text-center mt-8">
        <a href="#products" class="inline-block border border-maroon text-maroon px-8 py-2 rounded-full font-semibold hover:bg-maroon hover:text-white transition">View All Products</a>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="bg-white py-12 px-4 border-t border-gray-100">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-heading text-3xl text-center text-maroon">Why Glamm?</h2>
        <p class="text-center text-gray-500 text-sm mb-10">We're committed to your satisfaction</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div class="text-center group">
            <div class="w-16 h-16 bg-peach rounded-full flex items-center justify-center mx-auto text-3xl text-maroon group-hover:bg-maroon group-hover:text-white transition">💎</div>
            <h4 class="font-bold text-gray-800 mt-3">Premium Quality</h4>
            <p class="text-sm text-gray-500">Every piece is crafted with precision and high-quality materials.</p>
          </div>
          <div class="text-center group">
            <div class="w-16 h-16 bg-peach rounded-full flex items-center justify-center mx-auto text-3xl text-maroon group-hover:bg-maroon group-hover:text-white transition">🌿</div>
            <h4 class="font-bold text-gray-800 mt-3">Ethical Craftsmanship</h4>
            <p class="text-sm text-gray-500">We support skilled artisans and sustainable practices.</p>
          </div>
          <div class="text-center group">
            <div class="w-16 h-16 bg-peach rounded-full flex items-center justify-center mx-auto text-3xl text-maroon group-hover:bg-maroon group-hover:text-white transition">❤️</div>
            <h4 class="font-bold text-gray-800 mt-3">Customer First</h4>
            <p class="text-sm text-gray-500">Your happiness is our priority – we're here 24/7 to help.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="bg-peach py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <i class="fa-solid fa-quote-left text-4xl text-gold/40"></i>
        <div class="mt-4 space-y-8">
          <div class="bg-white rounded-xl p-6 shadow-md">
            <div class="text-yellow-400 text-lg">★★★★★</div>
            <p class="text-gray-600 italic mt-2">"Absolutely love the quality and designs! Glamm Fashion has become my go‑to for every occasion."</p>
            <p class="font-semibold text-maroon mt-2">– Priya Sharma</p>
          </div>
          <div class="bg-white rounded-xl p-6 shadow-md">
            <div class="text-yellow-400 text-lg">★★★★★</div>
            <p class="text-gray-600 italic mt-2">"The packaging was beautiful and the jewellery looks even better than the photos. Highly recommend!"</p>
            <p class="font-semibold text-maroon mt-2">– Ananya Reddy</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="bg-maroon text-white py-12 px-4 text-center">
      <div class="max-w-2xl mx-auto">
        <h2 class="font-heading text-3xl">Get 10% Off Your First Order</h2>
        <p class="text-sm opacity-90 mt-2">Subscribe to our newsletter and get exclusive offers, new arrivals, and styling tips.</p>
        <form id="home-newsletter-form" class="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" id="home-newsletter-email" placeholder="Your email address" class="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold" required />
          <button type="submit" class="bg-gold text-maroon px-6 py-3 rounded-full font-bold hover:bg-[#c5a030] transition">Subscribe</button>
        </form>
        <p id="home-newsletter-msg" class="text-sm mt-3"></p>
      </div>
    </section>
  `;

  // ─── Init Hero Carousel ───────────────────────────────────────
  if (displayHeroes.length > 0) {
    initHeroCarousel(container);
  }

  // ─── Newsletter Form ──────────────────────────────────────────
  document.getElementById('home-newsletter-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('home-newsletter-email').value;
    const { addSubscriber } = await import('../services/firestore.js');
    const result = await addSubscriber(email);
    const msg = document.getElementById('home-newsletter-msg');
    if (result) {
      msg.textContent = '✅ Subscribed successfully! Check your inbox.';
      msg.className = 'text-green-300';
      document.getElementById('home-newsletter-email').value = '';
    } else {
      msg.textContent = 'You are already subscribed.';
      msg.className = 'text-yellow-300';
    }
  });

  // ─── Scroll Animations ────────────────────────────────────────
  const sections = container.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeUp');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });
}

function initHeroCarousel(container) {
  const slides = container.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  const dotsContainer = container.querySelector('.hero-dots');
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = `w-3 h-3 rounded-full transition-all ${i === 0 ? 'bg-white scale-125' : 'bg-white/40'}`;
    dot.dataset.index = i;
    dotsContainer.appendChild(dot);
  });
  const dotEls = dotsContainer.querySelectorAll('span');

  let current = 0;
  let interval;

  function goTo(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('opacity-100', i === index);
      s.classList.toggle('z-10', i === index);
      s.classList.toggle('opacity-0', i !== index);
      s.classList.toggle('z-0', i !== index);
    });
    dotEls.forEach((d, i) => {
      d.classList.toggle('bg-white', i === index);
      d.classList.toggle('scale-125', i === index);
      d.classList.toggle('bg-white/40', i !== index);
    });
    current = index;
  }

  container.querySelector('.hero-prev').addEventListener('click', () => {
    goTo((current - 1 + slides.length) % slides.length);
    resetInterval();
  });
  container.querySelector('.hero-next').addEventListener('click', () => {
    goTo((current + 1) % slides.length);
    resetInterval();
  });
  dotEls.forEach(d => {
    d.addEventListener('click', () => {
      goTo(parseInt(d.dataset.index));
      resetInterval();
    });
  });

  function startInterval() {
    interval = setInterval(() => goTo((current + 1) % slides.length), 5000);
  }
  function resetInterval() {
    clearInterval(interval);
    startInterval();
  }

  const carousel = container.querySelector('.hero-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(interval));
  carousel.addEventListener('mouseleave', startInterval);

  startInterval();
}