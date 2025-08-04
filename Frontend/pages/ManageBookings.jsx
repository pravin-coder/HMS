import React, { useEffect, useState } from 'react';
import { getAllBookings, deleteBookingById } from '../services/AdminService';
import AdminNavbar from '../components/AdminNavbar';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [todayBookings, setTodayBookings] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getAllBookings()
      .then((data) => {
        setBookings(data);
        setFilteredBookings(data);

        const today = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
        const todays = data.filter(b => b.bookingDate === today);
        setTodayBookings(todays);
      })
      .catch((err) => {
        console.error('Failed to fetch bookings:', err);
      });
  }, []);

  const handleSort = (option) => {
    let sorted = [...filteredBookings];
    if (option === 'newest') {
      sorted.sort((a, b) => b.id - a.id);
    } else if (option === 'oldest') {
      sorted.sort((a, b) => a.id - b.id);
    } else if (option === 'high') {
      sorted.sort((a, b) => b.totalBill - a.totalBill);
    } else if (option === 'low') {
      sorted.sort((a, b) => a.totalBill - b.totalBill);
    }
    setSortOption(option);
    setFilteredBookings(sorted);
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const res = await deleteBookingById(bookingId);
        if (res.data === "Deleted") {
          const updated = bookings.filter(b => b.id !== bookingId);
          setBookings(updated);
          setFilteredBookings(updated);
          setTodayBookings(updated.filter(b => b.bookingDate === new Date().toISOString().split("T")[0]));
          alert("Booking deleted.");
        }
      } catch (err) {
        alert("Failed to delete booking.");
      }
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowPopup(true);
  };

  const handleUpdateBooking = (updatedBooking) => {
    const updatedList = bookings.map((b) =>
      b.id === updatedBooking.id ? updatedBooking : b
    );
    setBookings(updatedList);
    setFilteredBookings(updatedList);
    setTodayBookings(updatedList.filter(b => b.bookingDate === new Date().toISOString().split("T")[0]));
    setShowPopup(false);
  };

  return (
    <div className="pt-24">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <AdminNavbar />
      </div>

      <div className="p-4">
        {/* Sort dropdown */}
        <div className="mb-4 flex items-center justify-end">
          <select
            className="select select-bordered"
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="newest">Date: Newest</option>
            <option value="oldest">Date: Oldest</option>
            <option value="high">Price: High to Low</option>
            <option value="low">Price: Low to High</option>
          </select>
        </div>

        {/* All Bookings Table */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">All Bookings</h2>
        <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto mb-10">
          <table className="table w-full min-w-max">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Hotel</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Check-In</th>
                <th className="px-4 py-3">Check-Out</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">Hotel-{booking.hotelId}</td>
                    <td className="px-4 py-3">{booking.name}</td>
                    <td className="px-4 py-3">Room-{booking.roomId}</td>
                    <td className="px-4 py-3">{booking.arrivalDate}</td>
                    <td className="px-4 py-3">{booking.departureDate}</td>
                    <td className="px-4 py-3">₹{booking.totalBill}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(booking.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Today's Bookings Table */}
        <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-4">Today's Bookings</h2>
        <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto">
          <table className="table w-full min-w-max">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Hotel</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Check-In</th>
                <th className="px-4 py-3">Check-Out</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Booked On</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {todayBookings.length > 0 ? (
                todayBookings.map((booking, index) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">Hotel-{booking.hotelId}</td>
                    <td className="px-4 py-3">{booking.name}</td>
                    <td className="px-4 py-3">Room-{booking.roomId}</td>
                    <td className="px-4 py-3">{booking.arrivalDate}</td>
                    <td className="px-4 py-3">{booking.departureDate}</td>
                    <td className="px-4 py-3">₹{booking.totalBill}</td>
                    <td className="px-4 py-3">{booking.bookingDate}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(booking.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No bookings for today.
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

export default ManageBookings;
