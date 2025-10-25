// list properties and create property controllers
const propertyService = require('../services/propertyService');

// create a new property
// lister only
exports.createProperty = async (req, res) => {
    try {
        // req.user is populated by the 'protect' middleware (contains user ID)
        const newProperty = await propertyService.createProperty(req.body, req.user._id);

        res.status(201).json({
            message: 'Property created successfully',
            data: newProperty
        });
    } catch (error) {
        res.status(400).json({ 
             message:"Error creating property: " + error.message
        });
    }
};

// get all properties with filtering, sorting, pagination
exports.getProperties = async (req, res) => {
    try {
        // req.query is passed for filtering/sorting
        const properties = await propertyService.getProperties(req.query);

        res.status(200).json({
            message: 'Properties fetched successfully',
            count: properties.length,
            data: properties
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server Error fetching properties', error: error.message 
        });
    }
};

// get single property by ID
exports.getPropertyById = async (req, res) => {
    try {
        const property = await propertyService.getPropertyById(req.params.id);

        res.status(200).json({
            message: 'Property fetched successfully',
            data: property
        });
    } catch (error) {
        // Specific 404 for 'Property not found'
        res.status(404).json({ 
            message:" Property not found", error: error.message
        });
    }
};

// update property details
// owner only
exports.updateProperty = async (req, res) => {
    try {
        const updatedProperty = await propertyService.updateProperty(
            req.params.id, 
            req.body, 
            req.user._id // Ensure only the owner can update
        );

        res.status(200).json({
            message: 'Property updated successfully',
            data: updatedProperty
        });
    } catch (error) {
        // 404 for not found, 401 for unauthorized, 400 for bad input
        const statusCode = (error.message.includes('Not authorized')) ? 401 : 404;
        res.status(statusCode).json({ 
             message:" Error updating property: " + error.message
        });
    }
};

// delete a property listing
// owner only
exports.deleteProperty = async (req, res) => {
    try {
        await propertyService.deleteProperty(req.params.id, req.user._id);

        res.status(200).json({
            message:' Property deleted successfully',
            data: {} // Return empty object on successful deletion
        });
    } catch (error) {
        const statusCode = (error.message.includes('Not authorized')) ? 401 : 404;
        res.status(statusCode).json({ 
            message:" Error deleting property: " + error.message 
        });
    }
};