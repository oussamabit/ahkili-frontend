import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// ============= QUERY KEYS =============
export const QUERY_KEYS = {
  POSTS: 'posts',
  POST: 'post',
  COMMENTS: 'comments',
  USERS: 'users',
  USER: 'user',
  COMMUNITIES: 'communities',
  COMMUNITY: 'community',
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_PREFS: 'notification-prefs',
};

// ============= POST HOOKS =============
export const usePosts = (communityId = null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, communityId],
    queryFn: () => api.posts.getAll({ communityId }),
  });
};

export const usePost = (postId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POST, postId],
    queryFn: () => api.posts.getOne(postId),
    enabled: !!postId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postData, userId }) => api.posts.create(postData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, userId }) => api.posts.delete(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });
};

export const useReactToPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, userId }) => api.posts.react(postId, userId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, postId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POSTS] });
    },
  });
};

export const useSearchPosts = (query) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS, 'search', query],
    queryFn: () => api.posts.search(query),
    enabled: query.length > 2,
  });
};

// ============= COMMENT HOOKS =============
export const useComments = (postId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENTS, postId],
    queryFn: () => api.comments.getForPost(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, commentData, userId, parentId }) => 
      api.comments.create(postId, commentData, userId, parentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS, postId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.POST, postId] });
    },
  });
};

export const useReactToComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, userId, reactionType }) => 
      api.comments.react(commentId, userId, reactionType),
    onSuccess: (_, { commentId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMENTS] });
    },
  });
};

// ============= USER HOOKS =============
export const useUser = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, userId],
    queryFn: () => api.users.getOne(userId),
    enabled: !!userId,
  });
};

export const useUserProfile = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, 'profile', userId],
    queryFn: () => api.users.getProfile(userId),
    enabled: !!userId,
  });
};

export const useUserByFirebaseUid = (firebaseUid) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, 'firebase', firebaseUid],
    queryFn: () => api.users.getByFirebaseUid(firebaseUid),
    enabled: !!firebaseUid,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, profileData }) => 
      api.users.updateProfile(userId, profileData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, userId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER, 'profile', userId] });
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData) => api.users.create(userData),
  });
};

// ============= COMMUNITY HOOKS =============
export const useCommunities = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES],
    queryFn: () => api.communities.getAll(),
  });
};

export const useCommunity = (communityId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITY, communityId],
    queryFn: () => api.communities.getOne(communityId),
    enabled: !!communityId,
  });
};

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ name, description, createdBy }) => 
      api.communities.create(name, description, createdBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITIES] });
    },
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ communityId, userId }) => 
      api.communities.join(communityId, userId),
    onSuccess: (_, { communityId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITY, communityId] });
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ communityId, userId }) => 
      api.communities.leave(communityId, userId),
    onSuccess: (_, { communityId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITY, communityId] });
    },
  });
};

export const useFollowCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ communityId, userId }) => 
      api.communities.follow(communityId, userId),
    onSuccess: (_, { communityId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITY, communityId] });
    },
  });
};

export const useUnfollowCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ communityId, userId }) => 
      api.communities.unfollow(communityId, userId),
    onSuccess: (_, { communityId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMMUNITY, communityId] });
    },
  });
};

export const useSearchCommunities = (query) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMUNITIES, 'search', query],
    queryFn: () => api.communities.search(query),
    enabled: query.length > 2,
  });
};

// ============= NOTIFICATION HOOKS =============
export const useNotifications = (userId, skip = 0, limit = 50) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, userId, skip, limit],
    queryFn: () => api.notifications.getAll(userId, skip, limit),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useUnreadNotificationsCount = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, 'unread', userId],
    queryFn: () => api.notifications.getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ notificationId, userId }) => 
      api.notifications.markAsRead(notificationId, userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS, userId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS, 'unread', userId] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId) => api.notifications.markAllAsRead(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS, userId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS, 'unread', userId] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ notificationId, userId }) => 
      api.notifications.delete(notificationId, userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS, userId] });
    },
  });
};

export const useNotificationPreferences = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION_PREFS, userId],
    queryFn: () => api.notifications.getPreferences(userId),
    enabled: !!userId,
  });
};

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, preferences }) => 
      api.notifications.updatePreferences(userId, preferences),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATION_PREFS, userId] });
    },
  });
};

// ============= UPLOAD HOOKS =============
export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file) => api.upload.uploadImage(file),
  });
};

export const useUploadVideo = () => {
  return useMutation({
    mutationFn: (file) => api.upload.uploadVideo(file),
  });
};