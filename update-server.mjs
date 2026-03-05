/**
 * Powertec Contractor App — Local Update Server
 *
 * Serves:
 *   GET /version.json  — current version info (app checks this on launch)
 *   GET /latest.apk    — the APK file to download
 *   GET /              — download page for first install
 *
 * TO PUSH AN UPDATE:
 *   1. Bump APP_VERSION below
 *   2. Run: npm run build
 *   3. Run: npm run build:apk   (or the manual gradle command)
 *   4. Restart this server
 *   Anyone with the app open will see "Update available" within 5 minutes.
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const APP_VERSION = '1.0.2'       // ← bump this when releasing a new APK
const APK_PATH    = path.join(__dirname, 'powertec-tools.apk')
const PORT        = 8080
const MY_IP       = '192.168.1.107'

const versionJson = JSON.stringify({
  version: APP_VERSION,
  apkUrl: `http://${MY_IP}:${PORT}/latest.apk`,
  releaseNotes: 'Latest version of Powertec Contractor App',
})

const server = http.createServer((req, res) => {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.url === '/version.json') {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')
    res.end(versionJson)
    return
  }

  if (req.url === '/latest.apk') {
    if (!fs.existsSync(APK_PATH)) {
      res.writeHead(404)
      res.end('APK not found. Run npm run build:apk first.')
      return
    }
    const stat = fs.statSync(APK_PATH)
    res.setHeader('Content-Type', 'application/vnd.android.package-archive')
    res.setHeader('Content-Disposition', 'attachment; filename=powertec-tools.apk')
    res.setHeader('Content-Length', stat.size)
    fs.createReadStream(APK_PATH).pipe(res)
    return
  }

  // Download page (for first install)
  res.setHeader('Content-Type', 'text/html')
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Powertec Contractor App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card { background: white; border-radius: 20px; padding: 32px 24px; max-width: 360px; width: 100%; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .logo { width: 72px; height: 72px; background: #0066cc; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; font-weight: 900; font-size: 22px; }
    h1 { color: #0f172a; font-size: 22px; font-weight: 800; }
    p { color: #64748b; font-size: 14px; margin-top: 8px; line-height: 1.5; }
    .version { display: inline-block; background: #eff6ff; color: #0066cc; border-radius: 99px; padding: 4px 12px; font-size: 12px; font-weight: 600; margin: 16px 0; }
    .btn { display: block; background: #0066cc; color: white; text-decoration: none; border-radius: 14px; padding: 16px; font-size: 16px; font-weight: 700; margin-top: 8px; }
    .note { color: #94a3b8; font-size: 12px; margin-top: 16px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">PT</div>
    <h1>Powertec Contractor App</h1>
    <p>Contractor field app for Powertec Telecommunications</p>
    <div class="version">v${APP_VERSION}</div>
    <a href="/latest.apk" class="btn">⬇ Download Android App</a>
    <p class="note">
      After downloading, tap the file in your notifications to install.<br/>
      If prompted, allow installs from unknown sources.
    </p>
  </div>
</body>
</html>`)
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✓ Powertec update server running`)
  console.log(`  Download page : http://${MY_IP}:${PORT}`)
  console.log(`  Version check : http://${MY_IP}:${PORT}/version.json`)
  console.log(`  APK download  : http://${MY_IP}:${PORT}/latest.apk`)
  console.log(`\n  Current version: v${APP_VERSION}`)
  console.log(`  To push update: bump APP_VERSION, rebuild APK, restart server\n`)
})
