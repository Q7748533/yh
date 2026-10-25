# 项目记录（截至 2026-10-25 23:59）

## 一、一页概览

| 项 | 状态 |
|---|---|
| 品牌 | **The Price Audit** |
| 域名 | **https://thepriceaudit.com**（apex 200、HTTP→HTTPS 301、`www` 301 到 apex 且保留参数） |
| 仓库 | https://github.com/Q7748533/yh（public，`main`） |
| 本地路径 | `D:/cpz` |
| 部署 | `npm run deploy`（构建 + 质检 + wrangler 直传 + **IndexNow 自动提交**），未接 Git 自动构建 |
| 当前规模 | 18 页面、15 组件、**5 脚本**、**65 项构建校验**、**3 篇测评**、3 份主张台账、13 份文档 |
| sitemap | **12 条**（noindex 页已排除，测评页带真实 lastmod） |
| 目标规模 | 100 篇以上，跨品类（汽车诊断 / 美发 / 咖啡机） |
| 定位 | 双轨：SEO 常态 + 部分测评页可转 Google Ads 投放 |
| 原则 | 合规优先，产出速度可慢 |
| 提交数 | **57** |

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
| `fd3032f` | robots/RSS/seo 的 example.com fallback 清零 |

**阶段 8：Bing 渠道与爬虫卫生（10-24 深夜）**

起因：用户提交 Bing Webmaster Tools 后连续报两个问题，逐个排查修复。

| 提交 | 内容 |
|---|---|
| `3312cf7` | sitemap 加真实 `lastmod`（只给有 `updatedAt` 的测评页，静态页不编造日期） |
| `8a3fa29` | **接入 IndexNow**：key 文件 + 提交脚本 + 串进 deploy；默认只提交当天变更（流式） |
| `6e86b1f` | 换成 BWT 生成的 key（`f5e81f53…`），后台可显示已验证 |
| `8498661` | **BWT 报「400-499 错误」**：Cloudflare 邮箱混淆把 `mailto:` 改写成 `/cdn-cgi/l/email-protection#<hash>`，爬虫抓到 404 → robots 屏蔽 `/cdn-cgi/` |
| `81037f7` | **BWT 报「缺少 alt」**：Astro 把 `alt=""` 渲染成裸 `alt`，首页卡片图无效 → 组件加 `imageAlt`，QA 全站校验 |
| `b40fd70` | 补上 featured 卡片的 `imageAlt` 传参 |

**这一阶段的两个教训**：
- 爬虫报错要先分清**误报**（Cloudflare 内部路径）和**真 bug**（Astro 渲染），处理方式完全不同
- 校验要加在**构建产物层**：`alt=""` 在源码里看着没问题，只有输出 HTML 才暴露

**阶段 9：第三篇测评与真实性体系（10-25）**

| 提交 | 内容 |
|---|---|
| `5fac379` | **第三篇测评 TOPDON AD600S**：$196 无订阅扫描仪，切入点是"9 项 vs 30 项"的 60 天窗口 |
| `30db4fc` | 登记 B09KZTYD18 联盟链接，从无佣金模式切到佣金模式 |
| `bf4c50f` | 发布流程改为两步（草稿 → 确认 → 部署） |
| `2f2c094` | 补做 AD600S 的 SERP 调研（此前跳过了这一步） |
| `c904bd2` | 三步流程写进模板顶部 + QA 提醒缺调研记录 |
| `a73244b` | 规格字段名统一（`Operating system` / `Power source` / `Bidirectional control`），对比表不再有空值 |
| `85c4952` | **真实性红线**写入清单第零节 + 台账来源列校验 |

**本阶段的核心事件**：AD600S 补"车型覆盖"一节时，我在 AutoAuth 相关表述上连续出错三次——从"Stellantis 旗下"推断出 Fiat/Alfa Romeo、把 2017 写成 2018、把编辑判断写进事实段落。**三次都由用户发现**。

由此确立**真实性红线**（`docs/seo-checklist.md` 第零节）：
1. 一手优先，必须打开原文；SERP 摘要只能找线索
2. 上位概念不得自行展开为清单；检索缺席 ≠ 不存在
3. 厂商的认证表/兼容矩阵常在图片里，必须下载看图
4. 事实与判断分离，不得暗示动机

**方法论收获**：TOPDON 的 AutoAuth 认证名单是一张 3509×2112 的图片，文字检索完全查不到；下载读图后确认 AD600S（表内名 **ArtiDiag600 S**）在第 16 行，App V1.1.7，Chrysler(RAM)/Dodge/Jeep 需 V10.48、Fiat 需 V10.64。

**三篇全部按新标准复审完毕**：

| 文章 | 复审结论 | 提交 |
|---|---|---|
| TOPDON ONE | 4 项待修 → 已修：补 AutoAuth \$50/年、补"网关随订阅失效"、评分 4.5→4.6 | `97349fc` |
| TOPDON AD600S | 一手证据完整（TOPDON 原文页 + 认证表图片） | `97349fc` 前 |
| Wavytalk | **发现事实错误**：文章称"未公布制造商保修"，实际 wavytalk 官网写 1 年 + 注册延长 12 个月 → 已修 | `f91bd92` |

**Wavytalk 的错误值得单独记**：这是**缺席断言**（"厂商没有公布 X"）取证不足。只查了 Amazon listing，没查厂商官网。后果是结构性的——"$8.99 三年计划补上保修缺口"这个说法建立在不存在的缺口上。现已改为"买第 3 年"，并补上官网真实存在的不确定性：索赔需 product number + order number，但**未说明 Amazon 订单是否适用**。

## 三、技术架构

