import { create } from "zustand";
import { apiGet } from "../../services/api_service";
import { ASSESSMENT_NETWORK_URLS } from "../../config/network_string";

const extractErrorMessage = (err) =>
    err?.message || "Something went wrong. Please try again.";

const useAllUsersStore = create((set) => ({
    assessments: [],
    loading: false,
    error: null,

    fetchAllAssessments: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiGet(ASSESSMENT_NETWORK_URLS.GetAllAssessments, {
                role: "manager",
            });

            set({ assessments: res || [], loading: false });
            return { success: true, data: res };
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    clearError: () => set({ error: null }),
}));
export default useAllUsersStore;
