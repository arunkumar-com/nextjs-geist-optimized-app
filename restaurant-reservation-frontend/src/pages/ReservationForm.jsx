import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReservationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    tableType: '2',
    specialRequests: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        `http://localhost:5000/api/reservations/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate('/thank-you');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to make reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Make a Reservation</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            >
              <option value="">Select a time</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
            </select>
          </div>

          {/* Table Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative flex cursor-pointer">
                <input
                  type="radio"
                  name="tableType"
                  value="2"
                  checked={formData.tableType === '2'}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="w-full p-4 bg-white border border-gray-200 rounded-lg peer-checked:border-black peer-checked:bg-gray-50 transition-all">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">2-Seat Table</span>
                    <span className="text-sm text-gray-500">Perfect for couples</span>
                  </div>
                </div>
              </label>
              <label className="relative flex cursor-pointer">
                <input
                  type="radio"
                  name="tableType"
                  value="4"
                  checked={formData.tableType === '4'}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="w-full p-4 bg-white border border-gray-200 rounded-lg peer-checked:border-black peer-checked:bg-gray-50 transition-all">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">4-Seat Table</span>
                    <span className="text-sm text-gray-500">For small groups</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
              placeholder="Any special requests or dietary requirements?"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-black text-white font-semibold rounded-lg 
              ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-800'} 
              transition-colors duration-200`}
          >
            {loading ? 'Confirming Reservation...' : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
