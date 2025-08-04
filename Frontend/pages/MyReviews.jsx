import React, { useEffect, useState } from 'react';
import { getReviewsByUserId } from '../services/ReviewService';
import UserNavbar from '../components/UserNavbar';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditReviewPopup from './EditReviewPopup';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const userId = localStorage.getItem("userId");
  

  useEffect(() => {
    if (userId) {
      getReviewsByUserId(userId)
        .then((data) => {
          setReviews(data);
          setFilteredReviews(data);
        })
        .catch((err) => {
          console.error("Failed to fetch reviews:", err);
        });
    }
  }, [userId]);

  const handleSort = (option) => {
    let sorted = [...filteredReviews];
    if (option === 'newest') {
      sorted.sort((a, b) => b.id - a.id);
    } else if (option === 'oldest') {
      sorted.sort((a, b) => a.id - b.id);
    } else if (option === 'highest') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (option === 'lowest') {
      sorted.sort((a, b) => a.rating - b.rating);
    }
    setSortOption(option);
    setFilteredReviews(sorted);
  };

  const handleDelete = (reviewId) => {
    alert(`Delete review ID: ${reviewId} (simulated)`);
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setShowPopup(true);
  };

  const handleUpdateReview = (updatedReview) => {
    // Replace existing review in state
    const updatedList = reviews.map((r) => 
      r.id === updatedReview.id ? updatedReview : r
    );
    setReviews(updatedList);
    setFilteredReviews(updatedList);
    setShowPopup(false);
  };

  return (
    <div className="pt-24">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur-lg shadow-xl">
        <UserNavbar />
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center justify-end">
          <select
            className="select select-bordered"
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

        <div className="min-w-[1200px] bg-white shadow-md rounded-xl overflow-auto">
          <table className="table w-full min-w-max">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Hotel Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Phone No</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{review.hotel?.name}</td>
                    <td className="px-4 py-3">{review.hotel?.location}</td>
                    <td className="px-4 py-3">{review.hotel?.phoneNo}</td>
                    <td className="px-4 py-3">
                      <img
                        src={review.hotel?.image}
                        alt={review.hotel?.name}
                        className="w-16 h-16 rounded object-cover border"
                      />
                    </td>
                    <td className="px-4 py-3">{review.comment}</td>
                    <td className="px-4 py-3">{review.rating} ⭐</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() => handleEdit(review)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(review.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showPopup && selectedReview && (
          <EditReviewPopup
            review={selectedReview}
            onClose={() => setShowPopup(false)}
            onUpdate={handleUpdateReview}
          />
        )}
      </div>
    </div>
  );
};

export default MyReviews;
