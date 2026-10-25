# 主张台账：TOPDON ONE

规则：正文里每一个具体数值，都必须能指回下面某一行。指不回去的，删掉或改成定性表述。

来源代号：
- **L** = Amazon listing 原文（用户提供）
- **P** = 厂商官方产品图（topdon.com）
- **S** = Google Shopping 快照
- **R** = listing 买家评论（仅归纳）
- **F** = Rainforest API 实时查询 Amazon buy box（2026-10-24）
- **C** = 自有测算（写明算式）

| 正文表述 | 值 | 来源 | 备注 |
|---|---|---|---|
| 价格 | $839 | L + F | Rainforest 实时查询 2026-10-24：buy box $839，无促销、无划线价 |
| 年订阅 | $299 | L | |
| 首年含更新 + 2026 促销送第二年 | 2 年 | L | 促销期 10-20 至 12-20 |
| 月成本 | ≈$24.90 | C | 299 ÷ 12 |
| 日成本 | ≈$0.82 | C | 299 ÷ 365 |
| 订阅占购机价 | ≈36% | C | 299 ÷ 839 |
| 3 年总成本 | $1,138 | C | 839 + 299 |
| 5 年总成本 | $1,736 | C | 839 + 299×3 |
| 5 年订阅占比 | 52% | C | 897 ÷ 1,736 |
| 隔年续 5 年 | $1,437 | C | 839 + 299×2 |
| "$0.65/day" 实际对应 | ≈$237/年 | C | 0.65 × 365 |
| 评分 / 评价数 | 4.5 / 314 | F（L 为 313） | 数量每日变动，正文不引用具体数字 |
| 屏幕 | 10.1 英寸 | L | |
| 系统 | Android 12 | L | |
| 服务功能 | 50+ | L | |
| ECU 编码覆盖 | 10 品牌 | L | |
| 协议门槛 | 2013+ BMW、2016+ VW/Volvo、2018+ MB、2020+ GM/Chrysler | L | 覆盖表原文 |
| 尺寸 | 12.24 × 8.15 × 1.54 in | L | |
| 4 年保障计划 | $119.99（占购机价 14.3%） | F | 与制造商保修是不同性质的保障 |
| Complete Protect | $16.99/月 = $203.88/年（24%/年） | F | Amazon 全站订阅，非本品专属 |
| 30 天退换 | 30 天退款或换货 | F | 购买页 return policy |
| 4 年订阅成本 | $598 | C | 299 × 2（促销第 2 年免费） |
| 计划 vs 订阅 | $119.99 vs $598 | C | 差 $478.01；两者保障内容不同，不可直接互换 |
| 4 年保障计划 | $119.99（占购机价 14.3%） | F | 与制造商保修是不同性质的保障 |
| Complete Protect | $16.99/月 = $203.88/年（24%/年） | F | Amazon 全站订阅，非本品专属 |
| 30 天退换 | 30 天退款或换货 | F | 购买页 return policy |
| 4 年订阅成本 | $598 | C | 299 × 2（促销第 2 年免费） |
| 计划 vs 订阅 | $119.99 vs $598 | C | 差 $478.01；两者保障内容不同，不可直接互换 |
| 4.5 分跨变体 | — | R | 评论日期早于上市时间、标题指向另一型号 |

## 已删除的表述（不可核查）

| 原表述 | 删除原因 |
|---|---|
| "roughly half the price of flagship tablets" | 无出处的倍数比较（Ads 不可核查声明） |
| "flagship tablets charge two to three times as much" | 同上 |
| 竞品具体价格 | 未核实，正文只保留定性描述 |

## 复审（2026-10-25 23:55，按真实性红线标准）

### 已核实无误

| 项 | 复核结果 | 来源 |
|---|---|---|
| 价格 $839 | 仍为 $839，无促销、无划线价 | Rainforest 2026-10-25 |
| 退换 | 30 天 refund/replacement | Rainforest |
| 保障计划 | 4 年 $119.99；Complete Protect $16.99/月 | Rainforest |

### 已修（2026-10-26 00:02）

| # | 问题 | 证据 | 建议 |
|---|---|---|---|
| 1 ✅ | **正文从未提及 AutoAuth 每年 $50**，而这是 FCA 2017+ 车主的额外经常性支出——本篇的核心正是"总持有成本" | 一手：`topdon.com/pages/topdon-diagnostic-scanners-re-listed-on-autoauth` | 在成本章节与 FAQ 补一句，口径与 AD600S 那篇一致 |
| 2 ✅ | **未说明 SGW access 依赖有效订阅** | 一手：listing bullet 原文 "**Active updates unlock** Topology Map, ECU Coding, TopFix AI, and **SGW Access**" | 这是订阅依赖的最强证据，应写进正文 |
| 3 ✅ | amazonRating 已从 4.5 漂到 **4.6（315）** | Rainforest 2026-10-25 | 更新 frontmatter 的 `amazonRating` |
| 4 ✅ | 台账里 `F` 的定义重复了一行 | 本文件 | 删重复行 |

### 认证状态（重要，需在正文措辞上体现）

- **TOPDON 的 AutoAuth 认证表（图片，2024-02-28 版）共 23 个型号，不含 "TOPDON ONE"**
- 型号覆盖 Phoenix 系列 / ArtiPad / UltraDiag / ArtiDiag 系列 / TopScan / SmartDiag
- 该表早于 ONE 上市，**不能据此断定 ONE 不支持**，但也**没有产品级认证证据**
- 现有正文的 SGW 表述来源是 **listing 自述（L）**，属二手性质

**结论**：正文措辞应保留"TopDon lists…"这种归属式表述（现状已如此），但**不宜升级为"已认证"**。若日后拿到含 ONE 的新版认证表，再改为事实陈述。

### 本次改动新增的主张

| 正文表述 | 值 | 来源 | 备注 |
|---|---|---|---|
| AutoAuth 年费 | **$50/年 per shop，6 用户，额外 $2/年/人** | **一手**：`topdon.com/pages/topdon-diagnostic-scanners-re-listed-on-autoauth` | 与 AD600S 那篇同一来源，口径一致 |
| 付款主体 | "charged by AutoAuth directly — TOPDON is not involved in any transaction process" | 一手：同上，原文引述 | |
| SGW access 依赖有效订阅 | listing bullet 原文 "**Active updates unlock** Topology Map, ECU Coding, TopFix AI, and **SGW Access**" | **一手（listing 自述）** | 正文表述为"TopDon lists … among the features that active updates unlock" |
| FCA 车型范围 | 2017 年款起，Chrysler(RAM)/Dodge/Jeep/Fiat | 一手：TOPDON 原文"2017 and newer" + 认证表列名 | 与本篇原有"2020+ GM and Chrysler"覆盖表述不冲突：后者是协议覆盖，前者是网关认证 |
| FCA 车主 5 年总成本 | **$1,986** | **测算**：1,736（硬件 + 3 次续费）+ 5 × 50 = 1,986 | 正文已展示算式；仍不含 OEM 编程 token |

### 认证状态的措辞约束（不变）

TOPDON 的 AutoAuth 认证表（2024-02-28 图片，23 型号）**不含 TOPDON ONE**。正文继续用"TopDon lists…"的归属式表述，**不得改写为"已认证"**。若拿到含 ONE 的新版表，再升级为事实陈述。
