// src/services/OwnerDashboardService.js
import axios from 'axios';
const token = localStorage.getItem("token");
const API_BASE = 'http://localhost:8080/api';

export const getUserById = async (userId) => {
  const res = await axios.get(`${API_BASE}/users/getuser/${userId}`);
  return res.data;
};

export const getOwnerIdByUserId = async (userId) => {
  const res = await axios.get(`${API_BASE}/users/getowneridbyuserid/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return res.data; // just the ownerId
};

export const getHotelsByOwnerId = async (ownerId) => {
  const res = await axios.get(`${API_BASE}/hotels/gethotelbyownerid/${ownerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return res.data; // array of hotels
};

export const getRoomsByHotelId = async (hotelId) => {
  const response = await axios.get(`${BASE_URL}/${hotelId}/rooms/all`);
  return response.data;
};

export const getBookingsByHotelId = async (hotelId) => {
  const res = await axios.get(`${API_BASE}/bookings/getbookingbyhotelid/${hotelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return res.data; // array of bookings
};

// Utility to get all bookings from all hotels for one owner
export const getAllBookingsByOwner = async (ownerId) => {
  const hotels = await getHotelsByOwnerId(ownerId);
  let allBookings = [];

  for (const hotel of hotels) {
    const bookings = await getBookingsByHotelId(hotel.id);
    allBookings = allBookings.concat(bookings);
  }

  return allBookings;
};

// Total revenue calculator
export const calculateTotalRevenue = async (ownerId) => {
  const bookings = await getAllBookingsByOwner(ownerId);
  return bookings.reduce((total, b) => total + (b.totalBill || 0), 0);
};

export const getMonthlyRevenueData = async (ownerId) => {
  const bookings = await getAllBookingsByOwner(ownerId);

  const monthlyRevenue = Array(12).fill(0);
  bookings.forEach((b) => {
    const month = new Date(b.bookingDate).getMonth();
    monthlyRevenue[month] += b.totalBill;
  });

  return monthlyRevenue.map((rev, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    revenue: rev,
  }));
};
