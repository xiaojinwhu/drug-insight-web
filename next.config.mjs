// ES Module syntax
/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/llm/:path*',
          destination: 'http://localhost:9090/llm/:path*', // 修改为你的后端服务地址和端口
        },
      ];
    },
  };
  
  export default nextConfig;
  