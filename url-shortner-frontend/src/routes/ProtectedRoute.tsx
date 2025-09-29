import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { checkAuth } from "../services/api";
import { ROUTES } from "../constants";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await checkAuth();
        setIsAuthenticated(res.success);
      } catch {
        setIsAuthenticated(false);
        navigate(ROUTES.LOGIN);
      }
    };
    verifyAuth();
  }, [navigate]);

  if (isAuthenticated === null) return null;
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.LOGIN} replace />
  );
};

export default ProtectedRoute;
