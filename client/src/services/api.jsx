import axios from 'axios';
console.log('API base URL:', import.meta.env.VITE_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ critical
  }
  return config;
});

// Comments API
export const getComments = (postId) => api.get(`api/posts/${postId}/comments`);
export const addComment = (postId, comment) => api.post(`api/posts/${postId}/comments`, comment);
export const editComment = (postId, commentId, text) => api.put(`api/posts/${postId}/comments/${commentId}`, { text });
export const deleteComment = (postId, commentId) => api.delete(`api/posts/${postId}/comments/${commentId}`);

export const likePost = (postId) => api.post(`api/posts/${postId}/like`);
export const unlikePost = (postId) => api.post(`api/posts/${postId}/unlike`);

export const sendContactMessage = (data) => api.post('api/contact', data);

export const forgotPassword = (email) => api.post('api/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post('api/auth/reset-password', { token, password });

export default api;