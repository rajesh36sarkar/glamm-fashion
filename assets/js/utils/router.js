import { renderHome } from '../pages/home.js';
import { renderProducts } from '../pages/products.js';
import { renderProductDetail } from '../pages/product-detail.js';
import { renderAbout } from '../pages/about.js';
import { renderContact } from '../pages/contact.js';
import { renderDashboard } from '../pages/user-dashboard.js';
import { renderAdmin } from '../pages/admin.js';
import { renderCheckout } from '../pages/checkout.js';
import { renderPolicies } from '../pages/policies.js';

const routes = {
  'home': renderHome,
  'products': renderProducts,
  'product': renderProductDetail,
  'about': renderAbout,
  'contact': renderContact,
  'dashboard': renderDashboard,
  'admin': renderAdmin,
  'checkout': renderCheckout,
  'policies': renderPolicies
};

export function navigateTo(route) {
  window.location.hash = route;
}

export function handleRoute() {
  const hash = window.location.hash.slice(1) || 'home';
  const [path] = hash.split('?');
  const renderFn = routes[path] || renderHome;
  renderFn();
}

window.navigateTo = navigateTo;