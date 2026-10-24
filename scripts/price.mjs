// 实时价格查询（Rainforest API）
// 用法：
//   npm run price -- --asin B0DCK8P752
//   npm run price -- --asin B0DCK8P752 --slug wavytalk-steamline-pro-steam-straightener-brush
// 产出：终端报告 + 可直接粘贴的 frontmatter；原始 JSON 存 .price-cache/（gitignored）

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';

const KEY = process.env.RAINFOREST_API_KEY;
if (!KEY) {
  console.error('缺少 RAINFOREST_API_KEY，请用 node --env-file=.env 运行');
  process.exit(1);
}

const argv = process.argv.slice(2);
const getArg = (name) => {
  const i = argv.indexOf(name);
  return i > -1 ? argv[i + 1] : undefined;
};

const asin = getArg('--asin');
const slug = getArg('--slug');
if (!asin || !/^[A-Z0-9]{10}$/i.test(asin)) {
  console.error('用法：npm run price -- --asin <10 位 ASIN> [--slug <review-slug>]');
  process.exit(1);
}

const url =
  'https://api.rainforestapi.com/request' +
  `?api_key=${KEY}&type=product&amazon_domain=amazon.com&asin=${asin.toUpperCase()}`;

const res = await fetch(url);
if (!res.ok) {
  console.error(`请求失败：HTTP ${res.status}`);
  process.exit(1);
}
const json = await res.json();
if (json.error) {
  console.error(`API 错误：${json.error}`);
  process.exit(1);
}

const p = json.product ?? {};
const b = p.buybox_winner ?? {};
const price = b.price?.value ? Number(b.price.value) : undefined;
const list = b.rrp?.value ? Number(b.rrp.value) : undefined;
const deal = p.product_deal;
const today = new Date().toISOString().slice(0, 10);

mkdirSync('.price-cache', { recursive: true });
writeFileSync(`.price-cache/${asin.toUpperCase()}.json`, JSON.stringify(json, null, 2));

const plans = (b.protection_plans ?? []).map((x) => ({
  name: x.name,
  price: x.price?.value,
  billing: x.price?.billing_type,
  months: x.duration_months,
}));
const threeYear = plans.find((x) => x.months === 36);

console.log(`\nASIN ${asin.toUpperCase()} — ${p.title ?? '(无标题)'}`);
console.log(`  品牌        ${p.brand ?? '—'}`);
console.log(`  现价        ${price !== undefined ? `$${price.toFixed(2)}` : '—'}`);
console.log(`  划线原价    ${list !== undefined ? `$${list.toFixed(2)}` : '—'}`);
console.log(
  `  促销        ${deal ? `${deal.badge_text ?? ''} ${deal.percentage_off ? `· ${deal.percentage_off}% off` : ''}` : '无'}`
);
console.log(`  评分        ${p.rating ?? '—'} (${p.ratings_total ?? '—'})`);
console.log(
  `  退换        ${b.return_policy ? `${b.return_policy.duration_days} 天 ${b.return_policy.type ?? ''}` : '—'}`
);
if (plans.length) {
  console.log(
    `  保障计划    ${plans.map((x) => `${x.name} $${x.price}${x.billing === 'monthly' ? '/月' : ''}`).join(' · ')}`
  );
}

if (price !== undefined && threeYear?.price) {
  const planPrice = Number(threeYear.price);
  const atDeal = price + planPrice;
  const atList = (list ?? price) + planPrice;
  console.log(`\n  3 年成本（含 ${threeYear.name}）`);
  console.log(`    按现价   $${atDeal.toFixed(2)}  ≈ $${(atDeal / 3).toFixed(2)}/年`);
  if (list !== undefined && list !== price) {
    console.log(`    按原价   $${atList.toFixed(2)}  ≈ $${(atList / 3).toFixed(2)}/年`);
  }
}

console.log(`\nfrontmatter:`);
console.log(`priceUsd: ${price !== undefined ? price.toFixed(2) : '/* 无价 */'}`);
console.log(`priceCheckedAt: ${today}`);
if (list !== undefined) console.log(`listPriceUsd: ${list.toFixed(2)}`);
if (deal) {
  const note = `${deal.badge_text ?? 'Deal'}${deal.percentage_off ? `, ${deal.percentage_off}% off list` : ''}`;
  console.log(`priceNote: "${note}"`);
}

// 与现有 frontmatter 比对
if (slug) {
  const file = `src/content/reviews/${slug}.mdx`;
  if (!existsSync(file)) {
    console.log(`\n⚠ 找不到 ${file}`);
  } else {
    const src = readFileSync(file, 'utf8');
    const cur = src.match(/^priceUsd:\s*([\d.]+)/m);
    const curList = src.match(/^listPriceUsd:\s*([\d.]+)/m);
    const curDate = src.match(/^priceCheckedAt:\s*(\d{4}-\d{2}-\d{2})/m);
    const drift = [];
    if (cur && price !== undefined && Math.abs(Number(cur[1]) - price) >= 0.01) {
      drift.push(`priceUsd ${cur[1]} → ${price.toFixed(2)}`);
    }
    if (curList && list !== undefined && Math.abs(Number(curList[1]) - list) >= 0.01) {
      drift.push(`listPriceUsd ${curList[1]} → ${list.toFixed(2)}`);
    }
    if (curDate) {
      const days = Math.floor((Date.now() - new Date(curDate[1]).getTime()) / 86400000);
      if (days > 0) drift.push(`核对日期已过 ${days} 天`);
    }
    console.log(`\n与 ${slug} 对比：`);
    console.log(drift.length ? `  ⚠ ${drift.join(' · ')}` : '  ✓ 一致');
  }
}

console.log(`\ncredits: 本次 ${json.request_info?.credits_used_this_request ?? '?'} · 剩余 ${json.request_info?.credits_remaining ?? '?'}\n`);
