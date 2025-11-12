import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants";
import { useAuth } from "../hooks/useAuth";

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? (
    <Navigate to={ROUTES.SHORTEN} replace />
  ) : (
    <>{children}</>
  );
};

export default GuestRoute;
