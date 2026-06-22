export function renderFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  const currentYear = new Date().getFullYear();

  placeholder.innerHTML = `
    <footer>
      <div class="footer-container">
        <!-- Brand Column -->
        <div class="footer-col brand-col">
          <img src="assets/images/logo.png" alt="Glamm Fashion Logo" class="footer-logo" onerror="this.style.display='none'">
          <p class="brand-tagline">Wear the Elegant</p>
          <div class="contact-info">
            <p><i class="fa-solid fa-location-dot"></i> Varthur, Bangalore – 560087</p>
            <p><i class="fa-solid fa-envelope"></i> glammfashion2024@gmail.com</p>
            <p><i class="fa-solid fa-clock"></i> 11am – 8pm (Mon–Sat)</p>
            <p><i class="fa-solid fa-phone"></i> +91 9481605367</p>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#" onclick="window.navigateTo('home'); return false;">Home</a></li>
            <li><a href="#" onclick="window.navigateTo('products'); return false;">Products</a></li>
            <li><a href="#" onclick="window.navigateTo('about'); return false;">About</a></li>
            <li><a href="#" onclick="window.navigateTo('contact'); return false;">Contact</a></li>
            <li><a href="#" onclick="window.navigateTo('dashboard'); return false;">Dashboard</a></li>
          </ul>
        </div>

        <!-- Policies -->
        <div class="footer-col">
          <h4>Policies</h4>
          <ul>
            <li><a href="#" onclick="window.navigateTo('policies'); return false;">Privacy Policy</a></li>
            <li><a href="#" onclick="window.navigateTo('policies'); return false;">Shipping Policy</a></li>
            <li><a href="#" onclick="window.navigateTo('policies'); return false;">Return & Refund</a></li>
            <li><a href="#" onclick="window.navigateTo('policies'); return false;">Terms of Service</a></li>
          </ul>
        </div>

        <!-- Newsletter & Social -->
        <div class="footer-col newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe for special offers & free giveaways.</p>
          <form id="newsletter-form">
            <input type="email" id="email-input" placeholder="Your email address" required>
            <button type="submit"><i class="fa-regular fa-paper-plane"></i> Subscribe</button>
          </form>
          <div id="form-msg"></div>
          <div class="social-links">
            <a href="https://www.facebook.com/" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/glamm_fashion_" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://www.youtube.com/" target="_blank" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            <a href="mailto:glammfashion2024@gmail.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
            <a href="tel:+919481605367" aria-label="Phone"><i class="fa-solid fa-phone"></i></a>
          </div>
          <!-- Payment Methods -->
          <div class="payment-methods">
            <i class="fa-brands fa-cc-visa"></i>
            <i class="fa-brands fa-cc-mastercard"></i>
            <i class="fa-brands fa-google-pay"></i>
            <i class="fa-brands fa-amazon-pay"></i>
            <i class="fa-solid fa-qrcode"></i>
          </div>
        </div>
      </div>

      <!-- Copyright Bar -->
      <div class="footer-bottom">
        <p>&copy; ${currentYear} <strong>Glamm Fashion</strong>. All rights reserved.</p>
        <p>Made with <i class="fa-solid fa-heart" style="color:#e74c3c;"></i> in Bangalore</p>
      </div>
    </footer>
  `;

  // ─── Newsletter form submission ───
  document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if (!email) return;
    const { addSubscriber } = await import('../services/firestore.js');
    const result = await addSubscriber(email);
    const msgEl = document.getElementById('form-msg');
    msgEl.textContent = result ? '✅ Subscribed!' : '⚠️ Already subscribed.';
    msgEl.style.color = result ? '#2ecc71' : '#f39c12';
    if (result) document.getElementById('email-input').value = '';
  });
}