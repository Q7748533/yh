// 可索引性判定 —— 供 astro.config（sitemap）、页面组件、qa.mjs 共用
// 用 .mjs 而不是 .ts，这样配置文件（Node 环境）和质检脚本都能直接 import

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const slugify = (v) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const REVIEWS_DIR = 'src/content/reviews';

/** 品类页门槛：篇数够，且至少覆盖两个品牌（单品牌不是横评） */
export const MIN_CATEGORY_REVIEWS = 3;
export const MIN_CATEGORY_BRANDS = 2;

/** 品牌页门槛：少于 2 篇就是单个产品的复述 */
export const MIN_BRAND_REVIEWS = 2;

/** 读取所有已发布测评的 category / brand（不依赖 Astro 运行时） */
export function reviewMeta() {
  const rows = [];
  let files = [];
  try {
    files = readdirSync(REVIEWS_DIR).filter((f) => f.endsWith('.mdx'));
  } catch {
    return rows;
  }
  for (const file of files) {
    const src = readFileSync(join(REVIEWS_DIR, file), 'utf8');
    if (/^draft:\s*true/m.test(src)) continue;
    const category = src.match(/^category:\s*"([^"]+)"/m)?.[1];
    const brand = src.match(/^brand:\s*"([^"]+)"/m)?.[1];
    if (category && brand) rows.push({ file, category, brand });
  }
  return rows;
}

/**
 * 测评 slug → updatedAt（YYYY-MM-DD）
 * 用于给 sitemap 填 lastmod：这是 Google 唯一会参考的字段，
 * 但只有当它真实时才有效——所以只对有明确更新日期的测评页填。
 */
export function reviewLastmods() {
  const out = {};
  let files = [];
  try {
    files = readdirSync(REVIEWS_DIR).filter((f) => f.endsWith('.mdx'));
  } catch {
    return out;
  }
  for (const file of files) {
    const src = readFileSync(join(REVIEWS_DIR, file), 'utf8');
    if (/^draft:\s*true/m.test(src)) continue;
    const updated = src.match(/^updatedAt:\s*(\d{4}-\d{2}-\d{2})/m)?.[1];
    if (!updated) continue;
    const slug = file.replace(/\.mdx$/, '');
    out[slug] = updated;
  }
  return out;
}

/** 每个品类的篇数与品牌数 */
export function categoryStats() {
  const stats = {};
  for (const { category, brand } of reviewMeta()) {
    const entry = (stats[category] ??= { reviews: 0, brands: new Set() });
    entry.reviews += 1;
    entry.brands.add(slugify(brand));
  }
  return Object.fromEntries(
    Object.entries(stats).map(([k, v]) => [k, { reviews: v.reviews, brands: v.brands.size }])
  );
}

export function isCategoryIndexable(category) {
  const s = categoryStats()[category];
  if (!s) return false;
  return s.reviews >= MIN_CATEGORY_REVIEWS && s.brands >= MIN_CATEGORY_BRANDS;
}

export function brandReviewCount(brand) {
  const key = slugify(brand);
  return reviewMeta().filter((r) => slugify(r.brand) === key).length;
}

export function isBrandIndexable(brand) {
  return brandReviewCount(brand) >= MIN_BRAND_REVIEWS;
}
