import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Install using `npm install jwt-decode`

const Review = () => {
  const [token, setToken] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch token and user ID (if available)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
      const decoded = jwtDecode(storedToken);
      setLoggedInUserId(decoded.userId);
    }
  }, []);

  // Fetch reviews when component mounts (even if not logged in)
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error.response?.data || error.message);
    }
  };

  // Handle Review Submission
  const handleSubmitReview = async () => {
    if (!newReview || !rating) {
      alert("Please enter a review and rating.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reviews",
        { text: newReview, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews([...reviews, response.data]); // Add new review
      setNewReview("");
      setRating(0);
    } catch (error) {
      console.error("Error adding review:", error.response?.data || error.message);
      alert("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Review Deletion
  const handleDelete = async (reviewId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        alert("Review deleted successfully!");
        setReviews(reviews.filter((r) => r._id !== reviewId));
      }
    } catch (error) {
      console.error("Error deleting review:", error.response?.data || error.message);
      alert("Failed to delete review.");
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">User Reviews</h3>

      {/* Add Review Section */}
      {token ? (
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Write your review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <div className="flex items-center gap-4 mb-4">
            <span className="text-lg text-gray-800">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-xl ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmitReview}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Login to leave a review.</p>
      )}

      {/* Display Reviews */}
      <div>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="p-4 border-b border-gray-300">
              <p className="font-semibold text-gray-800">
                 {review.user?.name ? review.user.name : "Anonymous"}
              </p>

              <p className="text-gray-700">{review.text}</p>
              <p className="text-yellow-500">Rating: {review.rating} ★</p>

              {/* Show Delete Button Only if User Owns the Review */}
              {token && review.user && review.user._id === loggedInUserId && (
                <button 
                  className="text-red-500 hover:underline ml-4" 
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Review;
