import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth()

    if (loading) return null

    if(!user) return <Navigate to='/login' replace />

    if (roles && !roles.includes(user.rol)) {
        return <Navigate to="/" replace />
    }

    return children
}

export default PrivateRoute