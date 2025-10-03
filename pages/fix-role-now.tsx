import { useEffect, useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DB_COLLECCTIONS } from '@/lib/constants';

export default function FixRoleNow() {
  const [status, setStatus] = useState('Preparando...');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fixRole();
  }, []);

  async function fixRole() {
    try {
      const USER_ID = 'fZBbWtrIihQvkITliDfLHHhK6rA3';
      const NEW_ROLE = 'develop';

      setStatus('Conectando a Firestore...');

      const userRef = doc(db, DB_COLLECCTIONS.USUARIOS, USER_ID);

      setStatus('Verificando usuario...');
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError('❌ Usuario no encontrado');
        return;
      }

      const userData = userSnap.data();
      setStatus(`Usuario encontrado: ${userData.email}`);

      setStatus('Actualizando rol...');
      await updateDoc(userRef, {
        role: NEW_ROLE,
        rol: NEW_ROLE,
      });

      setStatus('Verificando cambio...');
      const updatedSnap = await getDoc(userRef);
      const updatedData = updatedSnap.data();

      if (updatedData?.role === NEW_ROLE) {
        setSuccess(true);
        setStatus(`✅ ROL ACTUALIZADO EXITOSAMENTE A: ${NEW_ROLE}`);
      } else {
        setError('❌ El rol no se actualizó correctamente');
      }

    } catch (err: any) {
      setError(`❌ Error: ${err.message}`);
      console.error(err);
    }
  }

  return (
    <div style={{
      padding: '40px',
      maxWidth: '600px',
      margin: '50px auto',
      backgroundColor: success ? '#e8f5e9' : error ? '#ffebee' : '#fff3e0',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>
        Actualizar Rol a Develop
      </h1>

      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #ddd'
      }}>
        <p style={{ fontSize: '16px', margin: '10px 0', color: '#555' }}>
          {status}
        </p>

        {error && (
          <p style={{ color: 'red', fontSize: '16px', margin: '10px 0' }}>
            {error}
          </p>
        )}
      </div>

      {success && (
        <div style={{
          padding: '20px',
          backgroundColor: '#4caf50',
          color: 'white',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 10px 0' }}>
            ✅ ¡Éxito!
          </h2>
          <p style={{ margin: '5px 0' }}>
            Tu rol ha sido actualizado a <strong>develop</strong>
          </p>
          <p style={{ margin: '15px 0 5px 0', fontSize: '14px' }}>
            Ahora debes:
          </p>
          <ol style={{ margin: '5px 0', paddingLeft: '20px' }}>
            <li>Limpiar localStorage: ejecuta <code>localStorage.clear()</code> en consola</li>
            <li>Recargar la página (F5)</li>
            <li>Cerrar sesión</li>
            <li>Volver a iniciar sesión</li>
          </ol>
        </div>
      )}

      {!success && !error && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
