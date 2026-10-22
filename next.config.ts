import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security/csp";

export const ALL_PATHS_SOURCE = "/:path*";
export const STATIC_ASSET_SOURCE = "/_next/static/:path*";
export const REVALIDATE_CACHE_CONTROL = "public, max-age=0, must-revalidate";
export const STATIC_ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: ALL_PATHS_SOURCE,
        headers: [
          ...securityHeaders(process.env),
          { key: "Cache-Control", value: REVALIDATE_CACHE_CONTROL },
        ],
      },
      {
        source: STATIC_ASSET_SOURCE,
        headers: [
          { key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
