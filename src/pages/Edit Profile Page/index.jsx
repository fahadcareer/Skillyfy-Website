import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
    const navigate = useNavigate();
    const email = localStorage.getItem("user_email");

    const [form, setForm] = useState({
        full_name: "",
        current_role: "",
        years_of_experience: "",
        education: "",
        industry: "",
        key_skills: "",
        career_goals: ""
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await axios.get(`/profile/${email}`);
            const data = { ...res.data };
            delete data._id;
            delete data.email;
            setForm(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post("/profile", { ...form, email });
            alert("Profile updated successfully!");
            navigate("/profile");
        } catch (error) {
            console.error(error);
            alert("Update failed.");
        }
    };

    const setValue = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Your Profile
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Update your personal details and professional background.
                    </p>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Full Name */}
                    <div>
                        <label className="text-gray-600 font-medium">Full Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={form.full_name}
                            onChange={(e) => setValue("full_name", e.target.value)}
                        />
                    </div>

                    {/* Current Role */}
                    <div>
                        <label className="text-gray-600 font-medium">Current Role</label>
                        <input
                            type="text"
                            className="mt-1 w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={form.current_role}
                            onChange={(e) => setValue("current_role", e.target.value)}
                        />
                    </div>

                    {/* Years of Experience */}
                    <div>
                        <label className="text-gray-600 font-medium">Years of Experience</label>
                        <input
                            type="number"
                            className="mt-1 w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={form.years_of_experience}
                            onChange={(e) => setValue("years_of_experience", e.target.value)}
                        />
                    </div>

                    {/* Education */}
                    <div>
                        <label className="text-gray-600 font-medium">Education</label>
                        <input
                            type="text"
                            className="mt-1 w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={form.education}
                            onChange={(e) => setValue("education", e.target.value)}
                        />
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="text-gray-600 font-medium">Industry</label>
                        <input
                            type="text"
                            className="mt-1 w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={form.industry}
                            onChange={(e) => setValue("industry", e.target.value)}
                        />
                    </div>

                    {/* Key Skills */}
                    <div>
                        <label className="text-gray-600 font-medium">Key Skills</label>
                        <input
                            type="text"
                            className="mt-1 w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={form.key_skills}
                            onChange={(e) => setValue("key_skills", e.target.value)}
                        />
                    </div>
                </div>

                {/* Career Goals */}
                <div className="mt-6">
                    <label className="text-gray-600 font-medium">Career Goals</label>
                    <textarea
                        className="mt-1 w-full p-3 border rounded-lg bg-gray-50 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={form.career_goals}
                        onChange={(e) => setValue("career_goals", e.target.value)}
                    ></textarea>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={() => navigate("/profile")}
                        className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}
