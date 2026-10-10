/* career.js — Career page scripts */

/* RESUME UPLOAD HANDLER */
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB restriction

function handleResumeUpload(input, chosenId) {
  const chosenEl = document.getElementById(chosenId);
  if (!chosenEl) return;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      alert('Please upload a PDF file only.');
      input.value = '';
      chosenEl.classList.remove('visible');
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert('File size must be under 2MB.');
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

/* EMAIL RECIPIENTS & SUBMISSION HANDLER */
const CAREER_TARGET_EMAIL = 'careers@flashlabcreative.com';
const CAREER_CC_EMAIL     = 'flashlabhr@gmail.com';

function showFormStatus(form, type, message) {
  let statusEl = form.querySelector('.form-status-msg');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.className = 'form-status-msg';
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.parentNode.insertBefore(statusEl, submitBtn.nextSibling);
    } else {
      form.appendChild(statusEl);
    }
  }
  statusEl.className = 'form-status-msg active ' + type;
  statusEl.innerHTML = message;
}

function clearFormStatus(form) {
  const statusEl = form.querySelector('.form-status-msg');
  if (statusEl) {
    statusEl.className = 'form-status-msg';
    statusEl.innerHTML = '';
  }
}

async function sendCareerEmail(form, subject, fields, resumeFile) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Submitting Application…';
  }
  clearFormStatus(form);

  const formData = new FormData();
  formData.append('_cc', CAREER_CC_EMAIL);
  formData.append('_subject', subject);
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');

  if (fields.Email) {
    formData.append('_replyto', fields.Email);
  }

  // Append all enquiry fields
  for (const [key, val] of Object.entries(fields)) {
    if (val !== null && val !== undefined && val !== '') {
      formData.append(key, val);
    }
  }

  // Mandatory document validation
  if (!resumeFile) {
    showFormStatus(form, 'error', '<i class="ri-error-warning-fill"></i> Please upload your resume (PDF format, Max 2MB).');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
    return;
  }

  if (resumeFile.size > MAX_FILE_SIZE_BYTES) {
    showFormStatus(form, 'error', '<i class="ri-error-warning-fill"></i> Uploaded document exceeds 2MB limit. Please upload a file under 2MB.');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
    return;
  }
  formData.append('attachment', resumeFile, resumeFile.name);

  try {
    let response = null;
    let data = null;

    // 1. Try native server mailer first (for production hosting where PHP is available)
    try {
      response = await fetch('career-apply.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });
      if (response && response.ok) {
        data = await response.json().catch(() => null);
      }
    } catch (phpErr) {
      // Local development or PHP server unavailable
    }

    // 2. If career-apply.php is unavailable (e.g. testing locally on Python server), fallback seamlessly to FormSubmit with attachment
    if (!response || !response.ok || (data && data.success !== true && data.success !== 'true')) {
      response = await fetch('https://formsubmit.co/' + CAREER_TARGET_EMAIL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });
      data = await response.json().catch(() => null);
    }

    if (response && (response.ok || (data && (data.success === 'true' || data.success === true || (data.message && data.message.includes('Activation')))))) {
      showFormStatus(
        form,
        'success',
        '<i class="ri-checkbox-circle-fill"></i> <strong>Application Sent Successfully!</strong><br>Thank you for reaching out. Your application and attached document have been received. Our team will review your details soon.'
      );
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="ri-check-line"></i> Submitted!';
      }

      // Reset form after delay
      setTimeout(() => {
        form.reset();
        const chosen = form.querySelector('.resume-file-chosen');
        if (chosen) {
          chosen.classList.remove('visible');
          const span = chosen.querySelector('span');
          if (span) span.textContent = '';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }, 4000);
    } else {
      const errMsg = (data && data.message && !data.message.includes('@')) ? data.message : 'Failed to send application. Please try again.';
      showFormStatus(form, 'error', '<i class="ri-error-warning-fill"></i> ' + errMsg);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  } catch (err) {
    console.error('Career application submission error:', err);
    showFormStatus(
      form,
      'error',
      '<i class="ri-error-warning-fill"></i> Network error while sending enquiry. Please check your internet connection and try again.'
    );
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }
}

