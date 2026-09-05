/* =========================================================
   FLASHLAB CREATIVE — Universal Header & Footer
   =========================================================
   Include this ONE file on every page, in <head>, with NO
   `defer`/`async` attribute (plain <script src="...">):

     Root-level pages (index.html, about.html, career.html, etc.):
       <script src="components.js"></script>

     One folder deep (e.g. case-studies/babs-hideout.html):
       <script src="../components.js"></script>

     Two folders deep (e.g. html/services/ecommerce.html):
       <script src="../../components.js"></script>

   It must NOT be deferred: this project's page scripts (main.js,
   page-specific scripts) run as plain synchronous <script> tags
   near the end of <body>, which execute *before* any deferred
   script would. Loading this file synchronously in <head> means
   the <site-header>/<site-footer> custom elements are already
   registered before the parser even reaches those tags in the
   page, so they render immediately — no race with main.js, which
   depends on the header/footer markup already being in the DOM
   (dropdowns, hamburger menu, theme toggle, nav-active highlight).

   Then, on every page, replace the old hardcoded header block
   (site-logo-bar + <nav class="navbar"> + mobile menu) with:

     <site-header></site-header>

   ...and the old hardcoded <footer>...</footer> block with:

     <site-footer></site-footer>

   HOW THE PATHS WORK
   ------------------
   ROOT below is the absolute URL of the folder this script lives
   in, computed from the <script> tag that loaded it (via
   document.currentScript). Every link inside the header/footer is
   built from ROOT, so it resolves correctly whether you're opening
   the file directly (file://), running a local dev server, or live
   on the real domain — the only thing that has to be right per
   page is the <script src="..."> path shown above.

   ACTIVE NAV HIGHLIGHTING
   -----------------------
   This file does NOT bake a "nav-active" class into any link.
   main.js already does that dynamically at runtime (see its
   PAGE_MAP + matchLink logic), keyed off <body data-page="...">.
   That still works unchanged — it queries the header AFTER it has
   rendered, using the same classes/ids as before.
   ========================================================= */

const ROOT = new URL('.', document.currentScript.src).href;

// <site-header>/<site-footer> are pure structural wrappers — they shouldn't
// introduce a layout box of their own (they default to `display:inline`
// like any unknown element, which would otherwise force the browser to
// anonymous-block-ify their contents). `display:contents` makes the wrapper
// invisible to layout while keeping the real DOM nesting intact.
const structuralStyle = document.createElement('style');
structuralStyle.textContent = 'site-header, site-footer { display: contents; }';
document.head.appendChild(structuralStyle);

// Fallback used by the logo <img> if flashlab-logo-dark.png fails to load.
function handleLogoError(img) {
    img.style.display = 'none';
    const span = document.createElement('span');
    span.textContent = 'FLASHLAB CREATIVE';
    span.style.cssText = 'font-family:"Bebas Neue",sans-serif;font-size:1.5rem;letter-spacing:2px;color:#fff';
    img.parentNode.appendChild(span);
}

class SiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
<div class="site-logo-bar">
    <a href="${ROOT}index.html">
        <img src="${ROOT}images/logos/flashlab-logo.png" alt="Flashlab Creative" class="logo-light" id="siteLogoImgLight">
        <img src="${ROOT}images/logos/flashlab-logo-dark.png" alt="Flashlab Creative" class="logo-dark" id="siteLogoImgDark">
    </a>
</div>

