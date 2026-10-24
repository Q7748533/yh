// Serper.dev SERP 采集与分析
// 用法：node --env-file=.env scripts/serp.mjs
// 产出：docs/serp-report.md（分析报告）+ .serp-cache/*.json（原始数据，已 gitignore）

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';

const KEY = process.env.SERPER_API_KEY;
if (!KEY) {
  console.error('缺少 SERPER_API_KEY，请用 node --env-file=.env 运行');
  process.exit(1);
}

const KEYWORD_SETS = {
  default: [
    { group: 'A 品牌核心', q: 'topdon one review' },
    { group: 'A 品牌核心', q: 'topdon one scan tool' },
    { group: 'A 品牌核心', q: 'topdon one diagnostic tablet' },
    { group: 'A 品牌核心', q: 'topdon one problems' },
    { group: 'A 品牌核心', q: 'topdon one subscription cost' },
    { group: 'B 对比', q: 'topdon one vs autel' },
    { group: 'B 对比', q: 'topdon one vs launch x431' },
    { group: 'B 对比', q: 'topdon one vs phoenix plus' },
    { group: 'B 对比', q: 'autel mk808 vs topdon' },
    { group: 'C 品类', q: 'best bidirectional scan tool' },
    { group: 'C 品类', q: 'best diagnostic scan tool for mechanics' },
    { group: 'C 品类', q: 'best scan tool for small shop' },
    { group: 'C 品类', q: 'j2534 pass thru scan tool' },
    { group: 'C 品类', q: 'best obd2 scanner with ecu coding' },
    { group: 'D 长尾', q: 'topdon one for ford' },
    { group: 'D 长尾', q: 'topdon one worth it' },
    { group: 'D 长尾', q: 'bidirectional scan tool under 1000' },
    { group: 'D 长尾', q: 'topdon one vs autel mk808' },
  ],
  // 跨品类横向对比：三个品类各 5 个同构查询（头部/人群/价格/单品测评/值不值）
  categories: [
    { group: '汽车诊断', q: 'best bidirectional scan tool' },
    { group: '汽车诊断', q: 'best diagnostic scan tool for mechanics' },
    { group: '汽车诊断', q: 'best scan tool under 500' },
    { group: '汽车诊断', q: 'topdon one review' },
    { group: '汽车诊断', q: 'topdon one worth it' },
    { group: '美发工具', q: 'best hair dryer' },
    { group: '美发工具', q: 'best hair dryer for fine hair' },
    { group: '美发工具', q: 'best hair dryer under 200' },
    { group: '美发工具', q: 'dyson supersonic review' },
    { group: '美发工具', q: 'dyson supersonic worth it' },
    { group: '咖啡机', q: 'best espresso machine' },
    { group: '咖啡机', q: 'best espresso machine for home' },
    { group: '咖啡机', q: 'best espresso machine under 1000' },
    { group: '咖啡机', q: 'breville barista express review' },
    { group: '咖啡机', q: 'breville barista express worth it' },
  ],
};

const setArg = process.argv.indexOf('--set');
const setName = setArg > -1 ? process.argv[setArg + 1] : 'default';
const KEYWORDS = KEYWORD_SETS[setName];
if (!KEYWORDS) {
  console.error(`未知关键词集：${setName}（可用：${Object.keys(KEYWORD_SETS).join(', ')}）`);
  process.exit(1);
}
const OUT_FILE = setName === 'default' ? 'docs/serp-report.md' : `docs/serp-${setName}.md`;

const RULES = [
  { name: 'video', test: (h) => /youtube\.com|youtu\.be|vimeo\.com/.test(h) },
  { name: 'marketplace', test: (h) => /amazon\.|ebay\.|walmart\.|aliexpress\.|temu\./.test(h) },
  {
    name: 'brand',
    test: (h) =>
      /(^|\.)topdon\.[a-z.]+$|(^|\.)topdonshop\.|(^|\.)autel\.[a-z.]+$|(^|\.)launch\.[a-z.]+$|(^|\.)x431\.|(^|\.)thinkcar\.|(^|\.)innova\.|(^|\.)actron\./.test(
        h
      ),
  },
  {
    name: 'forum',
    test: (h) =>
      /reddit\.com|quora\.com|facebook\.com|forums?\.|garagejournal|bobistheoilguy|diyelectriccar|tacomaworld|f150forum|obd2forum|scannerdanner|autel\.com\/community/.test(
        h
      ),
  },
  { name: 'publisher', test: () => true },
];

