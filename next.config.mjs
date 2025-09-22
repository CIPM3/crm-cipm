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
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // Production optimizations
    webpackBuildWorker: process.env.NODE_ENV === 'production',
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    serverComponentsExternalPackages: ['firebase', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
    typedRoutes: true,
    // Enable package optimization for better tree shaking
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog', 
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@tanstack/react-query',
      'framer-motion',
      'recharts',
      'date-fns',
      'formik',
      'yup',
      'zod'
    ],
    // Habilitar PPR solo es compatible con canary. Con Next estable lo desactivamos.
    ppr: false, // Partial Prerendering
  },
  // Optimize for CRM workflows
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle analysis and performance
  webpack: (config, { dev, isServer, webpack }) => {
    
    // Add bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer ? '../analyze/server.html' : '../analyze/client.html',
          openAnalyzer: false,
        })
      )
    }
    
    if (!dev && !isServer) {
      // Aggressive code splitting for production builds
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              test: /[\/\\]node_modules[\/\\](react|react-dom|scheduler|prop-types|use-subscription)[\/\\]/,
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },
            firebase: {
              name: 'firebase',
              test: /[\/\\]node_modules[\/\\](firebase|@firebase)[\/\\]/,
              chunks: 'all',
              priority: 35,
              enforce: true,
              reuseExistingChunk: true,
            },
            radixui: {
              name: 'radixui',
              test: /[\/\\]node_modules[\/\\]@radix-ui[\/\\]/,
              chunks: 'all',
              priority: 30,
              reuseExistingChunk: true,
            },
            tanstack: {
              name: 'tanstack',
              test: /[\/\\]node_modules[\/\\]@tanstack[\/\\]/,
              chunks: 'all',
              priority: 28,
              reuseExistingChunk: true,
            },
            animations: {
              name: 'animations',
              test: /[\/\\]node_modules[\/\\](framer-motion|gsap)[\/\\]/,
              chunks: 'async',
              priority: 25,
              reuseExistingChunk: true,
            },
            forms: {
              name: 'forms',
              test: /[\/\\]node_modules[\/\\](formik|yup|zod|react-hook-form|@hookform)[\/\\]/,
              chunks: 'async',
              priority: 22,
              reuseExistingChunk: true,
            },
            charts: {
              name: 'charts',
              test: /[\/\\]node_modules[\/\\](recharts|d3-.*)[\/\\]/,
              chunks: 'async',
              priority: 20,
              reuseExistingChunk: true,
            },
            icons: {
              name: 'icons',
              test: /[\/\\]node_modules[\/\\](lucide-react|@radix-ui\/react-icons)[\/\\]/,
              chunks: 'async',
              priority: 18,
              reuseExistingChunk: true,
            },
            utils: {
              name: 'utils',
              test: /[\/\\]node_modules[\/\\](clsx|class-variance-authority|tailwind-merge|date-fns|uuid)[\/\\]/,
              chunks: 'all',
              priority: 15,
              reuseExistingChunk: true,
            },
            lib: {
              test: /[\/\\]lib[\/\\]/,
              name: 'lib',
              chunks: 'all',
              priority: 12,
              reuseExistingChunk: true,
            },
            shared: {
              name: 'shared',
              minChunks: 2,
              chunks: 'async',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      }

      // Add webpack ignore plugin for unused locales
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        })
      )
    }
    
    return config
  },
  // Headers for security and performance
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    const baseHeaders = [
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
    ]

    if (!isDevelopment) {
      // Production: Enable caching for static assets
      baseHeaders.push({
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      })
    }

    return baseHeaders
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
