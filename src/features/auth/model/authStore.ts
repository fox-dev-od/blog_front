import { create } from 'zustand';

import { authApi } from '../api/authApi';
import { CurrentUser, LoginPayload } from './types';

type AuthStore = {
  user: CurrentUser | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: CurrentUser | null) => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isInitialized: false,
  isAuthenticated: false,
  initialize: async () => {
    if (get().isInitialized) {
      return;
    }

    const isLoggedIn = localStorage.getItem('dasp_logged_in') === 'true';
    if (!isLoggedIn) {
      set({ user: null, isAuthenticated: false, isInitialized: true });
      return;
    }

    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isInitialized: true });
    } catch {
      localStorage.removeItem('dasp_logged_in');
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  },
  login: async (payload) => {
    const user = await authApi.login(payload);
    localStorage.setItem('dasp_logged_in', 'true');
    set({
      user,
      isAuthenticated: true,
      isInitialized: true,
    });
  },
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('dasp_logged_in');
      set({ user: null, isAuthenticated: false, isInitialized: true });
    }
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem('dasp_logged_in', 'true');
    } else {
      localStorage.removeItem('dasp_logged_in');
    }
    set({
      user,
      isAuthenticated: Boolean(user),
      isInitialized: true,
    });
  },
}));

window.addEventListener('auth:logout', () => {
  localStorage.removeItem('dasp_logged_in');
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isInitialized: true,
  });
});
