import { getEnergyColor } from '@/lib/daily-itinerary-utils';
import { EnergyLevel } from '@/lib/types';

type EnergyBadgeProps = {
  level: EnergyLevel;
};

export default function EnergyBadge({ level }: EnergyBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
      <span className={`h-2.5 w-2.5 rounded-full ${getEnergyColor(level)}`} />
      {level}
    </span>
  );
}
