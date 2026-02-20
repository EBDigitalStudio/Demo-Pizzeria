/* ============================================================
   La Napolitana – Pizzería Artesanal | main.js
   ============================================================ */

/* ── FILTRO DE PIZZAS ── */
function filterPizzas(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.pizza-item').forEach(item => {
    if (cat === 'all' || item.dataset.cat === cat) {
      item.classList.add('show');
    } else {
      item.classList.remove('show');
    }
  });
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── HIGHLIGHT DÍA DE HOY EN HORARIOS ── */
(function highlightToday() {
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const today = days[new Date().getDay()];
  document.querySelectorAll('.hours-table tr').forEach(row => {
    const dayCell = row.querySelector('td:first-child');
    if (dayCell && dayCell.textContent.trim().toLowerCase() === today) {
      row.classList.add('today-row');
      const badge = document.createElement('span');
      badge.className = 'today-badge';
      badge.textContent = 'Hoy';
      dayCell.appendChild(badge);
    }
  });
})();

/* ── NAVBAR: OCULTAR AL HACER SCROLL HACIA ABAJO ── */
(function stickyNav() {
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 80) {
      navbar.style.transform = 'translateY(-100%)';
      navbar.style.transition = 'transform 0.3s ease';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = current;
  });
})();

/* ── ANIMACIÓN FADE-IN AL HACER SCROLL (Intersection Observer) ── */
(function fadeInOnScroll() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.pizza-card, .review-card, .gallery-grid img').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();