import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.join(__dirname, '../public/icons')

const sizes = [192, 512]

for (const size of sizes) {
  const svgPath = path.join(iconsDir, `icon-${size}.svg`)
  const pngPath = path.join(iconsDir, `icon-${size}.png`)

  if (!fs.existsSync(svgPath)) {
    console.error(`SVG not found: ${svgPath}`)
    continue
  }

  await sharp(svgPath)
    .resize(size, size)
    .png()
    .toFile(pngPath)

  console.log(`✓ Created ${pngPath}`)
}

console.log('Done! Icons generated in public/icons/')
