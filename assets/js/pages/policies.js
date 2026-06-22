export function renderPolicies(params) {
  const type = params.get('type') || 'general';
  const container = document.getElementById('page-content');

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      icon: 'fa-solid fa-shield-halved',
      content: `
        <p>At Glamm Fashion, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Data Collection:</strong> We collect name, email, phone, and address for order processing.</li>
          <li><strong>Data Usage:</strong> We use your data to fulfill orders, send updates, and improve our services.</li>
          <li><strong>Data Security:</strong> We employ industry-standard encryption and security measures.</li>
          <li><strong>Cookies:</strong> We use cookies to enhance user experience and analyze traffic.</li>
          <li><strong>Third-Party Sharing:</strong> We never sell or share your data with third parties for marketing.</li>
        </ul>
        <p class="mt-2">If you have any questions, contact us at glammfashion2024@gmail.com.</p>
      `
    },
    shipping: {
      title: 'Shipping Policy',
      icon: 'fa-solid fa-truck-fast',
      content: `
        <p>We ship across India with reliable courier partners. Here's what you need to know:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Processing Time:</strong> Orders are processed within 1-2 business days.</li>
          <li><strong>Delivery Time:</strong> Estimated delivery in 3-7 business days.</li>
          <li><strong>Shipping Charges:</strong> Free shipping on orders above ₹599. Otherwise ₹49 flat.</li>
          <li><strong>Tracking:</strong> A tracking link will be emailed once shipped.</li>
          <li><strong>International:</strong> Currently we ship only within India.</li>
        </ul>
      `
    },
    return: {
      title: 'Return & Exchange',
      icon: 'fa-solid fa-rotate-left',
      content: `
        <p>We want you to love your purchase. If not, we offer easy returns:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><strong>Return Window:</strong> 7 days from delivery date.</li>
          <li><strong>Conditions:</strong> Items must be unused, in original packaging.</li>
          <li><strong>Process:</strong> Contact us with your order number to initiate return.</li>
          <li><strong>Refund:</strong> Refund will be processed within 5-7 business days.</li>
          <li><strong>Exchange:</strong> Exchange for different size/design available on request.</li>
        </ul>
      `
    },
    care: {
      title: 'Jewellery Care Guide',
      icon: 'fa-solid fa-spa',
      content: `
        <p>Keep your imitation jewellery shining with these simple tips:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li>Avoid contact with perfumes, lotions, and water.</li>
          <li>Store in a dry, cool place away from sunlight.</li>
          <li>Gently wipe with a soft cloth after each use.</li>
          <li>Avoid dropping or bending delicate pieces.</li>
          <li>Keep each piece separately to prevent scratches.</li>
        </ul>
        <p class="mt-2">With proper care, your jewellery will remain beautiful for years.</p>
      `
    },
    general: {
      title: 'Policies',
      icon: 'fa-solid fa-file-lines',
      content: `
        <p>Welcome to Glamm Fashion. Please review our key policies below:</p>
        <ul class="list-disc pl-5 mt-2 space-y-1">
          <li><a href="#policies?type=privacy" class="text-maroon underline">Privacy Policy</a></li>
          <li><a href="#policies?type=shipping" class="text-maroon underline">Shipping Policy</a></li>
          <li><a href="#policies?type=return" class="text-maroon underline">Return & Exchange</a></li>
          <li><a href="#policies?type=care" class="text-maroon underline">Jewellery Care Guide</a></li>
        </ul>
        <p class="mt-4">For any further queries, please <a href="#contact" class="text-maroon underline">contact us</a>.</p>
      `
    }
  };

  const policy = policies[type] || policies.general;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="text-center mb-8">
        <i class="${policy.icon} text-5xl text-gold"></i>
        <h1 class="font-heading text-4xl text-maroon mt-2">${policy.title}</h1>
        <p class="text-gray-500 text-sm">Last updated: ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6 md:p-8 border-t-4 border-gold">
        ${policy.content}
      </div>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a href="#policies?type=privacy" class="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-maroon hover:text-white transition">Privacy</a>
        <a href="#policies?type=shipping" class="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-maroon hover:text-white transition">Shipping</a>
        <a href="#policies?type=return" class="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-maroon hover:text-white transition">Returns</a>
        <a href="#policies?type=care" class="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-maroon hover:text-white transition">Care</a>
      </div>
    </div>
  `;
}