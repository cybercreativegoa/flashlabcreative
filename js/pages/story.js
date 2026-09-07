/* story.js — mini contact form on the Our Story page */

/* EMAILJS INIT */
emailjs.init('9AcMTpYMO7ViRTRMK');

/* STORY CONTACT FORM HANDLER */
(function () {
  const form = document.getElementById('storyContactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('story-field-name').value.trim();
    const email   = document.getElementById('story-field-email').value.trim();
    const message = document.getElementById('story-field-message').value.trim();
    const noteEl  = document.getElementById('storyFormNote');
    const btn     = document.getElementById('storyFormBtn');

    if (!name || !email) {
      noteEl.textContent = 'Please fill in your name and email.';
      noteEl.className   = 'story-cta-form-note error';
      return;
    }

    btn.disabled  = true;
    btn.innerHTML = '<i class="ri-loader-4-line"></i> Sending…';
    noteEl.textContent = '';
    noteEl.className   = 'story-cta-form-note';

    emailjs.send('service_ugavxkq', 'template_4dptoed', {
      name:    name,
      email:   email,
      mobile:  'Not provided (Story page)',
      enquiry: 'General Enquiry — Our Story page',
      message: message
    })
    .then(function () {
      const ty = document.getElementById('storyFormThankyou');
      document.getElementById('story-ty-name').textContent = ', ' + name;
      form.style.display = 'none';
      ty.classList.add('active');

      setTimeout(function () {
        ty.classList.remove('active');
        form.reset();
        form.style.display = '';
        btn.disabled  = false;
        btn.innerHTML = '<i class="ri-send-plane-fill"></i> Get In Touch';
      }, 3500);
    })
    .catch(function (err) {
      btn.disabled  = false;
      btn.innerHTML = '<i class="ri-send-plane-fill"></i> Get In Touch';
      noteEl.textContent = 'Something went wrong. Please try again.';
      noteEl.className   = 'story-cta-form-note error';
      console.error('EmailJS error:', err);
    });
  });
})();
