import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys';
import { 
  getAllCursos, 
  createCurso, 
  updateCurso, 
  deleteCurso,
  getCursoById 
} from '@/lib/firebaseService';
import { CursoDataType } from '@/types';
import { useAppStore } from '@/store';

// Get all cursos
export const useGetCursos = () => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.cursosList(),
    queryFn: async () => {
      const data = await getAllCursos();
      updateLastFetch('cursos');
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (cursos change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get curso by ID
export const useGetCurso = (id: string) => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.curso(id),
    queryFn: async () => {
      const data = await getCursoById(id);
      updateLastFetch(`curso-${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Create curso mutation
export const useCreateCurso = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (cursoData: Omit<CursoDataType, 'id'>) => createCurso(cursoData),
    onSuccess: () => {
      // Invalidate and refetch cursos list
      getInvalidationKeys.onCursoCreate().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Error creating curso:', error);
    },
  });
};

// Update curso mutation
export const useUpdateCurso = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, cursoData }: { id: string; cursoData: Partial<CursoDataType> }) => 
      updateCurso(id, cursoData),
    onSuccess: (_, { id }) => {
      // Invalidate specific curso and cursos list
      queryClient.invalidateQueries({ queryKey: queryKeys.curso(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cursosList() });
    },
    onError: (error) => {
      console.error('Error updating curso:', error);
    },
  });
};

// Delete curso mutation
export const useDeleteCurso = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteCurso(id),
    onSuccess: () => {
      // Invalidate cursos list
      queryClient.invalidateQueries({ queryKey: queryKeys.cursosList() });
    },
    onError: (error) => {
      console.error('Error deleting curso:', error);
    },
  });
};