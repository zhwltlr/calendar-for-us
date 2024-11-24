/** @type {import('next').NextConfig} */
const nextConfig = {
    // 성능 최적화 설정
    reactStrictMode: true,
    poweredByHeader: false,
    
    // 이미지 도메인 설정 (필요한 경우)
    images: {
      domains: ['your-domain.com'],
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
  }
  
  module.exports = nextConfig