import { create } from "zustand";
import { apiPost } from "../../services/api_service";
import { LEARNING_NETWORK_URLS } from "../../config/network_string";

const extractErrorMessage = (err) =>
    err?.message || "Something went wrong. Please try again.";

const useLearningStore = create((set) => ({
    content: null,
    loading: false,
    error: null,

    generateLearningContent: async (topic, userProfile) => {
        set({ loading: true, error: null });
        try {
            const res = await apiPost(
                LEARNING_NETWORK_URLS.GenerateLearningContent,
                { topic, user_profile: userProfile }
            );

            if (!res.pages || !res.pages.length)
                throw new Error("No learning content found.");

            set({ content: res, loading: false });
            return { success: true, data: res };
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    reset: () => set({ content: null, loading: false, error: null }),
}));

export default useLearningStore;
