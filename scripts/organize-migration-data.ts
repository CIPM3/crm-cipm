import * as fs from 'fs';
import * as path from 'path';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
  status: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  price?: number;
  duration?: string;
  status?: string;
  enrollments?: number;
  rating?: number;
  modules?: string[];
  type?: string;
  order?: number;
}

interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  status?: string;
}

interface Content {
  id: string;
  moduleId: string;
  courseId: string;
  type: string;
  title: string;
  description?: string;
  duration?: string;
  url?: string;
  order?: number;
  questions?: number;
}

interface MigrationData {
  users: User[];
  cursos: Course[];
  modules: Module[];
  content: Content[];
}

async function organizeMigrationData() {
  console.log('📚 Organizando datos de migración...\n');

  // Read the file
  const filePath = path.join(process.cwd(), 'final-migration-data.json');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data: MigrationData = JSON.parse(fileContent);

  console.log('📊 Datos actuales:');
  console.log(`   - Usuarios: ${data.users?.length || 0}`);
  console.log(`   - Cursos: ${data.cursos?.length || 0}`);
  console.log(`   - Módulos: ${data.modules?.length || 0}`);
  console.log(`   - Contenidos: ${data.content?.length || 0}\n`);

  // Organize data
  const organized: MigrationData = {
    users: [],
    cursos: [],
    modules: [],
    content: []
  };

  // 1. Sort and clean users
  if (data.users) {
    organized.users = data.users
      .map(user => ({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'student',
        avatar: user.avatar || '',
        createdAt: user.createdAt || new Date().toISOString(),
        status: user.status || 'active'
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // 2. Sort and clean courses
  if (data.cursos) {
    organized.cursos = data.cursos
      .map((course, index) => ({
        id: course.id,
        title: course.title || '',
        description: course.description || '',
        price: course.price || 0,
        duration: course.duration || '',
        status: course.status || 'active',
        enrollments: course.enrollments || 0,
        rating: course.rating || 0,
        modules: course.modules || [],
        type: course.type || 'online',
        order: course.order !== undefined ? course.order : index
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // 3. Sort and clean modules
  if (data.modules) {
    organized.modules = data.modules
      .map((module, index) => ({
        id: module.id,
        courseId: module.courseId,
        title: module.title || '',
        order: module.order !== undefined ? module.order : index,
        status: module.status || 'active'
      }))
      .sort((a, b) => {
        // First sort by courseId, then by order
        if (a.courseId !== b.courseId) {
          return a.courseId.localeCompare(b.courseId);
        }
        return (a.order || 0) - (b.order || 0);
      });
  }

  // 4. Sort and clean content
  if (data.content) {
    organized.content = data.content
      .map((content: any, index) => ({
        id: content.id,
        moduleId: content.moduleId,
        courseId: content.courseId,
        type: content.type || 'video',
        title: content.title || '',
        description: content.description || '',
        duration: content.duration || '',
        url: content.url || '',
        questions: content.questions || 0,
        order: content.order !== undefined ? content.order : index
      }))
      .sort((a, b) => {
        // First sort by courseId, then moduleId, then order, then title
        if (a.courseId !== b.courseId) {
          return a.courseId.localeCompare(b.courseId);
        }
        if (a.moduleId !== b.moduleId) {
          return a.moduleId.localeCompare(b.moduleId);
        }
        if (a.order !== b.order) {
          return (a.order || 0) - (b.order || 0);
        }
        // If order is the same, sort by title
        return a.title.localeCompare(b.title);
      });
  }

  console.log('✅ Datos organizados:');
  console.log(`   - Usuarios: ${organized.users.length} (ordenados alfabéticamente)`);
  console.log(`   - Cursos: ${organized.cursos.length} (ordenados por order)`);
  console.log(`   - Módulos: ${organized.modules.length} (ordenados por courseId y order)`);
  console.log(`   - Contenidos: ${organized.content.length} (ordenados por courseId, moduleId, order y título)\n`);

  // Show first course structure
  if (organized.cursos.length > 0) {
    const firstCourse = organized.cursos[0];
    const courseModules = organized.modules.filter(m => m.courseId === firstCourse.id);
    const courseContent = organized.content.filter(c => c.courseId === firstCourse.id);

    console.log('📚 Primer curso:');
    console.log(`   ID: ${firstCourse.id}`);
    console.log(`   Título: ${firstCourse.title}`);
    console.log(`   Módulos: ${courseModules.length}`);
    console.log(`   Contenidos: ${courseContent.length}\n`);

    if (courseModules.length > 0) {
      console.log('   📦 Módulos:');
      courseModules.forEach((module, idx) => {
        const moduleContent = organized.content.filter(c => c.moduleId === module.id);
        console.log(`      ${idx + 1}. ${module.title} (${moduleContent.length} contenidos)`);

        // Show first 3 contents as examples
        if (moduleContent.length > 0) {
          const firstContents = moduleContent.slice(0, 3);
          firstContents.forEach((content, contentIdx) => {
            console.log(`         ${contentIdx + 1}. ${content.title}`);
            if (content.description) {
              console.log(`            └─ ${content.description}`);
            }
          });
          if (moduleContent.length > 3) {
            console.log(`         ... y ${moduleContent.length - 3} más`);
          }
        }
      });
      console.log('');
    }
  }

  // Write organized data
  const outputPath = path.join(process.cwd(), 'final-migration-data-organized.json');
  fs.writeFileSync(outputPath, JSON.stringify(organized, null, 2), 'utf-8');

  console.log(`✅ Archivo organizado guardado en: ${outputPath}\n`);

  // Backup original
  const backupPath = path.join(process.cwd(), 'final-migration-data-backup.json');
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`💾 Backup del original guardado en: ${backupPath}\n`);
  }

  console.log('✨ ¡Proceso completado!');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Revisa el archivo: final-migration-data-organized.json');
  console.log('   2. Si todo está bien, reemplaza el original:');
  console.log('      mv final-migration-data-organized.json final-migration-data.json');
}

organizeMigrationData().catch(console.error);
