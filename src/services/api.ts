import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authApi = {
  setToken: (token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (email: string, username: string, password: string) =>
    api.post('/auth/register', { email, username, password }),

  getCurrentUser: () => api.get('/auth/me'),

  // Google OAuth
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
};

// Tasks API
export const tasksApi = {
  getTasks: () => api.get('/tasks'),
  getTodayTasks: () => api.get('/tasks/today'),
  createTask: (task: { title: string; description?: string; category?: string }) =>
    api.post('/tasks', task),
  updateTask: (id: number, task: any) => api.put(`/tasks/${id}`, task),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

// Users API
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getLeaderboard: () => api.get('/users/leaderboard'),
};

// Gamification API
export const gamificationApi = {
  getStats: () => api.get('/gamification'),
  addBadge: (badge: string) => api.post('/gamification/badge', { badge }),
};

// Quests API
export const questsApi = {
  getDailyQuests: () => api.get('/quests'),
  createQuest: (quest: { title: string; points?: number }) =>
    api.post('/quests', quest),
};

// History API
export const historyApi = {
  getHistory: (days?: number) => api.get(`/history${days ? `?days=${days}` : ''}`),
  getWeeklyStats: () => api.get('/history/weekly'),
};

// Pokemon API
export const pokemonApi = {
  getAllPokemon: () => api.get('/pokemon'),
  getPokemonById: (id: number) => api.get(`/pokemon/${id}`),
};

export default api;