/* POSITION APPLICATION FORM SUBMIT */
function submitForm(e, position) {
  e.preventDefault();
  const form = e.target;
  const get = (n) => { const el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
  const getVal = (n) => { const v = get(n); return (v && v !== '—') ? v : null; };

  const fname = get('fname');
  const lname = get('lname');
  const fullName = (fname + ' ' + lname).trim();
  const email = get('email');
  const phone = get('phone');

  const exp = getVal('exp') || getVal('software') || getVal('stack') || getVal('tools') || getVal('framework') || getVal('platforms');

  const fields = {
    'Position Applied': position,
    'Candidate Name': fullName,
    'Email': email,
    'Phone': phone,
    'City': getVal('city'),
    'College / University': getVal('college'),
    'Course / Specialization': getVal('course'),
    'Graduation Year': getVal('graduation'),
    'Area of Interest': getVal('interest'),
    'Skills / Experience': exp,
    'Previous Job Title': getVal('prev'),
    'Duration': getVal('duration'),
    'Open to Full-Time': getVal('fulltime'),
    'When Can Start': getVal('start'),
    'Portfolio Link': getVal('portfolio'),
    'Instagram': getVal('instagram'),
    'LinkedIn': getVal('linkedin'),
    'Why Flashlab Creative': getVal('why'),
    'Where Did You Hear About Us': getVal('heard'),
    'Source': 'flashlabcreative.com/career.html'
  };

  const resumeInput = form.querySelector('[name="attachment"]') || form.querySelector('[name="resume"]');
  const resumeFile = (resumeInput && resumeInput.files && resumeInput.files[0]) ? resumeInput.files[0] : null;

  if (!resumeFile) {
    showFormStatus(form, 'error', '<i class="ri-error-warning-fill"></i> Please upload your resume in PDF format (Max 2MB).');
    const zone = form.querySelector('.resume-upload-zone');
    if (zone) zone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const subject = 'Flashlab Creative Enquiry: ' + position + ' — ' + (fullName || 'Candidate');
  sendCareerEmail(form, subject, fields, resumeFile);
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

  const fname = get('fname');
  const lname = get('lname');
  const fullName = (fname + ' ' + lname).trim();
  const email = get('email');
  const phone = get('phone');
  const roleApplied = getVal('role_name') || 'Open Role';

  const fields = {
    'Application Type': 'Open Application',
    'Candidate Name': fullName,
    'Email': email,
    'Phone': phone,
    'City': getVal('city'),
    'Looking For': getVal('role_type'),
    'Role Applied For': roleApplied,
    'Internship Duration': getVal('intern_duration'),
    'Open to Full-Time': getVal('convert_fulltime'),
    'Notice Period / Start': getVal('notice'),
    'Expected Salary': getVal('salary'),
    'Why This Specific Role': getVal('why_role'),
    'How Company Benefits': getVal('company_benefit'),
    'Portfolio / Resume Link': getVal('portfolio'),
    'Instagram': getVal('instagram'),
    'LinkedIn': getVal('linkedin'),
    'Where Did You Hear About Us': getVal('heard'),
    'Source': 'flashlabcreative.com/career.html'
  };

  const resumeInput = form.querySelector('[name="attachment"]') || form.querySelector('[name="resume"]');
  const resumeFile = (resumeInput && resumeInput.files && resumeInput.files[0]) ? resumeInput.files[0] : null;

  if (!resumeFile) {
    showFormStatus(form, 'error', '<i class="ri-error-warning-fill"></i> Please upload your resume in PDF format (Max 2MB).');
    const zone = form.querySelector('.resume-upload-zone');
    if (zone) zone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const subject = 'Flashlab Creative Enquiry: Open Role (' + roleApplied + ') — ' + (fullName || 'Candidate');
  sendCareerEmail(form, subject, fields, resumeFile);
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
