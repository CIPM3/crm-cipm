import { useState } from 'react';
import { signInWithGoogle } from '@/api/auth/sing-with-google';
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
            const userData: UsersType = await signInWithGoogle();
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

    return {
        mutate,
        data,
        loading,
        error,
    };
};

export default useFirebaseAuth;