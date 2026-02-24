'use client';

import { dailyItineraryData } from '@/data/daily-itinerary';
import { EnergyMode, getFallbackMapQuery, normalizeVisualScore } from '@/lib/daily-itinerary-utils';
import { useMemo, useState } from 'react';
import DestinationSection from './DestinationSection';
import EnergyModeToggle from './EnergyModeToggle';
import MapSyncLayer from './MapSyncLayer';

type SelectedBlock = {
  title: string;
  query: string;
  isLogistics: boolean;
  score: number;
  key: string;
};

export default function DailyPlannerView() {
  const [mode, setMode] = useState<EnergyMode>('all');
  const [selected, setSelected] = useState<SelectedBlock | null>(null);
  const [activeBlockKey, setActiveBlockKey] = useState<string | null>(null);

  const flattenedBlocks = useMemo(
    () =>
      dailyItineraryData.flatMap((destination) =>
        destination.days.flatMap((day) =>
          day.blocks.map((block, idx) => ({
            block,
            destination: destination.destination,
            key: `${destination.destination}-${day.dateLabel}-${idx}-${block.title}`
          }))
        )
      ),
    []
  );

  const handleSelect = (params: { query: string; title: string; isLogistics: boolean; score: number; key: string }) => {
    setSelected({
      title: params.title,
      query: params.query,
      isLogistics: params.isLogistics,
      score: normalizeVisualScore(params.score),
      key: params.key
    });
    setActiveBlockKey(params.key);
  };

  const selectFirstBlock = () => {
    if (flattenedBlocks.length === 0) return;
    const first = flattenedBlocks[0];
    handleSelect({
      query: first.block.mapQuery || getFallbackMapQuery(first.block.title, first.destination),
      title: first.block.title,
      isLogistics: first.block.category === 'logistica_critica',
      score: first.block.visualImpactScore,
      key: first.key
    });
  };

  return (
    <section id="plan-diario" className="section-shell">
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white/85 p-4 sm:p-5">
        <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-playfair)' }}>
          Plan diario
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Timeline vertical por destino y día. Toca un bloque para sincronizar el mapa.
        </p>

        <div className="mt-4">
          <EnergyModeToggle mode={mode} onChange={setMode} />
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={selectFirstBlock}
            className="travel-button border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:border-slate-400"
          >
            Centrar primer bloque
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {dailyItineraryData.map((destinationPlan) => (
            <DestinationSection
              key={destinationPlan.destination}
              destinationPlan={destinationPlan}
              mode={mode}
              activeBlockKey={activeBlockKey}
              onBlockSelect={handleSelect}
            />
          ))}
        </div>

        <MapSyncLayer selected={selected} />
      </div>
    </section>
  );
}
