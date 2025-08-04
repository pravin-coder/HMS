import React, { useState } from "react";
import { addRoomToHotel } from "../services/HotelService";

const AddRoomPopup = ({ hotelId, onClose, onRoomAdded }) => {
  const [form, setForm] = useState({
    roomType: "",
    maxOccupancy: "",
    baseFare: "",
    isAC: false,
    features: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomData = {
      roomType: form.roomType,
      maxOccupancy: parseInt(form.maxOccupancy),
      baseFare: parseFloat(form.baseFare),
      isAC: form.isAC,
      features: form.features.split(",").map(f => f.trim()),
    };
    await addRoomToHotel(hotelId, roomData);
    onRoomAdded();
  };

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl border border-gray-300">
        <h3 className="text-xl font-bold mb-4">Add New Room</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Type Dropdown */}
          
           <label className="flex items-center gap-2 shadow-2xl">Select The RoomType</label>
          <select
            name="roomType"
            value={form.roomType}
            onChange={handleChange}
            className="select  w-full border"
            required
          >
            <option value="">Select Room Type</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Super Deluxe">Super Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Executive">Executive</option>
          </select>

           <div className="divider"></div>
          
           <label className="flex items-center gap-2 shadow-2xl">Maximum no of People</label>
          <input
            type="number"
            name="maxOccupancy"
            placeholder="Max Occupancy"
            className="input input-bordered w-full shadow-xl border"
            onChange={handleChange}
            required
          />

          <div className="divider"></div>
          {/* Base Fare with decimal allowed */}
          <label className="flex items-center gap-2 shadow-2xl">BaseFare</label>
          <input
            type="number"
            step="0.01"
            name="baseFare"
            placeholder="Base Fare (₹)"
            className="input input-bordered w-full shadow-xl border"
            onChange={handleChange}
            required
          />

          <div className="divider"></div>
          <label className="flex items-center gap-2 shadow-2xl">
            <input
              type="checkbox"
              name="isAC"
              className="checkbox"
              onChange={handleChange}
            />
            AC Room
          </label>

          <input
            type="text"
            name="features"
            placeholder="Comma separated features (e.g. Wifi, TV, Balcony)"
            className="input input-bordered w-full shadow-3xl border"
            onChange={handleChange}
            required
          />

          <div className="divider"> </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-active btn-error">
              Cancel
            </button>
            <button type="submit" className="btn btn-active btn-success">
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomPopup;
