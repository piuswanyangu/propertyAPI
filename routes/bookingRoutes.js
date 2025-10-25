// book cancel, view booking routes
const express = require('express');
const { 
    createBooking, 
    getUserBookings,
    cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth'); // Import the protection middleware

const router = express.Router();

// All booking routes require authentication
router.use(protect);

//  Create a new booking
router.route('/')
    .post(createBooking); 

// Get all bookings for the current user
router.route('/my')
    .get(getUserBookings);

// cancel a booking
router.route('/cancel/:id')
    .put(cancelBooking);

module.exports = router;