/* clients.js — Clients page scripts */

/* =====================================================================
   CLIENT VIDEO TESTIMONIALS (INSTAGRAM REELS)
   ---------------------------------------------------------------------
   >>> PASTE YOUR INSTAGRAM REEL LINKS HERE <<<

   One object per reel. Only `client` and `url` are required.

     client : name shown under the video
     role   : line under the name (owner, brand, venue…)
     quote  : short pull-quote overlaid on the card
     url    : the Instagram reel/post permalink
     thumb  : optional local poster image (e.g. 'images/reels/tikibab.jpg').
              Instagram blocks hotlinking their CDN, so download a frame and
              drop it in /images/reels/ — without it the card shows a
              gradient placeholder, which still looks fine.

   Entries with an empty `url` are treated as not-yet-filled. While
   SHOW_PLACEHOLDERS is true they render as dashed "add link" cards so you
   can preview the layout. Set it to false (or fill every url) and only
   real reels show. If nothing is left to show, the whole section hides
   itself, so an unfinished list never ships as a broken block.
   ===================================================================== */
const REELS = [
  { client: '', role: '', quote: '', url: '', thumb: '' },
  { client: '', role: '', quote: '', url: '', thumb: '' },
  { client: '', role: '', quote: '', url: '', thumb: '' },
  { client: '', role: '', quote: '', url: '', thumb: '' },
];

const SHOW_PLACEHOLDERS = true;

(function () {
  const grid = document.getElementById('reelsGrid');
  const section = document.getElementById('video-testimonials');
  if (!grid || !section) return;

  const GRADIENTS = [
    'linear-gradient(150deg,#1a0a0a,#5a1f1f)',
    'linear-gradient(150deg,#0a1a12,#1f5a3a)',
    'linear-gradient(150deg,#0a0f1a,#1f3a5a)',
    'linear-gradient(150deg,#1a0a1a,#4a1f4a)',
    'linear-gradient(150deg,#1a1405,#5a4310)',
    'linear-gradient(150deg,#05141a,#0f4a5a)',
  ];

  const live = REELS.filter(r => r.url && r.url.trim());
  const list = SHOW_PLACEHOLDERS ? REELS : live;

  if (!list.length) { section.remove(); return; }

  list.forEach((r, i) => {
    const filled = !!(r.url && r.url.trim());
    const bg = GRADIENTS[i % GRADIENTS.length];

    const card = document.createElement(filled ? 'a' : 'div');
    card.className = 'reel-card reveal' + (filled ? '' : ' reel-card-empty');
    card.style.setProperty('--delay', (i * 0.08) + 's');

    if (filled) {
      card.href = r.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.setAttribute('aria-label', 'Watch ' + (r.client || 'client') + "'s testimonial on Instagram");
    }

    const media = document.createElement('div');
    media.className = 'reel-media';
    media.style.background = bg;

    if (filled && r.thumb) {
      const img = document.createElement('img');
      img.src = r.thumb;
      img.alt = r.client ? r.client + ' video testimonial' : 'Client video testimonial';
      img.loading = 'lazy';
      img.onerror = () => img.remove();
      media.appendChild(img);
    }

    if (filled) {
      media.insertAdjacentHTML('beforeend',
        '<span class="reel-play"><i class="ri-play-fill"></i></span>' +
        '<span class="reel-badge"><i class="ri-instagram-line"></i> Reel</span>' +
        (r.quote ? '<p class="reel-quote">\u201c' + r.quote + '\u201d</p>' : ''));
    } else {
      media.insertAdjacentHTML('beforeend',
        '<span class="reel-empty-mark"><i class="ri-add-line"></i></span>' +
        '<p class="reel-empty-text">Add an Instagram reel link<br><small>REELS list in js/pages/clients.js</small></p>');
    }

    const meta = document.createElement('div');
    meta.className = 'reel-meta';
    meta.innerHTML = filled
      ? '<strong>' + (r.client || 'Client') + '</strong>' + (r.role ? '<span>' + r.role + '</span>' : '')
      : '<strong>Awaiting link</strong><span>Slot ' + (i + 1) + '</span>';

    card.appendChild(media);
    card.appendChild(meta);
    grid.appendChild(card);
  });

  /* These cards are built after js/main.js has already snapshotted the
     .reveal elements on the page, so main.js will never observe them and
     they would stay stuck at opacity:0. Give them their own observer. */
  const cards = grid.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    cards.forEach(el => el.classList.add('active'));
    return;
  }
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(el => revealObs.observe(el));
})();

/* STAR RATINGS */
document.querySelectorAll('.star-rating').forEach(el => el.innerHTML = '&#9733;'.repeat(5));

/* COUNTER ANIMATION — client impact stats */
(function () {
  const section = document.getElementById('clientImpact');
  if (!section) return;
  const counters = section.querySelectorAll('.counter');
  if (!counters.length) return;

  function animate(el) {
    const target = +el.getAttribute('data-target');
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / 1600, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
    })(start);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        counters.forEach(animate);
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(section);
})();

/* BRAND LOGOS — category filter + show all
   Visibility is driven entirely from here (not the old CSS nth-child rule),
   because nth-child counts every child regardless of display and so broke
   as soon as a filter hid some of them. */
