import { getHeroByPage, createContact } from '../services/firestore.js';
import { getImageUrl } from '../utils/helpers.js';

export async function renderContact() {
  const container = document.getElementById('page-content');
  const hero = await getHeroByPage('contact');
  const heroHtml = hero ? `
    <section class="contact-hero" style="background-image: url('${getImageUrl(hero.imageUrl)}');">
      <div class="contact-hero-content">
        <h1>Contact Us</h1>
        <p>${hero.altText || 'We\'d love to hear from you'}</p>
      </div>
    </section>
  ` : `<div class="page-header"><h1>Contact Us</h1></div>`;

  container.innerHTML = `
    ${heroHtml}
    <section class="contact-section">
      <div class="contact-grid">
        <div class="contact-info-wrapper">
          <div class="info-card"><i class="fa-solid fa-location-dot"></i><div><h4>Location</h4><p>Varthur, Bangalore – 560087</p></div></div>
          <div class="info-card"><i class="fa-solid fa-envelope"></i><div><h4>Email</h4><p>glammfashion2024@gmail.com</p></div></div>
          <div class="info-card"><i class="fa-solid fa-phone"></i><div><h4>Call</h4><p>+91 9481605367<br>Mon–Sat: 11am – 8pm</p></div></div>
        </div>
        <div class="contact-form-container">
          <h3>Send us a Message</h3>
          <form id="contact-form">
            <div class="form-group"><label>Full Name</label><input type="text" id="contact-name" required placeholder="Your name"></div>
            <div class="form-group"><label>Email</label><input type="email" id="contact-email" required placeholder="you@example.com"></div>
            <div class="form-group"><label>Subject</label><input type="text" id="contact-subject" required placeholder="Subject"></div>
            <div class="form-group"><label>Message</label><textarea id="contact-message" required placeholder="Your message..."></textarea></div>
            <button type="submit" class="submit-btn">Send Message</button>
          </form>
          <div id="contact-form-msg"></div>
        </div>
      </div>
    </section>
  `;

  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    const result = await createContact({ name, email, subject, message });
    if (result) {
      document.getElementById('contact-form-msg').innerHTML = '<span style="color:green;">✅ Thank you! We\'ll get back to you soon.</span>';
      document.getElementById('contact-form').reset();
    } else {
      document.getElementById('contact-form-msg').innerHTML = '<span style="color:red;">Failed to send. Please try again.</span>';
    }
  });
}