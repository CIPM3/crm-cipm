import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase using client SDK
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_DB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_DB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_DB_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
  status: string;
}

interface Content {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  status: string;
  type: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  status: string;
  enrollments: number;
  rating: number;
  modules: string[];
  type: string;
}

interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: string;
  order: number;
  status: string;
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  status: string;
  progress: number;
}

interface MigrationData {
  users: User[];
  content: Content[];
  cursos: Course[];
  modules: Module[];
  enrollments: Enrollment[];
  videos: any[];
  metadata: any;
}

// Sanitize data to ensure Firestore compatibility
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
      // Skip undefined values
      if (value === undefined) {
        continue;
      }
      // Convert empty strings to null or skip
      if (value === '') {
        sanitized[key] = null;
        continue;
      }
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeData(value);
    }
    return sanitized;
  }

  return obj;
}

async function uploadFirstCourse(dryRun: boolean = true) {
  console.log('🚀 Starting upload process...\n');

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
    console.log(`   ${idx + 1}. ${content.title} - ${content.description}`);
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

  console.log('\n🔥 Uploading to Firebase...\n');

  // Upload course (remove id from data as it's used in the document path)
  console.log(`📤 Uploading course: ${firstCourse.title}...`);
  const { id: courseId, ...courseDataRaw } = firstCourse;
  const courseData = sanitizeData(courseDataRaw);
  console.log('Course data to upload:', JSON.stringify(courseData, null, 2));
  try {
    await setDoc(doc(db, 'cursos', courseId), courseData);
    console.log(`   ✓ Course uploaded`);
  } catch (error) {
    console.error('   ✗ Error uploading course:', error);
    throw error;
  }

  // Upload modules
  console.log(`\n📤 Uploading ${courseModules.length} modules...`);
  for (const module of courseModules) {
    const { id: moduleId, ...moduleDataRaw } = module;
    const moduleData = sanitizeData(moduleDataRaw);
    try {
      await setDoc(doc(db, 'modules', moduleId), moduleData);
      console.log(`   ✓ Module uploaded: ${module.title}`);
    } catch (error) {
      console.error(`   ✗ Error uploading module ${module.title}:`, error);
      throw error;
    }
  }

  // Upload content
  console.log(`\n📤 Uploading ${courseContent.length} content items...`);
  let uploadCount = 0;
  for (const content of courseContent) {
    const { id: contentId, description, ...contentDataRaw } = content;
    // Remove description field and sanitize the rest
    const contentData = sanitizeData(contentDataRaw);
    try {
      await setDoc(doc(db, 'videos', contentId), contentData);
      uploadCount++;
      if (uploadCount % 5 === 0 || uploadCount === courseContent.length) {
        console.log(`   ✓ Uploaded ${uploadCount}/${courseContent.length} content items`);
      }
    } catch (error) {
      console.error(`   ✗ Error uploading content ${content.title}:`, error);
      console.error(`   Content data:`, JSON.stringify(contentData, null, 2));
      throw error;
    }
  }

  console.log('\n✅ Upload completed successfully!');
  console.log('\nSummary:');
  console.log(`- Course: 1 document uploaded to 'cursos' collection`);
  console.log(`- Modules: ${courseModules.length} documents uploaded to 'modules' collection`);
  console.log(`- Content: ${courseContent.length} documents uploaded to 'videos' collection`);
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
    console.error('❌ Error:', error);
    process.exit(1);
  });
