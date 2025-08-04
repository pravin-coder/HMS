import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register(formData);
      if (localStorage.getItem("role") === "ROLE_ADMIN") {
        navigate("/admin/users");
      } else {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      alert("Registration failed: " + err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-100 px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl px-10 py-12 relative">
        {/* Brand Logo */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-10 py-1 shadow-md rounded">
          <div className="flex items-center space-x-2">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Logo"
              className="h-6"
            />
            <span className="text-xl font-semibold">CozyHavenStay</span>
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-10 mt-6">
          Create your account
        </h2>

        <form className="space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">Username</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
        className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-gray-700">Full Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-gray-700">Do you want to create</label>
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm bg-white focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="USER">USER</option>
        <option value="HOTEL_OWNER">HOTEL OWNER</option>
      </select>
    </div>
  </div>

  <div className="text-center">
    <div
      className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-indigo-700 transition cursor-pointer inline-block"
      onClick={handleRegister}
    >
      {localStorage.getItem("role") === "ROLE_ADMIN"
        ? "Add New User"
        : "Register"}
    </div>
  </div>
</form>


        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
