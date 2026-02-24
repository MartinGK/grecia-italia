import { buildGoogleEmbedUrl, markerScaleClass } from '@/lib/daily-itinerary-utils';

type SelectedBlock = {
  title: string;
  query: string;
  isLogistics: boolean;
  score: number;
  key: string;
};

type MapSyncLayerProps = {
  selected: SelectedBlock | null;
};

export default function MapSyncLayer({ selected }: MapSyncLayerProps) {
  const current = selected ?? {
    title: 'Selecciona un bloque para centrar el mapa',
    query: 'Athens city center',
    isLogistics: false,
    score: 3,
    key: 'fallback'
  };

  return (
    <aside className="glass-card sticky top-20 h-fit overflow-hidden p-3 sm:p-4">
      <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Mapa sincronizado</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{current.title}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
          <span
            className={`inline-block rounded-full ${current.isLogistics ? 'bg-sky-500' : 'bg-cyan-500'} ${markerScaleClass(
              current.score
            )}`}
          />
          <span>{current.isLogistics ? 'Transporte/logística' : 'Actividad'}</span>
          <span>Impacto visual {current.score}/5</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-200">
        <iframe
          key={current.key}
          title={`Mapa de ${current.title}`}
          src={buildGoogleEmbedUrl(current.query)}
          className="h-[280px] w-full sm:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </aside>
  );
}
