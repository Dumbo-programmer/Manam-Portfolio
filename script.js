(function () {
  var root = document.documentElement;

  // theme
  try {
    var saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}
  document.getElementById('theme').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // mobile menu
  var menu = document.getElementById('menu');
  var links = document.getElementById('links');
  menu.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }
  });

  // floating math symbols
  var syms = ['∑', '∫', 'π', '∞', '√', 'Δ', 'θ', '≡', 'φ', '∂', 'λ', '∏', 'ℕ', '≈', 'σ'];
  var box = document.querySelector('.symbols');
  for (var i = 0; i < 22; i++) {
    var s = document.createElement('span');
    s.textContent = syms[i % syms.length];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = 24 + Math.random() * 56 + 'px';
    s.style.animationDuration = 40 + Math.random() * 50 + 's';
    s.style.animationDelay = -Math.random() * 80 + 's';
    box.appendChild(s);
  }

  // cursor glow
  var glow = document.querySelector('.glow');
  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  } else {
    glow.style.display = 'none';
  }

  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 80 + 'ms';
    io.observe(el);
  });

  // count-up stats
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
      var t0 = performance.now(), dur = 1400;
      (function tick(t) {
        var p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = v.toLocaleString('en-US') + (p === 1 ? suf : '');
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  // active nav link
  var navLinks = document.querySelectorAll('.links a');
  var sections = Array.prototype.map.call(navLinks, function (a) { return document.querySelector(a.getAttribute('href')); });
  var sio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { if (s) sio.observe(s); });

  // contact form -> opens the visitor's mail app (no backend needed)
  var form = document.getElementById('form');
  var note = document.getElementById('note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    if (!d.get('name') || !d.get('email') || !d.get('message')) {
      note.textContent = 'Please fill in every field.';
      return;
    }
    var subject = encodeURIComponent('Message from ' + d.get('name'));
    var body = encodeURIComponent(d.get('message') + '\n\n— ' + d.get('name') + ' (' + d.get('email') + ')');
    window.location.href = 'mailto:inteshermanam@gmail.com?subject=' + subject + '&body=' + body;
    note.textContent = 'Opening your email app…';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
