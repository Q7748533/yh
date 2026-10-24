// 评分卡图生成器：把测评数据渲染成 1200×630 的白底数据卡 SVG
// 用途：每篇独立的 OG 图 + Product schema 的 image + 无产品图时的正文配图

export interface ScorecardData {
  brand: string;
  product: string;
  rating: number;
  priceUsd?: number;
  priceCheckedAt?: Date;
  updatedAt: Date;
  sourceType: 'tested' | 'research';
  specs: Record<string, string>;
  siteName: string;
}

const FONT = 'Arial, Helvetica, sans-serif';

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = next;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function starPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.42;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return `M${points.join('L')}Z`;
}

function stars(rating: number, rightEdge: number, y: number): string {
  const size = 13;
  const gap = 34;
  const startX = rightEdge - (4 * gap + size);
  let out = '';
  for (let i = 0; i < 5; i++) {
    const cx = startX + i * gap;
    out += `<path d="${starPath(cx, y, size)}" fill="#E2E8F0"/>`;
    const fill = Math.min(1, Math.max(0, rating - i));
    if (fill >= 1) {
      out += `<path d="${starPath(cx, y, size)}" fill="#F59E0B"/>`;
    } else if (fill >= 0.5) {
      const clipId = `half-${i}`;
      out += `<clipPath id="${clipId}"><rect x="${cx - size}" y="${y - size}" width="${size}" height="${size * 2}"/></clipPath>`;
      out += `<path d="${starPath(cx, y, size)}" fill="#F59E0B" clip-path="url(#${clipId})"/>`;
    }
  }
  return out;
}

export function buildScorecardSvg(data: ScorecardData): string {
  const titleLines = wrap(data.product, 22, 2);
  const specEntries = Object.entries(data.specs).slice(0, 3);
  const specText = specEntries.map(([k, v]) => `${k}: ${v.length > 26 ? `${v.slice(0, 24)}…` : v}`);
  const checked = (data.priceCheckedAt ?? data.updatedAt).toISOString().slice(0, 10);
  const updated = data.updatedAt.toISOString().slice(0, 10);

  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<text x="64" y="${208 + i * 62}" font-family="${FONT}" font-size="54" font-weight="bold" fill="#0F172A">${esc(line)}</text>`
    )
    .join('');

  const specsTop = 208 + (titleLines.length - 1) * 62 + 72;
  const specsSvg = specText
    .map(
      (line, i) =>
        `<text x="64" y="${specsTop + i * 30}" font-family="${FONT}" font-size="19" fill="#475569">${esc(line)}</text>`
    )
    .join('');

  const verdict = data.rating >= 4 ? 'Recommended' : data.rating >= 3 ? 'Buy with caveats' : 'Not recommended';
  const pillY = specsTop + specText.length * 30 + 22;
  const pillW = verdict.length * 10.5 + 44;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <rect x="24" y="24" width="1152" height="582" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
  <rect x="24" y="24" width="8" height="582" rx="4" fill="#F59E0B"/>

  <text x="64" y="110" font-family="${FONT}" font-size="22" font-weight="bold" fill="#1D4ED8" letter-spacing="2">${esc(
    data.brand.toUpperCase()
  )}</text>

  ${titleSvg}
  ${specsSvg}

  <rect x="64" y="${pillY}" width="${pillW}" height="42" rx="21" fill="#FEF3C7"/>
  <text x="${64 + pillW / 2}" y="${pillY + 27}" font-family="${FONT}" font-size="19" font-weight="bold" fill="#92400E" text-anchor="middle">${esc(
    verdict
  )}</text>

  <line x1="64" y1="486" x2="1136" y2="486" stroke="#E2E8F0" stroke-width="2"/>
  <text x="64" y="540" font-family="${FONT}" font-size="18" font-weight="bold" fill="#0F172A">${esc(data.siteName)}</text>
  <text x="64" y="570" font-family="${FONT}" font-size="16" fill="#64748B">${
    data.sourceType === 'tested' ? 'Hands-on tested' : 'Research-based'
  } · updated ${updated}</text>

  <text x="1136" y="300" font-family="${FONT}" font-size="140" font-weight="bold" fill="#0F172A" text-anchor="end">${data.rating.toFixed(
    1
  )}</text>
  <text x="1136" y="344" font-family="${FONT}" font-size="26" fill="#94A3B8" text-anchor="end">out of 5</text>
  <g>${stars(data.rating, 1136, 156)}</g>

  <text x="1136" y="424" font-family="${FONT}" font-size="40" font-weight="bold" fill="#0F172A" text-anchor="end">${
    data.priceUsd !== undefined ? `$${data.priceUsd.toFixed(0)}` : ''
  }</text>
  <text x="1136" y="454" font-family="${FONT}" font-size="16" fill="#94A3B8" text-anchor="end">price checked ${checked}</text>
</svg>`;
}
