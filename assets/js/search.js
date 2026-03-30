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
    // Delay focus to ensure the overlay is visible before focusing
    requestAnimationFrame(() => { input.focus(); });
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

    const matches = searchIndex
      .map(item => {
        const title = (item.title || '').toLowerCase();
        const snippet = (item.snippet || '').toLowerCase();
        const body = (item.body || '').toLowerCase();
        const date = (item.date || '').toLowerCase();
        
        // Score: title match worth most, then snippet, then body
        let score = 0;
        if (title.includes(query)) score += 10;
        if (snippet.includes(query)) score += 5;
        if (body.includes(query)) score += 2;
        if (date.includes(query)) score += 3;
        
        // Find a context snippet from body if matched there
        let context = item.snippet;
        if (score > 0 && !title.includes(query) && !snippet.includes(query) && body.includes(query)) {
          const idx = body.indexOf(query);
          const start = Math.max(0, idx - 60);
          const end = Math.min(body.length, idx + query.length + 60);
          context = (start > 0 ? '...' : '') + body.slice(start, end).replace(/</g,'&lt;') + (end < body.length ? '...' : '');
        }
        
        return { ...item, score, context };
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
      const re = new RegExp('(' + esc + ')', 'gi');
      const highlighted = item.title.replace(re, '<mark>$1</mark>');
      const snippetText = (item.context || item.snippet || '').replace(re, '<mark>$1</mark>');
      const badge = item.type ? `<span class="search-badge search-badge-${item.type}">${item.type}</span>` : '';
      return `<a href="${prefix}${item.url}" class="search-result-item">
        <div class="result-header">${badge}<span class="result-title">${highlighted}</span></div>
        <div class="result-snippet">${snippetText}</div>
      </a>`;
    }).join('');
  });
}

document.addEventListener('DOMContentLoaded', initSearch);

// Newsletter subscription via Beehiiv API
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

  // Subscribe via Cloudflare Worker → Beehiiv (instant, API key secured server-side)
  fetch('https://wartime-subscribe.thewartimereport.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      form.innerHTML = '<p style="color: #22c55e; font-weight: 600; padding: 10px 0;">✓ Check your inbox to confirm your subscription!</p>';
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
