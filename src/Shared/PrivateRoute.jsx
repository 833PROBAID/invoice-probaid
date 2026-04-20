import { Navigate, useLocation } from "react-router-dom";
import Loading from "./Loading";
import GetAuth from "./GetAuth";

function PrivateRoute({ children }) {
    const location = useLocation();
    const { user, loading } = GetAuth();
    if (loading) {
        return <Loading isLoading={loading} />;
    }

    if (user) {
        return children;
    }
    return <Navigate to='/login' state={{ from: location }} />;
}

export default PrivateRoute;
