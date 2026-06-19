export function renderPolicies() {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="page-header"><h1>Our Policies</h1></div>
    <div style="max-width:800px;margin:40px auto;padding:20px;">
      <h2>Privacy Policy</h2>
      <p>We value your privacy. Your data is safe with us.</p>
      <h2>Shipping Policy</h2>
      <p>Free shipping on orders above ₹599. Delivery within 5-7 business days.</p>
      <h2>Return & Refund</h2>
      <p>Return within 7 days for a full refund. Contact our support.</p>
    </div>
  `;
}