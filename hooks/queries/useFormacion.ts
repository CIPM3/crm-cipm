import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys';
import { 
  getAllStudentsFormacion, 
  createStudentFormacion, 
  updateStudentFormacion, 
  deleteStudentFormacion,
  getStudentFormacionById 
} from '@/lib/firebaseService';
import { FormacionDataType } from '@/types';
import { useAppStore } from '@/store';

// Get all formacion students
export const useGetFormacionStudents = () => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.formacionStudents(),
    queryFn: async () => {
      const data = await getAllStudentsFormacion();
      updateLastFetch('formacion-students');
      return data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes (more frequent updates for formacion)
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get formacion student by ID
export const useGetFormacionStudent = (id: string) => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.formacionStudent(id),
    queryFn: async () => {
      const data = await getStudentFormacionById(id);
      updateLastFetch(`formacion-student-${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create formacion student mutation
export const useCreateFormacionStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formacionData: Omit<FormacionDataType, 'id'>) => createStudentFormacion(formacionData),
    onSuccess: () => {
      // Invalidate and refetch formacion list
      getInvalidationKeys.onFormacionCreate().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Error creating formacion student:', error);
    },
  });
};

// Update formacion student mutation
export const useUpdateFormacionStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formacionData }: { id: string; formacionData: Partial<FormacionDataType> }) => 
      updateStudentFormacion(id, formacionData),
    onSuccess: (_, { id }) => {
      // Invalidate specific formacion student and list
      queryClient.invalidateQueries({ queryKey: queryKeys.formacionStudent(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.formacionStudents() });
    },
    onError: (error) => {
      console.error('Error updating formacion student:', error);
    },
  });
};

// Delete formacion student mutation
export const useDeleteFormacionStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteStudentFormacion(id),
    onSuccess: () => {
      // Invalidate formacion list
      queryClient.invalidateQueries({ queryKey: queryKeys.formacionStudents() });
    },
    onError: (error) => {
      console.error('Error deleting formacion student:', error);
    },
  });
};