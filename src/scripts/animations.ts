import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Inizializza (o re-inizializza) tutte le animazioni. Sicuro con View Transitions. */
export function initAnimations(): void {
  // In sviluppo: ?static=1 disattiva le animazioni (utile per screenshot e controlli).
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('static')) return;

  // Pulizia: evita trigger duplicati dopo una navigazione
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  const animated = gsap.utils.toArray<HTMLElement>('[data-animate]');
  const heroItems = gsap.utils.toArray<HTMLElement>('[data-hero-item]');

  // Accessibilità: con "riduci movimento" niente animazioni, tutto visibile
  if (reducedMotion()) {
    gsap.set(animated, { opacity: 1, y: 0, clearProps: 'transform' });
    gsap.set(heroItems, { opacity: 1, clearProps: 'transform' });
    document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
      el.textContent = el.dataset.counter ?? '0';
    });
    (window as any).__animReady = true;
    return;
  }

  // 1. Hero: composizione in ingresso
  if (heroItems.length) {
    gsap.from(heroItems, {
      opacity: 0,
      y: 34,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.05,
      clearProps: 'opacity,transform',
    });
  }
  const heroImage = document.querySelector<HTMLElement>('[data-hero-image]');
  if (heroImage) {
    gsap.from(heroImage, {
      scale: 1.14,
      duration: 1.6,
      ease: 'power2.out',
      clearProps: 'transform',
    });
  }

  // 2. Reveal a cascata
  // Gli elementi dentro una sezione [data-reveal] si rivelano INSIEME quando entra la
  // sezione: così le card dello stesso blocco non compaiono una alla volta.
  const inSections = new Set<HTMLElement>();
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((section) => {
    const items = gsap.utils.toArray<HTMLElement>('[data-animate]', section);
    if (!items.length) return;
    items.forEach((el) => inSections.add(el));
    gsap.set(items, { opacity: 0, y: 28 });
    ScrollTrigger.create({
      trigger: section,
      start: 'top 82%',
      once: true,
      onEnter: () =>
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          overwrite: true,
        }),
    });
  });

  // Elementi [data-animate] fuori da una sezione [data-reveal]: reveal singolo
  const loose = animated.filter((el) => !inSections.has(el));
  if (loose.length) {
    gsap.set(loose, { opacity: 0, y: 28 });
    ScrollTrigger.batch(loose, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.09,
          overwrite: true,
        }),
    });
  }

  // 3. Parallax immagini
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax ?? '6');
    gsap.set(el, { scale: 1.14 });
    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });

  // 4. Contatori numerici
  gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
    const target = Number(el.dataset.counter ?? '0');
    const state = { value: 0 };
    el.textContent = '0';
    gsap.to(state, {
      value: target,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(state.value));
      },
      onComplete: () => {
        el.textContent = String(target);
      },
    });
  });

  // 5. Hover tilt sulle card
  gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((card) => {
    gsap.set(card, { transformPerspective: 900 });
    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotateY(px * 10);
      rotateX(-py * 10);
    });
    card.addEventListener('mouseleave', () => {
      rotateX(0);
      rotateY(0);
    });
  });

  ScrollTrigger.refresh();
  (window as any).__animReady = true;
}
