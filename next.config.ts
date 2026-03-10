// 移除静态导出配置，恢复默认构建模式（适配 Cloudflare Edge 环境）
const nextConfig = {
  // 仅保留必要的基础配置，删除 output 和 trailingSlash
};

export default nextConfig;
