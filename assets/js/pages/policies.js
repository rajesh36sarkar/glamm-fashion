export function renderPolicies() {
  const container = document.getElementById('page-content');

  container.innerHTML = `
    <div class="policies-wrapper animate-fade-up">
      <div class="page-header">
        <h1>Our Policies</h1>
        <p>Transparency, trust, and quality – our commitment to you</p>
        <span class="last-updated">📅 Last Updated: June 2025</span>
      </div>

      <div class="policies-grid">
        <!-- 1. Privacy Policy -->
        <div class="policy-card animate-on-scroll">
          <div class="policy-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <h2>Privacy Policy</h2>
          <p>We value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.</p>
          <ul>
            <li><strong>Information we collect:</strong> Name, email, phone, shipping address, payment details (securely processed by our payment partners).</li>
            <li><strong>How we use it:</strong> To process orders, send updates, improve our services, and comply with legal requirements.</li>
            <li><strong>Data security:</strong> We use industry‑standard encryption and never store your payment credentials on our servers.</li>
            <li><strong>Your rights:</strong> You can request access, correction, or deletion of your data at any time.</li>
          </ul>
          <p class="policy-footer">By using our site, you consent to this policy.</p>
        </div>

        <!-- 2. Terms of Service -->
        <div class="policy-card animate-on-scroll" style="transition-delay:0.1s;">
          <div class="policy-icon"><i class="fa-solid fa-scale-balanced"></i></div>
          <h2>Terms of Service</h2>
          <p>Welcome to Glamm Fashion! By using our website and services, you agree to the following terms:</p>
          <ul>
            <li><strong>Intellectual Property:</strong> All content, images, and designs are the property of Glamm Fashion and may not be used without permission.</li>
            <li><strong>Product Descriptions:</strong> We strive for accuracy, but please note that colours may vary slightly due to screen displays.</li>
            <li><strong>Pricing:</strong> Prices are subject to change without notice. We reserve the right to correct any errors.</li>
            <li><strong>Disclaimer:</strong> Our imitation jewellery is crafted with high‑quality materials but is not intended for medical use or allergy treatment.</li>
          </ul>
          <p class="policy-footer">If you have questions, please <a href="#" onclick="window.navigateTo('contact')">contact us</a>.</p>
        </div>

        <!-- 3. Shipping & Delivery -->
        <div class="policy-card animate-on-scroll" style="transition-delay:0.2s;">
          <div class="policy-icon"><i class="fa-solid fa-truck-fast"></i></div>
          <h2>Shipping & Delivery</h2>
          <p>We want you to receive your jewellery as quickly and safely as possible.</p>
          <ul>
            <li><strong>Free Shipping:</strong> On all prepaid orders above ₹599. A flat ₹40 shipping fee applies to orders below ₹599.</li>
            <li><strong>Delivery Time:</strong> Typically 5–7 business days within India. Metro cities may receive sooner.</li>
            <li><strong>Tracking:</strong> You’ll receive a tracking link via email and SMS once your order ships.</li>
            <li><strong>International Shipping:</strong> Currently, we ship only within India.</li>
            <li><strong>Courier Partners:</strong> We use trusted carriers like Shiprocket, Delhivery, and Indian Post.</li>
          </ul>
          <p class="policy-footer">Orders are processed within 24 hours (excluding weekends and holidays).</p>
        </div>

        <!-- 4. Return & Refund -->
        <div class="policy-card animate-on-scroll" style="transition-delay:0.3s;">
          <div class="policy-icon"><i class="fa-solid fa-rotate-left"></i></div>
          <h2>Return & Refund</h2>
          <p>We want you to love your purchase. If you’re not completely satisfied, we’re here to help.</p>
          <ul>
            <li><strong>Eligibility:</strong> Items must be unused, with original tags and packaging, within 7 days of delivery.</li>
            <li><strong>Return Process:</strong> Contact our support team with your order ID and reason. We’ll arrange a pickup or provide a return address.</li>
            <li><strong>Refund:</strong> Once we receive and inspect the return, we’ll issue a refund to your original payment method within 5–7 business days.</li>
            <li><strong>Exchange:</strong> You may exchange for a different size or design – just let us know.</li>
            <li><strong>Non‑returnable:</strong> Earrings (for hygiene reasons) and customised pieces cannot be returned.</li>
          </ul>
          <p class="policy-footer">For any issues, email us at <a href="mailto:glammfashion2024@gmail.com">glammfashion2024@gmail.com</a>.</p>
        </div>

        <!-- 5. Disclaimer / Product Care -->
        <div class="policy-card animate-on-scroll" style="transition-delay:0.4s;">
          <div class="policy-icon"><i class="fa-regular fa-gem"></i></div>
          <h2>Jewellery Care & Disclaimer</h2>
          <p>Our imitation jewellery is designed to be stylish and durable, but proper care ensures longevity.</p>
          <ul>
            <li><strong>Hypoallergenic:</strong> Most of our pieces are nickel‑free and lead‑free, suitable for sensitive skin.</li>
            <li><strong>Care Instructions:</strong> Avoid contact with perfumes, lotions, water, and chemicals. Store in a dry pouch.</li>
            <li><strong>Quality Guarantee:</strong> We stand behind our craftsmanship. If an item breaks within 30 days (not due to misuse), we’ll replace it.</li>
            <li><strong>Disclaimer:</strong> Our products are fashion jewellery – not fine jewellery. They are not intended for medical or therapeutic use.</li>
          </ul>
          <p class="policy-footer">We recommend removing jewellery before sleeping, bathing, or exercising.</p>
        </div>

        <!-- 6. Payment & Security -->
        <div class="policy-card animate-on-scroll" style="transition-delay:0.5s;">
          <div class="policy-icon"><i class="fa-solid fa-lock"></i></div>
          <h2>Payment & Security</h2>
          <p>We use industry‑leading security to protect your payment information.</p>
          <ul>
            <li><strong>Accepted Payments:</strong> UPI, Credit/Debit Cards, Net Banking, and PhonePe.</li>
            <li><strong>Secure Checkout:</strong> All transactions are encrypted via SSL. We do not store your card details.</li>
            <li><strong>PhonePe Integration:</strong> For payments, you may be redirected to PhonePe’s secure payment gateway.</li>
            <li><strong>Fraud Prevention:</strong> We monitor orders for suspicious activity. If flagged, we may contact you for verification.</li>
          </ul>
          <p class="policy-footer">Your trust is our priority – we’re committed to safe and seamless shopping.</p>
        </div>
      </div>

      <!-- Bottom message -->
      <div class="policies-bottom animate-on-scroll">
        <p>If you have any questions about our policies, please <a href="#" onclick="window.navigateTo('contact')">get in touch</a> with our support team.</p>
        <p class="small">Glamm Fashion – Wear the Elegant ✨</p>
      </div>
    </div>
  `;

  // ─── Intersection Observer for scroll animations ───
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}