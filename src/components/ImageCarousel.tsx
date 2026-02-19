'use client';

import { VIEWPORT_PROPS } from '@/lib/constants';
import { CityImage } from '@/lib/types';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

type ImageCarouselProps = {
  title: string;
  images: CityImage[];
};

export default function ImageCarousel({ title, images }: ImageCarouselProps) {
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
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {images.map((image, idx) => (
          <motion.figure
            key={`${image.src}-${idx}`}
            className="glass-card min-w-[78%] snap-start overflow-hidden sm:min-w-[48%] lg:min-w-[32%]"
            whileHover={reduceMotion ? undefined : { y: -4 }}
            whileTap={reduceMotion ? undefined : { scale: 0.99 }}
          >
            <div className="relative aspect-[4/3]">
              <a href={image.src} target="_blank" rel="noreferrer" aria-label={`Abrir imagen completa: ${image.alt}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 48vw, 32vw"
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
            <figcaption className="px-3 py-2 text-xs text-slate-600">{image.alt}</figcaption>
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
