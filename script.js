// ═══════════════════════════════════════
//  VUCUT — MAIN CLIENT SCRIPT
// ═══════════════════════════════════════

// ─── 1. Navbar scroll effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  updateActiveNav();
});

// ─── 2. Mobile Hamburger Menu ───
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (spans.length === 3) {
      spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
      spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
      spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
    }
  });

  // Close menu when clicking any nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ─── 3. Active Nav link on scroll ───
function updateActiveNav() {
  const sections = ['home', 'offers', 'services', 'social', 'enquiry'];
  let current = 'home';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 150) {
      current = id;
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ─── 4. Scroll-reveal animation ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.why-card, .treatment-offer-card, .offer-box-card, .menu-category-card, .social-connect-card, .contact-item'
).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 3) * 70}ms`;
  observer.observe(el);
});

// ─── 5. Service Menu: Category Tabs & Search Filter ───
(function initServiceMenu() {
  const tabButtons  = document.querySelectorAll('.menu-tab-btn');
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn    = document.getElementById('clearMenuSearch');
  const catCards    = document.querySelectorAll('.menu-category-card');
  const noResults   = document.getElementById('menuNoResults');

  let activeCategory = 'all';

  function applyFilters() {
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    let totalVisibleItems = 0;

    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? 'block' : 'none';
    }

    catCards.forEach(card => {
      const cardCategory = card.getAttribute('data-cat') || '';
      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);

      if (!matchesCategory) {
        card.style.display = 'none';
        return;
      }

      // Filter individual service item rows inside the matching card
      const rows = card.querySelectorAll('.service-item-row');
      let cardVisibleRows = 0;

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matchesQuery = !query || text.indexOf(query) !== -1;
        row.style.display = matchesQuery ? 'flex' : 'none';
        if (matchesQuery) {
          cardVisibleRows++;
          totalVisibleItems++;
        }
      });

      card.style.display = cardVisibleRows > 0 ? 'flex' : 'none';
    });

    if (noResults) {
      noResults.style.display = totalVisibleItems === 0 ? 'block' : 'none';
    }
  }

  // Tab click
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'all';
      applyFilters();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Clear search
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      applyFilters();
      searchInput.focus();
    });
  }
})();
