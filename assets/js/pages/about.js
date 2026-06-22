export function renderAbout() {
  const container = document.getElementById('page-content');

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-maroon/95 to-maroon/70 text-white py-20 px-4 text-center overflow-hidden">
      <div class="absolute inset-0 bg-[url('assets/images/about-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="max-w-4xl mx-auto relative z-10">
        <span class="inline-block px-4 py-1 border border-gold/50 rounded-full text-xs tracking-widest uppercase mb-4 animate-fadeUp">Our Story</span>
        <h1 class="font-heading text-4xl sm:text-6xl font-bold mb-4 animate-fadeUp" style="animation-delay: 0.1s;">
          Crafting Elegance<br />
          <span class="text-gold">Since 2024</span>
        </h1>
        <p class="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto animate-fadeUp" style="animation-delay: 0.2s;">
          Premium imitation jewellery that blends timeless tradition with contemporary style.
        </p>
        <div class="flex flex-wrap justify-center gap-4 mt-6 animate-fadeUp" style="animation-delay: 0.3s;">
          <span class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/10">
            <i class="fa-regular fa-gem text-gold"></i> 500+ Designs
          </span>
          <span class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/10">
            <i class="fa-regular fa-star text-gold"></i> 4.8 ★ Rating
          </span>
          <span class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/10">
            <i class="fa-regular fa-heart text-gold"></i> 10k+ Happy Customers
          </span>
        </div>
      </div>
    </section>

    <!-- Stats Counter -->
    <section class="bg-maroon text-white py-12 px-4">
      <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div class="stat-item">
          <div class="text-4xl sm:text-5xl font-bold font-heading stat-number" data-target="500">0</div>
          <div class="text-sm opacity-80 mt-1">+ Products</div>
        </div>
        <div class="stat-item">
          <div class="text-4xl sm:text-5xl font-bold font-heading stat-number" data-target="10000">0</div>
          <div class="text-sm opacity-80 mt-1">+ Customers</div>
        </div>
        <div class="stat-item">
          <div class="text-4xl sm:text-5xl font-bold font-heading stat-number" data-target="4.8">0</div>
          <div class="text-sm opacity-80 mt-1">★ Average Rating</div>
        </div>
        <div class="stat-item">
          <div class="text-4xl sm:text-5xl font-bold font-heading stat-number" data-target="15">0</div>
          <div class="text-sm opacity-80 mt-1">Artisans</div>
        </div>
      </div>
    </section>

    <!-- Our Story -->
    <section class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="order-2 md:order-1">
          <span class="text-gold text-sm font-semibold tracking-widest uppercase">Our Journey</span>
          <h2 class="font-heading text-3xl sm:text-4xl text-maroon mt-2">The Glamm Story</h2>
          <div class="w-16 h-1 bg-gold mt-3 mb-5"></div>
          <p class="text-gray-600 leading-relaxed">
            Founded in 2024, Glamm Fashion was born from a passion for beautiful jewellery that doesn't break the bank. 
            We believe every woman deserves to shine – whether at a wedding, a party, or just a regular day.
          </p>
          <p class="text-gray-600 leading-relaxed mt-4">
            Our collections are carefully curated from skilled artisans across India, blending traditional craftsmanship 
            with modern designs. Each piece tells a story of dedication and love for the craft.
          </p>
          <div class="flex flex-wrap gap-4 mt-6">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="fa-regular fa-circle-check text-gold"></i> Ethical sourcing
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="fa-regular fa-circle-check text-gold"></i> Handcrafted quality
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="fa-regular fa-circle-check text-gold"></i> Affordable luxury
            </div>
          </div>
        </div>
        <div class="order-1 md:order-2 relative">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src="assets/images/rings.jpg" alt="About Glamm" class="w-full h-80 object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-maroon/20 to-transparent"></div>
          </div>
          <div class="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 max-w-[180px] hidden sm:block">
            <p class="text-sm font-semibold text-maroon">💎 100% Authentic</p>
            <p class="text-xs text-gray-500">Premium quality jewellery</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="bg-peach py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-heading text-3xl text-center text-maroon mb-2">Our Mission & Vision</h2>
        <p class="text-center text-gray-500 text-sm mb-10">What drives us every day</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl p-8 text-center shadow-lg hover:-translate-y-2 transition duration-300 group">
            <div class="w-20 h-20 bg-peach rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-maroon group-hover:text-white transition">
              <i class="fa-regular fa-compass text-3xl text-maroon group-hover:text-white"></i>
            </div>
            <h3 class="font-heading text-xl text-maroon">Our Mission</h3>
            <p class="text-gray-600 text-sm mt-2">To empower every woman to express her unique style with affordable, high-quality jewellery.</p>
          </div>
          <div class="bg-white rounded-2xl p-8 text-center shadow-lg hover:-translate-y-2 transition duration-300 group">
            <div class="w-20 h-20 bg-peach rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-maroon group-hover:text-white transition">
              <i class="fa-regular fa-eye text-3xl text-maroon group-hover:text-white"></i>
            </div>
            <h3 class="font-heading text-xl text-maroon">Our Vision</h3>
            <p class="text-gray-600 text-sm mt-2">To become India's most loved destination for imitation jewellery, blending tradition with modern trends.</p>
          </div>
          <div class="bg-white rounded-2xl p-8 text-center shadow-lg hover:-translate-y-2 transition duration-300 group">
            <div class="w-20 h-20 bg-peach rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-maroon group-hover:text-white transition">
              <i class="fa-regular fa-handshake text-3xl text-maroon group-hover:text-white"></i>
            </div>
            <h3 class="font-heading text-xl text-maroon">Our Values</h3>
            <p class="text-gray-600 text-sm mt-2">Integrity, craftsmanship, customer delight – these are the pillars we stand on.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="max-w-5xl mx-auto px-4 py-16">
      <h2 class="font-heading text-3xl text-center text-maroon mb-2">Our Milestones</h2>
      <p class="text-center text-gray-500 text-sm mb-10">The journey so far</p>
      <div class="relative">
        <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gold/30"></div>
        <div class="space-y-8">
          <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div class="md:w-1/2 text-right hidden md:block">
              <span class="text-gold font-bold">2024</span>
              <h4 class="font-semibold text-gray-800">Founded</h4>
              <p class="text-sm text-gray-500">Glamm Fashion was born with a vision of affordable elegance.</p>
            </div>
            <div class="w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg">1</div>
            <div class="md:w-1/2 text-left md:hidden">
              <span class="text-gold font-bold">2024</span>
              <h4 class="font-semibold text-gray-800">Founded</h4>
              <p class="text-sm text-gray-500">Glamm Fashion was born with a vision of affordable elegance.</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div class="md:w-1/2 text-left hidden md:block">
              <span class="text-gold font-bold">2024</span>
              <h4 class="font-semibold text-gray-800">First Collection</h4>
              <p class="text-sm text-gray-500">Launched our first collection of 100+ handcrafted designs.</p>
            </div>
            <div class="w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg">2</div>
            <div class="md:w-1/2 text-right md:hidden">
              <span class="text-gold font-bold">2024</span>
              <h4 class="font-semibold text-gray-800">First Collection</h4>
              <p class="text-sm text-gray-500">Launched our first collection of 100+ handcrafted designs.</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div class="md:w-1/2 text-right hidden md:block">
              <span class="text-gold font-bold">2025</span>
              <h4 class="font-semibold text-gray-800">10k+ Customers</h4>
              <p class="text-sm text-gray-500">Reached 10,000 happy customers across India.</p>
            </div>
            <div class="w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg">3</div>
            <div class="md:w-1/2 text-left md:hidden">
              <span class="text-gold font-bold">2025</span>
              <h4 class="font-semibold text-gray-800">10k+ Customers</h4>
              <p class="text-sm text-gray-500">Reached 10,000 happy customers across India.</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div class="md:w-1/2 text-left hidden md:block">
              <span class="text-gold font-bold">2025</span>
              <h4 class="font-semibold text-gray-800">Online Store</h4>
              <p class="text-sm text-gray-500">Launched our full e-commerce platform for seamless shopping.</p>
            </div>
            <div class="w-12 h-12 bg-maroon rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg">4</div>
            <div class="md:w-1/2 text-right md:hidden">
              <span class="text-gold font-bold">2025</span>
              <h4 class="font-semibold text-gray-800">Online Store</h4>
              <p class="text-sm text-gray-500">Launched our full e-commerce platform for seamless shopping.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="bg-peach py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-heading text-3xl text-center text-maroon mb-2">Meet Our Team</h2>
        <p class="text-center text-gray-500 text-sm mb-10">Passionate people behind the brand</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl p-6 text-center shadow-lg hover:-translate-y-2 transition duration-300">
            <div class="w-24 h-24 bg-peach rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-maroon">
              <i class="fa-regular fa-user"></i>
            </div>
            <h4 class="font-bold text-gray-800">Rajesh Sarkar</h4>
            <span class="text-sm text-gold font-semibold">Founder & CEO</span>
            <p class="text-xs text-gray-500 mt-2">Visionary behind Glamm Fashion</p>
          </div>
          <div class="bg-white rounded-2xl p-6 text-center shadow-lg hover:-translate-y-2 transition duration-300">
            <div class="w-24 h-24 bg-peach rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-maroon">
              <i class="fa-regular fa-user"></i>
            </div>
            <h4 class="font-bold text-gray-800">Priya Sharma</h4>
            <span class="text-sm text-gold font-semibold">Creative Director</span>
            <p class="text-xs text-gray-500 mt-2">Designs that inspire</p>
          </div>
          <div class="bg-white rounded-2xl p-6 text-center shadow-lg hover:-translate-y-2 transition duration-300">
            <div class="w-24 h-24 bg-peach rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-maroon">
              <i class="fa-regular fa-user"></i>
            </div>
            <h4 class="font-bold text-gray-800">Amit Verma</h4>
            <span class="text-sm text-gold font-semibold">Operations Head</span>
            <p class="text-xs text-gray-500 mt-2">Ensuring seamless delivery</p>
          </div>
          <div class="bg-white rounded-2xl p-6 text-center shadow-lg hover:-translate-y-2 transition duration-300">
            <div class="w-24 h-24 bg-peach rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-maroon">
              <i class="fa-regular fa-user"></i>
            </div>
            <h4 class="font-bold text-gray-800">Neha Patel</h4>
            <span class="text-sm text-gold font-semibold">Customer Care</span>
            <p class="text-xs text-gray-500 mt-2">Making every customer happy</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial -->
    <section class="max-w-4xl mx-auto px-4 py-16 text-center">
      <i class="fa-solid fa-quote-left text-5xl text-gold/30"></i>
      <p class="text-xl italic text-gray-600 mt-4 max-w-2xl mx-auto">
        "Glamm Fashion has completely transformed my jewellery collection. The quality is exceptional, and the designs are absolutely stunning. I receive compliments every time I wear their pieces!"
      </p>
      <div class="flex items-center justify-center gap-3 mt-4">
        <div class="w-12 h-12 bg-peach rounded-full flex items-center justify-center text-maroon font-bold text-lg">SM</div>
        <div class="text-left">
          <h5 class="font-bold text-gray-800">Sneha Mehta</h5>
          <span class="text-sm text-gray-500">Loyal Customer</span>
          <div class="text-yellow-400 text-sm">★★★★★</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-maroon text-white py-16 px-4 text-center">
      <div class="max-w-3xl mx-auto">
        <h2 class="font-heading text-3xl sm:text-4xl font-bold">Ready to Shine?</h2>
        <p class="text-lg opacity-90 mt-2">Explore our collection and find your perfect piece.</p>
        <a href="#products" class="inline-block mt-6 bg-gold text-maroon px-8 py-3 rounded-full font-bold hover:bg-[#c5a030] transition hover:-translate-y-1 shadow-lg">
          Shop Now <i class="fa-solid fa-arrow-right ml-2"></i>
        </a>
      </div>
    </section>
  `;

  // ─── Animated Counter ──────────────────────────────────────────
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const isFloat = target % 1 !== 0;
      const duration = 2000;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = eased * target;
        counter.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = isFloat ? target.toFixed(1) : target;
        }
      };
      requestAnimationFrame(update);
    });
  };

  // Trigger counter animation when stats are visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.bg-maroon');
  if (statsSection) observer.observe(statsSection);

  // ─── Scroll-triggered fade animations ──────────────────────
  const fadeElements = document.querySelectorAll('.stat-item, .bg-white.rounded-2xl, .flex.flex-col.md\\:flex-row');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeObserver.observe(el);
  });
}