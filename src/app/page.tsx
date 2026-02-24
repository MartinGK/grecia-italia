'use client';

import CategoryFilter from '@/components/CategoryFilter';
import CountrySection from '@/components/CountrySection';
import DailyPlannerView from '@/components/daily/DailyPlannerView';
import Hero from '@/components/Hero';
import MapModeModal from '@/components/MapModeModal';
import StickyNav from '@/components/StickyNav';
import Timeline from '@/components/Timeline';
import { getAllMapLinks, itineraryData } from '@/data/itinerary';
import { Category } from '@/lib/types';
import { useMemo, useState } from 'react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [mapModeOpen, setMapModeOpen] = useState(false);
  const [activeView, setActiveView] = useState<'classic' | 'daily'>('classic');
  const mapEntries = useMemo(() => getAllMapLinks(), []);

  return (
    <main>
      <StickyNav />

      <Hero
        title="Grecia + Italia · Travel Magazine Itinerary"
        subtitle="Una ruta mobile-first ultra visual para abril 2026: historia, playas, gastronomía, vida nocturna y logística práctica en una sola página."
        ctaHref="#timeline"
      />

      <section className="section-shell pb-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveView('classic')}
            className={`travel-button rounded-xl border px-4 py-2 ${
              activeView === 'classic'
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400'
            }`}
          >
            Vista país/ciudad
          </button>
          <button
            type="button"
            onClick={() => setActiveView('daily')}
            className={`travel-button rounded-xl border px-4 py-2 ${
              activeView === 'daily'
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white/90 text-slate-700 hover:border-slate-400'
            }`}
          >
            Plan diario
          </button>
        </div>

        {activeView === 'classic' ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
            <button
              type="button"
              onClick={() => setMapModeOpen(true)}
              className="travel-button h-fit border border-slate-900 bg-slate-900 px-5 py-3 text-white hover:bg-slate-800"
            >
              Mapa general
            </button>
          </div>
        ) : null}
      </section>

      {activeView === 'classic' ? (
        <>
          <Timeline items={itineraryData.timeline} />

          {itineraryData.countries.map((country) => (
            <CountrySection key={country.slug} country={country} activeCategory={activeCategory} />
          ))}
        </>
      ) : (
        <DailyPlannerView />
      )}

      <section id="logistica" className="section-shell">
        <div className="glass-card p-5 sm:p-7">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-playfair)' }}>
            Tips logísticos
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <article>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Traslados sugeridos</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {itineraryData.logistics.transport.map((line) => (
                  <li key={line} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                    {line}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Checklist</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {itineraryData.logistics.checklist.map((line) => (
                  <li key={line} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <footer className="section-shell pt-2">
        <div className="glass-card space-y-2 p-4 text-xs text-slate-600">
          <p>Fuentes visuales: Wikimedia Commons con selección por lugar y deduplicación por ciudad.</p>
          <p>
            Enlaces de transporte/tickets pueden cambiar según fecha. Verificar disponibilidad oficial para abril de 2026.
          </p>
        </div>
      </footer>

      <MapModeModal open={mapModeOpen} onClose={() => setMapModeOpen(false)} entries={mapEntries} />
    </main>
  );
}
