/* ============================================================
   tags.js — Hero floating tags with smooth animations
   ============================================================ */

(function () {
  'use strict';

  function initHeroTags() {
    var tags = document.querySelectorAll('.hero__tag');
    if (!tags.length) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    tags.forEach(function (tag, i) {
      /* Random rotation */
      var angle = -12 + Math.random() * 24;
      tag.style.setProperty('--tag-rotate', angle + 'deg');

      /* Stagger entrance */
      tag.style.animationDelay = (0.3 + i * 0.15) + 's';
      tag.classList.add('hero__tag--animate');

      if (!prefersReduced) {
        /* Each tag gets a unique float pattern */
        var xDist = 4 + Math.random() * 8;
        var yDist = 4 + Math.random() * 8;
        var dur = 5 + Math.random() * 4;
        var delay = i * 0.7;

        tag.style.setProperty('--float-x', xDist + 'px');
        tag.style.setProperty('--float-y', yDist + 'px');
        tag.style.setProperty('--float-dur', dur + 's');
        tag.style.setProperty('--float-delay', delay + 's');
      }
    });
  }

  /* Inject keyframes */
  var style = document.createElement('style');
  style.textContent = [
    '@keyframes tagEntrance {',
    '  0% { opacity: 0; transform: rotate(var(--tag-rotate, 0deg)) scale(0.6) translateY(20px); }',
    '  100% { opacity: 1; transform: rotate(var(--tag-rotate, 0deg)) scale(1) translateY(0); }',
    '}',
    '@keyframes tagFloat {',
    '  0%, 100% { transform: rotate(var(--tag-rotate, 0deg)) translate(0, 0); }',
    '  25% { transform: rotate(var(--tag-rotate, 0deg)) translate(var(--float-x, 4px), calc(-1 * var(--float-y, 4px))); }',
    '  50% { transform: rotate(var(--tag-rotate, 0deg)) translate(calc(-0.5 * var(--float-x, 4px)), var(--float-y, 4px)); }',
    '  75% { transform: rotate(var(--tag-rotate, 0deg)) translate(calc(-1 * var(--float-x, 4px)), calc(-0.5 * var(--float-y, 4px))); }',
    '}',
    '.hero__tag--animate {',
    '  animation: tagEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards,',
    '             tagFloat var(--float-dur, 6s) ease-in-out var(--float-delay, 0s) infinite;',
    '  animation-fill-mode: forwards, none;',
    '  opacity: 0;',
    '}',
    '@media (prefers-reduced-motion: reduce) {',
    '  .hero__tag--animate { animation: tagEntrance 0.01s forwards; opacity: 1; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', initHeroTags);
})();
