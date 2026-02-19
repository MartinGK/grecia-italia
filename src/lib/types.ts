export type Category = 'Cultura' | 'Playas' | 'Nightlife' | 'Gastronomía' | 'Excursiones';

export type UsefulLink = {
  label: string;
  url: string;
  note?: string;
};

export type ItineraryItem = {
  placeId: string;
  name: string;
  description: string;
  mapsQuery: string;
  mapsLink: string;
  category: Category;
  image: CityImage;
};

export type CityImage = {
  placeId: string;
  citySlug: string;
  src: string;
  alt: string;
  creditText: string;
  creditUrl: string;
  tags: string[];
  source: 'wikimedia' | 'fallback';
  score?: number;
};

export type CityData = {
  slug: string;
  name: string;
  dateRange: string;
  intro: string;
  imageQueries: string[];
  heroImage: CityImage;
  carouselImages: CityImage[];
  masonryImages: CityImage[];
  sections: {
    imperdibles: ItineraryItem[];
    dayTrips: ItineraryItem[];
    comer: ItineraryItem[];
    noche: ItineraryItem[];
    tipTiming: string;
  };
  mapsLink: string;
  usefulLinks: UsefulLink[];
};

export type CountryData = {
  slug: 'grecia' | 'italia';
  name: string;
  palette: [string, string, string, string, string];
  summary: string;
  usefulLinks: UsefulLink[];
  cities: CityData[];
};

export type TimelineItem = {
  city: string;
  country: string;
  dateRange: string;
};

export type ItineraryData = {
  tripTitle: string;
  tripDates: string;
  timeline: TimelineItem[];
  countries: CountryData[];
  logistics: {
    transport: string[];
    checklist: string[];
  };
};
