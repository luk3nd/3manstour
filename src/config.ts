export const SITE = {
  name: "3 Man's Tour",
  title: "3 Man's Tour — Non i posti più visti. Quelli giusti.",
  tagline: 'Non i posti più visti. Quelli giusti.',
  description:
    'Siamo in tre, esploriamo posti ed esperienze con curiosità e li raccontiamo senza fare guide tutte uguali.',
  url: 'https://www.3manstour.com',
  lang: 'it',
  locale: 'it_IT',
  author: "3 Man's Tour",
  twitter: '', // es. '@3manstour'
  defaultOgImage: '/og-default.jpg',
  /** Google Analytics 4 Measurement ID (es. 'G-XXXXXXXXXX'). Vuoto = analytics disattivato. */
  gaMeasurementId: 'G-F4HMDVHG4N',
  /** Codice di verifica Google Search Console (meta tag). Vuoto = nessun meta. */
  googleSiteVerification: '',
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Esplora', href: '/blog' },
  { label: 'Autori', href: '/autori' },
  { label: 'Il progetto', href: '/chi-siamo' },
  { label: 'Contatti', href: '/contatti' },
];

export const CONTACT = {
  email: 'info@3manstour.com',
  phone: '',
  address: '',
  /** Località mostrata in footer e contatti (E-E-A-T / trasparenza). */
  location: 'Brescia, Italia',
};

export const SOCIAL: { label: string; href: string }[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/3m.ontour/' },
];

/** Categorie di ciò che esploriamo (home + archivio + filtro). */
export const CATEGORIES = [
  {
    slug: 'fiere',
    label: 'Fiere',
    description: 'Appuntamenti, idee e mondi di nicchia che meritano una visita.',
  },
  {
    slug: 'ristoranti',
    label: 'Ristoranti',
    description: 'Cucine con carattere, piatti memorabili e storie da assaggiare.',
  },
  {
    slug: 'luoghi',
    label: 'Luoghi',
    description: 'Angoli, città e indirizzi che cambiano il modo di guardarsi intorno.',
  },
  {
    slug: 'esperienze',
    label: 'Esperienze',
    description: 'Incontri e attività da fare, non soltanto da mettere in itinerario.',
  },
];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

/**
 * Numeri mostrati in home (sezione "Il conto").
 * Sono manuali: aggiornali qui e cambia `updated` di conseguenza.
 */
export const STATS = {
  people: 3,
  places: 17,
  fairs: 7,
  km: 3560,
  updated: 'ottobre 2026',
};
