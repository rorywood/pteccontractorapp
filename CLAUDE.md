# Powertec Tools — Project Context

## Company
**Powertec Telecommunications** — builds a contractor field app for telecom site work.

## What We're Building
A two-part system:
1. **Contractor mobile app** (Android APK + PWA) — field engineers use this on site
2. **Admin web portal** — Powertec office staff manage projects and assign contractors

---

## Current Status
- Base PWA scaffolded with React 18 + TypeScript + Vite + Tailwind CSS
- Android APK built via Capacitor (debug build, sideloaded)
- APK configured to load from a live URL (not bundled) — so UI updates are instant, no reinstall needed
- Dev mode: APK loads from `http://192.168.1.107:5173` (local Vite dev server)
- Prod mode: APK will load from `https://powertec-tools.pages.dev` (Cloudflare Pages, not set up yet)
- Current app has placeholder screens: Home, Network Tools, Checklist, Notes, Settings
- These placeholder screens will be replaced with the real contractor app screens

## Running Locally
```bash
# Start dev server (phone loads from this)
npm run dev -- --host --port 5173

# Serve APK download page
node -e "..." # see previous session — serves on port 8080

# Build APK
cd android && ANDROID_SDK_ROOT="C:/Users/RoryWood/AppData/Local/Android/Sdk" JAVA_HOME="C:/Program Files/Eclipse Adoptium/jdk-21.0.10.7-hotspot" ./gradlew assembleDebug
```

## Java / SDK Versions (IMPORTANT)
- **Use JDK 21** for Android builds: `C:/Program Files/Eclipse Adoptium/jdk-21.0.10.7-hotspot`
- JDK 17 = too old for Capacitor 8 (needs Java 21 source)
- JDK 25 = too new for Gradle (unsupported class file version)
- Android SDK: `C:/Users/RoryWood/AppData/Local/Android/Sdk`
- Capacitor version: 8.x

---

## Planned App Architecture

### Contractor App (mobile)
- Login with email/password (external contractors, no Microsoft accounts)
- See only projects assigned to them
- View project documents: PDFs, photos
- Upload site completion photos → stored in SharePoint
- Works on Android (APK) and iOS (PWA via Safari)

### Admin Portal (web)
- Login with Microsoft 365 (Powertec staff)
- Create and manage projects
- Assign contractors to projects
- Upload documents/drawings to projects
- View uploaded completion photos per project

### Backend / Integrations
- **Auth**: Supabase (contractor email/password login) + Microsoft 365 (admin login)
- **Project data**: Supabase database
- **File storage**: SharePoint (Powertec Microsoft 365 subscription)
  - SharePoint site: Solutions Team site
  - Location: Site Documents folder
  - Each project gets its own subfolder
- **SharePoint API**: Microsoft Graph API (via backend/edge function — credentials never in the app)

---

## Key Decisions Made
- Android APK uses **Live URL** strategy — APK is a thin shell, all UI served from hosted URL
- This means UI updates deploy instantly without users reinstalling the APK
- iOS: PWA only (Apple doesn't allow sideloading without $99 dev account)
- Contractors are **external** — they have personal emails, not Microsoft accounts
- Admin staff use **Microsoft 365** accounts (Powertec already has M365 subscription)
- File storage goes to **SharePoint** not Supabase Storage

---

## Next Steps (in order)
1. Deploy frontend to Cloudflare Pages (get a real URL)
2. Set up Supabase project (auth + database)
3. Design and build real contractor app screens:
   - Login screen
   - Project list (only assigned projects)
   - Project detail (docs, photos, upload)
4. Set up Microsoft Graph API access for SharePoint uploads
5. Build admin web portal (separate app or route)
6. Set up Azure App Registration for SharePoint API access
