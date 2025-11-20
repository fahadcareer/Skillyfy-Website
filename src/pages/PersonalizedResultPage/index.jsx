import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    Mic,
    Network,
    Images,
    Presentation,
    Maximize2,
    Minimize2,
    Download,
} from "lucide-react";

import MindMap from "../../components/MindMap";
import { ReactFlowProvider } from "@xyflow/react";

import { useRef, useState, useEffect } from "react";
import * as htmlToImage from "html-to-image";

export default function PersonalizedResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const fullscreenWrapperRef = useRef(null);
    const mindmapCaptureRef = useRef(null);

    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        const handler = () => {
            setFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    const toggleFullscreen = async () => {
        const el = fullscreenWrapperRef.current;
        if (!el) return;

        try {
            if (!document.fullscreenElement) {
                await el.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (e) {
            console.warn("Fullscreen error:", e);
            setFullscreen((v) => !v);
        }
    };

    const downloadMindmap = async () => {
        try {
            const dataUrl = await htmlToImage.toPng(mindmapCaptureRef.current, {
                pixelRatio: 3,
                cacheBust: true,
            });

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${state?.topic || "mindmap"}.png`;
            link.click();
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    if (!state) return <div>No Data</div>;

    const {
        textLesson = "",
        audioUrl = "",
        mindmap = null,
        slides = [],
        images = [],
        interests = [],
        topic = "Your Topic",
    } = state;

    return (
        <div className="min-h-screen bg-gray-100">

            {!fullscreen && (
                // <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 shadow-md">
                //     <div className="max-w-5xl mx-auto flex justify-between items-center">
                //         <button
                //             onClick={() => navigate(-1)}
                //             className="text-white flex items-center gap-1"
                //         >
                //             <ArrowLeft size={18} /> Back
                //         </button>

                //         <h1 className="text-white text-xl font-bold">Personalized Output</h1>

                //         <div></div>
                //     </div>
                // </div>
                <div className="max-w-5xl w-full mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-blue-600 leading-tight">
                        🎯 Personalized Output
                    </h1>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition font-medium"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                </div>

            )}

            {!fullscreen && (
                <div className="max-w-5xl mx-auto p-6 space-y-8">

                    {/* Text */}
                    {textLesson && (
                        <section className="bg-white p-7 rounded-xl shadow border">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="text-indigo-600" />
                                <h2 className="text-lg font-semibold">Text Lesson</h2>
                            </div>
                            <p className="whitespace-pre-line text-gray-700">{textLesson}</p>
                        </section>
                    )}

                    {/* Audio */}
                    {audioUrl && (
                        <section className="bg-white p-7 rounded-xl shadow border">
                            <div className="flex items-center gap-2 mb-3">
                                <Mic className="text-green-600" />
                                <h2 className="text-lg font-semibold">Audio Lesson</h2>
                            </div>
                            <audio controls className="w-full">
                                <source src={audioUrl} type="audio/mpeg" />
                            </audio>
                        </section>
                    )}

                    {/* MindMap normal */}
                    {mindmap && (
                        <section className="bg-white p-7 rounded-xl shadow border">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Network className="text-blue-600" />
                                    <h2 className="text-lg font-semibold">Mind Map</h2>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        className="p-2 border rounded-lg"
                                        onClick={downloadMindmap}
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        className="p-2 border rounded-lg"
                                        onClick={toggleFullscreen}
                                    >
                                        <Maximize2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div
                                ref={mindmapCaptureRef}
                                className="bg-gray-100 p-4 rounded-xl overflow-hidden relative"
                                style={{ width: "100%", height: "600px" }}
                            >

                                <ReactFlowProvider>
                                    <MindMap
                                        data={mindmap}
                                        fullscreen={false}
                                    />
                                </ReactFlowProvider>
                            </div>

                        </section>
                    )}

                </div>
            )}

            {/* FULLSCREEN MODE */}
            {mindmap && (
                <div
                    ref={fullscreenWrapperRef}
                    className={`fixed inset-0 z-[9999] bg-black/90 ${fullscreen ? "block" : "hidden"}`}
                >
                    <div className="flex justify-between items-center p-4 text-white sticky top-0">
                        <h2 className="font-semibold">{topic}</h2>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={downloadMindmap}
                                className="p-2 rounded bg-white/20 hover:bg-white/30"
                            >
                                <Download size={18} />
                            </button>

                            <button
                                onClick={toggleFullscreen}
                                className="p-2 rounded bg-white/20 hover:bg-white/30"
                            >
                                <Minimize2 size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-[calc(100vh-70px)] p-4">
                        <div
                            ref={mindmapCaptureRef}
                            className="w-full h-full bg-gray-800 rounded-lg overflow-hidden"
                        >
                            <ReactFlowProvider>
                                <MindMap data={mindmap} fullscreen={true} />
                            </ReactFlowProvider>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
