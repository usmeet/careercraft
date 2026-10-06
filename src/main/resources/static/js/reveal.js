/* ============================================================
   reveal.js — Scroll-triggered entrance animations
   Uses IntersectionObserver for performant scroll reveals
   ============================================================ */

(function () {
  'use strict';

  /* Nav scroll effect */
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrolled = false;
    function checkScroll() {
      var shouldBeScrolled = window.scrollY > 32;
      if (shouldBeScrolled !== scrolled) {
        scrolled = shouldBeScrolled;
        nav.classList.toggle('nav--scrolled', scrolled);
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* Scroll reveal using IntersectionObserver */
  function initReveal() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = document.querySelectorAll('.reveal');
    if (!els.length || prefersReduced) {
      /* If reduced motion, just show everything */
      els.forEach(function (el) { el.classList.add('reveal--visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* Stagger children animation */
  function initStagger() {
    var groups = document.querySelectorAll('[data-stagger]');
    groups.forEach(function (group) {
      var children = group.children;
      for (var i = 0; i < children.length; i++) {
        children[i].classList.add('reveal');
        children[i].style.transitionDelay = (i * 0.1) + 's';
      }
    });
  }

  /* Smooth counter animation for any future stats */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var duration = 1500;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }

      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
      observer.observe(el);
    });
  }

  /* Smooth-scroll anchor links */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavScroll();
    initStagger();
    initReveal();
    initCounters();
    initSmoothScroll();
  });
})();
