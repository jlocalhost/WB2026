import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: (isDev ? {
    allowedDevOrigins: ["http://localhost:3000", "http://192.168.0.97:3000", "http://192.168.101.14:3000"],
  } : {}) as any,
};

export default nextConfig;
