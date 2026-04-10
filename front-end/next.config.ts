import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Tắt export static để cho phép chạy API Routes ngầm của Next.js Server
  trailingSlash: true,
  basePath: '/hackathon',
};

export default nextConfig;
