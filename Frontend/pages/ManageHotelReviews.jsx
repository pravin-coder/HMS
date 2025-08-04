import React, { useEffect, useState } from 'react';
import { getReviewsByHotelId } from '../services/ReviewService';
import { getOwnerIdByUserId, getHotelsByOwnerId, getUserById } from '../services/OwnerDashboardService';
import HotelOwnerNavbar from '../components/HotelOwnerNavbar';

const ManageHotelReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [userMap, setUserMap] = useState({});

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchHotelsAndReviews = async () => {
      try {
        const ownerId = await getOwnerIdByUserId(userId);
        const hotelsRes = await getHotelsByOwnerId(ownerId);
        setHotels(hotelsRes);
        if (hotelsRes.length > 0) setSelectedHotelId(hotelsRes[0].id);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    if (userId) fetchHotelsAndReviews();
  }, [userId]);

  useEffect(() => {
    const fetchReviewsAndUsers = async () => {
      try {
        if (!selectedHotelId) return;
        const reviewRes = await getReviewsByHotelId(selectedHotelId);
        setReviews(reviewRes);

        const uniqueUserIds = [...new Set(reviewRes.map((r) => r.user?.id))];
        const userPromises = uniqueUserIds.map((uid) => getUserById(uid));
        const users = await Promise.all(userPromises);

        const userMapTemp = {};
        users.forEach((user) => {
          userMapTemp[user.id] = user;
        });
        setUserMap(userMapTemp);

        setFilteredReviews(reviewRes);
      } catch (error) {
        console.error('Error fetching reviews or users:', error);
      }
    };

    fetchReviewsAndUsers();
  }, [selectedHotelId]);

  const handleSort = (option) => {
    let sorted = [...filteredReviews];
    if (option === 'newest') sorted.sort((a, b) => b.id - a.id);
    else if (option === 'oldest') sorted.sort((a, b) => a.id - b.id);
    else if (option === 'highest') sorted.sort((a, b) => b.rating - a.rating);
    else if (option === 'lowest') sorted.sort((a, b) => a.rating - b.rating);
    setSortOption(option);
    setFilteredReviews(sorted);
  };

  return (
    <div className="pt-24 bg-white-100 min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <HotelOwnerNavbar />
      </div>

      {/* Hotel Tabs */}
      <div className="px-4 py-5 border-b bg-white shadow-sm">
        <div className="flex gap-3 flex-wrap">
          {hotels.map((hotel) => (
            <button
              key={hotel.id}
              className={`btn btn-sm rounded-full ${selectedHotelId === hotel.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedHotelId(hotel.id)}
            >
              🏨 {hotel.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="px-4 py-4 flex justify-end">
        <select
          className="select select-bordered max-w-xs"
          value={sortOption}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="newest">Date: Newest</option>
          <option value="oldest">Date: Oldest</option>
          <option value="highest">Rating: High to Low</option>
          <option value="lowest">Rating: Low to High</option>
        </select>
      </div>

      {/* Table */}
      <div className="px-4 pb-10">
        <div className="overflow-auto rounded-xl bg-white shadow">
          <table className="table w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Hotel</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">User Email</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Rating</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{review.hotel?.name}</td>
                    <td className="px-4 py-3">{userMap[review.user?.id]?.name || 'Loading...'}</td>
                    <td className="px-4 py-3">{userMap[review.user?.id]?.email || 'Loading...'}</td>
                    <td className="px-4 py-3">{review.hotel?.location}</td>
                    <td className="px-4 py-3">{review.hotel?.phoneNo}</td>
                    <td className="px-4 py-3">
                      <img
                        src={review.hotel?.image}
                        alt={review.hotel?.name}
                        className="w-16 h-16 rounded object-cover border"
                      />
                    </td>
                    <td className="px-4 py-3 max-w-xs whitespace-normal text-gray-600 italic">{review.comment}</td>
                    <td className="px-4 py-3 font-semibold text-yellow-600">{review.rating} ⭐</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageHotelReviews;
