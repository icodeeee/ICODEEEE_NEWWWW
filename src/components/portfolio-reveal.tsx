"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function PortfolioReveal({ children }: { children: ReactNode }) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = grid.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = Array.from(root.children);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    function configure() {
      observer.disconnect();
      root!.classList.toggle('reveal-enabled', !preference.matches);
      if (!preference.matches) cards.forEach(card => observer.observe(card));
    }
    configure();
    preference.addEventListener('change', configure);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', configure);
    };
  }, []);

  return <div ref={grid} className="hn-more-grid">{children}</div>;
}
