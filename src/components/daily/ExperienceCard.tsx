import { getFallbackMapQuery, isSunsetBlock, normalizeVisualScore } from '@/lib/daily-itinerary-utils';
import { DailyBlock } from '@/lib/types';
import LogisticsBlock from './LogisticsBlock';

type ExperienceCardProps = {
  block: DailyBlock;
  destination: string;
  active: boolean;
  onSelect: (query: string, title: string, isLogistics: boolean, score: number) => void;
};

const Badge = ({ children }: { children: string }) => (
  <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700">
    {children}
  </span>
);

export default function ExperienceCard({ block, destination, active, onSelect }: ExperienceCardProps) {
  const isLogistics = block.category === 'logistica_critica';
  const mapQuery = block.mapQuery || getFallbackMapQuery(block.title, destination);
  const score = normalizeVisualScore(block.visualImpactScore);

  const content = (
    <button
      type="button"
      onClick={() => onSelect(mapQuery, block.title, isLogistics, score)}
      className={`w-full rounded-2xl border p-3 text-left transition sm:p-4 ${
        active
          ? 'border-slate-900 bg-slate-900/95 text-white shadow-[0_14px_28px_-20px_rgba(15,23,42,0.9)]'
          : 'border-slate-200 bg-white/90 text-slate-900 hover:border-slate-300'
      }`}
      aria-label={`Centrar mapa en ${block.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold sm:text-base">{block.title}</h4>
        <span className={`text-xs font-semibold ${active ? 'text-slate-200' : 'text-slate-500'}`}>#{score}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {score >= 4 ? <Badge>📸 wow</Badge> : null}
        {block.requiresTickets ? <Badge>🎟️ reservar</Badge> : null}
        {block.walkable ? <Badge>🚶 caminable</Badge> : null}
        {isSunsetBlock(block.title) ? <Badge>🌅 sunset</Badge> : null}
      </div>

      <div className={`mt-3 flex items-center gap-3 text-xs ${active ? 'text-slate-200' : 'text-slate-600'}`}>
        <span>⏱ {block.duration}</span>
        <span>⚡ {block.effortLevel}</span>
      </div>
    </button>
  );

  if (isLogistics) {
    return <LogisticsBlock active={active}>{content}</LogisticsBlock>;
  }

  return content;
}
