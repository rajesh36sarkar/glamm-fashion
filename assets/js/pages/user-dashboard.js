import { getCurrentUser, signOutUser } from '../services/auth.js';
import { getOrdersByUser, getUserById, getProducts } from '../services/firestore.js';
import { formatCurrency } from '../utils/helpers.js';

export async function renderDashboard() {
  const user = getCurrentUser();
  if (!user) {
    document.getElementById('page-content').innerHTML = `<p class="text-center py-12">Please <a href="#home" class="text-maroon underline">sign in</a> to view your dashboard.</p>`;
    return;
  }

  const userData = await getUserById(user.uid);
  const orders = await getOrdersByUser(user.uid);
  const allProducts = await getProducts();
  const likedProducts = allProducts.filter(p => p.likedBy?.includes(user.uid)).slice(0, 4);

  document.getElementById('page-content').innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="font-heading text-3xl text-maroon">My Dashboard</h1>
        <button id="logout-btn" class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition">Logout</button>
      </div>

      <div class="bg-peach p-6 rounded-xl shadow-sm mb-8">
        <h2 class="font-semibold text-xl">Welcome, ${userData?.firstName || user.displayName || 'User'}!</h2>
        <p class="text-gray-600">${user.email}</p>
        <p class="text-gray-600 text-sm">Phone: ${userData?.phone || 'N/A'}</p>
      </div>

      <h3 class="font-heading text-2xl text-maroon mb-4">Order History</h3>
      ${orders.length === 0 ? `<p class="text-gray-400">You haven't placed any orders yet.</p>` : `
        <div class="space-y-3">
          ${orders.map(order => `
            <div class="border border-gray-200 rounded-xl p-4 flex flex-wrap justify-between items-center">
              <div>
                <p class="font-semibold">Order #${order.id.slice(0, 8)}</p>
                <p class="text-sm text-gray-500">${new Date(order.createdAt?.toMillis?.() || Date.now()).toLocaleDateString()}</p>
                <p class="text-sm">Items: ${order.items?.length || 0}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-maroon">${formatCurrency(order.total || 0)}</p>
                <span class="text-xs px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}">${order.status || 'pending'}</span>
                ${order.delivery?.trackingUrl ? `<a href="${order.delivery.trackingUrl}" target="_blank" class="text-xs text-blue-500 underline">Track</a>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `}

      <h3 class="font-heading text-2xl text-maroon mt-8 mb-4">Suggested for You</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${likedProducts.length > 0 ? likedProducts.map(p => `
          <a href="#product?id=${p.id}" class="block bg-white shadow rounded-lg overflow-hidden">
            <img src="${p.imageUrl || 'assets/images/placeholder.jpg'}" alt="${p.name}" class="w-full aspect-square object-cover" />
            <div class="p-2">
              <p class="font-semibold text-sm truncate">${p.name}</p>
              <p class="text-maroon text-sm font-bold">${formatCurrency(p.price)}</p>
            </div>
          </a>
        `).join('') : `<p class="text-gray-400 col-span-full">Like some products to get personalised suggestions.</p>`}
      </div>
    </div>
  `;

  document.getElementById('logout-btn').addEventListener('click', async () => {
    await signOutUser();
    window.navigateTo('home');
  });
}