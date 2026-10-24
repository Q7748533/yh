import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site ?? 'https://thepriceaudit.com').href;
  // /cdn-cgi/ 是 Cloudflare 的内部路径：
  // 邮箱混淆会把 mailto: 改写成 /cdn-cgi/l/email-protection#<hash>，
  // 爬虫顺着抓会拿到 404，Search Console / Bing 都会报错。
  // 该路径对真实用户由浏览器直接调用，不受 robots 影响。
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /cdn-cgi/', '', `Sitemap: ${sitemap}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
