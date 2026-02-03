
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["https://6000-firebase-studio-1747988031687.cluster-jbb3mjctu5cbgsi6hwq6u4btwe.cloudworkstations.dev"],
  },
  images: {
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
