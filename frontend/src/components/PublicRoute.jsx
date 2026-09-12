import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const {
    isAuthenticated,
    user,
    authLoading,
  } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to="/todos" replace />;
  }

  return children;
};

export default PublicRoute;