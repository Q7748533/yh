export function absoluteUrl(site: URL | undefined, path: string): string {
  const base = site ?? new URL('https://example.com');
  return new URL(path, base).href;
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function truncate(text: string, max = 155): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

export function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// 集合 id 可能带 .mdx 后缀，URL 中统一去除
export function reviewSlug(id: string): string {
  return id.replace(/\.mdx?$/, '');
}
