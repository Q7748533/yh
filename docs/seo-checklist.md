# SEO 检查清单（每篇发文前 5 分钟核对）

对照 Google 搜索要素与结构化数据政策整理。自动化部分已由 `npm run build` 末尾的 `scripts/qa.mjs` 强制执行，其余为人工核对项。

## 一、页面级（自动 + 人工）

| 项 | 标准 | 现状 |
|---|---|---|
| `<title>` | ≤ 60 字符；含目标关键词；不含堆砌 | 超长时自动省略站名后缀（Base.astro） |
| `meta description` | 120–155 字符，含利益点 | 由 frontmatter `description` 生成，超长自动截断 |
| H1 | 全页唯一，与 title 主题一致 | QA 脚本校验数量 = 1 |
| 标题层级 | 不跳级（H1 → H2 → H3） | 模板固定 |
| `canonical` | 自引用、绝对 URL | QA 脚本校验存在 |
| `og:type` | 文章页 = `article`，其余 `website` | ReviewLayout 传 `article` |
| `og:image` | **必须是 PNG/JPG**，1200×630 | `public/og-default.png`（`npm run og` 从 SVG 生成） |
| 作者 | 可见署名并链接到 About | ReviewLayout |
| 更新日期 | 页面可见 + schema `dateModified` | RatingCard 与 Article schema |

## 二、结构化数据（红线）

| 规则 | 说明 |
|---|---|
| **禁止单条评分冒充 AggregateRating** | Google 明确要求 aggregateRating 反映多条真实评分。单篇编辑评分只能放在 `Review.reviewRating`，不得写成 `aggregateRating`（ratingCount=1 属于违规）。 |
| Amazon 评分不进 schema | 页面可展示 "Amazon rating: 4.5/5 (reference only)"，但 schema 只写本站评分。 |
| Review 必须挂在 Product 内 | 使用 `Product.review`，不要孤立 `Review`（缺 `itemReviewed` 无富媒体资格）。 |
| FAQPage 只对可见内容 | 问答必须真实渲染在页面上，不能只写 schema。注意 2023 年后 FAQ 富媒体结果仅对政府/医疗类站点开放，保留 markup 无害但别期待曝光。 |
| Offer 价格 | 必须与页面显示价一致，`priceValidUntil` 不超过价格抓取日 + 7 天。 |

## 三、内容级（防薄内容 / scaled content abuse）

- [ ] 人工撰写的独特导语 ≥ 150 词（非模板拼接）
- [ ] 至少 1 个独有数据点（自测结果或独家整理的数据表）
- [ ] 至少 1 张自制图片（图表 / 截图 / 实拍）
- [ ] 无"仅换产品名"的模板页
- [ ] 结论来源类型已标注（research / tested），无伪装实测表述（QA 脚本拦截 "we tested"）
- [ ] 内链：至少 1 条向上（品类页/品牌页）+ 1 条横向（相关测评）
- [ ] Amazon 评论仅作线索：不引原句、不成段改写、不署名、不用图

## 四、技术层

- [ ] `sitemap-index.xml` 自动生成且包含新页
- [ ] `robots.txt` 声明 sitemap
- [ ] 404 返回 404 状态码
- [ ] 首屏无第三方阻塞脚本（Pagefind 已改点击后懒加载）
- [ ] 图片有 alt 或 SVG 有 `<title>` + figcaption
- [ ] 移动端可读（导航在 768px 以下独立横滑）

## 五、发布后

- [ ] GSC 提交 sitemap，检查"网页"索引状态
- [ ] Rich Results Test 验证 Product / Article / Breadcrumb
- [ ] 记录 URL 到季度审计表（90 天无曝光 → 合并/改写/noindex）
