import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurant details and reviews in parallel
        const [restaurantRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${id}`),
          axios.get(`http://localhost:5000/api/reviews/${id}`)
        ]);

        setRestaurant(restaurantRes.data);
        setReviews(reviewsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch restaurant details. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReservation = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/reservation/${id}`);
  };

  const handleReview = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/review/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading restaurant details...</div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-red-600">{error || 'Restaurant not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Restaurant Header */}
      <div className="relative h-64 mb-8">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Restaurant Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">{restaurant.name}</h1>
          <p className="mt-2 text-gray-600">{restaurant.description}</p>
        </div>

        {/* Table Availability */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Table Availability</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium">2-Seat Tables</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {restaurant.tables.twoSeater} Available
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium">4-Seat Tables</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {restaurant.tables.fourSeater} Available
              </p>
            </div>
          </div>
          <button
            onClick={handleReservation}
            className="btn-primary w-full mt-4"
          >
            Make a Reservation
          </button>
        </div>

        {/* Reviews Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <button
              onClick={handleReview}
              className="btn-secondary"
            >
              Write a Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{review.user.username}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className={`text-xl ${
                              index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
