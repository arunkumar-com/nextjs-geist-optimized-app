import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReservationForm = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    tableType: 'twoSeater',
    numberOfGuests: 2,
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
        setRestaurant(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch restaurant details');
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Update number of guests based on table type
      numberOfGuests: name === 'tableType' ? (value === 'twoSeater' ? 2 : 4) : prev.numberOfGuests
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/reservations',
        {
          restaurantId,
          ...formData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      navigate('/thank-you');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to make reservation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-red-600">Restaurant not found</div>
      </div>
    );
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="section-title text-center">Make a Reservation</h1>
      <div className="card">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-primary">{restaurant.name}</h2>
          <p className="text-gray-600 mt-1">{restaurant.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select a time</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
            </select>
          </div>

          <div>
            <label htmlFor="tableType" className="block text-sm font-medium text-gray-700 mb-1">
              Table Type
            </label>
            <select
              id="tableType"
              name="tableType"
              value={formData.tableType}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="twoSeater">2-Seater Table ({restaurant.tables.twoSeater} available)</option>
              <option value="fourSeater">4-Seater Table ({restaurant.tables.fourSeater} available)</option>
            </select>
          </div>

          <div>
            <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <input
              type="number"
              id="numberOfGuests"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleChange}
              min={1}
              max={formData.tableType === 'twoSeater' ? 2 : 4}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
