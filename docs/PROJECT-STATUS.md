# 项目记录（截至 2026-10-24 14:35）

## 一、一页概览

| 项 | 状态 |
|---|---|
| 站点 | https://yh-4pn.pages.dev（Cloudflare Pages 项目 `yh`） |
| 仓库 | https://github.com/Q7748533/yh（public，`main`） |
| 本地路径 | `D:/cpz` |
| 部署方式 | `npm run deploy`（构建 + 质检 + wrangler 直传），未接 Git 自动构建 |
| 当前规模 | 14 个页面、15 个组件、3 个脚本、41 项构建校验、1 篇测评（959 索引词） |
| 目标规模 | 100 篇以上，跨品类（汽车诊断 / 咖啡机 / 美发） |
| 定位 | **双轨**：SEO 为常态，部分测评页随时可转 Google Ads 投放 |
| 工作原则 | **合规优先，产出速度可慢**（用户 2026-10-24 明确） |
| 提交数 | 19 |

## 二、时间线

### 阶段 1：脚手架与上线（10-23 夜）
`8d64d4f` 脚手架 → `9ed50e9` GA4 事件 / FAQ schema / RSS / 质检脚本 → `7fc4fd4` `aa2d922` `6f0dc35` 仓库、wrangler、SITE_URL 与部署脚本

### 阶段 2：首篇内容与 SEO 审计（10-24 上午）
`8a5254b` TOPDON ONE 测评 → `216a25d` 买家反馈章 → `d23e324` SEO 审计（AggregateRating / OG PNG / title / og:type / 搜索懒加载）→ `5214b0f` 规则固化为构建强制

### 阶段 3：版式与首页（10-24 中午）
`331d942` 版式 P0–P3（决策卡、目录、评分分解、FAQ 折叠、粘性条）→ `7a98494` `05d249d` 首页改版 + 补 `/best/` `/brands/`（原导航 404）→ `ee192d1` 图片体系 → `9648425` 反模板化护栏

### 阶段 4：数据驱动与打磨（10-24 下午）
`9762778` 本记录建立 → `4f69844` Serper 接入（18 词）→ `fe8eee9` 订阅成本章深化 → `cd716e8` 表格排版修复

### 阶段 5：多品类与双轨（10-24 下午）
`e5c745c` 三品类 SERP 对比（15 词）+ `docs/vertical-analysis.md` 优先级分析
`937235d` 投放就绪：`/privacy/` `/terms/`、内容表述修正、Ads 政策校验、`docs/ads-readiness.md`

## 三、技术架构

**栈**：Astro 5.18（SSG）+ Tailwind 4 + MDX Collections + Pagefind（postbuild）+ sharp + Cloudflare Pages

**页面（14）**
```
/                          首页
/reviews/  /reviews/<slug>/ 测评列表 + 详情
/best/  /best/<category>/   品类索引 + 横评（<3 篇 noindex）
/brands/  /brands/<brand>/  品牌索引 + 品牌页
/compare/<a>-vs-<b>/        对比页（需人工登记才生成）
/about/ /methodology/ /disclosure/ /contact/ /privacy/ /terms/ /404
/og/<slug>.png              每篇自动生成的评分卡图
/rss.xml  /robots.txt  /sitemap-index.xml
```

**组件（15）**：DecisionCard、ScoreBreakdown、Toc、StickyBuyBar、ReviewCard、ScenarioTable、SpecTable、SpecChart、ComparisonTable、ProsCons、CtaButton、Breadcrumbs、Header、Footer、Search

**脚本（3）**：`qa.mjs`（41 项校验）、`og-image.mjs`、`serp.mjs`（`--set default|categories`，缓存优先）

**文档（8）**：PROJECT-STATUS / seo-checklist / ads-readiness / keyword-plan / vertical-analysis / serp-report / serp-categories / article-template

## 四、四套内容标准（构建强制）

**1. SEO 五条硬红线**：禁 `aggregateRating`；`og:image` 必须 PNG/JPG；`title` ≤60；文章 `og:type=article`；Pagefind 不预加载。

**2. 版式标准**：决策卡 → TL;DR → 优缺点 → 规格表 → 评分分解 → 正文 → 结论 → FAQ；`tldr` 必填；`scoreBreakdown` 权重和 = 1 且加权 = rating。

