import { getHeroByPage } from '../services/firestore.js';
import { getImageUrl } from '../utils/helpers.js';

export async function renderAbout() {
  const container = document.getElementById('page-content');

  // Show loading
  container.innerHTML = `
    <div class="loading-spinner">
      <i class="fa-solid fa-spinner fa-spin"></i> Loading...
    </div>
  `;

  // Fetch hero from Firestore (optional)
  const hero = await getHeroByPage('about');
  const heroBg = hero ? getImageUrl(hero.imageUrl) : 'assets/images/about-hero-bg.jpg';

  container.innerHTML = `
    <!-- ===== HERO ===== -->
    <section class="about-hero" style="background-image: url('${heroBg}');">
      <div class="about-hero-overlay">
        <div class="about-hero-content">
          <h1 class="animate-fade-up">About Glamm Fashion</h1>
          <p class="animate-fade-up" style="animation-delay:0.2s;">${hero?.altText || 'Where Elegance Meets Affordability'}</p>
          <div class="hero-badge animate-fade-up" style="animation-delay:0.4s;">
            <span>✨ Since 2022</span>
            <span>🌿 Skin‑Friendly</span>
            <span>⭐ 4.8★ Rated</span>
          </div>
        </div>
      </div>
      <!-- Floating shapes -->
      <div class="hero-shapes">
        <span class="shape s1"></span>
        <span class="shape s2"></span>
        <span class="shape s3"></span>
      </div>
    </section>

    <!-- ===== STORY ===== -->
    <section class="about-story animate-on-scroll">
      <div class="story-grid">
        <div class="story-text">
          <h2>Our Story</h2>
          <div class="story-line"></div>
          <p>Glamm Fashion was born from a simple belief: <strong>every woman deserves to feel elegant without breaking the bank.</strong></p>
          <p>What started as a small passion project in Bangalore has grown into a trusted destination for high‑quality imitation jewellery. We blend contemporary designs with timeless craftsmanship, ensuring each piece tells a story of confidence and grace.</p>
          <div class="story-milestones">
            <div><span>🏆</span> 2,500+ Happy Customers</div>
            <div><span>💎</span> 500+ Unique Designs</div>
            <div><span>🌍</span> Shipped to 15+ Countries</div>
          </div>
        </div>
        <div class="story-image">
          <img src="assets/images/rings.jpg" alt="Glamm Fashion Craftsmanship" loading="lazy">
          <div class="image-badge">Handcrafted with ❤️</div>
        </div>
      </div>
    </section>

    <!-- ===== MISSION, VISION, VALUES ===== -->
    <section class="mv-section">
      <h2 class="section-title animate-on-scroll">Our Core</h2>
      <div class="mv-grid">
        <div class="mv-card animate-on-scroll" style="transition-delay:0.1s;">
          <div class="mv-icon"><i class="fa-solid fa-rocket"></i></div>
          <h3>Mission</h3>
          <p>To make timeless elegance accessible to every woman, by offering premium‑quality jewellery at affordable prices, with a focus on sustainability and ethical craftsmanship.</p>
        </div>
        <div class="mv-card animate-on-scroll" style="transition-delay:0.2s;">
          <div class="mv-icon"><i class="fa-solid fa-eye"></i></div>
          <h3>Vision</h3>
          <p>To become India’s most beloved imitation jewellery brand, celebrated for innovation, trust, and empowering women to express their unique style with confidence.</p>
        </div>
        <div class="mv-card animate-on-scroll" style="transition-delay:0.3s;">
          <div class="mv-icon"><i class="fa-solid fa-heart"></i></div>
          <h3>Values</h3>
          <p>Quality, Transparency, Customer Delight, and a deep respect for art and artisans – these are the pillars that guide everything we do.</p>
        </div>
      </div>
    </section>

    <!-- ===== STATS COUNTER ===== -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-item animate-on-scroll">
          <span class="stat-number" data-target="4">0</span>
          <span class="stat-label">Years of Excellence</span>
        </div>
        <div class="stat-item animate-on-scroll">
          <span class="stat-number" data-target="2500">0</span>
          <span class="stat-label">Happy Customers</span>
        </div>
        <div class="stat-item animate-on-scroll">
          <span class="stat-number" data-target="500">0</span>
          <span class="stat-label">Unique Designs</span>
        </div>
        <div class="stat-item animate-on-scroll">
          <span class="stat-number" data-target="15">0</span>
          <span class="stat-label">Countries Served</span>
        </div>
      </div>
    </section>

    <!-- ===== TEAM ===== -->
    <section class="team-section">
      <h2 class="section-title animate-on-scroll">Meet the Team</h2>
      <div class="team-grid">
        <div class="team-card animate-on-scroll">
          <div class="team-avatar"><i class="fa-solid fa-user-circle"></i></div>
          <h4>Priya Sharma</h4>
          <span>Founder & Creative Director</span>
          <p>With 10+ years in fashion, Priya brings a unique blend of creativity and business acumen.</p>
        </div>
        <div class="team-card animate-on-scroll" style="transition-delay:0.1s;">
          <div class="team-avatar"><i class="fa-solid fa-user-circle"></i></div>
          <h4>Rahul Kumar</h4>
          <span>Operations Head</span>
          <p>Rahul ensures seamless logistics and quality control, making sure every order is perfect.</p>
        </div>
        <div class="team-card animate-on-scroll" style="transition-delay:0.2s;">
          <div class="team-avatar"><i class="fa-solid fa-user-circle"></i></div>
          <h4>Ananya Singh</h4>
          <span>Lead Designer</span>
          <p>Ananya crafts our stunning collections, drawing inspiration from global trends and timeless art.</p>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <section class="testimonials-section">
      <h2 class="section-title animate-on-scroll">What Our Customers Say</h2>
      <div class="testimonial-carousel" id="testimonial-carousel">
        <div class="testimonial-slide active">
          <div class="testimonial-content">
            <div class="stars">★★★★★</div>
            <p>"I absolutely love my new earrings! The quality is exceptional and they look even more beautiful in person. Fast shipping and great packaging too."</p>
            <h5>– Sneha R.</h5>
          </div>
        </div>
        <div class="testimonial-slide">
          <div class="testimonial-content">
            <div class="stars">★★★★★</div>
            <p>"Glamm Fashion is my go‑to for gifting. Every piece is so elegant and well‑made. The customer service is also top‑notch!"</p>
            <h5>– Aisha K.</h5>
          </div>
        </div>
        <div class="testimonial-slide">
          <div class="testimonial-content">
            <div class="stars">★★★★★</div>
            <p>"I’ve ordered multiple times and I’m always impressed. The designs are unique and the prices are unbeatable. Highly recommended!"</p>
            <h5>– Meera P.</h5>
          </div>
        </div>
      </div>
      <div class="carousel-dots">
        <span class="dot active" data-index="0"></span>
        <span class="dot" data-index="1"></span>
        <span class="dot" data-index="2"></span>
      </div>
    </section>
  `;

  // ─── ANIMATION: Intersection Observer ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // ─── COUNTER ANIMATION ───
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        const duration = 1500;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.floor(progress * target);
          entry.target.textContent = value.toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ─── TESTIMONIAL CAROUSEL ───
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval = setInterval(nextSlide, 5000);

  function goToSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(parseInt(dot.dataset.index));
      slideInterval = setInterval(nextSlide, 5000);
    });
  });

  // ─── Add smooth scrolling for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}