import { create } from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export const useUserStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'user-storage',

            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),

        }
    )
);