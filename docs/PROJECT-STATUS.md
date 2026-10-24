# 项目记录（截至 2026-10-24 19:40）

## 一、一页概览

| 项 | 状态 |
|---|---|
| 品牌 | **The Price Audit** |
| 域名 | **https://thepriceaudit.com**（apex 200、HTTP→HTTPS 301、`www` 301 到 apex 且保留参数） |
| 仓库 | https://github.com/Q7748533/yh（public，`main`） |
| 本地路径 | `D:/cpz` |
| 部署 | `npm run deploy`（构建 + 质检 + wrangler 直传），未接 Git 自动构建 |
| 当前规模 | 17 页面、15 组件、4 脚本、**53 项构建校验**、2 篇测评、2 份主张台账、9 份文档 |
| sitemap | **12 条**（noindex 页已排除） |
| 目标规模 | 100 篇以上，跨品类（汽车诊断 / 美发 / 咖啡机） |
| 定位 | 双轨：SEO 常态 + 部分测评页可转 Google Ads 投放 |
| 原则 | 合规优先，产出速度可慢 |
| 提交数 | 41 |

## 二、时间线

**阶段 1–4**：脚手架上线 → 首篇测评 + SEO 审计 → 版式与首页 → Serper 接入与成本章深化

**阶段 5**：三品类 SERP 对比 + 双轨（SEO/Ads）标准

**阶段 6**：第二篇测评（Wavytalk）+ **真实性体系**（主张台账、逐条审计、术语污染检查、规格冲突规则）

**阶段 7：域名与运营基础设施（10-24 傍晚）**

| 提交 | 内容 |
|---|---|
| `8c05a72` | 切换到 thepriceaudit.com，站名 The Price Audit，邮箱 hello@ |
| `e419e69` | GA4 `G-0NGKMQCZNZ` + 极简同意条（Consent Mode v2） |
| `e1c359b` | sitemap 排除 noindex 页面 |
| `f9e4f19` | 推广链接集中到 `src/data/affiliate.ts`（MaaS 链接） |
| `81edb42` | 披露文案改为"Amazon + 联盟网络"，加 rel 校验 |
| `dc3e20f` | 无佣金文章模式 + 品类/品牌页索引门槛 |
| 本次 | robots/RSS/seo 的 example.com fallback 清零 + 本记录 |

## 三、技术架构

**栈**：Astro 5.18（SSG）+ Tailwind 4 + MDX Collections + Pagefind（postbuild）+ sharp + Cloudflare Pages

**页面（17）**：`/`、`/reviews/`、`/reviews/<slug>/`、`/best/`、`/best/<category>/`、`/brands/`、`/brands/<brand>/`、`/compare/<a>-vs-<b>/`、About、Methodology、Disclosure、Contact、Privacy、Terms、404、`/og/<slug>.png`、RSS/robots/sitemap

**脚本（4）**：`qa.mjs`（53 项校验）、`price.mjs`（实时价）、`og-image.mjs`、`serp.mjs`

**数据层**：
- `src/data/affiliate.ts` —— ASIN → 联盟链接（唯一入口）
- `src/data/categoryMeta.ts` / `brandMeta.ts` —— 人工导语
- `src/utils/indexability.mjs` —— 索引门槛（页面 / sitemap / QA 三方共用）
- `docs/claims/<slug>.md` —— 主张台账

## 四、五套内容标准（构建强制）

1. **SEO 五红线**：禁 `aggregateRating`；`og:image` 必须 PNG/JPG；`title` ≤60；`og:type=article`；Pagefind 不预加载
2. **版式**：决策卡 → TL;DR → 优缺点 → 规格表 → 评分分解 → 正文 → 结论 → FAQ；`scoreBreakdown` 权重和 = 1 且加权 = rating
3. **图片**：每篇必须有产品图（注明来源）+ 自动 OG 评分卡；Amazon 图不可用
4. **反模板化**：跨页重复句 = 0；正文 ≥500 词；每 10 篇一批
5. **投放就绪**：比较必须有依据；禁 guaranteed/100%/#1；价格 ≤120 天；披露三层

## 五、真实性体系

**主张台账**：每个数字必须指回来源代号 —— **L** listing｜**A** 购买页｜**P** 官方图｜**S** 购物快照｜**R** 买家评论｜**F** Rainforest 实时｜**C** 自有测算（写算式）。缺失台账 → 构建失败。

**机器可查的污染**：
- 跨页重复句（模板化正文）
- 品类术语（非汽车品类出现车主/车辆/OBD 等）
- 绝对化表述（guaranteed/100%/risk-free/#1）
- sitemap 含 noindex 页
- 联盟链接缺 `rel="sponsored"`
- ASIN 未登记 / 残留 `YOUR-TAG-20`

