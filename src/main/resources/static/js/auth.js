/* ============================================================
   auth.js — Sign-up, log-in form handling & instant user nav state
   ============================================================ */

(function () {
  'use strict';

  function applyLoggedInNav(userName) {
    var nameToDisplay = userName || 'My Account';

    // 1. Add "My History" link to main nav if not present
    var navLinks = document.querySelector('.nav__links');
    if (navLinks && !navLinks.querySelector('a[href="history.html"]')) {
      var historyLink = document.createElement('a');
      historyLink.href = 'history.html';
      historyLink.className = 'nav__link';
      if (window.location.pathname.endsWith('history.html')) {
        historyLink.classList.add('nav__link--active');
      }
      historyLink.textContent = 'My History';
      navLinks.appendChild(historyLink);
    }

    // 2. Update right-side buttons to user profile + Log out
    var rightNav = document.querySelector('.nav__right');
    if (rightNav) {
      var loginLink = rightNav.querySelector('.nav__login-link');
      var createBtn = rightNav.querySelector('.btn-nav-white');
      if (loginLink) {
        loginLink.textContent = nameToDisplay;
        loginLink.href = 'history.html';
        loginLink.title = 'View your saved workspace';
      }
      if (createBtn) {
        createBtn.textContent = 'Log out';
        createBtn.href = '#';
        createBtn.onclick = function (e) {
          e.preventDefault();
          localStorage.removeItem('careercraft_user');
          if (typeof API !== 'undefined') {
            API.logout().finally(function () {
              window.location.href = 'index.html';
            });
          } else {
            window.location.href = 'index.html';
          }
        };
      }
    }
  }

  function applyLoggedOutNav() {
    localStorage.removeItem('careercraft_user');
  }

  document.addEventListener('DOMContentLoaded', function () {

    // Instantly apply cached login state to prevent navbar flickering on refresh
    var cached = localStorage.getItem('careercraft_user');
    if (cached) {
      try {
        var user = JSON.parse(cached);
        if (user && user.name) {
          applyLoggedInNav(user.name);
        }
      } catch (e) {}
    }

    /* ── Sign-up form ── */
    var signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var nameInput = document.getElementById('name');
        var emailInput = document.getElementById('email');
        var passwordInput = document.getElementById('password');
        var errorEl = document.getElementById('auth-error');

        var name = nameInput ? nameInput.value.trim() : '';
        var email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        var password = passwordInput ? passwordInput.value.trim() : '';

        if (errorEl) errorEl.textContent = '';

        API.signup(name, email, password).then(function (data) {
          if (data.success) {
            localStorage.setItem('careercraft_user', JSON.stringify({ name: name, email: email }));
            window.location.href = 'try.html';
          } else {
            if (errorEl) errorEl.textContent = data.message || 'Signup failed.';
          }
        }).catch(function () {
          if (errorEl) errorEl.textContent = 'Network error. Please try again.';
        });
      });
    }

    /* ── Log-in form ── */
    var loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailInput = document.getElementById('email');
        var passwordInput = document.getElementById('password');
        var errorEl = document.getElementById('auth-error');

        var email = emailInput ? emailInput.value.trim().toLowerCase() : '';
        var password = passwordInput ? passwordInput.value.trim() : '';

        if (errorEl) errorEl.textContent = '';

        API.login(email, password).then(function (data) {
          if (data.success) {
            var userName = data.name || email.split('@')[0];
            localStorage.setItem('careercraft_user', JSON.stringify({ name: userName, email: email }));
            window.location.href = 'try.html';
          } else {
            if (errorEl) errorEl.textContent = data.message || 'Invalid email or password.';
          }
        }).catch(function () {
          if (errorEl) errorEl.textContent = 'Network error. Please try again.';
        });
      });
    }

    /* ── Verify session with server in background ── */
    if (typeof API !== 'undefined') {
      API.me().then(function (data) {
        if (data.loggedIn) {
          localStorage.setItem('careercraft_user', JSON.stringify({ name: data.name }));
          applyLoggedInNav(data.name);
        } else {
          // If server says not logged in, clear local state
          applyLoggedOutNav();
        }
      }).catch(function () {
        // Network/offline fallback: keep cached nav
      });
    }
  });
})();
