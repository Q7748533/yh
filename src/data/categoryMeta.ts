// 品类元数据：name + 人工撰写的独特导语（程序化 SEO 防薄内容要求，见方案书 5.3）
// 新增品类时必须在此补充人工导语，缺失时页面构建会告警
export const categoryMeta: Record<string, { name: string; intro: string }> = {
  'automotive-diagnostics': {
    name: 'Automotive Diagnostic Tools',
    intro:
      'Automotive diagnostic tools span $50 code readers to $2,000 flagship tablets, and the gap between them is mostly about bidirectional control, ECU coding and J2534 pass-thru rather than raw scan speed. Our reviews break down what each tier actually delivers: supported protocols, vehicle coverage, software update cadence and the long-term cost of subscriptions. We compare specifications across brands, cross-check them against independent professional feedback, and flag where marketing claims outrun the datasheet. Every comparison on this page is rebuilt from primary spec sheets, so you can see exactly which numbers each claim rests on before spending workshop-grade money.',
  },
};

export function getCategoryMeta(slug: string) {
  return (
    categoryMeta[slug] ?? {
      name: slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      intro: '',
    }
  );
}
