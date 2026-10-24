# 项目记录（截至 2026-10-24）

## 一、一页概览

| 项 | 状态 |
|---|---|
| 站点 | https://yh-4pn.pages.dev（Cloudflare Pages 项目 `yh`） |
| 仓库 | https://github.com/Q7748533/yh（public，`main`） |
| 本地路径 | `D:/cpz` |
| 部署方式 | `npm run deploy`（构建 + 质检 + wrangler 直传），未接 Git 自动构建 |
| 当前规模 | 12 个静态页面、1 篇正式测评 |
| 目标规模 | 100 篇以上 |
| 工作原则 | **合规优先，产出速度可慢**（用户 2026-10-24 明确） |

## 二、时间线（2026-10-23 深夜 → 10-24 中午）

| 提交 | 内容 |
|---|---|
| `8d64d4f` | Phase 1 脚手架：Astro 5 + Tailwind 4 + MDX + Pagefind，10 个页面 |
| `9ed50e9` | 补 GA4 `affiliate_click` 转化事件、FAQ schema、RSS、构建后质检脚本 |
| `7fc4fd4` | 记录 GitHub 仓库地址 |
| `aa2d922` | 引入 wrangler 作为部署依赖 |
| `6f0dc35` | SITE_URL 默认值改为生产域名，新增 `npm run deploy` |
| `8a5254b` | 发布首篇正式测评（TOPDON ONE，research 型，4.2 分） |
| `216a25d` | 补车主反馈分析章节（评论仅作线索，不引原文） |
| `d23e324` | SEO 审计修复：移除单条 AggregateRating、OG 图转 PNG、title 长度、og:type、搜索懒加载 |
| `5214b0f` | 把 SEO 规则固化为构建强制标准（qa.mjs 扩到 10 项） |
| `331d942` | 版式 P0–P3 改造：决策卡、目录、评分分解、FAQ 折叠、粘性条 |
| `7a98494` | 首页改版 + 补 `/best/`、`/brands/` 索引页（原导航 404） |
| `05d249d` | 补回技术层检查清单（含死链规则） |
| `ee192d1` | 图片体系：自动评分卡 OG 图 + 厂商产品图管线 |
| `9648425` | 反模板化护栏：跨页重复句检测、对比页闸门、品类页 noindex |

## 三、技术架构

**栈**：Astro 5.18（SSG）+ Tailwind 4 + MDX Content Collections + Pagefind（postbuild 索引）+ sharp（图片）+ Cloudflare Pages

**页面（12）**
```
/                          首页（hero + featured 卡 + 原则条 + 评分说明 + 品类 + 收尾带）
/reviews/                  测评列表
/reviews/<slug>/           测评详情
/best/                     品类索引
/best/<category>/          品类横评（<3 篇时 noindex）
/brands/                   品牌索引
/brands/<brand>/           品牌页
/compare/<a>-vs-<b>/       对比页（需人工登记才生成）
/about/ /methodology/ /disclosure/ /contact/  信任页
/404
/og/<slug>.png             每篇自动生成的评分卡图
/rss.xml  /robots.txt  /sitemap-index.xml
```

**组件（14）**：DecisionCard、ScoreBreakdown、Toc、StickyBuyBar、ReviewCard、SpecTable、SpecChart、ComparisonTable、ProsCons、CtaButton、Breadcrumbs、Header、Footer、Search

**内容模型关键字段**：`rating`（本站评分）、`amazonRating`（仅展示）、`sourceType`（research/tested）、`tldr`、`scoreBreakdown`（权重校验）、`specs`、`faqs`、`heroImage` / `imageCredit` / `imageAlt`

## 四、四套已确立的标准（全部由构建强制）

**1. SEO 五条硬红线**
单条评分不得写 `aggregateRating`；`og:image` 必须 PNG/JPG 1200×630；`title` ≤60 字符；文章页 `og:type=article`；Pagefind 不得首屏预加载。

**2. 版式标准**
区块顺序固定：决策卡 → TL;DR → 优缺点 → 规格表 → 评分分解 → 正文 → 结论 → FAQ。`tldr` 必填（80–600 字符）；`scoreBreakdown` 权重和 = 1 且加权 = rating（容差 0.06）。

**3. 图片标准**
每篇必须有产品图（厂商官方图或实拍，注明来源）+ 自动生成的独立 OG 评分卡。Amazon 商品图不可用（Associates 合同限制）。图片走 Astro `<Image>`：WebP + srcset + 固定宽高。

