# 内容与 SEO 标准（新文章一律按此执行）

**本文件是标准，不是建议。** 2026-10-24 对首篇文章做完整审计后确立，其中可机器校验的部分已写入 `scripts/qa.mjs`，`npm run build` 不通过即中断部署。

标注说明：**✅ 自动拦截** = 构建失败；**⚠️ 人工** = 发文前人工核对。

## 一、五条硬性红线（审计中发现并修复的问题）

| # | 规则 | 状态 |
|---|---|---|
| 1 | **禁止用单条编辑评分写 `aggregateRating`**。Google 要求聚合评分反映多条真实评分；单条只能写 `Product.review.reviewRating`（ratingCount=1 属违规标记） | ✅ 自动拦截 |
| 2 | **`og:image` 必须是 PNG/JPG/WEBP**，1200×630。SVG 在 Facebook/X/LinkedIn 不渲染，等于没有分享图 | ✅ 自动拦截 |
| 3 | **`<title>` ≤ 60 字符**（硬上限 65）。超长时省略站名后缀 | ✅ 自动拦截 |
| 4 | **文章页 `og:type` 必须是 `article`**，不是全站统一 `website` | ✅ 自动拦截 |
| 5 | **Pagefind 搜索资源不得首屏预加载**，必须点击后加载（约省 30KB 首屏） | ✅ 自动拦截 |

## 二、页面级标准

| 项 | 标准 | 状态 |
|---|---|---|
| `meta description` | 100–160 字符，含具体利益点，不堆关键词 | ✅ |
| H1 | 全页唯一，与 title 同主题 | ✅ |
| 标题层级 | 不跳级（H1 → H2 → H3） | ⚠️ |
| `canonical` | 自引用、绝对 URL、每页恰好 1 个 | ✅ |
| `html lang` | 存在且正确（`en`） | ✅ |
| 作者署名 | 可见 + 链接到 About（E-E-A-T） | ⚠️ |
| 更新日期 | 页面可见 + `dateModified` | ⚠️ |
| 自制图表 | 每篇至少 1 个 `figure`（数据图/对比表截图） | ✅ |
| 站内链接 | 至少 1 条向上（品类/品牌页）+ 1 条横向（相关测评），锚文本描述性 | ⚠️ |

## 三、结构化数据

| 规则 | 说明 |
|---|---|
| Review 必须挂在 Product 内 | 用 `Product.review`，不要孤立 `Review`（缺 `itemReviewed` 无富媒体资格） |
| Amazon 评分不进 schema | 页面可显示 "Amazon rating: 4.5/5 (reference only)"，schema 只写本站评分 |
| Offer 价格与页面一致 | `priceValidUntil` ≤ 价格抓取日 + 7 天 |
| FAQPage 只标记可见问答 | 注意 2023-08 起 FAQ 富媒体仅对政府/医疗类开放，保留 markup 是为 AI 搜索，不是为 SERP 折叠 |
| 无 AggregateRating | 见红线 #1 |

## 四、内容质量（防薄内容 / scaled content abuse）

- [ ] 人工撰写的独特导语 ≥ 150 词，非模板拼接
- [ ] 至少 1 个独有数据点（自测结果或独家整理的数据）
- [ ] 至少 1 处与官方文案不同的判断（如成本测算、参数矛盾、口径差异）
- [ ] 无"仅换产品名"的模板页；产品数不足 3 个时不用 "Best X" 表述
- [ ] 结论来源已标注（`research` / `tested`），无伪装实测（"we tested" 表述）
- [ ] Amazon 评论仅作线索：不引原句、不成段改写、不署名、不用图；归纳须与规格表或第二信源交叉验证

## 五、发布后

- [ ] GSC 提交 `sitemap-index.xml`，检查索引状态
- [ ] Rich Results Test 验证 Product / Article / Breadcrumb
- [ ] 记录 URL 到季度审计表（90 天无曝光 → 合并 / 改写 / noindex）

## 六、当前已知差距（待补）

1. **Product schema 缺 `image`** —— 没有产品图（不能用 Amazon 图），富媒体可能不显示缩略图。解法：自制"评分卡片图"（同时满足自制图片要求）。
2. **内联 SVG 图表不进 Google Images** —— 后续在构建期用 sharp 转 PNG 并配 `alt`。
3. **单页站点整体偏薄** —— 需持续产出，非代码可解。
