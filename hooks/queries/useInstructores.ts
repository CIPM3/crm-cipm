import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys';
import { 
  getAllInstructores, 
  createInstructor, 
  updateInstructor, 
  deleteInstructor,
  getInstructorById 
} from '@/lib/firebaseService';
import { InstructorDataType } from '@/types';
import { useAppStore } from '@/store';

// Get all instructores
export const useGetInstructores = () => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.instructoresList(),
    queryFn: async () => {
      const data = await getAllInstructores();
      updateLastFetch('instructores');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get instructor by ID
export const useGetInstructor = (id: string) => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.instructor(id),
    queryFn: async () => {
      const data = await getInstructorById(id);
      updateLastFetch(`instructor-${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create instructor mutation
export const useCreateInstructor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (instructorData: Omit<InstructorDataType, 'id'>) => createInstructor(instructorData),
    onSuccess: () => {
      // Invalidate and refetch instructores list
      getInvalidationKeys.onInstructorCreate().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Error creating instructor:', error);
    },
  });
};

// Update instructor mutation
export const useUpdateInstructor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, instructorData }: { id: string; instructorData: Partial<InstructorDataType> }) => 
      updateInstructor(id, instructorData),
    onSuccess: (_, { id }) => {
      // Invalidate specific instructor and instructores list
      queryClient.invalidateQueries({ queryKey: queryKeys.instructor(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.instructoresList() });
    },
    onError: (error) => {
      console.error('Error updating instructor:', error);
    },
  });
};

// Delete instructor mutation
export const useDeleteInstructor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteInstructor(id),
    onSuccess: () => {
      // Invalidate instructores list
      queryClient.invalidateQueries({ queryKey: queryKeys.instructoresList() });
    },
    onError: (error) => {
      console.error('Error deleting instructor:', error);
    },
  });
};