/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      // FSD 레이어 별칭 설정
      config.resolve.fallback = {
        ...config.resolve.fallback,
      };
      
      // 레이어 간 순환 참조 방지 규칙 (선택사항)
      config.module.rules.push({
        test: /\.(tsx|ts|js|jsx)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          eslintPath: require.resolve('eslint'),
        },
      });
  
      return config;
    },
    
    // 성능 최적화 설정
    reactStrictMode: true,
    poweredByHeader: false,
    
    // 이미지 도메인 설정 (필요한 경우)
    images: {
      domains: ['your-domain.com'],
    },
  }
  
  module.exports = nextConfig