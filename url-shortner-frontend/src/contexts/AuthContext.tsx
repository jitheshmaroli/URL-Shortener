import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth, logout } from "../services/authApi";
import { ROUTES } from "../constants";

interface AuthContextType {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await checkAuth();
      setIsAuthenticated(res.success);
      if (res.success) {
        if (
          window.location.pathname === ROUTES.LOGIN ||
          window.location.pathname === ROUTES.REGISTER
        ) {
          navigate(ROUTES.SHORTEN, { replace: true });
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsAuthenticated(false);
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, checkAuthStatus, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
