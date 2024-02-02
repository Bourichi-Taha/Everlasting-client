/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        hostname: '**.cyber-scale.me',
      },
    ],
  },
};

module.exports = nextConfig;
