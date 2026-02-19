import {
  DEFAULT_GALLERY_IMAGES,
  makeFallbackImage,
  mapsSearchLink,
  normalizePlaceSlug,
  wikiImage
} from '@/lib/image-utils';
import { CityData, CityImage, ItineraryData } from '@/lib/types';

const item = (
  name: string,
  description: string,
  mapsQuery: string,
  category: 'Cultura' | 'Playas' | 'Nightlife' | 'Gastronomía' | 'Excursiones'
) => ({
  placeId: normalizePlaceSlug(`${name}-${mapsQuery}`),
  name,
  description,
  mapsQuery,
  mapsLink: mapsSearchLink(mapsQuery),
  category,
  image: makeFallbackImage('unassigned', normalizePlaceSlug(`${name}-${mapsQuery}`), name)
});

const buildCityImages = (citySlug: string, city: string, queries: string[], wiki: CityImage[] = []) => {
  const cityDefaults = DEFAULT_GALLERY_IMAGES.filter((image) => image.citySlug === citySlug);
  const placeholders = queries.map((query) => makeFallbackImage(citySlug, normalizePlaceSlug(query), `${city}: ${query}`));
  const gallery = [...wiki, ...cityDefaults, ...placeholders];
  const deduped = gallery.filter(
    (image, index, array) => array.findIndex((current) => current.src === image.src) === index
  );

  const heroImage = deduped[0] ?? makeFallbackImage(citySlug, `${citySlug}-hero`, `${city}: vista destacada`);
  const carouselImages = deduped.slice(0, 6);
  const masonryImages = deduped.slice(0, 8);

  return { heroImage, carouselImages, masonryImages };
};

const athensQueries = [
  'athens acropolis',
  'plaka athens',
  'monastiraki square',
  'athens rooftop view',
  'athens agora',
  'athens riviera',
  'lycabettus hill athens',
  'athens street food'
];

const mykonosQueries = [
  'mykonos windmills',
  'little venice mykonos',
  'mykonos old town alleys',
  'super paradise beach mykonos',
  'mykonos sunset',
  'mykonos beach club',
  'delos island ruins',
  'mykonos port'
];

const santoriniQueries = [
  'santorini oia blue domes',
  'fira santorini caldera',
  'imerovigli santorini',
  'red beach santorini',
  'santorini sunset',
  'akrotiri santorini ruins',
  'pyrgos santorini',
  'amoudi bay santorini'
];

const chaniaQueries = [
  'chania old venetian harbor',
  'balos lagoon crete',
  'elafonissi beach',
  'samaria gorge',
  'chania old town',
  'crete taverna',
  'falassarna beach',
  'rethymno venetian streets'
];

const florenceQueries = [
  'florence duomo',
  'ponte vecchio florence',
  'uffizi gallery',
  'piazzale michelangelo',
  'florence streets',
  'florence trattoria',
  'fiesole view florence',
  'accademia florence david'
];

const sorrentoQueries = [
  'sorrento marina grande',
  'sorrento lemon groves',
  'sorrento coast view',
  'bagni regina giovanna',
  'sorrento piazza tasso',
  'sorrento sunset',
  'pompeii ruins',
  'capri faraglioni'
];

const amalfiQueries = [
  'amalfi town cathedral',
  'positano colorful houses',
  'ravello coast view',
  'amalfi coast ferry',
  'atrani amalfi',
  'path of the gods amalfi',
  'fiordo di furore',
  'amalfi beach'
];

const romeQueries = [
  'rome colosseum',
  'rome trevi fountain',
  'rome trastevere',
  'vatican st peters square',
  'pantheon rome',
  'roman forum',
  'rome rooftop sunset',
  'rome food market'
];

const athensImages = buildCityImages(
  'athens',
  'Atenas',
  athensQueries,
  [
    wikiImage(
      'athens',
      'athens-parthenon',
      'https://upload.wikimedia.org/wikipedia/commons/d/da/The_Parthenon_in_Athens.jpg',
      'Partenón de Atenas',
      'https://commons.wikimedia.org/wiki/File:The_Parthenon_in_Athens.jpg',
      ['athens', 'parthenon', 'acropolis']
    )
  ]
);

