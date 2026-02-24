import { DestinationPlan } from '@/lib/types';
import EnergyBadge from './EnergyBadge';
import DayTimeline from './DayTimeline';

type DestinationSectionProps = {
  destinationPlan: DestinationPlan;
  mode: 'all' | 'must_do' | 'low_energy' | 'logistics_only' | 'high_visual';
  activeBlockKey: string | null;
  onBlockSelect: (params: { query: string; title: string; isLogistics: boolean; score: number; key: string }) => void;
};

export default function DestinationSection({ destinationPlan, mode, activeBlockKey, onBlockSelect }: DestinationSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/70 p-4 shadow-[0_20px_44px_-30px_rgba(15,23,42,0.5)] sm:p-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-2xl text-slate-900 sm:text-3xl" style={{ fontFamily: 'var(--font-playfair)' }}>
            {destinationPlan.destination}
          </h3>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{destinationPlan.arrivalType}</p>
        </div>
        <EnergyBadge level={destinationPlan.energyLevel} />
      </header>

      <div className="space-y-4">
        {destinationPlan.days.map((day) => (
          <DayTimeline
            key={`${destinationPlan.destination}-${day.dateLabel}`}
            day={day}
            destination={destinationPlan.destination}
            destinationEnergy={destinationPlan.energyLevel}
            mode={mode}
            activeBlockKey={activeBlockKey}
            onBlockSelect={onBlockSelect}
          />
        ))}
      </div>
    </section>
  );
}
