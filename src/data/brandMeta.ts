// 品牌页导语：人工撰写，避免品牌页只是标题列表（薄内容）
// 新增品牌时在此补充；缺失时页面仍可渲染，但会被提示补写
export const brandMeta: Record<string, { name: string; intro: string }> = {
  topdon: {
    name: 'TopDon',
    intro:
      'TopDon sells diagnostic hardware at the lower end of the professional price range, and its differentiator is bundling: pass-thru interfaces, topology mapping and coding that other brands sell as separate tiers. The trade-off shows up in software maturity and in how subscriptions are structured. Our coverage tracks both — what the hardware delivers on paper, and what it costs to keep working in year two.',
  },
  wavytalk: {
    name: 'wavytalk',
    intro:
      'wavytalk builds heated styling tools aimed at thick and coily hair, at prices well below the salon-brand tier. The product line overlaps heavily — several brushes share a body and differ mainly in heat range and steam — so the useful question is which model fits your texture, not which one is newest. Our coverage compares the claims against the manual, the markings on the device, and what owners report after months of use.',
  },
};

export function getBrandMeta(slug: string) {
  return (
    brandMeta[slug] ?? {
      name: slug,
      intro: '',
    }
  );
}
