import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, TrendingUp, BookOpen } from "lucide-react";

export default function AssessmentResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result;

    if (!result) {
        return (
            <div className="p-10 text-center text-gray-500">
                No result data found. Please complete an assessment first.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 flex flex-col items-center">
            {/* Header */}
            <div className="max-w-5xl w-full mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-blue-600">🎯 Assessment Results</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                >
                    <ArrowLeft size={20} /> Back
                </button>
            </div>

            {/* Summary Section */}
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-md p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Award className="text-yellow-500" /> Overall Summary
                </h2>
                <p className="text-gray-700 mb-3">{result.career_summary}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Score</p>
                        <p className="text-2xl font-bold text-blue-700">{result.score}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Total Questions</p>
                        <p className="text-2xl font-bold text-green-700">{result.total_questions}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Percentage</p>
                        <p className="text-2xl font-bold text-purple-700">{result.percentage}%</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Strengths</p>
                        <p className="text-sm font-medium text-orange-700">
                            {result.skill_gap_analysis?.strengths?.join(", ") || "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Career Path Section */}
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-md p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-green-500" /> Career Path Recommendations
                </h2>

                {result.career_path?.map((role, i) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-4 mb-6">
                        <h3 className="text-lg font-semibold text-blue-700">{role.role_title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{role.timeline}</p>
                        <p className="text-gray-700 mb-2">{role.description}</p>
                        <p className="text-sm text-gray-600">
                            <strong>Requirements:</strong> {role.requirements.join(", ")}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            <strong>Salary:</strong> {role.salary_range}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recommended Learning Path */}
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-md p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="text-indigo-500" /> Recommended Learning Path
                </h2>

                <div className="grid gap-4">
                    {result.recommended_learning_path?.map((item, i) => (
                        <div
                            key={i}
                            className="border rounded-lg p-4 hover:bg-indigo-50 transition"
                        >
                            <h3 className="font-semibold text-indigo-700 mb-1">{item.skill}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Priority:</strong> {item.priority} |{" "}
                                <strong>Timeline:</strong> {item.timeline}
                            </p>
                            <p className="text-gray-700 mb-2">{item.description}</p>
                            <p className="text-sm text-gray-500">
                                <strong>Resources:</strong> {item.resources.join(", ")}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Study Roadmap */}
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">📘 30-Day Study Roadmap</h2>
                <div className="grid gap-3">
                    {result.study_roadmap?.map((day, i) => (
                        <div
                            key={i}
                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                        >
                            <p className="text-sm text-gray-500 font-medium">{day.day}</p>
                            <h3 className="font-semibold text-gray-800">{day.topic}</h3>
                            <p className="text-gray-600 text-sm">{day.learn}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
