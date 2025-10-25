const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    // Reference the User model (the one making the booking)
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    // Reference the Property model (the item being booked)
    property: {
        type: mongoose.Schema.ObjectId,
        ref: 'Property',
        required: true
    },
    checkInDate: {
        type: Date,
        required: [true, 'Please provide a check-in date']
    },
    checkOutDate: {
        type: Date,
        required: [true, 'Please provide a check-out date']
    },
    totalPrice: {
        type: Number,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);