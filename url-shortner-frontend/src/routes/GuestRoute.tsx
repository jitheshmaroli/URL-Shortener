import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { checkAuth } from "../services/api";
import { ROUTES } from "../constants";

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await checkAuth();
        setIsAuthenticated(res.success);
        if (res.success) {
          navigate(ROUTES.SHORTEN);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    verifyAuth();
  }, [navigate]);

  if (isAuthenticated === null) return null;
  return isAuthenticated ? (
    <Navigate to={ROUTES.SHORTEN} replace />
  ) : (
    <>{children}</>
  );
};

export default GuestRoute;
