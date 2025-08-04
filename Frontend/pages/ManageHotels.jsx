// src/pages/ManageHotels.jsx
import React, { useEffect, useState } from 'react';
import { getAllHotels, deleteHotelById } from '../services/AdminService';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { FaTrashAlt, FaEye } from 'react-icons/fa';

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllHotels()
      .then((data) => {
        setHotels(data);
        setFilteredHotels(data);
      })
      .catch((err) => {
        console.error('Failed to fetch hotels:', err);
      });
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const lower = term.toLowerCase();
    const filtered = hotels.filter(hotel =>
      hotel.name?.toLowerCase().includes(lower) ||
      hotel.location?.toLowerCase().includes(lower) ||
      hotel.owner?.user?.name?.toLowerCase().includes(lower)
    );
    setFilteredHotels(filtered);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 'N/A';
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleDelete = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await deleteHotelById(hotelId);
        const updated = hotels.filter(h => h.id !== hotelId);
        setHotels(updated);
        setFilteredHotels(updated);
        alert("Hotel deleted successfully.");
      } catch (error) {
        alert("Failed to delete hotel.");
        console.error(error);
      }
    }
  };

  return (
    <div className="pt-24">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <AdminNavbar />
      </div>

      <div className="p-4">
        {/* Search Bar */}
        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Search by hotel, location, or owner..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="input input-bordered border-gray-900 w-full max-w-md"
          />
        </div>

        {/* Table */}
        <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto">
          <table className="table w-full min-w-max">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Hotel Id</th>
                <th className="px-4 py-3">Hotel Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Phone No</th>
                <th className="px-4 py-3">Owner Name</th>
                <th className="px-4 py-3">No. of Rooms</th>
                <th className="px-4 py-3">No. of Reviews</th>
                <th className="px-4 py-3">Avg. Rating</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel, index) => (
                  <tr key={hotel.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{hotel.id}</td>
                    <td className="px-4 py-3">{hotel.name}</td>
                    <td className="px-4 py-3">{hotel.location}</td>
                    <td className="px-4 py-3">{hotel.phoneNo}</td>
                    <td className="px-4 py-3">{hotel.owner?.user?.name}</td>
                    <td className="px-4 py-3">{hotel.rooms?.length || 0}</td>
                    <td className="px-4 py-3">{hotel.reviews?.length || 0}</td>
                    <td className="px-4 py-3">
                      {calculateAverageRating(hotel.reviews)}
                    </td>
                    <td className="px-4 py-3 text-center flex gap-3 justify-center">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => navigate(`/admin/hotel/${hotel.id}`)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(hotel.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-gray-500">
                    No hotels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageHotels;
