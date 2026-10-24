# 项目记录（截至 2026-10-24 16:05）

## 一、一页概览

| 项 | 状态 |
|---|---|
| 站点 | https://yh-4pn.pages.dev（Cloudflare Pages 项目 `yh`） |
| 仓库 | https://github.com/Q7748533/yh（public，`main`） |
| 本地路径 | `D:/cpz` |
| 部署方式 | `npm run deploy`（构建 + 质检 + wrangler 直传），未接 Git 自动构建 |
| 当前规模 | 17 个页面、15 个组件、3 个脚本、44 项构建校验、2 篇测评、2 份主张台账、8 份文档 |
| 目标规模 | 100 篇以上，跨品类（汽车诊断 / 美发 / 咖啡机） |
| 定位 | **双轨**：SEO 为常态，部分测评页随时可转 Google Ads 投放 |
| 工作原则 | **合规优先，产出速度可慢**（用户 2026-10-24 明确） |
| 提交数 | 31 |

## 二、时间线

### 阶段 1–3（10-23 夜 → 10-24 中午）
脚手架与上线 → 首篇测评（TOPDON ONE）+ SEO 审计 → 版式 P0–P3 + 首页改版 + 图片体系 + 反模板化护栏

### 阶段 4：数据驱动与打磨
`9762778` 本记录建立 → `4f69844` Serper 接入（18 词）→ `fe8eee9` 订阅成本章深化 → `cd716e8` 表格排版修复

### 阶段 5：多品类与双轨
`e5c745c` 三品类 SERP 对比（15 词）+ `vertical-analysis.md` → `937235d` 投放就绪（`/privacy/` `/terms/`、表述修正、Ads 政策校验）

### 阶段 6：第二篇测评与真实性体系（10-24 下午）
| 提交 | 内容 |
|---|---|
| `16a7fa7` | 第二篇：Wavytalk Steamline Pro（hair-tools 品类，4.0 分） |
| `4a7c47b` | 温度结论纠错：机身刻度 320 ≠ 文案 325 |
| `d89d560` | 删掉"无订阅"套话；逐条审计找出 8 处表述超出证据；新增主张台账机制 |
| `dc39e8b` | "车主"术语污染修正 + 品类词汇检查 |
| `4233c7f` | 补入购买页保障计划（30 天退换 / $6.99 / $8.99 / $16.99 月费） |
| `30b4355` | 时间单位歧义修正（一次性 / 每月 / 每年分开标注） |

## 三、技术架构

**栈**：Astro 5.18（SSG）+ Tailwind 4 + MDX Collections + Pagefind（postbuild）+ sharp + Cloudflare Pages

**页面（17）**：首页、`/reviews/`、`/reviews/<slug>/`、`/best/`、`/best/<category>/`、`/brands/`、`/brands/<brand>/`、`/compare/<a>-vs-<b>/`、About、Methodology、Disclosure、Contact、Privacy、Terms、404、`/og/<slug>.png`、RSS/robots/sitemap

**组件（15）**：DecisionCard、ScoreBreakdown、Toc、StickyBuyBar、ReviewCard、ScenarioTable、SpecTable、SpecChart、ComparisonTable、ProsCons、CtaButton、Breadcrumbs、Header、Footer、Search

**脚本（3）**：`qa.mjs`（44 项校验）、`og-image.mjs`、`serp.mjs`

## 四、五套标准（全部由构建强制）

1. **SEO 五条硬红线**：禁 `aggregateRating`；`og:image` 必须 PNG/JPG；`title` ≤60；文章 `og:type=article`；Pagefind 不预加载
2. **版式标准**：决策卡 → TL;DR → 优缺点 → 规格表 → 评分分解 → 正文 → 结论 → FAQ；`tldr` 必填；`scoreBreakdown` 权重和 = 1 且加权 = rating
3. **图片标准**：每篇必须有产品图（注明来源）+ 自动生成 OG 评分卡；Amazon 图不可用；`<Image>` 出 WebP + srcset
4. **反模板化**：跨页重复句 = 0；正文 ≥500 词；对比页需人工分析才生成；品类页 <3 篇 noindex；每 10 篇一批
5. **投放就绪**：比较必须有依据；禁 guaranteed/100%/risk-free/#1；价格 ≤120 天；披露三层；不得暗示官方授权

