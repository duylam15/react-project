import { create } from "zustand";

interface PostStore {
    refresh: number;
    doRefresh: () => void;
}

const usePostStore = create<PostStore>((set) => ({
    refresh: 0,
    doRefresh: () =>
        set((state) => ({
            refresh: state.refresh + 1,
        })),
}));

export default usePostStore;
