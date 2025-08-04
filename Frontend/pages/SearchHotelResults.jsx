import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import {getAllHotels, getSearchedHotels,getHotelsByLocation } from "../services/HotelService"; // Adjust the import based on your API structure
import {
  PlusIcon,
  MinusIcon,
  FunnelIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import FeaturedHotels from "../sections/FeaturedHotels";
import HotelCard from "../components/HotelCard";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SearchHotelResults() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [amenities, setAmenities] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const loc = params.get("location") || "";
    const type = params.get("roomType") || "";
    const checkIn = params.get("checkIn") || "";
    const checkOut = params.get("checkOut") || "";
    const rooms = params.get("rooms") || "1";
    const adults = params.get("adults") || "1";
    const children = params.get("children") || "0";


    setSearchLocation(loc);
    setRoomType(type);

    fetchHotels(loc, type);
  }, [location.search]);

  const fetchHotels = async (loc, type) => {
  try {
    console.log("Fetching hotels for location:", loc, "and room type:", type);

    let data; // Declare once, assign conditionally

    if (!loc) {
      data = await getAllHotels(); // Fallback if no location is provided
    } else if (!type) {
      data = await getHotelsByLocation(loc); // Fallback if no room type is provided
    } else {
      data = await getSearchedHotels(loc, type); // Normal case
    }

    console.log("Fetched hotels:", data);
    setHotels(data);
  } catch (error) {
    console.error("Failed to fetch hotels:", error);
  }
};



  const handleSearch = () => {
    navigate(`/SearchHotelResults?location=${searchLocation}&roomType=${roomType}`);
  };

  const handleAmenityChange = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };



  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
      <UserNavbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-y-auto h-screen">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
          <div>
            <h1 className="text-4xl  tracking-tight text-gray-900">Search Results</h1>
            {/* Location Search Bar */}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter location"
                className="border border-gray-300 rounded px-3 py-1"
              />
              <div
                onClick={handleSearch}
                className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
              >
                Search
              </div>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Sort
                <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              </Menu.Button>
              <Transition>
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    <span className="block px-4 py-2 text-sm text-gray-500">No Sort Yet</span>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="ml-4 p-2 text-gray-400 hover:text-gray-500 lg:hidden"
            >
              <FunnelIcon className="h-5 w-5" />
              <span className="sr-only">Filters</span>
            </button>
          </div>
        </div>

        {/* Filters + Listings */}
        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <div className="hidden lg:block space-y-6">
              {/* Room Type */}
              <Disclosure as="div" className="border-b border-gray-200 py-6">
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="flex w-full items-center justify-between text-sm text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Room Type</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon className="h-5 w-5" />
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-4">
                  <div className="space-y-4">
                    {["Standard","Deluxe", "Suite", "Executive"].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="roomType"
                          value={type}
                          checked={roomType === type}
                          onChange={() => setRoomType(type)}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <label className="ml-3 text-sm text-gray-600">{type}</label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </Disclosure>

              {/* Amenities */}
              <Disclosure as="div" className="border-b border-gray-200 py-6">
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="flex w-full items-center justify-between text-sm text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">Amenities</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon className="h-5 w-5" />
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-4">
                  <div className="space-y-4">
                    {["WiFi", "Parking", "Pool", "Gym"].map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          value={amenity}
                          checked={amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <label className="ml-3 text-sm text-gray-600">{amenity}</label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </Disclosure>

              {/* Ratings */}
<Disclosure as="div" className="border-b border-gray-200 py-6">
  <h3 className="-my-3 flow-root">
    <Disclosure.Button className="flex w-full items-center justify-between text-sm text-gray-400 hover:text-gray-500">
      <span className="font-medium text-gray-900">Ratings</span>
      <span className="ml-6 flex items-center">
        <PlusIcon className="h-5 w-5" />
      </span>
    </Disclosure.Button>
  </h3>
  <Disclosure.Panel className="pt-4">
    <div className="space-y-4">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center">
          <input
            type="checkbox"
            value={rating}
            // You'll need to manage selectedRatings state if you want to track them
            // checked={selectedRatings.includes(rating)}
            // onChange={() => handleRatingChange(rating)}
            className="h-4 w-4 text-indigo-600"
          />
          <label className="ml-3 text-sm text-gray-600">
            {`${rating} star${rating > 1 ? "s" : ""}`}
          </label>
        </div>
      ))}
    </div>
  </Disclosure.Panel>
</Disclosure>

            </div>

            {/* Hotel Cards */}
<div className="lg:col-span-3 overflow-y-auto h-[75vh] pr-2">
  <div className="space-y-6">
    {hotels.length === 0 ? (
      <p className="text-gray-500">No hotels found.</p>
    ) : (
      hotels.map((hotel) => {
  // 🔽 Get available rooms and their prices
  const availableRooms = hotel.rooms.filter(room => room.available);
  const startingPrice = availableRooms.length > 0
    ? Math.min(...availableRooms.map(room => room.baseFare))
    : "N/A";

  // 🔽 Compute average rating
  const totalRatings = hotel.reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = hotel.reviews.length > 0
    ? (totalRatings / hotel.reviews.length).toFixed(1)
    : "No reviews";

  return (
    <HotelCard
      key={hotel.id}
      hotel={hotel}
      startingPrice={startingPrice}
      averageRating={averageRating}
      onViewDetails={(id) => navigate(`/hotels/${hotel.id}`)}
    />
  );
})

    )}
  </div>
</div>

            
          </div>
        </section>
      </main>
    </div>
  );
}
