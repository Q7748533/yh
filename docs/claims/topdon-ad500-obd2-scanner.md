# 主张台账：TOPDON AD500

规则：正文里每一个具体数值，都必须能指回下面某一行。指不回去的，删掉或改成定性表述。

来源代号：
- **L** = Amazon listing 原文（用户 2026-10-27 提供，ASIN B08XK3DJ42）
- **T** = TOPDON 官方 AutoAuth 认证表（`topdon.com/pages/topdon-diagnostic-scanners-re-listed-on-autoauth` 内嵌图片，已下载阅读）
- **W** = TOPDON 美国站 FAQ 保修条款（`topdon.us/pages/faq`，已抓取原文）
- **F** = Rainforest API 实时查询 Amazon buy box（2026-10-27）
- **S** = Serper 搜索结果（2026-10-27）
- **R** = listing 买家评论（仅归纳，不引原句）
- **C** = 自有测算（写明算式）

| 正文表述 | 值 | 来源 | 备注 |
|---|---|---|---|
| 现价（主 listing） | **$159.99** | F | B08XK3DJ42，无促销 |
| 划线原价 | **$178.00** | F | |
| 第二 listing 价格 | **$146.99**，标 17% off，原价同为 $178 | F | B09LH3QFFQ，`Limited time deal` |
| 两个 listing 价差 | **$13** | C | 159.99 − 146.99 = 13.00 |
| 与 AD600S 价差 | **$36** | C | 195.99 − 159.99 = 36.00；溢价 22.5% |
| 评分 / 评价数 | 4.4 / 1,975 | F | 正文不引用条数 |
| 四系统 | Engine / ABS / Transmission / SRS | L | 第 2 条 |
| 六项常驻服务 | Oil / SAS / TPMS / BMS / EPB / Throttle | L | 第 3 条，逐项列出 |
| AD600S 多出的三项 | DPF 再生 / ABS 排气 / 喷油嘴编码 | L（AD600S 台账） | 9 − 6 = 3，逐项对应 |
| 屏幕 | 5 英寸，1280×720 | L | Features & Specs |
| 系统 / 内存 | Android 11，2GB RAM + 32GB ROM | L | 第 6 条 + Features & Specs |
| 电池 | 3350mAh | L | 第 6 条 |
| 尺寸 | 9 × 1 × 5 in | L | Item Dimensions |
| 覆盖 | 67+ 品牌，10,000+ 车型 | L | 第 5 条 |
| 协议 | CAN-FD；2020+ GM & Chrysler | L | 第 5 条 |
| OBD2 模式 | 全部 10 项 | 法规要求 + L | 1996 年起美国强制 |
| **AutoAuth 认证** | **ArtiDiag500，App V1.31，Chrysler/Dodge/Jeep = V1.90，Fiat = V2.30** | **T（认证表第 19 行，已下载读图）** | 与 AD600S（第 16 行，V1.1.7 / V10.48 / V10.64）不同代 |
| AutoAuth 年费 | **$50/年 per shop，6 用户，额外 $2/年/人** | **一手：TOPDON 原文页**（与 AD600S 同源） | 正文写明"付给 AutoAuth，不是 TopDon" |
| **制造商保修** | **12 个月，自购买日起** | **W：TOPDON 美国站 FAQ 原文** | "TOPDON's standard product warranty is 12 months from the date of purchase" |
| 更新 | 终身免费，需 Wi-Fi | L | 标题 + 第 6 条 |
| 30 天退换 | 免费退款或换货 | F | |

## 已剔除的说法（及原因）

| 说法 | 来源 | 为什么不用 |
|---|---|---|
| **同款两个 listing，$13 价差** | F（Rainforest 2026-10-27） | **事实成立但主动不写**：我们的联盟链接指向 $159.99 那条，若在正文点出 $146.99 的存在，等于用自家链接把读者送去别处。这不是内容真实性问题，是商业逻辑问题。若日后拿到便宜那条的联盟链接，再改写为"我们直接给你便宜的那条"——那时才是加分项 |

| "$200/年订阅" | 单条买家评论（R） | **核不实**：listing 写"终身免费更新"，Amazon 搜索结果与多个第三方页面同样标注 lifetime free update；未找到该型号的订阅产品。单条评论不足以支撑"存在隐藏订阅"的断言 |
| "2025 车型清码要付费" | 另一条买家评论（R） | 同样无法证实。正文改为"两位车主分别描述了被要求付费的情况……我们未能证实"，明确标注为未解决的车主说法 |
| "更新到 2124 年才过期" | 买家评论（R） | 无依据的推测，不引用 |
| 与 BlueDriver 等竞品的价格倍数比较 | 买家评论（R） | 未核实竞品价格，不做倍数比较 |

