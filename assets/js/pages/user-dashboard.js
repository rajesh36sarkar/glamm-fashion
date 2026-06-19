import { getCurrentUser } from '../services/auth.js';
import { getOrdersByUser } from '../services/firestore.js';
import { signOutUser } from '../services/auth.js';

export async function renderDashboard() {
  const container = document.getElementById('page-content');
  const user = getCurrentUser();
  if (!user) {
    container.innerHTML = `<p>Please login to view your dashboard. <a href="#" onclick="window.openAuthModal()">Login</a></p>`;
    return;
  }

  const userOrders = await getOrdersByUser(user.uid);

  container.innerHTML = `
    <div class="dashboard-page">
      <h1>My Dashboard</h1>
      <div class="user-info">
        <p><strong>Name:</strong> ${user.displayName || 'User'}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <button id="logout-btn" class="btn-primary">Logout</button>
      </div>
      <h2>Order History</h2>
      ${userOrders.length ? `
        <div class="order-list">
          ${userOrders.map(order => `
            <div class="order-item">
              <div><strong>Order #${order.id.slice(0,6)}</strong></div>
              <div>Total: ₹${order.total}</div>
              <div>Status: ${order.status}</div>
              <div>${new Date(order.createdAt?.toDate()).toLocaleDateString()}</div>
              ${order.delivery?.trackingUrl ? `<div><a href="${order.delivery.trackingUrl}" target="_blank">Track</a></div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : `<p>No orders yet.</p>`}
    </div>
  `;

  document.getElementById('logout-btn').addEventListener('click', () => {
    signOutUser();
    window.location.reload();
  });
}