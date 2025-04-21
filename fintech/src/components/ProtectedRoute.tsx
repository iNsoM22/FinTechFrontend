import { useEffect, useState, ReactNode } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { validateTokenUser } from "@/service/BackendService";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        toast.error("Unauthorized Access.");
        toast.error("Please Sign In to Continue");
        setIsAuthenticated(false);
        // Delay a little before hiding the loader
        return setTimeout(() => setLoading(false), 1000);
      }

      try {
        const response = await validateTokenUser();
        if (response?.id) {
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid Token");
        }
      } catch (error) {
        toast.error("Session Expired. Please log in Again.");
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        // Delay Hiding the loader for smoother UX
        setTimeout(() => setLoading(false), 1000);
      }
    };

    checkAuth();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <span className="animate-spin mr-2 w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></span>
        Validating token...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
