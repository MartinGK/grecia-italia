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

export type DailyAvailability = 'full_day' | 'afternoon_only';
export type EnergyLevel = 'high' | 'medium' | 'low';
export type ArrivalType = DailyAvailability | 'late_arrival';
export type BlockCategory =
  | 'imperdible'
  | 'muy_recomendado'
  | 'exploracion'
  | 'experiencia_local'
  | 'logistica_critica';

export type DailyBlock = {
  title: string;
  category: BlockCategory;
  duration: string;
  effortLevel: EnergyLevel;
  requiresTickets: boolean;
  visualImpactScore: 1 | 2 | 3 | 4 | 5;
  walkable: boolean;
  mapQuery: string;
};

export type DailyPlanDay = {
  dateLabel: string;
  availability: DailyAvailability;
  blocks: DailyBlock[];
};

export type DestinationPlan = {
  destination: string;
  arrivalType: ArrivalType;
  energyLevel: EnergyLevel;
  days: DailyPlanDay[];
};

export type DailyItineraryData = DestinationPlan[];
