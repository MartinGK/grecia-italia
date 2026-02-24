import { ReactNode } from 'react';

type LogisticsBlockProps = {
  children: ReactNode;
  active?: boolean;
};

export default function LogisticsBlock({ children, active = false }: LogisticsBlockProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-dashed p-3 transition sm:p-4 ${
        active
          ? 'border-sky-500 bg-sky-50/90 shadow-[0_10px_24px_-16px_rgba(2,132,199,0.9)]'
          : 'border-sky-300/80 bg-sky-50/60'
      }`}
    >
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-300 bg-white/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-800">
        <span aria-hidden>🚌</span>
        Logistica critica
      </div>
      {children}
    </div>
  );
}
