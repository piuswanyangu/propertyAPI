// register and login
const userService = require('../services/userService');

// register a new user

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // 1. Call the service layer to handle the logic
        const userData = await userService.register({ name, email, password });

        

        // 2. Send successful response
        return res.status(201).json({ message: 'User registered successfully',
            data: userData
        });
    } catch (error) {
        // handle any error that may arise when registering the user
        res.status(400).json({  
            message: "error registering user", error: error.message
        });
    }
};

// login existing user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // user input validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide an email and password' 
            });
        }
        
        // 1. Call the service layer to handle the logic
        const userData = await userService.login({ email, password });

        // 2. Send successful response
        res.status(200).json({
            data: userData
        });

    } catch (error) {
        // Handling Invalid Credentials error from the service
        res.status(401).json({ 
            message: 'Invalid credentials' ,error: error.message
        });
    }
};

// get current logged in user
exports.getMe = async (req, res) => {
    // User data is attached to req.user by the 'protect' middleware (Step 5)
    res.status(200).json({
        success: true,
        data: req.user
    });
};