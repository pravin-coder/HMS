import React, { useEffect, useState } from "react";
import HotelOwnerNavbar from "../components/HotelOwnerNavbar";
import { getOwnerIdByUserId, getHotelsByOwnerId } from "../services/OwnerDashboardService";
import { getRoomsByHotelId, deleteRoomById } from "../services/HotelService";
import { getBookingsByHotelId } from "../services/BookingService";
import { FaTrashAlt } from "react-icons/fa";
import AddRoomPopup from "../components/AddRoomPopup";

const HotelStats = () => {
  const userId = localStorage.getItem("userId");
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [todayBookings, setTodayBookings] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const ownerId = await getOwnerIdByUserId(userId);
        const hotelsRes = await getHotelsByOwnerId(ownerId);
        setHotels(hotelsRes);
        if (hotelsRes.length > 0) {
          setSelectedHotelId(hotelsRes[0].id);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, [userId]);

  const fetchRooms = async () => {
    if (!selectedHotelId) return;
    try {
      const rooms = await getRoomsByHotelId(selectedHotelId);
      setRoomData(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchTodayBookings = async () => {
    if (!selectedHotelId) return;
    try {
      const allBookings = await getBookingsByHotelId(selectedHotelId);
      console.log(allBookings);
      const today = new Date().toISOString().split("T")[0];
      const filtered = allBookings.filter((booking) => {
      return booking.arrivalDate <= today && booking.departureDate >= today;
    });
      setTodayBookings(filtered);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchTodayBookings();
  }, [selectedHotelId]);

  const handleSort = (option) => {
    let sortedRooms = [...roomData];
    if (option === "lowToHigh") {
      sortedRooms.sort((a, b) => a.baseFare - b.baseFare);
    } else if (option === "highToLow") {
      sortedRooms.sort((a, b) => b.baseFare - a.baseFare);
    }
    setRoomData(sortedRooms);
    setSortOption(option);
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteRoomById(roomId);
      fetchRooms();
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-white text-gray-800">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <HotelOwnerNavbar />
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">My Hotels - Room Overview</h1>

        {/* Hotel Buttons */}
        <div className="overflow-x-auto whitespace-nowrap items-align-center py-4 mb-4 border-b border-gray-300">
          <ul className="flex space-x-3 px-4">
            {hotels.map((hotel) => (
              <li key={hotel.id}>
                <button
                  className={`btn btn-sm whitespace-nowrap ${
                    selectedHotelId === hotel.id ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => setSelectedHotelId(hotel.id)}
                >
                  🏨 {hotel.name} Status
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Sort + Add Button */}
        <div className="flex justify-between mb-4">
          <button className="btn btn-success btn-sm" onClick={() => setShowAddPopup(true)}>
            ➕ Add Room
          </button>
          <select
            className="select select-bordered select-sm w-48"
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="lowToHigh">Base Fare: Low to High</option>
            <option value="highToLow">Base Fare: High to Low</option>
          </select>
        </div>

        {/* Rooms Table */}
        <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto mb-10">
          <table className="table w-full min-w-max">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Room Type</th>
                <th className="px-4 py-3">Max Occupancy</th>
                <th className="px-4 py-3">Base Fare</th>
                <th className="px-4 py-3">AC</th>
                <th className="px-4 py-3">Features</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {roomData.length > 0 ? (
                roomData.map((room, index) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{room.roomType}</td>
                    <td className="px-4 py-3">{room.maxOccupancy}</td>
                    <td className="px-4 py-3">₹{room.baseFare.toLocaleString()}</td>
                    <td className="px-4 py-3">{room.ac ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc list-inside">
                        {room.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No rooms found for this hotel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bookings Table - Today's Bookings */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">📅 Today's Bookings</h2>
          <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto">
            <table className="table w-full min-w-max">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Room Type</th>
                  <th className="px-4 py-3">Adults</th>
                  <th className="px-4 py-3">Children</th>
                  <th className="px-4 py-3">Total Bill</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {todayBookings.map((b, index) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{b.name}</td>
                    <td className="px-4 py-3">{b.email}</td>
                    <td className="px-4 py-3">{b.phoneNo}</td>
                    <td className="px-4 py-3">{b.roomType}</td>
                    <td className="px-4 py-3">{b.noOfAdults}</td>
                    <td className="px-4 py-3">{b.noOfChildren}</td>
                    <td className="px-4 py-3">₹{b.totalBill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddPopup && (
        <AddRoomPopup
          hotelId={selectedHotelId}
          onClose={() => setShowAddPopup(false)}
          onRoomAdded={() => {
            fetchRooms();
            setShowAddPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default HotelStats;