const express = require('express');
const router = express.Router();
const {
  createReservation,
  getUserReservations,
  cancelReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .post(createReservation)
  .get(getUserReservations);

router.delete('/:id', cancelReservation);

module.exports = router;
