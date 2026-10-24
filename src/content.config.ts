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
    // 划线原价 / 建议零售价：促销结束后的参考价，用于"双价"呈现
    listPriceUsd: z.number().positive().optional(),
    // 价格说明：如 "Limited-time deal, 36% off list"
    priceNote: z.string().max(120).optional(),
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
    // 首屏摘要：2–4 句，渲染在决策卡下方（版式标准：优缺点必须落在前 3 屏）
    tldr: z.string().min(80).max(600),
    // 评分分解：权重之和必须为 1，加权结果必须等于 rating（构建期强制校验）
    scoreBreakdown: z
      .array(
        z.object({
          label: z.string(),
          score: z.number().min(0).max(5),
          weight: z.number().min(0).max(1),
        })
      )
      .optional(),
    // FAQ 区块：渲染为可见问答 + FAQPage JSON-LD
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    updatedAt: z.coerce.date(),
    draft: z.boolean().default(true),
    ogImage: image().optional(),
    // 产品图：厂商官方图（编辑性使用，需注明来源）或自有实拍；缺省时用自动评分卡图
    heroImage: image().optional(),
    imageCredit: z.string().optional(),
    imageAlt: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (!data.scoreBreakdown?.length) return;
    const totalWeight = data.scoreBreakdown.reduce((sum, i) => sum + i.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.001) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `scoreBreakdown 权重之和为 ${totalWeight.toFixed(2)}，必须为 1`,
      });
    }
    const weighted = data.scoreBreakdown.reduce((sum, i) => sum + i.score * i.weight, 0);
    if (Math.abs(weighted - data.rating) > 0.06) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `scoreBreakdown 加权结果 ${weighted.toFixed(2)} 与 rating ${data.rating} 不一致（容差 0.06）`,
      });
    }
  }),
});

export const collections = { reviews };
