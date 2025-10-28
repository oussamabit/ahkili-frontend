import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============= USER API =============
export const createUser = async (userData) => {
  const response = await api.post('/users/', userData);
  return response.data;
};

export const getUserByFirebaseUid = async (firebaseUid) => {
  const response = await api.get(`/users/firebase/${firebaseUid}`);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// ============= POST API =============
export const getPosts = async (communityId = null) => {
  const params = communityId ? { community_id: communityId } : {};
  const response = await api.get('/posts/', { params });
  return response.data;
};

export const getPost = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const createPost = async (postData, userId) => {
 
  const response = await api.post(`/posts/?user_id=${userId}`, postData);
 
  return response.data;
};

export const deletePost = async (postId, userId) => {
  const response = await api.delete(`/posts/${postId}?user_id=${userId}`);
  return response.data;
};

// ============= COMMENT API =============
export const getComments = async (postId) => {
  const response = await api.get(`/comments/post/${postId}`);
  return response.data;
};

export const createComment = async (postId, commentData, userId, parentId = null) => {
  const url = parentId 
    ? `/comments/post/${postId}?user_id=${userId}&parent_id=${parentId}`
    : `/comments/post/${postId}?user_id=${userId}`;
  const response = await api.post(url, commentData);
  return response.data;
};

// ============= COMMUNITY API =============
export const getCommunities = async () => {
  const response = await api.get('/communities/');
  return response.data;
};

export const getCommunity = async (communityId) => {
  const response = await api.get(`/communities/${communityId}`);
  return response.data;
};

export const createCommunity = async (name, description, createdBy) => {
  const response = await api.post(`/communities/?name=${name}&description=${description}&created_by=${createdBy}`);
  return response.data;
};

export const getUserPosts = async (userId) => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
};

// ============= SEARCH API =============
export const searchPosts = async (query) => {
  const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const searchCommunities = async (query) => {
  const response = await api.get(`/communities/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

// ============= REACTION API =============
export const toggleReaction = async (postId, userId) => {
  const response = await api.post(`/reactions/post/${postId}?user_id=${userId}`);
  return response.data;
};

export const getReactionsCount = async (postId) => {
  const response = await api.get(`/reactions/post/${postId}/count`);
  return response.data;
};

export const checkUserReaction = async (postId, userId) => {
  const response = await api.get(`/reactions/post/${postId}/user/${userId}`);
  return response.data;
};

export const getUserReactionsForPosts = async (userId, postIds) => {
  const response = await api.get(`/reactions/user/${userId}/posts?post_ids=${postIds.join(',')}`);
  return response.data;
};

// ============= UPLOAD API =============
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ============= COMMENT REACTION API =============
export const toggleCommentReaction = async (commentId, userId, reactionType = 'like') => {
  const response = await api.post(`/comment-reactions/comment/${commentId}?user_id=${userId}&reaction_type=${reactionType}`);
  return response.data;
};

export const getCommentReactions = async (commentId, userId) => {
  const response = await api.get(`/comment-reactions/comment/${commentId}?user_id=${userId}`);
  return response.data;
};

// ============= NOTIFICATION PREFERENCE API =============
export const getNotificationPreferences = async (userId) => {
  const response = await api.get(`/notification/notification-preferences/${userId}`);
  return response.data;
};

export const updateNotificationPreferences = async (userId, preferences) => {
  const response = await api.put(`/notification/notification-preferences/${userId}`, preferences);
  return response.data;
};

// ============= NOTIFICATION API =============
export const getNotifications = async (userId, skip = 0, limit = 50) => {
  const response = await api.get(`/notification/notifications/${userId}?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getUnreadNotificationsCount = async (userId) => {
  const response = await api.get(`/notification/notifications/${userId}/unread/count`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const response = await api.put(`/notification/notifications/${notificationId}/read?user_id=${userId}`);
  return response.data;
};

export const markAllNotificationsAsRead = async (userId) => {
  const response = await api.put(`/notification/notifications/${userId}/read-all`);
  return response.data;
};

export const deleteNotification = async (notificationId, userId) => {
  const response = await api.delete(`/notification/notifications/${notificationId}?user_id=${userId}`);
  return response.data;
};

// ============= COMMUNITY FOLLOWER API =============
export const followCommunity = async (communityId, userId) => {
  const response = await api.post(`/notification/communities/${communityId}/follow?user_id=${userId}`);
  return response.data;
};

export const unfollowCommunity = async (communityId, userId) => {
  const response = await api.delete(`/notification/communities/${communityId}/follow?user_id=${userId}`);
  return response.data;
};

export const isFollowingCommunity = async (communityId, userId) => {
  const response = await api.get(`/notification/communities/${communityId}/follow/check?user_id=${userId}`);
  return response.data;
};

export const getCommunityFollowers = async (communityId) => {
  const response = await api.get(`/notification/communities/${communityId}/followers`);
  return response.data;
};

export default api;