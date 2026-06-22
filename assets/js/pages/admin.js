import { 
  getProducts, getCategories, getOrders, getContacts, getUsers, getHeroes,
  saveProduct, deleteProduct, saveCategory, deleteCategory,
  saveHero, deleteHero, updateOrder, deleteOrder,
  updateContact, deleteContact, getAnalytics, getSettings, updateSettings,
  getUserById, updateOrderDelivery
} from '../services/firestore.js';
import { getCurrentUser } from '../services/auth.js';
import { createShipment } from '../services/delivery.js';
import { getImageUrl } from '../utils/helpers.js';

let products = [], categories = [], orders = [], contacts = [], users = [], heroes = [], analytics = [], settings = {};

let revenueChartInstance = null;
let statusChartInstance = null;

export async function renderAdmin() {
  const container = document.getElementById('page-content');
  const user = getCurrentUser();

  if (!user) {
    container.innerHTML = `
      <div style="padding:40px;text-align:center;">
        <p>Please login to access the admin panel.</p>
        <button class="btn-primary" onclick="window.openAuthModal()">Login</button>
      </div>
    `;
    return;
  }

  try {
    const userData = await getUserById(user.uid);
    if (!userData || userData.role !== 'admin') {
      container.innerHTML = `
        <div style="padding:40px;text-align:center;">
          <p>⛔ Access denied. Admin only.</p>
          <p>Your role: ${userData?.role || 'none'}</p>
        </div>
      `;
      return;
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    container.innerHTML = `
      <div style="padding:40px;text-align:center;color:red;">
        <p>⚠️ Could not verify admin privileges.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
    return;
  }

  try {
    [products, categories, orders, contacts, users, heroes, analytics, settings] = await Promise.all([
      getProducts(), getCategories(), getOrders(), getContacts(), getUsers(), getHeroes(), getAnalytics(), getSettings()
    ]);
  } catch (error) {
    console.error('Error loading admin data:', error);
    container.innerHTML = `<p>Failed to load data. Please refresh.</p>`;
    return;
  }

  if (revenueChartInstance) { revenueChartInstance.destroy(); revenueChartInstance = null; }
  if (statusChartInstance) { statusChartInstance.destroy(); statusChartInstance = null; }

  container.innerHTML = `
    <div id="admin-page">
      <div class="mobile-admin-header">
        <div class="mobile-logo"><i class="fa-solid fa-shield-halved"></i> Admin Management</div>
        <button id="mobile-menu-btn" aria-label="Toggle Menu"><i class="fa-solid fa-bars"></i></button>
      </div>
      
      <div class="admin-sidebar-overlay" id="admin-sidebar-overlay"></div>

      <div class="admin-wrapper">
        <aside class="admin-sidebar" id="admin-sidebar">
          <div class="sidebar-brand hidden-mobile"><i class="fa-solid fa-shield-halved"></i> Admin Panel</div>
          <button class="sidebar-close" id="sidebar-close" aria-label="Close Sidebar"><i class="fa-solid fa-xmark"></i></button>
          <div class="nav-item active-admin-tab" data-admin-tab="dashboard"><i class="fa-solid fa-chart-pie"></i> Dashboard</div>
          <div class="nav-item" data-admin-tab="products"><i class="fa-solid fa-gem"></i> Products</div>
          <div class="nav-item" data-admin-tab="categories"><i class="fa-solid fa-tags"></i> Categories</div>
          <div class="nav-item" data-admin-tab="heroes"><i class="fa-solid fa-image"></i> Heroes</div>
          <div class="nav-item" data-admin-tab="orders"><i class="fa-solid fa-truck"></i> Orders</div>
          <div class="nav-item" data-admin-tab="contacts"><i class="fa-solid fa-envelope"></i> Contacts</div>
          <div class="nav-item" data-admin-tab="users"><i class="fa-solid fa-users"></i> Users</div>
          <div class="nav-item" data-admin-tab="settings"><i class="fa-solid fa-gear"></i> Settings</div>
        </aside>
        
        <div class="admin-content">
          <div id="admin-panel-dashboard" class="panel active">${renderDashboard()}</div>
          <div id="admin-panel-products" class="panel">${renderProductsPanel()}</div>
          <div id="admin-panel-categories" class="panel">${renderCategoriesPanel()}</div>
          <div id="admin-panel-heroes" class="panel">${renderHeroesPanel()}</div>
          <div id="admin-panel-orders" class="panel">${renderOrdersPanel()}</div>
          <div id="admin-panel-contacts" class="panel">${renderContactsPanel()}</div>
          <div id="admin-panel-users" class="panel">${renderUsersPanel()}</div>
          <div id="admin-panel-settings" class="panel">${renderSettingsPanel()}</div>
        </div>
      </div>
    </div>
  `;

  attachAdminEvents();
  initCharts();
}

// ─── Render functions ───
function renderDashboard() {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  return `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-number">${products.length}</div><div class="stat-label">Products</div></div>
      <div class="stat-card"><div class="stat-number">${orders.length}</div><div class="stat-label">Orders</div></div>
      <div class="stat-card"><div class="stat-number">₹${totalRevenue}</div><div class="stat-label">Revenue</div></div>
      <div class="stat-card"><div class="stat-number">${users.length}</div><div class="stat-label">Users</div></div>
    </div>
    <div class="charts-row">
      <div class="chart-wrapper"><canvas id="revenueChart" height="200"></canvas></div>
      <div class="chart-wrapper"><canvas id="orderStatusChart" height="200"></canvas></div>
    </div>
  `;
}

function renderProductsPanel() {
  return `
    <div class="panel-header"><h3>Products</h3><button class="btn-primary" id="add-product-btn">+ Add Product</button></div>
    <div class="table-wrap">
      <table><thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td><img src="${getImageUrl(p.imageUrl)}" class="product-thumb" alt=""></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>₹${p.price}</td>
            <td><button class="edit-product" data-id="${p.id}">Edit</button> <button class="delete-product" data-id="${p.id}" data-image="${p.imageUrl}">Delete</button></td>
          </tr>
        `).join('')}
      </tbody></table>
    </div>
  `;
}

function renderCategoriesPanel() {
  return `
    <div class="panel-header"><h3>Categories</h3><button class="btn-primary" id="add-category-btn">+ Add Category</button></div>
    <div class="table-wrap">
      <table><thead><tr><th>Image</th><th>Name</th><th>Actions</th></tr></thead>
      <tbody>
        ${categories.map(c => `
          <tr>
            <td><img src="${getImageUrl(c.imageUrl)}" class="product-thumb" alt=""></td>
            <td>${c.name}</td>
            <td><button class="edit-category" data-id="${c.id}">Edit</button> <button class="delete-category" data-id="${c.id}" data-image="${c.imageUrl}">Delete</button></td>
          </tr>
        `).join('')}
      </tbody></table>
    </div>
  `;
}

function renderHeroesPanel() {
  return `
    <div class="panel-header"><h3>Hero Sections</h3><button class="btn-primary" id="add-hero-btn">+ Add Hero</button></div>
    <div class="table-wrap">
      <table><thead><tr><th>Page</th><th>Image</th><th>Actions</th></tr></thead>
      <tbody>
        ${heroes.map(h => `
          <tr>
            <td>${h.page}</td>
            <td><img src="${getImageUrl(h.imageUrl)}" class="product-thumb" alt=""></td>
            <td><button class="edit-hero" data-id="${h.id}">Edit</button> <button class="delete-hero" data-id="${h.id}" data-image="${h.imageUrl}">Delete</button></td>
          </tr>
        `).join('')}
      </tbody></table>
    </div>
  `;
}

function renderOrdersPanel() {
  const statusColors = { pending: '#f39c12', processing: '#3498db', shipped: '#2ecc71', delivered: '#27ae60', cancelled: '#e74c3c' };
  return `
    <div class="panel-header"><h3>Orders</h3></div>
    <div class="table-wrap">
      <table><thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Tracking</th><th>Actions</th></tr></thead>
      <tbody>
        ${orders.map(o => `
          <tr>
            <td>${o.id.slice(0,6)}</td>
            <td>${o.customerName}</td>
            <td>₹${o.total}</td>
            <td>
              <select class="order-status" data-id="${o.id}" style="background:${statusColors[o.status] || '#eee'}20;">
                ${['pending','processing','shipped','delivered','cancelled'].map(s => `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
              </select>
            </td>
            <td>${o.delivery?.trackingUrl ? `<a href="${o.delivery.trackingUrl}" target="_blank">Track</a>` : '—'}</td>
            <td><button class="delete-order" data-id="${o.id}">Delete</button></td>
          </tr>
        `).join('')}
      </tbody></table>
    </div>
  `;
}

function renderContactsPanel() {
  return `
    <div class="panel-header"><h3>Contact Messages</h3></div>
    <div class="table-wrap">
      <table><thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${contacts.map(c => `
          <tr>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.subject}</td>
            <td>${c.status}</td>
            <td><button class="reply-contact" data-id="${c.id}">Reply</button> <button class="delete-contact" data-id="${c.id}">Delete</button></td>
          </tr>
        `).join('')}
      </tbody></table>
    </div>
  `;
}

function renderUsersPanel() {
  return `
    <div class="panel-header"><h3>Users</h3></div>
    <div class="table-wrap">
      <table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr></thead>
      <tbody>
        ${users.map(u => `
          <tr><td>${u.firstName} ${u.lastName}</td><td>${u.email}</td><td>${u.phone || '—'}</td><td>${u.role || 'user'}</td></tr>
        `).join('')}
      </tbody></table>
    </div>
  `;
}

function renderSettingsPanel() {
  return `
    <div class="panel-header"><h3>Site Settings</h3></div>
    <form id="settings-form">
      <div class="form-group"><label>Store Name</label><input type="text" id="settings-storeName" value="${settings?.storeName || ''}"></div>
      <div class="form-group"><label>Phone</label><input type="text" id="settings-phone" value="${settings?.storePhone || ''}"></div>
      <div class="form-group"><label>Email</label><input type="email" id="settings-email" value="${settings?.storeEmail || ''}"></div>
      <div class="form-group"><label>Address</label><input type="text" id="settings-address" value="${settings?.storeAddress || ''}"></div>
      <div class="form-group"><label>Shipping Fee</label><input type="number" id="settings-shippingFee" value="${settings?.shippingFee || 0}"></div>
      <button type="submit" class="btn-primary">Save Settings</button>
    </form>
  `;
}

// ─── Event Delegation ───
function attachAdminEvents() {
  const adminContainer = document.getElementById('admin-page');
  if (!adminContainer) return;

  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-sidebar-overlay');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('sidebar-close');

  // Get the icon inside the mobile button
  const mobileIcon = mobileBtn ? mobileBtn.querySelector('i') : null;

  // ─── Close sidebar function (updates icon) ───
  const closeMobileMenu = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    if (mobileIcon) {
      mobileIcon.className = 'fa-solid fa-bars';
      mobileBtn.setAttribute('aria-label', 'Open Menu');
    }
  };

  // ─── Toggle sidebar function (toggles icon) ───
  const toggleMobileMenu = () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    if (mobileIcon) {
      if (sidebar.classList.contains('open')) {
        mobileIcon.className = 'fa-solid fa-xmark';
        mobileBtn.setAttribute('aria-label', 'Close Sidebar');
      } else {
        mobileIcon.className = 'fa-solid fa-bars';
        mobileBtn.setAttribute('aria-label', 'Open Menu');
      }
    }
  };

  // ─── Event Listeners ───
  if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  // ─── Tab switching ───
  adminContainer.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
      // Close mobile sidebar if open
      if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        closeMobileMenu();
      }
      adminContainer.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active-admin-tab'));
      this.classList.add('active-admin-tab');
      const tab = this.dataset.adminTab;
      adminContainer.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('admin-panel-' + tab);
      if (panel) panel.classList.add('active');
    });
  });

  // ─── Close sidebar on window resize to desktop ───
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ─── Product CRUD ───
  const addProductBtn = document.getElementById('add-product-btn');
  if (addProductBtn) addProductBtn.addEventListener('click', () => openAdminModal('product'));

  document.querySelectorAll('.edit-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const product = products.find(p => p.id === id);
      openAdminModal('product', product);
    });
  });

  document.querySelectorAll('.delete-product').forEach(btn => {
    btn.addEventListener('click', async function() {
      if (confirm('Delete this product?')) {
        await deleteProduct(this.dataset.id, this.dataset.image);
        reloadAdminPanel();
      }
    });
  });

  // ─── Category CRUD ───
  const addCategoryBtn = document.getElementById('add-category-btn');
  if (addCategoryBtn) addCategoryBtn.addEventListener('click', () => openAdminModal('category'));

  document.querySelectorAll('.edit-category').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const category = categories.find(c => c.id === id);
      openAdminModal('category', category);
    });
  });

  document.querySelectorAll('.delete-category').forEach(btn => {
    btn.addEventListener('click', async function() {
      if (confirm('Delete this category?')) {
        await deleteCategory(this.dataset.id, this.dataset.image);
        reloadAdminPanel();
      }
    });
  });

  // ─── Hero CRUD ───
  const addHeroBtn = document.getElementById('add-hero-btn');
  if (addHeroBtn) addHeroBtn.addEventListener('click', () => openAdminModal('hero'));

  document.querySelectorAll('.edit-hero').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const hero = heroes.find(h => h.id === id);
      openAdminModal('hero', hero);
    });
  });

  document.querySelectorAll('.delete-hero').forEach(btn => {
    btn.addEventListener('click', async function() {
      if (confirm('Delete this hero?')) {
        await deleteHero(this.dataset.id, this.dataset.image);
        reloadAdminPanel();
      }
    });
  });

  // ─── Order status update ───
  document.querySelectorAll('.order-status').forEach(select => {
    select.addEventListener('change', async function() {
      const id = this.dataset.id;
      const status = this.value;
      await updateOrder(id, { status });
      if (status === 'shipped') {
        const shipment = await createShipment(id);
        if (shipment && shipment.order_id) {
          await updateOrderDelivery(id, {
            shipmentId: shipment.order_id,
            trackingUrl: shipment.tracking_url,
            courier: shipment.courier_name
          });
          alert('Shipment created! Tracking URL updated.');
        } else {
          alert('Failed to create shipment. Check logs.');
        }
      }
      reloadAdminPanel();
    });
  });

  document.querySelectorAll('.delete-order').forEach(btn => {
    btn.addEventListener('click', async function() {
      if (confirm('Delete this order?')) {
        await deleteOrder(this.dataset.id);
        reloadAdminPanel();
      }
    });
  });

  // ─── Contacts ───
  document.querySelectorAll('.reply-contact').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const contact = contacts.find(c => c.id === id);
      if (contact) {
        window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject}`;
        updateContact(id, { status: 'replied' });
      }
    });
  });

  document.querySelectorAll('.delete-contact').forEach(btn => {
    btn.addEventListener('click', async function() {
      if (confirm('Delete this message?')) {
        await deleteContact(this.dataset.id);
        reloadAdminPanel();
      }
    });
  });

  // ─── Settings Form ───
  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const data = {
        storeName: document.getElementById('settings-storeName').value,
        storePhone: document.getElementById('settings-phone').value,
        storeEmail: document.getElementById('settings-email').value,
        storeAddress: document.getElementById('settings-address').value,
        shippingFee: parseFloat(document.getElementById('settings-shippingFee').value) || 0
      };
      await updateSettings(data);
      alert('Settings saved!');
    });
  }

  // ─── Admin Modal Form ───
  const modalForm = document.getElementById('admin-modal-form');
  if (modalForm) {
    modalForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const id = document.getElementById('admin-modal-id').value;
      const name = document.getElementById('admin-modal-name').value;
      const category = document.getElementById('admin-modal-category').value;
      const price = parseFloat(document.getElementById('admin-modal-price').value);
      const oldPrice = parseFloat(document.getElementById('admin-modal-old-price').value) || 0;
      const description = document.getElementById('admin-modal-description').value;
      const imageFile = document.getElementById('admin-modal-image').files[0];

      const productData = { name, category, price, oldPrice, description };
      if (id) productData.id = id;

      const result = await saveProduct(productData, imageFile);
      if (result) {
        document.getElementById('admin-modal').classList.remove('open');
        reloadAdminPanel();
      } else {
        alert('Failed to save product.');
      }
    });
  }

  const cancelBtn = document.getElementById('admin-modal-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      document.getElementById('admin-modal').classList.remove('open');
    });
  }
}

