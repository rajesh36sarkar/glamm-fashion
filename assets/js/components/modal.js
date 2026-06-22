export function initModal() {
  // ─── DOM refs ───
  const productModal = document.getElementById('product-modal');
  const authModal = document.getElementById('auth-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const authClose = document.getElementById('auth-close');

  // ─── Product Modal ───
  if (modalCloseBtn && productModal) {
    modalCloseBtn.addEventListener('click', () => productModal.classList.remove('open'));
    productModal.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) productModal.classList.remove('open');
    });
  }

  // ─── Global Escape key ───
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (productModal) productModal.classList.remove('open');
      if (authModal) authModal.classList.remove('open');
    }
  });

  // ─── Auth modal open/close ───
  window.openAuthModal = function() {
    if (authModal) authModal.classList.add('open');
  };

  if (authClose && authModal) {
    authClose.addEventListener('click', () => authModal.classList.remove('open'));
    authModal.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) authModal.classList.remove('open');
    });
  }

  // ─── Toggle between login & signup ───
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToLogin = document.getElementById('switch-to-login');

  if (switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      toggleForm('signup');
    });
  }
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      toggleForm('login');
    });
  }

  function toggleForm(form) {
    document.querySelectorAll('.auth-form').forEach(el => el.classList.remove('active'));
    const target = form === 'login' ? 'login-form' : 'signup-form';
    const el = document.getElementById(target);
    if (el) el.classList.add('active');
    // Clear any previous error messages
    clearErrors();
  }

  // ─── Login form ───
  const loginForm = document.getElementById('login-form-fields');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      if (!email || !password) {
        showError('login-error', 'Please fill in all fields.');
        return;
      }

      setLoading('login-btn', true);
      try {
        const { signIn } = await import('../services/auth.js');
        const result = await signIn(email, password);
        if (result.success) {
          authModal.classList.remove('open');
          showToast('✅ Welcome back!', 'success');
        } else {
          showError('login-error', result.error || 'Invalid email or password.');
        }
      } catch (err) {
        showError('login-error', 'Something went wrong. Please try again.');
      } finally {
        setLoading('login-btn', false);
      }
    });
  }

  // ─── Signup form ───
  const signupForm = document.getElementById('signup-form-fields');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = document.getElementById('signup-firstname').value.trim();
      const lastName = document.getElementById('signup-lastname').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const phone = document.getElementById('signup-phone').value.trim();
      const password = document.getElementById('signup-password').value.trim();

      if (!firstName || !lastName || !email || !phone || !password) {
        showError('signup-error', 'Please fill in all fields.');
        return;
      }
      if (password.length < 6) {
        showError('signup-error', 'Password must be at least 6 characters.');
        return;
      }

      setLoading('signup-btn', true);
      try {
        const { signUp } = await import('../services/auth.js');
        const result = await signUp(firstName, lastName, email, phone, password);
        if (result.success) {
          authModal.classList.remove('open');
          showToast('🎉 Account created! Welcome to Glamm Fashion.', 'success');
        } else {
          showError('signup-error', result.error || 'Signup failed. Please try again.');
        }
      } catch (err) {
        showError('signup-error', 'Something went wrong. Please try again.');
      } finally {
        setLoading('signup-btn', false);
      }
    });
  }

  // ─── Google login ───
  const googleLoginBtn = document.getElementById('google-login-btn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
      setLoading('google-login-btn', true);
      try {
        const { signInWithGoogle } = await import('../services/auth.js');
        const result = await signInWithGoogle();
        if (result.success) {
          authModal.classList.remove('open');
          showToast('✅ Signed in with Google!', 'success');
        } else {
          showError('login-error', result.error || 'Google login failed.');
        }
      } catch (err) {
        showError('login-error', 'Google login failed. Please try again.');
      } finally {
        setLoading('google-login-btn', false);
      }
    });
  }

  // ─── Google signup ───
  const googleSignupBtn = document.getElementById('google-signup-btn');
  if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', async () => {
      setLoading('google-signup-btn', true);
      try {
        const { signInWithGoogle } = await import('../services/auth.js');
        const result = await signInWithGoogle();
        if (result.success) {
          authModal.classList.remove('open');
          showToast('✅ Signed up with Google!', 'success');
        } else {
          showError('signup-error', result.error || 'Google signup failed.');
        }
      } catch (err) {
        showError('signup-error', 'Google signup failed. Please try again.');
      } finally {
        setLoading('google-signup-btn', false);
      }
    });
  }

  // ─── Helpers ───
  function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<span class="auth-error">${message}</span>`;
    // Auto‑clear after 5 seconds
    setTimeout(() => { container.innerHTML = ''; }, 5000);
  }

  function clearErrors() {
    document.querySelectorAll('.auth-error-container').forEach(el => el.innerHTML = '');
  }

  function setLoading(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (isLoading) {
      btn.disabled = true;
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
    } else {
      btn.disabled = false;
      if (btn.dataset.originalText) {
        btn.innerHTML = btn.dataset.originalText;
        delete btn.dataset.originalText;
      }
    }
  }

  function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.className = 'toast ' + type + ' show';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}