import { getHeroByPage, createContact } from '../services/firestore.js';
import { getImageUrl } from '../utils/helpers.js';

export async function renderContact() {
  const container = document.getElementById('page-content');

  // Show an elegant loading state
  container.innerHTML = `
    <div class="loading-spinner" style="display:flex; justify-content:center; padding: 100px; color: var(--primary-maroon);">
      <i class="fa-solid fa-circle-notch fa-spin fa-2x"></i>
    </div>
  `;

  // Fetch hero data
  const hero = await getHeroByPage('contact');

  // Build the page
  const heroSection = hero ? `
    <section class="contact-hero" style="background-image: url('${getImageUrl(hero.imageUrl)}');">
      <div class="contact-hero-content animate-fade-up">
        <h1>${hero.altText || 'Get In Touch'}</h1>
        <p>We’d love to hear from you – drop us a message today!</p>
      </div>
    </section>
  ` : `
    <section class="contact-hero" style="background: linear-gradient(135deg, #7B113A 0%, #4A0821 100%);">
      <div class="contact-hero-content animate-fade-up">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you – drop us a message today!</p>
      </div>
    </section>
  `;

  container.innerHTML = `
    ${heroSection}

    <section class="contact-section">
      <div class="contact-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>

      <div class="contact-grid">
        
        <div class="contact-info-wrapper">
          <div class="info-card animate-on-scroll" style="transition-delay: 0.1s;">
            <i class="fa-solid fa-location-dot"></i>
            <div>
              <h4>Our Location</h4>
              <p>Varthur, Bangalore – 560087</p>
              <a href="https://maps.google.com/?q=Varthur+Bangalore" target="_blank" class="map-link">
                View on Google Maps <i class="fa-solid fa-arrow-right-long" style="font-size: 0.8rem; width: auto; height: auto; background: none; color: inherit;"></i>
              </a>
            </div>
          </div>
          <div class="info-card animate-on-scroll" style="transition-delay: 0.2s;">
            <i class="fa-solid fa-envelope"></i>
            <div>
              <h4>Email Us</h4>
              <p><a href="mailto:glammfashion2024@gmail.com">glammfashion2024@gmail.com</a></p>
              <span class="small">We reply within 24 hours</span>
            </div>
          </div>
          <div class="info-card animate-on-scroll" style="transition-delay: 0.3s;">
            <i class="fa-solid fa-phone"></i>
            <div>
              <h4>Call Us</h4>
              <p><a href="tel:+919481605367">+91 9481605367</a></p>
              <span class="small">Mon–Sat, 11am – 8pm</span>
            </div>
          </div>
        </div>

        <div class="contact-form-container animate-on-scroll" style="transition-delay: 0.4s;">
          <h3>Send a Message</h3>
          <p class="sub">Fill out the form below and we’ll get back to you shortly.</p>
          <form id="contact-form">
            <div class="form-group floating-label">
              <input type="text" id="contact-name" placeholder=" " required>
              <label for="contact-name">Full Name</label>
            </div>
            <div class="form-group floating-label">
              <input type="email" id="contact-email" placeholder=" " required>
              <label for="contact-email">Email Address</label>
            </div>
            <div class="form-group floating-label">
              <input type="text" id="contact-subject" placeholder=" " required>
              <label for="contact-subject">Subject</label>
            </div>
            <div class="form-group floating-label">
              <textarea id="contact-message" rows="5" placeholder=" " required></textarea>
              <label for="contact-message">Your Message</label>
            </div>
            <button type="submit" class="submit-btn">
              <span>Send Message</span> <i class="fa-regular fa-paper-plane"></i>
            </button>
          </form>
          <div id="contact-form-msg" class="form-msg"></div>
        </div>

      </div>
    </section>
  `;

  // ─── Attach form submit ───
  const form = document.getElementById('contact-form');
  const btn = form.querySelector('.submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const msgEl = document.getElementById('contact-form-msg');

    if (!name || !email || !subject || !message) {
      msgEl.innerHTML = '<span class="error">Please fill out all fields.</span>';
      return;
    }

    // Temporary Loading state on button
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
    btn.disabled = true;

    const result = await createContact({ name, email, subject, message });
    
    btn.innerHTML = originalBtnText;
    btn.disabled = false;

    if (result) {
      msgEl.innerHTML = '<span class="success"><i class="fa-solid fa-check-circle"></i> Message sent successfully!</span>';
      form.reset();
      // Remove success message after 5 seconds
      setTimeout(() => { msgEl.innerHTML = ''; }, 5000);
    } else {
      msgEl.innerHTML = '<span class="error"><i class="fa-solid fa-circle-exclamation"></i> Failed to send. Please try again.</span>';
    }
  });

  // ─── Intersection Observer for scroll animations ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after animating to keep it visible
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}