**两条铁律**：
- 规格冲突时两处来源并列，以设备标识为准；禁止把"等于"写成"低于"
- 金额必须标计价周期（一次性/每月/每年），推算值必须展示算式

## 六、索引门槛（阶段 7 确立）

| 页面 | 门槛 | 理由 |
|---|---|---|
| `/best/<category>/` | **≥3 篇 且 ≥2 个品牌** | 单品牌是导购，不是横评 |
| `/brands/<brand>/` | **≥2 篇** + 人工导语 | 1 篇只是单品复述 |
| `/best/`、`/brands/` | 无（导航页） | — |

不满足 → noindex 且不进 sitemap。判定集中在 `indexability.mjs`。

## 七、变现结构

**不是 Amazon Associates，是 Amazon MaaS 联盟网络**：`pwiz.co/go/...`（TopDon）、`pboost.me/...?uid=7748533`（Wavytalk），`tag=maas` + `aa_*` 参数。

**双模式购买入口**：
- 有联盟链接 → 琥珀按钮 + `rel="sponsored nofollow noopener"` + "we may earn a commission"
- 无联盟链接 → 描边按钮 "Visit <brand>" + `rel="nofollow noopener"` + **"we earn nothing from this product"**

**策略**：联盟账号里能找到的就带佣金，找不到的照常评测但不带——覆盖广度 ≠ 变现广度。

## 八、运营基础设施（Cloudflare）

| 项 | 配置 |
|---|---|
| DNS | `@` CNAME → `yh-4pn.pages.dev`（已代理）；`www` CNAME → 同上 |
| www 跳转 | Redirect Rule：`http.host eq "www.thepriceaudit.com"` → `concat("https://thepriceaudit.com", http.request.uri.path)`，301，保留查询串 |
| 邮箱 | Email Routing：`hello@thepriceaudit.com` → 转发（MX = route1/2/3.mx.cloudflare.net） |
| GA4 | `G-0NGKMQCZNZ`（`consts.ts` 的 `GA_MEASUREMENT_ID`） |
| GSC | 已提交 `sitemap-index.xml` |

## 九、SEO 与选题结论

**单品类（扫描仪，18 词）**：仅 1 个"可直接竞争"；`topdon one review` 前 10 无独立媒体；缺口在"无订阅/持有成本"。

**三品类（15 词）**：咖啡机优先（中尾有中型独立站证明能进）；汽车只做成本角度；美发暂缓（大刊垄断 + 客单价低）。

**教训**：SERP 自动分类只数结果类型会误判，必须看具体域名。

## 十、内容资产

| 文章 | 品类 | 评分 | 核心发现 |
|---|---|---|---|
| TOPDON ONE（B0GK9G6YDL） | 汽车诊断 | 4.2 | 5 年 $1,736（订阅占 52%）、$0.65/day 与 $299/年 矛盾、4 年保障计划 $119.99 vs 4 年续费 $598 |
| Wavytalk Steamline Pro（B0DCK8P752） | 美发 | 4.0 | 0.5ml/min 与水箱容量矛盾、四项百分比无测试方法、文案 325 vs 机身 320、$16.99/月 = 购机价 229%/年 |

## 十一、待办

| 优先级 | 事项 | 状态 |
|---|---|---|
| 高 | 咖啡机垂直区第一篇（需先跑 6 词调研） | 未开始 |
| 高 | 观察 GSC 收录与展现（2–4 周后再决定第三篇） | 进行中 |
| 中 | 第二个品牌（解锁品类页：≥3 篇 + ≥2 品牌） | 未开始 |
| 中 | 价格历史（Keepa 手工查 / Rainforest $18 月付） | 待定 |
| 低 | CMP 替换自建同意条（面向 EEA 时） | 未开始 |

## 十二、环境坑

1. npm safe-delete 钩子会超时中断 install，重跑 `npm install` 对账
2. `.astro` 必须有成对 `---` fence；MDX 用 `{/* */}`
3. Astro 7 需 Node ≥22.23.4，本机锁 5.x
4. `.content-body` 全局规则污染组件（避免 `ul/li`）
5. 无头 Chrome 截图需改写资源路径；500px 最小窗口
6. 正则改脚本会吞换行，改完看 diff
7. **本沙箱代理访问不到 `www.`**，验证跳转用 `https://api.hackertarget.com/httpheaders/?q=<url>`
8. Cloudflare 可视化规则编辑器：字段选「主机名/等于」，**不要**把 `http.host eq "..."` 写进「值」
9. **自查会漏**：术语与框架的错机器查不出，用户已连续抓到 5 次（320°F、无订阅、车主、时间单位、sitemap 含 noindex）
10. 判定逻辑必须单点（`indexability.mjs`），否则页面 noindex 与 sitemap 会漂移