const mykonosImages = buildCityImages('mykonos', 'Míkonos', mykonosQueries);
const santoriniImages = buildCityImages('santorini', 'Santorini', santoriniQueries);
const chaniaImages = buildCityImages('chania', 'La Canea', chaniaQueries);
const florenceImages = buildCityImages(
  'florence',
  'Florencia',
  florenceQueries,
  [
    wikiImage(
      'florence',
      'florence-duomo',
      'https://upload.wikimedia.org/wikipedia/commons/0/0b/Cattedrale_di_Santa_Maria_del_Fiore_-_Florence_Cathedral.jpg',
      'Catedral de Santa Maria del Fiore',
      'https://commons.wikimedia.org/wiki/File:Cattedrale_di_Santa_Maria_del_Fiore_-_Florence_Cathedral.jpg',
      ['florence', 'duomo']
    )
  ]
);
const sorrentoImages = buildCityImages('sorrento', 'Sorrento', sorrentoQueries);
const amalfiImages = buildCityImages('amalfi', 'Amalfi', amalfiQueries);
const romeImages = buildCityImages(
  'rome',
  'Roma',
  romeQueries,
  [
    wikiImage(
      'rome',
      'rome-colosseum',
      'https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseo_2020.jpg',
      'Coliseo Romano',
      'https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg',
      ['rome', 'colosseum']
    )
  ]
);

