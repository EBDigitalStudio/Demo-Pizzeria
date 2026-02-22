/* ============================================================
   La Napolitana – Pizzería Artesanal | main.js
   ============================================================ */

/* ═══════════════════════════════════════════
   1. FILTRO DE PIZZAS
═══════════════════════════════════════════ */
function filterPizzas(cat, btn) {
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');

  // Filter grid items
  document.querySelectorAll('.pizza-item').forEach(item => {
    const show = cat === 'all' || item.dataset.cat === cat;
    item.classList.toggle('show', show);
  });
}


/* ═══════════════════════════════════════════
   2. SELECTOR DE TAMAÑO EN TARJETAS DE PIZZA
═══════════════════════════════════════════ */
(function initSizeSelectors() {
  document.querySelectorAll('.size-selector').forEach(selector => {
    const card = selector.closest('.pizza-card');
    const priceDisplay = card?.querySelector('.price-val');

    selector.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        selector.querySelectorAll('.size-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Update displayed price
        if (priceDisplay && btn.dataset.price) {
          priceDisplay.textContent = btn.dataset.price;
        }
      });
    });
  });
})();


/* ═══════════════════════════════════════════
   3. SMOOTH SCROLL
═══════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ═══════════════════════════════════════════
   4. HIGHLIGHT DÍA ACTUAL EN HORARIOS
═══════════════════════════════════════════ */
(function highlightToday() {
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const todayName = dayNames[new Date().getDay()];

  document.querySelectorAll('.hours-table tr').forEach(row => {
    const dayCell = row.querySelector('td:first-child');
    if (!dayCell) return;
    if (dayCell.textContent.trim().toLowerCase() === todayName) {
      row.classList.add('today-row');
      const badge = document.createElement('span');
      badge.className = 'today-badge';
      badge.textContent = 'Hoy';
      dayCell.appendChild(badge);
    }
  });
})();


/* ═══════════════════════════════════════════
   5. ESTADO ABIERTO/CERRADO (dinámico)
═══════════════════════════════════════════ */
(function updateOpenStatus() {
  const statusEl = document.getElementById('openStatus');
  if (!statusEl) return;

  // Schedule: [open hour (0-based), close hour]; null = closed
  const schedule = {
    0: null,               // Lunes  - cerrado
    1: [12, 22],           // Martes
    2: [12, 22],           // Miércoles
    3: [12, 23],           // Jueves
    4: [12, 23.5],         // Viernes (23:30 = 23.5)
    5: [11, 24],           // Sábado  (00:00 → tratado como 24)
    6: [11, 22],           // Domingo
  };

  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const hours = schedule[day];

  if (!hours) {
    statusEl.className = 'open-status is-closed';
    statusEl.textContent = '🔴 Cerrado hoy (lunes). Abrimos el martes a las 12:00.';
  } else {
    const [open, close] = hours;
    const lastOrder = close - 0.5; // Last orders 30 min before closing
    if (hour >= open && hour < lastOrder) {
      statusEl.className = 'open-status is-open';
      statusEl.textContent = `🟢 ¡Estamos abiertos! Pedidos hasta las ${close === 24 ? '23:30' : (close % 1 === 0.5 ? `${Math.floor(close)}:30` : `${close}:00`)}.`;
    } else if (hour >= lastOrder && hour < close) {
      statusEl.className = 'open-status is-open';
      statusEl.textContent = '🟡 Últimos pedidos del día. ¡Apurate!';
    } else {
      // Find next open day
      let nextDay = (day + 1) % 7;
      let attempts = 0;
      while (!schedule[nextDay] && attempts < 7) { nextDay = (nextDay + 1) % 7; attempts++; }
      const dayNamesDisplay = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const nextOpen = schedule[nextDay]?.[0] ?? 12;
      statusEl.className = 'open-status is-closed';
      statusEl.textContent = `🔴 Cerrado ahora. Próxima apertura: ${dayNamesDisplay[nextDay]} a las ${nextOpen}:00.`;
    }
  }
})();


/* ═══════════════════════════════════════════
   6. NAVBAR: SCROLL EFFECT + OCULTAR/MOSTRAR
═══════════════════════════════════════════ */
(function initNavbar() {
  let lastScroll = 0;
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    // Add scrolled class for style change
    navbar.classList.toggle('scrolled', current > 50);

    // Hide on scroll down, show on scroll up
    if (current > lastScroll && current > 120) {
      navbar.classList.add('hide');
      navbar.style.transform = 'translateY(-100%)';
      navbar.style.transition = 'transform 0.35s ease';
    } else {
      navbar.classList.remove('hide');
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = Math.max(0, current);
  }, { passive: true });
})();


/* ═══════════════════════════════════════════
   7. BOTÓN VOLVER ARRIBA
═══════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ═══════════════════════════════════════════
   8. ANIMACIONES FADE-IN AL SCROLL
═══════════════════════════════════════════ */
(function initScrollFade() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.scroll-fade').forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════
   9. ANIMACIONES FADE-IN CARDS (Observer)
   (para pizza-card, review-card, gallery imgs)
═══════════════════════════════════════════ */
(function initCardFade() {
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
    { threshold: 0.1 }
  );

  document.querySelectorAll('.pizza-card, .review-card, .gallery-grid img').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.55s ease ${(i % 3) * 0.1}s, transform 0.55s ease ${(i % 3) * 0.1}s`;
    observer.observe(el);
  });
})();
