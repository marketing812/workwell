import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.futuver.emotiva',
  appName: 'Emotiva',
  webDir: 'out',//public
  server: {
    //url: 'https://emotiva--workwell-c4rlk.europe-west4.hosted.app',
    cleartext: false
  }
};


export default config;
