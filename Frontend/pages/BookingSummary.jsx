import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getRoomById } from "../services/HotelService";
import UserNavbar from "../components/UserNavbar";
import { createBooking } from "../services/BookingService";
import { Button } from "bootstrap";
import { useNavigate } from 'react-router-dom';

const BookingSummary = () => {
  const { state } = useLocation();
  const [roomDetails, setRoomDetails] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
   const navigate = useNavigate();

  const {
    roomId,
    aadharno,
    phoneNo,
    checkIn,
    checkOut,
    adults,
    children,
    addons,
    totalFare,
  } = state;

  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const now = new Date();
    setCurrentDateTime(now.toLocaleString("en-IN"));
  }, []);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const room = await getRoomById(roomId);
        setRoomDetails(room);
        setHotelDetails(room.hotel);
        setOwnerDetails(room.hotel.owner.user);
      } catch (error) {
        console.error("Failed to fetch room details", error);
      }
    };

    if (roomId) fetchRoomDetails();
  }, [roomId]);

  const handleBooking = async () => {
    try {
      const payload = {
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
        phoneNo: phoneNo,
        aadharNo: aadharno, 
        noOfRooms: 1,
        noOfAdults: adults,
        noOfChildren:children,
        arrivalDate: checkIn,
        departureDate: checkOut,
        totalBill: totalFare, 
        bookingDate: new Date().toISOString().split("T")[0], // current date in YYYY-MM-DD
        hotelId: roomDetails.hotel.id,
        roomId: roomDetails.id,
        userId: localStorage.getItem("userId"),
        roomType: roomDetails.roomType,
      };
      console.log("Booking payload:", payload);

      const res = await createBooking(payload);
      alert("Booking successful!");
      navigate("/my-bookings"); // Redirect to My Bookings page after successful booking
      // Optionally navigate to booking confirmation page
    } catch (error) {
      alert("Booking failed. Please try again.");
    }
  };

  if (!roomDetails || !hotelDetails || !ownerDetails) {
    return <div className="text-center mt-10 text-gray-600">Loading booking summary...</div>;
  }

  return (
    <div className="pt-24 ">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <UserNavbar />
      </div>
      <div className="pt-28 px-4  rounded-3xl p-10 shadow-2xl border border-gray-100md:px-16  min-h-screen">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-indigo-800 drop-shadow-lg">CozyHaven Stay</h1>
          <p className="text-xl text-gray-600 mt-3 font-medium">{hotelDetails.name} – {hotelDetails.location}</p>
          <p className="text-md text-gray-500 mt-1">Owner Mobile: {hotelDetails.phoneNo}</p>
        </div>

        {/* Timestamp */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6 border-b pb-3 font-semibold">
          <h2 className="text-indigo-900">Booking Summary</h2>
          <span>{currentDateTime}</span>
        </div>

        {/* User & Room Info Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* User Info */}
          <div className="bg-gradient-to-br from-indigo-200 to-indigo-100 rounded-2xl p-6 shadow-xl border border-indigo-300">
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">User Details</h3>
            <ul className="space-y-2 text-base text-gray-800 text-left">
              <li><strong>Name:</strong> {userName}</li>
              <li><strong>Aadhar No:</strong> {aadharno}</li>
              <li><strong>Email:</strong> {userEmail}</li>
              <li><strong>Phone No:</strong> {phoneNo}</li>
            </ul>
          </div>

          {/* Room Info */}
          <div className="bg-gradient-to-br from-purple-200 to-violet-100 rounded-2xl p-6 shadow-xl border border-purple-300">
            <h3 className="text-xl font-semibold text-purple-800 mb-3">Room Details</h3>
            <ul className="space-y-2 text-base text-gray-800 text-left">
              <li><strong>Room Type:</strong> {roomDetails.roomType}</li>
              <li><strong>Room No:</strong> {roomDetails.id}</li>
              <li><strong>AC:</strong> {roomDetails.ac ? "Yes" : "No"}</li>
              <li><strong>Adults:</strong> {adults}</li>
              <li><strong>Children:</strong> {children}</li>
              <li><strong>Check-in:</strong> {checkIn}</li>
              <li><strong>Check-out:</strong> {checkOut}</li>
            </ul>
          </div>
        </div>

        {/* Amenities Section */}
        {(addons?.length > 0 || roomDetails.features?.length > 0 || hotelDetails.amenities?.length > 0) && (
          <div className="bg-white/20 backdrop-blur-md border border-purple-300 rounded-3xl p-8 shadow-2xl mb-10">
            <h3 className="text-2xl font-bold text-gray mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L15 12.75M9.75 7.5L15 12.75M15 12.75H3.75"></path>
              </svg>
              Amenities & Room Features
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray">
              {/* Add-ons */}
              {addons?.length > 0 && (
                <div className="bg-white/10 p-4 rounded-xl border border-indigo-300 shadow hover:shadow-lg transition">
                  <h4 className="text-lg font-semibold text-gray mb-3">🧾 Selected Add-ons</h4>
                  <ul className="space-y-2 text-sm text-gray/90">
                    {addons.map((addon, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-300">✔️</span>
                        {addon.label} – ₹{addon.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Room Features */}
              {roomDetails.features?.length > 0 && (
                <div className="bg-white/10 p-4 rounded-xl border border-indigo-300 shadow hover:shadow-lg transition">
                  <h4 className="text-lg font-semibold text-gray mb-3">🛏️ Room Features</h4>
                  <ul className="space-y-2 text-sm text-gray/90">
                    {roomDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-violet-300">➤</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hotel Amenities */}
              {hotelDetails.amenities?.length > 0 && (
                <div className="bg-white/10 p-4 rounded-xl border border-indigo-300 shadow hover:shadow-lg transition">
                  <h4 className="text-lg font-semibold text-gray mb-3">🏨 Hotel Amenities</h4>
                  <ul className="space-y-2 text-sm text-gray/90">
                    {hotelDetails.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-blue-300">➤</span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Fare Section */}
        <div className="text-right text-gray-800 mt-6">
          <p className="text-lg">Room Base Fare: ₹{roomDetails.baseFare}</p>
          <p className="text-lg mt-1">Add-on Charges: ₹{totalFare - roomDetails.baseFare}</p>
          <p className="text-3xl font-extrabold text-indigo-700 mt-2">Total Fare: ₹{totalFare}</p>
        </div>

        {/* Pay Now CTA */}
        <div className="mt-10 flex justify-center">
          <div
            onClick={handleBooking}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Click to Pay
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingSummary;
