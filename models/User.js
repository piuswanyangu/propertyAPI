const mongoose = require('mongoose');
// for password hashing
const bcrypt = require('bcrypt');
//  for generating token on the model
const jwt = require('jsonwebtoken'); 

// defining user schema
//  Mongoose types are capitalized (String, Date, Schema)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        //  Hiding password field from query results by default
        select: false 
    },
    role: { 
        type: String,
        enum: ['User', 'Lister', 'Admin']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// -------------------------------------------------------------------
// 1. Password Hashing (Mongoose Pre-Save Hook)
// -------------------------------------------------------------------
userSchema.pre('save', async function(next) {
    // Only run if password field is actually modified
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// -------------------------------------------------------------------
// 2. JWT Generation Method (Used by the Service/Controller)
// -------------------------------------------------------------------
// Sign and return JWT
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// -------------------------------------------------------------------
// 3. Password Comparison Method (Used by the Login Service)
// -------------------------------------------------------------------
// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    // Note: this.password is available here because we SELECTed it in the service
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);