'use client';

import { VIEWPORT_PROPS } from '@/lib/constants';
import {
  DEFAULT_GALLERY_IMAGES,
  dedupeImages,
  fetchWikimediaPlaceImages,
  pickUniqueImagesForPlaces
} from '@/lib/image-utils';
import { Category, CityData, CityImage, ItineraryItem } from '@/lib/types';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ImageCarousel from './ImageCarousel';
import MapsLink from './MapsLink';
import MasonryGrid from './MasonryGrid';

type CitySectionProps = {
  city: CityData;
  activeCategory: Category | null;
};

const withFallbackImage = (image: CityImage, citySlug: string, placeId: string): CityImage => ({
  ...image,
  citySlug,
  placeId
});

export default function CitySection({ city, activeCategory }: CitySectionProps) {
  const reduceMotion = useReducedMotion();
  const [resolvedPlaceImages, setResolvedPlaceImages] = useState<Record<string, CityImage>>({});

  const allItems = useMemo(
    () => [...city.sections.imperdibles, ...city.sections.dayTrips, ...city.sections.comer, ...city.sections.noche],
    [city.sections.comer, city.sections.dayTrips, city.sections.imperdibles, city.sections.noche]
  );

  useEffect(() => {
    let cancelled = false;

    const loadPlaceImages = async () => {
      const candidates = await Promise.all(
        allItems.map(async (it) => {
          const placeCandidates = await fetchWikimediaPlaceImages({
            citySlug: city.slug,
            cityName: city.name,
            placeId: it.placeId,
            placeName: it.name,
            mapsQuery: it.mapsQuery,
            limit: 8
          });

          return [it.placeId, placeCandidates] as const;
        })
      );

      if (cancelled) return;

      const candidatesByPlace = Object.fromEntries(candidates);
      const assigned = pickUniqueImagesForPlaces(allItems, candidatesByPlace);
      setResolvedPlaceImages(assigned);
    };

    void loadPlaceImages();

    return () => {
      cancelled = true;
    };
  }, [allItems, city.name, city.slug]);

  const getItemImage = (item: ItineraryItem): CityImage => {
    const resolved = resolvedPlaceImages[item.placeId] ?? item.image;
    return withFallbackImage(resolved, city.slug, item.placeId);
  };

  const cityDefaults = useMemo(
    () => DEFAULT_GALLERY_IMAGES.filter((image) => image.citySlug === city.slug),
    [city.slug]
  );

  const allDefaults = useMemo(() => dedupeImages([...cityDefaults, ...DEFAULT_GALLERY_IMAGES]), [cityDefaults]);

  const getFallbackFromDefaults = useCallback(
    (item: ItineraryItem): CityImage => {
      const index =
        item.placeId
          .split('')
          .reduce((acc, char) => acc + char.charCodeAt(0), 0) % Math.max(1, allDefaults.length);
      const base = allDefaults[index] ?? city.heroImage;
      return {
        ...base,
        placeId: item.placeId,
        citySlug: city.slug,
        alt: `${item.name} · ${city.name}`
      };
    },
    [allDefaults, city.heroImage, city.name, city.slug]
  );

  const galleryPool = useMemo(
    () =>
      dedupeImages([
        ...allItems.map((item) => {
          const resolved = resolvedPlaceImages[item.placeId] ?? item.image;
          const withContext = withFallbackImage(resolved, city.slug, item.placeId);
          return withContext.src === '/travel-fallback.svg' ? getFallbackFromDefaults(item) : withContext;
        }),
        ...city.carouselImages,
        ...city.masonryImages,
        city.heroImage,
        ...cityDefaults
      ]).filter((image) => image.src !== '/travel-fallback.svg'),
    [
      allItems,
      city.carouselImages,
      city.heroImage,
      city.masonryImages,
      city.slug,
      cityDefaults,
      getFallbackFromDefaults,
      resolvedPlaceImages
    ]
  );

  const heroImage = galleryPool[0] ?? allDefaults[0] ?? city.heroImage;
  const carouselImages = galleryPool.length >= 6 ? galleryPool.slice(0, 6) : dedupeImages([...galleryPool, ...allDefaults]).slice(0, 6);
  const masonryImages = galleryPool.length >= 8 ? galleryPool.slice(0, 8) : dedupeImages([...galleryPool, ...allDefaults]).slice(0, 8);

  const renderItems = (items: ItineraryItem[]) =>
    items.map((it) => {
      const active = !activeCategory || it.category === activeCategory;
      const selected = getItemImage(it);
      const thumb = selected.src === '/travel-fallback.svg' ? getFallbackFromDefaults(it) : selected;

      return (
        <li
          key={it.placeId}
          className={`rounded-xl border p-3 transition ${
            active
              ? 'border-slate-200 bg-white/90 shadow-sm'
              : 'border-slate-100 bg-slate-50/80 opacity-45 grayscale-[0.1]'
          }`}
        >
          <div className="mb-1 flex items-start gap-3">
          <div className="relative mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200">
            <a
              href={thumb.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`Abrir imagen completa de ${it.name}`}
              className="absolute inset-0 z-10"
            />
            <Image
              src={thumb.src}
              alt={`${it.name} · ${city.name}`}
                fill
                sizes="48px"
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
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start justify-between gap-2">
                <h5 className="text-sm font-semibold text-slate-900">{it.name}</h5>
                <span className="category-chip border-slate-200 bg-slate-100 text-[10px] text-slate-600">{it.category}</span>
              </div>
              <p className="text-sm text-slate-600">{it.description}</p>
            </div>
          </div>
          <div className="mt-3">
            <MapsLink url={it.mapsLink} label="Ver en Maps" className="px-3 py-1.5 text-xs" />
          </div>
        </li>
      );
    });

  return (
    <motion.article
      id={city.slug}
      className="glass-card overflow-hidden p-4 sm:p-6"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={VIEWPORT_PROPS}
      transition={{ duration: 0.45 }}
    >
      <div className="relative mb-5 overflow-hidden rounded-2xl">
        <div className="absolute left-3 top-3 z-10 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
          {city.dateRange}
        </div>
        <div className="relative aspect-[7/4] overflow-hidden rounded-2xl sm:aspect-[9/4]">
          {heroImage ? (
            <a href={heroImage.src} target="_blank" rel="noreferrer" aria-label={`Abrir imagen completa de ${city.name}`}>
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                priority={false}
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
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#336cce] via-[#4149c3] to-slate-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          <div className="absolute bottom-0 p-4 sm:p-5">
            <h4 className="text-2xl text-white sm:text-3xl" style={{ fontFamily: 'var(--font-playfair)' }}>
              {city.name}
            </h4>
            <p className="mt-1 max-w-2xl text-sm text-slate-100">{city.intro}</p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <MapsLink url={city.mapsLink} label={`Mapa general de ${city.name}`} />
        {city.usefulLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="travel-button border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Imperdibles</p>
          <ul className="space-y-2">{renderItems(city.sections.imperdibles)}</ul>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cerca / day trips</p>
          <ul className="space-y-2">{renderItems(city.sections.dayTrips)}</ul>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Comer</p>
          <ul className="space-y-2">{renderItems(city.sections.comer)}</ul>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Noche</p>
          <ul className="space-y-2">{renderItems(city.sections.noche)}</ul>
        </section>
      </div>

      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">Tip de timing</p>
        <p className="mt-1 text-sm text-amber-900">{city.sections.tipTiming}</p>
      </div>

      <div className="mt-7 space-y-7">
        <ImageCarousel title="Carrusel de ciudad" images={carouselImages} />
        <MasonryGrid title="Mosaico visual" images={masonryImages} />
      </div>
    </motion.article>
  );
}
