/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // REMOVE THIS LINE: unoptimized: true,
    // ADD THESE LINES:
    domains: [
      'i.pinimg.com',
      '64.media.tumblr.com',
      'images.unsplash.com' // Optional: if you use Unsplash
    ],
    formats: ['image/webp', 'image/avif'],
    // Enable image optimization (default is true)
    unoptimized: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig