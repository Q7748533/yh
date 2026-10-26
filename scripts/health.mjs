#!/usr/bin/env node
// 部署后健康检查
//
// 为什么要有这个脚本：
// 2026-10-26 的事故里，`/` 一直返回 200，把 sitemap / favicon / og 图
// 全线 404 盖了整整两天。只测首页等于没测。
//
// 检查三类东西：
//   1. 静态资源（sitemap / rss / favicon / robots）——搜索引擎和社交分享依赖
//   2. sitemap 自身结构——能被解析、指向的分片存在、URL 数量合理
//   3. sitemap 里的真实页面抽样——确认构建产物真的上线了
//
// 每个关键路径请求多次。只在第一次命中就放过会漏掉"时好时坏"的部署
// （事故当天同一 URL 有 70–90% 返回 404）。
//
// 用法：
//   npm run health                 检查生产
//   npm run health -- <base-url>   检查指定地址（如某个部署 URL）

const BASE = (process.argv[2] || process.env.SITE_URL || 'https://thepriceaudit.com').replace(/\/$/, '');
const ATTEMPTS = 3;

const STATIC_PATHS = [
  '/',
  '/sitemap-index.xml',
  '/sitemap-0.xml',
  '/rss.xml',
  '/favicon.svg',
  '/robots.txt',
];

/** 单次请求，返回 { ok, status, body } */
async function probe(path) {
  const url = BASE + path;
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'priceaudit-health/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    const body = res.ok ? await res.text() : '';
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    return { ok: false, status: 0, body: '', error: err.name };
  }
}

/** 多次请求，统计成功次数 */
async function probeRepeated(path, attempts = ATTEMPTS) {
  const statuses = [];
  let body = '';
  for (let i = 0; i < attempts; i++) {
    const r = await probe(path);
    statuses.push(r.status);
    if (r.ok && !body) body = r.body;
  }
  const passed = statuses.filter((s) => s >= 200 && s < 300).length;
  return { passed, attempts, statuses, body };
}

const failures = [];
const warnings = [];

function report(label, result) {
  const ok = result.passed === result.attempts;
  const mark = ok ? '✓' : result.passed > 0 ? '!' : '✗';
  const detail = `${result.passed}/${result.attempts}`;
  console.log(`  ${mark} ${label.padEnd(44)} ${detail}${ok ? '' : '  ← ' + result.statuses.join(',')}`);
  if (!ok && result.passed > 0) {
    warnings.push(`${label} 不稳定（${detail}）—— 边缘可能在服务两个不同部署`);
  }
  if (result.passed === 0) {
    failures.push(`${label} 全部失败（${result.statuses.join(',')}）`);
  }
  return ok;
}

async function main() {
  console.log(`\n健康检查：${BASE}\n`);

  console.log('静态资源');
  const results = {};
  for (const path of STATIC_PATHS) {
    results[path] = await probeRepeated(path);
    report(path, results[path]);
  }

  // sitemap 结构
  console.log('\nsitemap 结构');
  const indexBody = results['/sitemap-index.xml'].body;
  const shardMatch = indexBody.match(/<loc>([^<]*sitemap-\d+\.xml)<\/loc>/);
  if (!shardMatch) {
    failures.push('sitemap-index.xml 里找不到分片地址');
    console.log('  ✗ 找不到分片 <loc>');
  } else {
    const shardUrl = shardMatch[1];
    console.log(`  ✓ 分片指向 ${shardUrl}`);
    const shardPath = new URL(shardUrl).pathname;
    const shardBody = results['/sitemap-0.xml']?.body || (await probe(shardPath)).body;
    const urlCount = (shardBody.match(/<loc>/g) || []).length;
    if (urlCount === 0) {
      failures.push('sitemap 分片里没有任何 URL');
      console.log('  ✗ 分片内 URL 数为 0');
    } else {
      console.log(`  ✓ 分片内含 ${urlCount} 个 URL`);
      if (urlCount < 5) warnings.push(`sitemap 只有 ${urlCount} 个 URL，确认是否符合预期`);
    }

    // 抽样页面：优先抽测评页，静态页已经单独测过
    console.log('\n页面抽样');
    const urls = [...shardBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const reviews = urls.filter((u) => u.includes('/reviews/'));
    const pool = reviews.length >= 2 ? reviews : urls;
    const sample = pool.length <= 3 ? pool : [pool[0], pool[Math.floor(pool.length / 2)], pool[pool.length - 1]];
    for (const url of new Set(sample)) {
      const path = new URL(url).pathname;
      const r = await probeRepeated(path, 2);
      report(path, r);
    }
  }

  // 汇总
  console.log('');
  if (warnings.length) {
    console.log('警告：');
    warnings.forEach((w) => console.log(`  ! ${w}`));
  }
  if (failures.length) {
    console.log('\n失败：');
    failures.forEach((f) => console.log(`  ✗ ${f}`));
    console.log('\n健康检查未通过\n');
    process.exit(1);
  }
  console.log('健康检查通过 ✓\n');
}

main();
