import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    Mic,
    Network,
    Images,
    Presentation,
} from "lucide-react";
import MindMap from "../../components/MindMap";

export default function PersonalizedResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-600">No data received from server.</p>
                <button
                    onClick={() => navigate("/personalize-learning")}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const {
        textLesson = "",
        audioUrl = "",
        mindmap = null,
        slides = [],
        images = [],
        interests = [],
        topic = "Your Personalized Content",
    } = state;

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Top Gradient Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 shadow-md">
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white hover:opacity-80 transition"
                    >
                        <ArrowLeft size={20} /> Back
                    </button>

                    <h1 className="text-xl font-bold text-white tracking-wide">
                        Personalized Learning Output
                    </h1>

                    <div></div>
                </div>
            </div>

            {/* Page Container */}
            <div className="max-w-5xl mx-auto p-6 space-y-8">

                {/* Overview Card */}
                <div className="bg-white p-7 rounded-2xl shadow-lg border">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                        {topic}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Personalized based on your interests:{" "}
                        <span className="text-blue-700 font-medium">
                            {interests.join(", ")}
                        </span>
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-10">

                    {/* Text Lesson */}
                    {textLesson && (
                        <section className="bg-white p-7 rounded-2xl shadow border">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="text-indigo-600" size={22} />
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Personalized Text Lesson
                                </h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {textLesson}
                            </p>
                        </section>
                    )}

                    {/* Audio Lesson */}
                    {audioUrl && (
                        <section className="bg-white p-7 rounded-2xl shadow border">
                            <div className="flex items-center gap-3 mb-4">
                                <Mic className="text-green-600" size={22} />
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Audio Lesson
                                </h3>
                            </div>

                            <audio controls className="w-full mt-3 rounded-lg">
                                <source src={audioUrl} type="audio/mpeg" />
                            </audio>
                        </section>
                    )}

                    {/* Mind Map */}
                    {mindmap && (
                        <section className="bg-white p-7 rounded-2xl shadow border">
                            <div className="flex items-center gap-3 mb-4">
                                <Network className="text-blue-600" size={22} />
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Mind Map
                                </h3>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border shadow-inner">
                                <MindMap data={mindmap} />
                            </div>
                        </section>
                    )}

                    {/* Slides */}
                    {slides?.length > 0 && (
                        <section className="bg-white p-7 rounded-2xl shadow border">
                            <div className="flex items-center gap-3 mb-4">
                                <Presentation className="text-yellow-600" size={22} />
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Slides
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {slides.map((slide, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-50 rounded-xl p-5 border shadow-sm hover:shadow-md transition"
                                    >
                                        <h4 className="font-semibold text-gray-900 text-lg mb-3">
                                            {slide.title}
                                        </h4>
                                        <ul className="text-gray-700 space-y-1 list-disc ml-5">
                                            {slide.bullets?.map((b, idx) => (
                                                <li key={idx}>{b}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Images */}
                    {images?.length > 0 && (
                        <section className="bg-white p-7 rounded-2xl shadow border">
                            <div className="flex items-center gap-3 mb-4">
                                <Images className="text-pink-600" size={22} />
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Generated Images
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                {images.map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        className="rounded-2xl shadow-md border object-cover w-full h-48 hover:shadow-xl transition"
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