**4. 反模板化 / 反规模滥用**（2026-08 spam update 后确立）
跨页重复句 = 0（≥10 词）；正文 ≥500 词；对比页必须有人工分析才生成；品类页 <3 篇 noindex；发布按 10 篇一批观察 GSC。

> 判定原则：**读者看完这页，有没有获得"看前三个搜索结果拿不到的东西"？** 没有就不要发布。

## 五、自动化校验（`scripts/qa.mjs`，36 项）

| 类别 | 检查 |
|---|---|
| 产物 | 首页/robots/sitemap/pagefind/_headers 存在 |
| 结构化数据 | JSON-LD ≥3 段、Product schema、无 AggregateRating、Review 嵌在 Product 内 |
| 合规 | Amazon 披露语句、`rel="sponsored nofollow noopener"`、research 型不得出现 "we tested" |
| SEO | title ≤65、description 100–160、canonical 恰好 1、html lang、og:image 格式、og:type |
| 版式 | 决策卡/优缺点/规格表/评分分解/结论/目录/details 存在 + 区块顺序 |
| 内容 | 正文 ≥500 词、跨页重复句 = 0、自制 figure 存在 |
| 链接 | 全站内链可达（死链即失败） |
| 程序化页 | 对比页必须含人工撰写的 "The short answer" |

## 六、内容资产：TOPDON ONE（首篇）

- ASIN `B0GK9G6YDL`，$839，Amazon 4.5/313（仅参考），本站 4.2（research 型）
- 三处原创发现：
  1. 官方 "$0.65/day" 与 $299/年 不符（实际约 $0.82/day，$0.65 对应约 $237/年）
  2. "Universal fit" 仅指 OBD 接口，不代表功能覆盖；附官方协议表的年款门槛
  3. 4.5 分跨 listing 变体混合（多条差评日期早于 2026-02 上市，一条标题写的是另一款设备）
- 成本图：5 年总花费 $1,736，其中订阅 $897（占 52%）
- 产品图：TopDon 官方图（标注 "Image: TOPDON, unmodified"）

## 七、待办

| 优先级 | 事项 | 说明 |
|---|---|---|
| 高 | 替换 `YOUR-TAG-20` | 真实 Associates tag，全局搜索替换 |
| 高 | GSC 提交 sitemap | 站点已可被抓取，越早提交越好 |
| 高 | 查 SERP 定选题 | 已给 18 个关键词与 6 个记录字段，等结果 |
| 中 | 第二个同品类产品 | 解锁对比页与横评表 |
| 中 | 接入 GA4 ID | 事件已埋好，只差 ID |
| 中 | 自定义域名 | 绑定后改 `SITE_URL` 重新部署 |
| 低 | 评分卡图进 Google Images | 已产出 PNG，需观察收录 |
| 低 | CMP（CookieYes） | 替换 Consent Mode 占位 |

## 八、环境坑（复用经验）

1. **npm safe-delete 钩子（genie-trash）会超时**：install 中断后需重跑 `npm install` 对账；装 wrangler 用了 3 分 22 秒。
2. **`.astro` 文件必须有成对 `---` fence**：漏写开头 fence 时报错信息不指向文件，需批量检查。
3. **MDX 不支持 HTML 注释**：用 `{/* */}`，frontmatter 前不能有注释。
4. **Astro 7 要求 Node ≥22.23.4**，本机 22.22.2 不满足，故锁 Astro 5.x。
5. **`@astrojs/pagefind` 已从 npm 移除**，改用 pagefind CLI。
6. **Bash 工作目录会持久**：连续命令里用相对路径容易出错，统一 `cd /d/cpz` 或绝对路径。
7. **Git Bash 的 `/tmp` 与 Node 的路径解析不一致**（Node 看到 `D:\tmp`），临时文件写到项目目录再删。

## 九、下一步建议

1. 拿到 SERP 结果后定选题优先级——**先确认有缝隙再写**，不盲写 100 篇。
2. 每 10 篇一批，观察 GSC 收录率与展现；收录异常时先查内容质量而非技术。
3. 第二个产品落地时，同步补 `src/data/compareNotes.ts` 的人工对比分析，否则对比页不会生成。
4. 有销量后接 Creators API（原 PA-API）自动刷价与取图，替换手工维护。
