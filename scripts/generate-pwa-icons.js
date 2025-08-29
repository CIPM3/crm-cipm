#!/usr/bin/env node

/**
 * PWA Icon Generator for CIPM CRM System
 * 
 * This script generates PNG icons in various sizes from a base design.
 * Creates professional business-appropriate icons for the CRM system.
 */

const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SHORTCUT_SIZES = [96];

// Output directory
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate SVG content for an icon with given size
 * @param {number} size - Icon size in pixels
 * @param {string} text - Text to display (default: CIPM)
 * @param {string} bgColor - Background color
 * @param {string} textColor - Text color
 */
function generateIconSVG(size, text = 'CIPM', bgColor = '#1f2937', textColor = '#ffffff') {
  const fontSize = Math.max(12, Math.floor(size * 0.15));
  const strokeWidth = Math.max(1, Math.floor(size * 0.02));
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background with rounded corners for modern look -->
  <rect width="${size}" height="${size}" rx="${size * 0.1}" ry="${size * 0.1}" fill="url(#grad${size})" stroke="#4b5563" stroke-width="${strokeWidth}"/>
  
  <!-- Main text -->
  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" 
        fill="${textColor}" text-anchor="middle" dy="0.3em">${text}</text>
  
  <!-- Subtitle -->
  <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="${Math.floor(fontSize * 0.6)}" 
        fill="#9ca3af" text-anchor="middle" dy="0.3em">CRM</text>
  
  <!-- Decorative element -->
  <circle cx="50%" cy="25%" r="${size * 0.04}" fill="#10b981" opacity="0.8"/>
  <circle cx="50%" cy="25%" r="${size * 0.02}" fill="#34d399"/>
</svg>`;
}

/**
 * Generate shortcut icon SVG content
 * @param {number} size - Icon size
 * @param {string} icon - Icon type (dashboard, students, courses, calendar)
 */
function generateShortcutIconSVG(size, icon) {
  const bgColor = '#1f2937';
  const iconColor = '#ffffff';
  const accentColor = '#10b981';
  
  let iconPath = '';
  let iconText = '';
  
  switch (icon) {
    case 'dashboard':
      iconPath = `M${size * 0.3} ${size * 0.3} h${size * 0.15} v${size * 0.15} h-${size * 0.15} z 
                  M${size * 0.55} ${size * 0.3} h${size * 0.15} v${size * 0.15} h-${size * 0.15} z 
                  M${size * 0.3} ${size * 0.55} h${size * 0.15} v${size * 0.15} h-${size * 0.15} z 
                  M${size * 0.55} ${size * 0.55} h${size * 0.15} v${size * 0.15} h-${size * 0.15} z`;
      iconText = 'Dashboard';
      break;
    case 'students':
      iconPath = `M${size * 0.5} ${size * 0.35} c${size * 0.08} 0 ${size * 0.15} ${size * 0.07} ${size * 0.15} ${size * 0.15} 
                  s-${size * 0.07} ${size * 0.15} -${size * 0.15} ${size * 0.15} -${size * 0.15} -${size * 0.07} -${size * 0.15} -${size * 0.15} 
                  ${size * 0.07} -${size * 0.15} ${size * 0.15} -${size * 0.15} z 
                  M${size * 0.3} ${size * 0.65} c0 -${size * 0.1} ${size * 0.09} -${size * 0.18} ${size * 0.2} -${size * 0.18} 
                  h${size * 0.4} c${size * 0.11} 0 ${size * 0.2} ${size * 0.08} ${size * 0.2} ${size * 0.18} z`;
      iconText = 'Estudiantes';
      break;
    case 'courses':
      iconPath = `M${size * 0.3} ${size * 0.35} h${size * 0.4} v${size * 0.05} h-${size * 0.4} z 
                  M${size * 0.3} ${size * 0.45} h${size * 0.4} v${size * 0.05} h-${size * 0.4} z 
                  M${size * 0.3} ${size * 0.55} h${size * 0.25} v${size * 0.05} h-${size * 0.25} z`;
      iconText = 'Cursos';
      break;
    case 'calendar':
      iconPath = `M${size * 0.25} ${size * 0.3} h${size * 0.5} v${size * 0.4} h-${size * 0.5} z 
                  M${size * 0.35} ${size * 0.25} v${size * 0.1} M${size * 0.65} ${size * 0.25} v${size * 0.1} 
                  M${size * 0.25} ${size * 0.42} h${size * 0.5}`;
      iconText = 'Calendario';
      break;
    default:
      iconPath = '';
      iconText = icon;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shortcutGrad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.1}" ry="${size * 0.1}" fill="url(#shortcutGrad${size})"/>
  
  <!-- Icon -->
  <path d="${iconPath}" fill="${iconColor}" stroke="${iconColor}" stroke-width="${size * 0.02}"/>
  
  <!-- Accent -->
  <circle cx="${size * 0.85}" cy="${size * 0.15}" r="${size * 0.08}" fill="${accentColor}"/>
</svg>`;
}

// Generate main PWA icons
console.log('🎨 Generating PWA icons...\n');

ICON_SIZES.forEach(size => {
  const svgContent = generateIconSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Generated ${filename}`);
});

// Generate shortcut icons
console.log('\n🔗 Generating shortcut icons...\n');

const shortcuts = ['dashboard', 'students', 'courses', 'calendar'];
shortcuts.forEach(shortcut => {
  SHORTCUT_SIZES.forEach(size => {
    const svgContent = generateShortcutIconSVG(size, shortcut);
    const filename = `${shortcut}-${size}x${size}.svg`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    fs.writeFileSync(filepath, svgContent);
    console.log(`✅ Generated ${filename}`);
  });
});

// Generate favicon (16x16 and 32x32)
console.log('\n📄 Generating favicon icons...\n');

[16, 32].forEach(size => {
  const svgContent = generateIconSVG(size, 'C', '#1f2937', '#ffffff');
  const filename = `favicon-${size}x${size}.svg`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Generated ${filename}`);
});

// Generate Apple Touch Icon (180x180)
const appleTouchIconSVG = generateIconSVG(180, 'CIPM', '#1f2937', '#ffffff');
fs.writeFileSync(path.join(OUTPUT_DIR, 'apple-touch-icon.svg'), appleTouchIconSVG);
console.log('✅ Generated apple-touch-icon.svg');

console.log('\n🎉 All PWA icons generated successfully!');
console.log('\n📝 Next steps:');
console.log('1. Update your manifest.json to reference these icons');
console.log('2. Add favicon and apple-touch-icon links to your HTML head');
console.log('3. Test your PWA installation on various devices');