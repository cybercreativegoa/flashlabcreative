/* about.js — About page scripts */

/* PORTRAIT CARD image fallback */
document.querySelectorAll('.pcard').forEach(card => {
  const img = card.querySelector('.pcard-photo');
  if (img) img.addEventListener('error', () => img.style.display = 'none');
});

/* TIMELINE */
(function () {
  // Sample copy for title/tag/body — final wording to follow, especially
  // for 2026 which is newly added here (wasn't in the original timeline).
  const YEARS = [
    {
      year: '2016', title: 'The Spark &mdash; Pre-Launch', tag: 'Foundation',
      body: 'The idea of Flashlab Creative was born. Ankith and Anuraj Kedar identified a gap in Goa\'s creative market businesses needed world class creative services, and no one was delivering them locally. One of the earliest projects: a cinematic branding video for The SouthDeck, setting the tone for the bold storytelling Flashlab Creative would become known for.',
    },
    {
      year: '2017', title: 'Building the Blueprint', tag: 'Pre-Launch',
      body: 'Brand identity designed. Business model refined. Flashlab Creative took on early collaborations to build a portfolio before the official launch including video production for The Mambo Halloween Event promo and a cinematic piece covering Max Vangeli\'s first experience in Goa. By year\'s end, everything was set for launch.',
    },
    {
      year: '2018', title: 'Flashlab Creative Officially Founded', tag: 'Year One',
      body: 'Established in Margao, Goa, starting from a small godown room with passion and purpose. First paying clients onboarded. Projects included Cyrus Berne\'s Ed Sheeran & Chainsmokers "Shape of You" video production, the Ashley + Melita Wedding Film Teaser, and the Five Six Zero 2017 ft. Blasterjaxx event a landmark electronic music production in Goa. The Flashlab Creative era officially began.',
    },
    {
      year: '2019', title: 'Building Our Foundation', tag: 'Growth',
      body: 'Expanded into digital marketing, graphic design, web design, photography, and video production. Key highlights: the FC Goa 2018&ndash;19 Jersey Launch Event, a Deltin Casino "Deltin Select" promo, and a fashion film for Pipa Bella featuring Snehal Fernandes. This year established Flashlab Creative as Goa\'s trusted creative partner across sports, hospitality, and lifestyle brands.',
    },
    {
      year: '2020', title: 'Resilience &amp; Digital Push', tag: 'Pivot',
      body: 'Navigated the pandemic by doubling down on digital strategy and content production. Helped local businesses pivot online producing a cinematic branding video for European Bartender School, Goa, and a stunning property shoot for Mystras Assagao. Flashlab Creative emerged stronger, more versatile, and with a wider client base than before.',
    },
    {
      year: '2021', title: 'Parashoot Studios Launch', tag: 'New Venture',
      body: 'Launched Parashoot Studios a dedicated content production arm specialising in weddings, food, aerial, and commercial photography. Armed with cinema grade cameras, professional studio setups, and advanced drones, Parashoot quickly became the go to photography and film partner for Goa\'s premium hospitality and lifestyle brands.',
    },
    {
      year: '2022', title: 'Premium Brand Partnerships', tag: 'Major Wins',
      body: 'Secured major contracts with high profile brands and events. Captured the Goa Experience Stage at Sunburn Goa 2022 for Sunburn x Deltin where music, culture, and visuals collided. Also produced cinematic coverage of the Deltin Life activation at IFFI Goa 2022, with celebrated guests including Rishab Shetty, Ajay Devgn, and Anupam Kher. Campaigns that set new standards in Goa\'s creative industry.',
    },
    {
      year: '2023', title: 'Office Expansion &amp; National Games', tag: 'Milestone',
      body: 'Expanded to G26 Vikrant Complex, Margao a professional, inspiring workspace for the growing team. From a small godown room to a full creative hub. Also delivered comprehensive multi sport media coverage for the National Games 2023 hosted in Goa. More staff, more capabilities, more impact.',
    },
    {
      year: '2024', title: 'Record-Breaking Year', tag: 'Peak Year',
      body: 'One of Flashlab Creative\'s biggest years. Delivered cinematic coverage for Netflix at IFFI 2024 capturing red carpet moments, exclusive talent interviews, and on ground activations. Also covered the Ironman 70.3 Goa for MP Tejasvi Surya, and launched "Your Origin Story" podcast at The Origin Goa. Bold visuals and immersive storytelling defined the year.',
    },
    {
      year: '2025', title: '7 Years &amp; Looking Forward', tag: 'Present',
      body: 'Celebrating 7 years of creativity, innovation, and impact. Delivered a cinematic property showcase for Deltin Daman, and captured the FIDE Chess World Cup 2025 launch in Goa covering the logo and anthem reveal, cultural performances, and key moments with precision and style. With celebrity collaborations and campaigns pushing creative limits, the Flashlab Creative story is far from over.',
    },
    {
      year: '2026', title: 'A New Chapter Begins', tag: 'Expanding Forward',
      body: 'Sample content &mdash; final copy to follow. Ten years since that first cinematic video for The SouthDeck, Flashlab Creative keeps growing its roster of hospitality, fitness, and lifestyle brands across Goa &mdash; the same bold storytelling instinct, now backed by a decade of experience.',
    },
  ];

  // Client logos shown per year (replaces the old project-photo grid).
  // Logo paths are best-guess filenames — swap in the real files under
  // images/logos/ whenever you have them; anything missing falls back
  // to a clean text badge automatically (see CLIENTS_BY_YEAR fallback
  // handling below), so nothing breaks in the meantime.
  const CLIENTS_BY_YEAR = {
      '2016': [
        { name: 'Cape Town Cafe', logo: 'images/logos/CapeTownCafe.png', desc: 'A laid-back cafe serving all-day comfort food and coffee.' },
        { name: 'Cafe Mambo', logo: 'images/logos/mambo.jpg', desc: 'Iconic beachfront cafe known for sunset vibes and live music.' },
        { name: 'Tito\'s', logo: 'images/logos/TITO.jpg', desc: 'Goa\'s legendary nightlife institution on Baga\'s party strip.' },
        { name: 'Strobe Nightlife', logo: 'images/logos/strobe.jpg', desc: 'High-energy nightlife brand bringing Goa\'s best DJs to the floor.' },
      ],
      '2017': [
        { name: 'The Southern Deck', logo: 'images/logos/southern deck.jpg', desc: 'A boutique bar & kitchen blending coastal charm with craft cocktails.' },
        { name: 'Quicksand Events', logo: 'images/logos/QuickSandEvents.png', desc: 'Full-service event management crew behind Goa\'s biggest gatherings.' },
        { name: 'BackstageXchange', logo: 'images/logos/Backstage-Xchange-Logo.png', desc: 'Event and artist management connecting talent with unforgettable shows.' },
        { name: 'Barefeet Easter', logo: 'images/logos/barefeet easter.jpeg', desc: 'Goa\'s beloved Easter festival celebrating music, sand, and sun.' },
      ],
      '2018': [
        { name: 'Boca Loca Creatives', logo: 'images/logos/boca loca.jpg', desc: 'A creative studio crafting bold visual identities for Goan brands.' },
        { name: 'Genora Infotech', logo: 'images/logos/genora infotech.png', desc: 'IT solutions and software services powering local businesses.' },
        { name: 'Bull Frog', logo: 'images/logos/bullfrog.jpg', desc: 'A lively bar known for its eclectic drinks and buzzing crowd.' },
        { name: 'Sochi Beach', logo: 'images/logos/SOCHI.jpg', desc: 'A beachfront shack serving fresh seafood with ocean views.' },
        { name: 'Jamming Goat', logo: 'images/logos/Jamming goat.png', desc: 'A music-first cafe where live sessions meet good coffee.' },
        { name: 'The Hangover', logo: 'images/logos/Double Hangover Easter Bash - Logo.png', desc: 'A go-to nightlife spot for late-night beats and cocktails.' },
        { name: 'FC Goa', logo: 'images/logos/fc-goa.png', desc: 'Goa\'s home-grown Indian Super League football club.' },
        { name: 'EBS', logo: 'images/logos/ebs.png', desc: 'European Bartender School Goa, training the region\'s next mixologists.' },
      ],
      '2019': [
        { name: 'Sochi Beach', logo: 'images/logos/SOCHI.jpg', desc: 'A beachfront shack serving fresh seafood with ocean views.' },
        { name: 'Tulum', logo: 'images/logos/tulum.png', desc: 'A tropical-inspired beach lounge with a Mexican-Caribbean soul.' },
        { name: 'Soul Souffle Creatives', logo: 'images/logos/Soul Souffle.png', desc: 'A dessert-and-cafe concept plating up soulful sweet treats.' },
        { name: 'Deltin', logo: 'images/logos/Deltin-Casino.png', desc: 'Goa\'s premier casino and entertainment resort brand.' },
        { name: 'Marriott', logo: 'images/logos/marriots.jpeg', desc: 'Print and poster campaigns for a leading international hotel brand.' },
        { name: 'Tataki', logo: 'images/logos/tataki.png', desc: 'Japanese-inspired dining brought to life through cinematic video.' },
        { name: 'The Hangover', logo: 'images/logos/The Hangover.jpg', desc: 'Reel-first content driving buzz for Goa\'s nightlife hotspot.' },
        { name: 'Krank', logo: 'images/logos/heineken.png', desc: 'Heineken\'s flagship nightlife experience blending music and beer culture.' },
      ],
      '2020': [
        { name: 'Flamingos', logo: 'images/logos/flamingos(new).jpeg', desc: 'A pastel-hued beach cafe made for laid-back Goan afternoons.' },
        { name: 'Adinco Distilleries', logo: 'images/logos/adineo distillerirs.webp', desc: 'A craft distillery bottling spirits with a distinctly Goan character.' },
        { name: 'Forca Foundation', logo: 'images/logos/forca goa.jpg', desc: 'A community foundation driving sport and social impact in Goa.' },
        { name: 'Kings Casino', logo: 'images/logos/kingcasino.png', desc: 'A premium gaming and entertainment destination on the water.' },
        { name: 'Tikibab', logo: 'images/logos/tikibab-final.png', desc: 'Tiki-themed bar & kitchen serving tropical cocktails and comfort food.' },
        { name: 'The Hive', logo: 'images/logos/hive.png', desc: 'A buzzing co-working and community space for Goa\'s creators.' },
        { name: 'Neuro Space', logo: 'images/logos/Neuro-Space.webp', desc: 'A wellness studio focused on mind, movement, and recovery.' },
        { name: 'Fairtrade', logo: 'images/logos/fairtrade.png', desc: 'Ethically-sourced goods championing fair trade across Goa.' },
        { name: 'Myra Goa', logo: 'images/logos/myra.png', desc: 'A boutique hospitality brand offering curated Goan stays.' },
      ],
      '2021': [
        { name: 'Mickeys', logo: 'images/logos/Mickeys.png', desc: 'A neighbourhood bar serving classic drinks with a local twist.' },
        { name: 'Noaa social dining &mantra', logo: 'images/logos/NOAA Logo.png', desc: 'A neighbourhood bar serving classic drinks with a local twist.' },
        { name: 'YU Hotel', logo: 'images/logos/YU hotel.png', desc: 'A modern hotel brand offering comfort with contemporary design.' },
        { name: 'Borecha', logo: 'images/logos/borecha.png', desc: 'A homegrown beverage brand crafting refreshing local flavours.' },
        { name: 'Barefeet Easter', logo: 'images/logos/barefeet easter.jpeg', desc: 'Goa\'s beloved Easter festival celebrating music, sand, and sun.' },
      ],
      '2022': [
        { name: 'Bab\'s Hideout', logo: 'images/logos/babs hideout.png', desc: 'A village bar & kitchen tucked away for good food and better company.' },
        { name: 'Yacht Club', logo: 'images/logos/Yacht  club goa.png', desc: 'An exclusive yacht club offering Goa\'s finest on-water experiences.' },
        { name: 'Tinera Stays', logo: 'images/logos/tinera stays.png', desc: 'Boutique homestays offering an authentic slice of Siolim living.' },
        { name: 'World of Wines', logo: 'images/logos/world of wine.png', desc: 'A curated wine destination for tastings and connoisseurs.' },
      ],
      '2023': [
        { name: 'The Origin', logo: 'images/logos/theorigin.png', desc: 'A bar & kitchen rooted in bold flavours and honest storytelling.' },
        { name: 'Dempo College', logo: 'images/logos/dempo college.png', desc: 'One of Goa\'s leading institutions for higher education.' },
        { name: 'Bliss Villa', logo: 'images/logos/Bliss villa.png', desc: 'A serene private villa offering a peaceful escape in Goa.' },
        { name: 'Orane', logo: 'images/logos/orane.jpg', desc: 'A beauty and wellness academy shaping Goa\'s next-gen professionals.' },
        { name: 'Mike\'s Place', logo: 'images/logos/mikes.png', desc: 'A cosy neighbourhood haunt for great food and good vibes.' },
        { name: 'Ziki', logo: 'images/logos/Ziki Logo (Black).png', desc: 'A contemporary dining concept with a playful, modern edge.' },
        { name: 'Feli', logo: 'images/logos/Feli-Logo-Black.png', desc: 'A boutique brand delivering thoughtfully designed everyday essentials.' },
        { name: 'Carina Beach Resort', logo: 'images/logos/Carina beach resort.png', desc: 'A beachfront resort offering relaxed luxury by the Arabian Sea.' },
        { name: 'Robins Ark', logo: 'images/logos/Robins-Ark(logo).png', desc: 'A charming cafe serving comfort food in a cosy, homely setting.' },
      ],
      '2024': [
        { name: 'Cravela Cafe', logo: 'images/logos/Caravel-Logo.png', desc: 'A cosy cafe corner serving all-day brews and comfort bites.' },
        { name: 'House of Hyderabad', logo: 'images/logos/The house of Hyderabad biryani.png', desc: 'Authentic Hyderabadi cuisine bringing royal flavours to Goa.' },
        { name: 'Thalassa', logo: 'images/logos/Thalassa.webp', desc: 'A cliffside Greek taverna famous for sunset views and mezze.' },
        { name: 'Patisserie Victoria', logo: 'images/logos/patisserie.png', desc: 'An artisanal patisserie crafting delicate cakes and pastries.' },
        { name: 'Purple Mint', logo: 'images/logos/Purple Mint kitchen & Bar.png', desc: 'A boutique salon and styling studio for the modern Goan.' },
        { name: 'Papillion Salon', logo: 'images/logos/Papiillon-Logo.png', desc: 'A premium salon offering styling and beauty treatments.' },
      ],
      '2025': [
        { name: 'Coco Leni', logo: 'images/logos/coco leni.png', desc: 'A boutique lifestyle brand with a breezy, coastal aesthetic.' },
        { name: 'Club Ricky\'s', logo: 'images/logos/Club-Rickys-Logo.png', desc: 'A heartfelt beach shack serving comfort food with love.' },
        { name: 'Dwarka Beach Resort', logo: 'images/logos/Dwarka.png', desc: 'A beachfront resort blending comfort with coastal charm.' },
        { name: 'Piccola Roma', logo: 'images/logos/piccola Roma.png', desc: 'An intimate Italian trattoria serving authentic Roman classics.' },
        { name: 'Bash Bistro', logo: 'images/logos/bash bistro.png', desc: 'A vibrant bistro serving globally-inspired plates and cocktails.' },
        { name: 'Finance with Akshay', logo: 'images/logos/akshay.png', desc: 'Personal finance guidance made simple and accessible.' },
        { name: 'Susegad Fragrances', logo: 'images/logos/susegad.png', desc: 'Perfumes capturing the laid-back Goan susegad spirit.' },
        { name: 'Surf House', logo: 'images/logos/Surf-house-logo.png', desc: 'A surf-and-stay resort for wave chasers and sunset lovers.' },
        { name: 'Aadhvay', logo: 'images/logos/Aadhvay.png', desc: 'A wellness and lifestyle brand rooted in holistic living.' },
      ],
      '2026': [
        { name: 'Next Level Gym', logo: 'images/logos/Next Level Gym - Logo (1).png', desc: 'A fitness studio built for serious training and real results.' },
        { name: 'Blue Heaven', logo: 'images/logos/Blue Haven Goa.png', desc: 'A tranquil beachside retreat offering an idyllic Goan escape.' },
        { name: 'Hotel Colva Plaza', logo: 'images/logos/colvaplaza.png', desc: 'A comfortable stay steps away from Colva\'s golden sands.' },
        { name: 'Inspired Salon', logo: 'images/logos/inspired salon.jpeg', desc: 'A styling studio dedicated to fresh looks and confident clients.' },
        { name: 'Cameron', logo: 'images/logos/CAMRON.png', desc: 'A contemporary lifestyle brand with a bold creative edge.' },
        { name: 'Anoushka', logo: 'images/logos/Anoshka - Logo .png', desc: 'A fashion label crafting elegant, statement-making pieces.' },
        { name: 'E Water', logo: 'images/logos/ewater.png', desc: 'A purified water brand delivering freshness across Goa.' },
      ],
  };

  YEARS.forEach(function (yr) { yr.clients = CLIENTS_BY_YEAR[yr.year] || []; });

  const tabsEl = document.getElementById('yearTabs');
  const panelsEl = document.getElementById('yearPanels');
  const CLIENTS_PER_PAGE = 4;
  const pageState = YEARS.map(function () { return 0; });

  function clientCardHTML(c) {
    return '<div class="yrc-card">' +
      '<div class="yrc-logo-wrap">' +
      '<img src="' + c.logo + '" alt="' + c.name + '" ' +
      'onerror="this.style.display=\'none\'; this.parentElement.classList.add(\'yrc-fallback\');">' +
      '<span class="yrc-fallback-text">' + c.name + '</span>' +
      '<div class="yrc-overlay"><p>' + c.desc + '</p></div>' +
      '</div>' +
      '<div class="yrc-name">' + c.name + '</div>' +
      '</div>';
  }

  function renderClientPage(yi, animateSwap) {
    const yr = YEARS[yi];
    const panel = panelsEl.children[yi];
    if (!panel) return;
    const gridEl = panel.querySelector('.yrc-grid');
    const dotsEl = panel.querySelector('.yrc-dots');
    const wrapEl = panel.querySelector('.yr-clients');
    const total = yr.clients.length;
    const pages = Math.max(1, Math.ceil(total / CLIENTS_PER_PAGE));
    const page = ((pageState[yi] % pages) + pages) % pages;
    pageState[yi] = page;

    const start = page * CLIENTS_PER_PAGE;
    const pageClients = yr.clients.slice(start, start + CLIENTS_PER_PAGE);

    function paint() {
      gridEl.innerHTML = pageClients.map(clientCardHTML).join('');
      dotsEl.innerHTML = pages > 1
        ? Array.from({ length: pages }).map(function (_, di) {
            return '<button class="yrc-dot' + (di === page ? ' active' : '') +
              '" data-page="' + di + '" aria-label="Logos page ' + (di + 1) + '"></button>';
          }).join('')
        : '';
      wrapEl.classList.toggle('single-page', pages <= 1);
    }

    if (animateSwap) {
      gridEl.classList.add('switching');
      setTimeout(function () {
        paint();
        gridEl.classList.remove('switching');
      }, 220);
    } else {
      paint();
    }
  }

  YEARS.forEach(function (yr, i) {
    const tab = document.createElement('button');
    tab.className = 'year-tab' + (i === 0 ? ' active' : '');
    tab.textContent = yr.year;
    tab.addEventListener('click', function () { switchYear(i); });
    tabsEl.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = 'year-panel' + (i === 0 ? ' active' : '');
    panel.innerHTML =
      '<div class="year-panel-header">' +
      '<div class="year-big">' + yr.year + '</div>' +
      '<div class="year-text-block">' +
      '<span class="year-tag"><i class="ri-map-pin-2-line"></i>' + yr.tag + '</span>' +
      '<h3 class="year-title">' + yr.title + '</h3>' +
      '<p class="year-body">' + yr.body + '</p>' +
      '</div>' +
      '</div>' +
      '<div class="yr-clients-wrap">' +
      '<div class="yrc-section-label"><i class="ri-team-line"></i> Clients We Worked With</div>' +
      '<div class="yr-clients" data-year-idx="' + i + '">' +
      '<button class="yrc-nav yrc-prev" aria-label="Previous logos"><i class="ri-arrow-left-s-line"></i></button>' +
      '<div class="yrc-grid"></div>' +
      '<button class="yrc-nav yrc-next" aria-label="More logos"><i class="ri-arrow-right-s-line"></i></button>' +
      '</div>' +
      '<div class="yrc-dots"></div>' +
      '</div>';
    panelsEl.appendChild(panel);
    renderClientPage(i, false);
  });

  panelsEl.addEventListener('click', function (e) {
    const nextBtn = e.target.closest('.yrc-next');
    const prevBtn = e.target.closest('.yrc-prev');
    const dotBtn = e.target.closest('.yrc-dot');
    if (!nextBtn && !prevBtn && !dotBtn) return;

    const wrap = e.target.closest('.yr-clients');
    const yi = parseInt(wrap.dataset.yearIdx, 10);
    const yr = YEARS[yi];
    const pages = Math.max(1, Math.ceil(yr.clients.length / CLIENTS_PER_PAGE));

    if (nextBtn) pageState[yi] = (pageState[yi] + 1) % pages;
    if (prevBtn) pageState[yi] = (pageState[yi] - 1 + pages) % pages;
    if (dotBtn) pageState[yi] = parseInt(dotBtn.dataset.page, 10);

    renderClientPage(yi, true);
  });

  function switchYear(idx) {
    tabsEl.querySelectorAll('.year-tab').forEach(function (t, i) {
      t.classList.toggle('active', i === idx);
    });
    panelsEl.querySelectorAll('.year-panel').forEach(function (p, i) {
      if (i === idx) {
        p.style.display = 'block';
        void p.offsetWidth;
        p.classList.add('active');
      } else {
        p.classList.remove('active');
        p.style.display = 'none';
      }
    });
    tabsEl.querySelectorAll('.year-tab')[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  tabsEl.addEventListener('keydown', function (e) {
    const tabs = Array.from(tabsEl.querySelectorAll('.year-tab'));
    const cur = tabs.findIndex(function (t) { return t.classList.contains('active'); });
    if (e.key === 'ArrowRight' && cur < tabs.length - 1) switchYear(cur + 1);
    if (e.key === 'ArrowLeft' && cur > 0) switchYear(cur - 1);
  });
})();


/* MOBILE CAROUSEL ARROWS */
(function() {
  const whoGrid = document.getElementById('whoGrid');
  const whoPrev = document.getElementById('whoPrev');
  const whoNext = document.getElementById('whoNext');
  if(whoGrid && whoPrev && whoNext) {
    whoPrev.addEventListener('click', () => {
      const cardWidth = whoGrid.querySelector('.who-card').offsetWidth + 22;
      whoGrid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
    whoNext.addEventListener('click', () => {
      const cardWidth = whoGrid.querySelector('.who-card').offsetWidth + 22;
      whoGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

  const whyGrid = document.getElementById('whyGrid');
  const whyPrev = document.getElementById('whyPrev');
  const whyNext = document.getElementById('whyNext');
  if(whyGrid && whyPrev && whyNext) {
    whyPrev.addEventListener('click', () => {
      const cardWidth = whyGrid.querySelector('.why-card').offsetWidth + 18;
      whyGrid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
    whyNext.addEventListener('click', () => {
      const cardWidth = whyGrid.querySelector('.why-card').offsetWidth + 18;
      whyGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }
})();