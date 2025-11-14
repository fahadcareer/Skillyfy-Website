import { create } from "zustand";
import { apiPost } from "../../services/api_service";
import { AUTH_NETWORK_URLS } from "../../config/network_string";

const extractErrorMessage = (err) =>
    err?.message || "Something went wrong. Please try again.";

const useAuthStore = create((set) => ({
    token: null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const res = await apiPost(AUTH_NETWORK_URLS.Login, { email, password });

            if (res.token) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("user_email", email);
            }

            set({ token: res.token || null, loading: false });
            return { success: true, data: res };
        } catch (err) {
            const errorMsg = extractErrorMessage(err);
            set({ error: errorMsg, loading: false });
            return { success: false, error: errorMsg };
        }
    },

    logout: () => {
        localStorage.clear();
        set({ token: null, error: null });
    },
}));

export default useAuthStore;
