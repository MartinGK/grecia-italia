import { DailyBlock, EnergyLevel } from '@/lib/types';

export type EnergyMode = 'all' | 'must_do' | 'low_energy' | 'logistics_only' | 'high_visual';

const ENERGY_COLORS: Record<EnergyLevel, string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500'
};

export const getEnergyColor = (level: EnergyLevel) => ENERGY_COLORS[level];

export const isSunsetBlock = (title: string) => {
  const normalized = title.toLowerCase();
  return normalized.includes('atardecer') || normalized.includes('sunset');
};

export const normalizeVisualScore = (score: number): 1 | 2 | 3 | 4 | 5 => {
  if (score <= 1) return 1;
  if (score >= 5) return 5;
  return Math.round(score) as 1 | 2 | 3 | 4 | 5;
};

export const applyModeFilter = (blocks: DailyBlock[], mode: EnergyMode) => {
  if (mode === 'all') return blocks;
  if (mode === 'must_do') return blocks.filter((block) => block.category === 'imperdible');
  if (mode === 'low_energy') return blocks.filter((block) => block.effortLevel === 'low');
  if (mode === 'logistics_only') return blocks.filter((block) => block.category === 'logistica_critica');
  return blocks.filter((block) => normalizeVisualScore(block.visualImpactScore) >= 4);
};

export const buildGoogleEmbedUrl = (query: string) => {
  const encoded = encodeURIComponent(query);
  return `https://www.google.com/maps?q=${encoded}&output=embed`;
};

export const getFallbackMapQuery = (title: string, destination: string) => `${title} ${destination}`;

export const markerScaleClass = (score: number) => {
  const clamped = normalizeVisualScore(score);
  if (clamped >= 5) return 'h-3.5 w-3.5';
  if (clamped === 4) return 'h-3 w-3';
  if (clamped === 3) return 'h-2.5 w-2.5';
  return 'h-2 w-2';
};
