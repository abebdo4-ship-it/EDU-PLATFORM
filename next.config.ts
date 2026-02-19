import type { NextConfig } from "next";
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // Force all pages to be server-rendered (no static prerendering)
  // This is required because NEXT_PUBLIC_ vars are not available during build on Vercel
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr'],
  },
};

export default withPWA(nextConfig);
