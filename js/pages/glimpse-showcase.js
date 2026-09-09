/* glimpse-showcase.js
   Manual prev/next controls for the influencer & celebrity
   collaboration slider on the homepage (no auto-advance — this
   block wasn't asked to auto-play, just to be swipeable/scrollable
   like the reference "Previously Booked" artist slider). */

(function () {
  'use strict';

  const track   = document.getElementById('influencerTrack');
  const prevBtn = document.getElementById('inflPrev');
  const nextBtn = document.getElementById('inflNext');
  if (!track) return;

  function step() {
    const cards = track.querySelectorAll('.infl-card');
    if (!cards.length) return 0;
    if (cards.length < 2) return cards[0].offsetWidth;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });
  }
})();
