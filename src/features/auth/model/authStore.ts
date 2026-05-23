import { create } from 'zustand';

import { authApi } from '../api/authApi';
import { CurrentUser, LoginPayload } from './types';

type AuthStore = {
  user: CurrentUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: CurrentUser | null) => void;
};

const storedToken = localStorage.getItem('accessToken');

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: storedToken,
  isAuthenticated: Boolean(storedToken),
  login: async (payload) => {
    const response = await authApi.login(payload);
    localStorage.setItem('accessToken', response.accessToken);

    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    set({
      user: response.user,
      accessToken: response.accessToken,
      isAuthenticated: true,
    });
  },
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
  setUser: (user) => set({ user, isAuthenticated: Boolean(user || storedToken) }),
}));
