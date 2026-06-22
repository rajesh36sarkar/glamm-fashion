import { getCurrentUser, getUserRole } from '../services/auth.js';
import {
  getProducts, saveProduct, deleteProduct,
  getCategories, saveCategory, deleteCategory,
  getHeroes, saveHero, deleteHero,
  getOrders, updateOrder, deleteOrder,
  getContacts, updateContact, deleteContact,
  getUsers
} from '../services/firestore.js';
import { formatCurrency } from '../utils/helpers.js';
import { showToast } from '../components/modal.js';

let activeTab = 'products';

export async function renderAdmin() {
  const user = getCurrentUser();
  if (!user) {
    document.getElementById('page-content').innerHTML = `<p class="text-center py-12">Please <a href="#home" class="text-maroon underline">sign in</a> as admin.</p>`;
    return;
  }
  const role = await getUserRole(user.uid);
  if (role !== 'admin') {
    document.getElementById('page-content').innerHTML = `<p class="text-center py-12">Access denied. Admin only.</p>`;
    return;
  }

  // Load all data
  const [products, categories, heroes, orders, contacts] = await Promise.all([
    getProducts(), getCategories(), getHeroes(), getOrders(), getContacts()
  ]);

  document.getElementById('page-content').innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-6">
      <h1 class="font-heading text-3xl text-maroon text-center">Admin Panel</h1>
      <p class="text-center text-gray-500 text-sm mb-6">Manage your store effortlessly</p>

      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 justify-center mb-6">
        <button class="tab-btn px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'products' ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-700'}" data-tab="products">Products</button>
        <button class="tab-btn px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'categories' ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-700'}" data-tab="categories">Categories</button>
        <button class="tab-btn px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'heroes' ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-700'}" data-tab="heroes">Hero Slides</button>
        <button class="tab-btn px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'orders' ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-700'}" data-tab="orders">Orders</button>
        <button class="tab-btn px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'contacts' ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-700'}" data-tab="contacts">Contacts</button>
      </div>

      <!-- Tab Content -->
      <div id="admin-tab-content">
        ${renderTabContent(activeTab, { products, categories, heroes, orders, contacts })}
      </div>
    </div>
  `;

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      renderAdmin(); // re-render
    });
  });

  // Event delegation for CRUD actions
  document.getElementById('admin-tab-content').addEventListener('click', async (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    // Add new
    if (target.dataset.action === 'add') {
      openAdminModal(activeTab.slice(0, -1));
      return;
    }

    // Edit
    if (target.dataset.action === 'edit') {
      const id = target.dataset.id;
      let data;
      if (activeTab === 'products') data = products.find(p => p.id === id);
      else if (activeTab === 'categories') data = categories.find(c => c.id === id);
      else if (activeTab === 'heroes') data = heroes.find(h => h.id === id);
      if (data) openAdminModal(activeTab.slice(0, -1), data);
      return;
    }

    // Delete
    if (target.dataset.action === 'delete') {
      const id = target.dataset.id;
      if (!confirm('Are you sure you want to delete this item?')) return;
      let result;
      if (activeTab === 'products') {
        const product = products.find(p => p.id === id);
        result = await deleteProduct(id, product?.imageUrl);
      } else if (activeTab === 'categories') {
        const cat = categories.find(c => c.id === id);
        result = await deleteCategory(id, cat?.imageUrl);
      } else if (activeTab === 'heroes') {
        const hero = heroes.find(h => h.id === id);
        result = await deleteHero(id, hero?.imageUrl);
      } else if (activeTab === 'orders') {
        result = await deleteOrder(id);
      } else if (activeTab === 'contacts') {
        result = await deleteContact(id);
      }
      if (result?.success) {
        showToast('Deleted successfully', 'success');
        renderAdmin();
      } else {
        showToast('Failed to delete', 'error');
      }
    }

    // Order status update
    if (target.dataset.action === 'update-order') {
      const id = target.dataset.id;
      const status = target.dataset.status;
      const result = await updateOrder(id, { status });
      if (result.success) {
        showToast('Order updated', 'success');
        renderAdmin();
      }
    }

    // Contact reply (mark as replied)
    if (target.dataset.action === 'reply-contact') {
      const id = target.dataset.id;
      const result = await updateContact(id, { status: 'replied' });
      if (result.success) {
        showToast('Marked as replied', 'success');
        renderAdmin();
      }
    }
  });
}

function renderTabContent(tab, data) {
  switch (tab) {
    case 'products':
      return `
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-heading text-2xl text-maroon">Products (${data.products.length})</h2>
          <button data-action="add" class="bg-maroon text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#5a0c2a] transition">+ Add Product</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border border-gray-200">
            <thead class="bg-gray-50">
              <tr><th class="p-2 text-left">Image</th><th class="p-2 text-left">Name</th><th class="p-2 text-left">Category</th><th class="p-2 text-left">Price</th><th class="p-2 text-left">Actions</th></tr>
            </thead>
            <tbody>
              ${data.products.map(p => `
                <tr class="border-t">
                  <td class="p-2"><img src="${p.imageUrl || 'assets/images/placeholder.jpg'}" alt="" class="w-12 h-12 object-cover rounded" /></td>
                  <td class="p-2 font-semibold">${p.name}</td>
                  <td class="p-2">${p.category || 'N/A'}</td>
                  <td class="p-2">${formatCurrency(p.price)}</td>
                  <td class="p-2 space-x-1">
                    <button data-action="edit" data-id="${p.id}" class="text-blue-500 hover:underline">Edit</button>
                    <button data-action="delete" data-id="${p.id}" class="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    case 'categories':
      return `
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-heading text-2xl text-maroon">Categories</h2>
          <button data-action="add" class="bg-maroon text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#5a0c2a] transition">+ Add Category</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border border-gray-200">
            <thead class="bg-gray-50"><tr><th class="p-2">Image</th><th class="p-2">Name</th><th class="p-2">Actions</th></tr></thead>
            <tbody>
              ${data.categories.map(c => `
                <tr class="border-t">
                  <td class="p-2"><img src="${c.imageUrl || 'assets/images/placeholder.jpg'}" class="w-12 h-12 object-cover rounded" /></td>
                  <td class="p-2 font-semibold">${c.name}</td>
                  <td class="p-2 space-x-1">
                    <button data-action="edit" data-id="${c.id}" class="text-blue-500 hover:underline">Edit</button>
                    <button data-action="delete" data-id="${c.id}" class="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    case 'heroes':
      return `
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-heading text-2xl text-maroon">Hero Slides</h2>
          <button data-action="add" class="bg-maroon text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#5a0c2a] transition">+ Add Slide</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border border-gray-200">
            <thead class="bg-gray-50"><tr><th class="p-2">Image</th><th class="p-2">Title</th><th class="p-2">Order</th><th class="p-2">Actions</th></tr></thead>
            <tbody>
              ${data.heroes.map(h => `
                <tr class="border-t">
                  <td class="p-2"><img src="${h.imageUrl || 'assets/images/placeholder.jpg'}" class="w-12 h-12 object-cover rounded" /></td>
                  <td class="p-2 font-semibold">${h.title}</td>
                  <td class="p-2">${h.order || 0}</td>
                  <td class="p-2 space-x-1">
                    <button data-action="edit" data-id="${h.id}" class="text-blue-500 hover:underline">Edit</button>
                    <button data-action="delete" data-id="${h.id}" class="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    case 'orders':
      return `
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-heading text-2xl text-maroon">Orders (${data.orders.length})</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border border-gray-200">
            <thead class="bg-gray-50"><tr><th class="p-2">Order ID</th><th class="p-2">Customer</th><th class="p-2">Total</th><th class="p-2">Status</th><th class="p-2">Actions</th></tr></thead>
            <tbody>
              ${data.orders.map(o => `
                <tr class="border-t">
                  <td class="p-2">${o.id.slice(0, 8)}</td>
                  <td class="p-2">${o.customerName || 'N/A'}</td>
                  <td class="p-2">${formatCurrency(o.total || 0)}</td>
                  <td class="p-2">
                    <select data-action="update-order" data-id="${o.id}" class="border rounded px-2 py-0.5 text-sm">
                      ${['pending','processing','shipped','delivered','cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                  </td>
                  <td class="p-2">
                    <button data-action="delete" data-id="${o.id}" class="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    case 'contacts':
      return `
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-heading text-2xl text-maroon">Contacts</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border border-gray-200">
            <thead class="bg-gray-50"><tr><th class="p-2">Name</th><th class="p-2">Email</th><th class="p-2">Message</th><th class="p-2">Status</th><th class="p-2">Actions</th></tr></thead>
            <tbody>
              ${data.contacts.map(c => `
                <tr class="border-t">
                  <td class="p-2 font-semibold">${c.name}</td>
                  <td class="p-2">${c.email}</td>
                  <td class="p-2 max-w-xs truncate">${c.message}</td>
                  <td class="p-2"><span class="px-2 py-0.5 rounded-full text-xs ${c.status === 'replied' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}">${c.status || 'unread'}</span></td>
                  <td class="p-2 space-x-1">
                    ${c.status !== 'replied' ? `<button data-action="reply-contact" data-id="${c.id}" class="text-blue-500 hover:underline">Mark Replied</button>` : ''}
                    <button data-action="delete" data-id="${c.id}" class="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    default:
      return '<p>Select a tab</p>';
  }
}

// Admin Modal (CRUD)
async function openAdminModal(type, data = null) {
  const modal = document.getElementById('admin-modal');
  const form = document.getElementById('admin-modal-form');
  const title = document.getElementById('admin-modal-title');
  const sub = document.getElementById('admin-modal-sub');
  const idField = document.getElementById('admin-modal-id');
  const nameField = document.getElementById('admin-modal-name');
  const categoryField = document.getElementById('admin-modal-category');
  const priceField = document.getElementById('admin-modal-price');
  const oldPriceField = document.getElementById('admin-modal-old-price');
  const descField = document.getElementById('admin-modal-description');
  const imageInput = document.getElementById('admin-modal-image');
  const preview = document.getElementById('admin-modal-image-preview');

  // Reset form
  form.reset();
  preview.innerHTML = '';
  idField.value = '';

  if (type === 'product') {
    title.textContent = data ? 'Edit Product' : 'Add Product';
    sub.textContent = data ? 'Update product details' : 'Fill in the details below.';
    nameField.required = true;
    categoryField.style.display = 'block';
    priceField.required = true;
    oldPriceField.style.display = 'block';
    descField.style.display = 'block';
    imageInput.style.display = 'block';

    if (data) {
      idField.value = data.id;
      nameField.value = data.name || '';
      categoryField.value = data.category || '';
      priceField.value = data.price || '';
      oldPriceField.value = data.originalPrice || '';
      descField.value = data.description || '';
      if (data.imageUrl) {
        preview.innerHTML = `<img src="${data.imageUrl}" class="w-20 h-20 object-cover rounded" />`;
      }
    }
  } else if (type === 'category') {
    title.textContent = data ? 'Edit Category' : 'Add Category';
    sub.textContent = data ? 'Update category' : 'Create a new category.';
    nameField.required = true;
    categoryField.style.display = 'none';
    priceField.required = false;
    oldPriceField.style.display = 'none';
    descField.style.display = 'none';
    imageInput.style.display = 'block';

    if (data) {
      idField.value = data.id;
      nameField.value = data.name || '';
      if (data.imageUrl) {
        preview.innerHTML = `<img src="${data.imageUrl}" class="w-20 h-20 object-cover rounded" />`;
      }
    }
  } else if (type === 'hero') {
    title.textContent = data ? 'Edit Hero Slide' : 'Add Hero Slide';
    sub.textContent = data ? 'Update slide' : 'Add a new slide.';
    nameField.required = true;
    nameField.placeholder = 'Title';
    categoryField.style.display = 'none';
    priceField.required = false;
    priceField.style.display = 'none';
    oldPriceField.style.display = 'none';
    descField.style.display = 'block';
    descField.placeholder = 'Subtitle';
    imageInput.style.display = 'block';

    if (data) {
      idField.value = data.id;
      nameField.value = data.title || '';
      descField.value = data.subtitle || '';
      if (data.imageUrl) {
        preview.innerHTML = `<img src="${data.imageUrl}" class="w-20 h-20 object-cover rounded" />`;
      }
    }
  }

  modal.classList.add('open');

  // Save handler
  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const file = imageInput.files[0];
    const payload = {
      id: idField.value,
      name: nameField.value,
      category: categoryField.value,
      price: parseFloat(priceField.value) || 0,
      originalPrice: parseFloat(oldPriceField.value) || 0,
      description: descField.value,
      imageUrl: preview.querySelector('img')?.src || '',
    };

    let result;
    if (type === 'product') {
      result = await saveProduct(payload, file);
    } else if (type === 'category') {
      result = await saveCategory({ ...payload, name: nameField.value }, file);
    } else if (type === 'hero') {
      result = await saveHero({ ...payload, title: nameField.value, subtitle: descField.value, order: 0 }, file);
    }
    if (result) {
      showToast('Saved successfully', 'success');
      modal.classList.remove('open');
      renderAdmin();
    } else {
      showToast('Failed to save', 'error');
    }
  };
}