'use client';

import { VIEWPORT_PROPS } from '@/lib/constants';
import { Category, CountryData } from '@/lib/types';
import { motion, useReducedMotion } from 'framer-motion';
import CitySection from './CitySection';

type CountrySectionProps = {
  country: CountryData;
  activeCategory: Category | null;
};

export default function CountrySection({ country, activeCategory }: CountrySectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id={country.slug}
      className="section-shell"
      style={{
        background:
          country.slug === 'grecia'
            ? `linear-gradient(165deg, ${country.palette[0]}, ${country.palette[1]} 35%, #ffffff 90%)`
            : `linear-gradient(165deg, ${country.palette[0]}, ${country.palette[2]} 35%, #ffffff 90%)`
      }}
    >
      <motion.div
        className="mb-6 rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={VIEWPORT_PROPS}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">País</p>
        <h2 className="country-heading mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
          {country.name}
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">{country.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {country.usefulLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="travel-button border border-slate-300 bg-white/85 text-slate-700 hover:border-slate-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-500">Algunos tickets/eventos pueden variar según temporada y disponibilidad oficial.</p>
      </motion.div>

      <div className="space-y-5">
        {country.cities.map((city) => (
          <CitySection key={city.slug} city={city} activeCategory={activeCategory} />
        ))}
      </div>
    </section>
  );
}
