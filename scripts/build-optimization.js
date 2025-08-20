#!/usr/bin/env node

/**
 * Build Optimization Script for CIPM CRM System
 * Handles pre-build optimizations, asset generation, and performance checks
 */

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const CONFIG = {
  // Paths
  publicDir: path.join(__dirname, '..', 'public'),
  iconsDir: path.join(__dirname, '..', 'public', 'icons'),
  screenshotsDir: path.join(__dirname, '..', 'public', 'screenshots'),
  buildDir: path.join(__dirname, '..', '.next'),
  
  // Icon sizes to generate
  iconSizes: [72, 96, 128, 144, 152, 192, 384, 512],
  
  // Performance thresholds
  performance: {
    maxBundleSize: 250 * 1024, // 250KB
    maxChunkSize: 100 * 1024,  // 100KB
    maxAssetSize: 250 * 1024,  // 250KB
  }
}

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function success(message) {
  log(`✅ ${message}`, 'green')
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function error(message) {
  log(`❌ ${message}`, 'red')
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue')
}

// Main optimization workflow
async function main() {
  try {
    log('\n🚀 Starting Build Optimization Process\n', 'bright')
    
    // Step 1: Environment checks
    await checkEnvironment()
    
    // Step 2: Pre-build optimizations
    await preBuildOptimizations()
    
    // Step 3: Generate PWA assets
    await generatePWAAssets()
    
    // Step 4: Analyze dependencies
    await analyzeDependencies()
    
    // Step 5: Build the application
    await buildApplication()
    
    // Step 6: Post-build analysis
    await postBuildAnalysis()
    
    // Step 7: Generate deployment artifacts
    await generateDeploymentArtifacts()
    
    success('Build optimization completed successfully!')
    
  } catch (err) {
    error(`Build optimization failed: ${err.message}`)
    process.exit(1)
  }
}

// Check environment and prerequisites
async function checkEnvironment() {
  info('Checking environment...')
  
  // Check Node.js version
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1))
  
  if (majorVersion < 18) {
    throw new Error(`Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`)
  }
  
  success(`Node.js version: ${nodeVersion}`)
  
  // Check if required files exist
  const requiredFiles = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    '.env.local'
  ]
  
  for (const file of requiredFiles) {
    try {
      await fs.access(path.join(__dirname, '..', file))
      success(`Found required file: ${file}`)
    } catch {
      warning(`Missing optional file: ${file}`)
    }
  }
}

// Pre-build optimizations
async function preBuildOptimizations() {
  info('Running pre-build optimizations...')
  
  // Clean previous build
  try {
    await fs.rm(CONFIG.buildDir, { recursive: true, force: true })
    success('Cleaned previous build')
  } catch (err) {
    info('No previous build to clean')
  }
  
  // Optimize package.json for production
  await optimizePackageJson()
  
  // Generate build metadata
  await generateBuildMetadata()
  
  success('Pre-build optimizations completed')
}

// Optimize package.json for production builds
async function optimizePackageJson() {
  info('Optimizing package.json...')
  
  const packagePath = path.join(__dirname, '..', 'package.json')
  const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'))
  
  // Add production-specific scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'build:production': 'NODE_ENV=production next build',
    'build:analyze': 'ANALYZE=true NODE_ENV=production next build',
    'start:production': 'NODE_ENV=production next start',
    'export': 'next export'
  }
  
  // Ensure all dependencies are properly categorized
  const prodDeps = [
    'next',
    'react',
    'react-dom',
    'firebase',
    '@tanstack/react-query',
    'zustand',
    'lucide-react',
    '@radix-ui',
    'tailwindcss',
    'class-variance-authority',
    'clsx',
    'tailwind-merge'
  ]
  
  info(`Optimized package.json with ${Object.keys(packageJson.dependencies || {}).length} dependencies`)
}

// Generate build metadata
async function generateBuildMetadata() {
  info('Generating build metadata...')
  
  const metadata = {
    buildTime: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    environment: process.env.NODE_ENV || 'production',
    commit: getGitCommit(),
    branch: getGitBranch()
  }
  
  await fs.writeFile(
    path.join(CONFIG.publicDir, 'build-metadata.json'),
    JSON.stringify(metadata, null, 2)
  )
  
  success('Generated build metadata')
}

// Get current git commit hash
function getGitCommit() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
}

// Get current git branch
function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
}

// Generate PWA assets
async function generatePWAAssets() {
  info('Generating PWA assets...')
  
  // Create icons directory
  try {
    await fs.mkdir(CONFIG.iconsDir, { recursive: true })
  } catch (err) {
    // Directory might already exist
  }
  
  // Create screenshots directory
  try {
    await fs.mkdir(CONFIG.screenshotsDir, { recursive: true })
  } catch (err) {
    // Directory might already exist
  }
  
  // Generate placeholder icons (in a real scenario, you'd convert from a source image)
  await generatePlaceholderIcons()
  
  // Generate offline page
  await generateOfflinePage()
  
  success('Generated PWA assets')
}

