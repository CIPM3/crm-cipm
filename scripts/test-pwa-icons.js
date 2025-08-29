#!/usr/bin/env node

/**
 * PWA Icon Test Script
 * Tests that all PWA icons referenced in manifest.json are accessible
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVER_PORT = 3001; // Using port 3001 as shown in the dev server output
const SERVER_HOST = 'localhost';

// Read manifest.json to get all icon paths
const manifestPath = path.join(__dirname, '../public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Extract all icon URLs from manifest
const iconUrls = [];

// Main icons
if (manifest.icons) {
  manifest.icons.forEach(icon => {
    iconUrls.push(icon.src);
  });
}

// Shortcut icons
if (manifest.shortcuts) {
  manifest.shortcuts.forEach(shortcut => {
    if (shortcut.icons) {
      shortcut.icons.forEach(icon => {
        iconUrls.push(icon.src);
      });
    }
  });
}

// Remove duplicates
const uniqueIconUrls = [...new Set(iconUrls)];

/**
 * Test if an icon URL is accessible
 */
function testIcon(iconPath) {
  return new Promise((resolve) => {
    const options = {
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: iconPath,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      resolve({
        path: iconPath,
        status: res.statusCode,
        success: res.statusCode === 200
      });
    });

    req.on('error', (err) => {
      resolve({
        path: iconPath,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        path: iconPath,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

// Test all icons
async function testAllIcons() {
  console.log('🧪 Testing PWA Icons...\n');
  console.log(`Server: http://${SERVER_HOST}:${SERVER_PORT}`);
  console.log(`Testing ${uniqueIconUrls.length} unique icon URLs\n`);

  const results = [];
  
  for (const iconUrl of uniqueIconUrls) {
    const result = await testIcon(iconUrl);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.path} - Status: ${result.status}`);
    } else {
      console.log(`❌ ${result.path} - Status: ${result.status}${result.error ? ` (${result.error})` : ''}`);
    }
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📋 Total: ${results.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All PWA icons are accessible!');
  } else {
    console.log('\n⚠️  Some icons failed to load. Check the failed URLs above.');
  }

  // Test manifest.json accessibility
  console.log('\n📄 Testing manifest.json...');
  const manifestResult = await testIcon('/manifest.json');
  if (manifestResult.success) {
    console.log('✅ manifest.json is accessible');
  } else {
    console.log('❌ manifest.json failed to load');
  }

  return results;
}

// Run tests
testAllIcons().catch(console.error);