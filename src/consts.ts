// 站点全局常量 —— 上线前替换为真实站点名与描述
export const SITE_NAME = 'The Price Audit';
export const SITE_TAGLINE = 'We check what products actually cost to own';
export const SITE_DESCRIPTION =
  'Independent product reviews that start with the price and end with the total: what a product costs up front, what it costs to keep running, and which claims do not survive the arithmetic.';

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Best of', href: '/best/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'About', href: '/about/' },
];

// 作者署名（E-E-A-T：使用稳定笔名/团队名，见 /about/）
export const AUTHOR_NAME = 'Editorial Team';

// 联系方式与主体信息 —— 投放（Google Ads）审核要求商业信息真实可查
// ⚠️ 上线 / 投放前必须替换为真实邮箱，构建质检会对此发出阻断警告
export const SITE_EMAIL = 'hello@thepriceaudit.com';
export const SITE_LEGAL_NAME = ''; // 可选：公司主体名称
export const SITE_COUNTRY = ''; // 可选：注册地/运营地，如 "Hong Kong, China"
export const POLICY_UPDATED = '2026-10-24';
