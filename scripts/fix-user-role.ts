import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { DB_COLLECCTIONS } from '../lib/constants';

const USER_ID = 'fZBbWtrIihQvkITliDfLHHhK6rA3';
const NEW_ROLE = 'develop';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_DB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_DB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_DB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_DB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_DB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_DB_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function fixUserRole() {
  try {
    console.log('🔧 Actualizando rol del usuario...');
    console.log(`   ID: ${USER_ID}`);
    console.log(`   Nuevo rol: ${NEW_ROLE}`);

    const userRef = doc(db, DB_COLLECCTIONS.USUARIOS, USER_ID);

    // Verificar que el usuario existe
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error('❌ Usuario no encontrado en Firestore');
      process.exit(1);
    }

    const userData = userSnap.data();
    console.log('\n📋 Datos actuales del usuario:');
    console.log('   Email:', userData.email);
    console.log('   Nombre:', userData.name);
    console.log('   Rol actual:', userData.role || userData.rol);

    // Actualizar AMBOS campos para compatibilidad
    await updateDoc(userRef, {
      role: NEW_ROLE,
      rol: NEW_ROLE,
    });

    console.log('\n✅ Rol actualizado exitosamente!');
    console.log(`   Nuevo rol: ${NEW_ROLE}`);

    // Verificar el cambio
    const updatedSnap = await getDoc(userRef);
    const updatedData = updatedSnap.data();
    console.log('\n📋 Verificación:');
    console.log('   role:', updatedData?.role);
    console.log('   rol:', updatedData?.rol);

    console.log('\n✨ Ahora cierra sesión y vuelve a iniciar sesión para ver los cambios');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixUserRole();
