// jwt token validation middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (ensure a valid token is present)
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in the 'Authorization: Bearer <token>' header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({  
            message: 'Not authorized to access ' 
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user (excluding password) to the request object
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({  
                message: 'User associated with token no longer exists' 
            });
        }
        
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({  
            message: 'Token failed' 
        });
    }
};