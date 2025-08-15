import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAllUsuarios } from '@/lib/firebaseService';
import { useAppStore } from '@/store';

export const useGetUsuarios = () => {
  const { updateLastFetch } = useAppStore();
  
  const query = useQuery({
    queryKey: queryKeys.usersList(),
    queryFn: async () => {
      const users = await getAllUsuarios();
      updateLastFetch('usuarios');
      return users;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return { 
    data: query.data || [], 
    loading: query.isLoading, 
    error: query.error, 
    refetch: query.refetch 
  };
};