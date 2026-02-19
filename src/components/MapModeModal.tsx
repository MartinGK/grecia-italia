'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type MapEntry = {
  country: string;
  city: string;
  label: string;
  url: string;
};

type MapModeModalProps = {
  open: boolean;
  onClose: () => void;
  entries: MapEntry[];
};

export default function MapModeModal({ open, onClose, entries }: MapModeModalProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <motion.div
            className="max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-700">Modo mapa</h3>
              <button
                type="button"
                onClick={onClose}
                className="travel-button border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto px-4 py-4">
              {entries.map((entry, idx) => (
                <a
                  key={`${entry.city}-${entry.label}-${idx}`}
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-cyan-400 hover:bg-cyan-50"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {entry.country} · {entry.city}
                  </p>
                  <p className="text-sm font-medium text-slate-800">{entry.label}</p>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
