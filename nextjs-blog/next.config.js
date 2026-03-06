/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 允许从 Hexo 输出目录读取静态文件
  publicRuntimeConfig: {
    hexoBlogPath: '../public',
  },
  
  // 配置静态文件生成
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
  
  // 重写配置，将 Hexo 生成的内容映射到 /blog
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/blog/:path*',
          destination: '/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
