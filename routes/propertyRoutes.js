// list get create update delete routes 
const express = require('express');
const { 
    createProperty, 
    getProperties, 
    getPropertyById, 
    updateProperty,
    deleteProperty
} = require('../controllers/propertyController');
const { protect } = require('../middlewares/auth'); // Import the protection middleware

const router = express.Router();

// Public Routes (Anyone can view listings)
router.route('/')
    .get(getProperties); 

router.route('/:id')
    .get(getPropertyById); 

// Private Routes (Only logged-in users can create, update, or delete)
router.route('/')
    .post(protect, createProperty); 

router.route('/:id')
    .put(protect, updateProperty)    
    .delete(protect, deleteProperty); 

module.exports = router;