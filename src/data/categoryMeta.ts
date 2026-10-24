// 品类元数据：name + 人工撰写的独特导语（程序化 SEO 防薄内容要求，见方案书 5.3）
// 新增品类时必须在此补充人工导语，缺失时页面构建会告警
export const categoryMeta: Record<string, { name: string; intro: string }> = {
  'hair-tools': {
    name: 'Hair Styling Tools',
    intro:
      'Heated brushes, flat irons and steam stylers all promise salon results at home, and the differences that matter are rarely the ones on the box: how the heat reaches the hair, whether the steam is real or decorative, what the tool cannot do, and how much of your morning it actually saves. Our reviews work from manufacturer specifications, current retail pricing and the patterns that recur across thousands of owner ratings, and we separate the measured from the marketed. We are explicit about what we have not tested ourselves, and we publish the arithmetic behind every cost claim.',
  },
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
