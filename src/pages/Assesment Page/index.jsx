import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import useEvaluationStore from "../../store/evaluation-store/evaluation-store";

export default function AssessmentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { evaluateAssessment, loading, error } = useEvaluationStore();
    const [assessmentData] = useState(location.state?.data || null);
    const [responses, setResponses] = useState({});

    const questions = assessmentData?.technical_assessment || [];

    const handleOptionSelect = (qid, value) => {
        setResponses((prev) => ({ ...prev, [qid]: value }));
    };

    const handleSubmit = async () => {
        if (!assessmentData?.assessment_id) {
            alert("Invalid assessment data. Please retry.");
            return;
        }

        const { success, data, error } = await evaluateAssessment(
            assessmentData.assessment_id,
            responses
        );

        if (success) {
            navigate("/assessment-result", { state: { result: data } });
        } else {
            alert(error || "Failed to evaluate responses.");
        }
    };

    if (!assessmentData) {
        return (
            <div className="p-10 text-center text-gray-500">
                No assessment data found. Please try again.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center relative">
            {/* Full-page loading overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-3" />
                    <p className="text-gray-700 font-medium">Evaluating your answers...</p>
                </div>
            )}

            {/* Header */}
            <div className="max-w-4xl w-full mb-6">
                <h2 className="text-3xl font-bold text-blue-600 mb-2">🧠 Self Assessment</h2>
                <p className="text-gray-500 mb-2">
                    Answer each question carefully to receive personalized insights.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-sm text-blue-700">
                    Total Questions: {questions.length || 0}
                </div>
            </div>

            {/* Questions Section */}
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md p-8 space-y-8">
                {questions.map((q, idx) => (
                    <div key={q.id || idx} className="border-b pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {idx + 1}. {q.question}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                            Domain: {q.domain} | Level: {q.level} | Type: {q.type}
                        </p>

                        {q.type === "mcq" ? (
                            <div className="space-y-2">
                                {q.options?.map((opt, i) => (
                                    <label
                                        key={i}
                                        className={`block border rounded-lg px-4 py-2 cursor-pointer hover:bg-blue-50 ${responses[q.id] === opt
                                            ? "bg-blue-100 border-blue-400"
                                            : ""
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={opt}
                                            checked={responses[q.id] === opt}
                                            onChange={() => handleOptionSelect(q.id, opt)}
                                            className="mr-2"
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea
                                rows="4"
                                placeholder="Type your answer..."
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={responses[q.id] || ""}
                                onChange={(e) => handleOptionSelect(q.id, e.target.value)}
                            />
                        )}
                    </div>
                ))}

                {/* Empty fallback */}
                {questions.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-10">
                        No questions available. Please regenerate assessment.
                    </div>
                )}

                {/* Submit Button */}
                {questions.length > 0 && (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`mt-8 w-full py-3 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Assessment"
                        )}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
}
