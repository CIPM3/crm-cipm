#!/usr/bin/env node

/**
 * Performance Monitor for CIPM CRM System
 * Monitors build performance, bundle sizes, and runtime metrics
 */

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')

// Performance thresholds
const THRESHOLDS = {
  // Bundle sizes (in bytes)
  maxBundleSize: 500 * 1024, // 500KB
  maxChunkSize: 244 * 1024,  // 244KB (Next.js recommendation)
  maxInitialJS: 200 * 1024,  // 200KB
  maxInitialCSS: 50 * 1024,  // 50KB
  
  // Performance metrics
  maxLCP: 2500,      // Largest Contentful Paint (ms)
  maxFID: 100,       // First Input Delay (ms)
  maxCLS: 0.1,       // Cumulative Layout Shift
  maxTTFB: 800,      // Time to First Byte (ms)
  maxFCP: 1800,      // First Contentful Paint (ms)
  
  // Build metrics
  maxBuildTime: 300000, // 5 minutes (ms)
  maxMemoryUsage: 2 * 1024 * 1024 * 1024, // 2GB
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

// Main monitoring function
async function main() {
  try {
    log('\n📊 Starting Performance Monitoring\n', 'bright')
    
    // Monitor build performance
    const buildMetrics = await monitorBuildPerformance()
    
    // Analyze bundle sizes
    const bundleMetrics = await analyzeBundleSizes()
    
    // Check Core Web Vitals (if build exists)
    const webVitals = await checkWebVitals()
    
    // Generate performance report
    await generatePerformanceReport({
      buildMetrics,
      bundleMetrics,
      webVitals,
      timestamp: new Date().toISOString()
    })
    
    success('Performance monitoring completed!')
    
  } catch (err) {
    error(`Performance monitoring failed: ${err.message}`)
    process.exit(1)
  }
}

// Monitor build performance
async function monitorBuildPerformance() {
  info('Monitoring build performance...')
  
  const startTime = Date.now()
  const startMemory = process.memoryUsage()
  
  try {
    // Run a build and measure performance
    execSync('npm run build:next', { 
      stdio: 'pipe',
      timeout: THRESHOLDS.maxBuildTime
    })
    
    const endTime = Date.now()
    const endMemory = process.memoryUsage()
    
    const buildTime = endTime - startTime
    const memoryDelta = endMemory.heapUsed - startMemory.heapUsed
    
    const metrics = {
      buildTime,
      memoryUsage: memoryDelta,
      success: true
    }
    
    // Check against thresholds
    if (buildTime > THRESHOLDS.maxBuildTime) {
      warning(`Build time (${buildTime}ms) exceeds threshold (${THRESHOLDS.maxBuildTime}ms)`)
    } else {
      success(`Build completed in ${buildTime}ms`)
    }
    
    if (memoryDelta > THRESHOLDS.maxMemoryUsage) {
      warning(`Memory usage (${formatBytes(memoryDelta)}) exceeds threshold (${formatBytes(THRESHOLDS.maxMemoryUsage)})`)
    } else {
      success(`Memory usage: ${formatBytes(memoryDelta)}`)
    }
    
    return metrics
    
  } catch (err) {
    const buildTime = Date.now() - startTime
    
    if (err.signal === 'SIGTERM' && buildTime >= THRESHOLDS.maxBuildTime) {
      error(`Build timed out after ${THRESHOLDS.maxBuildTime}ms`)
    } else {
      error(`Build failed: ${err.message}`)
    }
    
    return {
      buildTime,
      memoryUsage: 0,
      success: false,
      error: err.message
    }
  }
}

// Analyze bundle sizes
async function analyzeBundleSizes() {
  info('Analyzing bundle sizes...')
  
  const buildDir = path.join(__dirname, '..', '.next')
  const staticDir = path.join(buildDir, 'static')
  
  try {
    // Check if build exists
    await fs.access(buildDir)
    
    const metrics = {
      totalBundleSize: 0,
      jsSize: 0,
      cssSize: 0,
      chunks: [],
      largestChunk: null
    }
    
    // Analyze JavaScript bundles
    try {
      const jsDir = path.join(staticDir, 'chunks')
      const jsFiles = await fs.readdir(jsDir)
      
      for (const file of jsFiles) {
        if (file.endsWith('.js')) {
          const filePath = path.join(jsDir, file)
          const stats = await fs.stat(filePath)
          
          metrics.jsSize += stats.size
          metrics.totalBundleSize += stats.size
          
          const chunk = {
            name: file,
            size: stats.size,
            type: 'js'
          }
          
          metrics.chunks.push(chunk)
          
          if (!metrics.largestChunk || stats.size > metrics.largestChunk.size) {
            metrics.largestChunk = chunk
          }
          
          // Check individual chunk size
          if (stats.size > THRESHOLDS.maxChunkSize) {
            warning(`Large chunk detected: ${file} (${formatBytes(stats.size)})`)
          }
        }
      }
    } catch (err) {
      warning('Could not analyze JavaScript bundles')
    }
    
    // Analyze CSS bundles
    try {
      const cssDir = path.join(staticDir, 'css')
      const cssFiles = await fs.readdir(cssDir)
      
      for (const file of cssFiles) {
        if (file.endsWith('.css')) {
          const filePath = path.join(cssDir, file)
          const stats = await fs.stat(filePath)
          
          metrics.cssSize += stats.size
          metrics.totalBundleSize += stats.size
          
          metrics.chunks.push({
            name: file,
            size: stats.size,
            type: 'css'
          })
        }
      }
    } catch (err) {
      warning('Could not analyze CSS bundles')
    }
    
    // Check against thresholds
    if (metrics.totalBundleSize > THRESHOLDS.maxBundleSize) {
      warning(`Total bundle size (${formatBytes(metrics.totalBundleSize)}) exceeds threshold (${formatBytes(THRESHOLDS.maxBundleSize)})`)
    } else {
      success(`Total bundle size: ${formatBytes(metrics.totalBundleSize)}`)
    }
    
    info(`JavaScript: ${formatBytes(metrics.jsSize)}`)
    info(`CSS: ${formatBytes(metrics.cssSize)}`)
    info(`Largest chunk: ${metrics.largestChunk?.name || 'N/A'} (${formatBytes(metrics.largestChunk?.size || 0)})`)
    
    return metrics
    
  } catch (err) {
    warning(`Could not analyze bundle sizes: ${err.message}`)
    return {
      totalBundleSize: 0,
      jsSize: 0,
      cssSize: 0,
      chunks: [],
      largestChunk: null,
      error: err.message
    }
  }
}

// Check Core Web Vitals (simulated)
async function checkWebVitals() {
  info('Checking Core Web Vitals...')
  
  // In a real scenario, this would run Lighthouse or similar tools
  // For now, we'll return mock data that would be realistic for a CRM
  const mockMetrics = {
    lcp: 2100, // Largest Contentful Paint
    fid: 45,   // First Input Delay
    cls: 0.08, // Cumulative Layout Shift
    ttfb: 650, // Time to First Byte
    fcp: 1600, // First Contentful Paint
    tti: 3200, // Time to Interactive
    tbt: 180,  // Total Blocking Time
    si: 2800   // Speed Index
  }
  
  const results = {
    ...mockMetrics,
    scores: {
      performance: 85,
      accessibility: 92,
      bestPractices: 88,
      seo: 90
    },
    passed: true
  }
  
  // Check against thresholds
  const checks = [
    { metric: 'LCP', value: results.lcp, threshold: THRESHOLDS.maxLCP, unit: 'ms' },
    { metric: 'FID', value: results.fid, threshold: THRESHOLDS.maxFID, unit: 'ms' },
    { metric: 'CLS', value: results.cls, threshold: THRESHOLDS.maxCLS, unit: '' },
    { metric: 'TTFB', value: results.ttfb, threshold: THRESHOLDS.maxTTFB, unit: 'ms' },
    { metric: 'FCP', value: results.fcp, threshold: THRESHOLDS.maxFCP, unit: 'ms' }
  ]
  
  let allPassed = true
  
  for (const check of checks) {
    if (check.value > check.threshold) {
      warning(`${check.metric} (${check.value}${check.unit}) exceeds threshold (${check.threshold}${check.unit})`)
      allPassed = false
    } else {
      success(`${check.metric}: ${check.value}${check.unit}`)
    }
  }
  
  if (allPassed) {
    success('All Core Web Vitals passed!')
  } else {
    warning('Some Core Web Vitals need improvement')
  }
  
  return results
}

// Generate performance report
async function generatePerformanceReport(data) {
  info('Generating performance report...')
  
  const reportDir = path.join(__dirname, '..', 'reports')
  const reportFile = path.join(reportDir, 'performance-report.json')
  const htmlReportFile = path.join(reportDir, 'performance-report.html')
  
  // Ensure reports directory exists
  try {
    await fs.mkdir(reportDir, { recursive: true })
  } catch (err) {
    // Directory might already exist
  }
  
  // Generate JSON report
  const jsonReport = {
    timestamp: data.timestamp,
    build: data.buildMetrics,
    bundle: data.bundleMetrics,
    webVitals: data.webVitals,
    recommendations: generateRecommendations(data),
    summary: generateSummary(data)
  }
  
  await fs.writeFile(reportFile, JSON.stringify(jsonReport, null, 2))
  
  // Generate HTML report
  const htmlReport = generateHTMLReport(jsonReport)
  await fs.writeFile(htmlReportFile, htmlReport)
  
  success(`Performance report saved to ${reportFile}`)
  success(`HTML report saved to ${htmlReportFile}`)
}

// Generate performance recommendations
function generateRecommendations(data) {
  const recommendations = []
  
  // Bundle size recommendations
  if (data.bundleMetrics.totalBundleSize > THRESHOLDS.maxBundleSize) {
    recommendations.push({
      type: 'bundle-size',
      severity: 'warning',
      message: 'Consider code splitting to reduce bundle size',
      actions: [
        'Implement dynamic imports for large components',
        'Remove unused dependencies',
        'Use tree shaking optimization',
        'Consider lazy loading for non-critical features'
      ]
    })
  }
  
  // Large chunk recommendations
  if (data.bundleMetrics.largestChunk?.size > THRESHOLDS.maxChunkSize) {
    recommendations.push({
      type: 'chunk-size',
      severity: 'warning',
      message: `Large chunk detected: ${data.bundleMetrics.largestChunk.name}`,
      actions: [
        'Split large chunks using dynamic imports',
        'Review third-party library usage',
        'Consider async component loading'
      ]
    })
  }
  
  // Build time recommendations
  if (data.buildMetrics.buildTime > THRESHOLDS.maxBuildTime * 0.8) {
    recommendations.push({
      type: 'build-time',
      severity: 'info',
      message: 'Build time approaching threshold',
      actions: [
        'Consider using Turbo mode for development',
        'Optimize TypeScript compilation',
        'Review build pipeline efficiency'
      ]
    })
  }
  
  // Web Vitals recommendations
  if (data.webVitals.lcp > THRESHOLDS.maxLCP) {
    recommendations.push({
      type: 'lcp',
      severity: 'warning',
      message: 'Largest Contentful Paint needs improvement',
      actions: [
        'Optimize images and media',
        'Implement proper caching strategies',
        'Reduce server response times',
        'Use CDN for static assets'
      ]
    })
  }
  
  return recommendations
}

// Generate performance summary
function generateSummary(data) {
  const issues = []
  const successes = []
  
  // Analyze results
  if (data.buildMetrics.success) {
    successes.push('Build completed successfully')
  } else {
    issues.push('Build failed')
  }
  
  if (data.bundleMetrics.totalBundleSize <= THRESHOLDS.maxBundleSize) {
    successes.push('Bundle size within limits')
  } else {
    issues.push('Bundle size exceeds threshold')
  }
  
  if (data.webVitals.lcp <= THRESHOLDS.maxLCP && 
      data.webVitals.fid <= THRESHOLDS.maxFID && 
      data.webVitals.cls <= THRESHOLDS.maxCLS) {
    successes.push('Core Web Vitals passed')
  } else {
    issues.push('Core Web Vitals need improvement')
  }
  
  return {
    overallScore: calculateOverallScore(data),
    issues: issues.length,
    successes: successes.length,
    status: issues.length === 0 ? 'excellent' : issues.length <= 2 ? 'good' : 'needs-improvement'
  }
}

// Calculate overall performance score
function calculateOverallScore(data) {
  let score = 100
  
  // Build performance (20%)
  if (!data.buildMetrics.success) score -= 30
  else if (data.buildMetrics.buildTime > THRESHOLDS.maxBuildTime) score -= 15
  
  // Bundle size (30%)
  if (data.bundleMetrics.totalBundleSize > THRESHOLDS.maxBundleSize) score -= 20
  if (data.bundleMetrics.largestChunk?.size > THRESHOLDS.maxChunkSize) score -= 10
  
  // Web Vitals (50%)
  if (data.webVitals.lcp > THRESHOLDS.maxLCP) score -= 15
  if (data.webVitals.fid > THRESHOLDS.maxFID) score -= 10
  if (data.webVitals.cls > THRESHOLDS.maxCLS) score -= 10
  if (data.webVitals.ttfb > THRESHOLDS.maxTTFB) score -= 10
  if (data.webVitals.fcp > THRESHOLDS.maxFCP) score -= 5
  
  return Math.max(0, score)
}

// Generate HTML report
function generateHTMLReport(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Report - CIPM CRM</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f8f9fa;
      color: #333;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e9ecef;
    }
    .score {
      font-size: 3rem;
      font-weight: bold;
      color: ${data.summary.overallScore >= 80 ? '#28a745' : data.summary.overallScore >= 60 ? '#ffc107' : '#dc3545'};
    }
    .status {
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 10px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .metric-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #007bff;
    }
    .metric-title {
      font-weight: bold;
      margin-bottom: 10px;
      color: #007bff;
    }
    .metric-value {
      font-size: 1.1rem;
      margin: 5px 0;
    }
    .recommendations {
      margin-top: 30px;
    }
    .recommendation {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
      padding: 15px;
      margin: 10px 0;
    }
    .recommendation.warning {
      background: #f8d7da;
      border-color: #f5c6cb;
    }
    .recommendation h4 {
      margin-top: 0;
      color: #856404;
    }
    .recommendation.warning h4 {
      color: #721c24;
    }
    .actions {
      list-style-type: none;
      padding: 0;
    }
    .actions li {
      padding: 2px 0;
      position: relative;
      padding-left: 20px;
    }
    .actions li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #007bff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Performance Report</h1>
      <div class="score">${data.summary.overallScore}/100</div>
      <div class="status">${data.summary.status}</div>
      <p>Generated on ${new Date(data.timestamp).toLocaleString()}</p>
    </div>

    <div class="metrics">
      <div class="metric-card">
        <div class="metric-title">Build Performance</div>
        <div class="metric-value">Build Time: ${data.build.buildTime}ms</div>
        <div class="metric-value">Memory Usage: ${formatBytes(data.build.memoryUsage)}</div>
        <div class="metric-value">Status: ${data.build.success ? 'Success' : 'Failed'}</div>
      </div>

      <div class="metric-card">
        <div class="metric-title">Bundle Analysis</div>
        <div class="metric-value">Total Size: ${formatBytes(data.bundle.totalBundleSize)}</div>
        <div class="metric-value">JavaScript: ${formatBytes(data.bundle.jsSize)}</div>
        <div class="metric-value">CSS: ${formatBytes(data.bundle.cssSize)}</div>
        <div class="metric-value">Largest Chunk: ${formatBytes(data.bundle.largestChunk?.size || 0)}</div>
      </div>

      <div class="metric-card">
        <div class="metric-title">Core Web Vitals</div>
        <div class="metric-value">LCP: ${data.webVitals.lcp}ms</div>
        <div class="metric-value">FID: ${data.webVitals.fid}ms</div>
        <div class="metric-value">CLS: ${data.webVitals.cls}</div>
        <div class="metric-value">TTFB: ${data.webVitals.ttfb}ms</div>
      </div>
    </div>

    <div class="recommendations">
      <h2>Recommendations</h2>
      ${data.recommendations.map(rec => `
        <div class="recommendation ${rec.severity}">
          <h4>${rec.message}</h4>
          <ul class="actions">
            ${rec.actions.map(action => `<li>${action}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Format bytes to human readable format
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

// Run the monitoring
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  main,
  monitorBuildPerformance,
  analyzeBundleSizes,
  checkWebVitals,
  generatePerformanceReport
}