import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

export default function ProfilePage() {
    const navigate = useNavigate();
    const email = localStorage.getItem("user_email");

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`/profile/${email}`);
            setProfile(res.data);
        } catch (error) {
            console.error("Failed to load profile", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        View and manage your personal and professional details.
                    </p>
                </div>

                {!profile ? (
                    <p className="text-gray-700">Loading profile...</p>
                ) : (
                    <div className="space-y-6">

                        {/* Profile Card */}
                        <div className="bg-gray-50 rounded-xl p-6 border">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Personal Information
                            </h3>

                            <div className="space-y-3">

                                <div>
                                    <p className="text-gray-500 text-sm">Full Name</p>
                                    <p className="text-gray-900 font-medium">
                                        {profile.full_name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Email</p>
                                    <p className="text-gray-900 font-medium">{profile.email}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">Industry</p>
                                    <p className="text-gray-900 font-medium">{profile.industry}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/edit-profile")}
                                className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg 
                                hover:bg-blue-700 transition"
                            >
                                Edit Profile
                            </button>
                        </div>

                        {/* Language Selector */}
                        <div className="bg-gray-50 rounded-xl p-6 border">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Language Preferences
                            </h3>

                            <select
                                className="border p-3 rounded-lg w-full bg-white focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Tamil</option>
                            </select>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
