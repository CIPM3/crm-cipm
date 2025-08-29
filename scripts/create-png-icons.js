#!/usr/bin/env node

/**
 * PNG Icon Creator for Better PWA Compatibility
 * 
 * This script creates PNG versions of our SVG icons for browsers that don't support SVG icons
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/icons');
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

/**
 * Create a simple PNG icon using Canvas-like SVG to PNG conversion
 * For production use, you would typically use a proper SVG to PNG converter
 * This creates a simple colored rectangle as a fallback
 */
function createPNGFallbackSVG(size, text = 'CIPM') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1f2937"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.floor(size * 0.15)}" 
        font-weight="bold" fill="#ffffff" text-anchor="middle" dy="0.3em">${text}</text>
  <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="${Math.floor(size * 0.08)}" 
        fill="#9ca3af" text-anchor="middle" dy="0.3em">CRM</text>
</svg>`;
}

// Create PNG-named SVG files as fallbacks
console.log('🔄 Creating PNG fallback files...\n');

ICON_SIZES.forEach(size => {
  const svgContent = createPNGFallbackSVG(size);
  const pngFilename = `icon-${size}x${size}.png`;
  const pngFilepath = path.join(OUTPUT_DIR, pngFilename);
  
  // Create a basic SVG file with PNG extension for fallback
  // In production, you would use a proper SVG to PNG converter
  fs.writeFileSync(pngFilepath, svgContent);
  console.log(`✅ Created fallback ${pngFilename}`);
});

// Create PNG versions for shortcuts
const shortcuts = ['dashboard', 'students', 'courses', 'calendar'];
shortcuts.forEach(shortcut => {
  const shortcutTexts = {
    dashboard: 'DASH',
    students: 'STUD', 
    courses: 'CURS',
    calendar: 'CAL'
  };
  
  const svgContent = createPNGFallbackSVG(96, shortcutTexts[shortcut] || shortcut.slice(0, 4).toUpperCase());
  const pngFilename = `${shortcut}-96x96.png`;
  const pngFilepath = path.join(OUTPUT_DIR, pngFilename);
  
  fs.writeFileSync(pngFilepath, svgContent);
  console.log(`✅ Created fallback ${pngFilename}`);
});

console.log('\n🎉 PNG fallback files created successfully!');
console.log('\n💡 Note: These are SVG files with PNG extensions as fallbacks.');
console.log('For production, consider using a proper SVG to PNG converter like:');
console.log('- sharp (npm package)');
console.log('- puppeteer for headless browser conversion');
console.log('- ImageMagick convert command');