// File: src/services/HotelService.jsx
import axios from 'axios';

const token = localStorage.getItem("token");
const BASE_URL = 'http://localhost:8080/api/hotels';

export const getAllHotels = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getallhotel`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error; // allow the component to handle it
  }
};

export const getSearchedHotels = async (location, roomType) => {
  const res = await axios.get(`${BASE_URL}/search?location=${location}&roomType=${roomType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
 // console.error(res.data);
  return res.data;
};

export const getHotelsByLocation = async (location) => {
  const res = await axios.get(`${BASE_URL}/searchbylocation?location=${location}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return res.data;
};


export const getRoomsByHotelId = async (hotelId) => {
  const response = await axios.get(`${BASE_URL}/${hotelId}/rooms/all`);
  return response.data;
};

export const getavailableRoomsByHotelId = async (hotelId) => {
  const response = await axios.get(`${BASE_URL}/${hotelId}/rooms/available`);
  return response.data;
};


export const getRoomById = async (roomId) => {
  const response = await axios.get(`http://localhost:8080/api/rooms/getroombyid/${roomId}`);
  return response.data;
};

export const getHotelById = async (id) => {
  const res = await axios.get(`${BASE_URL}/gethotelbyid/${id}`);
  return res.data;
};

export const addRoomToHotel = async (hotelId, roomData) => {
  const res = await axios.post(`${BASE_URL}/${hotelId}/rooms`, roomData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return res.data;
};

export const deleteRoomById = async (roomId) => {
  await axios.delete(`/api/rooms/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
};

export const createHotel = async (hotelData) => {
  const res = await axios.post(`http://localhost:8080/api/hotels/createhotel`, hotelData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach it to headers
        },
      });
  return res.data;
};