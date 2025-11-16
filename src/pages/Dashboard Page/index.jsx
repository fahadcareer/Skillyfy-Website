import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, Users, History, Loader2, User } from "lucide-react";
import useAssessmentStore from "../../store/assessment-store/assessment-store";

export default function Dashboard() {
    const navigate = useNavigate();
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
            alert("No user email found. Please login again.");
            navigate("/");
            return;
        }

        let userProfile = profile;

        if (!userProfile) {
            userProfile = await fetchUserProfile();
        }

        if (!userProfile) {
            alert("Please complete your profile before taking assessments.");
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
            alert(error || "No past assessments found.");
        }
    };

    const handleAllUsersResults = async () => {
        const { success, data, error } = await fetchAllAssessments();
        if (success && data.length > 0) {
            navigate("/all-users-results", { state: { data } });
        } else {
            alert(error || "No assessments found.");
        }
    };

    const actions = [
        {
            title: "Self Assessment",
            description: "Evaluate your own skills and progress.",
            icon: <UserCheck size={28} className="text-blue-600" />,
            color: "from-blue-100 to-blue-50",
            onClick: handleSelfAssessment,
        },
        {
            title: "All Users Results",
            description: "View overall user performance and analytics.",
            icon: <Users size={28} className="text-purple-600" />,
            color: "from-purple-100 to-purple-50",
            onClick: handleAllUsersResults,
        },
        {
            title: "Past Assessments",
            description: "Review your previous assessments and history.",
            icon: <History size={28} className="text-orange-600" />,
            color: "from-orange-100 to-orange-50",
            onClick: handlePastAssessments,
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative">
            {loading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm 
                flex flex-col items-center justify-center z-50">
                    <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-3" />
                    <p className="text-gray-700 font-medium">
                        Processing your request...
                    </p>
                </div>
            )}

            {/* HEADER */}
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
                        Skillyfy Dashboard
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
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <section className="max-w-6xl mx-auto w-full px-8 py-10">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 
                rounded-2xl p-10 text-white shadow-lg">
                    <h2 className="text-3xl font-semibold mb-3">Welcome Back 👋</h2>

                    {profile ? (
                        <p className="text-blue-100 text-lg">
                            {profile.full_name}, explore your assessments and personalized learning path.
                        </p>
                    ) : (
                        <p className="text-blue-100 text-lg">Loading your profile...</p>
                    )}
                </div>
            </section>

            {/* QUICK ACTIONS */}
            <main className="flex-1 max-w-6xl mx-auto px-8 py-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Quick Actions
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
                © {new Date().getFullYear()} Skillyfy — Empowering your learning journey.
            </footer>
        </div>
    );
}
