/* Faith Formation for Children at Holy Family Church
   Menu, header, gentle reveals. No third-party code, no tracking. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Opened straight from a folder (file://) a link to "classes/" shows a directory listing,
     so point it at the index file. Has no effect on a real server. */
  if (location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
      var parts = h.split('#');
      if (/\/$/.test(parts[0]) || parts[0] === '.' || parts[0] === '') {
        parts[0] = (parts[0] === '.' || parts[0] === '' ? './' : parts[0]) + 'index.html';
        a.setAttribute('href', parts.join('#'));
      }
    });
  }

  /* Mobile drawer */
  var menuBtn = document.querySelector('.menu-btn');
  var primary = document.getElementById('primary');
  if (menuBtn && primary) {
    menuBtn.addEventListener('click', function () {
      var open = primary.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
  }

  /* Condensing header */
  var header = document.querySelector('.site-header');
  if (header && !reduced) {
    var onScroll = function () { header.classList.toggle('condensed', window.scrollY > 80); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Reveals and the gold rule */
  var targets = document.querySelectorAll('.reveal, .reveal-rule');
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
    document.querySelectorAll('[data-stagger]').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--d', (i * 60) + 'ms'); });
    });
  }

  /* DEVELOPMENT ONLY — remove at launch. Adding ?reg=open or ?reg=waitlist to the home page or
     /registration/ previews the other registration states for review. */
  var want = new URLSearchParams(location.search).get('reg');
  if (want && /^(open|closed|waitlist)$/.test(want)) {
    document.querySelectorAll('[data-reg-state]').forEach(function (el) {
      el.hidden = el.getAttribute('data-reg-state') !== want;
    });
  }
})();
