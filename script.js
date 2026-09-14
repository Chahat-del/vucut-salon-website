// ═══════════════════════════════════════
//  VUCUT — MAIN SCRIPT
// ═══════════════════════════════════════

// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
});

// ─── Hamburger menu ───
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ─── Active nav link on scroll ───
function updateActiveNav() {
  const sections = ['home', 'offers', 'services', 'social'];
  let current = 'home';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

// ─── Scroll-reveal animation ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Add fade-up to key elements
document.querySelectorAll(
  '.why-card, .offer-card, .poster-card, .service-category, .social-card, .contact-item'
).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

// ─── Service tab filter ───
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.service-category').forEach(cat => {
      if (filter === 'all') {
        cat.classList.remove('hidden');
      } else {
        const cats = cat.dataset.cat || '';
        cat.classList.toggle('hidden', !cats.includes(filter));
      }
    });
  });
});

// ─── Smooth logo click back to top ───
document.querySelector('.nav-logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