<nav class="navbar" id="navbar">
    <div class="nav-wrap">
        <ul class="nav-links" id="navLinks">
            <li><a href="${ROOT}index.html">Home</a></li>
            <li><a href="${ROOT}about.html">About Agency</a></li>
            <li>
                <a href="${ROOT}portfolio.html">Portfolio</a>
                <ul>
                    <li><a href="${ROOT}portfolio.html#port-works"><i class="ri-star-line"></i>Best Work</a></li>
                    <li><a href="${ROOT}portfolio.html#port-creative-portfolio"><i class="ri-gallery-line"></i>Our Creative Portfolio</a></li>
                </ul>
            </li>
            <li><a href="${ROOT}team.html">Team</a></li>
            <li>
                <a href="${ROOT}services.html">Services</a>
                <ul>
                    <li><a href="${ROOT}html/services/digital-advertising.html"><i class="ri-megaphone-line"></i>Digital Advertising</a></li>
                    <li><a href="${ROOT}html/services/seo-sem-marketing.html"><i class="ri-search-line"></i>SEO / SEM Marketing</a></li>
                    <li><a href="${ROOT}html/services/social-media-management.html"><i class="ri-instagram-line"></i>Social Media Management</a></li>
                    <li><a href="${ROOT}html/services/product-design-strategies.html"><i class="ri-pen-nib-line"></i>Product Design &amp; Strategies</a></li>
                    <li><a href="${ROOT}html/services/web-app-development.html"><i class="ri-code-s-slash-line"></i>Web &amp; App Development</a></li>
                    <li><a href="${ROOT}html/services/outdoor-print-ads.html"><i class="ri-image-line"></i>Outdoor &amp; Print Ads</a></li>
                    <li><a href="${ROOT}html/services/ecommerce.html"><i class="ri-shopping-cart-line"></i>E-Commerce</a></li>
                    <li><a href="${ROOT}html/services/trademark-registration.html"><i class="ri-shield-check-line"></i>Trademark Registration</a></li>
                    <li><a href="${ROOT}html/services/photography-video.html"><i class="ri-camera-line"></i>Photography &amp; Video</a></li>
                    <li><a href="${ROOT}html/services/event-production.html"><i class="ri-calendar-event-line"></i>Event Production</a></li>
                    <li><a href="${ROOT}html/services/media-consulting.html"><i class="ri-chat-voice-line"></i>Media Consulting</a></li>
                    <li><a href="${ROOT}html/services/animation-motion.html"><i class="ri-video-line"></i>Animation &amp; Motion</a></li>
                </ul>
            </li>
            <li><a href="${ROOT}clients.html">Clients</a></li>
            <li>
                <a href="${ROOT}career.html">Careers</a>
                <ul>
                    <li><a href="${ROOT}html/career/internship.html"><i class="ri-user-add-line"></i>Internship</a></li>
                    <li><a href="${ROOT}html/career/join-fulltime.html"><i class="ri-briefcase-4-line"></i>Join Full Time</a></li>
                    <li><a href="${ROOT}html/career/freelance.html"><i class="ri-computer-line"></i>Freelance</a></li>
                    <li><a href="${ROOT}html/career/influencer-signup.html"><i class="ri-star-line"></i>Influencer Sign Up</a></li>
                    <li><a href="${ROOT}html/career/hr-policy.html"><i class="ri-file-list-3-line"></i>HR Policy</a></li>
                </ul>
            </li>
            <li><a href="${ROOT}connect.html">Connect</a></li>
        </ul>
        <div class="nav-controls">
            <a href="${ROOT}connect.html" class="nav-cta">Start a Project <i class="ri-arrow-right-up-line"></i></a>
            <button type="button" class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                <i class="ri-sun-line" id="themeIcon"></i>
            </button>
            <button type="button" class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
        </div>
    </div>
</nav>

<div class="mob-overlay" id="mobOverlay"></div>
<div class="mob-menu" id="mobMenu" aria-hidden="true">
    <button class="mob-close" id="mobClose" aria-label="Close menu"><i class="ri-close-line"></i></button>
    <ul class="mob-links">
        <li><a href="${ROOT}index.html">Home</a></li>
        <li><a href="${ROOT}about.html">About Agency</a></li>
        <li>
            <button class="mob-parent-btn" data-target="mob-sub-portfolio">Portfolio <i class="ri-arrow-down-s-line mob-arrow"></i></button>
            <ul class="mob-sub" id="mob-sub-portfolio">
                <li><a href="${ROOT}portfolio.html#port-works">Best Work</a></li>
                <li><a href="${ROOT}portfolio.html#port-creative-portfolio">Our Creative Portfolio</a></li>
            </ul>
        </li>
        <li><a href="${ROOT}team.html">Team</a></li>
        <li>
            <button class="mob-parent-btn" data-target="mob-sub-services">Services <i class="ri-arrow-down-s-line mob-arrow"></i></button>
            <ul class="mob-sub" id="mob-sub-services">
                <li><a href="${ROOT}html/services/digital-advertising.html">Digital Advertising</a></li>
                <li><a href="${ROOT}html/services/seo-sem-marketing.html">SEO / SEM Marketing</a></li>
                <li><a href="${ROOT}html/services/social-media-management.html">Social Media Management</a></li>
                <li><a href="${ROOT}html/services/product-design-strategies.html">Product Design &amp; Strategies</a></li>
                <li><a href="${ROOT}html/services/web-app-development.html">Web &amp; App Development</a></li>
                <li><a href="${ROOT}html/services/outdoor-print-ads.html">Outdoor &amp; Print Ads</a></li>
                <li><a href="${ROOT}html/services/ecommerce.html">E-Commerce</a></li>
                <li><a href="${ROOT}html/services/trademark-registration.html">Trademark Registration</a></li>
                <li><a href="${ROOT}html/services/photography-video.html">Photography &amp; Video</a></li>
                <li><a href="${ROOT}html/services/event-production.html">Event Production</a></li>
                <li><a href="${ROOT}html/services/media-consulting.html">Media Consulting</a></li>
                <li><a href="${ROOT}html/services/animation-motion.html">Animation &amp; Motion</a></li>
            </ul>
        </li>
        <li><a href="${ROOT}clients.html">Clients</a></li>
        <li>
            <button class="mob-parent-btn" data-target="mob-sub-career">Careers <i class="ri-arrow-down-s-line mob-arrow"></i></button>
            <ul class="mob-sub" id="mob-sub-career">
                <li><a href="${ROOT}html/career/internship.html">Internship</a></li>
                <li><a href="${ROOT}html/career/join-fulltime.html">Join Full Time</a></li>
                <li><a href="${ROOT}html/career/freelance.html">Freelance</a></li>
                <li><a href="${ROOT}html/career/influencer-signup.html">Influencer Sign Up</a></li>
                <li><a href="${ROOT}html/career/hr-policy.html">HR Policy</a></li>
            </ul>
        </li>
        <li><a href="${ROOT}connect.html">Connect</a></li>
    </ul>
    <div class="mob-cta-wrap">
        <a href="${ROOT}connect.html" class="mob-cta">Start a Project <i class="ri-arrow-right-up-line"></i></a>
    </div>
