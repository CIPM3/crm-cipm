import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getAllStudentsFormacion } from '@/lib/firebaseService';
import { useAppStore } from '@/store';

export const useGetFormacionStudents = () => {
  const { updateLastFetch } = useAppStore();
  
  const query = useQuery({
    queryKey: queryKeys.formacionStudents(),
    queryFn: async () => {
      const data = await getAllStudentsFormacion();
      updateLastFetch('formacion-students');
      return data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes (more frequent updates for formacion)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return { 
    data: query.data || [], 
    loading: query.isLoading, 
    error: query.error, 
    refetch: query.refetch 
  };
}