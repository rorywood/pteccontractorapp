import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logo = path.join(__dirname, '../public/logo.jpg')
const iconsDir = path.join(__dirname, '../public/icons')

// App icons (square, used for home screen / APK launcher)
for (const size of [192, 512]) {
  const logoSize = Math.round(size * 0.8)
  const padding  = Math.round((size - logoSize) / 2)

  const logoBuffer = await sharp(logo)
    .resize(logoSize, logoSize, { fit: 'contain', background: '#1565C0' })
    .png()
    .toBuffer()

  await sharp({ create: { width: size, height: size, channels: 3, background: '#1565C0' } })
    .composite([{ input: logoBuffer, top: padding, left: padding }])
    .png()
    .toFile(path.join(iconsDir, `icon-${size}.png`))

  console.log(`✓ icon-${size}.png`)
}

// Splash screen (wide, used for loading)
await sharp(logo)
  .resize(1080, 1080, { fit: 'contain', background: '#1565C0' })
  .png()
  .toFile(path.join(__dirname, '../public/splash.png'))
console.log('✓ splash.png')

console.log('Done.')
