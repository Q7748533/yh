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

export interface BuyLink {
  url: string;
  /** true = 联盟链接（需 rel="sponsored" + 佣金披露）；false = 厂商官网等中性链接 */
  isAffiliate: boolean;
  label: string;
}

/**
 * 决定某篇文章的购买入口。
 * 优先级：联盟链接 > 厂商官网 > 无入口（不渲染按钮）
 * 拿不到联盟链接的竞品照常评测，只是不带佣金——页面会明写这一点。
 */
export function buyLinkFor(args: {
  asin?: string;
  affiliateUrl?: string;
  manufacturerUrl?: string;
  brand: string;
}): BuyLink | undefined {
  const affiliate = affiliateUrlFor(args.asin, args.affiliateUrl);
  if (affiliate) {
    return { url: affiliate, isAffiliate: true, label: 'Check price on Amazon' };
  }
  if (args.manufacturerUrl) {
    return { url: args.manufacturerUrl, isAffiliate: false, label: `Visit ${args.brand}` };
  }
  return undefined;
}
