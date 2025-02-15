import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true, },

  images: {
    domains: ['pub-7fcfebf46a92407bab6b3dd171814625.r2.dev'], // Add your R2 domain
  },
};

export default nextConfig;

module.exports = nextConfig;
