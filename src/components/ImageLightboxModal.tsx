'use client';

import { CityImage } from '@/lib/types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ImageLightboxModalProps = {
  image: CityImage | null;
  onClose: () => void;
};

export default function ImageLightboxModal({ image, onClose }: ImageLightboxModalProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!image) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [image, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/92 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada: ${image.alt}`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-[95] rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            Cerrar
          </button>

          <motion.div
            className="relative h-[88vh] w-[96vw] max-w-7xl"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              unoptimized
              className="object-contain"
              onError={(event) => {
                const target = event.currentTarget;
                if (!target.src.includes('/travel-fallback.svg')) {
                  target.src = '/travel-fallback.svg';
                }
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    ,
    document.body
  );
}
