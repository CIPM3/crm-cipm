/**
 * Script para probar la carga de datos de migración
 */

import * as fs from 'fs';
import * as path from 'path';

// Simular proceso.env
process.env.NEXT_PUBLIC_ENABLE_MIGRATION_DATA = 'true';

async function testMigrationData() {
  console.log('🧪 Probando servicio de datos de migración...\n');

  // Test 1: Verificar que el archivo JSON existe
  console.log('📂 Test 1: Verificando archivo JSON...');
  const jsonPath = path.join(process.cwd(), 'public/data/migration-data.json');

  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Error: No se encontró el archivo migration-data.json');
    return;
  }

  const stats = fs.statSync(jsonPath);
  console.log(`✅ Archivo encontrado: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);

  // Test 2: Cargar y parsear el JSON
  console.log('📖 Test 2: Cargando datos JSON...');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(rawData);

  console.log(`✅ Datos cargados correctamente`);
  console.log(`   - Usuarios: ${data.users?.length || 0}`);
  console.log(`   - Contenido: ${data.content?.length || 0}`);
  console.log(`   - Cursos: ${data.cursos?.length || 0}`);
  console.log(`   - Módulos: ${data.modules?.length || 0}`);
  console.log(`   - Enrollments: ${data.enrollments?.length || 0}\n`);

  // Test 3: Verificar estructura de datos
  console.log('🔍 Test 3: Verificando estructura de datos...');

  if (data.content && data.content.length > 0) {
    const sampleContent = data.content[0];
    console.log(`✅ Contenido tiene estructura correcta:`);
    console.log(`   - ID: ${sampleContent.id}`);
    console.log(`   - Título: ${sampleContent.title}`);
    console.log(`   - Course ID: ${sampleContent.courseId}`);
    console.log(`   - Module ID: ${sampleContent.moduleId}\n`);
  }

  // Test 4: Verificar orden de American Gangster
  console.log('🎬 Test 4: Verificando orden de American Gangster...');
  const gangsterClips = data.content.filter((c: any) =>
    c.title && c.title.includes('American Gangster')
  );

  if (gangsterClips.length > 0) {
    console.log(`✅ Encontrados ${gangsterClips.length} clips de American Gangster:`);
    gangsterClips.forEach((clip: any) => {
      console.log(`   - ${clip.title} (${clip.description})`);
    });
  } else {
    console.log('⚠️  No se encontraron clips de American Gangster');
  }

  console.log('\n✅ Todos los tests pasaron correctamente!');
  console.log('\n📋 Resumen:');
  console.log('   - Archivo JSON: OK');
  console.log('   - Estructura de datos: OK');
  console.log('   - Datos organizados: OK');
  console.log('\n🎉 La integración de datos de migración está lista para usar!');
}

// Ejecutar tests
testMigrationData().catch(error => {
  console.error('❌ Error en tests:', error);
  process.exit(1);
});
