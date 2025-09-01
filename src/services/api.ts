import axios from 'axios';

interface Pokemon {
  petId: number;
  name: string;
  spriteStage1: string;
  spriteStage2: string;
  spriteStage3: string;
  type: string;
  description: string;
  evolutionLevels: {
    stage2: number;
    stage3: number;
  };
}

// Use relative URL for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api');

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

  register: (email: string, username: string, password: string, pokemon: Pokemon) =>
    api.post('/auth/register', { email, username, password, pokemon }),

  getCurrentUser: () => api.get('/auth/me'),

  // Google OAuth
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: { pokemonPet?: { name: string; spriteStage1: string; spriteStage2: string; spriteStage3: string; evolutionLevels?: { stage2: number; stage3: number } } }) => api.put('/auth/profile', data),
  googleAuth: () => api.get('/auth/google'),
};

// Tasks API
export const tasksApi = {
  getTasks: () => api.get('/tasks'),
  getTodayTasks: () => api.get('/tasks/today'),
  createTask: (task: { title: string; description?: string; category?: string }) =>
    api.post('/tasks', task),
  updateTask: (id: number, task: { title?: string; description?: string; category?: string; isDone?: boolean }) => api.put(`/tasks/${id}`, task),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
};

// Users API
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { pokemonPetId?: number; username?: string }) => api.put('/users/profile', data)
};

// Quests API
export const questsApi = {
  getDailyQuests: () => api.get('/quests/daily'),
};

// Gamification API
export const gamificationApi = {
  getStats: () => api.get('/gamification'),
  addBadge: (badge: string) => api.post('/gamification/badge', { badge }),
};

// History API
export const historyApi = {
  getHistory: (days?: number) => api.get(`/history${days ? `?days=${days}` : ''}`),
  getWeeklyStats: () => api.get('/history/weekly'),
};

// Pokemon API
export const pokemonApi = {
  getAvailablePokemon: () => api.get('/pokemon/available'),
  getCatchablePokemon: () => api.get('/pokemon/catchable'),
  getPokemonById: (id: number) => api.get(`/pokemon/${id}`),
  getCaughtPokemon: () => api.get('/pokemon/caught/my'),
  catchPokemon: (pokemonData: { catchablePokemonId: number }) => api.post('/pokemon/catch', pokemonData),
  releasePokemon: (pokemonId: number) => api.delete(`/pokemon/release/${pokemonId}`),
  // Add sprite serving endpoints
  getPetSprite: (id: number, stage: number) => `${api.defaults.baseURL}/pokemon/sprite/pet/${id}/${stage}`,
  getCatchableSprite: (id: number) => `${api.defaults.baseURL}/pokemon/sprite/catchable/${id}`,
  getPokemonGif: (id: number) => `${api.defaults.baseURL}/pokemon/gif/${id}`,
};

export default api;