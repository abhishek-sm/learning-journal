/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Next's workspace boundary at this application, even if a parent folder
  // contains another package manager lockfile.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
