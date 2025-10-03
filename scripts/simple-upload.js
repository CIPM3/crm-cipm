const fs = require('fs');
const https = require('https');

// Read environment variables from .env file
const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const PROJECT_ID = envVars.NEXT_PUBLIC_DB_PROJECT_ID;
const API_KEY = envVars.NEXT_PUBLIC_DB_API_KEY;

console.log('🚀 Starting upload process...\n');

// Read migration data
const migrationData = JSON.parse(fs.readFileSync('final-migration-data.json', 'utf-8'));

// Get first course
const firstCourse = migrationData.cursos[0];
console.log(`📚 First Course: ${firstCourse.title} (ID: ${firstCourse.id})`);

// Get modules and content
const courseModules = migrationData.modules.filter(m => m.courseId === firstCourse.id);
const courseContent = migrationData.content.filter(c => c.courseId === firstCourse.id);

console.log(`📦 Modules found: ${courseModules.length}`);
console.log(`🎬 Content items found: ${courseContent.length}`);
console.log('\n🔥 Uploading to Firebase...\n');

// Helper function to convert JS object to Firestore fields format
function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'id') continue; // Skip id field

    if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        fields[key] = { integerValue: value.toString() };
      } else {
        fields[key] = { doubleValue: value };
      }
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (Array.isArray(value)) {
      fields[key] = {
        arrayValue: {
          values: value.map(v => ({ stringValue: v }))
        }
      };
    } else if (value === null) {
      fields[key] = { nullValue: null };
    }
  }
  return fields;
}

// Helper function to make Firestore REST API request
function firestoreRequest(collection, documentId, data) {
  return new Promise((resolve, reject) => {
    const fields = toFirestoreFields(data);
    const body = JSON.stringify({ fields });

    const options = {
      hostname: 'firestore.googleapis.com',
      port: 443,
      path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${documentId}?key=${API_KEY}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(body);
    req.end();
  });
}

// Main upload function
async function upload() {
  try {
    // Upload course
    console.log(`📤 Uploading course: ${firstCourse.title}...`);
    await firestoreRequest('cursos', firstCourse.id, firstCourse);
    console.log(`   ✓ Course uploaded`);

    // Upload modules
    console.log(`\n📤 Uploading ${courseModules.length} modules...`);
    for (const module of courseModules) {
      await firestoreRequest('modules', module.id, module);
      console.log(`   ✓ Module uploaded: ${module.title}`);
    }

    // Upload content
    console.log(`\n📤 Uploading ${courseContent.length} content items...`);
    for (let i = 0; i < courseContent.length; i++) {
      const content = courseContent[i];
      await firestoreRequest('videos', content.id, content);

      if ((i + 1) % 5 === 0 || i + 1 === courseContent.length) {
        console.log(`   ✓ Uploaded ${i + 1}/${courseContent.length} content items`);
      }
    }

    console.log('\n✅ Upload completed successfully!');
    console.log('\nSummary:');
    console.log(`- Course: 1 document uploaded to 'cursos' collection`);
    console.log(`- Modules: ${courseModules.length} documents uploaded to 'modules' collection`);
    console.log(`- Content: ${courseContent.length} documents uploaded to 'videos' collection`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

upload();
