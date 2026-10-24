# 项目记录（截至 2026-10-24 13:50）

## 一、一页概览

| 项 | 状态 |
|---|---|
| 站点 | https://yh-4pn.pages.dev（Cloudflare Pages 项目 `yh`） |
| 仓库 | https://github.com/Q7748533/yh（public，`main`） |
| 本地路径 | `D:/cpz` |
| 部署方式 | `npm run deploy`（构建 + 质检 + wrangler 直传），未接 Git 自动构建 |
| 当前规模 | 12 个静态页面、15 个组件、1 篇正式测评（959 索引词）、36 项构建校验 |
| 目标规模 | 100 篇以上 |
| 工作原则 | **合规优先，产出速度可慢**（用户 2026-10-24 明确） |
| 提交数 | 17 |

## 二、时间线

### 阶段 1：脚手架与上线（10-23 夜）
| 提交 | 内容 |
|---|---|
| `8d64d4f` | Phase 1 脚手架：Astro 5 + Tailwind 4 + MDX + Pagefind，10 个页面 |
| `9ed50e9` | GA4 `affiliate_click` 事件、FAQ schema、RSS、构建后质检脚本 |
| `7fc4fd4` `aa2d922` `6f0dc35` | 仓库地址、wrangler 依赖、SITE_URL 与部署脚本 |

### 阶段 2：首篇内容与 SEO 审计（10-24 上午）
| 提交 | 内容 |
|---|---|
| `8a5254b` | 首篇测评：TOPDON ONE（research 型，4.2 分） |
| `216a25d` | 车主反馈章节（评论仅作线索，不引原文） |
| `d23e324` | SEO 审计：移除单条 AggregateRating、OG 转 PNG、title 长度、og:type、搜索懒加载 |
| `5214b0f` | SEO 规则固化为构建强制（qa.mjs 扩到 10 项） |

### 阶段 3：版式与首页（10-24 中午）
| 提交 | 内容 |
|---|---|
| `331d942` | 版式 P0–P3：决策卡、目录、评分分解、FAQ 折叠、粘性条 |
| `7a98494` `05d249d` | 首页改版 + 补 `/best/`、`/brands/`（原导航 404） |
| `ee192d1` | 图片体系：自动评分卡 OG 图 + 厂商产品图管线 |
| `9648425` | 反模板化护栏：重复句检测、对比页闸门、品类页 noindex |

### 阶段 4：数据驱动与打磨（10-24 下午）
| 提交 | 内容 |
|---|---|
| `9762778` | 本记录文档建立 |
| `4f69844` | 接入 Serper.dev：18 词 SERP 采集 + 选题计划 |
| `fe8eee9` | 订阅成本章节就地深化（三种持有方式、失效后停什么、购前核查） |
| `cd716e8` | 表格排版修复：全局 table 样式 + `ScenarioTable` 响应式组件 |

## 三、技术架构

**栈**：Astro 5.18（SSG）+ Tailwind 4 + MDX Collections + Pagefind（postbuild）+ sharp + Cloudflare Pages

**页面（12）**
```
/                          首页（hero + featured 卡 + 原则条 + 评分说明 + 品类 + 收尾带）
/reviews/                  测评列表
/reviews/<slug>/           测评详情
/best/  /best/<category>/  品类索引 + 横评（<3 篇时 noindex）
/brands/  /brands/<brand>/ 品牌索引 + 品牌页
/compare/<a>-vs-<b>/       对比页（需人工登记才生成）
/about/ /methodology/ /disclosure/ /contact/ /404
/og/<slug>.png             每篇自动生成的评分卡图
/rss.xml  /robots.txt  /sitemap-index.xml
```

**组件（15）**：DecisionCard、ScoreBreakdown、Toc、StickyBuyBar、ReviewCard、ScenarioTable、SpecTable、SpecChart、ComparisonTable、ProsCons、CtaButton、Breadcrumbs、Header、Footer、Search

**脚本（3）**：`qa.mjs`（36 项校验）、`og-image.mjs`（默认 OG 图栅格化）、`serp.mjs`（SERP 采集）

**内容模型关键字段**：`rating`（本站评分）、`amazonRating`（仅展示）、`sourceType`、`tldr`、`scoreBreakdown`（权重校验）、`specs`、`faqs`、`heroImage`/`imageCredit`/`imageAlt`

## 四、四套已确立的标准（全部由构建强制）

