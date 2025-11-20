import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, BookOpen, ArrowLeft, Route } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AssessmentDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const assessment = location.state?.data;
    if (!assessment) return null;

    const {
        score = 0,
        total_questions = 0,
        technical_assessment = [],
        roadmap = []
    } = assessment;

    const percentage = total_questions ? Math.round((score / total_questions) * 100) : 0;

    const performanceGradient = () => {
        if (percentage >= 80) return "from-emerald-500 to-teal-500";
        if (percentage >= 60) return "from-blue-500 to-indigo-500";
        if (percentage >= 40) return "from-amber-500 to-yellow-500";
        return "from-rose-500 to-red-500";
    };

    const performanceLabel = () => {
        if (percentage >= 80) return t("performanceExcellent");
        if (percentage >= 60) return t("performanceGood");
        if (percentage >= 40) return t("performanceAverage");
        return t("performanceNeedsImprovement");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">{t("back")}</span>
                </button>

                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {t("assessmentDetails")}
                </h1>

                <div />
            </div>

            {/* Score Card */}
            <div className={`
                rounded-3xl shadow-xl p-10 text-white mb-12
                bg-gradient-to-r ${performanceGradient()}
                transform transition hover:scale-[1.01]
            `}>
                <p className="text-white/80 text-lg">{t("yourScore")}</p>

                <div className="flex items-end gap-2 mt-2 mb-4">
                    <span className="text-7xl font-extrabold">{score}</span>
                    <span className="text-3xl text-white/80">/ {total_questions}</span>
                </div>

                <div className="bg-white/20 backdrop-blur-md w-fit px-6 py-2 rounded-full text-sm font-semibold">
                    {percentage}% • {performanceLabel()}
                </div>
            </div>

            {/* Technical Questions */}
            <section className="mb-14">
                <div className="flex items-center gap-3 mb-5">
                    <div className="bg-blue-100 p-2 rounded-xl">
                        <BookOpen className="text-blue-600" size={22} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        {t("technicalQuestions")}
                    </h2>
                </div>

                {technical_assessment.length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 text-gray-500 shadow-md">
                        {t("noTechnicalQuestions")}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {technical_assessment.map((q, idx) => {
                            const answered = !!q.user_answer?.trim();
                            const correct = q.is_correct;

                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl p-6 shadow-md border hover:shadow-lg transition"
                                >
                                    {/* Question Row */}
                                    <div className="flex justify-between mb-4">
                                        <p className="font-semibold text-gray-900 text-lg">
                                            {idx + 1}. {q.question}
                                        </p>

                                        {answered ? (
                                            correct ? (
                                                <CheckCircle size={26} className="text-emerald-500" />
                                            ) : (
                                                <XCircle size={26} className="text-rose-500" />
                                            )
                                        ) : (
                                            <XCircle size={26} className="text-gray-300" />
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-500 mb-3">
                                        {t("type")}: {q.type}
                                    </p>

                                    {/* User Answer */}
                                    <p className="text-gray-800 mb-1">
                                        <span className="font-medium">{t("yourAnswer")}: </span>
                                        {answered ? (
                                            <span className={correct ? "text-emerald-600" : "text-rose-600"}>
                                                {q.user_answer}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">
                                                {t("notAnswered")}
                                            </span>
                                        )}
                                    </p>

                                    {/* Correct Answer */}
                                    <p className="text-gray-800">
                                        <span className="font-medium">{t("correctAnswer")}: </span>
                                        <span className="text-indigo-600">{q.correct_answer}</span>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Go To Roadmap Button */}
            <div className="flex justify-center mb-20">
                <button
                    onClick={() => navigate("/learning-roadmap", { state: { roadmap } })}
                    className="
                        flex items-center gap-2 px-6 py-3
                        bg-purple-600 text-white rounded-xl shadow-md
                        hover:bg-purple-700 transition font-medium
                    "
                >
                    <Route size={20} /> {t("viewFullRoadmap")}
                </button>
            </div>
        </div>
    );
}
