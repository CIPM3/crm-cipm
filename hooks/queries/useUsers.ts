import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys';
import { 
  getAllUsuarios, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario,
  getUsuarioById 
} from '@/lib/firebaseService';
import { UserDataType } from '@/types';
import { useAppStore } from '@/store';

// Get all users
export const useGetUsers = () => {
  const { shouldRefetch, updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.usersList(),
    queryFn: async () => {
      const data = await getAllUsuarios();
      updateLastFetch('users');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get user by ID
export const useGetUser = (id: string) => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: async () => {
      const data = await getUsuarioById(id);
      updateLastFetch(`user-${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Omit<UserDataType, 'id'>) => createUsuario(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      getInvalidationKeys.onUserCreate().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<UserDataType> }) => 
      updateUsuario(id, userData),
    onSuccess: (_, { id }) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: queryKeys.user(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.usersList() });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteUsuario(id),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.usersList() });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
    },
  });
};