**1. SEO 五条硬红线**：单条评分不得写 `aggregateRating`；`og:image` 必须 PNG/JPG 1200×630；`title` ≤60；文章页 `og:type=article`；Pagefind 不得首屏预加载。

**2. 版式标准**：决策卡 → TL;DR → 优缺点 → 规格表 → 评分分解 → 正文 → 结论 → FAQ；`tldr` 必填（80–600 字符）；`scoreBreakdown` 权重和 = 1 且加权 = rating。

**3. 图片标准**：每篇必须有产品图（注明来源）+ 自动生成的独立 OG 评分卡；Amazon 商品图不可用；走 `<Image>` 出 WebP + srcset。

**4. 反模板化 / 反规模滥用**：跨页重复句 = 0；正文 ≥500 词；对比页必须有人工分析才生成；品类页 <3 篇 noindex；每 10 篇一批观察 GSC。

> 判定原则：**读者看完这页，有没有获得"看前三个搜索结果拿不到的东西"？**

## 五、视觉验证流程（10-24 新增）

改任何版式后，**必须截图确认再交付**，不能只读 CSS 推断：

```bash
# 无头 Chrome 截图（输出到临时目录，项目目录写入会被拒）
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --hide-scrollbars --window-size=1000,600 --screenshot="C:/Users/cc/AppData/Local/Temp/x.png" \
  --virtual-time-budget=2000 "file:///D:/cpz/dist/..."
```

- Windows 版 headless Chrome 有 **约 500px 最小窗口宽度**，375px 截图会被裁剪，产生"溢出"假象——判定溢出前先用 500/800 复测。
- 只想看某个组件时，把该段 HTML 抽出来 + 引用 `dist/_astro/*.css` 单独渲染，比截整页快。

## 六、SEO 与选题（SERP 实测）

18 个关键词（Google 美国站前 10）结论：**只有 1 个"可直接竞争"**，12 个被 YouTube/Reddit/Facebook/品牌站占据。

- `topdon one review` 前 10 **无任何独立测评媒体**
- 品类词被 Car and Driver、Road & Track 的 "Tested" 内容占位（无实测打不过）
- 相关搜索暴露真实缺口：`best bidirectional scan tool without subscription`、`DIY scan tool recommendations that don't require an ongoing license`

**策略**：把"持有成本核算"做成标志性栏目——大站不做、品牌方回避、需求真实。详见 `docs/keyword-plan.md`。

## 七、内容资产：TOPDON ONE

- ASIN `B0GK9G6YDL`，$839，Amazon 4.5/313（仅参考），本站 4.2（research 型）
- 订阅章：$24.90/月、$0.82/天、占购机价 36%；三种持有方式（$1,736 / $1,437 / $839）；失效后核心功能仍可用但新车数据与保修停止
- 三处原创发现：`$0.65/day` 与 $299/年 不符、"universal fit" 仅指接口、4.5 分跨 listing 变体混合
- 5 年成本 $1,736，订阅占 52%

## 八、待办

| 优先级 | 事项 |
|---|---|
| 高 | 替换 `YOUR-TAG-20` 为真实 Associates tag |
| 高 | GSC 提交 sitemap |
| 高 | 按 `keyword-plan.md` 的 P0 选题继续产出 |
| 中 | 第二个同品类产品（解锁对比页，需同时写 `compareNotes.ts`） |
| 中 | GA4 ID 接入（事件已埋好） |
| 中 | 自定义域名（改 `SITE_URL` 重部署） |
| 低 | CMP（CookieYes）替换 Consent Mode 占位 |

## 九、环境坑

1. **npm safe-delete 钩子（genie-trash）会超时**：install 中断后重跑 `npm install` 对账（装 wrangler 3m22s）。
2. **`.astro` 必须有成对 `---` fence**：漏写时错误不指向文件。
3. **MDX 不支持 HTML 注释**：用 `{/* */}`。
4. **Astro 7 需 Node ≥22.23.4**，本机 22.22.2 不满足，锁 5.x。
5. **`@astrojs/pagefind` 已下架**，改用 pagefind CLI。
6. **Bash 工作目录持久**：连续命令用绝对路径。
7. **Git Bash 的 `/tmp` 与 Node 路径解析不一致**：临时文件写项目目录。
8. **`.content-body` 的全局规则会污染组件**：组件内避免用 `ul/li`（会继承 `list-disc` 和 `pl-6`），或显式重置。
9. **无头 Chrome 截图**：项目目录写入被拒，输出到 `C:\Users\cc\AppData\Local\Temp\` 再复制。
