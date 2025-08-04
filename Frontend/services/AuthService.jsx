import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const AuthService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data; // { token, role, etc. }
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  },
};

export default AuthService;
