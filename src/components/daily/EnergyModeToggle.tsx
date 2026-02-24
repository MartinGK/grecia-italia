import { EnergyMode } from '@/lib/daily-itinerary-utils';

type EnergyModeToggleProps = {
  mode: EnergyMode;
  onChange: (mode: EnergyMode) => void;
};

const OPTIONS: Array<{ mode: EnergyMode; label: string }> = [
  { mode: 'all', label: 'Todos' },
  { mode: 'must_do', label: '🔥 Solo imperdibles' },
  { mode: 'low_energy', label: '🧘 Día baja energía' },
  { mode: 'logistics_only', label: '🚗 Solo logística' },
  { mode: 'high_visual', label: '📸 Solo alto impacto visual' }
];

export default function EnergyModeToggle({ mode, onChange }: EnergyModeToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const active = option.mode === mode;
        return (
          <button
            key={option.mode}
            type="button"
            onClick={() => onChange(option.mode)}
            className={`travel-button rounded-xl border px-3 py-2 text-xs sm:text-sm ${
              active
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white/85 text-slate-700 hover:border-slate-400'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
