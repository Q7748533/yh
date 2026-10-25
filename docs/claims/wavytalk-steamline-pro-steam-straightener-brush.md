# 主张台账：Wavytalk Steamline Pro

规则：正文里每一个具体数值，都必须能指回下面某一行。指不回去的，删掉或改成定性表述。

来源代号：
- **L** = 用户提供的 Amazon listing 原文
- **A** = Amazon 购买页区块（退换货 / 商品支持 / 保障计划，用户 2026-10-24 提供）
- **P** = 厂商官方产品图（wavytalk.com CDN，B390 系列）
- **S** = Google Shopping 快照（2026-10-24，US，跨零售商）
- **F** = Rainforest API 实时查询 Amazon buy box（2026-10-24）
- **R** = listing 上的买家评论（仅归纳，不引原句）
- **C** = 自有测算（写明算式）

| 正文表述 | 值 | 来源 | 备注 |
|---|---|---|---|
| 现价（Amazon buy box） | **$63.82** | F | 实时查询 2026-10-24；页面决策卡展示此价 |
| 原价 / 划线价 | **$99.97** | F | 与 36% off 一致：99.97 × 0.64 ≈ 63.98 |
| 促销类型 | "Limited time deal" | F | 促销结束后回到 $99.97，成本测算需按两行展示 |
| 零售参考价 | $89（Target $88.99 / Ulta $89） | S | 跨零售商快照，**与 Amazon 现价不同**，仅作参考 |
| 四档温度（机身） | 410 / 380 / 350 / 320°F | P | 放大官方图可读 |
| 四档温度（文案） | 325–410°F | L | 与机身冲突，正文已并列两处 |
| 蒸汽速率 | 0.5 ml/min | L | "Hair Hydration" 段 |
| 30 分钟耗水量 | ≈15 ml | C | 0.5 × 30 |
| 全头耗时（厂商） | 10–15 min | L | "Faster Straightening" 段 |
| 评分 / 评价数 | 4.4 / 5,531 | F（L 为 5,527） | 数量每日变动，正文不引用具体数字 |
| 重量 | 约 1.15 lb | L | "Directions" 第 5 条 |
| 电压 | 100–240V，US 极性插头 | L | "Other Features" / "Safety Information" |
| 自动关机 | 30 min | L | "Other Features" |
| 型号 / ASIN | B390 / B0DCK8P752 | L | |
| 细软发建议温度 | ≤320°F | L | "Safety Information" |
| 制造商保修期 | **1 年标准，注册后 +12 个月 = 2 年** | **一手：`wavytalk.com/pages/register-for-a-warranty` 原文** | **2026-10-26 复审纠正**：原写"未公布"是错的——Amazon listing 没写，但厂商官网公布了 |
| 30 天退换 | 免费退款或换货 | A | "FREE 30-day refund/replacement" |
| 2 年保障计划 | $6.99 **一次性** | A + F | Rainforest 亦返回该字段，交叉验证一致；非每月 |
| 3 年保障计划 | $8.99 **一次性** | A + F | 同上；占促销价 14.1%、占原价 9.0% |
| Complete Protect | $16.99/**月** = $203.88/年（购机价的 229%/年） | A + C | 16.99 × 12；÷ 89；唯一按月计费项 |
| 3 年含计划（按促销价） | $72.81 → ≈$24/年 | C | (63.82 + 8.99) ÷ 3 = 24.27 |
| 3 年含计划（按原价） | $108.96 → ≈$36/年 | C | (99.97 + 8.99) ÷ 3 = 36.32 |
| 需补水 2–4 次 | 2–4 | R | 一位买家 4 箱、一位"a couple of times" |
| 单次 45 分钟 | 45 min | R | 同一位买家 |
| 25 分钟 → 8 分钟 | 25 → 8 min | R | 买家自述，非实测 |
| 4 小时 → 1.5–2 小时 | 4 h → 1.5–2 h | R | 买家自述，非实测 |
| 四项百分比 | 101% / 77% / 62% / 27% | L | 原文引用，正文指出无测试方法 |
| 盒内清单 | 机身、手套、2 夹、清洁刷、水瓶、发圈 | L + P | "2 夹"来自包装图 |

## 修正记录

| 原表述 | 问题 | 处理 |
|---|---|---|
| "无订阅" 作为卖点 + 三年成本平线图 | 该品类本无订阅，属无信息量套话 | 删除，改为"买断价即全部价格" |
| "break-even arrives quickly" vs 沙龙 | 未核实沙龙价格 | 删除，改为"未做该测算" |
| 蒸馏水 "costs very little" | 未核实水价 | 改为定性表述 |
| "listing does not publish a warranty period"（结论式） | 只看了 listing 文本，没看购买页 | 改为"listing 未公布制造商保修期"，并补上 30 天退换与三档保障计划的实测价格 |
| 买家评论被写成汽车语境用词 | 汽配模板残留（美发工具的 owner 是买家） | 全文统一为"买家评论" |
| 2 年 / 5 年寿命假设下的 $45 / $18 | 寿命是凭空假设 | 删除，改用有出处的 3 年计划摊销 |
| 单点价格 $89（来自 Google Shopping） | 跨零售商快照，不是 Amazon 实时价；且当时正在打折 | 改为双价：现价 $63.82 + 原价 $99.97，成本测算按两行展示 |

## 复审（2026-10-26 00:10，按真实性红线标准）

### 已核实无误

| 项 | 复核结果 | 来源 |
|---|---|---|
| 现价 $63.82 / 原价 $99.97 / 36% off | 促销仍在，价格未变 | Rainforest 2026-10-26 |
| 保障计划 $6.99（2 年）/ $8.99（3 年）/ Complete Protect $16.99/月 | 未变 | Rainforest 2026-10-26 |
| 评分 4.4 | 5,531 → 5,536（正文不引用具体条数） | Rainforest 2026-10-26 |
| 无绝对化措辞、无未核实竞品对比 | 扫描通过 | 全文 grep |

### 已修（一处事实错误）

**原表述**：`no published manufacturer warranty` / "The product listing does not state a manufacturer warranty period"

**问题**：Amazon listing 确实没写，但**厂商官网公布了**——`wavytalk.com/pages/register-for-a-warranty`：

> "All of our products come with a **standard one-year warranty** but by registering your product, you will receive an **additional free 12-month extended warranty**."

**后果**：原文把"$8.99 三年计划"说成"补上保修缺口"，前提是错的。实际是厂商覆盖 1–2 年，计划买的是第 3 年。

**修法**：
- 正文改为先陈述厂商保修（1 年 + 注册延长 12 个月），再讲购买页的三层保障
- 补一条真实的、可核查的不确定性：官网要求提供 product number 与 order number，但**未说明 Amazon 订单是否适用**
- verdict 改为"a warranty that only reaches two years if you register and may not cover an Amazon order at all"
- FAQ 同步重写

**教训**：**"未公布"是缺席断言，必须查过所有一手渠道才能写。** 只查 Amazon listing 就断言"厂商没公布保修"，是典型的不完整取证。
