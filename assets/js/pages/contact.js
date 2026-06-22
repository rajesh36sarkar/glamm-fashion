import { createContact } from '../services/firestore.js';
import { showToast } from '../components/modal.js';

export function renderContact() {
  document.getElementById('page-content').innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h1 class="font-heading text-4xl text-maroon text-center">Contact Us</h1>
      <p class="text-center text-gray-500 mt-2">We'd love to hear from you. Reach out anytime.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div>
          <div class="flex flex-col gap-4">
            <div class="flex items-start gap-4 bg-peach p-4 rounded-xl">
              <i class="fa-solid fa-location-dot text-2xl text-maroon"></i>
              <div>
                <h4 class="font-bold">Visit Us</h4>
                <p class="text-gray-600 text-sm">123, Fashion Street, Mumbai, India</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-peach p-4 rounded-xl">
              <i class="fa-solid fa-phone text-2xl text-maroon"></i>
              <div>
                <h4 class="font-bold">Call Us</h4>
                <p class="text-gray-600 text-sm">+91 9481605367</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-peach p-4 rounded-xl">
              <i class="fa-solid fa-envelope text-2xl text-maroon"></i>
              <div>
                <h4 class="font-bold">Email</h4>
                <p class="text-gray-600 text-sm">glammfashion2024@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-lg p-6 rounded-xl border-t-4 border-gold">
          <h3 class="font-heading text-2xl text-maroon">Send a Message</h3>
          <p class="text-gray-500 text-sm mb-4">We'll get back to you within 24 hours.</p>
          <form id="contact-form">
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
              <input type="text" id="contact-name" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
              <input type="email" id="contact-email" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
              <textarea id="contact-message" rows="4" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none"></textarea>
            </div>
            <button type="submit" class="w-full bg-maroon text-white py-3 rounded-xl font-bold hover:bg-[#5a0c2a] transition">Send Message</button>
          </form>
          <p id="contact-status" class="mt-3 text-sm"></p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    const result = await createContact({ name, email, message });
    if (result) {
      showToast('Message sent successfully!', 'success');
      document.getElementById('contact-form').reset();
    } else {
      showToast('Failed to send. Please try again.', 'error');
    }
  });
}