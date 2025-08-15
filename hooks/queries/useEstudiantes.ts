import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys';
import { 
  getAllEstudiantes, 
  createEstudiante, 
  updateEstudiante, 
  deleteEstudiante,
  getEstudianteById 
} from '@/lib/firebaseService';
import { EstudianteDataType } from '@/types';
import { useAppStore } from '@/store';

// Get all estudiantes
export const useGetEstudiantes = () => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.estudiantesList(),
    queryFn: async () => {
      const data = await getAllEstudiantes();
      updateLastFetch('estudiantes');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get estudiante by ID
export const useGetEstudiante = (id: string) => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.estudiante(id),
    queryFn: async () => {
      const data = await getEstudianteById(id);
      updateLastFetch(`estudiante-${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create estudiante mutation
export const useCreateEstudiante = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (estudianteData: Omit<EstudianteDataType, 'id'>) => createEstudiante(estudianteData),
    onSuccess: () => {
      // Invalidate and refetch estudiantes list
      getInvalidationKeys.onEstudianteCreate().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Error creating estudiante:', error);
    },
  });
};

// Update estudiante mutation
export const useUpdateEstudiante = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, estudianteData }: { id: string; estudianteData: Partial<EstudianteDataType> }) => 
      updateEstudiante(id, estudianteData),
    onSuccess: (_, { id }) => {
      // Invalidate specific estudiante and estudiantes list
      queryClient.invalidateQueries({ queryKey: queryKeys.estudiante(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.estudiantesList() });
    },
    onError: (error) => {
      console.error('Error updating estudiante:', error);
    },
  });
};

// Delete estudiante mutation
export const useDeleteEstudiante = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteEstudiante(id),
    onSuccess: () => {
      // Invalidate estudiantes list
      queryClient.invalidateQueries({ queryKey: queryKeys.estudiantesList() });
    },
    onError: (error) => {
      console.error('Error deleting estudiante:', error);
    },
  });
};