// ─── Open Admin Modal ───
function openAdminModal(type, data = null) {
  const modal = document.getElementById('admin-modal');
  const title = document.getElementById('admin-modal-title');
  const sub = document.getElementById('admin-modal-sub');
  const idInput = document.getElementById('admin-modal-id');
  const nameInput = document.getElementById('admin-modal-name');
  const categorySelect = document.getElementById('admin-modal-category');
  const priceInput = document.getElementById('admin-modal-price');
  const oldPriceInput = document.getElementById('admin-modal-old-price');
  const descInput = document.getElementById('admin-modal-description');
  const preview = document.getElementById('admin-modal-image-preview');

  if (!modal) return;

  document.getElementById('admin-modal-form').reset();
  preview.innerHTML = '';
  idInput.value = '';

  if (type === 'product') {
    title.textContent = data ? 'Edit Product' : 'Add Product';
    sub.textContent = data ? 'Update product details.' : 'Fill in product details.';
    if (data) {
      idInput.value = data.id;
      nameInput.value = data.name || '';
      categorySelect.value = data.category || '';
      priceInput.value = data.price || '';
      oldPriceInput.value = data.oldPrice || '';
      descInput.value = data.description || '';
      if (data.imageUrl) preview.innerHTML = `<img src="${data.imageUrl}" style="max-width:100px;">`;
    }
  } else if (type === 'category') {
    alert('Category editing is not fully implemented yet.');
    return;
  } else if (type === 'hero') {
    alert('Hero editing is not fully implemented yet.');
    return;
  }

  modal.classList.add('open');
}

// ─── Reload Admin Panel ───
async function reloadAdminPanel() {
  await renderAdmin();
}

// ─── Init Charts ───
function initCharts() {
  setTimeout(() => {
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && typeof Chart !== 'undefined') {
      if (revenueChartInstance) { revenueChartInstance.destroy(); revenueChartInstance = null; }
      revenueChartInstance = new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue (₹)',
            data: [12000, 19000, 15000, 22000, 28000, 35000],
            borderColor: '#7B113A',
            backgroundColor: 'rgba(123, 17, 58, 0.05)',
            tension: 0.4,
            fill: true
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    const statusCtx = document.getElementById('orderStatusChart');
    if (statusCtx && typeof Chart !== 'undefined') {
      if (statusChartInstance) { statusChartInstance.destroy(); statusChartInstance = null; }
      const statusCounts = { pending:0, processing:0, shipped:0, delivered:0, cancelled:0 };
      orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
      statusChartInstance = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
          labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
          datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: ['#f39c12', '#3498db', '#2ecc71', '#27ae60', '#e74c3c']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }, 300);
}