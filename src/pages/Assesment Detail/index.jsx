import { useLocation, useNavigate } from "react-router-dom";
import { ClipboardCopy, CheckCircle, XCircle, BookOpen, Route, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AssessmentDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const assessment = location.state?.data;

    if (!assessment) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
                <p>{t("noAssessmentData")}</p>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    {t("backToDashboard")}
                </button>
            </div>
        );
    }

    const { score = 0, total_questions = 0, technical_assessment = [], roadmap = [] } = assessment;

    const percentage = total_questions > 0 ? Math.round((score / total_questions) * 100) : 0;

    // Performance color
    const getPerformanceColor = () => {
        if (percentage >= 80) return "from-green-500 to-green-400";
        if (percentage >= 60) return "from-blue-500 to-blue-400";
        if (percentage >= 40) return "from-yellow-500 to-yellow-400";
        return "from-red-500 to-red-400";
    };

    const getPerformanceLabel = () => {
        if (percentage >= 80) return t("performanceExcellent");
        if (percentage >= 60) return t("performanceGood");
        if (percentage >= 40) return t("performanceAverage");
        return t("performanceNeedsImprovement");
    };

    const copyRoadmap = () => {
        const roadmapText = roadmap
            .map((day) => `${day.day}: ${day.topic}\n${t("learn")}: ${day.learn}`)
            .join("\n\n");

        navigator.clipboard.writeText(roadmapText);
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

                <h1 className="text-2xl font-bold text-blue-600">
                    {t("assessmentDetails")}
                </h1>

                <div />
            </div>

            {/* Score Card */}
            <div className={`bg-gradient-to-r ${getPerformanceColor()} text-white p-8 rounded-2xl shadow-md mb-10`}>
                <h2 className="text-lg text-white/90 font-medium">{t("yourScore")}</h2>

                <div className="flex items-end justify-center my-4">
                    <span className="text-5xl font-bold">{score}</span>
                    <span className="text-2xl text-white/80"> / {total_questions}</span>
                </div>

                <div className="bg-white/20 w-fit mx-auto px-5 py-2 rounded-full text-sm">
                    {percentage}% • {getPerformanceLabel()}
                </div>
            </div>

            {/* Technical Questions */}
            <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="text-blue-600" size={22} />
                    <h3 className="text-lg font-semibold text-gray-800">{t("technicalQuestions")}</h3>
                </div>

                {technical_assessment.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-gray-500 shadow-sm">
                        {t("noTechnicalQuestions")}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {technical_assessment.map((q, idx) => {
                            const isAnswered = q.user_answer?.trim() !== "";
                            const isCorrect = q.is_correct === true;
                            const correctAnswer = q.correct_answer || t("notAvailable");

                            return (
                                <div
                                    key={idx}
                                    className={`bg-white rounded-xl border p-5 shadow-sm transition 
                                        ${isAnswered
                                            ? isCorrect
                                                ? "border-green-300"
                                                : "border-red-300"
                                            : "border-gray-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-800">
                                            {t("question")} {idx + 1}. {q.question}
                                        </h4>

                                        {isAnswered ? (
                                            isCorrect ? (
                                                <CheckCircle className="text-green-500" size={22} />
                                            ) : (
                                                <XCircle className="text-red-500" size={22} />
                                            )
                                        ) : (
                                            <XCircle className="text-gray-400" size={22} />
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-500 mb-3">
                                        {t("type")}: {q.type || t("notAvailable")}
                                    </p>

                                    <div className="text-sm space-y-2">
                                        <p>
                                            <span className="font-semibold text-gray-700">
                                                {t("yourAnswer")}:
                                            </span>{" "}
                                            <span
                                                className={`${!isAnswered
                                                    ? "text-gray-400 italic"
                                                    : isCorrect
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                    }`}
                                            >
                                                {isAnswered ? q.user_answer : t("notAnswered")}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="font-semibold text-gray-700">
                                                {t("correctAnswer")}:
                                            </span>{" "}
                                            <span className="text-blue-600">{correctAnswer}</span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Learning Roadmap */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Route className="text-blue-600" size={22} />
                        <h3 className="text-lg font-semibold text-gray-800">
                            {t("learningRoadmap")}
                        </h3>
                    </div>

                    {roadmap.length > 0 && (
                        <button
                            onClick={copyRoadmap}
                            className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm hover:bg-gray-100 transition"
                        >
                            <ClipboardCopy size={16} /> {t("copy")}
                        </button>
                    )}
                </div>

                {roadmap.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-gray-500 shadow-sm">
                        {t("noRoadmap")}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {roadmap.map((day, idx) => (
                            <div
                                key={idx}
                                className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                onClick={() =>
                                    navigate("/learning-content", { state: { topic: day.topic } })
                                }
                            >
                                <p className="text-blue-600 font-semibold underline">
                                    {day.day}: {day.topic}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">{day.learn}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
