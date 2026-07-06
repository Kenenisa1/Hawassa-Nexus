import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "mongodb", "bcryptjs"],
  experimental: {
    turbopackFileSystemCacheForDev: false,
    optimizePackageImports: ["react-icons", "framer-motion", "lucide-react"]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/maps/api/staticmap',
      }
    ],
  },
};

export default nextConfig;