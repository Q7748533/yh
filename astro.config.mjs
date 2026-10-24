import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { isCategoryIndexable, isBrandIndexable, reviewLastmods } from './src/utils/indexability.mjs';

// Canonical site URL: 默认生产域名；绑自定义域名后用 SITE_URL 环境变量覆盖
const site = process.env.SITE_URL || 'https://thepriceaudit.com';

// 只有真实已知的更新日期才写 lastmod；静态页不编造日期
const lastmods = reviewLastmods();

export default defineConfig({
  site,
  integrations: [
    mdx(),
    sitemap({
      // 可索引门槛与页面组件共用同一套判定（src/utils/indexability.mjs）
      // 品类页：≥3 篇 且 ≥2 个品牌；品牌页：≥2 篇
      filter: (page) => {
        const categoryPage = page.match(/\/best\/([^/]+)\/$/);
        if (categoryPage) return isCategoryIndexable(categoryPage[1]);
        const brandPage = page.match(/\/brands\/([^/]+)\/$/);
        if (brandPage) return isBrandIndexable(brandPage[1]);
        return true;
      },
      serialize: (item) => {
        const m = item.url.match(/\/reviews\/([^/]+)\/$/);
        if (m && lastmods[m[1]]) return { ...item, lastmod: lastmods[m[1]] };
        return item;
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
