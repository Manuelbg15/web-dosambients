// Animaciones globales: aparición al hacer scroll, contadores, cabecera y barra de progreso.
// Se reinicializa en cada navegación (astro:page-load) porque usamos View Transitions.

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-split]');
  if (reduceMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  targets.forEach((el) => io.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  const format = (n: number) => n.toLocaleString('es-ES');
  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    if (reduceMotion()) {
      el.textContent = format(target);
      return;
    }
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        run(e.target as HTMLElement);
        io.unobserve(e.target);
      }),
    { threshold: 0.5 },
  );
  counters.forEach((el) => io.observe(el));
}

let scrollHandler: (() => void) | null = null;

function initHeader() {
  const header = document.getElementById('site-header');
  const bar = document.getElementById('scroll-progress');
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
  scrollHandler = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 40);
    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();
}

// Parallax suave para elementos con data-parallax="0.15" (velocidad relativa)
let parallaxHandler: (() => void) | null = null;
function initParallax() {
  if (parallaxHandler) window.removeEventListener('scroll', parallaxHandler);
  const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!els.length || reduceMotion()) return;
  let ticking = false;
  parallaxHandler = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      els.forEach((el) => {
        const speed = Number(el.dataset.parallax) || 0.15;
        const rect = el.parentElement!.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.15)`;
      });
      ticking = false;
    });
  };
  window.addEventListener('scroll', parallaxHandler, { passive: true });
  parallaxHandler();
}

document.addEventListener('astro:after-swap', () => document.documentElement.classList.remove('no-js'));

document.addEventListener('astro:page-load', () => {
  document.documentElement.classList.remove('no-js');
  initReveal();
  initCounters();
  initHeader();
  initParallax();
});
