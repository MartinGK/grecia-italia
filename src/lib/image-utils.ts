import { CityImage, ItineraryItem } from './types';

export const mapsSearchLink = (query: string): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php';
const IMAGE_EXT_REGEX = /\.(jpe?g|png|webp)$/i;

const imageCache = new Map<string, Promise<CityImage[]>>();

export const normalizePlaceSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeImageSrc = (src: string): string => {
  try {
    const url = new URL(src);
    url.search = '';
    return url.toString().toLowerCase();
  } catch {
    return src.toLowerCase();
  }
};

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);

const cleanCityName = (cityName: string): string =>
  cityName
    .replace(/\(.*?\)/g, ' ')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const dedupeStrings = (values: string[]): string[] => {
  const seen = new Set<string>();
  return values.filter((value) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

export const makeFallbackImage = (citySlug: string, placeId: string, label: string): CityImage => ({
  placeId,
  citySlug,
  src: '/travel-fallback.svg',
  alt: `${label} (imagen de referencia)`,
  creditText: 'Imagen de respaldo',
  creditUrl: '#',
  tags: tokenize(label),
  source: 'fallback',
  score: 0
});

export const wikiImage = (
  citySlug: string,
  placeId: string,
  src: string,
  alt: string,
  creditUrl: string,
  tags: string[] = []
): CityImage => ({
  placeId,
  citySlug,
  src,
  alt,
  creditText: 'Foto: Wikimedia Commons',
  creditUrl,
  tags,
  source: 'wikimedia',
  score: 0
});

export const dedupeImages = (images: CityImage[]): CityImage[] => {
  const seen = new Set<string>();

  return images.filter((image) => {
    const key = normalizeImageSrc(image.src);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const scoreImageRelevance = (
  text: string,
  poiTokens: string[],
  cityTokens: string[],
  categories: string[] = []
): number => {
  const haystackTokens = new Set([...tokenize(text), ...categories.flatMap(tokenize)]);

  let score = 0;
  poiTokens.forEach((token) => {
    if (haystackTokens.has(token)) score += 4;
  });

  cityTokens.forEach((token) => {
    if (haystackTokens.has(token)) score += 2;
  });

  return score;
};

export const pickUniqueImagesForPlaces = (
  items: ItineraryItem[],
  candidatesByPlace: Record<string, CityImage[]>
): Record<string, CityImage> => {
  const assigned: Record<string, CityImage> = {};
  const usedSrc = new Set<string>();

  items.forEach((item) => {
    const candidates = candidatesByPlace[item.placeId] ?? [];
    const uniqueCandidate = candidates.find((candidate) => !usedSrc.has(normalizeImageSrc(candidate.src)));
    const picked = uniqueCandidate ?? candidates[0] ?? item.image;

    assigned[item.placeId] = picked;
    usedSrc.add(normalizeImageSrc(picked.src));
  });

  return assigned;
};

export const fetchWikimediaPlaceImages = async ({
  citySlug,
  cityName,
  placeId,
  placeName,
  mapsQuery,
  limit = 8
}: {
  citySlug: string;
  cityName: string;
  placeId: string;
  placeName: string;
  mapsQuery: string;
  limit?: number;
}): Promise<CityImage[]> => {
  const cacheKey = `${citySlug}:${placeId}:${limit}`;
  const cached = imageCache.get(cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    const normalizedCity = cleanCityName(cityName);
    const searchQueries = dedupeStrings([
      `${mapsQuery} ${normalizedCity}`,
      `${placeName} ${normalizedCity}`,
      mapsQuery,
      placeName
    ]);

    const poiTokens = tokenize(`${placeName} ${mapsQuery}`);
    const cityTokens = tokenize(normalizedCity);
    const collected: CityImage[] = [];

    for (const query of searchQueries) {
      if (collected.length >= limit * 2) break;

      const url = `${WIKIMEDIA_API}?action=query&generator=search&gsrsearch=${encodeURIComponent(
        query
      )}&gsrnamespace=6&gsrlimit=20&prop=imageinfo|categories&iiprop=url|descriptionurl&cllimit=20&format=json&origin=*`;

      const response = await fetch(url);
      if (!response.ok) continue;

      const data = (await response.json()) as {
        query?: {
          pages?: Record<
            string,
            {
              title?: string;
              categories?: Array<{ title?: string }>;
              imageinfo?: Array<{ url?: string; descriptionurl?: string }>;
            }
          >;
        };
      };

      const images = Object.values(data.query?.pages ?? {}).flatMap((page) => {
        const imageInfo = page.imageinfo?.[0];
        const src = imageInfo?.url;
        if (!src || !IMAGE_EXT_REGEX.test(src)) return [];

        const title = page.title ?? '';
        const categories = (page.categories ?? []).map((category) => category.title ?? '').filter(Boolean);
        const score = scoreImageRelevance(`${query} ${title}`, poiTokens, cityTokens, categories);
        if (score <= 0) return [];

        const image: CityImage = {
          placeId,
          citySlug,
          src,
          alt: `${placeName} · ${normalizedCity || cityName}`,
          creditText: 'Foto: Wikimedia Commons',
          creditUrl: imageInfo?.descriptionurl ?? 'https://commons.wikimedia.org/',
          tags: [...tokenize(query), ...tokenize(title), ...categories.flatMap(tokenize)],
          source: 'wikimedia',
          score
        };

        return [image];
      });

      collected.push(...images);
    }

    return dedupeImages(collected)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, limit);
  })();

  imageCache.set(cacheKey, promise);
  return promise;
};

export const DEFAULT_GALLERY_IMAGES: CityImage[] = [
  wikiImage(
    'athens',
    'athens-acropolis-view',
    'https://upload.wikimedia.org/wikipedia/commons/c/c6/Attica_06-13_Athens_50_View_from_Philopappos_-_Acropolis_Hill.jpg',
    'Vista de Atenas y Acrópolis',
    'https://commons.wikimedia.org/wiki/File:Attica_06-13_Athens_50_View_from_Philopappos_-_Acropolis_Hill.jpg',
    ['athens', 'acropolis']
  ),
  wikiImage(
    'mykonos',
    'mykonos-town-view',
    'https://upload.wikimedia.org/wikipedia/commons/3/3e/Mykonos_Town_Greece-2_%2843720541080%29.jpg',
    'Mykonos Town',
    'https://commons.wikimedia.org/wiki/File:Mykonos_Town_Greece-2_(43720541080).jpg',
    ['mykonos', 'town']
  ),
  wikiImage(
    'mykonos',
    'mykonos-streets',
    'https://upload.wikimedia.org/wikipedia/commons/a/a0/Mykonos_Town_Greece-5_%2831665312028%29.jpg',
    'Calles de Míkonos',
    'https://commons.wikimedia.org/wiki/File:Mykonos_Town_Greece-5_(31665312028).jpg',
    ['mykonos']
  ),
  wikiImage(
    'santorini',
    'santorini-panoramic',
    'https://upload.wikimedia.org/wikipedia/commons/e/ec/View_of_Santorini_in_2003.jpg',
    'Panorámica de Santorini',
    'https://commons.wikimedia.org/wiki/File:View_of_Santorini_in_2003.jpg',
    ['santorini']
  ),
  wikiImage(
    'santorini',
    'santorini-oia',
    'https://upload.wikimedia.org/wikipedia/commons/7/75/Santorini_Oia_Greece_Travel_Summer_Greek_Island.jpg',
    'Oia, Santorini',
    'https://commons.wikimedia.org/wiki/File:Santorini_Oia_Greece_Travel_Summer_Greek_Island.jpg',
    ['santorini', 'oia']
  ),
  wikiImage(
    'santorini',
    'santorini-fira-dusk',
    'https://upload.wikimedia.org/wikipedia/commons/2/2e/A_view_of_Fira_from_Pyrgos_at_dusk_%282601219148%29.jpg',
    'Fira al atardecer',
    'https://commons.wikimedia.org/wiki/File:A_view_of_Fira_from_Pyrgos_at_dusk_(2601219148).jpg',
    ['santorini', 'fira']
  ),
  wikiImage(
    'florence',
    'florence-piazza-repubblica',
    'https://upload.wikimedia.org/wikipedia/commons/2/22/Piazza_della_Repubblica_-_Florence%2C_Italy.JPG',
    'Piazza della Repubblica, Florencia',
    'https://commons.wikimedia.org/wiki/File:Piazza_della_Repubblica_-_Florence,_Italy.JPG',
    ['florence']
  ),
  wikiImage(
    'florence',
    'florence-cityscape-duomo',
    'https://upload.wikimedia.org/wikipedia/commons/e/e5/Cityscape_view_looking_toward_cathedral%2C_Florence%2C_Italy_LOC_4711374873.jpg',
    'Florencia y su catedral',
    'https://commons.wikimedia.org/wiki/File:Cityscape_view_looking_toward_cathedral,_Florence,_Italy_LOC_4711374873.jpg',
    ['florence', 'duomo']
  ),
  wikiImage(
    'sorrento',
    'sorrento-coast',
    'https://upload.wikimedia.org/wikipedia/commons/a/ad/Sorrento_by_the_sea%2C_Naples%2C_Italy_LOC_4711992430.jpg',
    'Costa de Sorrento',
    'https://commons.wikimedia.org/wiki/File:Sorrento_by_the_sea,_Naples,_Italy_LOC_4711992430.jpg',
    ['sorrento']
  ),
  wikiImage(
    'amalfi',
    'amalfi-view',
    'https://upload.wikimedia.org/wikipedia/commons/2/2b/Amalfi_-_7440.jpg',
    'Vista de Amalfi',
    'https://commons.wikimedia.org/wiki/File:Amalfi_-_7440.jpg',
    ['amalfi']
  ),
  wikiImage(
    'amalfi',
    'amalfi-coast-view',
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Amalfi_Coast%2C_view.jpg',
    'Costa Amalfitana',
    'https://commons.wikimedia.org/wiki/File:Amalfi_Coast,_view.jpg',
    ['amalfi', 'coast']
  ),
  wikiImage(
    'rome',
    'rome-trevi-fountain',
    'https://upload.wikimedia.org/wikipedia/commons/7/7e/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg',
    'Fontana di Trevi, Roma',
    'https://commons.wikimedia.org/wiki/File:Trevi_Fountain,_Rome,_Italy_2_-_May_2007.jpg',
    ['rome', 'trevi']
  )
];
