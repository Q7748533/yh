// 把 OG 图从 SVG 栅格化为 PNG（社交平台不渲染 SVG）
// 用法：npm run og
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const svg = readFileSync('public/og-default.svg');

await sharp(svg, { density: 200 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile('public/og-default.png');

console.log('已生成 public/og-default.png (1200x630)');
