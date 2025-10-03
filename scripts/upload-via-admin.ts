import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_DB_PROJECT_ID || 'crm-cipm',
  });
}

const db = admin.firestore();

interface MigrationData {
  users: any[];
  content: any[];
  cursos: any[];
  modules: any[];
  enrollments: any[];
  videos: any[];
  metadata: any;
}

// Sanitize data for Firestore
function sanitizeData(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        continue;
      }
      if (value === '') {
        sanitized[key] = null;
        continue;
      }
      sanitized[key] = sanitizeData(value);
    }
    return sanitized;
  }

  return obj;
}

async function uploadFirstCourse(dryRun: boolean = true) {
  console.log('🚀 Starting upload process using Firebase Admin SDK...\n');

  // Read migration data
  const dataPath = path.join(__dirname, '../final-migration-data.json');
  const migrationData: MigrationData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Get first course
  const firstCourse = migrationData.cursos[0];
  console.log(`📚 First Course: ${firstCourse.title} (ID: ${firstCourse.id})`);
  console.log(`   Description: ${firstCourse.description}`);
  console.log(`   Modules: ${firstCourse.modules.length}`);

  // Get modules for this course
  const courseModules = migrationData.modules.filter(m => m.courseId === firstCourse.id);
  console.log(`\n📦 Modules found: ${courseModules.length}`);
  courseModules.forEach((module, idx) => {
    console.log(`   ${idx + 1}. ${module.title} (ID: ${module.id})`);
  });

  // Get content for this course
  const courseContent = migrationData.content.filter(c => c.courseId === firstCourse.id);
  console.log(`\n🎬 Content items found: ${courseContent.length}`);
  courseContent.slice(0, 5).forEach((content, idx) => {
    console.log(`   ${idx + 1}. ${content.title}`);
  });
  if (courseContent.length > 5) {
    console.log(`   ... and ${courseContent.length - 5} more`);
  }

  if (dryRun) {
    console.log('\n✅ DRY RUN - No data uploaded');
    console.log('\nSummary:');
    console.log(`- Course: 1 document (${firstCourse.id})`);
    console.log(`- Modules: ${courseModules.length} documents`);
    console.log(`- Content: ${courseContent.length} documents`);
    console.log('\nRun with --execute flag to upload to Firebase');
    return;
  }

  console.log('\n🔥 Uploading to Firebase using Admin SDK...\n');

  try {
    // Upload course
    console.log(`📤 Uploading course: ${firstCourse.title}...`);
    const { id: courseId, ...courseDataRaw } = firstCourse;
    const courseData = sanitizeData(courseDataRaw);

    await db.collection('cursos').doc(courseId).set(courseData);
    console.log(`   ✓ Course uploaded successfully`);

    // Upload modules
    console.log(`\n📤 Uploading ${courseModules.length} modules...`);
    for (const module of courseModules) {
      const { id: moduleId, ...moduleDataRaw } = module;
      const moduleData = sanitizeData(moduleDataRaw);

      await db.collection('modules').doc(moduleId).set(moduleData);
      console.log(`   ✓ Module uploaded: ${module.title}`);
    }

    // Upload content in batches of 10
    console.log(`\n📤 Uploading ${courseContent.length} content items...`);
    const batchSize = 10;

    for (let i = 0; i < courseContent.length; i += batchSize) {
      const batch = db.batch();
      const batchContent = courseContent.slice(i, i + batchSize);

      for (const content of batchContent) {
        const { id: contentId, description, ...contentDataRaw } = content;
        const contentData = sanitizeData(contentDataRaw);

        const contentRef = db.collection('videos').doc(contentId);
        batch.set(contentRef, contentData);
      }

      await batch.commit();
      console.log(`   ✓ Uploaded ${Math.min(i + batchSize, courseContent.length)}/${courseContent.length} content items`);
    }

    console.log('\n✅ Upload completed successfully!');
    console.log('\nSummary:');
    console.log(`- Course: 1 document uploaded to 'cursos' collection`);
    console.log(`- Modules: ${courseModules.length} documents uploaded to 'modules' collection`);
    console.log(`- Content: ${courseContent.length} documents uploaded to 'videos' collection`);

  } catch (error) {
    console.error('\n❌ Error during upload:', error);
    throw error;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--execute');

uploadFirstCourse(dryRun)
  .then(() => {
    console.log('\n✨ Process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
