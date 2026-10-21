import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/motion.js';

const SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const COLORS = ['#536dff', '#b5a4ff', '#f1eee8', '#ffce62', '#ff7a4e'];

function burst() {
  if (prefersReducedMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const pieces = Array.from({ length: 90 }, () => {
    const el = document.createElement('span');
    el.className = 'confetti__piece';
    el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    layer.appendChild(el);
    return el;
  });

  gsap.set(pieces, { x: window.innerWidth / 2, y: window.innerHeight, rotation: () => Math.random() * 360 });
  gsap.to(pieces, {
    x: () => window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.9,
    y: () => window.innerHeight * (0.1 + Math.random() * 0.5),
    rotation: () => Math.random() * 720 - 360,
    duration: 1.1,
    ease: 'power3.out',
    stagger: { each: 0.004 },
  });
  gsap.to(pieces, {
    y: window.innerHeight + 40,
    opacity: 0,
    duration: 1.6,
    delay: 1,
    ease: 'power1.in',
    stagger: { each: 0.004 },
    onComplete: () => layer.remove(),
  });
}

// Konami code toggles an inverted palette for 10 seconds and throws confetti.
export default function Konami() {
  useEffect(() => {
    let index = 0;
    let timer;
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      index = key === SEQUENCE[index] ? index + 1 : key === SEQUENCE[0] ? 1 : 0;
      if (index === SEQUENCE.length) {
        index = 0;
        document.documentElement.classList.add('konami-active');
        burst();
        clearTimeout(timer);
        timer = setTimeout(() => document.documentElement.classList.remove('konami-active'), 10000);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(timer);
    };
  }, []);

  return null;
}
