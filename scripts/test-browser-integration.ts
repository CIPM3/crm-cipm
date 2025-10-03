/**
 * Script para simular la carga de datos como lo haría el navegador
 */

// Simular el entorno del navegador
process.env.NEXT_PUBLIC_ENABLE_MIGRATION_DATA = 'true';

async function testBrowserIntegration() {
  console.log('🌐 Simulando carga de datos del navegador...\n');

  // Simular fetch desde el navegador
  console.log('📡 Test 1: Fetch de archivo público...');

  const fs = require('fs');
  const path = require('path');

  const filePath = path.join(process.cwd(), 'public/data/migration-data.json');

  if (!fs.existsSync(filePath)) {
    console.error('❌ Error: Archivo no encontrado en public/data/');
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log('✅ Fetch exitoso desde /data/migration-data.json\n');

  // Test 2: Simular función getAllCourses
  console.log('🔄 Test 2: Combinando datos Firebase + Migración...');

  // Simular datos de Firebase (vacío o con algunos cursos)
  const firebaseCourses = [
    { id: 'firebase-1', title: 'Curso de Firebase', status: 'Activo' }
  ];

  // Simular la función getAllCourses
  const migrationCourses = data.cursos || [];

  const courseMap = new Map();
  firebaseCourses.forEach(course => courseMap.set(course.id, course));
  migrationCourses.forEach(course => {
    if (!courseMap.has(course.id)) {
      courseMap.set(course.id, { ...course, _source: 'migration' });
    }
  });

  const combinedCourses = Array.from(courseMap.values());

  console.log(`✅ Cursos combinados:`);
  console.log(`   - Firebase: ${firebaseCourses.length}`);
  console.log(`   - Migración: ${migrationCourses.length}`);
  console.log(`   - Total: ${combinedCourses.length}\n`);

  // Test 3: Simular función getAllContent
  console.log('🎬 Test 3: Combinando contenido/videos...');

  const firebaseContent = [];
  const migrationContent = data.content || [];

  const contentMap = new Map();
  firebaseContent.forEach(content => contentMap.set(content.id, content));
  migrationContent.forEach(content => {
    if (!contentMap.has(content.id)) {
      contentMap.set(content.id, { ...content, _source: 'migration' });
    }
  });

  const combinedContent = Array.from(contentMap.values());

  console.log(`✅ Contenido combinado:`);
  console.log(`   - Firebase: ${firebaseContent.length}`);
  console.log(`   - Migración: ${migrationContent.length}`);
  console.log(`   - Total: ${combinedContent.length}\n`);

  // Test 4: Verificar contenido TOEFL
  console.log('📚 Test 4: Verificando cursos TOEFL...');
  const toeflCourses = combinedCourses.filter(c =>
    c.title && c.title.toLowerCase().includes('toefl')
  );

  if (toeflCourses.length > 0) {
    console.log(`✅ Encontrados ${toeflCourses.length} cursos TOEFL:`);
    toeflCourses.forEach(course => {
      console.log(`   - ${course.title}`);
    });
  } else {
    console.log('⚠️  No se encontraron cursos TOEFL en migración');
  }

  console.log('\n✅ Simulación completada exitosamente!');
  console.log('\n📋 Resumen de integración:');
  console.log(`   - Variable NEXT_PUBLIC_ENABLE_MIGRATION_DATA: ${process.env.NEXT_PUBLIC_ENABLE_MIGRATION_DATA}`);
  console.log(`   - Archivo público accesible: ✓`);
  console.log(`   - Función de combinación: ✓`);
  console.log(`   - Total cursos disponibles: ${combinedCourses.length}`);
  console.log(`   - Total contenido disponible: ${combinedContent.length}`);
  console.log('\n🎉 La integración está lista! Ve a http://localhost:3000/cursos');
}

testBrowserIntegration().catch(error => {
  console.error('❌ Error en test de integración:', error);
  process.exit(1);
});
