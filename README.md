# Grecia + Italia 2026 · Travel Magazine Itinerary

Web app one-page mobile-first construida con Next.js (App Router), TypeScript, Tailwind CSS y Framer Motion.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- `next/image` para optimización/lazy loading

## Ejecutar

```bash
pnpm install
pnpm dev
```

Abrir `http://localhost:3000`.

## Estructura principal

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/*`
- `src/data/itinerary.ts`
- `src/lib/types.ts`
- `next.config.js`

## Notas

- El contenido es data-driven desde `src/data/itinerary.ts`.
- Las imágenes usan fuentes reales (principalmente Unsplash Source, con soporte para Pexels/Wikimedia).
- Se respeta `prefers-reduced-motion` para animaciones.
- Links de tickets/ferries pueden variar según temporada; verificar fuentes oficiales.
