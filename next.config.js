
/** @type {import('next').NextConfig} */
const isCapacitorBuild =
  process.env.BUILD_TARGET === 'capacitor' ||
  process.env.npm_lifecycle_event === 'build:capacitor';

const nextConfig = {
  // Keep Firebase App Hosting on standalone and use export only for Capacitor builds.
  output: isCapacitorBuild ? 'export' : 'standalone',
  allowedDevOrigins: [
    "https://6000-firebase-studio-1747988031687.cluster-jbb3mjctu5cbgsi6hwq6u4btwe.cloudworkstations.dev",
    "https://9000-firebase-studio-1747988031687.cluster-jbb3mjctu5cbgsi6hwq6u4btwe.cloudworkstations.dev"
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'workwellfut.com',
      },
      {
        protocol: 'http',
        hostname: 'workwellfut.com',
      },
      {
        protocol: 'https',
        hostname: 'workwellfut.hl1450.dinaserver.com',
      },
      {
        protocol: 'http',
        hostname: 'workwellfut.hl1450.dinaserver.com',
      }
    ],
  },
  productionBrowserSourceMaps: false, // Deshabilita source maps en producción
};

module.exports = nextConfig;
