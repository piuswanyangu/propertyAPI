// book property and get bookings controllers
const bookingService = require('../services/bookingService');

// create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { propertyId, checkInDate, checkOutDate, guests } = req.body;
        
        const newBooking = await bookingService.createBooking(
            { propertyId, checkInDate, checkOutDate, guests },
            req.user._id // User ID from protect middleware
        );

        res.status(201).json({
            message: 'Booking created successfully',
            data: newBooking
        });
    } catch (error) {
        // Handle common errors like 404 (Not Found) and 400 (Bad Request/Overlap)
        const statusCode = (error.message.includes('not found') || error.message.includes('Invalid dates')) ? 404 : 400;
        res.status(statusCode).json({ 
            message: "Error creating booking: " + error.message
        });
    }
};
// get all bookings for the authenticated user
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getUserBookings(req.user._id);

        res.status(200).json({
            message: 'User bookings fetched successfully',
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server Error fetching bookings' , error: error.message
        });
    }
};

// cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const cancelledBooking = await bookingService.cancelBooking(
            req.params.id, 
            req.user._id
        );

        res.status(200).json({
            message: 'Booking successfully cancelled.',
            data: cancelledBooking
        });
    } catch (error) {
        // 404 (Not Found), 401 (Not authorized), 400 (Already cancelled)
        const statusCode = (error.message.includes('not found')) ? 404 
                         : (error.message.includes('Not authorized')) ? 401 : 400;
                         
        res.status(statusCode).json({ 
            message: "Error cancelling booking: " + error.message
        });
    }
};