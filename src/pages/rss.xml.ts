import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { reviewSlug } from '../utils/seo';
import { SITE_NAME, SITE_DESCRIPTION } from '../consts';

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://example.com');
  const reviews = (await getCollection('reviews', (r) => !r.data.draft)).sort(
    (a, b) => b.data.updatedAt.getTime() - a.data.updatedAt.getTime()
  );

  const items = reviews
    .map((r) => {
      const url = new URL(`/reviews/${reviewSlug(r.id)}/`, base).href;
      return `    <item>
      <title><![CDATA[${r.data.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description><![CDATA[${r.data.description}]]></description>
      <pubDate>${r.data.updatedAt.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${SITE_NAME}]]></title>
    <link>${base.href}</link>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
