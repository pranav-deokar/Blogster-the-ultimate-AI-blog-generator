import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 120000, // 2 minutes for AI generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || error.response.data.error || 'Server error');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Request failed');
    }
  }
);

export const blogAPI = {
  // Health check
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // Full blog generation pipeline
  generateBlog: async (keyword, onProgress) => {
    try {
      const response = await api.post('/generate-blog', { keyword });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Individual step endpoints
  analyzeKeyword: async (keyword) => {
    const response = await api.post('/analyze-keyword', { keyword });
    return response.data;
  },

  generateSerpGaps: async (keywordData) => {
    const response = await api.post('/generate-serp-gaps', { keywordData });
    return response.data;
  },

  generateOutline: async (keywordData, serpGaps) => {
    const response = await api.post('/generate-outline', { keywordData, serpGaps });
    return response.data;
  },

  regenerateSection: async (sectionTitle, keywordData, context) => {
    const response = await api.post('/regenerate-section', { 
      sectionTitle, 
      keywordData, 
      context 
    });
    return response.data;
  },
};

export default api;
