// searchIndex is populated by search-index.js (loaded before this file)
if (typeof searchIndex === 'undefined') var searchIndex = [];

function initSearch() {
  const trigger = document.getElementById('search-trigger');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const close = document.getElementById('search-close');
  if (!trigger || !overlay || !input) return;

  const isSubdir = window.location.pathname.includes('/reports/');
  const prefix = isSubdir ? '../' : '';

  function openSearch() {
    overlay.classList.add('active');
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    input.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    overlay.classList.remove('active');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    input.value = '';
    results.innerHTML = '<div class="search-hint">Search across all reports, investigations, and economic analysis</div>';
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openSearch);
  close.addEventListener('click', closeSearch);

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });

  // Keyboard shortcut: / to open, Escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !overlay.classList.contains('active') && 
        !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeSearch();
    }
  });

  input.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    if (query.length < 2) {
      results.innerHTML = '<div class="search-hint">Type to search across all reports, investigations, and economic analysis...</div>';
      return;
    }

    const words = query.split(/\s+/).filter(w => w.length > 0);
    const matches = searchIndex
      .map(item => {
        const text = (item.title + ' ' + item.snippet + ' ' + (item.date || '') + ' ' + (item.tags || '')).toLowerCase();
        const score = words.reduce((s, w) => s + (text.includes(w) ? 1 : 0), 0);
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    if (matches.length === 0) {
      results.innerHTML = '<div class="search-no-results">No results for "' + this.value + '"</div>';
      return;
    }

    results.innerHTML = matches.map(item => {
      const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const highlighted = item.title.replace(
        new RegExp('(' + esc + ')', 'gi'), '<mark>$1</mark>'
      );
      const badge = item.type ? `<span class="search-badge search-badge-${item.type}">${item.type}</span>` : '';
      return `<a href="${prefix}${item.url}" class="search-result-item">
        <div class="result-header">${badge}<span class="result-title">${highlighted}</span></div>
        <div class="result-snippet">${item.snippet}</div>
      </a>`;
    }).join('');
  });
}

document.addEventListener('DOMContentLoaded', initSearch);

// Newsletter subscription via FormSubmit.co (sends to thewartimereport@gmail.com)
function subscribeNewsletter() {
  const input = document.getElementById('newsletter-email');
  const btn = input?.closest('.newsletter-form')?.querySelector('.newsletter-btn');
  const form = input?.closest('.newsletter-form');
  if (!input || !form) return;

  const email = input.value.trim();

  // Validation
  if (!email) {
    showError(input, 'Please enter your email address');
    return;
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    showError(input, 'Please enter a valid email address');
    return;
  }

  // Common typo detection
  const domain = email.split('@')[1]?.toLowerCase();
  const typos = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'hotmal.com': 'hotmail.com', 'outlok.com': 'outlook.com' };
  if (typos[domain]) {
    showError(input, 'Did you mean @' + typos[domain] + '?');
    return;
  }

  // Honeypot check (hidden field)
  const hp = form.querySelector('.hp-field');
  if (hp && hp.value) return; // Bot detected

  // Disable button, show loading
  if (btn) { btn.disabled = true; btn.textContent = 'Subscribing...'; }
  input.disabled = true;

  // Submit to FormSubmit.co
  fetch('https://formsubmit.co/ajax/3c457e8b34adf42313257d26c49397e5', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      email: email,
      _subject: 'New Wartime Report subscriber: ' + email,
      _template: 'box',
      _captcha: 'false',
      source: window.location.pathname
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      form.innerHTML = '<p style="color: #22c55e; font-weight: 600; padding: 10px 0;">✓ Subscribed! You\'ll receive the daily briefing at 6:30 AM ET.</p>';
    } else {
      showError(input, 'Something went wrong. Try again.');
      if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
      input.disabled = false;
    }
  })
  .catch(() => {
    showError(input, 'Network error. Please try again.');
    if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
    input.disabled = false;
  });
}

function showError(input, msg) {
  input.style.borderColor = '#dc2626';
  input.value = '';
  input.placeholder = msg;
  input.classList.add('shake');
  setTimeout(() => {
    input.classList.remove('shake');
    input.style.borderColor = '';
  }, 2000);
}
