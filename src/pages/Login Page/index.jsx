import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth-store/auth-store";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, loading, error } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const { success, error } = await login(email, password);

        if (!success) {
            alert(error);
            return;
        }
        try {
            const res = await fetch(`https://meerana-ai.uaenorth.cloudapp.azure.com/skillyfy/profile/${email}`);

            if (res.status === 404) {
                navigate("/complete-profile");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            console.error("Profile check failed:", err);
            navigate("/dashboard");
        }
    };


    return (
        <div className="flex min-h-screen">
            {/* LEFT PANEL */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white flex-col justify-center items-center p-10">
                <div className="max-w-md text-center">
                    <img
                        src="/logo.svg"
                        alt="Skillyfy Logo"
                        className="w-20 h-20 mx-auto mb-6 drop-shadow-md"
                    />
                    <div className="text-5xl font-bold mb-4">Hello Skillyfy! 👋</div>
                    <p className="text-lg opacity-90 mb-8">
                        Skip repetitive manual tasks. Be highly productive through
                        automation and save tons of time!
                    </p>
                    <p className="text-sm opacity-70">
                        © {new Date().getFullYear()} Skillyfy. All rights reserved.
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex w-full md:w-1/2 justify-center items-center bg-white px-8">
                <div className="w-full max-w-sm">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Don’t have an account?{" "}
                        <a href="#" className="text-indigo-600 font-medium hover:underline">
                            Create a new account now
                        </a>
                        , it’s free!
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Logging in..." : "Login Now"}
                        </button>

                        <button
                            type="button"
                            className="w-full flex justify-center items-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
                        >
                            <FcGoogle className="text-xl" />
                            <span>Login with Google</span>
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 mt-6 text-center">
                        Forgot password?{" "}
                        <a href="#" className="text-indigo-600 hover:underline">
                            Click here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
