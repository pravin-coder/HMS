import React, { useState } from 'react';
import HotelOwnerNavbar from '../components/HotelOwnerNavbar';
import { createHotel } from '../services/HotelService';

const AddNewHotel = () => {
  const userId = localStorage.getItem('userId'); // Or get from context/token
  const ownerId = localStorage.getItem('ownerId'); // Or fetch via API
  console.log(userId);
  console.log(ownerId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [location, setLocation] = useState('');
  const [specialFeature, setSpecialFeature] = useState('');
  const [amenities, setAmenities] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hotelData = {
      name,
      description,
      image,
      phoneNo,
      location,
      specialFeature,
      amenities: amenities.split(',').map(a => a.trim()), // comma-separated input
      rooms: [],
      reviews: [],
      owner: {
        ownerId: Number(ownerId),
        user: {
          id: Number(userId)
        }
      }
    };

    try {
      const response = await createHotel(hotelData);
      console.log('Hotel created successfully:', response);
      alert('Hotel created successfully!');
    } catch (error) {
      console.error('Failed to create hotel:', error);
      alert('Error creating hotel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 w-full z-10">
        <HotelOwnerNavbar />
      </div>

      <div className="pt-24 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Add New Hotel</h2>
        <form  className="bg-white shadow-md rounded-xl p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hotel Name</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows="3"
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Special Feature</label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={specialFeature}
                onChange={(e) => setSpecialFeature(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
              <input
                type="text"
                placeholder="WiFi, Gym, Pool"
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center">
            <div
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-indigo-700 transition"
            >
              Submit Hotel
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewHotel;
