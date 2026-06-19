import { getHeroByPage } from '../services/firestore.js';
import { getImageUrl } from '../utils/helpers.js';

export async function renderAbout() {
  const container = document.getElementById('page-content');
  const hero = await getHeroByPage('about');
  const heroHtml = hero ? `
    <section class="about-hero" style="background-image: url('${getImageUrl(hero.imageUrl)}');">
      <div class="about-hero-content">
        <h1>About Glamm Fashion</h1>
        <p>${hero.altText || 'Wear the Elegant'}</p>
      </div>
    </section>
  ` : `<div class="page-header"><h1>About Us</h1></div>`;

  container.innerHTML = `
    ${heroHtml}
    <section class="about-story">
      <div class="about-text">
        <h2>Our Story</h2>
        <p>Glamm Fashion is a contemporary jewellery brand specializing in high-quality imitation jewellery. We bridge the gap between expensive fine jewellery and fast-fashion pieces, ensuring every woman can access luxury designs without the luxury price tag.</p>
        <p>Proudly based in Bangalore – the heart of India's fashion and technology hub – we draw inspiration from the city's vibrant culture and forward-thinking spirit.</p>
      </div>
      <div class="about-image">
        <img src="assets/images/rings.jpg" alt="Glamm Fashion Craftsmanship">
      </div>
    </section>
    <section class="values-section">
      <h2>Our Values</h2>
      <div class="commitment-grid">
        <div class="commit-card"><i class="fa-solid fa-gem"></i><h5>Quality First</h5><p>Every piece undergoes rigorous quality checks.</p></div>
        <div class="commit-card"><i class="fa-solid fa-tags"></i><h5>Affordable Luxury</h5><p>Premium aesthetics at budget-friendly prices.</p></div>
        <div class="commit-card"><i class="fa-solid fa-star"></i><h5>Trendsetters</h5><p>We set trends with the latest designs.</p></div>
        <div class="commit-card"><i class="fa-solid fa-leaf"></i><h5>Skin-Friendly</h5><p>Hypoallergenic bases for sensitive skin.</p></div>
      </div>
    </section>
  `;
}