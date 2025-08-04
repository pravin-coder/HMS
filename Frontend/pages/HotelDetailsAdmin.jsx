// src/pages/HotelDetailsAdmin.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { getHotelById, deleteRoomById } from '../services/AdminService';
import { FaPlus, FaStar, FaTrashAlt } from 'react-icons/fa';

const HotelDetailsAdmin = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

  const fetchHotelDetails = () => {
    getHotelById(id)
      .then(data => setHotel(data))
      .catch(err => console.error("Error fetching hotel:", err));
  };

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await deleteRoomById(roomId);
      fetchHotelDetails();
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
  };

  if (!hotel) {
    return <div className="pt-24 text-center text-lg">Loading hotel details...</div>;
  }

  return (
    <div className="pt-24 min-h-screen bg-white text-gray-800">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <AdminNavbar />
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">{hotel.name}</h1>
          <p className="text-lg text-gray-600 mb-1">📍 <strong>Location:</strong> {hotel.location}</p>
          <p className="text-lg text-gray-600 mb-1">📞 <strong>Phone:</strong> {hotel.phoneNo}</p>
          <p className="text-lg text-gray-600 mb-1">✨ <strong>Special Feature:</strong> {hotel.specialFeature}</p>
          <p className="text-md text-gray-600 mt-2">📝 {hotel.description}</p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Rooms ({hotel.rooms.length})</h2>
          <button className="btn btn-success btn-sm flex items-center gap-2">
            <FaPlus /> Add Room
          </button>
        </div>

        <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto mb-10">
          <table className="table w-full min-w-max">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Room Type</th>
                <th className="px-4 py-3">Max Occupancy</th>
                <th className="px-4 py-3">Base Fare</th>
                <th className="px-4 py-3">AC</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Features</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {hotel.rooms.map((room, index) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{room.roomType}</td>
                  <td className="px-4 py-3">{room.maxOccupancy}</td>
                  <td className="px-4 py-3">₹{room.baseFare}</td>
                  <td className="px-4 py-3">{room.ac ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{room.available ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc list-inside">
                      {room.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews ({hotel.reviews.length})</h2>
          <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto">
            <table className="table w-full min-w-max">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Comment</th>
                  <th className="px-4 py-3">Rating</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {hotel.reviews.map((review, index) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{review.user.name}</td>
                    <td className="px-4 py-3">{review.user.email}</td>
                    <td className="px-4 py-3">{review.comment}</td>
                    <td className="px-4 py-3">{review.rating} <FaStar className="inline text-yellow-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsAdmin;
