// JSON-LD 结构化数据生成器
// 规则：schema 中的评分必须与页面实际评论一致；Amazon 评分仅作页面参考展示，不得进入 schema
import { absoluteUrl, formatDate } from './seo';

type Crumb = { name: string; path: string };

export function breadcrumbSchema(site: URL | undefined, items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(site, item.path),
    })),
  };
}

export function websiteSchema(site: URL | undefined, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url: absoluteUrl(site, '/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl(site, '/')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema(site: URL | undefined, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: absoluteUrl(site, '/'),
  };
}

export function productReviewSchema(opts: {
  site: URL | undefined;
  name: string;
  brand: string;
  description: string;
  rating: number;
  author: string;
  path: string;
  updatedAt: Date;
  asin?: string;
  priceUsd?: number;
  priceCheckedAt?: Date;
  imageUrl?: string;
}) {
  const review: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    brand: { '@type': 'Brand', name: opts.brand },
    description: opts.description,
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: opts.rating,
        bestRating: 5,
        worstRating: 0,
      },
      author: { '@type': opts.author === 'Editorial Team' ? 'Organization' : 'Person', name: opts.author },
      datePublished: formatDate(opts.updatedAt),
      dateModified: formatDate(opts.updatedAt),
    },
  };
  if (opts.asin) review.productID = opts.asin;
  if (opts.imageUrl) review.image = absoluteUrl(opts.site, opts.imageUrl);
  if (opts.priceUsd && opts.priceCheckedAt) {
    review.offers = {
      '@type': 'Offer',
      price: opts.priceUsd,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: formatDate(new Date(opts.priceCheckedAt.getTime() + 7 * 86400000)),
    };
  }
  return review;
}

export function itemListSchema(
  site: URL | undefined,
  name: string,
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(site, item.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleSchema(opts: {
  site: URL | undefined;
  headline: string;
  description: string;
  author: string;
  path: string;
  updatedAt: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    author: { '@type': 'Person', name: opts.author },
    dateModified: formatDate(opts.updatedAt),
    mainEntityOfPage: absoluteUrl(opts.site, opts.path),
  };
}
