import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";
import RoomCard from "../components/RoomCard";
import { getavailableRoomsByHotelId } from "../services/HotelService";
import { useNavigate } from 'react-router-dom';

const HotelRoomsPage = () => {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [totalAddOns, setTotalAddOns] = useState(0);
  const [aadharno, setAadharno] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const navigate = useNavigate();

  const handleAddOnChange = (e) => {
    const label = e.target.name;
    const price = parseInt(e.target.value);
    const count = adults + children;
    const totalCost = count * price;

    if (e.target.checked) {
      setSelectedAddOns([...selectedAddOns, { label, price }]);
      setTotalAddOns(prev => prev + totalCost);
    } else {
      setSelectedAddOns(selectedAddOns.filter(item => item.label !== label));
      setTotalAddOns(prev => prev - totalCost);
    }
  };

  // Calculate total fare
  const totalFare = selectedRoom ? selectedRoom.baseFare + totalAddOns : 0;




  const handleProceed = () => {
    if (!selectedRoom || !checkIn || !checkOut) {
      alert("Please fill in all required fields.");
      return;
    }
    navigate("/booking-summary", {
      state: {
        roomId: selectedRoom.id,
        aadharno,
        phoneNo,
        checkIn,
        checkOut,
        adults,
        children,
        addons: selectedAddOns,
        totalFare,
      },
    });
  };

  // Handler to open the popup
  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setShowPopup(true);
  };

  // Handler to close the popup
  const handleClosePopup = () => {
    setSelectedRoom(null);
    setShowPopup(false);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getavailableRoomsByHotelId(hotelId);
        setRooms(data);
        if (data.length > 0) {
          setHotel(data[0].hotel);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchRooms();
  }, [hotelId]);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    if (storedName) setUserName(storedName);
    if (storedEmail) setEmail(storedEmail);

    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    setCheckIn(today);
    setCheckOut(tomorrow);
  }, []);


  if (!hotel) return <div className="text-center mt-20">Loading hotel info...</div>;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <UserNavbar />
      </div>
      {/* SECTION 1: Hotel Info Banner */}
      <div className="pt-24" style={{ backgroundColor: 'from-indigo-100 via-white to-blue-100' }}>
        <section className="rounded-xl  bg-gradient-to-br from-indigo-200 via-white to-blue-100 w-full py-16">
          <div className="container px-5 py-20 mx-auto flex flex-wrap">
            {/* Left Panel: Details + Stats */}
            <div className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
              <div className="w-full sm:p-4 px-4 mb-6">
                <h2 className="title-font font-bold text-3xl mb-2 text-gray-900">{hotel.name}</h2>
                <p className="leading-relaxed text-base">{hotel.description}</p>
                <p className="mt-2 text-sm text-gray-700 italic">📍 {hotel.location}</p>
                <p className="mt-2 text-sm text-gray-700">📞 {hotel.phoneNo}</p>
                <p className="mt-2 text-sm text-gray-700">✨ {hotel.specialFeature}</p>
                <p className="mt-2 text-sm text-gray-600">👤 Owner: {hotel.owner?.user?.name}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {hotel.amenities?.map((amenity, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                <h2 className="title-font font-medium text-3xl text-gray-900">{rooms.length}</h2>
                <p className="leading-relaxed text-sm">Rooms</p>
              </div>
              <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                <h2 className="title-font font-medium text-3xl text-gray-900">4.5</h2>
                <p className="leading-relaxed text-sm">Rating</p>
              </div>
              <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                <h2 className="title-font font-medium text-3xl text-gray-900">24K</h2>
                <p className="leading-relaxed text-sm">Visitors</p>
              </div>
              <div className="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                <h2 className="title-font font-medium text-3xl text-gray-900">₹{Math.min(...rooms.map(r => r.baseFare))}</h2>
                <p className="leading-relaxed text-sm">Starting Fare</p>
              </div>
            </div>

            {/* Right Panel: Image */}
            <div className="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
              <img
  className="object-cover object-center w-full h-full max-h-[400px] rounded-xl"
  src={hotel.image}
  alt="hotel"
/>
            </div>
          </div>
        </section>

        {/* SECTION 2: Room Listings */}
        <section className="py-20 bg-gradient-to-b from-indigo-50 via-white to-purple-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-blue-800 mb-12">
              Available Rooms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} onBookNow={() => handleBookNow(room)} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Popup for Booking Details */}
      {showPopup && selectedRoom && (
        <div className="fixed inset-0 z-50  bg-opacity-30 backdrop-blur-sm flex justify-center ">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={handleClosePopup}
            >
              ✕
            </button>

            {/* Room & Hotel Info */}
            <div className="mb-6 border-b pb-4 justify-center items-center">
              <h2 className="text-2xl font-bold text-indigo-700">{selectedRoom.hotel?.name}</h2>
              <p className="text-sm text-gray-600">Type: <strong>{selectedRoom.roomType}</strong> ({selectedRoom.ac ? "AC" : "Non-AC"})</p>
              <p className="text-sm text-gray-600">Base Fare: ₹<strong>{selectedRoom.baseFare}</strong></p>
            </div>

            {/* Booking Form */}
            <form className="space-y-4">

              {/* Name and Aadhar - side by side */}
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
                  />
                </div>

                <div className="flex-1 mt-4 sm:mt-0">
                  <label className="block text-sm font-medium text-gray-700">Aadhar No</label>
                  <input
                    type="text"
                    value={aadharno}
                    onChange={(e) => setAadharno(e.target.value)}
                    maxLength={12}
                    placeholder="XXXX-XXXX-XXXX"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-left font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm text-left font-medium text-gray-700">Phone No</label>
                <input
                  type="number"
                  placeholder="Enter your phone number"
                  maxLength={12}
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
                />
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm text-left font-medium text-gray-700">Check-In</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (checkOut && new Date(e.target.value) > new Date(checkOut)) {
                      setCheckOut('');
                    }
                  }}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm text-left font-medium text-gray-700">Check-Out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
                />
              </div>

              {/* Adults Dropdown */}
              <div>
                <label className="block text-sm text-left font-medium text-gray-700">Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Children Dropdown */}
              <div>
                <label className="block text-sm text-left font-medium text-gray-700">Children</label>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
                >
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Optional Purchases */}
              <div>
                <label className="block text-sm font-medium mb-1">Optional Purchases</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="Lunch"
                      value="100"
                      onChange={handleAddOnChange}
                      className="mr-2"
                    />
                    Lunch (₹100 per person)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="Tea"
                      value="50"
                      onChange={handleAddOnChange}
                      className="mr-2"
                    />
                    Tea (₹50 per person)
                  </label>
                </div>
              </div>
            </form>


            {/* Total and Proceed */}
            <div className="mt-6 border-t pt-4">
              <p className="text-right text-lg font-semibold text-indigo-800">
                Total: ₹{selectedRoom.baseFare + totalAddOns}
              </p>
              <div
                type="button"
                onClick={() => {
                  handleProceed();
                  handleClosePopup();
                  // redirect logic here
                }}
                className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition"
              >
                Proceed to Booking
              </div>
            </div>
          </div>
        </div>
      )}




    </>
  );
};

export default HotelRoomsPage;
