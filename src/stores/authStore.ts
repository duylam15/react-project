import { create } from "zustand";

interface AuthStore {
    sessionExpired: boolean;
    setSessionExpired: (expired: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    sessionExpired: false,
    setSessionExpired: (expired) => set({ sessionExpired: expired }),
}));
