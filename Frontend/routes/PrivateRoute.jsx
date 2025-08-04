// src/routes/PrivateRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in but not authorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render child routes
  return <Outlet />;
};

export default PrivateRoute;
