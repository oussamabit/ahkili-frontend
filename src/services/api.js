import axios from 'axios';

// ============= BASE API CLIENT =============
class APIClient {
  constructor(baseURL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000') {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

    // Request interceptor for adding auth tokens, logging, etc.
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Centralized error handling
        if (error.response?.status === 401) {
          // Handle unauthorized
          console.error('Unauthorized access');
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic CRUD methods
  async get(url, params = {}) {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post(url, data = {}, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data = {}) {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete(url, params = {}) {
    const response = await this.client.delete(url, { params });
    return response.data;
  }
}

// ============= RESOURCE BASE CLASS =============
class ResourceAPI {
  constructor(client, resource) {
    this.client = client;
    this.resource = resource;
  }

  async getAll(params = {}) {
    return this.client.get(`/${this.resource}/`, params);
  }

  async getOne(id) {
    return this.client.get(`/${this.resource}/${id}`);
  }

  async create(data, params = {}) {
    return this.client.post(`/${this.resource}/`, data, { params });
  }

  async update(id, data) {
    return this.client.put(`/${this.resource}/${id}`, data);
  }

  async delete(id, params = {}) {
    return this.client.delete(`/${this.resource}/${id}`, params);
  }

  async search(query) {
    return this.client.get(`/${this.resource}/search`, { q: query });
  }
}

// ============= SPECIFIC RESOURCE CLASSES =============
class UserAPI extends ResourceAPI {
  constructor(client) {
    super(client, 'users');
  }

  async getByFirebaseUid(firebaseUid) {
    return this.client.get(`/${this.resource}/firebase/${firebaseUid}`);
  }

  async getProfile(userId) {
    return this.client.get(`/${this.resource}/${userId}/profile`);
  }

  async updateProfile(userId, profileData) {
    return this.client.put(`/${this.resource}/${userId}/profile`, profileData);
  }
}

class PostAPI extends ResourceAPI {
  constructor(client) {
    super(client, 'posts');
  }

  async getAll(params = {}) {
    const { communityId, ...otherParams } = params;
    return this.client.get(`/${this.resource}/`, {
      ...(communityId && { community_id: communityId }),
      ...otherParams
    });
  }

  async create(postData, userId) {
    return this.client.post(`/${this.resource}/`, postData, {
      params: { user_id: userId }
    });
  }

  async delete(postId, userId) {
    return this.client.delete(`/${this.resource}/${postId}`, { user_id: userId });
  }

  async getUserPosts(userId) {
    return this.client.get(`/${this.resource}/user/${userId}`);
  }

  async react(postId, userId) {
    return this.client.post(`/reactions/post/${postId}`, {}, {
      params: { user_id: userId }
    });
  }

  async getReactions(postId) {
    return this.client.get(`/reactions/post/${postId}/count`);
  }

  async checkUserReaction(postId, userId) {
    return this.client.get(`/reactions/post/${postId}/user/${userId}`);
  }

  async getUserReactionsForPosts(userId, postIds) {
    return this.client.get(`/reactions/user/${userId}/posts`, {
      post_ids: postIds.join(',')
    });
  }
}

class CommentAPI extends ResourceAPI {
  constructor(client) {
    super(client, 'comments');
  }

  async getForPost(postId) {
    return this.client.get(`/${this.resource}/post/${postId}`);
  }

  async create(postId, commentData, userId, parentId = null) {
    const params = { user_id: userId };
    if (parentId) params.parent_id = parentId;
    
    return this.client.post(`/${this.resource}/post/${postId}`, commentData, { params });
  }

  async react(commentId, userId, reactionType = 'like') {
    return this.client.post(`/comment-reactions/comment/${commentId}`, {}, {
      params: { user_id: userId, reaction_type: reactionType }
    });
  }

  async getReactions(commentId, userId) {
    return this.client.get(`/comment-reactions/comment/${commentId}`, { user_id: userId });
  }
}

class CommunityAPI extends ResourceAPI {
  constructor(client) {
    super(client, 'communities');
  }

  async create(name, description, createdBy) {
    return this.client.post(`/${this.resource}/`, {}, {
      params: { name, description, created_by: createdBy }
    });
  }

  async join(communityId, userId) {
    return this.client.post(`/${this.resource}/${communityId}/join`, {}, {
      params: { user_id: userId }
    });
  }

  async leave(communityId, userId) {
    return this.client.delete(`/${this.resource}/${communityId}/leave`, {
      user_id: userId
    });
  }

  async checkMembership(communityId, userId) {
    return this.client.get(`/${this.resource}/${communityId}/check-membership`, {
      user_id: userId
    });
  }

  async follow(communityId, userId) {
    return this.client.post(`/notification/communities/${communityId}/follow`, {}, {
      params: { user_id: userId }
    });
  }

  async unfollow(communityId, userId) {
    return this.client.delete(`/notification/communities/${communityId}/follow`, {
      user_id: userId
    });
  }

  async isFollowing(communityId, userId) {
    return this.client.get(`/notification/communities/${communityId}/follow/check`, {
      user_id: userId
    });
  }

  async getFollowers(communityId) {
    return this.client.get(`/notification/communities/${communityId}/followers`);
  }
}

class NotificationAPI extends ResourceAPI {
  constructor(client) {
    super(client, 'notification/notifications');
  }

  async getAll(userId, skip = 0, limit = 50) {
    return this.client.get(`/${this.resource}/${userId}`, { skip, limit });
  }

  async getUnreadCount(userId) {
    return this.client.get(`/${this.resource}/${userId}/unread/count`);
  }

  async markAsRead(notificationId, userId) {
    return this.client.put(`/${this.resource}/${notificationId}/read`, {}, {
      params: { user_id: userId }
    });
  }

  async markAllAsRead(userId) {
    return this.client.put(`/${this.resource}/${userId}/read-all`);
  }

  async delete(notificationId, userId) {
    return this.client.delete(`/${this.resource}/${notificationId}`, {
      user_id: userId
    });
  }

  async getPreferences(userId) {
    return this.client.get(`/notification/notification-preferences/${userId}`);
  }

  async updatePreferences(userId, preferences) {
    return this.client.put(`/notification/notification-preferences/${userId}`, preferences);
  }
}

class UploadAPI {
  constructor(client) {
    this.client = client;
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.client.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async uploadVideo(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.client.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
}

// ============= MAIN API CLASS =============
class API {
  constructor() {
    const client = new APIClient();
    
    this.users = new UserAPI(client);
    this.posts = new PostAPI(client);
    this.comments = new CommentAPI(client);
    this.communities = new CommunityAPI(client);
    this.notifications = new NotificationAPI(client);
    this.upload = new UploadAPI(client);
  }
}

// ============= EXPORT SINGLETON =============
const api = new API();
export default api;

// Also export individual classes for testing or advanced usage
export { API, APIClient, ResourceAPI };

// ============= BACKWARD COMPATIBILITY EXPORTS =============
// These maintain compatibility with your existing code
// So you don't have to change all files at once!

// USER API
export const createUser = (userData) => api.users.create(userData);
export const getUserByFirebaseUid = (firebaseUid) => api.users.getByFirebaseUid(firebaseUid);
export const getUser = (userId) => api.users.getOne(userId);
export const getUserProfile = (userId) => api.users.getProfile(userId);
export const updateUserProfile = (userId, profileData) => api.users.updateProfile(userId, profileData);

// POST API
export const getPosts = (communityId = null) => api.posts.getAll({ communityId });
export const getPost = (postId) => api.posts.getOne(postId);
export const createPost = (postData, userId) => api.posts.create(postData, userId);
export const deletePost = (postId, userId) => api.posts.delete(postId, userId);
export const getUserPosts = (userId) => api.posts.getUserPosts(userId);
export const searchPosts = (query) => api.posts.search(query);

// COMMENT API
export const getComments = (postId) => api.comments.getForPost(postId);
export const createComment = (postId, commentData, userId, parentId = null) => 
  api.comments.create(postId, commentData, userId, parentId);
export const toggleCommentReaction = (commentId, userId, reactionType = 'like') =>
  api.comments.react(commentId, userId, reactionType);
export const getCommentReactions = (commentId, userId) => api.comments.getReactions(commentId, userId);

// COMMUNITY API
export const getCommunities = () => api.communities.getAll();
export const getCommunity = (communityId) => api.communities.getOne(communityId);
export const createCommunity = (name, description, createdBy) => 
  api.communities.create(name, description, createdBy);
export const joinCommunity = (communityId, userId) => api.communities.join(communityId, userId);
export const leaveCommunity = (communityId, userId) => api.communities.leave(communityId, userId);
export const checkCommunityMembership = (communityId, userId) => 
  api.communities.checkMembership(communityId, userId);
export const searchCommunities = (query) => api.communities.search(query);

// REACTION API
export const toggleReaction = (postId, userId) => api.posts.react(postId, userId);
export const getReactionsCount = (postId) => api.posts.getReactions(postId);
export const checkUserReaction = (postId, userId) => api.posts.checkUserReaction(postId, userId);
export const getUserReactionsForPosts = (userId, postIds) => 
  api.posts.getUserReactionsForPosts(userId, postIds);

// UPLOAD API
export const uploadImage = (file) => api.upload.uploadImage(file);
export const uploadVideo = (file) => api.upload.uploadVideo(file);

// NOTIFICATION API
export const getNotifications = (userId, skip = 0, limit = 50) => 
  api.notifications.getAll(userId, skip, limit);
export const getUnreadNotificationsCount = (userId) => api.notifications.getUnreadCount(userId);
export const markNotificationAsRead = (notificationId, userId) => 
  api.notifications.markAsRead(notificationId, userId);
export const markAllNotificationsAsRead = (userId) => api.notifications.markAllAsRead(userId);
export const deleteNotification = (notificationId, userId) => 
  api.notifications.delete(notificationId, userId);
export const getNotificationPreferences = (userId) => api.notifications.getPreferences(userId);
export const updateNotificationPreferences = (userId, preferences) => 
  api.notifications.updatePreferences(userId, preferences);

// COMMUNITY FOLLOWER API
export const followCommunity = (communityId, userId) => api.communities.follow(communityId, userId);
export const unfollowCommunity = (communityId, userId) => api.communities.unfollow(communityId, userId);
export const isFollowingCommunity = (communityId, userId) => api.communities.isFollowing(communityId, userId);
export const getCommunityFollowers = (communityId) => api.communities.getFollowers(communityId);