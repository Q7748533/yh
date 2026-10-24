# 多品类优先级分析（2026-10-24，SERP 实测）

三个候选品类各 5 个同构查询（头部 / 人群 / 价格 / 单品测评 / 值不值），Google 美国站前 10。
原始数据：`docs/serp-categories.md`

## 一、先修正一个判断误差

脚本的自动判定（"可直接竞争 / 需要经验信号"）只统计**结果类型**，不看**具体是谁**。这会误判：

- 美发工具被判定"可直接竞争"（媒体占 6/9），但那 6 个是 allure、instyle、byrdie、nytimes、marieclaire、theguardian——**大刊编辑部**，有测评实验室。
- 汽车诊断被判定"需要经验信号"（论坛/视频占多数），但**独立编辑内容几乎真空**——这可能是机会，也可能是"用户就想要社区答案"。

所以下面按"前排是谁"重新判断。

## 二、三个品类的真实格局

### 咖啡机

| 词 | 前排 |
|---|---|
| best espresso machine | coffeegeek.com、coffeechronicler.com、wholelattelove.com、seriouseats.com、nytimes.com |
| best espresso machine for home | coffeegeek、coffeechronicler、wholelattelove、nytimes、seattlecoffeegear |
| best espresso machine under 1000 | coffeechronicler、wholelattelove、seriouseats、homecoffeeexpert、coffeeness.de |
| breville barista express review | coffeegeek、brewingwithdani、everydaypeoplecoffeeandtea、homegrounds、techgearlab |
| breville barista express worth it | **reddit ×2、quora ×2**、coffeegeek |

**判断：中等，可进中尾。**
头部被垂直专家站（coffeegeek 等，十几年的站）和大刊占住，短期抢不动。但**中尾层有明显的中型独立站**（brewingwithdani、coffeekev、shedlightcoffee、everydaypeoplecoffeeandtea）——这是"能进来"的直接证据。"worth it"类词由 Reddit/Quora 主导，说明决策意图处仍缺权威编辑内容。

### 美发工具

| 词 | 前排 |
|---|---|
| best hair dryer | allure、amazon、nytimes、target、livinginyellow |
| best hair dryer for fine hair | instyle、reddit、allure、amazon、nytimes |
| best hair dryer under 200 | byrdie、instyle、reddit、thesmallthingsblog、amazon |
| dyson supersonic review | **reddit ×2、quora**、thenewknew、organicbeautylover |
| dyson supersonic worth it | **reddit ×2、facebook ×2**、thenewknew |

**判断：头部最难，中尾尚可。**
头部全是大刊（allure / instyle / byrdie / NYT / Marie Claire / Guardian），有测评预算和 DR 80+。这类对手新站基本无法正面竞争。
但"Dyson 值不值"这类词由 Reddit/Facebook 主导，且有几个生活方式博客（thenewknew、organicbeautylover）在排——说明中尾有缝。
**问题：我们的差异化（持有成本）在这个品类几乎用不上。** 吹风机是一次性购买，没有订阅、耗材极少。

### 汽车诊断工具

| 词 | 前排 |
|---|---|
| best bidirectional scan tool | caranddriver、**reddit**、amazon、**youtube**、bobistheoilguy |
| best diagnostic scan tool for mechanics | **reddit ×2**、topdon.us、justanswer、caranddriver |
| best scan tool under 500 | **reddit**、**facebook**、caranddriver、**youtube**、topdon.us |
| topdon one review | **youtube ×2、topdon 官方社区、facebook**、amazon |
| topdon one worth it | topdon.us、**reddit ×2、facebook、youtube** |

**判断：编辑内容真空，但意图偏社区。**
独立编辑媒体只有 caranddriver / roadandtrack 两家，其余全是论坛、视频、品牌站。**这是三个品类里编辑竞争最弱的。**
但同时它也是**最"社区驱动"**的：用户明显想看真人经验而不是编辑测评。我们的 research 型内容（无实测）在这里最吃亏。

## 三、横向对比

| 维度 | 咖啡机 | 美发工具 | 汽车诊断 |
|---|---|---|---|
| 头部词竞争者 | 垂直专家站 + 大刊 | **大刊垄断** | 汽车媒体 + 论坛/视频 |
| 中型独立站能否进入 | **能（多个实例）** | 能（生活方式博客） | 很少（仅专业站） |
| 与我们"持有成本"定位的契合 | **高**（除垢、滤芯、胶囊、密封圈） | **低**（一次性购买） | **高**（软件订阅） |
| 产品数据可得性 | 高（规格/价格公开） | 高 | 中（覆盖表不透明） |
| 客单价 | 中高（$300–2,000） | 低中（$50–400） | 高（$300–2,000） |
| 结论 | **最适合起步** | 最后考虑 | 保留，但换角度 |

## 四、建议

**第一垂直：咖啡机（12 篇）**
理由：中尾层已有中型独立站证明"能进"；持有成本角度真实存在（除垢剂、滤芯、胶囊、密封圈、保修）；客单价不低；产品数据好拿。

**第二垂直：汽车诊断（保留现有 1 篇，只做成本角度）**
不碰 `best X` 头部词，专打 `subscription cost` / `without subscription` / `running cost` 这类约束型查询——那里没有编辑竞争者，而我们有独家算术。等有 3 篇以上再考虑品类页。

**第三垂直：美发工具（暂缓）**
大刊垄断头部，且我们的差异化用不上。除非找到"耗材/替换件成本"的具体切口（比如滤网、涂层寿命），否则不做。

**结构上仍走单站分区**（`/coffee/`、`/auto/`、`/hair/`），垂直区不足 3 篇不开 hub，避免 noindex 空转。

## 五、数据局限

- 只查了 Google 美国站自然结果，未含 AI Overview、Shopping 广告位、搜索量。
- 客单价区间是常见区间，实际佣金率需按你的 Associates 后台核算。
- "能否进入"是基于"有没有中型独立站在排"的推断，不是保证。
