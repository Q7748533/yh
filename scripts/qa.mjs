// 构建后质检：对 dist 产物做硬性检查，失败则中断构建（Cloudflare Pages 上同样生效）
// 对应方案书 7.5 质检清单中可自动化的部分
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const failures = [];
const notes = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function readHtml(path) {
  return readFileSync(path, 'utf8');
}

// 1) 基础产物存在
check(existsSync(join(DIST, 'index.html')), '缺少 dist/index.html');
check(existsSync(join(DIST, 'robots.txt')), '缺少 dist/robots.txt');
check(existsSync(join(DIST, 'sitemap-index.xml')), '缺少 dist/sitemap-index.xml');
check(existsSync(join(DIST, 'pagefind', 'pagefind.js')), '缺少 Pagefind 索引（dist/pagefind）');
check(existsSync(join(DIST, '_headers')), '缺少 dist/_headers（安全头/缓存策略）');

// 2) 逐篇测评页检查
const reviewsDir = join(DIST, 'reviews');
const reviewPages = existsSync(reviewsDir)
  ? readdirSync(reviewsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => join(reviewsDir, d.name, 'index.html'))
      .filter((p) => existsSync(p))
  : [];

check(reviewPages.length > 0, '没有生成任何测评页（reviews 目录为空）');

for (const page of reviewPages) {
  const html = readHtml(page);
  const name = page.replace(/\\/g, '/');
  const ldCount = (html.match(/application\/ld\+json/g) || []).length;

  check(ldCount >= 3, `${name}: JSON-LD 少于 3 段（实际 ${ldCount}）`);
  check(html.includes('"@type":"Product"'), `${name}: 缺少 Product 结构化数据`);
  check(html.includes('As an Amazon Associate'), `${name}: 缺少 Amazon 联盟披露语句`);
  check(html.includes('rel="sponsored nofollow noopener"'), `${name}: 联盟链接缺少 sponsored nofollow 属性`);
  check(html.includes('rel="canonical"'), `${name}: 缺少 canonical`);

  if (html.includes('Research-based review')) {
    check(
      !/\b(we|i)(?:'ve| have)? tested\b/i.test(html),
      `${name}: 研究型内容出现 "we tested" 表述（伪装实测风险）`
    );
  }

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  check(h1Count === 1, `${name}: H1 数量为 ${h1Count}（应为 1）`);
}

// 3) 全站 canonical 域名检查（SITE_URL 未设置时会暴露）
const homeHtml = readHtml(join(DIST, 'index.html'));
if (homeHtml.includes('https://example.com')) {
  notes.push('警告：canonical 仍为占位域名 https://example.com —— 部署前设置 SITE_URL 环境变量');
}

console.log(`\nQA: 检查 ${reviewPages.length} 个测评页`);
for (const n of notes) console.log(`  ! ${n}`);

if (failures.length) {
  console.error(`\nQA 失败 ${failures.length} 项：`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log('QA 全部通过 ✓\n');
