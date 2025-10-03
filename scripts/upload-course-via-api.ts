import * as fs from 'fs';
import * as path from 'path';

// Simular el proceso de agregar cursos usando la misma función que usa la UI
import { createCurso } from '../lib/firebase/courses';

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

interface MigrationData {
  users: any[];
  content: Content[];
  cursos: Course[];
  modules: Module[];
  enrollments: any[];
  videos: any[];
  metadata: any;
}

async function uploadFirstCourse(dryRun: boolean = true) {
  console.log('🚀 Starting upload process via API...\n');

  // Read migration data
  const dataPath = path.join(__dirname, '../final-migration-data.json');
  const migrationData: MigrationData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Get first course
  const firstCourse = migrationData.cursos[0];
  console.log(`📚 First Course: ${firstCourse.title} (ID: ${firstCourse.id})`);
  console.log(`   Description: ${firstCourse.description}`);

  // Get modules for this course
  const courseModules = migrationData.modules.filter(m => m.courseId === firstCourse.id);
  console.log(`\n📦 Modules found: ${courseModules.length}`);

  // Get content for this course
  const courseContent = migrationData.content.filter(c => c.courseId === firstCourse.id);
  console.log(`🎬 Content items found: ${courseContent.length}`);

  if (dryRun) {
    console.log('\n✅ DRY RUN - No data uploaded');
    console.log('\nTo upload, this approach requires authentication through the web app');
    console.log('Alternative: Use Firebase Admin SDK with service account credentials');
    return;
  }

  console.log('\n⚠️  This method requires running from a browser context with authentication');
  console.log('Please use the web interface or Firebase Admin SDK instead');
}

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
