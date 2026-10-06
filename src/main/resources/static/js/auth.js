/* ============================================================
   auth.js — Sign-up, log-in form handling & user nav state
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Sign-up form ── */
    var signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var password = document.getElementById('password').value;
        var errorEl = document.getElementById('auth-error');
        if (errorEl) errorEl.textContent = '';

        API.signup(name, email, password).then(function (data) {
          if (data.success) {
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
        var email = document.getElementById('email').value.trim();
        var password = document.getElementById('password').value;
        var errorEl = document.getElementById('auth-error');
        if (errorEl) errorEl.textContent = '';

        API.login(email, password).then(function (data) {
          if (data.success) {
            window.location.href = 'history.html';
          } else {
            if (errorEl) errorEl.textContent = data.message || 'Invalid email or password.';
          }
        }).catch(function () {
          if (errorEl) errorEl.textContent = 'Network error. Please try again.';
        });
      });
    }

    /* ── Update nav for logged-in user ── */
    if (typeof API !== 'undefined') {
      API.me().then(function (data) {
        if (data.loggedIn) {
          // Add History link to navigation
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

          var rightNav = document.querySelector('.nav__right');
          if (rightNav) {
            var loginLink = rightNav.querySelector('.nav__login-link');
            var createBtn = rightNav.querySelector('.btn-nav-white');
            if (loginLink) {
              loginLink.textContent = data.name;
              loginLink.href = 'history.html';
              loginLink.title = 'View your saved workspace';
            }
            if (createBtn) {
              createBtn.textContent = 'Log out';
              createBtn.href = '#';
              createBtn.addEventListener('click', function (e) {
                e.preventDefault();
                API.logout().then(function () { window.location.href = 'index.html'; });
              });
            }
          }
        }
      }).catch(function () { /* guest mode */ });
    }
  });
})();
