import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth-store/auth-store";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, loading, error } = useAuthStore();
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const { success, error } = await login(email, password);

        if (!success) {
            alert(error);
            return;
        }

        try {
            const res = await fetch(
                `https://meerana-ai.uaenorth.cloudapp.azure.com/skillyfy/profile/${email}`
            );

            if (res.status === 404) {
                navigate("/complete-profile");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Profile check failed:", err);
            navigate("/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* LEFT PANEL */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white flex-col justify-center items-center p-10">
                <div className="max-w-md text-center">
                    <img
                        src="/logo.svg"
                        alt="Skillyfy Logo"
                        className="w-20 h-20 mx-auto mb-6 drop-shadow-md"
                    />

                    <div className="text-5xl font-bold mb-4">
                        {t("helloSkillyfy")}
                    </div>

                    <p className="text-lg opacity-90 mb-8">
                        {t("loginLeftSubtitle")}
                    </p>

                    <p className="text-sm opacity-70">
                        © {new Date().getFullYear()} Skillyfy. {t("allRightsReserved")}
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex w-full md:w-1/2 justify-center items-center bg-white px-8">
                <div className="w-full max-w-sm">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {t("welcomeBack")}
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                        {t("dontHaveAccount")}{" "}
                        <a href="#" className="text-indigo-600 font-medium hover:underline">
                            {t("createAccount")}
                        </a>
                        , {t("itsFree")}
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                                {t("email")}
                            </label>
                            <input
                                type="email"
                                placeholder={t("enterEmail")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">
                                {t("password")}
                            </label>
                            <input
                                type="password"
                                placeholder={t("enterPassword")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? t("loggingIn") : t("loginNow")}
                        </button>

                        <button
                            type="button"
                            className="w-full flex justify-center items-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
                        >
                            <FcGoogle className="text-xl" />
                            <span>{t("loginWithGoogle")}</span>
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 mt-6 text-center">
                        {t("forgotPassword")}{" "}
                        <a href="#" className="text-indigo-600 hover:underline">
                            {t("clickHere")}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
