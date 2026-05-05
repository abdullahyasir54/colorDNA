import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow the analyze route up to 120s on Vercel (Pro: 300s max)
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
