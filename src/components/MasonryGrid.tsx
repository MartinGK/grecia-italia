'use client';

import { VIEWPORT_PROPS } from '@/lib/constants';
import { CityImage } from '@/lib/types';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

type MasonryGridProps = {
  title: string;
  images: CityImage[];
};

export default function MasonryGrid({ title, images }: MasonryGridProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="space-y-3"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={VIEWPORT_PROPS}
      transition={{ duration: 0.45 }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>

      <div className="columns-2 gap-3 md:columns-4">
        {images.map((image, idx) => (
          <motion.figure
            key={`${image.src}-${idx}`}
            className={`glass-card mb-3 overflow-hidden ${idx >= 4 ? 'hidden md:block' : ''}`}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={VIEWPORT_PROPS}
            transition={{ duration: 0.35, delay: reduceMotion ? 0 : idx * 0.03 }}
          >
            <div className="relative aspect-[3/4] w-full">
              <a href={image.src} target="_blank" rel="noreferrer" aria-label={`Abrir imagen completa: ${image.alt}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 48vw, 24vw"
                  loading="lazy"
                  unoptimized
                  className="object-cover"
                  onError={(event) => {
                    const target = event.currentTarget;
                    if (!target.src.includes('/travel-fallback.svg')) {
                      target.src = '/travel-fallback.svg';
                    }
                  }}
                />
              </a>
            </div>
          </motion.figure>
        ))}
      </div>

      <p className="text-[11px] text-slate-500">
        Photo credit:{' '}
        {images.slice(0, 3).map((image, idx) => (
          <span key={`${image.creditUrl}-${idx}`}>
            <a className="underline" href={image.creditUrl} target="_blank" rel="noreferrer">
              {image.creditText}
            </a>
            {idx < Math.min(images.length, 3) - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
    </motion.div>
  );
}
