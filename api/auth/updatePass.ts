import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword, fetchSignInMethodsForEmail, AuthError } from 'firebase/auth';

export const updateUserPassword = async (email: string, currentPassword: string, newPassword: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !email) {
    throw new Error('No hay un usuario autenticado');
  }

  // Verificar método de autenticación
  const providers = await fetchSignInMethodsForEmail(auth, email);
  if (!providers.includes('password')) {
    throw new Error('Tu cuenta no está registrada con email y contraseña');
  }

  // Reautenticar
  const credential = EmailAuthProvider.credential(email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // Actualizar contraseña
  await updatePassword(user, newPassword);
};

export const getAuthErrorMessages = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/wrong-password':
      return 'La contraseña actual es incorrecta';
    case 'auth/requires-recent-login':
      return 'Debes iniciar sesión nuevamente para realizar esta acción';
    case 'auth/invalid-credential':
      return 'Credenciales inválidas. Verifica tu contraseña actual';
    default:
      return `Ocurrió un error al actualizar la contraseña: ${error.message}`;
  }
};