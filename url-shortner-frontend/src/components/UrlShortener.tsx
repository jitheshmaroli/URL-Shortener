import React from "react";
import { logout } from "../services/api";
import { useNavigate } from "react-router-dom";

const UrlShortener: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      UrlShortener
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UrlShortener;