export function initModal() {
  // ─── Product modal close ───
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('product-modal').classList.remove('open');
  });
  document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('product-modal').classList.remove('open');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('product-modal').classList.remove('open');
      document.getElementById('auth-modal').classList.remove('open');
    }
  });

  // ─── Auth modal open/close ───
  window.openAuthModal = function() {
    document.getElementById('auth-modal').classList.add('open');
  };
  document.getElementById('auth-close').addEventListener('click', () => {
    document.getElementById('auth-modal').classList.remove('open');
  });
  document.getElementById('auth-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('auth-modal').classList.remove('open');
    }
  });

  // ─── Switch between login & signup ───
  document.getElementById('switch-to-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.auth-form').forEach(el => el.classList.remove('active'));
    document.getElementById('signup-form').classList.add('active');
  });
  document.getElementById('switch-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.auth-form').forEach(el => el.classList.remove('active'));
    document.getElementById('login-form').classList.add('active');
  });

  // ─── Login form ───
  document.getElementById('login-form-fields').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const { signIn } = await import('../services/auth.js');
    const result = await signIn(email, password);
    if (result.success) {
      document.getElementById('auth-modal').classList.remove('open');
      // ✅ Auth state change will trigger route refresh via onAuthStateChange
    } else {
      alert('Login failed: ' + result.error);
    }
  });

  // ─── Signup form ───
  document.getElementById('signup-form-fields').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const { signUp } = await import('../services/auth.js');
    const result = await signUp(firstName, lastName, email, phone, password);
    if (result.success) {
      document.getElementById('auth-modal').classList.remove('open');
    } else {
      alert('Signup failed: ' + result.error);
    }
  });

  // ─── Google login ───
  document.getElementById('google-login-btn').addEventListener('click', async () => {
    const { signInWithGoogle } = await import('../services/auth.js');
    const result = await signInWithGoogle();
    if (result.success) {
      document.getElementById('auth-modal').classList.remove('open');
    } else {
      alert('Google login failed: ' + result.error);
    }
  });

  // ─── Google signup ───
  document.getElementById('google-signup-btn').addEventListener('click', async () => {
    const { signInWithGoogle } = await import('../services/auth.js');
    const result = await signInWithGoogle();
    if (result.success) {
      document.getElementById('auth-modal').classList.remove('open');
    } else {
      alert('Google signup failed: ' + result.error);
    }
  });
}