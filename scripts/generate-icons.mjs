/**
 * Generates PWA icons as SVGs and converts them to PNG via Canvas API (Node.js).
 * Run: node scripts/generate-icons.mjs
 *
 * If you don't have canvas installed you can use the SVG files directly
 * or use an online converter. The SVGs are created in public/icons/.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.join(__dirname, '../public/icons')
fs.mkdirSync(iconsDir, { recursive: true })

const sizes = [192, 512]

for (const size of sizes) {
  const fontSize = Math.round(size * 0.36)
  const radius = Math.round(size * 0.22)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0099cc;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>
  <text
    x="50%" y="50%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="${fontSize}"
    font-weight="900"
    fill="#1a1a2e"
    letter-spacing="-2"
  >CA</text>
</svg>`

  const svgPath = path.join(iconsDir, `icon-${size}.svg`)
  fs.writeFileSync(svgPath, svg)
  console.log(`✓ Created ${svgPath}`)
}

console.log('\nSVG icons created. To use as PNG, either:')
console.log('  1. Use the SVG files directly (change manifest to .svg)')
console.log('  2. Open in browser and screenshot')
console.log('  3. Install sharp: npm i -D sharp, then run convert script')
