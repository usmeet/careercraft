/* ============================================================
   tags.js — Random rotation angles for Home hero floating tags
   Source: DESIGN.md §5a (Category tag), D-012
   ============================================================ */

(function () {
  'use strict';

  function randomAngle(min, max) {
    return min + Math.random() * (max - min);
  }

  function initHeroTags() {
    var tags = document.querySelectorAll('.hero__tag');
    if (!tags.length) return;

    tags.forEach(function (tag) {
      var angle = randomAngle(-12, 12);
      tag.style.transform = 'rotate(' + angle + 'deg)';
    });

    /* Optional slow float — disabled under prefers-reduced-motion (D-019) */
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      tags.forEach(function (tag, i) {
        var delay = i * 0.8;
        var dur = 4 + Math.random() * 3;
        var dist = 3 + Math.random() * 4;
        tag.style.animation = 'tagFloat ' + dur + 's ease-in-out ' + delay + 's infinite alternate';
        tag.style.setProperty('--float-dist', dist + 'px');
      });
    }
  }

  /* Inject keyframes once */
  var style = document.createElement('style');
  style.textContent = '@keyframes tagFloat { 0% { translate: 0 0; } 100% { translate: 0 var(--float-dist, 4px); } }';
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', initHeroTags);
})();
