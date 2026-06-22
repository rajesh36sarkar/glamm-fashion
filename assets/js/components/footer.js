import { addSubscriber } from '../services/firestore.js';

export function renderFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  placeholder.innerHTML = `
    <footer class="bg-dark text-gray-300 pt-12 pb-6 border-t-4 border-gold">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <img src="assets/images/logo.png" alt="Glamm" class="h-12 mb-3" />
          <p class="text-sm text-gray-400">Wear The Elegant – premium imitation jewellery for every occasion.</p>
          <div class="flex gap-3 mt-4">
            <a href="#" class="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-maroon transition"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-maroon transition"><i class="fa-brands fa-facebook"></i></a>
            <a href="#" class="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center hover:bg-maroon transition"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>
        <div>
          <h4 class="text-white font-bold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#home" class="hover:text-gold transition">Home</a></li>
            <li><a href="#products" class="hover:text-gold transition">Products</a></li>
            <li><a href="#about" class="hover:text-gold transition">About Us</a></li>
            <li><a href="#contact" class="hover:text-gold transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-bold mb-4">Customer Service</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#policies?type=shipping" class="hover:text-gold transition">Shipping Policy</a></li>
            <li><a href="#policies?type=return" class="hover:text-gold transition">Return Policy</a></li>
            <li><a href="#policies?type=privacy" class="hover:text-gold transition">Privacy Policy</a></li>
            <li><a href="#policies?type=care" class="hover:text-gold transition">Care Guide</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-bold mb-4">Newsletter</h4>
          <p class="text-sm text-gray-400 mb-3">Subscribe for exclusive offers & updates.</p>
          <form id="newsletter-form" class="flex flex-col sm:flex-row gap-2">
            <input type="email" id="newsletter-email" placeholder="Your email" class="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-gold outline-none" required />
            <button type="submit" class="bg-maroon text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#5a0c2a] transition">Subscribe</button>
          </form>
          <p id="newsletter-msg" class="text-xs mt-2"></p>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
        &copy; ${new Date().getFullYear()} Glamm Fashion. All rights reserved.
      </div>
    </footer>
  `;

  document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    const result = await addSubscriber(email);
    const msg = document.getElementById('newsletter-msg');
    if (result) {
      msg.textContent = '✅ Subscribed successfully!';
      msg.className = 'text-green-400';
    } else {
      msg.textContent = 'You are already subscribed.';
      msg.className = 'text-yellow-400';
    }
    document.getElementById('newsletter-email').value = '';
  });
}