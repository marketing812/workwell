import type { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();

const config: CapacitorConfig = {
  appId: 'com.futuver.emotiva',
  appName: 'Emotiva',
  webDir: 'out',
  server: {
    cleartext: false,
    allowNavigation: [
      'www.youtube.com',
      '*.youtube.com',
      'youtube.com',
      'www.youtube-nocookie.com',
      '*.youtube-nocookie.com',
      '*.googlevideo.com',
      '*.ytimg.com',
      '*.ggpht.com',
    ],
    ...(serverUrl ? { url: serverUrl } : {}),
  },
};

export default config;
