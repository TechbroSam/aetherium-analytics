import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com', // Add this new hostname
      },
            {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com', // Add this new hostname
      },
    ],
  },
};

export default nextConfig;