const greeceCities: CityData[] = [
  {
    slug: 'athens',
    name: 'Atenas',
    dateRange: '2-5 abril 2026',
    intro: 'Base cultural para arrancar el viaje entre ruinas clásicas, barrios con vida y atardeceres urbanos.',
    imageQueries: athensQueries,
    ...athensImages,
    sections: {
      imperdibles: [
        item('Acrópolis y Partenón', 'Entrá temprano para evitar calor y filas.', 'Acropolis Athens', 'Cultura'),
        item('Museo de la Acrópolis', 'Ideal para entender contexto histórico antes o después de subir.', 'Acropolis Museum Athens', 'Cultura'),
        item('Plaka', 'Barrio ideal para caminar sin rumbo y comprar artesanía.', 'Plaka Athens', 'Cultura'),
        item('Monastiraki', 'Mercado y terrazas con vista a la Acrópolis.', 'Monastiraki Square Athens', 'Gastronomía'),
        item('Monte Licabeto', 'Subí al atardecer para una panorámica total de la ciudad.', 'Lycabettus Hill Athens', 'Excursiones'),
        item('Templo de Zeus Olímpico', 'Sitio arqueológico rápido de visitar camino al centro.', 'Temple of Olympian Zeus Athens', 'Cultura')
      ],
      dayTrips: [
        item('Cabo Sunión', 'Templo de Poseidón con sunset muy recomendado.', 'Temple of Poseidon Sounion', 'Excursiones'),
        item('Aegina', 'Escapada en ferry para playa y pistachos locales.', 'Aegina Port', 'Playas'),
        item('Delfos', 'Jornada larga, pero uno de los sitios arqueológicos clave de Grecia.', 'Delphi Archaeological Site', 'Excursiones')
      ],
      comer: [
        item('Souvlaki en Monastiraki', 'Rápido, económico y buen punto para cenar tarde.', 'Monastiraki Athens souvlaki', 'Gastronomía'),
        item('Psyrri mezedes', 'Zona con tabernas para probar platos para compartir.', 'Psyrri Athens restaurants', 'Gastronomía'),
        item('Mercado Central (Varvakios)', 'Buena parada para ver producto local al mediodía.', 'Varvakios Agora Athens', 'Gastronomía')
      ],
      noche: [
        item('Rooftops con vista Acrópolis', 'Reservá mesa cerca del atardecer.', 'A for Athens rooftop', 'Nightlife'),
        item('Gazi', 'Zona de bares y clubes con más movimiento nocturno.', 'Gazi Athens nightlife', 'Nightlife'),
        item('Live rebetiko', 'Para una noche local con música griega tradicional.', 'Plaka live greek music', 'Nightlife')
      ],
      tipTiming:
        'Acrópolis: primera franja de la mañana. En abril suele ser ideal para caminar, pero llevá calzado cómodo para pendientes de piedra.'
    },
    mapsLink: mapsSearchLink('Athens city center'),
    usefulLinks: [
      { label: 'Sitio oficial turismo Atenas', url: 'https://www.thisisathens.org/' }
    ]
  },
  {
    slug: 'mykonos',
    name: 'Míkonos',
    dateRange: '5-7 abril 2026',
    intro: 'Postales blancas y mar turquesa con mezcla de relax, beach scene y callecitas para perderse.',
    imageQueries: mykonosQueries,
    ...mykonosImages,
    sections: {
      imperdibles: [
        item('Molinos de Kato Mili', 'Clásico spot de foto, mejor con luz de tarde.', 'Kato Mili Windmills Mykonos', 'Cultura'),
        item('Little Venice', 'Paseo al borde del mar con bares frente al agua.', 'Little Venice Mykonos', 'Cultura'),
        item('Mykonos Town', 'Callejones blancos perfectos para caminata sin mapa.', 'Mykonos Old Town', 'Cultura'),
        item('Iglesia Paraportiani', 'Arquitectura icónica y parada corta.', 'Paraportiani Church Mykonos', 'Cultura'),
        item('Playa Psarou', 'Aguas tranquilas y beach clubs.', 'Psarou Beach Mykonos', 'Playas'),
        item('Playa Super Paradise', 'Ambiente más festivo durante la tarde.', 'Super Paradise Beach Mykonos', 'Playas')
      ],
      dayTrips: [
        item('Isla de Delos', 'Ruinas arqueológicas a 30 min en barco.', 'Delos Archaeological Site', 'Excursiones'),
        item('Rhenia', 'Excursión en barco para baño y snorkel.', 'Rhenia island', 'Playas'),
        item('Tour costa sur en barco', 'Forma eficiente de ver varias playas en un día.', 'Mykonos south coast cruise', 'Excursiones')
      ],
      comer: [
        item('Gyros en Chora', 'Opción rápida entre recorridos.', 'Mykonos Town gyros', 'Gastronomía'),
        item('Seafood en Little Venice', 'Ideal para cena con vista.', 'Little Venice seafood Mykonos', 'Gastronomía'),
        item('Tabernas en Ano Mera', 'Ambiente más local y menos turístico.', 'Ano Mera tavernas', 'Gastronomía')
      ],
      noche: [
        item('Sunset bars Little Venice', 'Llegá antes para conseguir buen lugar.', 'Little Venice sunset bars', 'Nightlife'),
        item('Cavo Paradiso (temporada)', 'Revisar agenda porque puede variar en abril.', 'Cavo Paradiso Mykonos', 'Nightlife'),
        item('Beach clubs Paradise', 'Actividad según clima y apertura estacional.', 'Paradise Beach Club Mykonos', 'Nightlife')
      ],
      tipTiming:
        'El viento puede subir por la tarde. Programá playas por la mañana y casco histórico hacia sunset.'
    },
    mapsLink: mapsSearchLink('Mykonos Town'),
    usefulLinks: [{ label: 'Turismo oficial Míkonos', url: 'https://mykonos.gr/' }]
  },
  {
    slug: 'santorini',
    name: 'Santorini (Thira)',
    dateRange: '7-9 abril 2026',
    intro: 'Caldera, pueblos colgados y atardeceres cinematográficos con mucha pendiente y vistas permanentes.',
    imageQueries: santoriniQueries,
    ...santoriniImages,
    sections: {
      imperdibles: [
        item('Fira', 'Base práctica para moverte por la isla.', 'Fira Santorini', 'Cultura'),
        item('Oia al atardecer', 'Llegá con tiempo por el volumen de gente.', 'Oia Santorini Sunset', 'Cultura'),
        item('Sendero Fira-Imerovigli', 'Caminata escénica fácil de medio día.', 'Fira to Imerovigli trail', 'Excursiones'),
        item('Imerovigli', 'Vistas limpias de la caldera y menos flujo que Oia.', 'Imerovigli Santorini', 'Cultura'),
        item('Playa Roja', 'Paisaje volcánico muy distinto al resto.', 'Red Beach Santorini', 'Playas'),
        item('Akrotiri', 'Sitio arqueológico minoico cubierto.', 'Akrotiri Archaeological Site Santorini', 'Cultura')
      ],
      dayTrips: [
        item('Volcán Nea Kameni', 'Excursión en barco + trekking corto.', 'Nea Kameni Santorini', 'Excursiones'),
        item('Thirassia', 'Isla más tranquila para ritmo slow.', 'Thirassia Santorini', 'Excursiones'),
        item('Pyrgos', 'Pueblo interior con buena vista panorámica.', 'Pyrgos Santorini', 'Excursiones')
      ],
      comer: [
        item('Tomatokeftedes', 'Probá este clásico local de tomate.', 'Fira Santorini traditional food', 'Gastronomía'),
        item('Seafood en Amoudi Bay', 'Buena opción de almuerzo tardío frente al agua.', 'Amoudi Bay seafood', 'Gastronomía'),
        item('Bodegas de Assyrtiko', 'Degustación corta antes de la cena.', 'Santorini winery tasting', 'Gastronomía')
      ],
      noche: [
        item('Cocteles en Fira', 'Bares con vista a la caldera.', 'Fira Santorini cocktail bar', 'Nightlife'),
        item('Sunset lounge en Oia', 'Reservá con antelación si querés primera línea.', 'Oia sunset lounge', 'Nightlife')
      ],
      tipTiming:
        'Santorini tiene escaleras constantes. Organizá bloques por zonas para evitar subir y bajar de más.'
    },
    mapsLink: mapsSearchLink('Fira Santorini'),
    usefulLinks: [{ label: 'Turismo oficial Santorini', url: 'https://www.santorini.gr/' }]
  },
  {
    slug: 'chania',
    name: 'La Canea (Chania, Creta)',
    dateRange: '9-11 abril 2026',
    intro: 'Cierre griego con puerto veneciano, playas potentes y cocina cretense muy sólida.',
    imageQueries: chaniaQueries,
    ...chaniaImages,
    sections: {
      imperdibles: [
        item('Puerto Veneciano', 'Paseo ideal de mañana y de noche.', 'Chania Old Venetian Harbor', 'Cultura'),
        item('Faro de Chania', 'Caminata corta con vistas del puerto.', 'Chania Lighthouse', 'Cultura'),
        item('Casco antiguo', 'Calles históricas y tiendas artesanales.', 'Old Town Chania', 'Cultura'),
        item('Museo Marítimo de Creta', 'Buena visita de una hora.', 'Maritime Museum of Crete', 'Cultura'),
        item('Playa Nea Chora', 'Fácil acceso si no querés moverte mucho.', 'Nea Chora Beach Chania', 'Playas'),
        item('Mercado de Chania', 'Para productos locales y snacks.', 'Chania Municipal Market', 'Gastronomía')
      ],
      dayTrips: [
        item('Balos Lagoon', 'Paisaje top; revisar estado de acceso.', 'Balos Lagoon', 'Playas'),
        item('Elafonissi', 'Arena rosada y aguas bajas.', 'Elafonissi Beach', 'Playas'),
        item('Samaria Gorge (temporada)', 'Puede variar apertura según clima.', 'Samaria Gorge National Park', 'Excursiones')
      ],
      comer: [
        item('Dakos cretense', 'Plato clásico para almuerzo ligero.', 'Chania dakos', 'Gastronomía'),
        item('Tavernas del puerto', 'Pescado fresco y ambiente relajado.', 'Chania harbor tavern', 'Gastronomía'),
        item('Bougatsa local', 'Desayuno típico en panaderías tradicionales.', 'Chania bougatsa', 'Gastronomía')
      ],
      noche: [
        item('Bares del puerto', 'Ambiente chill, ideal para copa tranquila.', 'Chania old port bars', 'Nightlife'),
        item('Calle Halidon', 'Zona con más movimiento nocturno.', 'Halidon Street Chania', 'Nightlife')
      ],
      tipTiming:
        'Para Balos/Elafonissi conviene salida temprana. Distancias en Creta engañan por carreteras de curvas.'
    },
    mapsLink: mapsSearchLink('Chania Old Town'),
    usefulLinks: [{ label: 'Turismo oficial Chania', url: 'https://www.chaniatourism.com/' }]
  }
];