**新增两条真实性规则**：
- **规格冲突要如实并列**：文案与机身标识不一致时两处都写，以设备标识为准
- **金额必须标明计价周期**：一次性 / 每月 / 每年逐个写清，推算值必须展示算式

## 五、真实性体系（阶段 6 建立）

**主张台账** `docs/claims/<slug>.md`：每个数字必须指回来源代号——
**L** listing 原文｜**A** 购买页｜**P** 官方图｜**S** 购物快照｜**R** 买家评论｜**C** 自有测算（写算式）

缺失台账 → 构建失败。台账另含"修正记录"表，记录什么被改、为什么。

**机器可查的三类污染**：
- 跨页重复句（模板化正文）
- 品类术语（非汽车品类出现车主/车辆/OBD/J2534/ECU/scan tool）
- 绝对化表述（guaranteed/100%/risk-free/#1/unbeatable）

## 六、视觉验证流程

改版式后必须截图确认：

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --hide-scrollbars --window-size=1000,600 \
  --screenshot="C:/Users/cc/AppData/Local/Temp/x.png" --virtual-time-budget=2000 "file:///D:/cpz/dist/..."
```

坑：`file://` 下 `/_astro/` 绝对路径不加载 CSS，需把资源路径改写成相对路径再截图；Windows 版 headless 有约 500px 最小窗口宽度。

## 七、SEO 与选题结论

**单品类（扫描仪，18 词）**：仅 1 个"可直接竞争"；`topdon one review` 前 10 无独立媒体；缺口在"无订阅/持有成本"。

**三品类对比（15 词）**：咖啡机优先（中尾有中型独立站，证明能进）；汽车只做成本角度；美发暂缓（大刊垄断 + 客单价低）。
**教训**：SERP 自动分类只数结果类型会误判，必须看具体域名。

## 八、内容资产

| 文章 | 品类 | 评分 | 核心发现 |
|---|---|---|---|
| TOPDON ONE（B0GK9G6YDL） | 汽车诊断 | 4.2 | 5 年 $1,736（订阅占 52%）、$0.65/day 与 $299/年 矛盾、universal fit 口径、4.5 分跨变体混合 |
| Wavytalk Steamline Pro（B0DCK8P752） | 美发 | 4.0 | 0.5ml/min 与水箱容量矛盾、四项百分比无测试方法、文案 325 vs 机身 320、保障计划 $16.99/月 = 购机价 229%/年 |

## 九、待办

| 优先级 | 事项 | 状态 |
|---|---|---|
| **阻断** | `SITE_EMAIL` 换真实邮箱（现 `contact@example.com`） | 未完成 |
| 高 | GSC 提交 sitemap | 未完成 |
| 高 | **价格提取与失效方案**（实时价 / 历史价 / 涨价后成本测算怎么办） | 讨论中 |
| 中 | 咖啡机垂直区第一篇（需先跑 6 词调研） | 未开始 |
| 中 | 第二个同品类产品（解锁对比页，需写 `compareNotes.ts`） | 未完成 |
| 中 | GA4 ID 接入 | 未完成 |
| 低 | 自定义域名、CMP | 未完成 |

## 十、环境坑

1. npm safe-delete 钩子会超时中断 install，重跑 `npm install` 对账
2. `.astro` 必须有成对 `---` fence
3. MDX 用 `{/* */}` 注释
4. Astro 7 需 Node ≥22.23.4，本机锁 5.x
5. `@astrojs/pagefind` 已下架，用 pagefind CLI
6. Bash 工作目录持久，用绝对路径
7. Git Bash 的 `/tmp` 与 Node 路径解析不一致
8. `.content-body` 全局规则污染组件（避免 `ul/li`）
9. 无头 Chrome 截图需改写资源路径；500px 最小窗口
10. 正则改脚本会吞换行，改完看 diff
11. **自查会漏**：术语与框架的错机器查不出，必须人工读一遍；用户已连续抓到 4 次（320°F、无订阅、车主、时间单位）
