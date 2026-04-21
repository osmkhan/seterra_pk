import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const isDesktop = () => window.innerWidth >= 1024;

let lenisInstance = null;
let horizontalCtx = null;

function initLenis() {
  lenisInstance = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1,
    smoothWheel: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
  });

  lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function initHorizontalScroll() {
  if (!isDesktop()) return null;

  const track = document.querySelector('.timeline-track');
  const shell = document.querySelector('.timeline-shell');
  if (!track || !shell) return null;

  // Compute total distance from the actual rendered track width.
  const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  const tween = gsap.to(track, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: shell,
      start: 'top top',
      end: () => `+=${getDistance()}`,
      scrub: 0.6,
      pin: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  return { tween, getDistance };
}

function initBubbleEntrances(ctx) {
  const horizontal = ctx !== null && isDesktop();

  document.querySelectorAll('.event-bubble').forEach((bubble) => {
    gsap.from(bubble, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.8)',
      scrollTrigger: {
        trigger: bubble,
        containerAnimation: horizontal ? ctx.tween : undefined,
        start: horizontal ? 'left 90%' : 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  document.querySelectorAll('.event-card').forEach((card) => {
    gsap.from(card, {
      y: 10,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.out',
      delay: 0.08,
      scrollTrigger: {
        trigger: card,
        containerAnimation: horizontal ? ctx.tween : undefined,
        start: horizontal ? 'left 88%' : 'top 86%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  document.querySelectorAll('.person-bubble').forEach((person) => {
    gsap.from(person, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: person,
        containerAnimation: horizontal ? ctx.tween : undefined,
        start: horizontal ? 'left 85%' : 'top 82%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initEraScrubber(ctx) {
  const horizontal = ctx !== null && isDesktop();
  const tracks = document.querySelectorAll('.era-track');
  const eraEl = document.getElementById('current-era');
  const yearEl = document.getElementById('current-year');
  if (!eraEl || !yearEl) return;

  tracks.forEach((track) => {
    ScrollTrigger.create({
      trigger: track,
      containerAnimation: horizontal ? ctx.tween : undefined,
      start: horizontal ? 'left center' : 'top center',
      end: horizontal ? 'right center' : 'bottom center',
      onToggle: (self) => {
        if (!self.isActive) return;
        const label = track.querySelector('.era-ghost-label');
        const yr = track.querySelector('.era-ghost-year');
        if (label) eraEl.textContent = label.textContent;
        if (yr) yearEl.textContent = yr.textContent;

        const accent = getComputedStyle(track).getPropertyValue('--era-color').trim();
        if (accent) document.documentElement.style.setProperty('--accent-current', accent);
      },
    });
  });
}

function initParallax(ctx) {
  if (!isDesktop() || !ctx) return;
  const bg = document.querySelector('.parallax-bg');
  const mid = document.querySelector('.parallax-mid');
  const shell = document.querySelector('.timeline-shell');

  if (bg) {
    gsap.to(bg, {
      x: () => -ctx.getDistance() * 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: shell,
        start: 'top top',
        end: () => `+=${ctx.getDistance()}`,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
  }
  if (mid) {
    gsap.to(mid, {
      x: () => -ctx.getDistance() * 0.6,
      ease: 'none',
      scrollTrigger: {
        trigger: shell,
        start: 'top top',
        end: () => `+=${ctx.getDistance()}`,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
  }
}

// Arrow keys + Page keys drive Lenis
function initKeyboard() {
  const step = () => (isDesktop() ? window.innerWidth * 0.5 : window.innerHeight * 0.7);
  const bigStep = () => (isDesktop() ? window.innerWidth : window.innerHeight);

  window.addEventListener('keydown', (e) => {
    if (!lenisInstance) return;
    const target = e.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

    let delta = 0;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        delta = step(); break;
      case 'ArrowLeft':
      case 'ArrowUp':
        delta = -step(); break;
      case 'PageDown':
      case ' ':
        delta = bigStep(); break;
      case 'PageUp':
        delta = -bigStep(); break;
      case 'Home':
        lenisInstance.scrollTo(0, { duration: 1.2 });
        e.preventDefault();
        return;
      case 'End':
        lenisInstance.scrollTo(document.documentElement.scrollHeight, { duration: 1.2 });
        e.preventDefault();
        return;
      default:
        return;
    }
    e.preventDefault();
    lenisInstance.scrollTo(lenisInstance.scroll + delta, { duration: 0.6 });
  });
}

function init() {
  initLenis();
  horizontalCtx = initHorizontalScroll();
  initBubbleEntrances(horizontalCtx);
  initEraScrubber(horizontalCtx);
  initParallax(horizontalCtx);
  initKeyboard();

  // Re-measure once fonts have settled — Nastaliq + Cormorant can shift widths.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  // And after full load (images, etc.)
  window.addEventListener('load', () => ScrollTrigger.refresh());

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
