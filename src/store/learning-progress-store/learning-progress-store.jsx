import { create } from "zustand";
import { apiGet, apiPost } from "../../services/api_service";

const extractErrorMessage = (err) =>
    err?.message || "Something went wrong. Please try again.";

export const PROGRESS_URLS = {
    SaveProgress: "/save-progress",
    GetProgress: "/get-progress",
};

const useLearningProgressStore = create((set) => ({
    progress: null,
    loading: false,
    error: null,

    // 🔹 SAVE PROGRESS
    saveProgress: async (payload) => {
        try {
            await apiPost(PROGRESS_URLS.SaveProgress, payload);
            return { success: true };
        } catch (err) {
            const msg = extractErrorMessage(err);
            return { success: false, error: msg };
        }
    },

    // 🔹 GET USER PROGRESS
    fetchProgress: async (user_id, topic) => {
        set({ loading: true, error: null });
        try {
            const res = await apiGet(
                `${PROGRESS_URLS.GetProgress}?user_id=${user_id}&topic=${topic}`
            );
            set({ progress: res, loading: false });
            return { success: true, data: res };
        } catch (err) {
            const msg = extractErrorMessage(err);
            set({ error: msg, loading: false });
            return { success: false, error: msg };
        }
    },

    clearError: () => set({ error: null }),
    resetStore: () => set({ progress: null, loading: false, error: null }),
}));

export default useLearningProgressStore;