**栈**：Astro 5.18（SSG）+ Tailwind 4 + MDX Collections + Pagefind（postbuild）+ sharp + Cloudflare Pages

**页面（17）**：`/`、`/reviews/`、`/reviews/<slug>/`、`/best/`、`/best/<category>/`、`/brands/`、`/brands/<brand>/`、`/compare/<a>-vs-<b>/`、About、Methodology、Disclosure、Contact、Privacy、Terms、404、`/og/<slug>.png`、RSS/robots/sitemap

**脚本（5）**：`qa.mjs`（59 项校验）、`price.mjs`（实时价）、`indexnow.mjs`（变更提交）、`og-image.mjs`、`serp.mjs`

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
- sitemap 含 noindex 页 / 含不存在的页
- 联盟链接缺 `rel="sponsored"`
- ASIN 未登记 / 残留 `YOUR-TAG-20`
- **任意 `<img>` 缺合法的 `alt="..."`**（构建产物层检查，不是源码层）
- robots.txt 缺 `Disallow: /cdn-cgi/` 或 Sitemap 声明
- IndexNow key 文件缺失 / 内容与文件名不符 / 未进 dist

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
| Bing Webmaster | 已通过「导入自 GSC」验证 |
| IndexNow | key `public/f5e81f53abcd4a7ebe78e737e7ab0f0e.txt`（内容=文件名）；`npm run indexnow` 默认只提交当天变更，`--all` 全量；已串进 `npm run deploy` |
| robots.txt | `Allow: /` + `Disallow: /cdn-cgi/`（屏蔽 Cloudflare 邮箱混淆路径）+ Sitemap 声明 |

**三个收录渠道全部打通**：Google（GSC）、Bing（BWT + IndexNow）、sitemap/robots 基础。

## 九、SEO 与选题结论

**单品类（扫描仪，18 词）**：仅 1 个"可直接竞争"；`topdon one review` 前 10 无独立媒体；缺口在"无订阅/持有成本"。

**三品类（15 词）**：咖啡机优先（中尾有中型独立站证明能进）；汽车只做成本角度；美发暂缓（大刊垄断 + 客单价低）。

**教训**：SERP 自动分类只数结果类型会误判，必须看具体域名。

## 十、内容资产

| 文章 | 品类 | 评分 | 核心发现 |
|---|---|---|---|
| TOPDON ONE（B0GK9G6YDL） | 汽车诊断 | 4.2 | 5 年 $1,736（订阅占 52%）、$0.65/day 与 $299/年 矛盾、4 年保障计划 $119.99 vs 4 年续费 $598 |
| **TOPDON AD600S（B09KZTYD18）** | 汽车诊断 | 4.2 | **标题"9 项 reset"vs 脚注"30 项"**（激活 30 天后开 30 天试用，到期回到 9 项）、规格表写 Corded Electric 同页又要求每周充电、**2017+ FCA 需 AutoAuth $50/年**、同型号两个 listing 差 $10 |
| Wavytalk Steamline Pro（B0DCK8P752） | 美发 | 4.0 | 0.5ml/min 与水箱容量矛盾、四项百分比无测试方法、文案 325 vs 机身 320、$16.99/月 = 购机价 229%/年 |

## 十一、待办

| 优先级 | 事项 | 状态 |
|---|---|---|
| ✅ | ~~TOPDON ONE 复审 4 项~~ | **已完成**（`97349fc`） |
| ✅ | ~~Wavytalk 复审~~：发现保修表述错误，已修 | **已完成**（`f91bd92`） |
| **高** | **咖啡机垂直区第一篇**（需先跑 6 词调研）——基础设施已收尾，内容才是瓶颈 | 未开始 |
| 高 | 观察 GSC / BWT 收录与展现（2–4 周后再决定第四篇） | 进行中 |
| 中 | 第二个品牌（解锁品类页：≥3 篇 + ≥2 品牌） | 未开始 |
| 中 | `ad600s vs ad500` 对比页——SERP 显示文字供给最薄 | 未开始 |
| 中 | 价格历史（Keepa 手工查 / Rainforest $18 月付） | 待定 |
| 低 | HTML 加 `ETag` / `Last-Modified`（Cloudflare Pages 默认不发，需 Worker 或 `_headers`） | 未开始 |
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
11. **Astro 的 `alt=""` 会渲染成没有值的裸 `alt`**（`<img ... alt sizes=...>`），是无效 HTML。组件里必须传真实 alt 文本
12. **Cloudflare 邮箱混淆会把 `mailto:` 改写成 `/cdn-cgi/l/email-protection#<hash>`**，爬虫顺着抓会 404。robots 必须屏蔽 `/cdn-cgi/`
13. 爬虫报错先分清**误报**（Cloudflare 内部路径）和**真 bug**（渲染问题），处理方式相反
14. IndexNow key 文件名必须等于文件内容，且脚本按正则自动发现——换 key 只换文件，不改代码
15. **厂商把关键信息放在图片里**（认证名单、兼容矩阵、版本表）：文字检索与网页抓取都会漏，必须下载看图
16. **搜索摘要 ≠ 来源**：摘要能证明某页提到过某数字，不能证明原话。费用/年份/型号必须打开原文
17. **检索缺席 ≠ 不存在**：因检索没出现就删掉 Fiat 是错的，官方表里就有这一列
18. 新文章必须写 `draft: false`——schema 里 `draft` 默认 `true`，漏写会静默不生成页面
19. **"未公布"是缺席断言**：必须查过所有一手渠道才能写。只查 Amazon listing 就说"厂商没公布保修"是错的——wavytalk 官网写着 1 年 + 注册延长 12 个月
20. **复审要按品类换渠道**：汽配查厂商技术页，美妆查品牌官网的 warranty / return 页，两者不通用
