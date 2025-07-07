
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.b0cbf210e1cf4416a1ea679e03a50c9d',
  appName: 'nihaara-time-keeper-system',
  webDir: 'dist',
  server: {
    url: 'https://b0cbf210-e1cf-4416-a1ea-679e03a50c9d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false
    }
  }
};

export default config;
