/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include markdown files
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add transpilePackages for rehype-prism-plus
  transpilePackages: ['rehype-prism-plus'],
  // Removed the experimental serverComponentsExternalPackages for puppeteer
};

export default nextConfig;
