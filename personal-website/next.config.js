/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
  },

  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: '**.bbc.com',
      // }
    ]
  }
};

module.exports = nextConfig;