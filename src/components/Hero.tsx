'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { VIEWPORT_PROPS } from '@/lib/constants';

type HeroProps = {
  title: string;
  subtitle: string;
  ctaHref: string;
};

export default function Hero({ title, subtitle, ctaHref }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 28]);

  return (
    <header id="inicio" className="relative overflow-hidden border-b border-slate-200">
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { y: parallaxY }}
        aria-hidden
      >
        <div
          className="h-[120%] w-full"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(64,195,214,0.38), transparent 42%), radial-gradient(circle at 75% 15%, rgba(51,108,206,0.4), transparent 38%), linear-gradient(135deg, #1e3a8a 0%, #336cce 45%, #4149c3 100%)'
          }}
        />
      </motion.div>

      <div className="relative section-shell py-24 sm:py-28">
        <motion.p
          className="mb-3 inline-block rounded-full border border-white/50 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/95"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={VIEWPORT_PROPS}
          transition={{ duration: 0.5 }}
        >
          Abril 2026 · Itinerario visual
        </motion.p>

        <motion.h1
          className="max-w-3xl text-5xl leading-tight text-white sm:text-6xl"
          style={{ fontFamily: 'var(--font-playfair)' }}
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={VIEWPORT_PROPS}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="mt-5 max-w-2xl text-base text-slate-100 sm:text-lg"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={VIEWPORT_PROPS}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        <motion.a
          href={ctaHref}
          className="travel-button mt-7 rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-900 shadow-lg shadow-slate-900/20 hover:bg-slate-100"
          whileHover={reduceMotion ? undefined : { y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={VIEWPORT_PROPS}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Ver itinerario
        </motion.a>
      </div>
    </header>
  );
}
