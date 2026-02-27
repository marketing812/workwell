import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.workwell.app',
  appName: 'WorkWell',
  webDir: 'public',
  server: {
    url: 'https://emotiva--workwell-c4rlk.europe-west4.hosted.app',
    cleartext: false
  }
};


export default config;
