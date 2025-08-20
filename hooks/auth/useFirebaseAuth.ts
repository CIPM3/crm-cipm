import { useEffect, useState } from 'react';
import { signInWithGoogle, consumeGoogleRedirectResult, startGoogleRedirect } from '@/api/auth/sing-with-google';
import { useAuthStore } from '@/store/useAuthStore';
import { UsersType } from '@/types';

const useFirebaseAuth = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<UsersType | null>(null);

    const mutate = async () => {
        setLoading(true);
        setError(null);
        try {
            let userData: UsersType;
            try {
                userData = await signInWithGoogle();
            } catch (popupError) {
                // Si falla el popup (bloqueado, etc.), intenta con redirect
                await startGoogleRedirect();
                // La navegación saldrá de la página, por lo que retornamos
                // un throw para cortar el flujo actual
                throw popupError as Error;
            }
            setUser(userData);
            setData(userData);
            return userData;
        } catch (err) {
            setError(err as Error);
            console.error("Error durante la autenticación:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Consumir resultado de redirect si existe
    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                const redirectUser = await consumeGoogleRedirectResult();
                if (redirectUser && isMounted) {
                    setUser(redirectUser);
                    setData(redirectUser);
                }
            } catch (err) {
                setError(err as Error);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [setUser]);

    return {
        mutate,
        data,
        loading,
        error,
    };
};

export default useFirebaseAuth;