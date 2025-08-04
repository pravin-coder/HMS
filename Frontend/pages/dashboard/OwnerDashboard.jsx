import React, { useEffect, useState } from 'react';
import HotelOwnerNavbar from '../../components/HotelOwnerNavbar';
import {
  getOwnerIdByUserId,
  getHotelsByOwnerId,
  getAllBookingsByOwner,
  calculateTotalRevenue,
  getMonthlyRevenueData,
} from '../../services/OwnerDashboardService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ownerId = await getOwnerIdByUserId(userId);
        localStorage.setItem('ownerId', ownerId);
        const hotelList = await getHotelsByOwnerId(ownerId);
        const bookingList = await getAllBookingsByOwner(ownerId);
        const totalRevenue = await calculateTotalRevenue(ownerId);
        const monthlyRevenueData = await getMonthlyRevenueData(ownerId);

        setHotels(hotelList || []);
        setBookings(Array.isArray(bookingList) ? bookingList : []);
        setRevenue(totalRevenue || 0);
        setMonthlyRevenue(Array.isArray(monthlyRevenueData) ? monthlyRevenueData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setHotels([]);
        setBookings([]);
        setRevenue(0);
        setMonthlyRevenue([]);
      }
    };

    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  return (
    <div className="pt-24 min-h-screen bg-white text-gray-800">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <HotelOwnerNavbar />
      </div>

      {/* Page Content */}
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Hotel Owner Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-center">
          <div className="bg-gray-100 p-6 rounded-lg shadow-2xl">
            <div className="text-5xl font-bold text-indigo-700">{hotels.length}</div>
            <div className="text-lg mt-2 text-gray-600">Hotels Listed</div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-2xl">
            <div className="text-5xl font-bold text-indigo-700">{bookings.length}</div>
            <div className="text-lg mt-2 text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-2xl">
            <div className="text-5xl font-bold text-green-600">₹{revenue.toLocaleString()}</div>
            <div className="text-lg mt-2 text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-xl mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Monthly Revenue</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="month" stroke="#333" />
                <YAxis stroke="#333" />
                <Tooltip contentStyle={{ backgroundColor: '#f9f9f9', color: '#000' }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: '#4f46e5', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-100 text-gray-700 p-6 rounded-lg shadow-xl text-center mb-12">
          <p className="text-lg leading-relaxed">
            This is your personalized dashboard. Track your performance, manage your hotels and bookings,
            and analyze revenue trends. For detailed insights, navigate to respective pages from the menu.
          </p>
        </div>

        {/* Full-Width Hotel Cards */}
        <div className="space-y-6">
          {hotels.map((hotel) => {
            const hotelBookings = bookings.filter((b) => b.hotelId === hotel.id);
            const totalRooms = hotel.rooms?.length || 0;
            const totalBookings = hotelBookings.length;
            const avgRating =
              hotel.reviews && hotel.reviews.length > 0
                ? (
                    hotel.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                    hotel.reviews.length
                  ).toFixed(1)
                : 'N/A';

            return (
              <div
                key={hotel.id}
                className="flex flex-col md:flex-row bg-gray-100 rounded-lg shadow-lg overflow-hidden w-full"
              >
                {/* Left Image */}
                <div className="md:w-1/2 w-full h-64 md:h-auto">
                  <img
                    src={hotel.image || 'https://via.placeholder.com/600x400?text=Hotel+Image'}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Info */}
                <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{hotel.name}</h2>
                    <p className="text-gray-600 mb-1"><strong>Location:</strong> {hotel.location}</p>
                    <p className="text-gray-600 mb-1"><strong>No. of Rooms:</strong> {totalRooms}</p>
                    <p className="text-gray-600 mb-1"><strong>No. of Bookings:</strong> {totalBookings}</p>
                    <p className="text-gray-600 mb-1"><strong>Average Rating:</strong> {avgRating} ⭐</p>
                  </div>
                  <div className="mt-4">
                    <button
                      className="text-indigo-600 font-semibold hover:underline"
                      onClick={() => navigate(`/owner/my-hotels`)}
                    >
                      View More &gt;&gt;&gt;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
