import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import UrlShortener from "../components/UrlShortener";
import { ROUTES } from "../constants";

const RoutesConfig: React.FC = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path={ROUTES.SHORTEN}
        element={
          <ProtectedRoute>
            <UrlShortener />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={ROUTES.LOGIN} replace />}
      />
    </Routes>
  );
};

export default RoutesConfig;
