import { create } from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,

            setToken: (token) => set({
                token,
                isAuthenticated: !!token
            }),

            clearAuth: () => set({
                token: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'auth-storage',

            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);