// EditReviewPopup.jsx
import React, { useState, useEffect } from 'react';

const EditReviewPopup = ({ review, onClose, onUpdate }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);

  useEffect(() => {
    if (review) {
      setComment(review.comment || '');
      setRating(review.rating || 1);
    }
  }, [review]);

  const handleUpdate = () => {
    if (!comment || rating < 1 || rating > 5) return alert("Invalid input");
    onUpdate({ ...review, comment, rating });
    onClose();
  };

  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Edit Your Review</h2>

        <div className="space-y-4">
          {/* Comment Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
            />
          </div>

          {/* Rating Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (1 to 5)</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min={1}
              max={5}
              className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 shadow focus:shadow-md"
            />
          </div>

          {/* Update Button */}
          <div className="text-right">
            <button
              onClick={handleUpdate}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Update Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReviewPopup;
