import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';

export default function FixUserRolePage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user: storeUser } = useAuthStore();
  
  // Prevent hydration issues by only accessing auth after mount
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    setCurrentUser(auth.currentUser);
  }, []);

  const checkCurrentUser = async () => {
    setLoading(true);
    setStatus('🔍 Verificando usuario actual...\n');

    try {
      if (!currentUser) {
        setStatus(prev => prev + '\n❌ No hay usuario autenticado en Firebase Auth');
        setLoading(false);
        return;
      }

      setStatus(prev => prev + `\n📧 Email: ${currentUser.email}`);
      setStatus(prev => prev + `\n🆔 UID: ${currentUser.uid}`);
      setStatus(prev => prev + `\n👤 Nombre: ${currentUser.displayName || 'Sin nombre'}`);

      // Check if user exists in Firestore
      const userRef = doc(db, 'USUARIOS', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setStatus(prev => prev + '\n\n✅ Usuario encontrado en Firestore:');
        setStatus(prev => prev + `\n   Nombre: ${userData.name}`);
        setStatus(prev => prev + `\n   Email: ${userData.email}`);
        setStatus(prev => prev + `\n   Rol: ${userData.role || userData.rol || 'sin rol'}`);
        setStatus(prev => prev + `\n   Estado: ${userData.status || 'sin estado'}`);
      } else {
        setStatus(prev => prev + '\n\n⚠️ Usuario NO encontrado en Firestore');
      }

      // Check store
      if (storeUser) {
        setStatus(prev => prev + '\n\n📦 Usuario en el Store (Zustand):');
        setStatus(prev => prev + `\n   Nombre: ${storeUser.name}`);
        setStatus(prev => prev + `\n   Email: ${storeUser.email}`);
        setStatus(prev => prev + `\n   Rol: ${storeUser.role || (storeUser as any).rol || 'sin rol'}`);
      } else {
        setStatus(prev => prev + '\n\n⚠️ No hay usuario en el Store (Zustand)');
      }

    } catch (error: any) {
      console.error('Error:', error);
      setStatus(prev => prev + `\n\n❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (newRole: string) => {
    setLoading(true);
    setStatus(prev => prev + `\n\n🔄 Actualizando rol a: ${newRole}...\n`);

    try {
      if (!currentUser) {
        setStatus(prev => prev + '\n❌ No hay usuario autenticado');
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'USUARIOS', currentUser.uid);
      const userSnap = await getDoc(userRef);

      const userData = {
        id: currentUser.uid,
        name: currentUser.displayName || 'Usuario',
        email: currentUser.email || '',
        role: newRole,
        avatar: currentUser.photoURL || '',
        createdAt: userSnap.exists() ? userSnap.data().createdAt : new Date().toISOString(),
        status: 'active',
      };

      await setDoc(userRef, userData, { merge: true });

      setStatus(prev => prev + `\n✅ Usuario actualizado en Firestore`);
      setStatus(prev => prev + `\n   Nuevo rol: ${newRole}`);
      setStatus(prev => prev + '\n\n⚠️ Por favor, recarga la página (F5) para aplicar los cambios');

    } catch (error: any) {
      console.error('Error:', error);
      setStatus(prev => prev + `\n\n❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createUserInFirestore = async () => {
    setLoading(true);
    setStatus(prev => prev + '\n\n🔄 Creando usuario en Firestore...\n');

    try {
      if (!currentUser) {
        setStatus(prev => prev + '\n❌ No hay usuario autenticado');
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'USUARIOS', currentUser.uid);

      const userData = {
        id: currentUser.uid,
        name: currentUser.displayName || 'Usuario',
        email: currentUser.email || '',
        role: 'admin',
        avatar: currentUser.photoURL || '',
        createdAt: new Date().toISOString(),
        status: 'active',
      };

      await setDoc(userRef, userData);

      setStatus(prev => prev + `\n✅ Usuario creado en Firestore con rol: admin`);
      setStatus(prev => prev + '\n\n⚠️ Por favor, recarga la página (F5) para aplicar los cambios');

    } catch (error: any) {
      console.error('Error:', error);
      setStatus(prev => prev + `\n\n❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return (
      <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }}>
        <h1>🔧 Fix User Role</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🔧 Fix User Role</h1>
      <p>Herramienta para diagnosticar y corregir problemas de roles de usuario</p>

      <div style={{ marginTop: '30px', marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={checkCurrentUser}
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
          {loading ? '⏳ Verificando...' : '🔍 Verificar Usuario'}
        </button>

        <button
          onClick={createUserInFirestore}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Creando...' : '➕ Crear Usuario Admin'}
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <h3 style={{ width: '100%', marginBottom: '10px' }}>Actualizar Rol:</h3>
        <button
          onClick={() => updateUserRole('admin')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: loading ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          👑 Admin
        </button>

        <button
          onClick={() => updateUserRole('instructor')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: loading ? '#ccc' : '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          👨‍🏫 Instructor
        </button>

        <button
          onClick={() => updateUserRole('agendador')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: loading ? '#ccc' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          📅 Agendador
        </button>

        <button
          onClick={() => updateUserRole('cliente')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: loading ? '#ccc' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          👤 Cliente
        </button>
      </div>

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
        {status || 'Haz clic en "Verificar Usuario" para comenzar...'}
      </pre>

      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
        <strong>⚠️ Instrucciones:</strong>
        <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Primero haz clic en "Verificar Usuario" para ver tu estado actual</li>
          <li>Si no existe tu usuario en Firestore, haz clic en "Crear Usuario Admin"</li>
          <li>Si existe pero tiene rol incorrecto, usa los botones de "Actualizar Rol"</li>
          <li>Después de actualizar, recarga la página (F5) para aplicar cambios</li>
        </ol>
      </div>
    </div>
  );
}
