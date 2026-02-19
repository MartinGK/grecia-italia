'use client';

import { CATEGORY_CHIPS } from '@/lib/constants';
import { Category } from '@/lib/types';

type CategoryFilterProps = {
  activeCategory: Category | null;
  onChange: (category: Category | null) => void;
};

export default function CategoryFilter({ activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="glass-card p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filtrar por categoría</div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`category-chip ${
            activeCategory === null
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-300 bg-white/80 text-slate-700 hover:border-slate-400'
          }`}
        >
          Todas
        </button>
        {CATEGORY_CHIPS.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`category-chip ${
              activeCategory === category
                ? 'border-cyan-600 bg-cyan-600 text-white'
                : 'border-slate-300 bg-white/80 text-slate-700 hover:border-cyan-400 hover:text-cyan-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
