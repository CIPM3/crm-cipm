import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';

export default function UploadCoursePage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, step: '' });

  const uploadFirstCourse = async () => {
    setLoading(true);
    setStatus('🚀 Iniciando proceso de subida...\n');

    try {
      // Fetch migration data
      const response = await fetch('/data/migration-data.json');
      const migrationData = await response.json();

      // Get first course
      const firstCourse = migrationData.cursos[0];
      setStatus(prev => prev + `\n📚 Curso: ${firstCourse.title} (ID: ${firstCourse.id})`);

      // Get modules for this course
      const courseModules = migrationData.modules.filter((m: any) => m.courseId === firstCourse.id);
      setStatus(prev => prev + `\n📦 Módulos encontrados: ${courseModules.length}`);

      // Get content for this course
      const courseContent = migrationData.content.filter((c: any) => c.courseId === firstCourse.id);
      setStatus(prev => prev + `\n🎬 Contenidos encontrados: ${courseContent.length}`);

      setProgress({ current: 0, total: 1 + courseModules.length + courseContent.length, step: 'Subiendo curso...' });

      // Upload course (remove id from data)
      setStatus(prev => prev + `\n\n🔥 Subiendo a Firebase...\n`);
      setStatus(prev => prev + `\n📤 Subiendo curso: ${firstCourse.title}...`);

      const { id: courseId, ...courseData } = firstCourse;
      await setDoc(doc(db, COLLECTIONS.COURSES, courseId), courseData);
      setStatus(prev => prev + `\n   ✓ Curso subido a colección '${COLLECTIONS.COURSES}'`);
      setProgress(prev => ({ ...prev, current: prev.current + 1 }));

      // Upload modules
      setStatus(prev => prev + `\n\n📤 Subiendo ${courseModules.length} módulos...`);
      for (let i = 0; i < courseModules.length; i++) {
        const module = courseModules[i];
        setProgress(prev => ({ ...prev, current: prev.current + 1, step: `Subiendo módulo ${i + 1}/${courseModules.length}` }));

        const { id: moduleId, ...moduleData } = module;
        await setDoc(doc(db, COLLECTIONS.MODULES, moduleId), moduleData);
        setStatus(prev => prev + `\n   ✓ Módulo subido: ${module.title}`);
      }

      // Upload content
      setStatus(prev => prev + `\n\n📤 Subiendo ${courseContent.length} contenidos...`);
      for (let i = 0; i < courseContent.length; i++) {
        const content = courseContent[i];
        setProgress(prev => ({ ...prev, current: prev.current + 1, step: `Subiendo contenido ${i + 1}/${courseContent.length}` }));

        const { id: contentId, ...contentData } = content;
        await setDoc(doc(db, COLLECTIONS.CONTENTS, contentId), contentData);

        if ((i + 1) % 5 === 0 || i + 1 === courseContent.length) {
          setStatus(prev => prev + `\n   ✓ Subidos ${i + 1}/${courseContent.length} contenidos`);
        }
      }

      setStatus(prev => prev + `\n\n✅ ¡Subida completada con éxito!`);
      setStatus(prev => prev + `\n\nResumen:`);
      setStatus(prev => prev + `\n- Curso: 1 documento subido a '${COLLECTIONS.COURSES}'`);
      setStatus(prev => prev + `\n- Módulos: ${courseModules.length} documentos subidos a '${COLLECTIONS.MODULES}'`);
      setStatus(prev => prev + `\n- Contenidos: ${courseContent.length} documentos subidos a '${COLLECTIONS.CONTENTS}'`);

      setProgress(prev => ({ ...prev, step: 'Completado' }));

    } catch (error: any) {
      console.error('Error:', error);
      setStatus(prev => prev + `\n\n❌ Error: ${error.message}`);
      setStatus(prev => prev + `\n   Código: ${error.code}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }}>
      <h1>📚 Upload First Course to Firebase</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={uploadFirstCourse}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Subiendo...' : '🚀 Subir Primer Curso'}
        </button>
      </div>

      {progress.total > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>
            {progress.step} ({progress.current}/{progress.total})
          </div>
          <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
                height: '100%',
                backgroundColor: '#0070f3',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      )}

      <pre style={{
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        padding: '20px',
        borderRadius: '8px',
        maxHeight: '600px',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
      }}>
        {status || 'Haz clic en el botón para comenzar...'}
      </pre>

      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
        <strong>⚠️ Importante:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Debes estar autenticado como admin o instructor</li>
          <li>El archivo migration-data.json debe estar en /public/data/</li>
          <li>Se subirá el primer curso (Toefl Listening) con sus módulos y contenidos</li>
        </ul>
      </div>
    </div>
  );
}
