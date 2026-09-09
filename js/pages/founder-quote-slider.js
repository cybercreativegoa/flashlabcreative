/* founder-quote-slider.js
   Auto-sliding, infinite-loop carousel for the founder & team quote cards
   on the homepage.

   How the infinite loop works: a duplicate set of the real cards is
   appended after the originals. Auto-advance always animates forward;
   once it scrolls past the last real card into its (identical-looking)
   clone, the track is silently snapped back — with no animation — to the
   matching real position. Because the clone is pixel-identical to the
   real card, that snap is invisible, so the carousel appears to scroll
   forward forever. Manual swipe/drag (native scrolling) is also kept in
   sync and gets the same silent correction if it's dragged into the
   cloned tail. */

(function () {
  'use strict';

  const section = document.getElementById('founderQuoteSlider');
  const track   = document.getElementById('fqTrack');
  if (!section || !track) return;

  const realCards = Array.from(track.querySelectorAll('.founder-quote'));
  if (!realCards.length) return;
  const realCount = realCards.length;

  // Append a duplicate set of cards for the seamless forward loop.
  realCards.forEach(function (card) {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    track.appendChild(clone);
  });
  const allCards = Array.from(track.children);

  const dotsEl  = document.getElementById('fqDots');
  const prevBtn = document.getElementById('fqPrev');
  const nextBtn = document.getElementById('fqNext');

  const AUTO_DELAY = 5000;
  const SCROLL_MS  = 600;
  let autoTimer  = null;
  let isHovering = false;
  let animating  = false;
  let index      = 0; // rests at 0..realCount-1; briefly index+1 mid-animation

  // One dot per real card
  let dots = [];
  if (dotsEl) {
    realCards.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'fq-dot';
      dot.setAttribute('aria-label', 'Go to quote ' + (i + 1));
      dot.addEventListener('click', function () {
        goToReal(i);
        restartAuto();
      });
      dotsEl.appendChild(dot);
    });
    dots = Array.from(dotsEl.children);
  }

  function cardStep() {
    return allCards.length > 1
      ? allCards[1].offsetLeft - allCards[0].offsetLeft
      : allCards[0].offsetWidth;
  }

  function updateDots() {
    const active = ((index % realCount) + realCount) % realCount;
    dots.forEach(function (d, i) { d.classList.toggle('active', i === active); });
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animateTo(rawTarget, onDone) {
    const startLeft  = track.scrollLeft;
    const targetLeft = rawTarget * cardStep();
    const delta      = targetLeft - startLeft;
    const startTime  = performance.now();
    animating = true;

    function step(now) {
      const t = Math.min(1, (now - startTime) / SCROLL_MS);
      track.scrollLeft = startLeft + delta * easeInOutQuad(t);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        animating = false;
        if (onDone) onDone();
      }
    }
    requestAnimationFrame(step);
  }

  // Always moves forward. May animate into the cloned tail, then
  // silently resets to the matching real position (invisible jump).
  function advanceForward() {
    if (isHovering || animating) return;
    const raw = index + 1;
    animateTo(raw, function () {
      index = raw;
      if (index >= realCount) {
        index -= realCount;
        track.scrollLeft = index * cardStep();
      }
      updateDots();
    });
  }

  // Jumps directly to a real card index — used by dots and the prev arrow.
  function goToReal(i) {
    if (animating) return;
    const target = ((i % realCount) + realCount) % realCount;
    animateTo(target, function () {
      index = target;
      updateDots();
    });
  }

  function restartAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(advanceForward, AUTO_DELAY);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToReal(index - 1);
      restartAuto();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      advanceForward();
      restartAuto();
    });
  }

  // Pause auto-advance while the pointer is over the carousel
  section.addEventListener('mouseenter', function () { isHovering = true; });
  section.addEventListener('mouseleave', function () { isHovering = false; });

  // Keep index/dots in sync with manual touch/drag scrolling, and
  // silently correct if a manual swipe lands in the cloned tail.
  let scrollTimeout;
  track.addEventListener('scroll', function () {
    if (animating) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      const s = cardStep();
      if (!s) return;
      let raw = Math.round(track.scrollLeft / s);
      if (raw >= realCount) {
        raw -= realCount;
        track.scrollLeft = raw * s;
      }
      index = Math.max(0, Math.min(realCount - 1, raw));
      updateDots();
    }, 120);
  }, { passive: true });

  window.addEventListener('resize', function () {
    track.scrollLeft = index * cardStep();
  });

  updateDots();
  restartAuto();
})();
