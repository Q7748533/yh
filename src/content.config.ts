import { defineCollection, z } from 'astro:content';

const reviews = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    brand: z.string(),
    category: z.string(),
    product: z.string(),
    // 本站评分（0-5，一位小数）——只反映本站测评结论，写入 Review/AggregateRating schema
    rating: z.number().min(0).max(5),
    priceUsd: z.number().positive().optional(),
    priceCheckedAt: z.coerce.date().optional(),
    affiliateUrl: z.string().url(),
    amazonAsin: z.string().optional(),
    // Amazon 参考评分——仅作参考展示，禁止写入本站 schema
    amazonRating: z.number().min(0).max(5).optional(),
    amazonReviewCount: z.number().int().nonnegative().optional(),
    // 结论来源类型：research=基于公开资料研究（无实物样品）；tested=实测
    sourceType: z.enum(['tested', 'research']).default('research'),
    pros: z.array(z.string()).min(2).max(5),
    cons: z.array(z.string()).min(1).max(4),
    specs: z.record(z.string(), z.string()),
    author: z.string(),
    verdict: z.string(),
    // FAQ 区块：渲染为可见问答 + FAQPage JSON-LD
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    updatedAt: z.coerce.date(),
    draft: z.boolean().default(true),
    ogImage: image().optional(),
  }),
});

export const collections = { reviews };
