import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 1024;

function initLenis() {
  const lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initHorizontalScroll() {
  if (!isDesktop()) return null;

  const track = document.querySelector('.timeline-track');
  const shell = document.querySelector('.timeline-shell');
  if (!track || !shell) return null;

  const totalWidth = track.scrollWidth;
  const distance = totalWidth - window.innerWidth;

  const tween = gsap.to(track, {
    x: -distance,
    ease: 'none',
    scrollTrigger: {
      trigger: shell,
      start: 'top top',
      end: () => `+=${distance}`,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  return { tween, totalWidth, distance };
}

function initBubbleEntrances(horizontalCtx) {
  const horizontal = horizontalCtx !== null && isDesktop();

  document.querySelectorAll('.event-bubble').forEach((bubble) => {
    gsap.from(bubble, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.8)',
      scrollTrigger: {
        trigger: bubble,
        containerAnimation: horizontal ? horizontalCtx?.tween : undefined,
        start: horizontal ? 'left 85%' : 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  document.querySelectorAll('.event-card').forEach((card) => {
    gsap.from(card, {
      y: 12,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.1,
      scrollTrigger: {
        trigger: card,
        containerAnimation: horizontal ? horizontalCtx?.tween : undefined,
        start: horizontal ? 'left 80%' : 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  document.querySelectorAll('.person-bubble').forEach((person) => {
    gsap.from(person, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: person,
        containerAnimation: horizontal ? horizontalCtx?.tween : undefined,
        start: horizontal ? 'left 80%' : 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initEraScrubber(horizontalCtx) {
  const horizontal = horizontalCtx !== null && isDesktop();
  const tracks = document.querySelectorAll('.era-track');
  const eraEl = document.getElementById('current-era');
  const yearEl = document.getElementById('current-year');
  if (!eraEl || !yearEl) return;

  tracks.forEach((track) => {
    ScrollTrigger.create({
      trigger: track,
      containerAnimation: horizontal ? horizontalCtx?.tween : undefined,
      start: horizontal ? 'left center' : 'top center',
      end: horizontal ? 'right center' : 'bottom center',
      onToggle: (self) => {
        if (!self.isActive) return;
        const eraId = track.dataset.era;
        const eraLabelEl = track.querySelector('.era-ghost-label');
        const eraYearEl = track.querySelector('.era-ghost-year');
        if (eraLabelEl) eraEl.textContent = eraLabelEl.textContent;
        if (eraYearEl) yearEl.textContent = eraYearEl.textContent;

        const accent = getComputedStyle(track).getPropertyValue('--era-color').trim();
        if (accent) document.documentElement.style.setProperty('--accent-current', accent);
      },
    });
  });
}

function initParallax(horizontalCtx) {
  if (!isDesktop() || !horizontalCtx) return;
  const bg = document.querySelector('.parallax-bg');
  const mid = document.querySelector('.parallax-mid');

  if (bg) {
    gsap.to(bg, {
      x: -horizontalCtx.distance * 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: document.querySelector('.timeline-shell'),
        start: 'top top',
        end: () => `+=${horizontalCtx.distance}`,
        scrub: 1,
      },
    });
  }
  if (mid) {
    gsap.to(mid, {
      x: -horizontalCtx.distance * 0.6,
      ease: 'none',
      scrollTrigger: {
        trigger: document.querySelector('.timeline-shell'),
        start: 'top top',
        end: () => `+=${horizontalCtx.distance}`,
        scrub: 1,
      },
    });
  }
}

function init() {
  initLenis();
  const ctx = initHorizontalScroll();
  initBubbleEntrances(ctx);
  initEraScrubber(ctx);
  initParallax(ctx);

  window.addEventListener('resize', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
