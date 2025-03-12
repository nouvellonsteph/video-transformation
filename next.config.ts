import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'video-transformation.justalittlebyte.ovh',
        port: '',
        pathname: '/cdn-cgi/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-d217a1fefa4346d09172e418e550c2e0.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
