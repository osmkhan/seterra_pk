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

  // Snap targets at the start of each era (and at title-card start).
  // Recomputed at refresh time so resizes / font shifts re-anchor correctly.
  const getSnapPoints = () => {
    const trackWidth = track.scrollWidth;
    const total = getDistance();
    if (total <= 0) return [0];
    const eras = Array.from(track.querySelectorAll('.era-track, .title-card'));
    return eras
      .map((el) => Math.min(1, Math.max(0, el.offsetLeft / total)))
      // Always include the very end so users can reach final event.
      .concat([1]);
  };

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
      snap: {
        snapTo: (value) => {
          const points = getSnapPoints();
          // Snap to nearest era boundary, but only when the user is "close" — keeps
          // free scrolling within an era unjarring. ~6% threshold ≈ ⅔ viewport.
          let best = value;
          let bestDist = Infinity;
          for (const p of points) {
            const d = Math.abs(p - value);
            if (d < bestDist) { bestDist = d; best = p; }
          }
          return bestDist < 0.06 ? best : value;
        },
        duration: { min: 0.2, max: 0.6 },
        delay: 0.08,
        ease: 'power2.out',
      },
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

// Position reign bars by measuring the slot positions of their from/to events.
// Must run BEFORE the horizontal tween has applied any transform — we measure
// positions relative to the timeline-track's untransformed coordinate space.
function positionReigns() {
  const track = document.querySelector('.timeline-track');
  const overlay = document.querySelector('.reign-overlay');
  if (!track || !overlay) return;

  // Temporarily neutralize any GSAP transform so getBoundingClientRect reflects layout coords.
  const prevTransform = track.style.transform;
  track.style.transform = 'none';

  const trackRect = track.getBoundingClientRect();
  const verticalLayout = !isDesktop();
  const ROW_HEIGHT = 28;
  // Cards can extend ~180px above/below the rail; reign bars sit further out
  // so they don't collide with the "below" card row.
  const BASE_OFFSET = 240; // px below the rail center

  overlay.querySelectorAll('.reign-bar').forEach((bar) => {
    const fromId = bar.dataset.from;
    const toId = bar.dataset.to;
    const row = parseInt(bar.dataset.row || '0', 10);

    const fromEl = document.querySelector(`.event-slot[data-event-id="${fromId}"]`);
    const toEl = document.querySelector(`.event-slot[data-event-id="${toId}"]`);
    if (!fromEl || !toEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    if (verticalLayout) {
      // skip — overlay hidden via CSS
      return;
    }

    const left = Math.min(fromRect.left, toRect.left) - trackRect.left + fromRect.width / 2;
    const right = Math.max(fromRect.right, toRect.right) - trackRect.left - toRect.width / 2;
    const width = Math.max(2, right - left);

    // Vertical position: rail sits at 50% of viewport; place bars below it, stacked by row.
    const top = trackRect.height / 2 + BASE_OFFSET + row * ROW_HEIGHT;

    bar.style.left = `${left}px`;
    bar.style.width = `${width}px`;
    bar.style.top = `${top}px`;
    bar.classList.add('is-positioned');
  });

  // Restore transform (GSAP will overwrite on next tick anyway).
  track.style.transform = prevTransform;
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
  // Position reigns BEFORE wiring the horizontal pin so we measure untransformed layout.
  positionReigns();
  horizontalCtx = initHorizontalScroll();
  initBubbleEntrances(horizontalCtx);
  initEraScrubber(horizontalCtx);
  initParallax(horizontalCtx);
  initKeyboard();

  const refreshAll = () => {
    positionReigns();
    ScrollTrigger.refresh();
  };

  // Re-measure once fonts have settled — Nastaliq + Cormorant can shift widths.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshAll);
  }
  // And after full load (images, etc.)
  window.addEventListener('load', refreshAll);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshAll, 150);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
