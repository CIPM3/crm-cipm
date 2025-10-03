/**
 * Migration Data Service
 *
 * Este servicio maneja la carga y combinación de datos de Firebase con datos de migración.
 * Los datos de migración se cargan condicionalmente basándose en la variable de entorno
 * NEXT_PUBLIC_ENABLE_MIGRATION_DATA.
 */

export interface MigrationUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
  status: string;
}

export interface MigrationContent {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  duration: string;
  questions: number;
  moduleId: string;
  courseId: string;
}

export interface MigrationCourse {
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

export interface MigrationModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: string;
  order: number;
  status: string;
}

export interface MigrationEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: string;
  progress: number;
  lastAccessed: string;
  completedContentIds: string[];
}

export interface MigrationData {
  users: MigrationUser[];
  content: MigrationContent[];
  cursos: MigrationCourse[];
  modules: MigrationModule[];
  enrollments: MigrationEnrollment[];
  videos: any[];
  metadata: {
    transformedAt: string;
    sourceProject: string;
    targetProject: string;
    originalCounts: any;
    transformedCounts: any;
    [key: string]: any;
  };
}

let cachedMigrationData: MigrationData | null = null;
let loadingPromise: Promise<MigrationData | null> | null = null;

/**
 * Verifica si los datos de migración están habilitados
 */
export function isMigrationDataEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MIGRATION_DATA === 'true';
}

/**
 * Carga los datos de migración desde el archivo JSON público
 * Usa caché para evitar múltiples cargas del mismo archivo
 */
export async function loadMigrationData(): Promise<MigrationData | null> {
  // Si no está habilitado, retornar null
  if (!isMigrationDataEnabled()) {
    return null;
  }

  // Si ya está en caché, retornar el caché
  if (cachedMigrationData) {
    return cachedMigrationData;
  }

  // Si ya hay una carga en progreso, esperar a que termine
  if (loadingPromise) {
    return loadingPromise;
  }

  // Iniciar nueva carga
  loadingPromise = (async () => {
    try {
      const response = await fetch('/data/migration-data.json');
      if (!response.ok) {
        console.error('Error loading migration data:', response.statusText);
        return null;
      }

      const data: MigrationData = await response.json();
      cachedMigrationData = data;
      return data;
    } catch (error) {
      console.error('Error loading migration data:', error);
      return null;
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

/**
 * Obtiene todos los usuarios (Firebase + Migración)
 */
export async function getAllUsers(firebaseUsers: any[]): Promise<any[]> {
  const migrationData = await loadMigrationData();

  if (!migrationData) {
    return firebaseUsers;
  }

  // Combinar usuarios de Firebase con usuarios de migración
  // Evitar duplicados usando el ID como clave
  const userMap = new Map();

  // Primero agregar usuarios de Firebase
  firebaseUsers.forEach(user => {
    userMap.set(user.id, user);
  });

  // Luego agregar usuarios de migración (no sobreescribir si ya existe)
  migrationData.users.forEach(user => {
    if (!userMap.has(user.id)) {
      userMap.set(user.id, {
        ...user,
        _source: 'migration' // Marcar como de migración
      });
    }
  });

  return Array.from(userMap.values());
}

/**
 * Obtiene todo el contenido (Firebase + Migración)
 */
export async function getAllContent(firebaseContent: any[]): Promise<any[]> {
  const migrationData = await loadMigrationData();

  if (!migrationData) {
    return firebaseContent;
  }

  // Combinar contenido de Firebase con contenido de migración
  const contentMap = new Map();

  // Primero agregar contenido de Firebase
  firebaseContent.forEach(content => {
    contentMap.set(content.id, content);
  });

  // Luego agregar contenido de migración
  migrationData.content.forEach(content => {
    if (!contentMap.has(content.id)) {
      contentMap.set(content.id, {
        ...content,
        _source: 'migration'
      });
    }
  });

  return Array.from(contentMap.values());
}

/**
 * Obtiene todos los cursos (Firebase + Migración)
 */
export async function getAllCourses(firebaseCourses: any[]): Promise<any[]> {
  const migrationData = await loadMigrationData();

  if (!migrationData) {
    return firebaseCourses;
  }

  const courseMap = new Map();

  firebaseCourses.forEach(course => {
    courseMap.set(course.id, course);
  });

  migrationData.cursos.forEach(course => {
    if (!courseMap.has(course.id)) {
      courseMap.set(course.id, {
        ...course,
        _source: 'migration'
      });
    }
  });

  return Array.from(courseMap.values());
}

/**
 * Obtiene todos los módulos (Firebase + Migración)
 */
export async function getAllModules(firebaseModules: any[]): Promise<any[]> {
  const migrationData = await loadMigrationData();

  if (!migrationData) {
    return firebaseModules;
  }

  const moduleMap = new Map();

  firebaseModules.forEach(module => {
    moduleMap.set(module.id, module);
  });

  migrationData.modules.forEach(module => {
    if (!moduleMap.has(module.id)) {
      moduleMap.set(module.id, {
        ...module,
        _source: 'migration'
      });
    }
  });

  return Array.from(moduleMap.values());
}

/**
 * Obtiene todos los enrollments (Firebase + Migración)
 */
export async function getAllEnrollments(firebaseEnrollments: any[]): Promise<any[]> {
  const migrationData = await loadMigrationData();

  if (!migrationData) {
    return firebaseEnrollments;
  }

  const enrollmentMap = new Map();

  firebaseEnrollments.forEach(enrollment => {
    enrollmentMap.set(enrollment.id, enrollment);
  });

  migrationData.enrollments.forEach(enrollment => {
    if (!enrollmentMap.has(enrollment.id)) {
      enrollmentMap.set(enrollment.id, {
        ...enrollment,
        _source: 'migration'
      });
    }
  });

  return Array.from(enrollmentMap.values());
}

/**
 * Limpia el caché de datos de migración
 */
export function clearMigrationCache(): void {
  cachedMigrationData = null;
  loadingPromise = null;
}
