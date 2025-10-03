import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';

export default function DebugUserPage() {
  const storeUser = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Imprimir en consola
    console.clear();
    console.log('='.repeat(60));
    console.log('👤 USUARIO ACTUAL EN ZUSTAND STORE');
    console.log('='.repeat(60));
    console.log('Usuario completo:', storeUser);
    if (storeUser) {
      console.log('\n📊 INFORMACIÓN CLAVE:');
      console.log('  📧 Email:', storeUser.email || 'N/A');
      console.log('  👤 Nombre:', storeUser.name || 'N/A');
      console.log('  🔑 ID:', storeUser.id || 'N/A');
      console.log('  🎭 Rol:', storeUser.role || (storeUser as any)?.rol || 'N/A');
      console.log('  ✅ Estado:', (storeUser as any)?.status || 'N/A');

      console.log('\n🔐 VERIFICACIÓN DE PERMISOS:');
      const isAdmin = storeUser.role === 'admin';
      const isDevelop = storeUser.role === 'develop';
      const hasAdminAccess = isAdmin || isDevelop;

      console.log('  Es Admin?', isAdmin ? '✅ SÍ' : '❌ NO');
      console.log('  Es Develop?', isDevelop ? '✅ SÍ' : '❌ NO');
      console.log('  Tiene acceso Admin?', hasAdminAccess ? '✅ SÍ' : '❌ NO');

      if (!hasAdminAccess) {
        console.log('\n⚠️  ATENCIÓN: No tienes permisos de administrador');
        console.log('   Tu rol actual es:', storeUser.role || 'sin rol');
        console.log('   Necesitas rol "admin" o "develop" para acceso completo');
      }
    } else {
      console.log('❌ No hay usuario en el store');
    }
    console.log('='.repeat(60));
  }, [storeUser]);

  if (!mounted) {
    return <div style={{ padding: '40px' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🔍 Debug - Usuario Actual</h1>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>📦 Usuario en Zustand Store:</h2>
        <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '15px', borderRadius: '6px', overflow: 'auto' }}>
          {JSON.stringify(storeUser, null, 2)}
        </pre>

        {storeUser && (
          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '6px' }}>
            <h3>📊 Información clave:</h3>
            <p><strong>📧 Email:</strong> {storeUser.email || 'N/A'}</p>
            <p><strong>👤 Nombre:</strong> {storeUser.name || 'N/A'}</p>
            <p><strong>🔑 ID:</strong> {storeUser.id || 'N/A'}</p>
            <p><strong>🎭 Rol:</strong> {storeUser.role || (storeUser as any).rol || 'N/A'}</p>
            <p><strong>✅ Estado:</strong> {(storeUser as any).status || 'N/A'}</p>
          </div>
        )}

        {storeUser && (
          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: storeUser.role === 'admin' || storeUser.role === 'develop' ? '#e8f5e9' : '#ffebee', borderRadius: '6px' }}>
            <h3>🔐 Verificación de Permisos:</h3>
            <p><strong>Rol actual:</strong> {storeUser.role || (storeUser as any).rol || 'sin rol'}</p>
            <p><strong>Es Admin?</strong> {storeUser.role === 'admin' ? '✅ SÍ' : '❌ NO'}</p>
            <p><strong>Es Develop?</strong> {storeUser.role === 'develop' ? '✅ SÍ' : '❌ NO'}</p>
            <p><strong>Tiene acceso Admin?</strong> {(storeUser.role === 'admin' || storeUser.role === 'develop') ? '✅ SÍ' : '❌ NO'}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '2px solid #2196f3' }}>
        <h2>📋 Información impresa en consola</h2>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>✅ Toda la información del usuario ya está impresa en la consola del navegador</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Abre las DevTools (F12) y ve a la pestaña "Console" para ver los detalles completos</p>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
        <h3>⚠️ Si no tienes acceso de admin:</h3>
        <ol>
          <li>Ve a <a href="/admin/fix-user-role" style={{ color: '#0070f3' }}>/admin/fix-user-role</a></li>
          <li>Haz clic en "Verificar Usuario"</li>
          <li>Si es necesario, haz clic en "Actualizar Rol" → "👑 Admin" o "🔧 Develop"</li>
          <li>Recarga la página (F5)</li>
        </ol>
      </div>
    </div>
  );
}
