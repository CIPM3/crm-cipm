import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAllUsuarios } from '@/lib/firebaseService';
import { useAppStore } from '@/store';

export const useGetInstructores = () => {
  const { updateLastFetch } = useAppStore();
  
  const query = useQuery({
    queryKey: queryKeys.instructoresList(),
    queryFn: async () => {
      const users = await getAllUsuarios();
      const instructors = users.filter((user) => user.role === "instructor");
      updateLastFetch('instructores');
      return instructors;
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