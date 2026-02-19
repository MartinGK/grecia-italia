'use client';

import { VIEWPORT_PROPS } from '@/lib/constants';
import { TimelineItem } from '@/lib/types';
import { motion, useReducedMotion } from 'framer-motion';

type TimelineProps = {
  items: TimelineItem[];
};

export default function Timeline({ items }: TimelineProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="timeline" className="section-shell">
      <motion.h2
        className="mb-8 text-3xl sm:text-4xl"
        style={{ fontFamily: 'var(--font-playfair)' }}
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={VIEWPORT_PROPS}
      >
        Resumen de ruta
      </motion.h2>

      <div className="glass-card p-5 sm:p-7">
        <div className="relative ml-1 space-y-5 pl-6 sm:pl-8">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-slate-200" />
          <motion.div
            className="absolute bottom-0 left-0 top-0 origin-top bg-cyan-500"
            style={{ width: 2 }}
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={VIEWPORT_PROPS}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: 'easeOut' }}
          />

          {items.map((item, idx) => (
            <motion.article
              key={`${item.city}-${item.dateRange}`}
              className="relative"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={VIEWPORT_PROPS}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : idx * 0.06 }}
            >
              <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-cyan-500 sm:-left-[37px]" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{item.dateRange}</p>
              <p className="text-lg font-semibold text-slate-900">{item.city}</p>
              <p className="text-sm text-slate-600">{item.country}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
