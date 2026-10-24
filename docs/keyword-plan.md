# 关键词与选题计划（基于 2026-10-24 SERP 实测）

数据来源：`docs/serp-report.md`（18 个关键词，Google 美国站前 10 条自然结果）

## 一、核心发现

**1. 这个品类的 SERP 被"经验型内容"占据，不是被测评站占据。**
18 个词里只有 1 个是"可直接竞争"（`best diagnostic scan tool for mechanics`）。其余前排是 YouTube 视频、Reddit 帖、Facebook 群组、品牌官网。典型如 `topdon one review`：前 10 名**没有任何独立测评媒体**，全是视频 + 官方社区 + 群组 + Amazon。

**2. 品类词前排是大站的"实测"内容，纯研究型打不过。**
`best bidirectional scan tool` 第 1 名是 Car and Driver 的 "Best OBD-II Scanners for 2026, **Tested**"，第 2 名 Reddit，第 5 名 BobIsTheOilGuy 论坛。没有实物测试，这类词基本无解。

**3. 相关搜索暴露了真正的需求缺口：订阅焦虑。**
- `best bidirectional scan tool without subscription`
- `DIY scan tool recommendations that don't require an ongoing license`

这是本品类最集中的痛点，而**大站不写**（他们靠实测，不核算持有成本），**品牌方更不会写**（对他们不利）。

**4. 我们的独家数据正好压在这个缺口上。**
现有 TOPDON ONE 测评里的订阅算术（$0.65/day vs $299/年、保修绑订阅、5 年订阅占 52%）是全网独立媒体都没有的信息。

## 二、选题优先级

### P0 — 立刻做（有独家数据 + SERP 无独立媒体占位）

| 选题 | 依据 |
|---|---|
| **"Scan tools without a subscription: what you actually pay over 5 years"** | 相关搜索明确存在该需求；SERP 无独立媒体做核算；可复用现有成本模型 |
| **`topdon one subscription cost` 独立页/长文** | 该词 SERP 是 brand 4 + publisher 3，但 publisher 全是电商页，无一家解释条款 |

### P1 — 做"信息型"版本（不依赖实拍）

| 选题 | 依据与做法 |
|---|---|
| `topdon one problems` | 论坛主导（forum 4 / video 2），意图是排查而非购买。做法：官方公告 + 论坛高频问题汇总，标注"基于车主反馈"，不引原文 |
| `topdon one worth it` | forum 5，纯决策意图。做法：决策框架 + 成本测算，比"优缺点罗列"更有用 |
| `topdon one for ford` | 混合场，品牌站占首。做法：福特/FCA 的 SGW、AutoAuth 门槛讲清楚 |

### P2 — 等规模

| 选题 | 门槛 |
|---|---|
| `best diagnostic scan tool for mechanics` | 唯一绿灯词，但需要 ≥3 篇测评才能做真横评 |
| `topdon one vs autel mk808` 等对比词 | 需要第二个产品的完整数据 + 人工对比分析（写进 `compareNotes.ts`） |

### 不建议做

- `best bidirectional scan tool` / `best obd2 scanner with ecu coding`：Car and Driver、Road & Track 的 "Tested" 内容占前排，无实测能力无法竞争。
- 任何 `best X` 类头部词，在拿到实测能力之前不做。

## 三、方法论结论

**把"持有成本核算"做成站点的标志性栏目。**

理由三条：
1. 需求真实存在（相关搜索直接证明）；
2. 竞争空白（大站不做、品牌方回避）；
3. 我们有方法可复制——订阅价、保修条款、耗材、必要配件，任何带订阅的产品都能算，且算出来的数字是原创的、可被引用的。

这比"再写十篇参数对比"更符合站点定位：**别人写"它有什么功能"，我们写"它要花你多少钱"**。

## 四、复现方式

```bash
node --env-file=.env scripts/serp.mjs          # 有缓存则直接分析，不消耗额度
node --env-file=.env scripts/serp.mjs --force  # 强制重新查询
```

输出：`docs/serp-report.md`（报告）+ `.serp-cache/*.json`（原始数据，已 gitignore）

> 数据局限：Serper 未返回 AI Overview 字段，因此**无法判断这些词是否触发 AI 摘要**；如需该维度，需换支持 AI Overview 的数据源，或人工核查。
