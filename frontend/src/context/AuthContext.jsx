import { createContext, useContext, useEffect, useState } from "react";
import authService from "../api/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
  }, []);

  const login = async (email, password) => {
    const userData = await authService.login({ email, password });
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (formData) => {
    const userData = await authService.register(formData);
    setUser(userData);
  };

  const value = {
    user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
