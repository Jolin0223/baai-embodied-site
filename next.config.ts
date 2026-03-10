const nextConfig = {
  output: 'export', // 强制生成纯静态文件，跳过 API 路由
  trailingSlash: true, // 避免静态导出的 404 问题
};
export default nextConfig;
