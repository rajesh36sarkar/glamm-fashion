export function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

export function getDiscountPercent(original, current) {
  if (!original || original <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function truncateText(text, maxLength = 60) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^[+]?[0-9]{10,15}$/.test(phone);
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key] || 'undefined';
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});
}

export function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function scrollToElement(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  return Promise.resolve();
}

// NEW: Consistent image fallback
export function getImageUrl(url, fallback = 'assets/images/placeholder.jpg') {
  return url && url.trim() !== '' ? url : fallback;
}