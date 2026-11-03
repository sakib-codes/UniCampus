import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin access to Next.js dev resources (HMR) from local network devices
  allowedDevOrigins: [
    "192.168.0.3",
    "192.168.0.3:3000",
    "localhost",
    "localhost:3000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
