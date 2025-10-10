'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

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

interface Content {
  id: string;
  title: string;
  description?: string;
  type: string;
  url: string;
  duration: string;
  questions?: number;
  moduleId: string;
  courseId: string;
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

export default function MigracionPage() {
  const [migrationData, setMigrationData] = useState<MigrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [uploadingCourseId, setUploadingCourseId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/migration/data')
      .then(res => res.json())
      .then(data => {
        setMigrationData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading migration data:', err);
        setLoadError('Error al cargar datos de migración');
        setLoading(false);
      });
  }, []);

  const uploadCourse = async (courseIndex: number) => {
    if (!migrationData) return;

    const course = migrationData.cursos[courseIndex];
    setUploadingCourseId(course.id);
    setProgress(prev => ({ ...prev, [course.id]: `📚 Subiendo curso: ${course.title}...` }));
    setErrors(prev => ({ ...prev, [course.id]: '' }));
    setSuccesses(prev => ({ ...prev, [course.id]: false }));

    try {
      // Get modules for this course
      const courseModules = migrationData.modules.filter(
        m => m.courseId === course.id
      );

      // Get content for this course
      const courseContent = migrationData.content.filter(
        c => c.courseId === course.id
      );

      console.log(`Curso: ${course.title}`);
      console.log(`Módulos: ${courseModules.length}`);
      console.log(`Contenido: ${courseContent.length}`);

      // Upload course
      const { id: courseId, ...courseDataRaw } = course;
      const courseData = sanitizeData(courseDataRaw);

      setProgress(prev => ({ ...prev, [course.id]: `📤 Subiendo curso...` }));
      await setDoc(doc(db, 'Cursos', courseId), courseData);

      // Upload modules
      setProgress(prev => ({ ...prev, [course.id]: `📤 Subiendo ${courseModules.length} módulos...` }));
      for (const module of courseModules) {
        const { id: moduleId, ...moduleDataRaw } = module;
        const moduleData = sanitizeData(moduleDataRaw);
        await setDoc(doc(db, 'Modulos', moduleId), moduleData);
      }

      // Upload content
      setProgress(prev => ({ ...prev, [course.id]: `📤 Subiendo ${courseContent.length} videos...` }));
      let uploadCount = 0;
      for (const content of courseContent) {
        const { id: contentId, description, questions, ...contentDataRaw } = content;

        // Map fields to correct structure - keep 'url' as is, don't rename to 'videoUrl'
        const contentData = sanitizeData({
          ...contentDataRaw,
          order: uploadCount + 1,
          status: 'Activo'
        });

        await setDoc(doc(db, 'Content', contentId), contentData);
        uploadCount++;

        if (uploadCount % 5 === 0 || uploadCount === courseContent.length) {
          setProgress(prev => ({ ...prev, [course.id]: `📤 Subiendo videos: ${uploadCount}/${courseContent.length}` }));
        }
      }

      setSuccesses(prev => ({ ...prev, [course.id]: true }));
      setProgress(prev => ({
        ...prev,
        [course.id]: `✅ Curso subido exitosamente!
- Curso: 1 documento
- Módulos: ${courseModules.length} documentos
- Videos: ${courseContent.length} documentos`
      }));

    } catch (err: any) {
      console.error('Error al subir curso:', err);
      setErrors(prev => ({ ...prev, [course.id]: `❌ Error: ${err.message}` }));
    } finally {
      setUploadingCourseId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-lg">Cargando datos de migración...</span>
        </div>
      </div>
    );
  }

  if (loadError || !migrationData) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{loadError || 'Error al cargar datos'}</p>
        </div>
      </div>
    );
  }

  const courses = migrationData.cursos;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Migración de Cursos</h1>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 font-semibold">⚠️ Advertencia</p>
        <p className="text-yellow-700 text-sm">
          Esta acción subirá el curso completo con todos sus módulos y videos a Firebase.
          Asegúrate de que el curso no exista ya en la base de datos.
        </p>
      </div>

      <div className="space-y-4">
        {courses.map((course, index) => {
          const isUploading = uploadingCourseId === course.id;
          const courseProgress = progress[course.id];
          const courseError = errors[course.id];
          const courseSuccess = successes[course.id];

          return (
            <div key={course.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>📦 {course.modules?.length || 0} módulos</span>
                    <span>
                      🎬 {migrationData.content.filter(c => c.courseId === course.id).length} videos
                    </span>
                    <span>⏱️ {course.duration}</span>
                    <span>💰 ${course.price}</span>
                  </div>
                </div>
                <button
                  onClick={() => uploadCourse(index)}
                  disabled={isUploading || uploadingCourseId !== null}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isUploading
                      ? 'bg-yellow-500 text-white cursor-wait'
                      : uploadingCourseId !== null
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : courseSuccess
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isUploading ? 'Subiendo...' : courseSuccess ? '✓ Subido' : 'Subir Curso'}
                </button>
              </div>

              {/* Progress/Error for this specific course */}
              {(courseProgress || courseError) && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  courseError ? 'bg-red-50 border border-red-200' :
                  courseSuccess ? 'bg-green-50 border border-green-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  {courseError && <p className="text-red-800 whitespace-pre-line">{courseError}</p>}
                  {!courseError && courseProgress && (
                    <p className={`whitespace-pre-line ${courseSuccess ? 'text-green-800' : 'text-blue-800'}`}>
                      {courseProgress}
                    </p>
                  )}
                </div>
              )}

              {/* Loading spinner for this specific course */}
              {isUploading && (
                <div className="mt-3 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
