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

// 警告项：不阻断构建，但上线/投放前必须清零（见 docs/ads-readiness.md）
function warn(condition, message) {
  if (!condition) notes.push(message);
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
  // 披露：决策卡内的近 CTA 披露 + 页脚的联盟声明，两者都要有
  check(
    /we may earn a commission/i.test(html),
    `${name}: 决策卡附近缺少联盟披露（应为 "we may earn a commission"）`
  );
  check(
    /earn commissions on qualifying purchases/i.test(html),
    `${name}: 页脚缺少联盟关系声明`
  );
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

// 7) 投放就绪（Google Ads）：合规页、真实联系信息、可核查表述
check(existsSync(join(DIST, 'privacy', 'index.html')), '缺少 /privacy/ 页面（Ads 审核与隐私合规必需）');
check(existsSync(join(DIST, 'terms', 'index.html')), '缺少 /terms/ 页面');

const homeHtml = readHtml(join(DIST, 'index.html'));
check(
  homeHtml.includes('href="/privacy/"') && homeHtml.includes('href="/terms/"'),
  '页脚缺少 Privacy / Terms 链接'
);

const placeholderPages = [];
for (const file of walkHtml(DIST)) {
  if (/example\.(com|org|net)/i.test(readHtml(file))) placeholderPages.push(file.replace(/\\/g, '/'));
}
warn(
  placeholderPages.length === 0,
  `占位域名 example.com 出现在 ${placeholderPages.length} 个页面 —— 投放前必须替换真实邮箱与主体信息`
);

const BANNED_CLAIMS = [
  /guaranteed/i,
  /risk[- ]free/i,
  /100%\s*(effective|accurate|safe|works)/i,
  /#1\b/,
  /number one/i,
  /best in the world/i,
  /unbeatable/i,
  /miracle/i,
];
for (const doc of bodies) {
  for (const re of BANNED_CLAIMS) {
    const hit = doc.text.match(re);
    check(
      !hit,
      `${doc.file.replace(/\\/g, '/')}: 出现绝对化表述「${hit ? hit[0] : ''}」（Ads 不可核查声明风险）`
    );
  }
}

// 价格时效：过期价格属于误导性陈述
for (const page of reviewPages) {
  const hit = readHtml(page).match(/as of (\d{4}-\d{2}-\d{2})/);
  if (!hit) continue;
  const days = Math.floor((Date.now() - new Date(hit[1]).getTime()) / 86400000);
  check(days <= 120, `${page.replace(/\\/g, '/')}: 价格核对日期 ${hit[1]} 已 ${days} 天未更新（上限 120 天）`);
}

// 8) 全站 canonical 域名检查（SITE_URL 未设置时会暴露）
if (homeHtml.includes('https://example.com')) {
  notes.push('警告：canonical 仍为占位域名 https://example.com —— 部署前设置 SITE_URL 环境变量');
}

// 9) 主张台账：每篇测评必须有一份 docs/claims/<slug>.md，逐条列出数值与来源
const CLAIMS_DIR = join('docs', 'claims');
for (const page of reviewPages) {
  const slug = page.replace(/\\/g, '/').split('/')[2];
  check(
    existsSync(join(CLAIMS_DIR, `${slug}.md`)),
    `${slug}: 缺少主张台账 docs/claims/${slug}.md —— 每个数字都必须能指回来源`
  );
}

// 10) 品类术语污染：非汽车品类不得出现汽配术语
// （2026-10-24 事故：把美发产品的买家写成"车主"，因为整段模板从汽配那篇复制而来）
function categoryOf(slug) {
  const file = join('src', 'content', 'reviews', `${slug}.mdx`);
  if (!existsSync(file)) return null;
  const m = readFileSync(file, 'utf8').match(/^category:\s*"([^"]+)"/m);
  return m ? m[1] : null;
}

const AUTOMOTIVE_TERMS = [/车主/, /车辆/, /汽车/, /\bOBD\b/i, /\bJ2534\b/i, /\bECU\b/i, /\bscan tool\b/i];