(function () {
  const grid = document.getElementById('logosGrid');
  const bar = document.getElementById('logoFilterBar');
  const btn = document.getElementById('loadMoreLogosBtn');
  const status = document.getElementById('logoFilterStatus');
  const empty = document.getElementById('logoEmpty');
  if (!grid || !bar) return;

  const COLLAPSED_COUNT = 18;
  const items = Array.from(grid.querySelectorAll('.logo-free-item'));
  let cat = 'all';
  let expanded = false;

  function render() {
    const matching = items.filter(el => cat === 'all' || el.dataset.cat === cat);
    const limit = expanded ? matching.length : Math.min(COLLAPSED_COUNT, matching.length);

    items.forEach(el => el.classList.add('is-hidden'));
    matching.slice(0, limit).forEach(el => el.classList.remove('is-hidden'));

    if (empty) empty.hidden = matching.length > 0;

    if (btn) {
      const hasMore = matching.length > COLLAPSED_COUNT;
      btn.parentElement.hidden = !hasMore;
      btn.textContent = expanded ? 'Show Less' : 'Show All ' + matching.length + ' Brands';
      btn.setAttribute('aria-expanded', String(expanded));
    }

    if (status) {
      const label = cat === 'all'
        ? 'Showing ' + limit + ' of ' + matching.length + ' brands'
        : 'Showing ' + limit + ' of ' + matching.length + ' brands in this category';
      status.textContent = label;
    }
  }

  bar.addEventListener('click', (e) => {
    const tab = e.target.closest('.logo-filter-tab');
    if (!tab) return;
    bar.querySelectorAll('.logo-filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    cat = tab.dataset.cat;
    expanded = false;
    render();
  });

  if (btn) btn.addEventListener('click', () => {
    expanded = !expanded;
    render();
    if (!expanded) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* "See these brands" buttons in the Industries section jump here pre-filtered */
  document.querySelectorAll('[data-jump-cat]').forEach(el => {
    el.addEventListener('click', () => {
      const target = bar.querySelector('.logo-filter-tab[data-cat="' + el.dataset.jumpCat + '"]');
      if (!target) return;
      target.click();
      document.getElementById('brand-partners').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  grid.classList.remove('collapsed');
  render();
})();

/* TESTIMONIAL SLIDER */
(function () {
  const slider = document.getElementById('testiSlider');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (!slider || !dotsWrap) return;
  const slides = slider.querySelectorAll('.testi-slide');
  let current = 0, autoTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
    dotsWrap.appendChild(dot);
  });

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn.addEventListener('click', () => {
    goTo(current - 1);
    startAuto();
  });
  nextBtn.addEventListener('click', () => {
    goTo(current + 1);
    startAuto();
  });

  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
  });

  startAuto();
})();

/* GRAPHIC DESIGN TABS */
(function () {
  const TABS = {
    'brand-identity':    { icon: 'ri-palette-fill',        label: 'Brand Identity',   title: 'Brand Identity Design',     desc: 'Logos, color systems, typography, and visual language — cohesive identities built to leave a lasting mark.', image: '' },
    'print-collateral':  { icon: 'ri-printer-fill',        label: 'Print Collateral', title: 'Print Collateral Design',   desc: 'Brochures, flyers, business cards, and marketing materials — designed to impress in the physical world.', image: '' },
    'outdoor-ads':       { icon: 'ri-megaphone-fill',      label: 'Outdoor Ads',      title: 'Outdoor Advertising',       desc: 'Hoardings, banners, bus shelters, and transit ads — bold creatives that command attention at scale.', image: '' },
    'menu-design':       { icon: 'ri-restaurant-2-fill',   label: 'Menu Design',      title: 'Menu & F&B Design',         desc: 'Restaurant and café menus, drink lists, and F&B marketing — designed to delight and upsell.', image: '' },
    'product-packaging': { icon: 'ri-gift-fill',           label: 'Product Packaging',title: 'Product Packaging Design',  desc: 'Packaging systems that stand out on shelf — structural design, labels, and unboxing experiences that convert.', image: '' },
    'ui-ux':             { icon: 'ri-layout-masonry-fill', label: 'UI / UX Design',   title: 'UI / UX Interface Design',  desc: 'Web and app interfaces designed with precision — wireframes, prototypes, and pixel-perfect final designs.', image: '' },
  };

  const tabs = document.querySelectorAll('.graphic-tab');
  const showcase = document.getElementById('graphicShowcase');
  const captionTag = document.getElementById('captionTag');
  const captionTitle = document.getElementById('captionTitle');
  const captionDesc = document.getElementById('captionDesc');
  if (!tabs.length || !showcase) return;

  function activate(key) {
    const data = TABS[key];
    if (!data) return;
    document.querySelectorAll('.graphic-showcase-fallback').forEach(f => f.classList.remove('active'));
    if (data.image) {
      const old = showcase.querySelector('.graphic-showcase-img');
      if (old) old.remove();
      const img = document.createElement('img');
      img.className = 'graphic-showcase-img';
      img.src = data.image;
      img.alt = data.label;
      img.style.objectFit = 'cover';
      showcase.insertBefore(img, showcase.querySelector('.graphic-caption-bar'));
      requestAnimationFrame(() => img.classList.add('active'));
    } else {
      const fallback = document.getElementById('tab-' + key);
      if (fallback) fallback.classList.add('active');
      const old = showcase.querySelector('.graphic-showcase-img');
      if (old) old.remove();
    }
    captionTag.innerHTML = `<i class="${data.icon}"></i> ${data.label}`;
    captionTitle.textContent = data.title;
    captionDesc.textContent = data.desc;
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === key));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab.getAttribute('data-tab')));
  });

  activate('brand-identity');
})();
