# Review Site（英文测评站）

基于 **Astro 5 + Tailwind CSS 4 + MDX Content Collections + Pagefind** 的静态测评站，部署目标 **Cloudflare Pages**。技术选型与 SEO/合规策略详见同目录《英文测评站开发方案.md》。

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Astro 5.18（静态优先 SSG，默认零 JS 输出） |
| 样式 | Tailwind CSS 4（`@tailwindcss/vite`） |
| 内容 | MDX + Content Collections（`src/content.config.ts`，编译期 schema 校验） |
| 搜索 | Pagefind（构建时生成静态索引，postbuild 脚本） |
| 结构化数据 | JSON-LD 生成器（`src/utils/schema.ts`） |
| 分析 | Cloudflare Web Analytics + GA4（可选，见环境变量） |
| 部署 | Cloudflare Pages（build: `npm run build`，输出目录 `dist`） |

## 本地开发

要求 Node ≥ 18.20（推荐 22，见 `.nvmrc`）。

```bash
npm install
npm run dev        # 本地开发 http://localhost:4321
npm run build      # 构建 + Pagefind 索引 + 质检脚本 → dist/
npm run qa         # 单独跑构建后质检（需先 build）
npm run preview    # 预览构建产物
```

> `npm run build` 末尾会执行 `scripts/qa.mjs`：检查 JSON-LD 数量、Product schema、联盟披露、`rel="sponsored"`、canonical、H1 唯一性，以及"研究型内容不得出现 we tested"这类伪装实测表述。任一项不通过会中断构建——Cloudflare Pages 上同样生效，用于防止政策回归。

## 环境变量

| 变量 | 用途 | 默认 |
|---|---|---|
| `SITE_URL` | 站点规范 URL，用于 canonical / sitemap / OG | `https://example.com` |
| `PUBLIC_GA4_ID` | GA4 Measurement ID（G-XXXX），不设则不加载 GA4 | 无 |
| `PUBLIC_CF_BEACON_TOKEN` | Cloudflare Web Analytics beacon token，不设则不加载 | 无 |

本地开发可在项目根建 `.env`（已被 .gitignore）；Cloudflare Pages 在项目设置 → Environment variables 配置。

## 内容工作流（AI 起草 + 人工复核）

1. 在 `src/content/reviews/` 新建 `.mdx` 文件，文件名即 URL slug；
2. frontmatter 按 `src/content.config.ts` 的 schema 填写——**所有数字（规格/价格/评分）必须来自投喂源，禁止编造**：
   - `rating`：本站评分（进入 Review/AggregateRating schema）
   - `amazonRating`：Amazon 参考评分（仅页面展示，**禁止**进入 schema）
   - `priceUsd` / `priceCheckedAt`：价格与抓取日期（页面标注"price as of"）
   - `sourceType`：`research`（无实物样品）或 `tested`（实测）
   - `faqs`：`[{ q, a }]` 数组，渲染可见问答区块并输出 FAQPage JSON-LD（建议 4–6 条真实搜索问题）
   - `draft: true` 的条目不生成页面
3. 正文按 4.3 模板：结论框 → 评估方法 → 数据 → 优缺点 → FAQ → 内链；
4. 新品类必须在 `src/data/categoryMeta.ts` 补人工导语，否则横评页显示 TODO 告警；
5. 发布前过 `src/pages` 无、方案书 7.5 的 13 项质检清单（重点：数字核对、无伪装实测、来源标注）。

## 部署到 Cloudflare Pages

1. 仓库推送到 GitHub（本地已初始化 git 并有首次提交）；
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git；
3. 构建配置：Framework preset 选 **Astro**；Build command `npm run build`；Build output directory `dist`；
4. 环境变量加 `SITE_URL=https://你的域名`（及 GA4/beacon 变量）；
5. Node 版本：仓库含 `.nvmrc`（22），Pages 自动读取；
6. 自定义域名在 Pages 项目 → Custom domains 绑定；
7. PR 会自动生成 Preview 部署用于审稿。

也可以本地直接部署：`npx wrangler pages deploy dist`。

## 上线前替换清单

- [ ] `src/consts.ts`：站点名 / 标语 / 描述
- [ ] `src/content/reviews/*.mdx`：示例内容（TOPDON ONE）替换为正式内容
- [ ] `affiliateUrl` 中的 `YOUR-TAG-20` 换成真实 Amazon Associates tag
- [ ] `src/pages/contact.astro`：真实联系邮箱
- [ ] Cloudflare Pages 环境变量：`SITE_URL`
- [ ] GA4：申请账号后设 `PUBLIC_GA4_ID`，在 GA4 后台把 `affiliate_click` 标记为**主要转化**并导入 Google Ads，接入认证 CMP（CookieYes）替换 Consent Mode 占位
- [ ] `public/_redirects`：改版 301 规则
- [ ] `src/data/categoryMeta.ts`：新增品类时补人工导语

## 已内置的 SEO / 合规项

- 每页 canonical、OG/Twitter Card、唯一 H1
- `sitemap-index.xml` 自动生成（`@astrojs/sitemap`）
- JSON-LD：Product+Review+AggregateRating（仅本站评分）/ ItemList / BreadcrumbList / Article / FAQPage
- `robots.txt` 动态生成并声明 sitemap
- RSS：`/rss.xml`（构建时从测评集合生成）
- `_headers`：安全响应头 + 静态资源 immutable 缓存
- 联盟链接统一 `rel="sponsored nofollow noopener"` + FTC/Amazon 披露语句
- GA4 转化事件：所有联盟外链点击触发 `affiliate_click`（含 `link_url` / `link_domain` / `item_name`），在 GA4 后台标记为主要转化后可导入 Google Ads
- Google Consent Mode v2 默认拒绝（等 CMP 接入）
- Pagefind 搜索结果页由客户端渲染，不进 sitemap
- 构建后质检（`scripts/qa.mjs`）强制校验上述政策项

## 后续路线（方案书对应章节）

- 第三方价格 API 接入（Rainforest/Keepa，方案书 7.2）
- 有销售记录后迁回 PA-API / Creators API 自动刷价
- 页面超约 2000 页或需多面筛选时：Pages Functions + D1（方案书 2.6）
- AdSense / Mediavine 广告接入（注意预留尺寸防 CLS）
- 多语言 i18n（Astro 内置路由）
