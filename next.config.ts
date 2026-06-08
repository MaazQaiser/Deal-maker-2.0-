import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Prevent intermittent missing chunk errors in local dev cache.
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