**3. 图片标准**：每篇必须有产品图（注明来源）+ 自动生成 OG 评分卡；Amazon 图不可用；`<Image>` 出 WebP + srcset。

**4. 反模板化**：跨页重复句 = 0；正文 ≥500 词；对比页需人工分析才生成；品类页 <3 篇 noindex；每 10 篇一批。

**5. 投放就绪（新增）**：比较必须有依据（禁无出处倍数）；禁 guaranteed/100%/risk-free/#1/unbeatable；价格 ≤120 天；披露三层；不得暗示官方授权；广告文案不用品牌商标。详见 `docs/ads-readiness.md`。

> 判定原则：**读者看完这页，有没有获得"看前三个搜索结果拿不到的东西"？**

## 五、视觉验证流程

改任何版式后必须截图确认再交付：

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --hide-scrollbars --window-size=1000,600 \
  --screenshot="C:/Users/cc/AppData/Local/Temp/x.png" --virtual-time-budget=2000 "file:///D:/cpz/dist/..."
```

Windows 版 headless Chrome 有约 500px 最小窗口宽度，375px 截图会裁剪出"溢出"假象。

## 六、SEO 与选题结论

**18 词单品类（扫描仪）**：只有 1 个"可直接竞争"，12 个被 YouTube/Reddit/品牌站占据；`topdon one review` 前 10 无任何独立测评媒体；真实缺口是"无订阅 / 持有成本"。

**15 词三品类对比**：

| 品类 | 前排是谁 | 中型独立站能进 | 契合持有成本定位 | 结论 |
|---|---|---|---|---|
| 咖啡机 | 垂直专家站 + seriouseats/nytimes | **能（多个实例）** | 高 | **优先** |
| 汽车诊断 | Reddit/YouTube/品牌站，编辑真空 | 很少 | 高 | 只做成本角度 |
| 美发工具 | allure/instyle/byrdie/NYT 大刊 | 勉强 | 低 | 暂缓 |

**教训**：SERP 自动分类只数结果类型会误判，必须看具体域名（大刊 vs 中型博客 vs 垂直专家站）。

## 七、内容资产：TOPDON ONE

- ASIN `B0GK9G6YDL`，$839，Amazon 4.5/313（仅参考），本站 4.2（research）
- 订阅章：$24.90/月、$0.82/天、占购机价 36%；三种持有方式（$1,736 / $1,437 / $839）
- 三处原创发现：`$0.65/day` 与 $299/年 不符、"universal fit" 仅指接口、4.5 分跨变体混合
- 5 年成本 $1,736，订阅占 52%

## 八、待办

| 优先级 | 事项 | 状态 |
|---|---|---|
| **阻断** | `SITE_EMAIL` 换真实邮箱（现为 `contact@example.com`） | 未完成 |
| 高 | GSC 提交 sitemap | 未完成 |
| 高 | 按 `keyword-plan.md` / `vertical-analysis.md` 开始咖啡机垂直区 | 未开始 |
| 中 | 第二个同品类产品（解锁对比页，需写 `compareNotes.ts`） | 未完成 |
| 中 | GA4 ID 接入（事件已埋） | 未完成 |
| 中 | 自定义域名（改 `SITE_URL` 重部署） | 未完成 |
| 低 | CMP（CookieYes）替换 Consent Mode 占位 | 未完成 |

## 九、环境坑

1. npm safe-delete 钩子（genie-trash）会超时中断 install，需重跑 `npm install` 对账（装 wrangler 3m22s）。
2. `.astro` 必须有成对 `---` fence，漏写时错误不指向文件。
3. MDX 不支持 HTML 注释，用 `{/* */}`。
4. Astro 7 需 Node ≥22.23.4，本机 22.22.2 不满足，锁 5.x。
5. `@astrojs/pagefind` 已下架，改用 pagefind CLI。
6. Bash 工作目录持久，连续命令用绝对路径。
7. Git Bash 的 `/tmp` 与 Node 路径解析不一致，临时文件写项目目录。
8. `.content-body` 全局规则会污染组件：组件内避免 `ul/li`（继承 list-disc + pl-6）。
9. 无头 Chrome 截图：项目目录写入被拒，输出到 `C:\Users\cc\AppData\Local\Temp\` 再复制；375px 会被裁剪。
10. 编辑脚本时用正则替换容易把换行吃掉（本次 qa.mjs 曾出现注释吞掉 `const` 声明），改完必须看一遍 diff。
