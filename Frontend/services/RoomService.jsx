import axios from "axios";
 const token = localStorage.getItem("token");
const API_BASE_URL = "http://localhost:8080/api/rooms";

export const checkRoomAvailability = async (roomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${roomId}/availability`);
    return response.data; // true or false
  } catch (error) {
    console.error(`Error checking availability for room ${roomId}:`, error);
    return false; // assume unavailable if error
  }
};
export const setRoomAvailable = async (roomId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/set-available/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
    return response.data; // updated room object or success message
  } catch (error) {
    console.error(`Error setting room ${roomId} as available:`, error);
    throw error;
  }
};
