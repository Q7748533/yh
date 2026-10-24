# 投放就绪标准（Google Ads）· 与 SEO 共用一套内容

站点是双轨的：**SEO 是常态，部分测评页随时可以拿去投放**。两者不冲突——Google 广告要的"可信、透明、可核查"，正是 SEO 要的东西。冲突时一律以**可核查**为准。

## 一、Ads 侧的四类政策风险

| 政策 | 触发点 | 我们的应对 |
|---|---|---|
| **不可核查声明**（Unreliable claims） | 保证效果、绝对化用词、无依据的倍数比较 | 禁用词表 + 比较必须有依据 |
| **误导性陈述**（Misrepresentation） | 商业信息不透明、联系方式假、价格过期 | 真实邮箱、Privacy/Terms、价格 ≤120 天 |
| **落地页体验**（Destination experience） | 薄内容、弹窗遮挡、内容与广告不符 | 每页 ≥500 词 + 首屏决策卡 + 无弹窗 |
| **Cloaking** | 给爬虫和用户看不同内容 | 纯静态站，天然不存在 |

## 二、内容规则（每条都是硬规则）

### 1. 比较必须有依据，否则去掉倍数
- ❌ "roughly **half** the price of flagship tablets"
- ❌ "flagship tablets charge **two to three times** as much"
- ✅ "at a price that sits **below the flagship tier**"
- 若确实要用倍数，必须在同段给出对比对象与价格来源、并标注核对日期。

### 2. 禁用绝对化 / 保证性用词
`guaranteed`、`100% accurate`、`risk-free`、`#1`、`number one`、`best in the world`、`unbeatable`、`miracle`
→ 构建时扫描正文，命中即失败。

### 3. 价格必须带核对日期，且不超过 120 天
页面上的 `as of YYYY-MM-DD` 超过 120 天 → 构建失败。过期价格在 Ads 眼里就是误导性陈述。

### 4. 评分必须可解释
`scoreBreakdown` 四个维度 + 权重，加权结果必须等于总分（已有 schema 校验）。"我们给了 4.2" 必须能回答"凭什么"。

### 5. 未实测必须标明
`sourceType: research` 的页面不得出现 "we tested"、"in our testing" 等表述（已有校验）。实测才有资格用 experience 语言。

### 6. 联盟披露必须在 CTA 附近
决策卡内一行披露 + 页脚完整声明 + `/disclosure/` 页面。三层，缺一不可。

### 7. 不得暗示官方或授权关系
- ❌ "official"、"authorized dealer"、"certified by <品牌>"
- ✅ "manufacturer product image, unmodified"（说明图源即可）

### 8. 投放时不得使用品牌商标作广告文案
关键词可以竞价（视品牌政策），但广告标题/描述里不能写品牌名，也不能暗示关联。部分品牌直营联盟计划**禁止竞价其品牌词**，签约前看条款。

## 三、站点级必备页面（投放审核会逐页看）

| 页面 | 要求 | 状态 |
|---|---|---|
| `/about/` | 说明谁在运营、编辑原则 | ✅ |
| `/contact/` | **真实可收信邮箱**（`example.com` 会被判不真实） | ⚠️ 待替换 |
| `/privacy/` | 收集什么数据、Cookie、Consent Mode、第三方、用户权利 | ✅ |
| `/terms/` | 编辑独立性、价格时效、非专业建议、责任限制 | ✅ |
| `/disclosure/` | 联盟关系、佣金不影响评分 | ✅ |
| `/methodology/` | 评分方法与权重 | ✅ |

## 四、落地页要求（广告流量落在单篇测评页）

- 首屏可见：产品名、评分、价格、CTA（决策卡已满足）
- 首屏可见：一行联盟披露（决策卡内）
- 无弹窗、无插屏、无自动播放
- 移动端可用，LCP 用 eager + fetchpriority
- 正文 ≥500 词，且有独家内容（不是商家文案复述）

## 五、自动化校验

`scripts/qa.mjs` 中的投放就绪检查：

| 检查 | 级别 |
|---|---|
| `/privacy/`、`/terms/` 页面存在 | 硬失败 |
| 页脚含 Privacy / Terms 链接 | 硬失败 |
| 正文出现绝对化用词 | 硬失败 |
| 价格核对日期 >120 天 | 硬失败 |
| 全站出现 `example.com` 占位 | **警告**（上线/投放前必须清零） |

> 警告项在构建日志里以 `!` 开头打印，不阻断部署，但属于发布阻断项。

## 六、投放前 checklist

- [ ] `SITE_EMAIL` 换成真实邮箱，构建日志无 `example.com` 警告
- [ ] 目标页价格核对日期在 120 天内
- [ ] 目标页无绝对化用词、无未标注依据的倍数比较
- [ ] 落地页首屏有评分 / 价格 / CTA / 披露
- [ ] 确认所投关键词不违反品牌联盟计划的商标条款
- [ ] 广告文案不使用品牌商标、不暗示官方关系
- [ ] 落地页 URL 可访问、无重定向链
