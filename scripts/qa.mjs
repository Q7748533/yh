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

// 3) 每篇测评页的 SEO 硬性标准（2026-10-24 审计后确立，违反即构建失败）
for (const page of reviewPages) {
  const html = readHtml(page);
  const name = page.replace(/\\/g, '/');

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  check(title.length > 0 && title.length <= 65, `${name}: title 长度 ${title.length}（上限 65，建议 ≤60）`);

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  check(desc.length >= 100 && desc.length <= 160, `${name}: meta description 长度 ${desc.length}（应为 100–160）`);

  check(
    /property="og:image" content="[^"]*\.(png|jpe?g|webp)"/.test(html),
    `${name}: og:image 必须是 PNG/JPG/WEBP（SVG 社交平台不渲染）`
  );
  check(html.includes('property="og:type" content="article"'), `${name}: og:type 应为 article`);
  check(
    !html.includes('AggregateRating'),
    `${name}: 出现 AggregateRating —— 单条编辑评分不得冒充聚合评分（Google 政策）`
  );
  check(
    !/<script[^>]+src="\/pagefind/.test(html) && !/rel="stylesheet"[^>]+href="\/pagefind/.test(html),
    `${name}: Pagefind 资源被首屏预加载（应点击后懒加载）`
  );

  const canonicalCount = (html.match(/rel="canonical"/g) || []).length;
  check(canonicalCount === 1, `${name}: canonical 数量为 ${canonicalCount}（应为 1）`);

  check(/<html lang="en"/.test(html), `${name}: 缺少 html lang 属性`);
  check(/<figure[\s>]/.test(html), `${name}: 缺少自制图表/图片（figure 元素）`);
  check(html.includes('Our score'), `${name}: 缺少本站评分展示区`);

  // 版式标准（2026-10-24 确立）
  check(html.includes('data-decision-card'), `${name}: 缺少首屏决策卡`);
  check(html.includes('id="pros-cons"'), `${name}: 缺少优缺点区块`);
  check(html.includes('id="specs"'), `${name}: 缺少规格表区块（frontmatter specs 未渲染）`);
  check(html.includes('data-score-breakdown'), `${name}: 缺少评分分解（frontmatter scoreBreakdown 未渲染）`);
  check(html.includes('id="verdict"'), `${name}: 缺少结论区块`);
  check(/aria-label="Table of contents"/.test(html), `${name}: 缺少目录`);
  check(html.includes('<details'), `${name}: FAQ 未使用折叠（details/summary）`);

  const pCard = html.indexOf('data-decision-card');
  const pPros = html.indexOf('id="pros-cons"');
  const pSpecs = html.indexOf('id="specs"');
  const pBody = html.indexOf('id="article-body"');
  check(
    pCard > -1 && pPros > pCard && pSpecs > pPros && pBody > pSpecs,
    `${name}: 区块顺序不符（应为 决策卡 → 优缺点 → 规格表 → 正文）`
  );
}

// 4) 站内链接完整性：所有 href="/..." 必须能在 dist 找到对应文件（防导航 404）
function walkHtml(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const brokenLinks = new Set();
for (const file of walkHtml(DIST)) {
  const html = readHtml(file);
  const hrefs = html.match(/href="\/[^"]*"/g) || [];
  for (const raw of hrefs) {
    const href = raw.slice(6, -1).split('#')[0].split('?')[0];
    if (!href || href === '/' || href.startsWith('/pagefind/')) continue;
    const rel = href.replace(/^\//, '');
    const candidates = href.endsWith('/')
      ? [join(DIST, rel, 'index.html')]
      : [join(DIST, rel), join(DIST, rel, 'index.html')];
    if (!candidates.some((p) => existsSync(p))) {
      brokenLinks.add(`${href} ← ${file.replace(/\\/g, '/')}`);
    }
  }
}
check(
  brokenLinks.size === 0,
  `站内死链 ${brokenLinks.size} 处：${[...brokenLinks].slice(0, 5).join(' | ')}`
);

// 5) 跨页重复句检测 + 正文体量：防"模板化正文"（scaled content abuse 的核心判据）
function extractBody(html) {
  const marker = html.indexOf('id="article-body"');
  if (marker === -1) return '';
  const start = html.indexOf('>', marker) + 1;
  const end = html.indexOf('id="verdict"');
  return html
    .slice(start, end === -1 ? html.length : end)
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.split(/\s+/).length >= 10);
}

const bodies = reviewPages.map((p) => ({ file: p, text: extractBody(readHtml(p)) }));

for (const b of bodies) {
  const words = b.text.split(/\s+/).filter(Boolean).length;
  check(words >= 500, `${b.file.replace(/\\/g, '/')}: 正文仅 ${words} 词（低于 500，属薄内容）`);
}

if (bodies.length > 1) {
  const seen = new Map();
  const dupes = [];
  for (const doc of bodies) {
    const short = doc.file.replace(/\\/g, '/').split('/').slice(-2)[0];
    for (const s of sentences(doc.text)) {
      const prev = seen.get(s);
      if (prev && prev !== short) dupes.push(`「${s.slice(0, 70)}…」${prev} ↔ ${short}`);
      else if (!prev) seen.set(s, short);
    }
  }
  check(
    dupes.length === 0,
    `跨页重复句 ${dupes.length} 条（同一句话出现在两篇文章里 = 模板化正文）：${dupes.slice(0, 3).join(' | ')}`
  );
}

// 6) 程序化页面闸门：对比页必须有人工撰写的差异分析
const compareDir = join(DIST, 'compare');
const comparePages = existsSync(compareDir) ? walkHtml(compareDir).filter((p) => p.endsWith('index.html')) : [];
for (const p of comparePages) {
  const html = readHtml(p);
  check(
    html.includes('The short answer'),
    `${p.replace(/\\/g, '/')}: 对比页缺少人工撰写的差异分析（应在 src/data/compareNotes.ts 登记）`
  );
}

// 7) 全站 canonical 域名检查（SITE_URL 未设置时会暴露）
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
