import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CompleteProfilePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const savedEmail = localStorage.getItem("user_email") || "";

    const [form, setForm] = useState({
        full_name: "",
        current_role: "",
        years_of_experience: "",
        education: "",
        industry: "",
        key_skills: "",
        career_goals: "",
        email: savedEmail,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(
                "https://meerana-ai.uaenorth.cloudapp.azure.com/skillyfy/profile",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            let data = {};
            try {
                data = await res.json();
            } catch { }

            if (res.ok) {
                alert(data.msg || t("profileUpdated"));
                navigate("/dashboard");
            } else {
                alert(data.msg || t("profileSaveFailed"));
            }
        } catch (error) {
            alert(t("somethingWentWrong"));
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white w-full max-w-2xl shadow-xl rounded-2xl p-10 border border-gray-200">

                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    {t("completeYourProfile")}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            name="full_name"
                            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder={t("fullName")}
                            value={form.full_name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="email"
                            type="email"
                            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder={t("email")}
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="current_role"
                            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder={t("currentRole")}
                            value={form.current_role}
                            onChange={handleChange}
                        />

                        <input
                            name="years_of_experience"
                            type="number"
                            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder={t("yearsOfExperience")}
                            value={form.years_of_experience}
                            onChange={handleChange}
                        />

                        <input
                            name="education"
                            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder={t("education")}
                            value={form.education}
                            onChange={handleChange}
                        />

                        <input
                            name="industry"
                            className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder={t("industry")}
                            value={form.industry}
                            onChange={handleChange}
                        />
                    </div>

                    <textarea
                        name="key_skills"
                        className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder={t("keySkills")}
                        rows={3}
                        value={form.key_skills}
                        onChange={handleChange}
                    />

                    <textarea
                        name="career_goals"
                        className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder={t("careerGoals")}
                        rows={4}
                        value={form.career_goals}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? t("saving") : t("saveProfile")}
                    </button>
                </form>
            </div>
        </div>
    );
}