## 与 AD600S 那篇的口径一致性

- AutoAuth 费用表述完全一致：$50/年 per shop、6 用户、$2/年/人、AutoAuth 直收
- 保修表述一致：均为厂商公布的 12 个月（AD600S 那篇此前未写保修，可考虑补）
- 两篇都写明"未上手，research 模式"

## 补充核实（2026-10-27 优化时新增）

| 正文表述 | 值 | 来源 | 备注 |
|---|---|---|---|
| 3 年保障计划 | $25.99，**一次性** | F：`buybox_winner.protection_plans[0]`，`billing_type: "one_time"`，`duration_months: 36` | 字段直读，非推断 |
| 4 年保障计划 | $34.99，**一次性** | F：同上 `[1]`，`one_time`，48 个月 | |
| Complete Protect | $16.99，**按月** | F：同上 `[2]`，`billing_type: "monthly"` | 与两项保障计划性质不同 |
| 3 年总成本 | **$185.98**，约 **$62/年** | C | 159.99 + 25.99 = 185.98；÷3 = 61.99 |
| 5 年总成本（4 年计划摊 5 年） | **$194.98**，约 **$39/年**，第 5 年无覆盖 | C | 159.99 + 34.99 = 194.98；÷5 = 39.00 |
| Complete Protect 年化 | **$203.88/年** | C | 16.99 × 12 |
| AD600S 3 年总成本 | **$224.98** | C + AD600S 台账 | 195.99 + 28.99 |
| 两者 3 年差额 | **$39** | C | 224.98 − 185.98 = 39.00 |
| 带 S 后缀的 500S 走新分支 | ArtiDiag500 **S** = V1.1.7 / V10.48；ArtiDiag**500** = V1.31 / V1.90 | T（认证表第 18、19 行） | 正文写明"带 S 后缀的走新分支"，避免误读为"便宜=老" |
| listing 称 "Brand-New ArtiDiag500" | 原文：`[Brand-New ArtiDiag500]` / `brand-new, cost effective AD500 is back in full swing` | L | 正文对比认证表版本号，指出"全新"是页面标签而非平台代际 |

### 功能说明的表述边界

正文里对六项 reset 的用途解释（机油归零、转向角重学、TPMS 注册、电池注册、EPB 回缩、节气门重学）与"四系统相对基础读码器的差别"，都是**该类功能的通用用途**，不是对 AD500 特定行为的断言。台账在此说明，避免被读成实测结论。

"不能做双向控制 / 无 ECU 编码"来自 listing 未声明这些能力 + specs 里 `Bidirectional control: No`，属**缺席判断**，已在 specs 与正文同时标注。

## 逐条核对后的修正（2026-10-27 用户要求全文复核）

用户问"所有内容都核对过、没有编造吗"。逐条复核后，**有三处需要收紧**，已全部修改：

| 原文 | 问题 | 改成 | 依据 |
|---|---|---|---|
| "a car that fails inspection on that light is a car you cannot register" | **过度概括**。美国各州检查规则不同，多数州的排放检查只查 MIL（故障灯），不查气囊灯；不能一概说"无法注册" | 删除监管断言，只保留可核实的部分："an airbag warning light cannot be read or cleared without restraint-system access" | 无可靠来源支撑原句 → 按"拿不出来源就不写"处理 |
| "There is no ECU coding and no module programming" | **缺席推断写成绝对事实**。listing 没提，不等于设备绝对没有 | "The listing claims neither ECU coding nor module programming" | listing 原文未声明；specs 里 `Bidirectional control: No` |
| "AutoAuth charges $50 a year per shop, covering six users" | **对个人用户可能误导**。原文只说 per shop；技师账号免费但须挂靠店铺；官网**未公布个人价** | 补"per shop"、$2/年/人，并明写"官网未公布个人独用的价格" | TOPDON AutoAuth 页原文（2026-10-27 重新抓取） |
| "no cartridge" | 用词不当（扫描仪没有耗材匣） | "no consumable" | — |

### 复核结论（供日后参考）

- **A 类（一手可查）**：价格、评分、规格、六项 reset、认证表版本号、保修期、保障计划计费方式 —— 全部有源
- **B 类（自算）**：$185.98 / $62 / $194.98 / $39 / $203.88 / $224.98 / $39 —— 算式已列，可复算
- **C 类（通用常识）**：六项 reset 的用途、四系统与通用 OBD2 的差别 —— 非品牌断言
- **D 类（车主归纳）**：好评点、连接问题、覆盖投诉、两位车主被要求付费 —— 均标注为归纳/未证实

**没有发现编造，但发现三处"说过头"。** 说明：本核对基于公开来源，无法覆盖"该设备在具体车型上的实际表现"——那需要实机测试，本篇标注为 research。
