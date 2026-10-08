/* ============================================================
   nav.js — Mobile navigation toggle
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav__toggle');
    var links = document.querySelector('.nav__links');

    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('nav__links--open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.innerHTML = isOpen ? '&#x2715;' : '&#x2630;';
    });

    /* Close menu on link click */
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('nav__links--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '&#x2630;';
      });
    });

    /* Card mouse spotlight glow — delegated so dynamic cards also work */
    document.addEventListener('mousemove', function (e) {
      var card = e.target.closest('.card');
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });
})();
