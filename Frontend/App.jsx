import React from "react";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Unauthorized from "./pages/Unauthorized";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import PrivateRoute from './routes/PrivateRoute';
import HotelRoomsPage from "./pages/HotelRoomsPage";
import SearchHotelResults from "./pages/SearchHotelResults";
import BookingSummary from './pages/BookingSummary';
import MyBookings from "./pages/MyBookings";
import MyReviews from  "./pages/MyReviews";
import HotelStats from "./pages/HotelStats"
import ManageRoomBookings from "./pages/ManageRoomBookings"
import ManageHotelReviews from "./pages/ManageHotelReviews"
import AddNewHotel from "./pages/AddNewHotel"
import ManageUsers from "./pages/ManageUsers"
import ManageHotels from "./pages/ManageHotels"
import ManageBookings from "./pages/ManageBookings"
import HotelDetailsAdmin from './pages/HotelDetailsAdmin';

function App() {
  return (

      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/SearchHotelResults" element={<SearchHotelResults />} />
          <Route path="/hotels/:hotelId" element={<HotelRoomsPage />} />
          <Route path="/booking-summary" element={<BookingSummary />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/owner/my-hotels" element={<HotelStats/>}/>
          <Route path="/owner/bookings" element={<ManageRoomBookings/>}/>
          <Route path="/owner/my-Reviews" element={<ManageHotelReviews/>}/>
          <Route path="/owner/add-hotel" element={<AddNewHotel/>}/>
          <Route path="/admin/users" element={<ManageUsers/>}/>
          <Route path="/admin/hotels" element={<ManageHotels/>}/>
          <Route path="/admin/bookings" element={<ManageBookings/>}/>
          <Route path="/admin/hotel/:id" element={<HotelDetailsAdmin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          

          {/* Role-specific dashboards */}  
          <Route element={<PrivateRoute allowedRoles={["ROLE_USER"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]} />}>
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["ROLE_HOTEL_OWNER"]} />}>
             <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          </Route>

        </Routes>
      </AuthProvider>
  );
}

export default App;
