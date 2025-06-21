const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  try {
    const { restaurantId, date, time, tableType, numberOfGuests } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if table type is available
    const availableTables = restaurant.tables[tableType];
    if (availableTables <= 0) {
      return res.status(400).json({ message: 'No tables available for selected type' });
    }

    // Create reservation
    const reservation = await Reservation.create({
      user: req.user._id,
      restaurant: restaurantId,
      date,
      time,
      tableType,
      numberOfGuests,
    });

    // Update available tables
    restaurant.tables[tableType] -= 1;
    await restaurant.save();

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user reservations
// @route   GET /api/reservations
// @access  Private
const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('restaurant', 'name')
      .sort('-createdAt');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if reservation belongs to user
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update restaurant table availability
    const restaurant = await Restaurant.findById(reservation.restaurant);
    if (restaurant) {
      restaurant.tables[reservation.tableType] += 1;
      await restaurant.save();
    }

    await reservation.deleteOne();
    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  cancelReservation,
};
