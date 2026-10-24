import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

// Canonical site URL: 默认生产域名；绑自定义域名后用 SITE_URL 环境变量覆盖
const site = process.env.SITE_URL || 'https://thepriceaudit.com';

// 品类页不足 3 篇时会被 noindex（见 src/pages/best/[category].astro）
// sitemap 不应提交 noindex 页面，否则 Search Console 报「已提交的网址标记为 noindex」
const MIN_REVIEWS_PER_CATEGORY = 3;
function indexableCategories() {
  const dir = 'src/content/reviews';
  const counts = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
    const src = readFileSync(`${dir}/${file}`, 'utf8');
    const m = src.match(/^category:\s*"([^"]+)"/m);
    if (m) counts[m[1]] = (counts[m[1]] ?? 0) + 1;
  }
  return new Set(
    Object.entries(counts)
      .filter(([, n]) => n >= MIN_REVIEWS_PER_CATEGORY)
      .map(([category]) => category)
  );
}

const indexable = indexableCategories();

export default defineConfig({
  site,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const categoryPage = page.match(/\/best\/([^/]+)\/$/);
        if (categoryPage) return indexable.has(categoryPage[1]);
        return true;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
