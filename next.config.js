/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
