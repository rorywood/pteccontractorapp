import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logo = path.join(__dirname, '../public/logo.jpg')
const resDir = path.join(__dirname, '../android/app/src/main/res')

// Launcher icon sizes per density
const mipmaps = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
]

for (const { dir, size } of mipmaps) {
  const outDir = path.join(resDir, dir)
  fs.mkdirSync(outDir, { recursive: true })

  // Resize logo to 80% of icon size so it has breathing room and isn't clipped
  const logoSize = Math.round(size * 0.8)
  const padding  = Math.round((size - logoSize) / 2)

  const logoBuffer = await sharp(logo)
    .resize(logoSize, logoSize, { fit: 'contain', background: '#1565C0' })
    .png()
    .toBuffer()

  const iconBuffer = await sharp({
    create: { width: size, height: size, channels: 3, background: '#1565C0' }
  })
    .composite([{ input: logoBuffer, top: padding, left: padding }])
    .png()
    .toBuffer()

  await sharp(iconBuffer).toFile(path.join(outDir, 'ic_launcher.png'))
  await sharp(iconBuffer).toFile(path.join(outDir, 'ic_launcher_round.png'))

  // Adaptive foreground — 108dp canvas, logo at 70% inset
  const fgSize    = Math.round(size * 1.5)
  const fgLogo    = Math.round(fgSize * 0.7)
  const fgPadding = Math.round((fgSize - fgLogo) / 2)

  const fgLogoBuffer = await sharp(logo)
    .resize(fgLogo, fgLogo, { fit: 'contain', background: { r: 21, g: 101, b: 192, alpha: 0 } })
    .png()
    .toBuffer()

  await sharp({
    create: { width: fgSize, height: fgSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite([{ input: fgLogoBuffer, top: fgPadding, left: fgPadding }])
    .png()
    .toFile(path.join(outDir, 'ic_launcher_foreground.png'))

  console.log(`✓ ${dir} (${size}px)`)
}

// Splash screens — portrait
const splashSizes = [
  { dir: 'drawable-port-mdpi',    w: 320,  h: 480  },
  { dir: 'drawable-port-hdpi',    w: 480,  h: 800  },
  { dir: 'drawable-port-xhdpi',   w: 720,  h: 1280 },
  { dir: 'drawable-port-xxhdpi',  w: 960,  h: 1600 },
  { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
]

for (const { dir, w, h } of splashSizes) {
  const outDir = path.join(resDir, dir)
  fs.mkdirSync(outDir, { recursive: true })

  // Blue background with centred logo
  const logoSize = Math.round(Math.min(w, h) * 0.45)
  const logoBuffer = await sharp(logo)
    .resize(logoSize, logoSize, { fit: 'contain', background: '#1565C0' })
    .png()
    .toBuffer()

  await sharp({
    create: { width: w, height: h, channels: 3, background: '#1565C0' }
  })
    .composite([{
      input: logoBuffer,
      gravity: 'centre',
    }])
    .png()
    .toFile(path.join(outDir, 'splash.png'))

  console.log(`✓ splash ${dir} (${w}x${h})`)
}

console.log('\nAll Android icons and splash screens generated.')
