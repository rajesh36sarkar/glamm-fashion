import { createContact } from '../services/firestore.js';
import { showToast } from '../components/modal.js';

export function renderContact() {
  const container = document.getElementById('page-content');

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-maroon/90 to-maroon/60 text-white py-16 px-4 text-center">
      <div class="max-w-4xl mx-auto relative z-10">
        <h1 class="font-heading text-4xl sm:text-5xl font-bold mb-2 animate-fadeUp">Get in Touch</h1>
        <p class="text-lg opacity-90 max-w-2xl mx-auto">We’d love to hear from you. Reach out for any queries, custom orders, or just to say hello!</p>
      </div>
      <div class="absolute inset-0 bg-[url('assets/images/contact-bg.jpg')] bg-cover bg-center opacity-20"></div>
    </section>

    <!-- Contact Info Cards -->
    <section class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8 relative z-20">
      <div class="bg-white rounded-xl shadow-lg p-6 text-center hover:-translate-y-2 transition duration-300">
        <div class="w-14 h-14 bg-peach rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa-solid fa-location-dot text-2xl text-maroon"></i>
        </div>
        <h4 class="font-bold text-gray-800">Visit Us</h4>
        <p class="text-gray-600 text-sm mt-1">123, Fashion Street,<br />Mumbai, India</p>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 text-center hover:-translate-y-2 transition duration-300">
        <div class="w-14 h-14 bg-peach rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa-solid fa-phone text-2xl text-maroon"></i>
        </div>
        <h4 class="font-bold text-gray-800">Call Us</h4>
        <p class="text-gray-600 text-sm mt-1">+91 9481605367</p>
        <p class="text-gray-400 text-xs">Mon–Sat, 10 AM – 7 PM</p>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 text-center hover:-translate-y-2 transition duration-300">
        <div class="w-14 h-14 bg-peach rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa-solid fa-envelope text-2xl text-maroon"></i>
        </div>
        <h4 class="font-bold text-gray-800">Email Us</h4>
        <p class="text-gray-600 text-sm mt-1">glammfashion2024@gmail.com</p>
        <p class="text-gray-400 text-xs">We reply within 24 hours</p>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 text-center hover:-translate-y-2 transition duration-300">
        <div class="w-14 h-14 bg-peach rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa-solid fa-clock text-2xl text-maroon"></i>
        </div>
        <h4 class="font-bold text-gray-800">Working Hours</h4>
        <p class="text-gray-600 text-sm mt-1">Mon–Sat: 10:00 – 19:00</p>
        <p class="text-gray-400 text-xs">Sunday: Closed</p>
      </div>
    </section>

    <!-- Map + Form Grid -->
    <section class="max-w-7xl mx-auto px-4 pb-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Map -->
        <div class="order-2 lg:order-1">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden h-96 lg:h-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.275!2d72.8311!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7f1c0c8b8c1%3A0x8a6c0f7d4e7f1b0!2sFashion%20Street%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1712345678901!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style="border:0; min-height: 300px;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Glamm Fashion Location"
            ></iframe>
          </div>
          <div class="mt-4 text-sm text-gray-500 flex items-center gap-2">
            <i class="fa-solid fa-location-dot text-maroon"></i>
            <span>123, Fashion Street, Mumbai, India – 400001</span>
          </div>
        </div>

        <!-- Form -->
        <div class="order-1 lg:order-2">
          <div class="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-t-4 border-gold">
            <h3 class="font-heading text-2xl text-maroon font-bold">Send a Message</h3>
            <p class="text-gray-500 text-sm mb-6">We’ll get back to you within 24 hours.</p>
            <form id="contact-form">
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                <input type="text" id="contact-name" required
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition" />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input type="email" id="contact-email" required
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition" />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Subject (optional)</label>
                <input type="text" id="contact-subject"
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition" />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                <textarea id="contact-message" rows="4" required
                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition resize-y"></textarea>
              </div>
              <button type="submit"
                      class="w-full bg-maroon text-white py-3 rounded-xl font-bold hover:bg-[#5a0c2a] transition flex items-center justify-center gap-2">
                <i class="fa-regular fa-paper-plane"></i> Send Message
              </button>
            </form>
            <p id="contact-status" class="mt-3 text-sm text-center"></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Social & Trust Badges -->
    <section class="bg-peach py-10 px-4 border-t border-gray-200">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="font-heading text-2xl text-maroon mb-4">Connect With Us</h3>
        <div class="flex justify-center gap-6 text-3xl">
          <a href="#" class="text-gray-600 hover:text-maroon transition"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" class="text-gray-600 hover:text-maroon transition"><i class="fa-brands fa-facebook"></i></a>
          <a href="#" class="text-gray-600 hover:text-maroon transition"><i class="fa-brands fa-youtube"></i></a>
          <a href="#" class="text-gray-600 hover:text-maroon transition"><i class="fa-brands fa-pinterest"></i></a>
        </div>
        <div class="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span><i class="fa-regular fa-star text-gold mr-1"></i> 4.8 ★ (500+ reviews)</span>
          <span><i class="fa-regular fa-clock mr-1"></i> Fast response</span>
          <span><i class="fa-regular fa-credit-card mr-1"></i> Secure payment</span>
        </div>
      </div>
    </section>
  `;

  // ─── Form Submission ──────────────────────────────────────────
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;

    const result = await createContact({ name, email, subject, message });
    const status = document.getElementById('contact-status');
    if (result) {
      status.innerHTML = `<span class="text-green-600">✅ Message sent successfully!</span>`;
      document.getElementById('contact-form').reset();
      showToast('Thank you for reaching out!', 'success');
    } else {
      status.innerHTML = `<span class="text-red-600">❌ Failed to send. Please try again.</span>`;
      showToast('Something went wrong.', 'error');
    }
  });
}