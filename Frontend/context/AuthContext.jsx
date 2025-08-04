import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  const login = (username, role, token) => {
    setUsername(username);
    setRole(role);
    setToken(token);

    // Redirect based on role
    if (role === "ROLE_ADMIN") navigate("/admin/dashboard");
    else if (role === "ROLE_USER") navigate("/user/dashboard");
    else if (role === "ROLE_HOTEL_OWNER") navigate("/owner/dashboard");
  };

  const logout = () => {
    setUsername(null);
    setRole(null);
    setToken(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ username, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
