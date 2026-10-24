// 对比页发布闸门
//
// 为什么要有这个文件：
// 全组合自动生成对比页会产生 O(n²) 个页面——100 篇同品类 = 4,950 个模板页。
// 这正是 Google spam 政策点名的 "programmatic pages built from templates with
// little unique value"（2026-08 spam update 的重点打击对象）。
//
// 规则：只有在这里登记了人工撰写的差异分析，才会生成对应的 /compare/ 页面。
// 没有登记的配对不生成页面（比生成后 noindex 更好：不浪费抓取预算）。

export interface CompareNote {
  /** 必填，≥120 字符。人工撰写的差异分析：两者真正的取舍是什么，谁该选哪个。 */
  summary: string;
  /** 可选：一句话结论 */
  verdict?: string;
}

/** 键格式：`${a}__vs__${b}`，a / b 为 review slug（顺序不影响查找） */
export const COMPARE_NOTES: Record<string, CompareNote> = {
  // 示例（取消注释并填写真实分析后才会生成页面）：
  // 'autel-mk808__vs__topdon-one': {
  //   summary:
  //     'Both cover full-system diagnostics on 2013+ vehicles, but the money differs: the MK808 charges ' +
  //     'no annual fee and stops receiving coverage updates, while the ONE charges $299 a year and keeps ' +
  //     'warranty coverage tied to the subscription. Choose the MK808 if you service a fixed fleet of older ' +
  //     'cars; choose the ONE if you need J2534 programming and work on late-model networks.',
  //   verdict: 'Fixed older fleet → MK808. Late-model programming → ONE.',
  // },
};

export function getCompareNote(a: string, b: string): CompareNote | undefined {
  return COMPARE_NOTES[`${a}__vs__${b}`] ?? COMPARE_NOTES[`${b}__vs__${a}`];
}
