import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ========================================
  // FETCH PROFILE
  // ========================================

  const fetchProfile = async () => {
    try {
      const data = await apiRequest(
        "/users/profile"
      );

      setUser(data.user);

      return data.user;
    } catch (error) {
      console.error(
        "Failed to fetch profile:",
        error
      );

      setUser(null);

      throw error;
    }
  };

  // ========================================
  // LOGIN
  // ========================================

  const login = async (token) => {
    localStorage.setItem(
      "token",
      token
    );

    setToken(token);

    try {
      await fetchProfile();
    } catch (error) {
      console.error(
        "Failed to load user after login:",
        error
      );
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = async () => {
    try {
      await apiRequest(
        "/auth/logout",
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      localStorage.removeItem("token");

      setToken(null);

      setUser(null);

      navigate("/login");
    }
  };

  // ========================================
  // LOAD PROFILE ON PAGE REFRESH
  // ========================================

  useEffect(() => {
    const loadUser = async () => {
      const existingToken =
        localStorage.getItem("token");

      if (!existingToken) {
        setUser(null);
        return;
      }

      try {
        await fetchProfile();
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  // ========================================
  // AUTH STATE
  // ========================================

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated,
        user,
        setUser,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;