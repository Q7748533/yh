import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { buildScorecardSvg } from '../../utils/scorecard';
import { reviewSlug } from '../../utils/seo';
import { SITE_NAME } from '../../consts';

export const getStaticPaths = (async () => {
  const reviews = await getCollection('reviews', (r) => !r.data.draft);
  return reviews.map((review) => ({
    params: { slug: reviewSlug(review.id) },
    props: { review },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { data } = props.review;

  const svg = buildScorecardSvg({
    brand: data.brand,
    product: data.product,
    rating: data.rating,
    priceUsd: data.priceUsd,
    priceCheckedAt: data.priceCheckedAt,
    updatedAt: data.updatedAt,
    sourceType: data.sourceType,
    specs: data.specs,
    siteName: SITE_NAME,
  });

  const png = await sharp(Buffer.from(svg), { density: 144 })
    .resize(1200, 630, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