function host(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function classify(url) {
  const h = host(url);
  for (const rule of RULES) if (rule.test(h)) return rule.name;
  return 'publisher';
}

function verdictOf(counts, total) {
  const { video = 0, forum = 0, marketplace = 0, publisher = 0 } = counts;
  // 经验信号 = 视频 + 论坛（品牌站不算：那是厂商自己，不是独立经验）
  const experience = video + forum;
  const ratio = experience / total;
  if (marketplace / total >= 0.3) return '电商压制 · 改打长尾';
  if (ratio >= 0.4) return '需要经验信号';
  if (publisher / total >= 0.5) return '可直接竞争';
  return '混合场';
}

async function query(q, force) {
  const cacheFile = `.serp-cache/${q.replace(/[^a-z0-9]+/gi, '-')}.json`;
  if (!force && existsSync(cacheFile)) return { data: JSON.parse(readFileSync(cacheFile, 'utf8')), cached: true };
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, gl: 'us', hl: 'en', num: 10 }),
  });
  if (!res.ok) throw new Error(`${q} → HTTP ${res.status}`);
  return { data: await res.json(), cached: false };
}

mkdirSync('.serp-cache', { recursive: true });

const results = [];
for (const kw of KEYWORDS) {
  process.stdout.write(`${kw.q} … `);
  const { data, cached } = await query(kw.q, process.argv.includes('--force'));
  const organic = data.organic ?? [];
  const counts = {};
  for (const item of organic) {
    const c = classify(item.link);
    counts[c] = (counts[c] ?? 0) + 1;
  }
  const publisherHosts = [...new Set(organic.filter((i) => classify(i.link) === 'publisher').map((i) => host(i.link)))];
  results.push({
    ...kw,
    counts,
    total: organic.length,
    verdict: verdictOf(counts, organic.length || 1),
    top3: organic.slice(0, 3).map((i) => host(i.link)),
    brandFirst: organic.length > 0 && classify(organic[0].link) === 'brand',
    publishers: publisherHosts,
    paa: (data.peopleAlsoAsk ?? []).length,
    answerBox: Boolean(data.answerBox),
    topStories: (data.topStories ?? []).length,
    shopping: (data.shopping ?? []).length,
    related: (data.relatedSearches ?? []).map((r) => r.query).slice(0, 5),
    organic: organic.map((i) => ({ title: i.title, link: i.link, position: i.position })),
  });
  console.log(`${organic.length} 条 · ${results.at(-1).verdict}${cached ? ' (cache)' : ''}`);
  if (!cached) {
    writeFileSync(`.serp-cache/${kw.q.replace(/[^a-z0-9]+/gi, '-')}.json`, JSON.stringify(data, null, 2));
    await new Promise((r) => setTimeout(r, 350));
  }
}

const order = ['可直接竞争', '混合场', '需要经验信号', '电商压制 · 改打长尾'];
const icon = { 可直接竞争: '🟢', 混合场: '🟡', 需要经验信号: '🟠', '电商压制 · 改打长尾': '🔴' };

let md = `# SERP 分析报告（${new Date().toISOString().slice(0, 10)}）\n\n`;
md += `数据源：Serper.dev（Google 美国站，gl=us，hl=en，前 10 条自然结果）\n\n`;
md += `## 总览\n\n| 关键词 | 分组 | 类型分布 | 独立媒体 | 前 3 域名 | 品牌占首 | 判断 |\n|---|---|---|---|---|---|---|\n`;
for (const r of [...results].sort((a, b) => order.indexOf(a.verdict) - order.indexOf(b.verdict))) {
  const dist = Object.entries(r.counts)
    .map(([k, v]) => `${k} ${v}`)
    .join(' · ');
  md += `| ${r.q} | ${r.group} | ${dist} | ${r.publishers.length} | ${r.top3.join(' · ')} | ${
    r.brandFirst ? '是' : '否'
  } | ${icon[r.verdict]} ${r.verdict} |\n`;
}

md += `\n## 分类明细\n\n`;
for (const group of [...new Set(results.map((r) => r.group))]) {
  md += `### ${group}\n\n`;
  for (const r of results.filter((x) => x.group === group)) {
    md += `**${r.q}** — ${icon[r.verdict]} ${r.verdict}\n\n`;
    md += `- 类型分布：${Object.entries(r.counts).map(([k, v]) => `${k} ${v}`).join(' · ')}\n`;
    md += `- 独立媒体：${r.publishers.length ? r.publishers.join(', ') : '无'}\n`;
    md += `- 前 5 结果：\n`;
    for (const o of r.organic.slice(0, 5)) md += `  ${o.position}. ${host(o.link)} — ${o.title.slice(0, 90)}\n`;
    if (r.related.length) md += `- 相关搜索：${r.related.join(' / ')}\n`;
    md += `\n`;
  }
}

const tally = results.reduce((acc, r) => {
  acc[r.verdict] = (acc[r.verdict] ?? 0) + 1;
  return acc;
}, {});
md += `## 结论\n\n`;
for (const k of order) if (tally[k]) md += `- ${icon[k]} **${k}**：${tally[k]} 个关键词\n`;

writeFileSync(OUT_FILE, md);
console.log(`\n报告已写入 ${OUT_FILE}（${results.length} 个关键词）`);
