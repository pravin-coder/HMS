import React, { useEffect, useState } from "react";
import { getOwnerIdByUserId, getHotelsByOwnerId } from "../services/OwnerDashboardService";
import { getBookingsByHotelId } from "../services/BookingService";
import { checkRoomAvailability, setRoomAvailable } from "../services/RoomService";
import HotelOwnerNavbar from "../components/HotelOwnerNavbar";

const ManageRoomBookings = () => {
    const userId = localStorage.getItem("userId");
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState(null);
    const [allBookings, setAllBookings] = useState([]);
    const [vacatedUnavailableBookings, setVacatedUnavailableBookings] = useState([]);
    const [today, setToday] = useState(new Date().toISOString().split("T")[0]);

    useEffect(() => {
        const fetchHotelsAndBookings = async () => {
            try {
                const ownerId = await getOwnerIdByUserId(userId);
                const hotelsRes = await getHotelsByOwnerId(ownerId);
                setHotels(hotelsRes);
                if (hotelsRes.length > 0) setSelectedHotelId(hotelsRes[0].id);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            }
        };
        fetchHotelsAndBookings();
    }, [userId]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await getBookingsByHotelId(selectedHotelId);
                console.log("Booking data for hotel", selectedHotelId, data);
                setAllBookings(Array.isArray(data) ? data : []);

                const vacated = await Promise.all(
                    data
                        .filter(b => today >= b.departureDate)
                        .map(async (b) => {
                            const available = await checkRoomAvailability(b.roomId);
                            return !available ? b : null;
                        })
                );
                setVacatedUnavailableBookings(vacated.filter(Boolean));
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        if (selectedHotelId) fetchBookings();
    }, [selectedHotelId, today]);

    const handleMakeAvailable = async (roomId) => {
        try {
            await setRoomAvailable(roomId);
            setVacatedUnavailableBookings(prev => prev.filter(b => b.roomId !== roomId));
        } catch (error) {
            console.error("Failed to set room available:", error);
        }
    };

    const bookingHistory = allBookings;

    return (
        <div className="pt-24 min-h-screen bg-white text-gray-800 px-4 max-w-7xl mx-auto">
            <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
                    <HotelOwnerNavbar />
                  </div>
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Bookings</h1>

            <div className="overflow-x-auto whitespace-nowrap items-align-center py-4 mb-4 border-b border-gray-300">
                <ul className="flex space-x-3 px-4">
                    {hotels.map((hotel) => (
                        <li key={hotel.id}>
                            <button
                                className={`btn btn-sm whitespace-nowrap ${selectedHotelId === hotel.id ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setSelectedHotelId(hotel.id)}
                            >
                                🏨 {hotel.name} Status
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto mb-10">
                <h2 className="text-xl font-semibold p-4">All Bookings</h2>
                <table className="table w-full min-w-max">
                    <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
                        <tr>
                            <th className="px-4 py-3">S.No</th>
                            <th className="px-4 py-3">Booking ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone No</th>
                            <th className="px-4 py-3">Aadhar</th>
                            <th className="px-4 py-3">Room Type</th>
                            <th className="px-4 py-3">Adults</th>
                            <th className="px-4 py-3">Children</th>
                            <th className="px-4 py-3">Arrival</th>
                            <th className="px-4 py-3">Departure</th>
                            <th className="px-4 py-3">Booking Date</th>
                            <th className="px-4 py-3">Total (₹)</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {bookingHistory.map((b, index) => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3">{b.id}</td>
                                <td className="px-4 py-3">{b.name}</td>
                                <td className="px-4 py-3">{b.email}</td>
                                <td className="px-4 py-3">{b.phoneNo}</td>
                                <td className="px-4 py-3">{b.aadharImg ? "Available" : "N/A"}</td>
                                <td className="px-4 py-3">{b.roomType}</td>
                                <td className="px-4 py-3">{b.noOfAdults}</td>
                                <td className="px-4 py-3">{b.noOfChildren}</td>
                                <td className="px-4 py-3">{b.arrivalDate}</td>
                                <td className="px-4 py-3">{b.departureDate}</td>
                                <td className="px-4 py-3">{b.bookingDate}</td>
                                <td className="px-4 py-3">₹{parseFloat(b.totalBill).toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${today < b.departureDate
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {today < b.departureDate ? "Active" : "Completed"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto">
                <h2 className="text-xl font-semibold p-4">Vacated Bookings - Rooms Unavailable</h2>
                <table className="table w-full min-w-max">
                    <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
                        <tr>
                            <th className="px-4 py-3">S.No</th>
                            <th className="px-4 py-3">Booking ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Room Type</th>
                            <th className="px-4 py-3">Departure</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                        {vacatedUnavailableBookings.map((b, index) => (
                            <tr key={b.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3">{b.id}</td>
                                <td className="px-4 py-3">{b.name}</td>
                                <td className="px-4 py-3">{b.roomType}</td>
                                <td className="px-4 py-3">{b.departureDate}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleMakeAvailable(b.roomId)}
                                    >
                                        Make Available
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRoomBookings;
