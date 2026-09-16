import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  allowedDevOrigins: [
    '192.168.50.68',
    '192.168.0.172',
  ],
};

export default nextConfig;
