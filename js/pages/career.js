/* career.js — Career page scripts */

/* RESUME UPLOAD HANDLER */
function handleResumeUpload(input, chosenId) {
  const chosenEl = document.getElementById(chosenId);
  if (!chosenEl) return;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      input.value = '';
      chosenEl.classList.remove('visible');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB.');
      input.value = '';
      chosenEl.classList.remove('visible');
      return;
    }
    chosenEl.querySelector('span').textContent = file.name;
    chosenEl.classList.add('visible');
  } else {
    chosenEl.classList.remove('visible');
  }
}

/* RESUME FILE INPUT — event delegation */
document.addEventListener('change', function (e) {
  const input = e.target;
  if (input.type === 'file' && input.dataset.resumeChosen) {
    handleResumeUpload(input, input.dataset.resumeChosen);
  }
});

/* DRAG OVER VISUAL FEEDBACK */
document.querySelectorAll('.resume-upload-zone').forEach(function (zone) {
  zone.addEventListener('dragover', function (e) { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', function () { zone.classList.remove('dragover'); });
  zone.addEventListener('drop', function () { zone.classList.remove('dragover'); });
});

/* ROLE SELECTOR */
function selectRole(role, el) {
  document.querySelectorAll('.pos-menu-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.pos-detail').forEach(d => d.classList.remove('active'));
  const panel = document.getElementById('role-' + role);
  if (panel) {
    panel.classList.add('active');
    if (window.innerWidth < 960) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/* TOGGLE JOB DETAILS */
function toggleDetails(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const isOpen = el.classList.contains('open');
  el.closest('.pos-detail').querySelectorAll('.pos-expanded').forEach(e => e.classList.remove('open'));
  if (!isOpen) {
    el.classList.add('open');
    if (btn) btn.innerHTML = 'Hide Details <i class="ri-arrow-up-s-line"></i>';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    if (btn) btn.innerHTML = 'View Job Details <i class="ri-arrow-down-s-line"></i>';
  }
}

/* TOGGLE APPLICATION FORM */
function toggleForm(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const isOpen = el.classList.contains('open');
  el.closest('.pos-detail').querySelectorAll('.pos-form-wrap').forEach(f => f.classList.remove('open'));
  if (!isOpen) {
    el.classList.add('open');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* WHATSAPP SENDER HELPER */
const WA_PHONE = '919923580023';

function sendToWhatsApp(messageText) {
  const url = 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(messageText);
  const win = window.open(url, '_blank');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = url;
  }
}

/* POSITION APPLICATION FORM SUBMIT */
function submitForm(e, position) {
  e.preventDefault();
  const form = e.target;
  const get = (n) => { const el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
  const getVal = (n) => { const v = get(n); return (v && v !== '—') ? v : null; };

  let body = '*New Career Application — Flashlab Creative*\n\n' +
    '*Position:* ' + position + '\n' +
    '*Name:* ' + get('fname') + ' ' + get('lname') + '\n' +
    '*Email:* ' + get('email') + '\n' +
    '*Phone:* ' + get('phone') + '\n';

  if (getVal('city')) body += '*City:* ' + getVal('city') + '\n';
  if (getVal('college')) body += '*College:* ' + getVal('college') + '\n';
  if (getVal('course')) body += '*Course:* ' + getVal('course') + '\n';
  if (getVal('graduation')) body += '*Graduation Year:* ' + getVal('graduation') + '\n';
  if (getVal('interest')) body += '*Area of Interest:* ' + getVal('interest') + '\n';

  const exp = getVal('exp') || getVal('software') || getVal('stack') || getVal('tools') || getVal('framework') || getVal('platforms');
  if (exp) body += '*Skills / Experience:* ' + exp + '\n';
  if (getVal('prev')) body += '*Previous Job Title:* ' + getVal('prev') + '\n';
  if (getVal('duration')) body += '*Duration:* ' + getVal('duration') + '\n';
  if (getVal('fulltime')) body += '*Open to Full-Time:* ' + getVal('fulltime') + '\n';
  if (getVal('start')) body += '*When Can Start:* ' + getVal('start') + '\n';
  if (getVal('portfolio')) body += '*Portfolio:* ' + getVal('portfolio') + '\n';
  if (getVal('instagram')) body += '*Instagram:* ' + getVal('instagram') + '\n';
  if (getVal('linkedin')) body += '*LinkedIn:* ' + getVal('linkedin') + '\n';
  if (getVal('why')) body += '*Why Flashlab:* ' + getVal('why') + '\n';
  if (getVal('heard')) body += '*Heard From:* ' + getVal('heard') + '\n';

  const resumeInput = form.querySelector('[name="resume"]');
  if (resumeInput && resumeInput.files && resumeInput.files.length > 0) {
    body += '*Resume File:* ' + resumeInput.files[0].name + ' (will share on chat)\n';
  }

  body += '\n_Submitted via flashlabcreative.com/career.html_';

  sendToWhatsApp(body);
}

/* OPEN APPLICATION FORM TOGGLE */
function toggleOpenForm() {
  const form = document.getElementById('open-application-form');
  const isOpen = form.classList.contains('open');
  if (isOpen) {
    form.classList.remove('open');
  } else {
    form.classList.add('open');
    setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }
}

/* OPEN ROLE TYPE HANDLER */
function handleOpenRoleType(val) {
  document.getElementById('open-internship-fields').style.display = val === 'internship' ? '' : 'none';
  document.getElementById('open-fulltime-fields').style.display   = val === 'fulltime'   ? '' : 'none';
}

/* OPEN FORM SUBMIT */
function submitOpenForm(e) {
  e.preventDefault();
  const form = e.target;
  const get = (n) => { const el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
  const getVal = (n) => { const v = get(n); return (v && v !== '—') ? v : null; };

  let body = '*Open Application — Flashlab Creative*\n\n' +
    '*Name:* ' + get('fname') + ' ' + get('lname') + '\n' +
    '*Email:* ' + get('email') + '\n' +
    '*Phone:* ' + get('phone') + '\n';

  if (getVal('city')) body += '*City:* ' + getVal('city') + '\n';
  if (getVal('role_type')) body += '*Role Type:* ' + getVal('role_type') + '\n';
  if (getVal('role_name')) body += '*Role Applied For:* ' + getVal('role_name') + '\n';
  if (getVal('intern_duration')) body += '*Internship Duration:* ' + getVal('intern_duration') + '\n';
  if (getVal('convert_fulltime')) body += '*Open to Full-Time:* ' + getVal('convert_fulltime') + '\n';
  if (getVal('notice')) body += '*Notice Period / Start:* ' + getVal('notice') + '\n';
  if (getVal('salary')) body += '*Expected Salary:* ' + getVal('salary') + '\n';
  if (getVal('why_role')) body += '*Why This Role:* ' + getVal('why_role') + '\n';
  if (getVal('company_benefit')) body += '*How Company Benefits:* ' + getVal('company_benefit') + '\n';
  if (getVal('portfolio')) body += '*Portfolio / Resume Link:* ' + getVal('portfolio') + '\n';
  if (getVal('instagram')) body += '*Instagram:* ' + getVal('instagram') + '\n';
  if (getVal('linkedin')) body += '*LinkedIn:* ' + getVal('linkedin') + '\n';
  if (getVal('heard')) body += '*Heard From:* ' + getVal('heard') + '\n';

  const resumeInput = form.querySelector('[name="resume"]');
  if (resumeInput && resumeInput.files && resumeInput.files.length > 0) {
    body += '*Resume File:* ' + resumeInput.files[0].name + ' (will share on chat)\n';
  }

  body += '\n_Submitted via flashlabcreative.com/career.html_';

  sendToWhatsApp(body);
}

/* FAQ TOGGLE */
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  if (!isOpen) {
    el.classList.add('open');
    answer.classList.add('open');
  }
}

/* EVENT DELEGATION — all button/click handlers */
document.addEventListener('click', function (e) {
  /* Role menu items */
  const menuItem = e.target.closest('.pos-menu-item[data-role]');
  if (menuItem) { selectRole(menuItem.dataset.role, menuItem); return; }

  /* Toggle details */
  const toggleDetails_btn = e.target.closest('[data-toggle-details]');
  if (toggleDetails_btn) { toggleDetails(toggleDetails_btn.dataset.toggleDetails, toggleDetails_btn); return; }

  /* Open application form */
  const toggleForm_btn = e.target.closest('[data-toggle-form]');
  if (toggleForm_btn) { toggleForm(toggleForm_btn.dataset.toggleForm, toggleForm_btn); return; }

  /* Close application form */
  const closeForm_btn = e.target.closest('[data-close-form]');
  if (closeForm_btn) { toggleForm(closeForm_btn.dataset.closeForm, null); return; }

  /* FAQ toggle */
  const faqQ = e.target.closest('.faq-q');
  if (faqQ) { toggleFaq(faqQ); return; }

  /* Open application form toggle */
  const openFormBtn = e.target.closest('[data-toggle-open-form]');
  if (openFormBtn) { toggleOpenForm(); return; }
});

/* FORM SUBMIT — event delegation */
document.addEventListener('submit', function (e) {
  /* Position-specific form */
  if (e.target.dataset.position) { submitForm(e, e.target.dataset.position); return; }

  /* Open application form */
  if (e.target.hasAttribute('data-open-form')) { submitOpenForm(e); return; }
});

/* OPEN ROLE TYPE SELECT — direct bind */
const openRoleTypeSelect = document.getElementById('openRoleType');
if (openRoleTypeSelect) {
  openRoleTypeSelect.addEventListener('change', function () { handleOpenRoleType(this.value); });
}

/* POSITION FILTER TABS */
document.querySelectorAll('.pos-filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pos-filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.pos-menu-item[data-type]').forEach(item => {
      item.style.display = (filter === 'all' || item.dataset.type === filter) ? '' : 'none';
    });
    document.querySelectorAll('.pos-menu-group-label[data-group]').forEach(label => {
      label.style.display = (filter === 'all' || label.dataset.group === filter) ? '' : 'none';
    });
  });
});

/* SESSIONSSTORAGE — pre-select role from footer links */
(function () {
  const role = sessionStorage.getItem('openRole');
  if (!role) return;
  sessionStorage.removeItem('openRole');
  window.addEventListener('load', function () {
    const menuItem = document.querySelector('.pos-menu-item[data-role="' + role + '"]');
    if (menuItem) {
      selectRole(role, menuItem);
      setTimeout(function () {
        const section = document.getElementById('open-positions');
        if (section) {
          const nb = document.getElementById('navbar');
          const offset = nb ? nb.offsetHeight + 8 : 0;
          window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }
      }, 100);
    }
  });
})();
