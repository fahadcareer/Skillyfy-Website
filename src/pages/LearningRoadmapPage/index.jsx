import { useLocation, useNavigate } from "react-router-dom";
import { Route, ArrowLeft, ClipboardCopy } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function LearningRoadmapPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const roadmap = location.state?.roadmap || [];

    const copyRoadmap = () => {
        const text = roadmap
            .map((d) => `${d.day}: ${d.topic}\n${t("learn")}: ${d.learn}`)
            .join("\n\n");

        navigator.clipboard.writeText(text);
        alert(t("roadmapCopied"));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowLeft size={18} /> {t("back")}
                </button>

                <h1 className="text-xl font-bold text-blue-600">
                    {t("fullLearningRoadmap")}
                </h1>

                <button
                    onClick={copyRoadmap}
                    className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm hover:bg-gray-100 transition"
                >
                    <ClipboardCopy size={16} /> {t("copy")}
                </button>
            </div>

            {/* Roadmap List */}
            {roadmap.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-gray-500 shadow-sm">
                    {t("noRoadmap")}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 divide-y">
                    {roadmap.map((day, idx) => (
                        <div key={idx} className="p-5 hover:bg-gray-50 transition">

                            <p className="text-blue-600 font-semibold text-lg underline">
                                {day.day}: {day.topic}
                            </p>

                            <p className="text-gray-700 mt-2 leading-relaxed">
                                {day.learn}
                            </p>

                            <button
                                className="mt-3 text-sm text-blue-600 underline hover:text-blue-800"
                                onClick={() =>
                                    navigate("/learning-content", {
                                        state: { topic: day.topic },
                                    })
                                }
                            >
                                ➜ {t("openLearningContent")}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
