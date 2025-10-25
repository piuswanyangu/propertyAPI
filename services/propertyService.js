// calculate price , format listings
//  --- IGNORE----
const Property = require('../models/Property');
const User = require('../models/User'); // Needed to confirm user role if necessary

// create a new property listing
exports.createProperty = async (propertyData, userId) => {
    // 1.  check if the user is a 'Lister'
    const user = await User.findById(userId);
    if (user.role !== 'Lister' && user.role !== 'Admin') {
        throw new Error('User not authorized to create listings');
    }

    // 2. Add the owner/lister ID to the property data
    const newProperty = await Property.create({
        ...propertyData,
        owner: userId
    });

    return newProperty;
};

// /get all properties with filtering, sorting, pagination
exports.getProperties = async (query) => {
    // Basic implementation for demonstration. 
    // This is where powerful MongoDB query manipulation (Mongoose filtering/pagination) would go.

    let propertiesQuery = Property.find();
    
    //  Filtering (e.g., /api/v1/properties?location=Nairobi)
    if (query.location) {
        propertiesQuery = propertiesQuery.where('location').equals(query.location);
    }
    
    // Sorting 
    if (query.sort) {
        propertiesQuery = propertiesQuery.sort(query.sort);
    } else {
        propertiesQuery = propertiesQuery.sort('-createdAt'); // Default sort: newest first
    }

    // Always populate the owner details so the frontend knows who listed it
    propertiesQuery = propertiesQuery.populate('owner', 'name email'); 
    
    const properties = await propertiesQuery;
    
    return properties;
};

// get single property by ID
exports.getPropertyById = async (propertyId) => {
    const property = await Property.findById(propertyId)
        .populate('owner', 'name email'); // Fetch owner name/email
    
    if (!property) {
        throw new Error('Property not found');
    }

    return property;
};

// update property details
exports.updateProperty = async (propertyId, updateData, userId) => {
    let property = await Property.findById(propertyId);

    if (!property) {
        throw new Error('Property not found');
    }
    
    // Check if the authenticated user is the owner of the property
    if (property.owner.toString() !== userId.toString()) {
        throw new Error('Not authorized to update this property');
    }

    // Perform the update
    property = await Property.findByIdAndUpdate(propertyId, updateData, {
        new: true, // Return the updated document
        runValidators: true // Run Mongoose validators on the update
    });

    return property;
};

// delete a property listing
exports.deleteProperty = async (propertyId, userId) => {
    const property = await Property.findById(propertyId);

    if (!property) {
        throw new Error('Property not found');
    }
    
    // Check ownership before deleting
    if (property.owner.toString() !== userId.toString()) {
        throw new Error('Not authorized to delete this property');
    }

    // You would typically also delete related bookings here
    await Booking.deleteMany({ property: propertyId });
    

    await property.deleteOne(); // Use deleteOne() for Mongoose 6+

    return {}; // Return empty object or success message
};

