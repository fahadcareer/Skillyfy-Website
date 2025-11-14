import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Loader2,
    ClipboardList,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    ArrowLeft,
    ChevronRight,
    CalendarDays,
} from "lucide-react";
import usePastAssessmentsStore from "../../store/past-assessments-store/past-assessments-store";

export default function PastAssessmentsPage() {
    const navigate = useNavigate();
    const email = localStorage.getItem("user_email");

    const { assessments, fetchPastAssessments, loading, error } = usePastAssessmentsStore();

    useEffect(() => {
        if (email) fetchPastAssessments(email);
    }, [email]);

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    const getScoreColor = (score, total) => {
        const pct = total > 0 ? (score / total) * 100 : 0;
        if (pct >= 80) return "text-green-600";
        if (pct >= 60) return "text-blue-600";
        if (pct >= 40) return "text-orange-500";
        return "text-red-600";
    };

    const getStatusIcon = (status) => {
        const lower = status?.toLowerCase() || "";
        if (lower === "completed") return <CheckCircle className="text-green-600" size={20} />;
        if (lower === "in_progress") return <Clock className="text-blue-500" size={20} />;
        if (lower === "failed") return <XCircle className="text-red-500" size={20} />;
        return <AlertCircle className="text-gray-500" size={20} />;
    };

    // 🕒 Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
                <Loader2 className="animate-spin w-10 h-10 mb-4 text-blue-600" />
                <p>Loading assessments...</p>
            </div>
        );
    }

    // ❌ Error State
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    // 🫙 Empty State
    if (assessments.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
                <ClipboardList className="w-16 h-16 text-blue-400 mb-4" />
                <h2 className="text-lg font-semibold mb-2 text-gray-800">No Assessments Yet</h2>
                <p className="text-gray-500 mb-4 max-w-md">
                    Take your first assessment to see your progress and growth here.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    // ✅ Main UI
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 flex flex-col items-center">
            {/* Header */}
            <div className="max-w-5xl w-full mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                    <ClipboardList className="text-blue-500" /> Past Assessments
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                >
                    <ArrowLeft size={20} /> Back
                </button>
            </div>

            {/* Assessments List */}
            <div className="max-w-5xl w-full space-y-4">
                {assessments.map((item, index) => {
                    const percentage =
                        item.total_questions > 0
                            ? Math.round((item.score / item.total_questions) * 100)
                            : 0;
                    const scoreColor = getScoreColor(item.score, item.total_questions);

                    return (
                        <div
                            key={index}
                            onClick={() => navigate("/assessment-detail", { state: { data: item } })}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 cursor-pointer transition transform hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-3 rounded-xl bg-opacity-10 ${scoreColor.replace("text", "bg")}`}
                                    >
                                        <ClipboardList className={`${scoreColor}`} size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-base">
                                            Assessment #{item.assessment_id?.substring(0, 8)?.toUpperCase() || index + 1}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <CalendarDays size={14} />
                                            {new Date(item.created_at).toLocaleDateString()} • {getTimeAgo(item.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-400" size={20} />
                            </div>

                            {/* Score Stats */}
                            <div className="grid grid-cols-3 text-center border-t pt-4">
                                <div>
                                    <p className="text-sm text-gray-500">Score</p>
                                    <p className={`font-semibold ${scoreColor}`}>
                                        {item.score}/{item.total_questions}
                                    </p>
                                </div>
                                <div className="border-x">
                                    <p className="text-sm text-gray-500">Percentage</p>
                                    <p className={`font-semibold ${scoreColor}`}>{percentage}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div className="flex items-center justify-center gap-1 font-medium text-gray-700">
                                        {getStatusIcon(item.status)} {item.status || "Completed"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
