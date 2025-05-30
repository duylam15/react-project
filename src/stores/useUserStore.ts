import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    id: number;
    email: string;
    first_name: string;
    is_active: boolean;
    is_online: boolean;
    last_name: string;
    phone_number: string;
    role: string;
    url_avatar: string;
    url_background: string;
    username: string;
};

interface UserStore {
    user: User | null;
    isLogin: boolean;
    setUser: (user: User | null) => void; // ✅ sửa
    logout: () => void;
}

const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            isLogin: false,
            setUser: (user) => set({ user, isLogin: true }),
            logout: () => set({ user: null, isLogin: false }),
        }),
        {
            name: "user-storage", // tên key trong localStorage
        }
    )
);

export default useUserStore;
