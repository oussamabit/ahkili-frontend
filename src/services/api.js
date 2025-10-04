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

export const createComment = async (postId, commentData, userId) => {
  const response = await api.post(`/comments/post/${postId}?user_id=${userId}`, commentData);
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

export default api;