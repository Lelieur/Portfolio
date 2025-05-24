import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/lucaslelieur/image/**"),
      new URL("https://cdn-images-1.medium.com/**"),
    ],
  },
};

export default nextConfig;
