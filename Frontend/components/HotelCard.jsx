import React from "react";

const HotelCard = ({ hotel, startingPrice, averageRating, onViewDetails }) => {console.log(hotel);

  return (
    <div className="flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] transition duration-300">
      {/* Left Half - Image */}
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-1/2 h-52 object-cover"
      />

      {/* Right Half - Details */}
      <div className="p-4 w-1/2 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{hotel.description}</p>
          <p className="text-sm text-gray-600 mt-1">📍 {hotel.location}</p>
          <p className="text-sm text-gray-600 mt-1">
            🛎️ Amenities: {hotel.amenities?.join(", ") || "N/A"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ⭐ Rating:{" "}
            <span className={averageRating === "No reviews" ? "text-gray-400" : "text-yellow-600"}>
              {averageRating}
            </span>
          </p>
        </div>

        <div className="mt-4">
          <p
            className={`font-medium ${
              startingPrice === "N/A" ? "text-gray-400" : "text-indigo-600"
            }`}
          >
            {startingPrice === "N/A"
              ? "No rooms available"
              : `₹${startingPrice} / night`}
          </p>
          <div
            className="mt-2 w-full bg-indigo-500 text-white hover:bg-indigo-400 py-2 px-4 rounded-lg text-sm font-medium text-center cursor-pointer"
            onClick={() => onViewDetails(hotel.id)}
          >
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
