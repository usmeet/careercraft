/* nav.js — mobile menu, card spotlight, hero parallax */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav__toggle');
    var links = document.querySelector('.nav__links');

    function setOpen(open) {
      links.classList.toggle('nav__links--open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.innerHTML = open ? '&#x2715;' : '&#x2630;';
    }

    if (toggle && links) {
      toggle.addEventListener('click', function () {
        setOpen(!links.classList.contains('nav__links--open'));
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setOpen(false); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
      });
    }

    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    /* Cursor-follow spotlight on cards */
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.card');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    /* Hero orb drifts gently toward the cursor */
    var hero = document.querySelector('.hero');
    var orb = document.querySelector('.hero__orb');
    if (hero && orb) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        orb.style.setProperty('--px', (x * 80) + 'px');
        orb.style.setProperty('--py', (y * 60) + 'px');
      });
    }
  });
})();
