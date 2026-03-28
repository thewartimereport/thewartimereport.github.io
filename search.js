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
    input.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    overlay.classList.remove('active');
    input.value = '';
    results.innerHTML = '';
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

    const words = query.split(/\s+/);
    const matches = searchIndex.filter(item => {
      const text = (item.title + ' ' + item.snippet + ' ' + (item.date || '') + ' ' + (item.tags || '')).toLowerCase();
      return words.every(w => text.includes(w));
    }).slice(0, 10);

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

// Newsletter subscription (temporary - swap with Beehiiv API when ready)
function subscribeNewsletter() {
  const input = document.getElementById('newsletter-email');
  if (!input) return;
  
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    input.style.borderColor = '#dc2626';
    input.placeholder = 'Please enter a valid email';
    return;
  }
  
  // Store in localStorage for now (Beehiiv integration TODO)
  const subs = JSON.parse(localStorage.getItem('twtr_subscribers') || '[]');
  if (!subs.includes(email)) {
    subs.push(email);
    localStorage.setItem('twtr_subscribers', JSON.stringify(subs));
  }
  
  // Show success
  const form = input.closest('.newsletter-form');
  form.innerHTML = '<p style="color: var(--accent-red); font-weight: 600; padding: 10px 0;">✓ Subscribed! Check your inbox tomorrow at 6:30 AM ET.</p>';
}
