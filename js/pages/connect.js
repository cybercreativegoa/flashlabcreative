/* connect.js — Contact page scripts */

/* HERO IMAGE PLACEHOLDER */
(function () {
  const imgEl = document.querySelector('.hero-image-frame img');
  const defaultPh = document.getElementById('hero-placeholder-default');
  if (imgEl) {
    imgEl.addEventListener('load', () => { if (defaultPh) defaultPh.style.display = 'none'; });
    imgEl.addEventListener('error', () => { imgEl.style.display = 'none'; if (defaultPh) defaultPh.style.display = 'flex'; });
  }
})();

/* SIDEBAR SOCIAL LINKS — hover effects */
(function () {
  const socialLinks = document.querySelectorAll('.sidebar-social-link');
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.borderColor = 'var(--accent)';
      link.style.color = 'var(--accent)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.borderColor = 'rgba(255,255,255,0.2)';
      link.style.color = 'var(--muted)';
    });
    link.addEventListener('focus', () => {
      link.style.borderColor = 'var(--accent)';
      link.style.color = 'var(--accent)';
    });
    link.addEventListener('blur', () => {
      link.style.borderColor = 'rgba(255,255,255,0.2)';
      link.style.color = 'var(--muted)';
    });
  });
})();

/* MAP CARD BUTTONS — hover effects */
(function () {
  const accent2Btns = document.querySelectorAll('.map-card-btn-accent2');
  accent2Btns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'var(--accent2)';
      btn.style.color = '#fff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(245,109,67,0.1)';
      btn.style.color = 'var(--accent2)';
    });
  });

  const indigoBtns = document.querySelectorAll('.map-card-btn-indigo');
  indigoBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#6366f1';
      btn.style.color = '#fff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(99,102,241,0.1)';
      btn.style.color = '#6366f1';
    });
  });
})();

/* EMAILJS INIT */
emailjs.init('9AcMTpYMO7ViRTRMK');

/* CONTACT FORM HANDLER */
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name    = document.getElementById('field-name').value.trim();
  const mobile  = document.getElementById('field-mobile').value.trim();
  const email   = document.getElementById('field-email').value.trim();
  const enquiry = document.getElementById('field-enquiry').value;
  const message = document.getElementById('field-message').value.trim();
  const noteEl  = document.getElementById('formNote');
  const btn     = document.getElementById('formBtn');

  if (!name || !mobile || !email || !enquiry) {
    noteEl.textContent = 'Please fill in all required fields.';
    noteEl.className   = 'form-note error';
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    noteEl.textContent = 'Please enter a valid email address.';
    noteEl.className   = 'form-note error';
    return;
  }

  // Validate phone number (basic: 7-15 digits)
  const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
  if (!phoneRegex.test(mobile)) {
    noteEl.textContent = 'Please enter a valid phone number.';
    noteEl.className   = 'form-note error';
    return;
  }

  btn.disabled    = true;
  btn.innerHTML   = '<i class="ri-loader-4-line"></i> Opening WhatsApp…';
  noteEl.textContent = '';
  noteEl.className   = 'form-note';

  // Format enquiry message for WhatsApp (+91 99235 80023)
  const waNumber = '919923580023';
  let waText = '*New Website Enquiry — Flashlab Creative*\n\n' +
    '*Name:* ' + name + '\n' +
    '*Mobile:* ' + mobile + '\n' +
    '*Email:* ' + email + '\n' +
    '*Enquiry Type:* ' + enquiry + '\n';
  if (message) {
    waText += '*Message:* ' + message + '\n';
  }
  waText += '\n_Sent via flashlabcreative.com/connect.html_';

  const waUrl = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(waText);

  // Background backup via EmailJS if initialized
  try {
    if (typeof emailjs !== 'undefined' && emailjs.send) {
      emailjs.send('service_ugavxkq', 'template_4dptoed', {
        name:    name,
        email:   email,
        mobile:  mobile,
        enquiry: enquiry,
        message: message
      }).catch(function (err) {
        console.warn('Backup EmailJS note:', err);
      });
    }
  } catch (err) {
    // ignore
  }

  // Open WhatsApp in new tab, fallback to same window
  const win = window.open(waUrl, '_blank');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = waUrl;
  }

  const form = document.getElementById('contactForm');
  const ty   = document.getElementById('formThankyou');
  document.getElementById('ty-name').textContent = name;
  form.style.display = 'none';
  ty.classList.add('active');

  setTimeout(function () {
    ty.classList.add('leaving');
    setTimeout(function () {
      ty.classList.remove('active', 'leaving');
      form.reset();
      form.style.display = '';
      btn.disabled  = false;
      btn.innerHTML = 'Submit';
    }, 500);
  }, 4000);
});
