import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Updated to Spring Boot default port

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An error occurred';
    let fieldError = null;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Clear token and redirect to login if unauthorized
        localStorage.removeItem('token');
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth/signin';
        }
      }
      
      console.error('API Error Response:', error.response.data);
      
      // Format error message
      errorMessage = error.response.data?.message || 'An error occurred';
      
      // Add field error if present
      if (error.response.data?.field) {
        fieldError = {
          field: error.response.data.field,
          message: error.response.data.message
        };
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error:', error.request);
      errorMessage = 'Network error. Please check your connection and ensure the server is running.';
    } else {
      // Something happened in setting up the request
      console.error('API Setup Error:', error.message);
      errorMessage = 'An error occurred while setting up the request.';
    }
    
    // Create a proper Error object with additional properties
    const enhancedError = new Error(errorMessage);
    enhancedError.fieldError = fieldError;
    enhancedError.response = error.response;
    enhancedError.request = error.request;
    enhancedError.config = error.config;
    
    return Promise.reject(enhancedError);
  }
);

// Auth API
export const authAPI = {
  login: async (data) => {
    try {
      const response = await api.post('/auth/signin', {
        email: data.email.trim().toLowerCase(),
        password: data.password
      });
      console.log('Login Response:', response.data);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (data) => {
    try {
      // Ensure all required fields are present
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'gender'];
      for (const field of requiredFields) {
        if (!data[field]) {
          throw new Error(`${field} is required`);
        }
      }

      const formattedData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        gender: data.gender.toLowerCase()
      };

      console.log('Sending registration request with data:', {
        ...formattedData,
        password: '[HIDDEN]'
      });

      const response = await api.post('/auth/signup', formattedData);
      console.log('Registration Response:', {
        ...response.data,
        token: '[HIDDEN]'
      });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/users/profile'),
};

// User API
export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (data) => api.put('/users/profile', data),
  followUser: (userId) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => api.post(`/users/${userId}/unfollow`),
  getFollowers: (userId) => api.get(`/users/${userId}/followers`),
  getFollowing: (userId) => api.get(`/users/${userId}/following`),
};

// Post API
export const postAPI = {
  getPosts: (page = 0) => api.get(`/posts?page=${page}`),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
  unlikePost: (id) => api.post(`/posts/${id}/unlike`),
  commentOnPost: (id, data) => api.post(`/posts/${id}/comments`, data),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  savePost: (id) => api.post(`/posts/${id}/save`),
  unsavePost: (id) => api.post(`/posts/${id}/unsave`),
};

// File Upload API
export const fileAPI = {
  uploadFile: (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/files/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getFileUrl: (type, filename) => `${API_BASE_URL}/files/${type}/${filename}`,
};

export default api; 