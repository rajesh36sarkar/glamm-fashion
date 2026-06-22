import { addSubscriber } from '../services/firestore.js';

export async function renderFooter() {
  const placeholder = document.getElementById('footer-placeholder');

  placeholder.innerHTML = `
    <footer class="bg-gray-50 border-t border-gray-200 text-gray-700 pt-12 pb-4 relative overflow-hidden">
      <!-- Subtle decorative line -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Brand Column -->
          <div class="space-y-3">
            <a href="#home" class="inline-block">
              <img src="assets/images/logo.png" alt="Glamm Fashion" class="h-12 sm:h-14 w-auto object-contain" />
            </a>
            <p class="text-sm text-gray-500 max-w-xs leading-relaxed">
              Premium imitation jewellery designed for the modern woman. <br />
              <span class="text-maroon font-semibold">Wear The Elegant.</span>
            </p>
            <div class="flex gap-3 pt-1">
              <a href="#" class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-maroon hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <i class="fa-brands fa-instagram"></i>
              </a>
              <a href="#" class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-maroon hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <i class="fa-brands fa-facebook"></i>
              </a>
              <a href="#" class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-maroon hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <i class="fa-brands fa-youtube"></i>
              </a>
              <a href="#" class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-maroon hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <i class="fa-brands fa-pinterest"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-bold text-gray-800 text-lg mb-4 relative inline-block">
              Quick Links
              <span class="absolute -bottom-1 left-0 w-8 h-0.5 bg-gold rounded-full"></span>
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li><a href="#home" class="text-gray-500 hover:text-maroon transition-all duration-200 flex items-center gap-2 group"><span class="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span> Home</a></li>
              <li><a href="#products" class="text-gray-500 hover:text-maroon transition-all duration-200 flex items-center gap-2 group"><span class="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span> Products</a></li>
              <li><a href="#about" class="text-gray-500 hover:text-maroon transition-all duration-200 flex items-center gap-2 group"><span class="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span> About Us</a></li>
              <li><a href="#contact" class="text-gray-500 hover:text-maroon transition-all duration-200 flex items-center gap-2 group"><span class="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span> Contact</a></li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div>
            <h4 class="font-bold text-gray-800 text-lg mb-4 relative inline-block">
              Customer Service
              <span class="absolute -bottom-1 left-0 w-8 h-0.5 bg-gold rounded-full"></span>
            </h4>
            <ul class="space-y-2.5 text-sm">
              <li><a href="#policies?type=shipping" class="text-gray-500 hover:text-maroon transition-all duration-200 flex items-center gap-2 group"><span class="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span> Shipping Policy</a></li>
              <li><a href="#policies?type=return" class="text-gray-500 hover:text-maroon transition-all duration-200 flex items-center gap-2 group"><span class="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span> Returns & Exchanges</a></li>
              <li><a href="#policies?type=privacy" class="text-gray-500 hover:text-maroon transition-all duration-200 flex items-center gap-2 group"><span class="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span> Privacy Policy</a></li>
              <li><a href="#policies?type=care" class="text-gray-500 hover:text-maroon transition-all duration-200 flex items-center gap-2 group"><span class="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition"></span> Jewellery Care</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h4 class="font-bold text-gray-800 text-lg mb-4 relative inline-block">
              Stay in Touch
              <span class="absolute -bottom-1 left-0 w-8 h-0.5 bg-gold rounded-full"></span>
            </h4>
            <p class="text-sm text-gray-500 mb-3">Get 10% off your first order + exclusive offers.</p>
            <form id="newsletter-form" class="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                id="newsletter-email"
                placeholder="Your email"
                class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all duration-200"
                required
              />
              <button
                type="submit"
                class="bg-maroon text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#5a0c2a] transition-all duration-200 hover:scale-105 hover:shadow-md whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p id="newsletter-msg" class="text-xs mt-2"></p>
            <div class="flex gap-3 mt-4">
              <span class="text-2xl text-gray-400 hover:text-maroon transition-colors"><i class="fa-brands fa-cc-visa"></i></span>
              <span class="text-2xl text-gray-400 hover:text-maroon transition-colors"><i class="fa-brands fa-cc-mastercard"></i></span>
              <span class="text-2xl text-gray-400 hover:text-maroon transition-colors"><i class="fa-brands fa-cc-paypal"></i></span>
              <span class="text-2xl text-gray-400 hover:text-maroon transition-colors"><i class="fa-brands fa-google-pay"></i></span>
              <span class="text-2xl text-gray-400 hover:text-maroon transition-colors"><i class="fa-brands fa-apple-pay"></i></span>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; ${new Date().getFullYear()} <a href="#admin" class="text-maroon font-bold hover:underline">Glamm Fashion</a>. All rights reserved.</p>
          <div class="flex items-center gap-4 mt-2 sm:mt-0 flex-wrap justify-center">
            <a href="#terms" class="hover:text-maroon transition">Terms</a>
            <a href="#policies?type=privacy" class="hover:text-maroon transition">Privacy</a>
            <a href="#contact" class="hover:text-maroon transition">Support</a>
          </div>
        </div>
      </div>

      <!-- Back to Top Button -->
      <button id="back-to-top" class="fixed bottom-6 right-6 z-50 bg-maroon text-white w-10 h-10 rounded-full shadow-lg hover:bg-[#5a0c2a] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center opacity-0 pointer-events-none">
        <i class="fa-solid fa-arrow-up"></i>
      </button>
    </footer>
  `;

  // ─── Newsletter Form ──────────────────────────────────────────
  document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    const result = await addSubscriber(email);
    const msg = document.getElementById('newsletter-msg');
    if (result) {
      msg.textContent = '✅ Subscribed successfully!';
      msg.className = 'text-green-600 text-xs mt-2';
      document.getElementById('newsletter-email').value = '';
    } else {
      msg.textContent = 'You are already subscribed.';
      msg.className = 'text-yellow-600 text-xs mt-2';
    }
  });

  // ─── Back to Top Button ───────────────────────────────────────
  const backBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.remove('opacity-0', 'pointer-events-none');
      backBtn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      backBtn.classList.add('opacity-0', 'pointer-events-none');
      backBtn.classList.remove('opacity-100', 'pointer-events-auto');
    }
  });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}