const italyCities: CityData[] = [
  {
    slug: 'florence',
    name: 'Florencia',
    dateRange: '11-14 abril 2026',
    intro: 'Arte renacentista, caminatas compactas y excelente base para Toscana corta.',
    imageQueries: florenceQueries,
    ...florenceImages,
    sections: {
      imperdibles: [
        item('Duomo (Santa Maria del Fiore)', 'Subida con reserva previa recomendada.', 'Florence Duomo', 'Cultura'),
        item('Uffizi', 'Comprar entrada con anticipación.', 'Uffizi Gallery Florence', 'Cultura'),
        item('Accademia (David)', 'Visita corta pero clave.', 'Galleria dell Accademia Florence', 'Cultura'),
        item('Ponte Vecchio', 'Cruce clásico y fotos al atardecer.', 'Ponte Vecchio Florence', 'Cultura'),
        item('Piazza della Signoria', 'Centro histórico y esculturas al aire libre.', 'Piazza della Signoria', 'Cultura'),
        item('Piazzale Michelangelo', 'Mejor vista panorámica de la ciudad.', 'Piazzale Michelangelo', 'Excursiones')
      ],
      dayTrips: [
        item('Pisa', 'Excursión rápida en tren.', 'Leaning Tower of Pisa', 'Excursiones'),
        item('Siena', 'Centro medieval ideal para día completo.', 'Siena historic center', 'Excursiones'),
        item('Chianti', 'Bodegas y pueblos entre colinas.', 'Chianti wine region', 'Excursiones')
      ],
      comer: [
        item('Bistecca alla Fiorentina', 'Compartible y mejor en trattoria tradicional.', 'Florence bistecca', 'Gastronomía'),
        item('Mercato Centrale', 'Puestos variados para almuerzo sin reserva.', 'Mercato Centrale Firenze', 'Gastronomía'),
        item('Oltrarno', 'Zona ideal para cena más local.', 'Oltrarno Florence restaurants', 'Gastronomía')
      ],
      noche: [
        item('Santo Spirito', 'Plaza con bares de ambiente local.', 'Piazza Santo Spirito bars', 'Nightlife'),
        item('Wine bars en centro', 'Copa de Chianti y tabla corta.', 'Enoteca Florence center', 'Nightlife')
      ],
      tipTiming:
        'En museos top, reservar franja horaria evita colas largas. Caminá temprano por centro para fotos más limpias.'
    },
    mapsLink: mapsSearchLink('Florence city center'),
    usefulLinks: [{ label: 'Turismo oficial Firenze', url: 'https://www.feelflorence.it/en' }]
  },
  {
    slug: 'sorrento',
    name: 'Sorrento',
    dateRange: '14-20 abril 2026',
    intro: 'Base larga para combinar costa, islas y arqueología con ritmo flexible.',
    imageQueries: sorrentoQueries,
    ...sorrentoImages,
    sections: {
      imperdibles: [
        item('Piazza Tasso', 'Punto central para orientarte y arrancar recorridos.', 'Piazza Tasso Sorrento', 'Cultura'),
        item('Marina Grande', 'Barrio marinero para paseo y cena.', 'Marina Grande Sorrento', 'Cultura'),
        item('Villa Comunale', 'Mirador clásico sobre la costa.', 'Villa Comunale Sorrento', 'Cultura'),
        item('Bagni Regina Giovanna', 'Baño y paisaje arqueológico-natural.', 'Bagni Regina Giovanna', 'Playas'),
        item('Corso Italia', 'Eje comercial para compras y helado.', 'Corso Italia Sorrento', 'Cultura'),
        item('Limoncello tasting', 'Actividad corta y típica local.', 'Sorrento limoncello tasting', 'Gastronomía')
      ],
      dayTrips: [
        item('Capri', 'Ferry rápido; revisar mar y viento.', 'Capri Marina Grande', 'Excursiones'),
        item('Pompeya', 'Sitio arqueológico de jornada media.', 'Pompeii Archaeological Park', 'Excursiones'),
        item('Positano', 'Escapada por ferry o bus según temporada.', 'Positano', 'Excursiones')
      ],
      comer: [
        item('Gnocchi alla Sorrentina', 'Plato local emblemático.', 'Sorrento gnocchi alla sorrentina', 'Gastronomía'),
        item('Seafood frente al puerto', 'Mejor reservar para sunset.', 'Marina Grande seafood sorrento', 'Gastronomía'),
        item('Gelato en centro histórico', 'Parada fácil entre caminatas.', 'Sorrento gelato old town', 'Gastronomía')
      ],
      noche: [
        item('Bares en Piazza Tasso', 'Ambiente animado pero relajado.', 'Piazza Tasso nightlife', 'Nightlife'),
        item('Cocktail lounge con vista', 'Ideal para cierre de día.', 'Sorrento cocktail bar view', 'Nightlife')
      ],
      tipTiming:
        'Usá Sorrento como hub: alterná días de isla, costa y arqueología para evitar traslados repetidos.'
    },
    mapsLink: mapsSearchLink('Sorrento city center'),
    usefulLinks: [{ label: 'Turismo oficial Sorrento', url: 'https://www.sorrentotourism.com/' }]
  },
  {
    slug: 'amalfi',
    name: 'Amalfi',
    dateRange: '20-22 abril 2026',
    intro: 'Tramo corto para vivir el corazón de la Costa Amalfitana entre ferries, miradores y pueblos escarpados.',
    imageQueries: amalfiQueries,
    ...amalfiImages,
    sections: {
      imperdibles: [
        item('Duomo di Amalfi', 'Centro histórico compacto y fotogénico.', 'Amalfi Cathedral', 'Cultura'),
        item('Valle delle Ferriere', 'Trekking verde cerca del centro.', 'Valle delle Ferriere Amalfi', 'Excursiones'),
        item('Piazza del Duomo', 'Corazón de la ciudad para pausa y café.', 'Piazza Duomo Amalfi', 'Cultura'),
        item('Playa de Amalfi', 'Parada corta para relax cerca del puerto.', 'Spiaggia di Amalfi', 'Playas'),
        item('Atrani', 'Pueblito vecino accesible caminando.', 'Atrani', 'Cultura'),
        item('Paseo en ferry panorámico', 'Gran forma de leer la costa desde el mar.', 'Amalfi ferry port', 'Excursiones')
      ],
      dayTrips: [
        item('Positano', 'Ir temprano para disfrutarlo antes de picos de visitantes.', 'Positano town center', 'Excursiones'),
        item('Ravello', 'Jardines y vistas de altura.', 'Ravello Villa Rufolo', 'Excursiones'),
        item('Fiordo di Furore', 'Parada corta para foto icónica.', 'Fiordo di Furore', 'Excursiones')
      ],
      comer: [
        item('Scialatielli ai frutti di mare', 'Pasta local de la costa.', 'Amalfi seafood pasta', 'Gastronomía'),
        item('Delizia al limone', 'Postre típico de la zona.', 'Amalfi lemon dessert', 'Gastronomía'),
        item('Ristorantes frente al puerto', 'Reservá si querés primera línea al mar.', 'Amalfi port restaurants', 'Gastronomía')
      ],
      noche: [
        item('Wine bars tranquilos', 'Ambiente más relajado que Sorrento.', 'Amalfi wine bar', 'Nightlife'),
        item('Paseo nocturno por el puerto', 'Plan simple y muy escénico.', 'Amalfi harbor night walk', 'Nightlife')
      ],
      tipTiming:
        'Los ferries y buses dependen de temporada y clima. Confirmar horarios del día anterior.'
    },
    mapsLink: mapsSearchLink('Amalfi town center'),
    usefulLinks: [{ label: 'Turismo oficial Costa Amalfitana', url: 'https://www.costadamalfi.it/en/' }]
  },
  {
    slug: 'rome',
    name: 'Roma',
    dateRange: '22-24 abril 2026',
    intro: 'Cierre intenso entre iconos históricos, barrios vibrantes y gastronomía clásica romana.',
    imageQueries: romeQueries,
    ...romeImages,
    sections: {
      imperdibles: [
        item('Coliseo', 'Reservar entrada anticipada para evitar filas.', 'Colosseum Rome', 'Cultura'),
        item('Foro Romano y Palatino', 'Bloque ideal junto al Coliseo.', 'Roman Forum', 'Cultura'),
        item('Fontana di Trevi', 'Verla al amanecer reduce multitudes.', 'Trevi Fountain Rome', 'Cultura'),
        item('Panteón', 'Visita corta en pleno centro histórico.', 'Pantheon Rome', 'Cultura'),
        item('Plaza Navona', 'Arquitectura barroca y cafés alrededor.', 'Piazza Navona', 'Cultura'),
        item('Vaticano (museos + San Pedro)', 'Dedicá medio día y entrada reservada.', 'Vatican Museums', 'Cultura')
      ],
      dayTrips: [
        item('Tívoli (Villa d Este)', 'Jardines y fuentes históricas.', 'Villa d Este Tivoli', 'Excursiones'),
        item('Ostia Antica', 'Ruinas romanas menos masivas que Pompeya.', 'Ostia Antica', 'Excursiones'),
        item('Castel Gandolfo', 'Escapada rápida a lago y pueblo.', 'Castel Gandolfo', 'Excursiones')
      ],
      comer: [
        item('Carbonara tradicional', 'Buscar trattoria con cocina romana clásica.', 'Rome carbonara trattoria', 'Gastronomía'),
        item('Trastevere', 'Zona ideal para cena con ambiente.', 'Trastevere restaurants', 'Gastronomía'),
        item('Campo de Fiori', 'Mercado y opciones informales al mediodía.', 'Campo de Fiori market', 'Gastronomía')
      ],
      noche: [
        item('Trastevere bars', 'Recorrido de bares a pie.', 'Trastevere nightlife', 'Nightlife'),
        item('Monti wine spots', 'Plan más tranquilo y local.', 'Monti Rome wine bar', 'Nightlife'),
        item('Paseo iluminado centro histórico', 'Trevi, Pantheon y Navona de noche.', 'Rome historic center night walk', 'Nightlife')
      ],
      tipTiming:
        'Para Roma en 2 días, agrupá por zonas: Antigüedad clásica un día y Vaticano + centro barroco al siguiente.'
    },
    mapsLink: mapsSearchLink('Rome city center'),
    usefulLinks: [{ label: 'Turismo oficial Roma', url: 'https://www.turismoroma.it/en' }]
  }
];

