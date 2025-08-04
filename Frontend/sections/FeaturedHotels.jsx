import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllHotels } from '../services/HotelService';
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const FeaturedHotels = ({ expanded }) => {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAllHotels();
        setHotels(data);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
      }
    };
    fetchHotels();
  }, []);

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 'No rating';
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getLowestPrice = (rooms) => {
    const availableRooms = rooms.filter((room) => room.available);
    if (availableRooms.length === 0) return 'N/A';
    const prices = availableRooms.map((room) => room.baseFare);
    return Math.min(...prices);
  };

  const amenityIcons = {
    wifi: '🛜',
    pool: '🏊',
    parking: '🅿️',
    spa: '💆',
    breakfast: '🥐',
    gym: '🏋️‍♂️',
    ac: '❄️',
    bar: '🍸',
    tv: '📺',
    restaurant: '🍽️',
    elevator: '🛗',
    laundry: '🧺',
  };

  const startIndex = (currentPage - 1) * hotelsPerPage;
  const endIndex = startIndex + hotelsPerPage;
  const displayedHotels = expanded
    ? hotels.slice(startIndex, endIndex)
    : hotels.slice(0, 3);

  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {displayedHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row"
          >
            <div className="md:w-1/3">
              <img
                src={hotel.image || 'https://via.placeholder.com/300'}
                alt={hotel.name}
                className="w-full h-56 md:h-full object-cover"
              />
            </div>

            <div className="p-4 flex flex-col justify-between md:w-2/3">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">{hotel.name}</h3>
                <p className="text-gray-500 font-semibold text-sm mt-1">{hotel.description}</p>

                {Array.isArray(hotel.amenities) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hotel.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200"
                      >
                        {amenityIcons[amenity.toLowerCase()] || '•'} {amenity}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-500 text-sm mt-2">{hotel.location}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-indigo-600 font-semibold text-lg">
                    ₹{getLowestPrice(hotel.rooms)} / night
                  </span>
                  <span className="text-yellow-500 font-medium text-lg">
                    ⭐ {getAverageRating(hotel.reviews)}
                  </span>
                </div>
              </div>
              <div
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-medium text-center cursor-pointer"
                onClick={() => navigate(`/hotels/${hotel.id}`)}
              >
                View Details
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {expanded && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <ul className="flex justify-center gap-1 text-gray-900">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`grid size-8 place-content-center rounded border ${
                  currentPage === 1
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li key={i}>
                <button
                  onClick={() => handlePageChange(i + 1)}
                  className={`block size-8 rounded border text-center text-sm font-medium ${
                    currentPage === i + 1
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`grid size-8 place-content-center rounded border ${
                  currentPage === totalPages
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default FeaturedHotels;
