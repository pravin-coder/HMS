// components/RoomCard.jsx
import React from "react";

const RoomCard = ({ room, onBookNow }) => {


  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-indigo-100 hover:shadow-indigo-300 transition duration-300">
      <h3 className="text-2xl font-semibold text-indigo-700 mb-2">{room.roomType}</h3>
      <p className="text-gray-600 mb-2">👥 Max Occupancy: <strong>{room.maxOccupancy}</strong></p>
      <p className="text-indigo-900 font-bold text-lg">₹{room.baseFare} / night</p>
      <ul className="text-sm text-gray-700 mt-4 list-disc list-inside">
        {room.features?.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <div className="mt-4">
        <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${room.ac ? "bg-indigo-100 text-indigo-700" : "bg-red-100 text-red-700"
          }`}>
          {room.ac ? "❄️ AC Room" : "🔥 Non-AC"}
        </span>
      </div>
      <div
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
        onClick={onBookNow}
      >
        Book Now
      </div>

    </div>
  );
};

export default RoomCard;
