import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**",
      },
      // Cloudflare R2 — your custom domain (set STORAGE_PUBLIC_URL to match)
      {
        protocol: "https",
        hostname: "assets.ucautoconnect.com",
      },
    ],
  },
};

export default nextConfig;
