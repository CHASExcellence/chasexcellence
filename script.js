// Mobile nav toggle
function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

// Close mobile nav when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ---- Tier-1 cinematic motion ----
(function () {
  var prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || prefersReduce) return;

  // Scroll reveals (with per-sibling stagger)
  var revealSel = [
    '.section-header', '.about-text', '.about-photo', '.quote-band .container',
    '.value-card', '.scholarship-card', '.recipient-card', '.impact-stat',
    '.event-card-featured', '.event-media-item', '.gallery-item',
    '.donate-text', '.donate-card', '.nominate-text', '.nominate-qr',
    '.legacy-inner'
  ].join(',');
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(revealSel));
  revealEls.forEach(function (el) {
    el.classList.add('reveal');
    var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains('reveal');
    });
    var i = sibs.indexOf(el);
    if (el.classList.contains('gallery-item')) {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
    } else if (i > 0) {
      el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
    }
  });

  // Fade gallery photos in as they finish loading (lazy images
  // otherwise pop in after the tile's reveal has already ended)
  Array.prototype.forEach.call(document.querySelectorAll('.gallery-item img'), function (img) {
    img.classList.add('img-fade');
    if (img.complete && img.naturalWidth) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function () { img.classList.add('loaded'); }, { once: true });
      img.addEventListener('error', function () { img.classList.add('loaded'); }, { once: true });
    }
  });
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        el.classList.add('in');
        el.addEventListener('transitionend', function h(ev) {
          if (ev.propertyName === 'transform') {
            el.classList.add('settled');
            el.style.transitionDelay = '';
            el.removeEventListener('transitionend', h);
          }
        });
        revealObs.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealEls.forEach(function (el) { revealObs.observe(el); });

  // Count-up for impact stats
  function animateCount(el) {
    var raw = el.getAttribute('data-final') || el.textContent;
    el.setAttribute('data-final', raw);
    var m = raw.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!m) return;
    var prefix = m[1], target = parseInt(m[2].replace(/,/g, ''), 10), suffix = m[3];
    var dur = 1500, start = null;
    function fmt(n) { return n.toLocaleString('en-US'); }
    function build(n) {
      return prefix + fmt(n) + (suffix ? '<span>' + suffix + '</span>' : '');
    }
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = build(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(frame);
      else el.innerHTML = build(target);
    }
    requestAnimationFrame(frame);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll('.stat-number'));
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateCount(e.target);
        countObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { countObs.observe(c); });
})();

// ---- Gallery lightbox ----
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item img'));
  if (!items.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-prev" aria-label="Previous photo">&#10094;</button>' +
    '<img class="lb-img" alt="" />' +
    '<button class="lb-next" aria-label="Next photo">&#10095;</button>' +
    '<div class="lb-count"></div>';
  document.body.appendChild(box);

  var lbImg = box.querySelector('.lb-img');
  var lbCount = box.querySelector('.lb-count');
  var idx = 0;

  function show(i) {
    idx = (i + items.length) % items.length;
    lbImg.src = items[idx].src;
    lbImg.alt = items[idx].alt || '';
    lbCount.textContent = (idx + 1) + ' / ' + items.length;
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(function (img, i) {
    var tile = img.closest('.gallery-item');
    tile.style.cursor = 'zoom-in';
    tile.addEventListener('click', function () { show(i); });
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
