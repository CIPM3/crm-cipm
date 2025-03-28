import { useState } from 'react';
import { useFormik } from 'formik';
import { passwordSchema } from '@/lib/schemas';
import { updateUserPassword, getAuthErrorMessages } from '@/api/auth/updatePass';
import { AuthError, getAuth } from 'firebase/auth';

export const usePasswordUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user || !user.email) {
          throw new Error('No hay un usuario autenticado');
        }

        await updateUserPassword(user.email, values.currentPassword, values.newPassword);
        
        setSuccess('Contraseña actualizada correctamente');
        formik.resetForm();
      } catch (err) {
        console.error('Error al actualizar la contraseña:', err);
        
        if (err instanceof Error) {
          setError(err.message);
        } else if (err && typeof err === 'object' && 'code' in err) {
          setError(getAuthErrorMessages(err as AuthError));
        } else {
          setError('Ocurrió un error desconocido al actualizar la contraseña');
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    formik,
    loading,
    error,
    success,
    setError,
    setSuccess
  };
};