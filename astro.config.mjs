import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical site URL: 默认生产域名；绑自定义域名后用 SITE_URL 环境变量覆盖
const site = process.env.SITE_URL || 'https://yh-4pn.pages.dev';

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
