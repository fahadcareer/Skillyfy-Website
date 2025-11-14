import { create } from "zustand";
import { apiGet, apiPost } from "../../services/api_service";
import { ASSESSMENT_NETWORK_URLS } from "../../config/network_string";

const extractErrorMessage = (err) =>
    err?.message || "Something went wrong. Please try again.";

const useAssessmentStore = create((set, get) => ({
    data: null,
    loading: false,
    error: null,

    // Generate Self Assessment
    generateAssessment: async (userProfile) => {
        set({ loading: true, error: null });
        try {
            const res = await apiPost(ASSESSMENT_NETWORK_URLS.GenerateAssessment, userProfile);
            set({ data: res, loading: false });
            return { success: true, data: res };
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    // Get Past Assessments
    fetchPastAssessments: async (email) => {
        set({ loading: true, error: null });
        try {
            const res = await apiGet(`${ASSESSMENT_NETWORK_URLS.GetPastAssessments}?email=${email}`);
            set({ data: res, loading: false });
            return { success: true, data: res };
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    fetchAllAssessments: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiGet(ASSESSMENT_NETWORK_URLS.GetAllAssessments, { role: "manager" });
            set({ data: res, loading: false });
            return { success: true, data: res };
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },


    clearError: () => set({ error: null }),
    resetStore: () => set({ data: null, loading: false, error: null }),
}));

export default useAssessmentStore;
