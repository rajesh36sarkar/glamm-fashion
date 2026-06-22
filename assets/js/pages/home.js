import { getHeroes, getProducts } from '../services/firestore.js';
import { renderProductCard } from '../components/product-card.js';

export async function renderHome() {
  const container = document.getElementById('page-content');
  const [heroes, products] = await Promise.all([getHeroes(), getProducts()]);
  const featured = products.slice(0, 4);

  container.innerHTML = `
    <!-- Hero Carousel -->
    <div class="hero-carousel relative w-full h-[50vh] sm:h-[70vh] overflow-hidden bg-dark">
      <div class="hero-slides relative w-full h-full">
        ${heroes.map((h, i) => `
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

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="font-heading text-3xl text-center text-maroon mb-2">✨ Featured Collection</h2>
      <p class="text-center text-gray-500 text-sm mb-8">Discover our most loved pieces</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${featured.length > 0 ? featured.map(p => renderProductCard(p)).join('') : `
          <div class="col-span-full text-center text-gray-400 py-8">No products available yet.</div>
        `}
      </div>
      <div class="text-center mt-8">
        <a href="#products" class="inline-block border border-maroon text-maroon px-8 py-2 rounded-full font-semibold hover:bg-maroon hover:text-white transition">View All Products</a>
      </div>
    </section>

    <!-- Quick About -->
    <section class="bg-peach py-12 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="font-heading text-3xl text-maroon mb-4">About Glamm Fashion</h2>
        <div class="w-16 h-1 bg-gold mx-auto mb-4"></div>
        <p class="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          We bring you premium imitation jewellery that blends timeless elegance with contemporary design. 
          Every piece is crafted with passion to make you shine on every occasion.
        </p>
        <a href="#about" class="inline-block mt-4 text-maroon font-semibold hover:underline">Learn more →</a>
      </div>
    </section>

    <!-- Testimonial Snippet -->
    <section class="max-w-3xl mx-auto px-4 py-12 text-center">
      <i class="fa-solid fa-quote-left text-4xl text-gold/40"></i>
      <p class="text-lg italic text-gray-600 mt-2">"Absolutely love the quality and designs! Glamm Fashion has become my go‑to for every occasion."</p>
      <p class="font-semibold text-maroon mt-2">– Priya Sharma</p>
      <div class="text-yellow-400 text-lg">★★★★★</div>
    </section>
  `;

  // ─── Hero Carousel Logic ───
  initHeroCarousel(container);
}

/**
 * Initialize auto‑sliding hero carousel
 * @param {HTMLElement} container - The page container
 */
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

  // Next / Prev
  container.querySelector('.hero-prev').addEventListener('click', () => {
    goTo((current - 1 + slides.length) % slides.length);
    resetInterval();
  });
  container.querySelector('.hero-next').addEventListener('click', () => {
    goTo((current + 1) % slides.length);
    resetInterval();
  });

  // Dots click
  dotEls.forEach(d => {
    d.addEventListener('click', () => {
      goTo(parseInt(d.dataset.index));
      resetInterval();
    });
  });

  // Auto slide
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