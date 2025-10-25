const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    // Reference the User model to link the property to its Lister/Owner
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a property title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    image: {
        type: String,
        required: [true, 'Please add a property image URL']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price per night']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    maxGuests: {
        type: Number,
        default: 1
    },
    // Optional fields for filtering
    propertyType: {
        type: String,
        enum: ['House', 'Apartment', 'Cabin', 'Villa', 'Condo'],
        default: 'Apartment'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Property', PropertySchema);