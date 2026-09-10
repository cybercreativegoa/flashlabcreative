# Content TODO — placeholders and unresolved facts

Everything below is either sample data I inserted so a layout would render,
or a factual contradiction that already existed on the site and needs your
decision. Grouped by how much it matters.

---

## 1. Blocking — wrong or contradictory facts currently live

### Company timeline — RESOLVED, no longer a contradiction

I originally logged this as "four different founding years". That was wrong.
The dates describe different things and the site is now consistent:

| Year | What it actually is | Where |
|---|---|---|
| 2013 | Ankith Kedar starts working with businesses on their online presence | `story.html` founder bio |
| 2014 | Anuraj Kedar starts in web/SEO/growth | `story.html` founder bio |
| **2016** | **The story starts** — the two brothers team up, idea for Flashlab is born, first project (The SouthDeck) | footer site-wide, `about.js` timeline "The Spark" |
| 2017 | Brand identity and business model built, portfolio collaborations | `about.js` timeline "Building the Blueprint" |
| **2018** | **Formally founded** — opens from a godown room in Margao, first paying clients | `about.js` timeline "Year One" |

The founder bios in `story.html` were always correct — they sit under text
reading *"Before Flashlab, Ankith worked across…"* with a
*"Selected Early Works · 2014–2016"* label. **No change needed there.**

**Changed in `about.html`:** it previously contradicted itself, with the hero
saying "10 Yrs / Since 2016" while three other places claimed the agency was
"Born / Established / Founded in 2018". Now:

- meta description → "Born in 2016"
- Chapter 01 — Origin → "The idea took shape in 2016 and formally opened its
  doors in 2018 from a modest workspace in Margao"
- Based in Margao list → "Began in 2016 and formally founded in 2018"

The `about.js` timeline was left exactly as it was — it is the one place the
2016→2017→2018 progression is spelled out properly, and it was already right.

**If you ever want a single number for schema/Google:** use 2016 for brand
age ("Since 2016", "10 Yrs") and reserve 2018 for "formally founded" phrasing.

### Years-of-experience claim — verify one number

`10+` on index, story and clients; `15+` on services and team.
With the timeline settled these mean different things:

- **10+ years** = the Flashlab story, 2016 → now. Correct as used.
- **15+ years** = Ankith's personal industry experience. His `story.html`
  bio says "Since 2013", which is 13 years — so "15+" implies work before
  2013. Confirm the figure, or change the bio date, so the two agree.

I reworded the services hero to "15+ years of **combined** industry
expertise" so it no longer reads as the company's own age.

### Client count
- services + about + index + story: **350+ clients**, **500+ projects**
- clients page logo grid: **125 logos** (a real count of what's on the page)

Both can be true. Just be aware two adjacent pages show different numbers.

### Working hours — resolved, verify
Set to **9:00am–9:00pm IST, Mon–Sat** on `connect.html` and the site-wide
footer, per your instruction. One live outlier remains:
`career.html:2478` still says *"Mon–Sat: 9am–6pm IST"* for interview
availability. Left alone in case interview hours are deliberately narrower.

---

## 2. Sample data I inserted — replace before launch

### "At a Glance" strips (3 service pages)
Search for `SAMPLE DATA, REPLACE BEFORE LAUNCH`.

- `html/services/photography-video.html`
- `html/services/media-consulting.html`
- `html/services/animation-motion.html`

Four values each: turnaround, team/format, deliverables, starting price.
The **price row shows an em-dash placeholder, not an invented figure** —
fill in a real number or delete that `.glance-item`.

### Overview image badges (same 3 pages)
Marked `<!-- SAMPLE DATA — update this badge -->`.
Currently: `2021 / Studio Since`, `2016 / Advising Since`, `48hr / Avg. First Cut`.
The 48hr figure is invented — change or remove it.

### Clients page impact stats — `clients.html`
- `850+ Projects Delivered` — **invented placeholder**
- `10+ Years Creating` — assumes 2016 founding
- `125+ Brands Partnered` — real count
- `7 Industries Served` — real count

### Instagram video testimonials — `js/pages/clients.js`
The `REELS` array at the top is empty. Paste reel permalinks in.
Placeholder cards render while `SHOW_PLACEHOLDERS = true`; the section
removes itself entirely if nothing has a URL, so it cannot ship broken.
Thumbnails must be local files in `/images/reels/` (Instagram blocks
CDN hotlinking).

---

## 3. Missing assets

### 11 logo files referenced but absent from `images/logos/`
They fall back to styled text, so nothing looks broken — but they are not logos.

`Astro.png` · `darkside.png` · `flowbase.png` · `koso.png` · `lumino.png` ·
`madrin.png` · `pronature.png` · `renew.png` · `siteman.png` ·
`spherule.png` · `Screenshot-2025-10-28-152831.png`

Flowbase, Lumino, Siteman and Spherule are common website-template filler
names — confirm which are real clients so the rest can be removed.

### Map addresses — `connect.html`
All three location cards still show **G26 Vikrant Complex**. You confirmed
Parashoot Studio and Cyber Creative have separate addresses but they were
never supplied. Cards 02 and 03 need real addresses and coordinates.

---

## 4. Decisions still open

### 6 duplicate service pages, unlinked
These exist, are now clean and valid, but are **not** in the menu or sitemap
because each competes with a live page for the same search terms:

| Orphan | Duplicates |
|---|---|
| `advertising-media.html` | digital-advertising + outdoor-print-ads |
| `digital-marketing.html` | digital-advertising + seo-sem + social-media |
| `social-media.html` | social-media-management |
| `web-technology.html` | web-app-development |
| `events-experiences.html` | event-production |
| `photography-video-animation.html` | photography-video + animation-motion |

**Options:** delete them, merge their better copy into the live page, or
publish them anyway and accept the keyword overlap. Say which and I'll do it.

### Graphic Design section — `clients.html`
Still commented out. Its six showcase panels are empty gradient placeholders
with no artwork behind them. Ready to enable once images exist.
