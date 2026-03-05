# CloudASN Tools — Deployment Guide

## Overview

This is a static PWA (Progressive Web App). The build output is a `dist/` folder of plain
HTML/JS/CSS files. No server-side runtime is needed — just host the static files.

---

## 1. Build the app

```bash
npm install
npm run build
# Output: dist/
```

---

## 2. Deploy to Cloudflare Pages

1. Push your code to a GitHub or GitLab repository.
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → **Create a project** → **Connect to Git**.
3. Select your repository.
4. Set build settings:
   - **Framework preset**: None (or Vite)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 18+ (set in Environment Variables: `NODE_VERSION=18`)
5. Click **Save and Deploy**.

Every push to your main branch auto-deploys. Previews are generated for other branches.

**Custom domain**: In Cloudflare Pages → Custom Domains → add your domain.

---

## 3. Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo.
3. Vercel auto-detects Vite. Accept defaults:
   - **Framework**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Click **Deploy**.

Every push auto-deploys. Preview deployments on branches.

**Custom domain**: Project Settings → Domains → Add your domain.

---

## 4. Install the PWA on iPhone (iOS Safari)

1. Open your deployed URL in **Safari** (not Chrome — must be Safari for iOS PWA).
2. Tap the **Share** button (box with up arrow) at the bottom of the screen.
3. Scroll down in the share sheet and tap **"Add to Home Screen"**.
4. Edit the name if you want, then tap **Add**.
5. The app icon appears on your home screen — tap to open in standalone mode.

**Note**: iOS 16.4+ supports full PWA features including push notifications. Older iOS
versions support basic install but no background sync or push.

---

## 5. Install the PWA on Android (Chrome)

1. Open your deployed URL in **Chrome**.
2. Tap the **three-dot menu** (⋮) in the top right.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Tap **Install** in the confirmation dialog.
5. The app installs and appears in your app drawer and home screen.

**Alternative**: Chrome shows an **install banner** automatically after a few visits
if the PWA criteria are met (HTTPS, valid manifest, service worker registered).

---

## 6. How updates work

- When you push new code and Cloudflare/Vercel rebuilds:
  - Users already in the app see a **"Update available — tap to refresh"** banner within 60 seconds
  - The next time someone opens the app cold, they get the new version automatically
- To trigger the banner manually: bump the `APP_VERSION` constant in:
  - `src/sw.ts` — line 5
  - `src/screens/HomeScreen.tsx` — line 5
  - `src/screens/SettingsScreen.tsx` — line 10
- The service worker polls for updates every 60 seconds while the app is open.

---

## 7. Environment variables

No environment variables are required for the basic app. All data is stored in
`localStorage` on the user's device.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| PWA not installing on iOS | Must be opened in **Safari** |
| Service worker not updating | Hard-refresh: Settings → Check for updates |
| Old version cached | Clear app data in browser settings |
| Build fails | Ensure Node.js 18+ is installed: `node --version` |
