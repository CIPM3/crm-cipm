import { useState } from 'react';
import { signInWithGoogle } from '@/api/auth/sing-with-google'; // Corrige la ruta de importación
import { useAuthStore } from '@/store/useAuthStore';
import { UsersType } from '@/types';

const useFirebaseAuth = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleSignInWithGoogle = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userData: UsersType = await signInWithGoogle();
            setUser(userData);
            setIsAuthenticated(true); // Establece isAuthenticated en true
        } catch (err) {
            setError(err as Error);
            console.error("Error durante la autenticación:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signInWithGoogle: handleSignInWithGoogle,
        isLoading,
        error,
        isAuthenticated, // Devuelve isAuthenticated
    };
};

export default useFirebaseAuth;