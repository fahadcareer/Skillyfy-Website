import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, Users, History, Loader2, User, Brain } from "lucide-react";
import useAssessmentStore from "../../store/assessment-store/assessment-store";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { generateAssessment, fetchPastAssessments, fetchAllAssessments, loading } =
        useAssessmentStore();

    const [profile, setProfile] = useState(null);
    const email = localStorage.getItem("user_email");

    const fetchUserProfile = async () => {
        if (!email) return null;

        try {
            const res = await fetch(
                `https://meerana-ai.uaenorth.cloudapp.azure.com/skillyfy/profile/${email}`
            );

            if (!res.ok) return null;

            const data = await res.json();
            setProfile(data);
            return data;
        } catch (err) {
            console.error("Error fetching user profile:", err);
            return null;
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleSelfAssessment = async () => {
        if (!email) {
            alert(t("loginAgain"));
            navigate("/");
            return;
        }

        let userProfile = profile;

        if (!userProfile) {
            userProfile = await fetchUserProfile();
        }

        if (!userProfile) {
            alert(t("completeProfileWarning"));
            navigate("/complete-profile");
            return;
        }

        const { success, data, error } = await generateAssessment(userProfile);

        if (success) navigate("/assessment", { state: { data } });
        else alert(error);
    };

    const handlePastAssessments = async () => {
        const { success, data, error } = await fetchPastAssessments(email);
        if (success && data.length > 0) {
            navigate("/past-assessments", { state: { data } });
        } else {
            alert(error || t("noPastAssessments"));
        }
    };

    const handleAllUsersResults = async () => {
        const { success, data, error } = await fetchAllAssessments();
        if (success && data.length > 0) {
            navigate("/all-users-results", { state: { data } });
        } else {
            alert(error || t("noAssessmentsFound"));
        }
    };

    const actions = [
        {
            title: t("selfAssessment"),
            description: t("selfAssessmentDescription"),
            icon: <UserCheck size={28} className="text-blue-600" />,
            color: "from-blue-100 to-blue-50",
            onClick: handleSelfAssessment,
        },
        {
            title: t("allUsersResults"),
            description: t("allUsersResultsDescription"),
            icon: <Users size={28} className="text-purple-600" />,
            color: "from-purple-100 to-purple-50",
            onClick: handleAllUsersResults,
        },
        {
            title: t("pastAssessments"),
            description: t("pastAssessmentsDescription"),
            icon: <History size={28} className="text-orange-600" />,
            color: "from-orange-100 to-orange-50",
            onClick: handlePastAssessments,
        },
        {
            title: "Personalized Learning",
            description: "Upload a document and learn it your way",
            icon: <Brain size={28} className="text-green-600" />,
            color: "from-green-100 to-green-50",
            onClick: () => navigate("/personalize-learning"),
        }

    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative">
            {loading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm 
                flex flex-col items-center justify-center z-50">
                    <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-3" />
                    <p className="text-gray-700 font-medium">
                        {t("processingRequest")}
                    </p>
                </div>
            )}

            {/* HEADER */}
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
                        {t("dashboardTitle")}
                    </h1>

                    <div className="flex items-center gap-4">

                        {/* Profile Icon */}
                        <button
                            onClick={() => navigate("/profile")}
                            className="p-2 rounded-full hover:bg-gray-200"
                        >
                            <User size={22} className="text-gray-700" />
                        </button>

                        {/* Logout */}
                        <button
                            onClick={() => {
                                localStorage.clear();
                                navigate("/");
                            }}
                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium 
                            rounded-lg hover:bg-red-600 transition"
                        >
                            {t("logout")}
                        </button>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="max-w-6xl mx-auto w-full px-8 py-10">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 
                rounded-2xl p-10 text-white shadow-lg">
                    <h2 className="text-3xl font-semibold mb-3">
                        {t("welcomeBack")} 👋
                    </h2>

                    {profile ? (
                        <p className="text-blue-100 text-lg">
                            {profile.full_name}, {t("welcomeSubtitle")}
                        </p>
                    ) : (
                        <p className="text-blue-100 text-lg">
                            {t("loadingProfile")}
                        </p>
                    )}
                </div>
            </section>

            {/* QUICK ACTIONS */}
            <main className="flex-1 max-w-6xl mx-auto px-8 py-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    {t("quickActions")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {actions.map((item, index) => (
                        <div
                            key={index}
                            onClick={item.onClick}
                            className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 shadow-sm 
                            hover:shadow-lg cursor-pointer transition transform hover:-translate-y-1 
                            ${loading ? "opacity-50 pointer-events-none" : ""}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-white p-3 rounded-xl shadow-inner">
                                    {item.icon}
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </main>

            {/* FOOTER */}
            <footer className="text-center py-6 text-sm text-gray-500 border-t">
                © {new Date().getFullYear()} Skillyfy — {t("footerText")}
            </footer>
        </div>
    );
}
