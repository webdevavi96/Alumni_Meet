import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext";
import { React, useContext } from "react";


function ProtectedRoutes({ children }) {
    const { isAuthenticated } = useContext(AuthContext)
    if (!isAuthenticated) return <Navigate to="/login_erquired" replace />
    return children
}

export default ProtectedRoutes