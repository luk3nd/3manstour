import { CONTACT, SITE, SOCIAL } from '../config';

/**
 * `Organization` + informazioni di contatto.
 * Google la usa per logo e knowledge panel; gli articoli la referenziano come `publisher`.
 */
export function organization(siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: siteUrl.href,
    logo: new URL('/favicon.png', siteUrl).href,
    email: CONTACT.email,
    sameAs: SOCIAL.map((s) => s.href),
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT.location.split(',')[0].trim(),
      addressCountry: 'IT',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: CONTACT.email,
      url: new URL('/contatti', siteUrl).href,
      areaServed: 'IT',
      availableLanguage: ['it'],
    },
  };
}

/**
 * `BreadcrumbList` da una lista di tappe, in ordine.
 * L'ultima tappa è la pagina corrente: si omette `url` (come da linee guida Google).
 */
export function breadcrumb(items: { name: string; url?: string }[], siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: new URL(item.url, siteUrl).href } : {}),
    })),
  };
}

/** `WebPage` di base per le pagine interne (Google lo inferisce, ma è più esplicito). */
export function webPage(
  { name, description, url }: { name: string; description?: string; url: string },
  siteUrl: URL,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url: new URL(url, siteUrl).href,
    inLanguage: SITE.lang,
    ...(description ? { description } : {}),
  };
}
