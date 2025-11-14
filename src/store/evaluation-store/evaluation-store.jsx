import { create } from "zustand";
import { apiPost } from "../../services/api_service";
import { ASSESSMENT_NETWORK_URLS } from "../../config/network_string";

const extractErrorMessage = (err) =>
    err?.message || "Something went wrong. Please try again.";

const useEvaluationStore = create((set) => ({
    loading: false,
    error: null,
    result: null,

    evaluateAssessment: async (assessmentId, responses) => {
        set({ loading: true, error: null });
        try {
            const payload = {
                assessment_id: assessmentId,
                user_responses: Object.entries(responses).map(([question_id, user_answer]) => ({
                    question_id,
                    user_answer,
                })),
            };

            const res = await apiPost(ASSESSMENT_NETWORK_URLS.EvaluateAssessment, payload);

            set({ result: res, loading: false });
            return { success: true, data: res };
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    clearError: () => set({ error: null }),
    reset: () => set({ loading: false, error: null, result: null }),
}));

export default useEvaluationStore;