</div>
        `;
    }
}

customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
<footer class="footer">

    <div class="wrap footer-grid">

        <!-- FOOTER BRAND -->
        <div class="footer-brand">
            <div class="footer-logo">
                <a href="${ROOT}index.html">
                    <img src="${ROOT}images/logos/flashlab-logo-dark.png" alt="Flashlab Creative" onerror="handleLogoError(this)">
                </a>
            </div>

            <p>
                Goa's leading creative &amp; digital marketing agency where imagination meets reality.
                Born in Margao in 2016, we craft unforgettable digital experiences for brands that dare to stand out.
                From branding and web development to social media, advertising and full-scale production,
                we blend creativity and strategy to help brands connect.
            </p>

            <div class="footer-socials">
                <a href="https://www.instagram.com/flashlab.creative" target="_blank" rel="noopener"><i class="ri-instagram-fill"></i></a>
                <a href="https://www.facebook.com/flashlab.creative/" target="_blank" rel="noopener"><i class="ri-facebook-fill"></i></a>
                <a href="https://www.linkedin.com/company/flashlabcreative" target="_blank" rel="noopener"><i class="ri-linkedin-fill"></i></a>
                <a href="https://twitter.com/theflashlab" target="_blank" rel="noopener"><i class="ri-twitter-x-fill"></i></a>
                <a href="https://www.youtube.com/channel/UCuFtcVt_Yp9CZ82UG6pm-pg" target="_blank" rel="noopener"><i class="ri-youtube-fill"></i></a>
            </div>
        </div>

        <!-- NAVIGATION -->
        <div class="hide-on-mobile">
            <h4 class="footer-head">Navigation</h4>
            <ul class="footer-list">
                <li><a href="${ROOT}about.html"><i class="ri-arrow-right-s-line"></i>About</a></li>
                <li><a href="${ROOT}services.html"><i class="ri-arrow-right-s-line"></i>Services</a></li>
                <li><a href="${ROOT}portfolio.html"><i class="ri-arrow-right-s-line"></i>Portfolio</a></li>
                <li><a href="${ROOT}clients.html"><i class="ri-arrow-right-s-line"></i>Clients</a></li>
                <li><a href="${ROOT}team.html"><i class="ri-arrow-right-s-line"></i>Teams</a></li>
                <li><a href="${ROOT}career.html"><i class="ri-arrow-right-s-line"></i>Careers</a></li>
                <li><a href="${ROOT}connect.html"><i class="ri-arrow-right-s-line"></i>Connect</a></li>
            </ul>
        </div>

        <!-- SERVICES -->
        <div class="hide-on-mobile">
            <h4 class="footer-head">Services</h4>
            <ul class="footer-list">
                <li><a href="${ROOT}html/services/outdoor-print-ads.html"><i class="ri-arrow-right-s-line"></i>Outdoor &amp; Print</a></li>
                <li><a href="${ROOT}html/services/digital-advertising.html"><i class="ri-arrow-right-s-line"></i>Digital Advertising</a></li>
                <li><a href="${ROOT}html/services/seo-sem-marketing.html"><i class="ri-arrow-right-s-line"></i>SEO / SEM</a></li>
                <li><a href="${ROOT}html/services/social-media-management.html"><i class="ri-arrow-right-s-line"></i>Social Media</a></li>
                <li><a href="${ROOT}html/services/product-design-strategies.html"><i class="ri-arrow-right-s-line"></i>Product Design</a></li>
                <li><a href="${ROOT}html/services/web-app-development.html"><i class="ri-arrow-right-s-line"></i>Web &amp; App Dev</a></li>
                <li><a href="${ROOT}html/services/ecommerce.html"><i class="ri-arrow-right-s-line"></i>E-Commerce</a></li>
                <li><a href="${ROOT}html/services/event-production.html"><i class="ri-arrow-right-s-line"></i>Event Production</a></li>
            </ul>
        </div>

        <!-- JOIN US -->
        <div class="hide-on-mobile">
            <h4 class="footer-head">Join Us</h4>
            <ul class="footer-list">
                <li><a href="${ROOT}career.html#open-positions" data-open-role="intern"><i class="ri-arrow-right-s-line"></i>Intern</a></li>
                <li><a href="${ROOT}career.html#open-positions" data-open-role="seo-expert"><i class="ri-arrow-right-s-line"></i>SEO Expert</a></li>
                <li><a href="${ROOT}career.html#open-positions" data-open-role="social-media-manager"><i class="ri-arrow-right-s-line"></i>Social Media Manager</a></li>
                <li><a href="${ROOT}career.html#open-positions" data-open-role="graphic-designer"><i class="ri-arrow-right-s-line"></i>Graphic Designer</a></li>
                <li><a href="${ROOT}career.html#open-positions" data-open-role="web-developer"><i class="ri-arrow-right-s-line"></i>Web Developer</a></li>
                <li><a href="${ROOT}career.html#open-positions" data-open-role="animation-designer"><i class="ri-arrow-right-s-line"></i>Animation Designer</a></li>
                <li><a href="${ROOT}career.html#open-positions" data-open-role="app-developer"><i class="ri-arrow-right-s-line"></i>App Developer</a></li>
            </ul>
        </div>

        <!-- SERVICE LINKS -->
        <div class="hide-on-mobile">
            <h4 class="footer-head">Service Links</h4>
            <ul class="footer-list">
                <li><a href="${ROOT}team.html"><i class="ri-arrow-right-s-line"></i>Team Blogs</a></li>
                <li><a href="https://parashootstudio.com" target="_blank" rel="noopener"><i class="ri-arrow-right-s-line"></i>Production</a></li>
                <li><a href="https://backstagexchange.com" target="_blank" rel="noopener"><i class="ri-arrow-right-s-line"></i>Event Management</a></li>
                <li><a href="https://Strobenightlife.com" target="_blank" rel="noopener"><i class="ri-arrow-right-s-line"></i>Strobe Nightlife</a></li>
                <li><a href="https://www.cybercreative.in" target="_blank" rel="noopener"><i class="ri-arrow-right-s-line"></i>Web Development &amp; IoT</a></li>
            </ul>
        </div>

        <!-- CONTACT -->
        <div>
            <h4 class="footer-head">Contact</h4>
            <div class="footer-contact">
                <p>
                    <i class="ri-map-pin-2-fill"></i>
                    <a href="https://www.google.com/maps/search/Flashlab+Creative+Margao+Goa" target="_blank" rel="noopener">
                        G26 Vikrant Complex,<br>Margao, Goa, India
                    </a>
                </p>
                <p>
                    <i class="ri-phone-fill"></i>
                    <a href="tel:+919923580023">+91 99235 80023</a>
                </p>
                <p>
                    <i class="ri-mail-fill"></i>
                    <a href="mailto:contact@flashlabcreative.com">contact@flashlabcreative.com</a>
                </p>
                <p>
                    <i class="ri-time-fill"></i>
                    <span>Mon – Sat: 9am – 6pm IST</span>
                </p>
                <a href="${ROOT}connect.html" class="footer-cta">Start a Project <i class="ri-arrow-right-line"></i></a>
            </div>
        </div>

    </div>

    <!-- FOOTER BOTTOM -->
    <div class="footer-bottom">
        <p class="footer-copy">
            Copyright &copy; 2026
            <a href="${ROOT}index.html" class="flashlab-link">Flashlab Creative</a>
        </p>
        <p class="footer-credit">
            Website Crafted by
            <a href="https://cybercreative.in/" target="_blank" rel="noopener" class="cyber-link">Cyber Creative</a>
        </p>
    </div>

</footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);
