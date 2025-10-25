// handle password hashing and use role assignment

const User = require('../models/User')
const jwt = require('jsonwebtoken');

//  generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE 
    });
};

// register a new user

exports.register = async ({ name, email, password }) => {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        // console.log('User already exists with this email:', email);
        throw new Error('User already exists with this email');
    }

    // 2. Create user (password hashing handled by Mongoose pre-save hook)
    user = await User.create({ name, email, password });

    // 3. Generate token for immediate login
    const token = generateToken(user._id);

    // user data and token
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
    };
};

// login existing user
exports.login = async ({ email, password }) => {
    // 1. Find user, explicitly select password
    const user = await User.findOne({ email }).select('+password');
    
    // 2. Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
        console.log('Invalid credentials');
    }
    
    // 3. Generate token
    const token = generateToken(user._id);

    // Return  user data and token
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
    };
};