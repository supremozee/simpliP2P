import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api-simplip2p.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'backend-19ny.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
export default nextConfig;