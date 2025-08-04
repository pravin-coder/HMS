import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await AuthService.login({ username, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("username", username);
      localStorage.setItem("name",res.name);
      localStorage.setItem("email", res.email);
      console.log("Login successful:", res);
      // Navigate based on role
      if (res.role === "ROLE_ADMIN") navigate("/admin/dashboard");
      else if (res.role === "ROLE_HOTEL_OWNER") navigate("/owner/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      alert("Login failed: " + err);
    }
  };
  return (
    <div className="min-h-screen flex items-center bg-white shadow-lg justify-center bg-gray-100">
      <div className="bg-white shadow-md  rounded-lg w-full max-w-md px-8 py-10 relative">
        {/* Logo and Brand Name */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-10 py-1">
          <div className="flex items-center space-x-2">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Logo"
              className="h-6"
            />
            <span className="text-xl font-semibold">CozyHavenStay</span>
          </div>
        </div>

        {/* Login Form */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6 mt-6">
          Sign in to your account
        </h2>
        <form className="space-y-6 text-left" >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              UserName
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div
  onClick={handleLogin}
  className="w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 transition"
>
  Sign In
</div>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600  hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
