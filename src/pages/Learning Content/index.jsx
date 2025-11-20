import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, BookOpen, Volume2, Pause, Play, X, Check } from "lucide-react";
import useLearningStore from "../../store/learning-store/learning-store";
import useLearningProgressStore from "../../store/learning-progress-store/learning-progress-store";
import { useTranslation } from "react-i18next";
import useTTS from "../../hooks/useTTS";

export default function LearningContentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const topic = location.state?.topic;
    const email = localStorage.getItem("user_email");
    const user_id = localStorage.getItem("user_id");

    const { content, loading, error, generateLearningContent } = useLearningStore();
    const { fetchProgress, saveProgress } = useLearningProgressStore();

    const [selectedPage, setSelectedPage] = useState(null);
    const [completedPages, setCompletedPages] = useState([]);
    const [progressLoaded, setProgressLoaded] = useState(false);

    const mainRef = useRef(null);
    const tts = useTTS();
    const [showTTS, setShowTTS] = useState(false);

    // Load content + progress
    useEffect(() => {
        const load = async () => {
            if (!topic) return;

            const { success, data } = await generateLearningContent(topic, { email, user_id });
            if (!success || !data?.pages) return;

            const res = await fetchProgress(user_id, topic);
            const saved = res?.data || {};

            setCompletedPages(saved.completed_pages || []);

            if (saved.page_title) {
                const last = data.pages.find(p => p.title === saved.page_title);
                setSelectedPage(last || data.pages[0]);
            } else {
                setSelectedPage(data.pages[0]);
            }

            setProgressLoaded(true);
        };

        load();
    }, []);

    // FORCE SCROLL RESET ON PAGE CHANGE (3-LAYER FIX)
    useEffect(() => {
        if (!selectedPage || !mainRef.current) return;

        // 1️⃣ Reset instantly
        mainRef.current.scrollTo(0, 0);

        // 2️⃣ Reset again after DOM update
        setTimeout(() => {
            mainRef.current?.scrollTo(0, 0);
        }, 30);

        // 3️⃣ Reset again after page content finishes rendering
        setTimeout(() => {
            mainRef.current?.scrollTo(0, 0);
        }, 150);

    }, [selectedPage]);

    // Save progress on page change (title only)
    useEffect(() => {
        if (!selectedPage || !progressLoaded) return;

        saveProgress({
            user_id,
            topic,
            page_title: selectedPage.title,
            pages: content.pages.map(p => p.title),
            completed_pages: completedPages
        });
    }, [selectedPage]);

    // MANUAL MARK COMPLETE
    const markPageComplete = () => {
        if (completedPages.includes(selectedPage.title)) return;

        const updated = [...completedPages, selectedPage.title];
        setCompletedPages(updated);

        saveProgress({
            user_id,
            topic,
            page_title: selectedPage.title,
            pages: content.pages.map(p => p.title),
            completed_pages: updated
        });
    };

    const composePageText = (page) => {
        if (!page) return "";
        let text = `${page.title}. `;

        page.subtopics?.forEach((sub, i) => {
            text += `Section ${i + 1}: ${sub.subtitle}. `;
            text += sub.description?.split(". ").slice(0, 2).join(". ") + ". ";
        });

        return text;
    };

    const readPage = () => {
        if (selectedPage) tts.speak(composePageText(selectedPage));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-gray-500">
                <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-3" />
                <p>{t("generatingLearningContent")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <BookOpen className="w-10 h-10 text-red-500 mb-3" />
                <p className="text-gray-600 mb-3">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {t("goBack")}
                </button>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                {t("noContentAvailable")}
            </div>
        );
    }

    const progressPercent = Math.round((completedPages.length / content.pages.length) * 100);

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold text-blue-600">📘 {content.topic}</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {content.pages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedPage(page)}
                            className={`w-full text-left p-3 rounded-md transition ${selectedPage?.title === page.title
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "hover:bg-gray-100 text-gray-700"
                                }`}
                        >
                            {page.title}

                            {completedPages.includes(page.title) && (
                                <span className="text-green-600 ml-2 text-sm">✔</span>
                            )}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main ref={mainRef} className="flex-1 h-screen overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-700">Learning Progress</h3>
                            <span className="text-sm font-medium text-blue-600">{progressPercent}% Completed</span>
                        </div>

                        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                            <div
                                className="h-3 bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                        >
                            <ArrowLeft size={18} /> {t("back")}
                        </button>

                        <h1 className="text-2xl font-bold text-blue-600">
                            {selectedPage?.title || t("learningContent")}
                        </h1>

                        {/* AUDIO */}
                        <div className="relative">
                            <button
                                onClick={() => setShowTTS((p) => !p)}
                                className="p-2 rounded-lg border hover:bg-gray-100 transition"
                            >
                                <Volume2 size={18} />
                            </button>

                            {showTTS && (
                                <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border p-4 z-50">
                                    <p className="font-medium text-gray-700 mb-3">Audio Options</p>

                                    <button
                                        onClick={readPage}
                                        className="w-full mb-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Read Page
                                    </button>

                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm text-gray-600 w-14">Rate</span>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2"
                                            step="0.1"
                                            value={tts.rate}
                                            onChange={(e) => tts.setRate(Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-sm text-gray-600 w-14">Pitch</span>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2"
                                            step="0.1"
                                            value={tts.pitch}
                                            onChange={(e) => tts.setPitch(Number(e.target.value))}
                                        />
                                    </div>

                                    <select
                                        className="w-full p-2 border rounded-lg text-sm mb-3"
                                        value={tts.voiceIndex ?? ""}
                                        onChange={(e) => tts.setVoiceIndex(Number(e.target.value))}
                                    >
                                        {tts.voices.map((v, i) => (
                                            <option key={i} value={i}>{v.name}</option>
                                        ))}
                                    </select>

                                    <div className="flex justify-between">
                                        {tts.status === "playing" && (
                                            <button onClick={tts.pause} className="px-3 py-1 border rounded-lg text-sm">
                                                <Pause size={16} />
                                            </button>
                                        )}

                                        {tts.status === "paused" && (
                                            <button onClick={tts.resume} className="px-3 py-1 border rounded-lg text-sm">
                                                <Play size={16} />
                                            </button>
                                        )}

                                        <button onClick={tts.stop} className="px-3 py-1 border rounded-lg text-sm">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    {selectedPage ? (
                        <>
                            {selectedPage.subtopics.map((sub, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-xl font-semibold text-gray-800">{sub.subtitle}</h2>

                                        <button
                                            onClick={() => tts.speak(sub.description)}
                                            className="p-2 rounded-lg border hover:bg-gray-100 md:flex hidden"
                                        >
                                            <Volume2 size={18} />
                                        </button>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line mt-4">
                                        {sub.description}
                                    </p>

                                    {sub.example && (
                                        <div className="mt-6">
                                            <div className="bg-gray-900 text-white rounded-lg p-4">
                                                <p className="font-semibold mb-2 text-green-300">Code:</p>
                                                <pre className="text-sm overflow-x-auto">
                                                    <code>{sub.example.code}</code>
                                                </pre>
                                            </div>

                                            {sub.example.output && (
                                                <div className="bg-black text-green-400 rounded-lg p-4 mt-4">
                                                    <p className="font-semibold mb-2">Output:</p>
                                                    <pre className="text-sm whitespace-pre-wrap">
                                                        {sub.example.output}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {sub.practice && (
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                                            <p className="text-blue-700 text-sm">
                                                <strong>Practice:</strong> {sub.practice}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* MARK COMPLETE */}
                            <div className="mt-6 flex justify-end">
                                {completedPages.includes(selectedPage.title) ? (
                                    <button
                                        disabled
                                        className="px-6 py-3 bg-green-600 text-white rounded-xl flex items-center gap-2 cursor-default"
                                    >
                                        <Check size={18} /> Completed
                                    </button>
                                ) : (
                                    <button
                                        onClick={markPageComplete}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2"
                                    >
                                        Mark as Complete <Check size={18} />
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500 text-center py-20">{t("selectPageToViewContent")}</div>
                    )}
                </div>
            </main>
        </div>
    );
}