for (const page of reviewPages) {
  const slug = page.replace(/\\/g, '/').split('/')[2];
  const cat = categoryOf(slug);
  if (!cat || cat === 'automotive-diagnostics') continue;
  const body = extractBody(readHtml(page));
  const ledgerFile = join(CLAIMS_DIR, `${slug}.md`);
  const ledger = existsSync(ledgerFile) ? readFileSync(ledgerFile, 'utf8') : '';
  // 修正记录段需要能描述被修正的术语，因此排除在扫描范围外
  const ledgerScan = ledger.split('## 修正记录')[0];
  for (const re of AUTOMOTIVE_TERMS) {
    const inBody = body.match(re);
    check(!inBody, `${slug}: 正文出现汽配术语「${inBody ? inBody[0] : ''}」，与品类 ${cat} 不符`);
    const inLedger = ledgerScan.match(re);
    check(!inLedger, `${slug}: 台账出现汽配术语「${inLedger ? inLedger[0] : ''}」，与品类 ${cat} 不符`);
  }
}

// 11) sitemap 不得包含 noindex 页面（Search Console 会报「已提交的网址标记为 noindex」）
const sitemapFile = join(DIST, 'sitemap-0.xml');
if (existsSync(sitemapFile)) {
  const urls = [...readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const url of urls) {
    const path = url.replace(/^https?:\/\/[^/]+/, '');
    const file = path === '/' ? join(DIST, 'index.html') : join(DIST, path, 'index.html');
    if (!existsSync(file)) {
      check(false, `sitemap 含不存在的页面：${path}`);
      continue;
    }
    const html = readHtml(file);
    check(
      !/<meta name="robots" content="noindex/.test(html),
      `sitemap 含 noindex 页面：${path}（应从未提交列表中过滤掉）`
    );
  }
}

// 12) 推广链接覆盖：每篇测评的 ASIN 必须在 src/data/affiliate.ts 里登记
const affiliateSrc = existsSync('src/data/affiliate.ts') ? readFileSync('src/data/affiliate.ts', 'utf8') : '';
const registeredAsins = new Set([...affiliateSrc.matchAll(/^\s{2}([A-Z0-9]{10}):\s*\{/gm)].map((m) => m[1]));
check(registeredAsins.size > 0, 'src/data/affiliate.ts 里没有登记任何推广链接');

for (const page of reviewPages) {
  const slug = page.replace(/\\/g, '/').split('/')[2];
  const mdx = join('src', 'content', 'reviews', `${slug}.mdx`);
  if (!existsSync(mdx)) continue;
  const src = readFileSync(mdx, 'utf8');
  const asin = src.match(/^amazonAsin:\s*"([^"]+)"/m)?.[1];
  const override = /^affiliateUrl:\s*"([^"]+)"/m.test(src);
  if (!override) {
    check(Boolean(asin), `${slug}: 既没有 affiliateUrl 也没有 amazonAsin，CTA 会指向 #`);
    check(
      !asin || registeredAsins.has(asin),
      `${slug}: ASIN ${asin ?? '—'} 未在 src/data/affiliate.ts 登记推广链接`
    );
  }
  check(!/YOUR-TAG-20/.test(readHtml(page)), `${slug}: 仍含占位推广 tag YOUR-TAG-20`);
}

// 13) 联盟链接必须带 rel="sponsored"/"nofollow"（Google 链接垃圾政策要求）
const affiliateHosts = [
  ...affiliateSrc.matchAll(/url:\s*'https?:\/\/([^/'"]+)/g),
].map((m) => m[1]);
if (affiliateHosts.length) {
  const hostPattern = new RegExp(`https://(?:${affiliateHosts.map((h) => h.replace(/\./g, '\\.')).join('|')})`);
  let affiliateLinks = 0;
  for (const file of walkHtml(DIST)) {
    const html = readHtml(file);
    for (const m of html.matchAll(/<a\b[^>]*href="(https:\/\/[^"]+)"[^>]*>/g)) {
      if (!hostPattern.test(m[1])) continue;
      affiliateLinks++;
      const rel = m[0].match(/rel="([^"]*)"/)?.[1] ?? '';
      check(
        /sponsored|nofollow/.test(rel),
        `${file.replace(/\\/g, '/')}: 联盟链接缺少 rel="sponsored"（当前 rel="${rel}"）`
      );
    }
  }
  check(affiliateLinks > 0, '全站没有渲染出任何联盟链接，检查 affiliate.ts 与 CTA 组件');
  console.log(`  · 联盟链接 ${affiliateLinks} 个，rel 全部合规`);
}

console.log(`\nQA: 检查 ${reviewPages.length} 个测评页`);
for (const n of notes) console.log(`  ! ${n}`);

if (failures.length) {
  console.error(`\nQA 失败 ${failures.length} 项：`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log('QA 全部通过 ✓\n');
