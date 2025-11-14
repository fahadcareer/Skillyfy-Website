import { create } from "zustand";
import { apiGet } from "../../services/api_service";
import { ASSESSMENT_NETWORK_URLS } from "../../config/network_string";

const extractErrorMessage = (err) =>
    err?.message || "Something went wrong. Please try again.";

const usePastAssessmentsStore = create((set) => ({
    assessments: [],
    loading: false,
    error: null,

    fetchPastAssessments: async (email) => {
        set({ loading: true, error: null });
        try {
            const res = await apiGet(`${ASSESSMENT_NETWORK_URLS.GetPastAssessments}?email=${email}`);

            if (!Array.isArray(res)) {
                throw new Error("Unexpected response format");
            }

            set({ assessments: res, loading: false });
            return { success: true, data: res };
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    reset: () => set({ assessments: [], loading: false, error: null }),
}));

export default usePastAssessmentsStore;
