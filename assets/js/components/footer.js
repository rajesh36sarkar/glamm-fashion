export function renderFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  placeholder.innerHTML = `
    <footer>
      <div class="footer-container">
        <div class="footer-col brand-col">
          <img src="assets/images/logo.png" alt="Glamm Fashion Logo" class="footer-logo" onerror="this.style.display='none'">
          <div class="contact-info">
            <p><i class="fa-solid fa-location-dot"></i> Glamm Fashion, Varthur, Bangalore – 560087</p>
            <p><i class="fa-solid fa-envelope"></i> glammfashion2024@gmail.com</p>
            <p><i class="fa-solid fa-clock"></i> 11am – 8pm (Mon–Sat)</p>
          </div>
        </div>
        <div class="footer-col">
          <h4>Quick links</h4>
          <ul>
            <li><a href="#" onclick="window.navigateTo('home'); return false;">Home</a></li>
            <li><a href="#" onclick="window.navigateTo('products'); return false;">Products</a></li>
            <li><a href="#" onclick="window.navigateTo('about'); return false;">About</a></li>
            <li><a href="#" onclick="window.navigateTo('contact'); return false;">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Policies</h4>
          <ul>
            <li><a href="#" onclick="window.navigateTo('policies'); return false;">Privacy Policy</a></li>
            <li><a href="#" onclick="window.navigateTo('policies'); return false;">Shipping Policy</a></li>
            <li><a href="#" onclick="window.navigateTo('policies'); return false;">Return & Refund</a></li>
          </ul>
        </div>
        <div class="footer-col newsletter">
          <h4>Newsletter</h4>
          <p>Subscribe for special offers, free giveaways.</p>
          <form id="newsletter-form">
            <input type="email" id="email-input" placeholder="Enter your email" required>
            <button type="submit">Subscribe</button>
          </form>
          <div id="form-msg"></div>
          <div class="social-links">
            <a href="https://www.facebook.com/" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/glamm_fashion_" target="_blank"><i class="fa-brands fa-instagram"></i></a>
            <a href="mailto:glammfashion2024@gmail.com"><i class="fa-solid fa-envelope"></i></a>
            <a href="tel:+919481605367"><i class="fa-solid fa-phone"></i></a>
          </div>
        </div>
      </div>
    </footer>
  `;

  document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input').value.trim();
    if (!email) return;
    const { addSubscriber } = await import('../services/firestore.js');
    const result = await addSubscriber(email);
    document.getElementById('form-msg').textContent = result ? '✅ Subscribed!' : 'Already subscribed.';
  });
}