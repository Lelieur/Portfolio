import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/lucaslelieur/image/**"),
      new URL("https://cdn-images-1.medium.com/**"),
    ],
  },
};

export default nextConfig;
