// services/BookingService.jsx
import axios from "axios";
const token = localStorage.getItem("token"); 
const API_BASE_URL = "http://localhost:8080/api/bookings";

export const createBooking = async (bookingPayload) => {
  try {
    console.log("Creating booking with payload:", bookingPayload);
    const response = await axios.post(`${API_BASE_URL}/createbooking`, bookingPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};
export const getBookingsByHotelId = async (hotelId) => {
  const res = await axios.get(`${API_BASE_URL}/getbookingbyhotelid/${hotelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  console.log(res.data);
  return res.data;
};

export const getBookingsByUserId  = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getbookingbyuserid/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

