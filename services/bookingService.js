// check for property availability
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// check for overlapping bookings
const checkOverlap = async (propertyId, checkIn, checkOut, excludeBookingId = null) => {
    // Find any confirmed or pending booking for the property
    const query = {
        property: propertyId,
        status: { $in: ['Pending', 'Confirmed'] },
        // Check if the requested period overlaps with any existing booking's period
        $or: [
            // Case 1: Existing booking starts during the requested period
            { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
        ]
    };
    
    // If we are updating a booking, exclude the booking being updated from the check
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const overlappingBookings = await Booking.find(query);
    return overlappingBookings.length > 0;
};

// calculate total price based on nights stayed
const calculateTotalPrice = (pricePerNight, checkInDate, checkOutDate) => {
    // Calculate difference in milliseconds
    const diffTime = Math.abs(newOutDate - checkInDate);
    // Convert to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 0) {
        throw new Error('Check-out date must be after check-in date.');
    }

    return pricePerNight * diffDays;
};

// create a new booking
exports.createBooking = async (bookingData, userId) => {
    const { propertyId, checkInDate, checkOutDate, guests } = bookingData;

    const property = await Property.findById(propertyId);
    if (!property) {
        throw new Error('Property not found.');
    }

    // 1. Validate Dates and Availability
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const now = new Date();

    if (checkIn < now || checkOut <= checkIn) {
        throw new Error('Invalid dates provided.');
    }
    
    // Check for capacity
    if (guests > property.maxGuests) {
        throw new Error(`Exceeds property limit of ${property.maxGuests} guests.`);
    }

    const isBooked = await checkOverlap(propertyId, checkIn, checkOut);
    if (isBooked) {
        throw new Error('Property is already booked for these dates.');
    }

    // 2. Calculate Total Price
    const totalPrice = calculateTotalPrice(property.price, checkIn, checkOut);

    // 3. Create Booking
    const newBooking = await Booking.create({
        user: userId,
        property: propertyId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests,
        totalPrice,
        status: 'Pending' // Start as pending, payment system would confirm later
    });

    return newBooking.populate('property', 'title price location'); // Return populated booking
};

// get all bookings for a user
exports.getUserBookings = async (userId) => {
    const bookings = await Booking.find({ user: userId })
        .populate('property', 'title price images location owner') // Show property details
        .sort('-bookedAt'); // Newest bookings first
    
    return bookings;
};
// cancel a booking
exports.cancelBooking = async (bookingId, userId) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new Error('Booking not found.');
    }

    // Ensure only the user who made the booking can cancel it
    if (booking.user.toString() !== userId.toString()) {
        throw new Error('Not authorized to cancel this booking.');
    }

    // Only allow cancellation if the status is not already cancelled/completed
    if (booking.status === 'Cancelled' || booking.status === 'Completed') {
        throw new Error(`Booking cannot be cancelled because its status is ${booking.status}.`);
    }

    // Update status to Cancelled
    booking.status = 'Cancelled';
    await booking.save();

    return booking;
};