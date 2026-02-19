import { Category } from './types';

export const NAV_ITEMS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#timeline', label: 'Timeline' },
  { href: '#grecia', label: 'Grecia' },
  { href: '#italia', label: 'Italia' },
  { href: '#logistica', label: 'Logística' }
] as const;

export const CATEGORY_CHIPS: Category[] = [
  'Cultura',
  'Playas',
  'Nightlife',
  'Gastronomía',
  'Excursiones'
];

export const VIEWPORT_PROPS = { once: true, amount: 0.2 } as const;
