import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { checkAuth } from "../services/api";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await checkAuth();
        if (res.success) setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        navigate("/login");
      }
    };
    verifyAuth();
  }, [navigate]);

  if (isAuthenticated === null) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;