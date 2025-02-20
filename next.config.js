/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_BEEHIIV_API_KEY: process.env.NEXT_BEEHIIV_API_KEY,
    NEXT_BEEHIIV_PUBLICATION_ID: process.env.NEXT_BEEHIIV_PUBLICATION_ID,
    NEXT_BEEHIIV_ENABLED: !!(process.env.NEXT_BEEHIIV_API_KEY && process.env.NEXT_BEEHIIV_PUBLICATION_ID),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  reactStrictMode: false,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: "/dashboard/map/:id",
        destination: "/map/:id",
        permanent: true,
      },
      {
        source: "/dashboard/api_keys",
        destination: "/settings/api-keys",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
