export function renderAbout() {
  document.getElementById('page-content').innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h1 class="font-heading text-4xl text-maroon text-center">About Glamm Fashion</h1>
      <p class="text-center text-gray-500 mt-2 max-w-2xl mx-auto">Crafted with passion, designed for elegance.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 items-center">
        <div>
          <h2 class="font-heading text-3xl text-maroon">Our Story</h2>
          <div class="w-16 h-1 bg-gold mt-2 mb-4"></div>
          <p class="text-gray-600 leading-relaxed">Founded in 2024, Glamm Fashion brings you premium imitation jewellery that combines timeless elegance with contemporary design. Every piece is carefully curated to make you shine on every occasion.</p>
          <p class="text-gray-600 leading-relaxed mt-4">We believe in quality, affordability, and sustainability. Our collections are sourced from skilled artisans who pour their heart into each creation.</p>
        </div>
        <div class="rounded-xl overflow-hidden shadow-lg">
          <img src="assets/images/rings.jpg" alt="About us" class="w-full h-64 object-cover" />
        </div>
      </div>

      <!-- Mission & Vision -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
        <div class="bg-peach p-6 rounded-xl text-center">
          <i class="fa-regular fa-compass text-4xl text-gold"></i>
          <h3 class="font-heading text-xl text-maroon mt-3">Our Mission</h3>
          <p class="text-gray-600 mt-2">To empower every woman to express her unique style with affordable, high-quality jewellery.</p>
        </div>
        <div class="bg-peach p-6 rounded-xl text-center">
          <i class="fa-regular fa-eye text-4xl text-gold"></i>
          <h3 class="font-heading text-xl text-maroon mt-3">Our Vision</h3>
          <p class="text-gray-600 mt-2">To become India's most loved destination for imitation jewellery, blending tradition with modern trends.</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 bg-maroon text-white p-8 rounded-xl">
        <div class="text-center">
          <div class="text-3xl font-bold">500+</div>
          <div class="text-sm opacity-80">Products</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">10k+</div>
          <div class="text-sm opacity-80">Happy Customers</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">4.8★</div>
          <div class="text-sm opacity-80">Average Rating</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">15+</div>
          <div class="text-sm opacity-80">Artisans</div>
        </div>
      </div>
    </div>
  `;
}