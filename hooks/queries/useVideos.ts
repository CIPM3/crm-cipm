import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, getInvalidationKeys } from '@/lib/queryKeys';
import { 
  getAllVideos, 
  createVideo, 
  updateVideo, 
  deleteVideo,
  getVideoById 
} from '@/lib/firebaseService';
import { VideoDataType } from '@/types';
import { useAppStore } from '@/store';

// Get all videos
export const useGetVideos = () => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.videosList(),
    queryFn: async () => {
      const data = await getAllVideos();
      updateLastFetch('videos');
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (videos change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get video by ID
export const useGetVideo = (id: string) => {
  const { updateLastFetch } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.video(id),
    queryFn: async () => {
      const data = await getVideoById(id);
      updateLastFetch(`video-${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Create video mutation
export const useCreateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (videoData: Omit<VideoDataType, 'id'>) => createVideo(videoData),
    onSuccess: () => {
      // Invalidate and refetch videos list
      getInvalidationKeys.onVideoCreate().forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: (error) => {
      console.error('Error creating video:', error);
    },
  });
};

// Update video mutation
export const useUpdateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, videoData }: { id: string; videoData: Partial<VideoDataType> }) => 
      updateVideo(id, videoData),
    onSuccess: (_, { id }) => {
      // Invalidate specific video and videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.video(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.videosList() });
    },
    onError: (error) => {
      console.error('Error updating video:', error);
    },
  });
};

// Delete video mutation
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteVideo(id),
    onSuccess: () => {
      // Invalidate videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.videosList() });
    },
    onError: (error) => {
      console.error('Error deleting video:', error);
    },
  });
};