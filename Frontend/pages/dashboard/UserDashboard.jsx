// src/pages/user/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturedHotels from '../../sections/FeaturedHotels';
import PopularLocations from '../../sections/PopularLocations';
import UserNavbar from '../../components/UserNavbar';

const UserDashboard = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('Deluxe');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [expandHotels, setExpandHotels] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    const queryParams = {
      location,
      checkIn,
      checkOut,
      roomType,
      rooms,
      adults,
      children,
    };
    const queryString = new URLSearchParams(queryParams).toString();
    navigate(`/SearchHotelResults?${queryString}`);
  };

  const handleExpand = () => setExpandHotels(true);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <UserNavbar />
      </div>

      <div className="pt-24" style={{ backgroundColor: 'from-indigo-100 via-white to-blue-100' }}>
        <section
  className="pt-32 pb-24 px-8 text-center w-full"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1500&auto=format&fit=crop&q=60')",
  }}
>
  <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Left: Booking Form */}
      <div className="pl-4 md:pl-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
          Book Hotels and Homestays
        </h1>

        <div className="rounded-xl bg-gray-50 p-8 shadow-md">
          <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="text-left col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                placeholder="Enter city or location"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Check-In</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && new Date(e.target.value) > new Date(checkOut)) {
                    setCheckOut("");
                  }
                }}
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Check-Out</label>
              <input
                type="date"
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split("T")[0]}
                disabled={!checkIn}
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Room Type</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Superior">Superior</option>
                <option value="Executive">Executive</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Rooms</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
              >
                <option value="1">1 Room</option>
                <option value="2">2 Rooms</option>
                <option value="3">3 Rooms</option>
                <option value="4">4 Rooms</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Adults</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Adults</option>
                <option value="4">4 Adults</option>
              </select>
            </div>

            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">Children</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
              >
                <option value="0">No Children</option>
                <option value="1">1 Child</option>
                <option value="2">2 Children</option>
                <option value="3">3 Children</option>
              </select>
            </div>
          </form>

          <div className="mt-8 flex justify-center">
            <div
              onClick={handleSearch}
              className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-md text-base font-semibold text-center shadow-md hover:bg-blue-700 transition"
            >
              SEARCH
            </div>
          </div>
        </div>
      </div>

      {/* Right: Static Image */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop&q=80"
          alt="Hotel Preview"
          className="rounded-xl shadow-lg w-full object-cover h-full max-h-[600px]"
        />
      </div>
    </div>
  </div>
</section>




        {/* Featured Hotels */}
        <section id="featured" className="py-10 px-4 sm:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Featured Hotels</h2>
              {!expandHotels && (
                <button
                  onClick={handleExpand}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  View All Hotels
                </button>
              )}
            </div>
            <FeaturedHotels expanded={expandHotels} />
          </div>
        </section>

        {/* Popular Locations */}

        <section
          id="popular"
          className=" rounded-xl pt-32 pb-24  px-8 text-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 w-full"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6">Popular Locations</h2>
            <PopularLocations />
          </div>
        </section>
      </div>
    </>
  );
};

export default UserDashboard;
