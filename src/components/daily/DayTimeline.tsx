import { applyModeFilter, getEnergyColor } from '@/lib/daily-itinerary-utils';
import { DailyPlanDay, EnergyLevel } from '@/lib/types';
import ExperienceCard from './ExperienceCard';

type DayTimelineProps = {
  day: DailyPlanDay;
  destination: string;
  destinationEnergy: EnergyLevel;
  mode: 'all' | 'must_do' | 'low_energy' | 'logistics_only' | 'high_visual';
  activeBlockKey: string | null;
  onBlockSelect: (params: { query: string; title: string; isLogistics: boolean; score: number; key: string }) => void;
};

export default function DayTimeline({
  day,
  destination,
  destinationEnergy,
  mode,
  activeBlockKey,
  onBlockSelect
}: DayTimelineProps) {
  const filtered = applyModeFilter(day.blocks, mode);

  return (
    <article className="relative rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
      <div className="absolute bottom-4 left-0 top-4 w-1 rounded-r-full bg-slate-100">
        <div className={`h-full w-full rounded-r-full ${getEnergyColor(destinationEnergy)}`} />
      </div>

      <div className="ml-4">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-lg font-semibold text-slate-900">{day.dateLabel}</h4>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            {day.availability === 'full_day' ? 'Día completo' : 'Solo tarde'}
          </span>
        </header>

        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((block, idx) => {
              const blockKey = `${destination}-${day.dateLabel}-${idx}-${block.title}`;
              return (
                <ExperienceCard
                  key={blockKey}
                  block={block}
                  destination={destination}
                  active={activeBlockKey === blockKey}
                  onSelect={(query, title, isLogistics, score) =>
                    onBlockSelect({ query, title, isLogistics, score, key: blockKey })
                  }
                />
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Sin bloques para este día con el filtro actual.
          </p>
        )}
      </div>
    </article>
  );
}
