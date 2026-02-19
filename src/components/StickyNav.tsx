'use client';

import { NAV_ITEMS } from '@/lib/constants';
import { useEffect, useState } from 'react';

export default function StickyNav() {
  const [activeHash, setActiveHash] = useState('#inicio');

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.querySelector(item.href)).filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveHash(`#${visible[0].target.id}`);
        }
      },
      {
        threshold: [0.2, 0.5, 0.8],
        rootMargin: '-20% 0px -60% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {NAV_ITEMS.map((item) => {
          const active = activeHash === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`shrink-0 min-w-[84px] rounded-full border px-3 py-1.5 text-center text-xs font-semibold uppercase tracking-[0.14em] transition sm:text-[11px] ${
                active
                  ? 'border-cyan-300 bg-cyan-100 text-cyan-900 shadow-sm'
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
