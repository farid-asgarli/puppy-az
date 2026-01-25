import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5005",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "72.62.2.60",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "72.62.2.60",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default withNextIntl(nextConfig);
