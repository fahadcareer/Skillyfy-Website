import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, User, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import useAllUsersStore from "../../store/all-users-store/all-users-store";
import { useTranslation } from "react-i18next";

export default function AllUsersResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { assessments, fetchAllAssessments, loading, error } = useAllUsersStore();

    useEffect(() => {
        if (location.state?.data?.length) {
            useAllUsersStore.setState({ assessments: location.state.data });
        } else {
            fetchAllAssessments();
        }
    }, []);

    const formatDate = (date) => {
        if (!date) return "-";
        try {
            return new Date(date).toLocaleString();
        } catch {
            return "-";
        }
    };

    const getScoreColor = (score, total) => {
        const percent = total > 0 ? (score / total) * 100 : 0;
        if (percent >= 80) return "text-green-600 bg-green-50 border-green-200";
        if (percent >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-600" />
                {t("loadingAssessments")}
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
                <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
                <p>{error}</p>
                <button
                    onClick={fetchAllAssessments}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <RefreshCw size={16} /> {t("retry")}
                </button>
            </div>
        );
    }

    if (!assessments.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
                <User className="w-10 h-10 mb-3 text-gray-400" />
                <p>{t("noAssessmentsFound")}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-blue-600">
                        📊 {t("allUsersAssessments")}
                    </h2>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                    >
                        {t("backToDashboard")}
                    </button>
                </div>

                {/* Assessments List */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((item, index) => {
                        const user = item.user_profile || {};
                        const score = item.score || 0;
                        const total = item.total_questions || 0;

                        return (
                            <div
                                key={index}
                                onClick={() =>
                                    navigate("/assessment-detail", { state: { data: item } })
                                }
                                className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 cursor-pointer transition transform hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <User className="text-blue-600" size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">
                                            {user.full_name || t("unknownUser")}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {user.current_role || t("noRole")}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div
                                        className={`text-sm font-medium border px-3 py-1 rounded-lg ${getScoreColor(
                                            score,
                                            total
                                        )}`}
                                    >
                                        {score}/{total}
                                    </div>

                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar size={14} />
                                        {formatDate(item.created_at)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
