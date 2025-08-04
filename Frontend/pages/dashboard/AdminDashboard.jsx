// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import {
  getAllUsers,
  getAllHotelOwners,
  getAllBookings,
  getAllReviews
} from '../../services/AdminService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [dailyStats, setDailyStats] = useState([]);
  const [todayBookings, setTodayBookings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userData = await getAllUsers();
        const ownerData = await getAllHotelOwners();
        const bookingData = await getAllBookings();
        const reviewData = await getAllReviews();

        setUsers(userData);
        setOwners(ownerData);
        setBookings(bookingData);
        setReviews(reviewData);

        // Revenue calculation (10% of totalBill)
        const totalRevenue = bookingData.reduce((sum, b) => sum + b.totalBill * 0.1, 0);
        setRevenue(totalRevenue);

        // Bookings per day chart data
        const countMap = {};
        bookingData.forEach((b) => {
          const date = b.bookingDate;
          countMap[date] = (countMap[date] || 0) + 1;
        });
        const chartData = Object.entries(countMap).map(([date, count]) => ({ date, count }));
        setDailyStats(chartData);

        // Today's Bookings
        const today = format(new Date(), 'yyyy-MM-dd');
        const todays = bookingData.filter((b) => b.bookingDate === today);
        setTodayBookings(todays);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="pt-24 w-full min-h-screen bg-white text-gray-800">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <AdminNavbar />
      </div>

      <div className="p-6 w-full">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-center">
          <div className="bg-gray-100 p-6 rounded-lg shadow-2xl">
            <div className="text-5xl font-bold text-indigo-700">{users.length}</div>
            <div className="text-lg mt-2 text-gray-600">Total Users</div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-2xl">
            <div className="text-5xl font-bold text-indigo-700">{owners.length}</div>
            <div className="text-lg mt-2 text-gray-600">Hotel Owners</div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-2xl">
            <div className="text-5xl font-bold text-green-600">₹{Math.round(revenue).toLocaleString()}</div>
            <div className="text-lg mt-2 text-gray-600">Revenue (10%)</div>
          </div>
        </div>

        {/* Bookings Per Day Chart */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-xl mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Bookings Per Day</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" stroke="#333" />
                <YAxis stroke="#333" />
                <Tooltip contentStyle={{ backgroundColor: '#f9f9f9', color: '#000' }} />
                <Line
                  type="monotone"
                  dataKey="count"
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

        {/* Today's Bookings Table */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-xl mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
            Today's Booking Records
          </h2>
          {todayBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-left shadow-sm rounded-lg">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-2 px-4">ID</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Hotel ID</th>
                    <th className="py-2 px-4">Room Type</th>
                    <th className="py-2 px-4">Total Bill</th>
                  </tr>
                </thead>
                <tbody>
                  {todayBookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{booking.id}</td>
                      <td className="py-2 px-4">{booking.name}</td>
                      <td className="py-2 px-4">{booking.email}</td>
                      <td className="py-2 px-4">{booking.hotelId}</td>
                      <td className="py-2 px-4">{booking.roomType}</td>
                      <td className="py-2 px-4">₹{booking.totalBill.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600">No bookings made today.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
