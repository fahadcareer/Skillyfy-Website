import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
    const navigate = useNavigate();
    const email = localStorage.getItem("user_email");
    const { t, i18n } = useTranslation();

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`/profile/${email}`);
            setProfile(res.data);
        } catch (error) {
            console.error("Failed to load profile", error);
        }
    };

    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("i18nextLng", lang);

        // Update document direction
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {t("profileSettings")}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {t("profileSubtitle")}
                    </p>
                </div>

                {!profile ? (
                    <p className="text-gray-700">{t("loadingProfile")}</p>
                ) : (
                    <div className="space-y-6">

                        {/* Profile Card */}
                        <div className="bg-gray-50 rounded-xl p-6 border">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {t("personalInformation")}
                            </h3>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("fullName")}
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {profile.full_name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("email")}
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {profile.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {t("industry")}
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        {profile.industry}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/edit-profile")}
                                className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg 
                                hover:bg-blue-700 transition"
                            >
                                {t("editProfile")}
                            </button>
                        </div>

                        {/* Language Selector */}
                        <div className="bg-gray-50 rounded-xl p-6 border">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {t("languagePreferences")}
                            </h3>

                            <select
                                value={i18n.language}
                                onChange={(e) => handleChangeLanguage(e.target.value)}
                                className="border p-3 rounded-lg w-full bg-white focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="en">{t("english")}</option>
                                <option value="ar">{t("arabic")}</option>
                            </select>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
