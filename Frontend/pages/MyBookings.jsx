import React, { useEffect, useState } from 'react';
import { getBookingsByUserId } from '../services/BookingService';
import { getHotelById } from '../services/HotelService'; // You’ll create this API wrapper
import UserNavbar from "../components/UserNavbar";
import { FaTrashAlt, FaCommentDots } from "react-icons/fa";
import { DivideIcon } from '@heroicons/react/20/solid';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [showReviewPopup, setShowReviewPopup] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);
const [comment, setComment] = useState('');
const [rating, setRating] = useState(5);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      getBookingsByUserId(userId)
        .then(async (res) => {
          const data = Array.isArray(res) ? res : res.data || [];
          const bookingsWithHotels = await Promise.all(
            data.map(async (booking) => {
              try {
                const hotelRes = await getHotelById(booking.hotelId);
                return {
                  ...booking,
                  hotelName: hotelRes.name,
                  location: hotelRes.location
                };
              } catch {
                return { ...booking, hotelName: 'Unknown', location: 'N/A' };
              }
            })
          );
          setBookings(bookingsWithHotels);
          setFilteredBookings(bookingsWithHotels);
        })
        .catch(() => {
          setBookings([]);
          setFilteredBookings([]);
        });
    }
  }, [userId]);

  const handleCancelBooking = (id) => {
    alert(`Booking ${id} cancelled (simulated)`);
  };

const handleAddReview = (booking) => {
  setSelectedBooking(booking);
  setComment('');
  setRating(5);
  setShowReviewPopup(true);
};

const submitReview = async () => {
  const payload = {
    user: { id: parseInt(userId) },
    hotel: { id: selectedBooking.hotelId },
    comment,
    rating: parseInt(rating)
  };

  try {
    const res = await fetch('http://localhost:8080/api/reviews/createreview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Review added successfully!");
      setShowReviewPopup(false);
    } else {
      alert("Failed to add review.");
    }
  } catch (err) {
    console.error("Error adding review:", err);
    alert("An error occurred.");
  }
};

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredBookings].sort((a, b) => {
      const valA = a[key]?.toString().toLowerCase() || '';
      const valB = b[key]?.toString().toLowerCase() || '';
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredBookings(sorted);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = bookings.filter((booking) =>
      [booking.name, booking.email, booking.hotelName, booking.location]
        .some((field) => field?.toLowerCase().includes(value))
    );
    setFilteredBookings(filtered);
  };

  return (
    <div className="pt-24">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <UserNavbar />
      </div>

      <div className="p-4 shadow-3xl">
        <input
          type="text"
          placeholder="Search by Name, Email, Hotel, or Location"
          value={searchTerm}
          onChange={handleSearch}
          className="input input-bordered w-full max-w-md mb-4 shadow-3xl border"
        />

        <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto">
          <table className="table w-full min-w-max">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('id')}>Booking ID</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                <th className="px-4 py-3">Phone No</th>
                <th className="px-4 py-3">Aadhar</th>
                <th className="px-4 py-3">Room Type</th>
                <th className="px-4 py-3">Hotel ID</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('hotelName')}>Hotel Name</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('location')}>Location</th>
                <th className="px-4 py-3">Adults</th>
                <th className="px-4 py-3">Children</th>
                <th className="px-4 py-3">Arrival</th>
                <th className="px-4 py-3">Departure</th>
                <th className="px-4 py-3">Booking Date</th>
                <th className="px-4 py-3">Total (₹)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
                <th className="px-4 py-3 text-center">Review</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{booking.id}</td>
                    <td className="px-4 py-3">{booking.name}</td>
                    <td className="px-4 py-3">{booking.email}</td>
                    <td className="px-4 py-3">{booking.phoneNo}</td>
                    <td className="px-4 py-3">{booking.aadharImg || 'N/A'}</td>
                    <td className="px-4 py-3">{booking.roomType}</td>
                    <td className="px-4 py-3">{booking.hotelId}</td>
                    <td className="px-4 py-3">{booking.hotelName}</td>
                    <td className="px-4 py-3">{booking.location}</td>
                    <td className="px-4 py-3">{booking.noOfAdults}</td>
                    <td className="px-4 py-3">{booking.noOfChildren}</td>
                    <td className="px-4 py-3">{booking.arrivalDate}</td>
                    <td className="px-4 py-3">{booking.departureDate}</td>
                    <td className="px-4 py-3">{booking.bookingDate}</td>
                    <td className="px-4 py-3">₹{booking.totalBill}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Confirmed
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="bg-red text-red px-3 py-1 rounded hover:bg-red-700 transition"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        <FaTrashAlt className="inline mr-1" />
                        Cancel
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div
                        className="bg-blue-100 text-blue-600 px-3 py-1 text-xs font-semibold"
                        onClick={() => handleAddReview(booking)}
                      >
                        <FaCommentDots className="inline mr-1" />
                        Add Review
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="18" className="text-center py-6 text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div> 
        {showReviewPopup && selectedBooking && (
  <div className="fixed inset-0 z-50  bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
        onClick={() => setShowReviewPopup(false)}
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Add Review for {selectedBooking.hotelName}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Comment</label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} ⭐</option>
            ))}
          </select>
        </div>

        <div
          onClick={submitReview}
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Add Review
        </div>
      </div>
    </div>
  </div>
)} 
      </div>
    </div>
  );
};

export default MyBookings;
