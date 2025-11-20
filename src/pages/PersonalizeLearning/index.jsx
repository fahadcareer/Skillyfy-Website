import { useState } from "react";
import {
    Upload,
    Brain,
    Mic,
    FileText,
    Network,
    FolderPlus,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PersonalizeLearning() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [interests, setInterests] = useState([]);
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [loading, setLoading] = useState(false);

    const interestOptions = [
        "Football",
        "Gaming",
        "Music",
        "Movies",
        "Coding",
        "Business",
        "Fitness",
        "Cooking",
    ];

    const outputFormats = [
        { label: "Text Lesson", icon: <FileText size={20} /> },
        { label: "Audio", icon: <Mic size={20} /> },
        { label: "Mindmap", icon: <Network size={20} /> },
        { label: "Slides", icon: <FolderPlus size={20} /> },
    ];

    const handleInterestToggle = (interest) => {
        setInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    const handleFormatToggle = (format) => {
        setSelectedFormats((prev) =>
            prev.includes(format)
                ? prev.filter((f) => f !== format)
                : [...prev, format]
        );
    };

    /* ------------------------------------------------------------------
        🔥 FINAL BACKEND INTEGRATED FUNCTION
    ------------------------------------------------------------------ */
    const handleGenerate = async () => {
        if (!file) return alert("Please upload a document.");
        if (interests.length === 0)
            return alert("Select at least one interest.");
        if (selectedFormats.length === 0)
            return alert("Choose at least one output format.");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("interests", JSON.stringify(interests));
        formData.append("formats", JSON.stringify(selectedFormats));

        setLoading(true);

        try {
            const res = await fetch(
                "http://192.168.31.208:5075/skillyfy/personalize-learning",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                alert(data.error || "Failed to generate personalized content.");
                return;
            }

            // 👇 Navigate to result page with REAL backend output
            navigate("/personalized-result", { state: data });

        } catch (error) {
            setLoading(false);
            console.error("❌ Error:", error);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                        <p className="text-blue-600 font-semibold">Generating personalized content...</p>
                    </div>
                </div>
            )}

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-6"
            >
                <ArrowLeft size={20} />
                Back
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Brain size={32} className="text-blue-600" />
                Personalized Learning
            </h1>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:bg-gray-50">
                    <Upload size={32} className="text-gray-500 mb-3" />
                    <span className="text-gray-600 text-sm">
                        {file ? file.name : "Click to upload PDF or DOCX"}
                    </span>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </label>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Choose Your Interests</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {interestOptions.map((interest) => (
                        <button
                            key={interest}
                            onClick={() => handleInterestToggle(interest)}
                            className={`p-3 rounded-xl text-sm font-medium border transition ${interests.includes(interest)
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {interest}
                        </button>
                    ))}
                </div>
            </div>

            {/* Output Formats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">Choose Output Formats</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {outputFormats.map((f) => (
                        <button
                            key={f.label}
                            onClick={() => handleFormatToggle(f.label)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${selectedFormats.includes(f.label)
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {f.icon}
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleGenerate}
                    className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow hover:bg-blue-700 transition"
                >
                    Generate Personalized Content
                </button>
            </div>
        </div>
    );
}
