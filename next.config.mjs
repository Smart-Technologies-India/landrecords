/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.convas = false;
    return config;
  },
};

export default nextConfig;