export const itineraryData: ItineraryData = {
  tripTitle: 'Grecia + Italia 2026',
  tripDates: '2 al 24 de abril de 2026',
  timeline: [
    { city: 'Atenas', country: 'Grecia', dateRange: '2-5 abril' },
    { city: 'Míkonos', country: 'Grecia', dateRange: '5-7 abril' },
    { city: 'Santorini (Thira)', country: 'Grecia', dateRange: '7-9 abril' },
    { city: 'La Canea (Creta)', country: 'Grecia', dateRange: '9-11 abril' },
    { city: 'Florencia', country: 'Italia', dateRange: '11-14 abril' },
    { city: 'Sorrento', country: 'Italia', dateRange: '14-20 abril' },
    { city: 'Amalfi', country: 'Italia', dateRange: '20-22 abril' },
    { city: 'Roma', country: 'Italia', dateRange: '22-24 abril' }
  ],
  countries: [
    {
      slug: 'grecia',
      name: 'Grecia',
      palette: ['#effbf9', '#effffd', '#40c3d6', '#336cce', '#4149c3'],
      summary: 'Mármol, mar Egeo y atardeceres con energía de descubrimiento.',
      usefulLinks: [
        { label: 'Ferryhopper (ferries)', url: 'https://www.ferryhopper.com/' },
        { label: 'Rome2rio (rutas)', url: 'https://www.rome2rio.com/' },
        {
          label: 'Hellenic Heritage e-ticket',
          url: 'https://hhticket.gr/',
          note: 'Tickets arqueológicos; disponibilidad puede variar.'
        },
        {
          label: 'Visit Greece oficial',
          url: 'https://www.visitgreece.gr/',
          note: 'Agenda y eventos estacionales pueden variar.'
        }
      ],
      cities: greeceCities
    },
    {
      slug: 'italia',
      name: 'Italia',
      palette: ['#f2f2f2', '#009246', '#ffffff', '#ce2b37', '#f2f2f2'],
      summary: 'Arte, costas dramáticas y cultura gastronómica de norte a sur.',
      usefulLinks: [
        { label: 'Trenitalia', url: 'https://www.trenitalia.com/en.html' },
        { label: 'Italo', url: 'https://www.italotreno.com/en' },
        { label: 'Tickets Uffizi (oficial)', url: 'https://www.uffizi.it/en/tickets' },
        {
          label: 'Tickets Accademia (official ticket site)',
          url: 'https://www.galleriaaccademiafirenze.it/en/tickets/',
          note: 'Confirmar dominio oficial al reservar.'
        },
        { label: 'Museos Vaticanos (oficial)', url: 'https://tickets.museivaticani.va/home' },
        { label: 'Rome2rio (rutas)', url: 'https://www.rome2rio.com/' },
        {
          label: 'Travelmar ferries Costa Amalfitana',
          url: 'https://www.travelmar.it/en/',
          note: 'Operación según temporada y clima.'
        }
      ],
      cities: italyCities
    }
  ],
  logistics: {
    transport: [
      'Grecia: ferry entre islas + vuelos/tramos cortos según horarios.',
      'Italia: tren para tramos largos (Florencia-Roma) y ferry/bus para Costa Amalfitana.',
      'Reservar traslados clave con antelación (abril puede tener alta demanda en fines de semana).',
      'Verificar siempre el día anterior cambios por clima en ferries de islas y costa.'
    ],
    checklist: [
      'Seguro de viaje y tarjeta sin comisiones internacionales.',
      'Calzado cómodo para adoquines, escaleras y sitios arqueológicos.',
      'Capas livianas: abril combina mañanas frescas y tardes templadas.',
      'Entradas anticipadas para Acrópolis, Uffizi, Accademia, Coliseo y Vaticano.',
      'Bolso/mochila de día para ferry + protección solar + botella reutilizable.'
    ]
  }
};

export const getAllMapLinks = () => {
  const entries: Array<{ country: string; city: string; label: string; url: string }> = [];

  itineraryData.countries.forEach((country) => {
    country.cities.forEach((city) => {
      entries.push({
        country: country.name,
        city: city.name,
        label: `${city.name} - mapa general`,
        url: city.mapsLink
      });

      Object.values(city.sections)
        .filter((value) => Array.isArray(value))
        .forEach((value) => {
          (value as Array<{ name: string; mapsLink: string }>).forEach((it) => {
            entries.push({
              country: country.name,
              city: city.name,
              label: it.name,
              url: it.mapsLink
            });
          });
        });
    });
  });

  return entries;
};
