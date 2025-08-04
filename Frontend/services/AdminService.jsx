// src/services/AdminService.jsx
import axios from 'axios';
const token = localStorage.getItem("token");
const BASE_URL = 'http://localhost:8080/api';

export const getAllUsers = async () => {
  const response = await axios.get(`${BASE_URL}/users/allUsersWithRoleUser`,{
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return response.data;
};

export const getAllHotelOwners = async () => {
  const response = await axios.get(`${BASE_URL}/users/allUsersWithRoleHotelOwner`,{
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return response.data;
};

export const getAllBookings = async () => {
  const response = await axios.get(`${BASE_URL}/bookings/allbookings`,{
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axios.get(`${BASE_URL}/reviews/getallreview`,{
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return response.data;
};

export const deleteBookingById = async (bookingId) => {
  const response=await axios.delete(`${BASE_URL}/bookings/deletebookingbyid/${bookingId}`);
  return response.data;
};

export const getAllHotels = async () => {
  const res = await axios.get(`${BASE_URL}/hotels/getallhotel`);
  return res.data;
};

export const deleteHotelById = async (hotelId) => {
  const res = await axios.delete(`${BASE_URL}/hotels/deletehotel/${hotelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return res.data;
};

export const getHotelById = async (hotelId) => {
  const res = await axios.get(`${BASE_URL}/hotels/gethotelbyid/${hotelId}`);
  return res.data;
};

export const deleteRoomById = async (roomId) => {
  const res = await axios.delete(`${BASE_URL}/rooms/deleteroombyid/${roomId}`,{
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  if (!res.ok) throw new Error('Failed to delete room');
};
