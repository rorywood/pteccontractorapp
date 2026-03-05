import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.powertec.tools',
  appName: 'Powertec Tools',
  webDir: 'dist',
  // No server.url = fully bundled/offline. App works with zero internet.
  // Updates are handled via the in-app updater (checks update-server for new APK).
};

export default config;
