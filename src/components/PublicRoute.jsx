import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
    const email = localStorage.getItem("user_email");
    if (email) return <Navigate to="/dashboard" replace />;

    return children;
}
