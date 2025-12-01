import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: ['http://192.168.100.32:3000'], // your local network IP + port
  },
};

export default nextConfig;
