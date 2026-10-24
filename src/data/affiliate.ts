// 推广链接集中配置 —— 换链接、换联盟网络、加追踪参数，只改这个文件，不用动文章
//
// key   = Amazon ASIN（文章 frontmatter 里的 amazonAsin）
// url   = 联盟网络给的中转链接（当前是 Amazon MaaS 追踪链接）
// note  = 备注，方便日后对照是哪款产品
//
// 新增产品时：把 ASIN 和链接加进来即可，文章的 CTA 会自动指向它。
// 文章 frontmatter 里的 affiliateUrl 若存在则优先使用（用于临时覆盖）。

export interface AffiliateEntry {
  url: string;
  note?: string;
}

export const AFFILIATE_LINKS: Record<string, AffiliateEntry> = {
  B0GK9G6YDL: {
    url: 'https://pwiz.co/go/qv2hsrwaf5rbxvht',
    note: 'TOPDON ONE 双向诊断仪',
  },
  B0DCK8P752: {
    url: 'https://pboost.me/G5Xsuvnt?uid=7748533',
    note: 'Wavytalk Steamline Pro 蒸汽直发梳',
  },
};

/**
 * 取某款产品的推广链接。
 * 优先用文章里显式写的 affiliateUrl（临时覆盖），否则按 ASIN 查表。
 * 两者都没有时返回 undefined，由调用方决定降级行为（不渲染 CTA 按钮）。
 */
export function affiliateUrlFor(asin: string | undefined, override?: string): string | undefined {
  if (override) return override;
  if (!asin) return undefined;
  return AFFILIATE_LINKS[asin]?.url;
}

/** 供质检使用：当前已登记的产品数量 */
export const AFFILIATE_COUNT = Object.keys(AFFILIATE_LINKS).length;
