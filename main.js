// Nav mobile toggle
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.nav-mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group || 'default';
      document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', applySortToTable);
  }

  // Email forms
  document.querySelectorAll('.email-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = form.querySelector('.email-input');
      if (input && input.value.includes('@')) {
        const btn = form.querySelector('button');
        if (btn) { btn.textContent = '✓ Inscrit !'; btn.style.background = '#00C58E'; }
        input.value = '';
        input.placeholder = 'Merci ! Vérifiez votre boîte mail.';
      }
    });
  });

  // Highlight active nav
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(a => {
    if (a.getAttribute('href') === path || (path.startsWith(a.getAttribute('href')) && a.getAttribute('href') !== '/')) {
      a.classList.add('active');
    }
  });
});

function applyFilters() {
  const activeFilters = {};
  document.querySelectorAll('.filter-btn.active[data-filter]').forEach(btn => {
    const group = btn.dataset.group || 'default';
    activeFilters[group] = btn.dataset.filter;
  });

  document.querySelectorAll('.offer-card[data-tags]').forEach(card => {
    const tags = card.dataset.tags || '';
    let show = true;
    for (const [group, val] of Object.entries(activeFilters)) {
      if (val === 'all') continue;
      if (!tags.includes(val)) { show = false; break; }
    }
    card.style.display = show ? '' : 'none';
  });

  document.querySelectorAll('tr[data-tags]').forEach(row => {
    const tags = row.dataset.tags || '';
    let show = true;
    for (const [group, val] of Object.entries(activeFilters)) {
      if (val === 'all') continue;
      if (!tags.includes(val)) { show = false; break; }
    }
    row.style.display = show ? '' : 'none';
  });
}

function applySortToTable() {
  const select = document.getElementById('sort-select');
  if (!select) return;
  const val = select.value;
  const tbody = document.querySelector('.compare-table tbody');
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr'));
  rows.sort((a, b) => {
    const aVal = parseFloat(a.dataset[val] || '9999');
    const bVal = parseFloat(b.dataset[val] || '9999');
    return aVal - bVal;
  });
  rows.forEach(r => tbody.appendChild(r));
}

// Score bars animation on scroll
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.score-fill[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.offer-card').forEach(card => observer.observe(card));
}
