export function renderTerms() {
  const container = document.getElementById('page-content');

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="text-center mb-8">
        <i class="fa-solid fa-file-contract text-5xl text-gold"></i>
        <h1 class="font-heading text-4xl text-maroon mt-2">Terms & Conditions</h1>
        <p class="text-gray-500 text-sm">Last updated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 sm:p-8 border-t-4 border-gold space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">1. Acceptance of Terms</h2>
          <p>By using the Glamm Fashion website and services, you agree to these Terms & Conditions. If you do not agree, please do not use our site.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">2. Intellectual Property</h2>
          <p>All content on this site – including text, images, logos, designs, and product descriptions – is the property of Glamm Fashion and protected by copyright laws. You may not reproduce, distribute, or use any content without prior written permission.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">3. User Accounts</h2>
          <p>To place an order, you may need to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. Notify us immediately of any unauthorized use.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">4. Product Information & Pricing</h2>
          <p>We strive to display accurate product images, descriptions, and prices. However, errors may occur. We reserve the right to correct any errors and to cancel orders if pricing or product information is inaccurate.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">5. Orders & Payment</h2>
          <p>When you place an order, you agree to pay the total amount shown, including taxes and shipping. We accept payments via PhonePe, UPI, and other methods as displayed at checkout. Orders are confirmed only after payment is successfully processed.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">6. Shipping & Delivery</h2>
          <p>We ship within India. Estimated delivery times are provided but are not guaranteed. Delays due to courier services or unforeseen circumstances are beyond our control. Once shipped, you will receive a tracking number.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">7. Returns & Exchanges</h2>
          <p>We accept returns within 7 days of delivery for unused items in original packaging. Exchanges are subject to availability. Please refer to our Return Policy for detailed instructions.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">8. Limitation of Liability</h2>
          <p>Glamm Fashion is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the purchase price of the product.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">9. Privacy Policy</h2>
          <p>Your privacy is important to us. Please review our <a href="#policies?type=privacy" class="text-maroon underline">Privacy Policy</a> to understand how we collect, use, and protect your personal information.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">10. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.</p>
        </section>

        <section>
          <h2 class="font-heading text-xl text-maroon font-bold mb-2">11. Changes to Terms</h2>
          <p>We may update these Terms & Conditions from time to time. The updated version will be posted here with a new date. Continued use of the site constitutes acceptance of the updated terms.</p>
        </section>

        <div class="bg-peach p-4 rounded-lg text-center text-sm text-gray-600 mt-4">
          <i class="fa-regular fa-envelope mr-1"></i> For any questions, please <a href="#contact" class="text-maroon font-semibold hover:underline">contact us</a>.
        </div>
      </div>
    </div>
  `;
}