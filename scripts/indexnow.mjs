// IndexNow 提交（Bing / Yandex / Seznam 共用端点）
//
// 用法：
//   npm run indexnow                 # 只提交今天更新过的测评页（推荐，符合 Bing「流式提交」建议）
//   npm run indexnow -- --all        # 提交 sitemap 里的全部 URL（首次上线用一次即可）
//   npm run indexnow -- --url /reviews/foo/ --url /reviews/bar/
//
// 前置：public/<KEY>.txt 必须已部署且内容等于 KEY

import { readFileSync, existsSync, readdirSync } from 'node:fs';

const HOST = 'thepriceaudit.com';
const BASE = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

// key 文件放在 public/ 下，文件名即 key
const keyFile = existsSync('public')
  ? readdirSync('public').find((f) => /^[a-f0-9]{32}\.txt$/.test(f))
  : undefined;

if (!keyFile) {
  console.error('找不到 IndexNow key 文件（public/<32 位十六进制>.txt）');
  process.exit(1);
}
const KEY = keyFile.replace(/\.txt$/, '');
const keyBody = readFileSync(`public/${keyFile}`, 'utf8').trim();
if (keyBody !== KEY) {
  console.error(`key 文件内容与文件名不一致：文件名 ${KEY}，内容 ${keyBody}`);
  process.exit(1);
}

const argv = process.argv.slice(2);
const explicit = argv.reduce((acc, arg, i) => (arg === '--url' ? [...acc, argv[i + 1]] : acc), []);
const all = argv.includes('--all');

let urls = [];

if (explicit.length) {
  urls = explicit.map((p) => (p.startsWith('http') ? p : BASE + (p.startsWith('/') ? p : `/${p}`)));
} else {
  const sm = readFileSync('dist/sitemap-0.xml', 'utf8');
  const entries = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of entries) {
    const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.slice(0, 10);
    if (!loc) continue;
    if (all || lastmod === today) urls.push(loc);
  }
}

if (!urls.length) {
  console.log('没有需要提交的 URL（今日无更新）。首次上线可用 --all');
  process.exit(0);
}

console.log(`提交 ${urls.length} 个 URL 到 IndexNow`);
urls.forEach((u) => console.log('  ·', u.replace(BASE, '') || '/'));

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList: urls,
  }),
});

const text = await res.text().catch(() => '');
console.log(`\n响应：HTTP ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ''}`);
console.log(
  {
    200: '已接受',
    202: '已接受，key 待验证（首次提交常见，稍后重试即可）',
    400: '请求格式错误',
    403: 'key 校验失败 —— 检查 key 文件是否可访问、内容是否一致',
    422: 'URL 与 host 不匹配，或 key 文件缺失',
    429: '提交过于频繁',
  }[res.status] ?? '未知状态'
);

if (res.status >= 400) process.exit(1);
