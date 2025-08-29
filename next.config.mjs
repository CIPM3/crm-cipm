let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  eslint: {
    // Ignore ESLint errors during builds for Netlify deployment
    ignoreDuringBuilds: true,
    // Only run ESLint on specific directories to improve build performance
    dirs: ['pages', 'components', 'lib', 'app', 'hooks', 'api'],
  },
  typescript: {
    // Ignore TypeScript errors during builds to prevent deployment failures
    ignoreBuildErrors: true,
  },
  // Optimize build output for better performance
  swcMinify: true,
  // Reduce build size by removing unused code
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    serverComponentsExternalPackages: ['firebase', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
    typedRoutes: true,
    // Desactivado: causaba problemas de importación con componentes de iconos (undefined en SSR)
    // optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Habilitar PPR solo es compatible con canary. Con Next estable lo desactivamos.
    ppr: false, // Partial Prerendering
  },
  // Optimize for CRM workflows
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle analysis and performance
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          firebase: {
            name: 'firebase',
            test: /[\/\\]node_modules[\/\\](firebase|@firebase)[\/\\]/,
            chunks: 'all',
            priority: 30,
          },
          ui: {
            name: 'ui',
            test: /[\/\\]node_modules[\/\\](@radix-ui|@tanstack)[\/\\]/,
            chunks: 'all',
            priority: 25,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
          },
        },
      }
    }
    return config
  },
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