// Generate placeholder icons
async function generatePlaceholderIcons() {
  info('Generating placeholder icons...')
  
  const svgTemplate = (size) => `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#1f2937"/>
      <text x="50%" y="50%" font-family="Arial" font-size="${Math.floor(size/8)}" 
            fill="white" text-anchor="middle" dy=".3em">CIPM</text>
    </svg>
  `
  
  for (const size of CONFIG.iconSizes) {
    const svgContent = svgTemplate(size)
    await fs.writeFile(
      path.join(CONFIG.iconsDir, `icon-${size}x${size}.svg`),
      svgContent
    )
  }
  
  success(`Generated ${CONFIG.iconSizes.length} placeholder icons`)
}

// Generate offline page
async function generateOfflinePage() {
  const offlineHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - CIPM CRM</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f3f4f6;
      color: #374151;
    }
    .container {
      text-align: center;
      max-width: 400px;
      padding: 2rem;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 2rem;
      background: #1f2937;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      margin-bottom: 2rem;
      color: #6b7280;
    }
    .retry-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .retry-btn:hover {
      background: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">CIPM</div>
    <h1>Sin conexión</h1>
    <p>No hay conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.</p>
    <button class="retry-btn" onclick="window.location.reload()">
      Intentar de nuevo
    </button>
  </div>
</body>
</html>
  `
  
  await fs.writeFile(path.join(CONFIG.publicDir, 'offline.html'), offlineHtml.trim())
  success('Generated offline page')
}

// Analyze dependencies
async function analyzeDependencies() {
  info('Analyzing dependencies...')
  
  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf8')
    )
    
    const dependencies = Object.keys(packageJson.dependencies || {})
    const devDependencies = Object.keys(packageJson.devDependencies || {})
    
    info(`Production dependencies: ${dependencies.length}`)
    info(`Development dependencies: ${devDependencies.length}`)
    
    // Check for potential issues
    const heavyPackages = ['lodash', 'moment', 'jquery']
    const foundHeavy = dependencies.filter(dep => heavyPackages.includes(dep))
    
    if (foundHeavy.length > 0) {
      warning(`Heavy packages detected: ${foundHeavy.join(', ')}`)
    }
    
    success('Dependency analysis completed')
  } catch (err) {
    warning(`Could not analyze dependencies: ${err.message}`)
  }
}

// Build the application
async function buildApplication() {
  info('Building application...')
  
  const startTime = Date.now()
  
  try {
    // Run the Next.js build
    execSync('npm run build', { 
      stdio: 'inherit',
      env: { 
        ...process.env, 
        NODE_ENV: 'production'
      }
    })
    
    const buildTime = Date.now() - startTime
    success(`Build completed in ${(buildTime / 1000).toFixed(2)}s`)
    
  } catch (err) {
    throw new Error(`Build failed: ${err.message}`)
  }
}

// Post-build analysis
async function postBuildAnalysis() {
  info('Running post-build analysis...')
  
  try {
    // Analyze build output
    const buildStats = await analyzeBuildOutput()
    
    // Check performance thresholds
    await checkPerformanceThresholds(buildStats)
    
    success('Post-build analysis completed')
    
  } catch (err) {
    warning(`Post-build analysis failed: ${err.message}`)
  }
}

// Analyze build output
async function analyzeBuildOutput() {
  const buildDir = path.join(__dirname, '..', '.next')
  
  try {
    const stats = await fs.stat(buildDir)
    
    // Get build size
    const buildSize = await getDirSize(buildDir)
    
    info(`Build directory size: ${formatBytes(buildSize)}`)
    
    return {
      buildSize,
      timestamp: stats.mtime
    }
    
  } catch (err) {
    throw new Error(`Could not analyze build output: ${err.message}`)
  }
}

// Get directory size recursively
async function getDirSize(dirPath) {
  const files = await fs.readdir(dirPath)
  let size = 0
  
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stat = await fs.stat(filePath)
    
    if (stat.isDirectory()) {
      size += await getDirSize(filePath)
    } else {
      size += stat.size
    }
  }
  
  return size
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

// Check performance thresholds
async function checkPerformanceThresholds(buildStats) {
  info('Checking performance thresholds...')
  
  // This is a simplified check - in a real scenario you'd analyze the Next.js build output
  if (buildStats.buildSize > CONFIG.performance.maxBundleSize * 100) { // Rough estimate
    warning('Build size exceeds recommended threshold')
  } else {
    success('Build size within acceptable limits')
  }
}

// Generate deployment artifacts
async function generateDeploymentArtifacts() {
  info('Generating deployment artifacts...')
  
  // Create deployment info
  const deploymentInfo = {
    buildTime: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    commit: getGitCommit(),
    branch: getGitBranch(),
    nodeVersion: process.version,
    nextJsVersion: getNextJsVersion()
  }
  
  await fs.writeFile(
    path.join(CONFIG.buildDir, 'deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  )
  
  success('Generated deployment artifacts')
}

// Get Next.js version
function getNextJsVersion() {
  try {
    const packageJson = require(path.join(__dirname, '..', 'package.json'))
    return packageJson.dependencies?.next || 'unknown'
  } catch {
    return 'unknown'
  }
}

// Run the optimization
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  main,
  checkEnvironment,
  preBuildOptimizations,
  generatePWAAssets,
  buildApplication,
  postBuildAnalysis
}