import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, BookOpen } from "lucide-react";
import useLearningStore from "../../store/learning-store/learning-store";
import { useTranslation } from "react-i18next";

export default function LearningContentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const topic = location.state?.topic;
    const email = localStorage.getItem("user_email");

    const { content, loading, error, generateLearningContent } = useLearningStore();
    const [selectedPage, setSelectedPage] = useState(null);
    const mainRef = useRef(null);

    useEffect(() => {
        const fetchContent = async () => {
            if (!topic) return;

            const { success, data } = await generateLearningContent(topic, { email });

            if (success && data?.pages?.length) {
                setSelectedPage(data.pages[0]);
            }
        };

        fetchContent();
    }, [topic, email]);
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [selectedPage]);

    /** LOADING VIEW */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-gray-500">
                <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-3" />
                <p>{t("generatingLearningContent")}</p>
            </div>
        );
    }

    /** ERROR VIEW */
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <BookOpen className="w-10 h-10 text-red-500 mb-3" />
                <p className="text-gray-600 mb-3">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    {t("goBack")}
                </button>
            </div>
        );
    }

    /** EMPTY VIEW */
    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                {t("noContentAvailable")}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* SIDEBAR */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-bold text-blue-600 truncate">
                        📘 {content.topic}
                    </h2>
                </div>

                {/* Sidebar Scroll */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {content.pages.map((page, pIndex) => (
                        <div
                            key={pIndex}
                            onClick={() => setSelectedPage(page)}
                            className={`cursor-pointer p-3 rounded-md transition ${selectedPage?.title === page.title
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            {page.title}
                        </div>
                    ))}
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main ref={mainRef} className="flex-1 h-screen overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                        >
                            <ArrowLeft size={18} /> {t("back")}
                        </button>

                        <h1 className="text-2xl font-bold text-blue-600">
                            {selectedPage?.title || t("learningContent")}
                        </h1>

                        <div />
                    </div>

                    {/* PAGE CONTENT */}
                    {selectedPage ? (
                        selectedPage.subtopics.map((sub, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8"
                            >
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    {sub.subtitle}
                                </h2>

                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {sub.description}
                                </p>

                                {/* Example Code */}
                                {sub.example && (
                                    <div className="bg-gray-900 text-white rounded-lg p-4 mb-6">
                                        <pre className="text-sm overflow-x-auto">
                                            <code>{sub.example.code}</code>
                                        </pre>
                                        <p className="text-gray-300 mt-2 text-sm">
                                            💡 {sub.example.explanation}
                                        </p>
                                    </div>
                                )}

                                {/* Practice Section */}
                                {sub.practice && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                        <p className="text-blue-700 text-sm font-medium">
                                            🧠 <strong>{t("practice")}:</strong> {sub.practice}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-center py-20">
                            {t("selectPageToViewContent")}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
