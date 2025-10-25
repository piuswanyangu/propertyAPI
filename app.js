const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
// Middleware to parse JSON requests
app.use(express.json());

// import dotenv to manage environment variables
require('dotenv').config();

// import the cors package
const cors = require('cors');

// Use CORS middleware
app.use(cors());

// import auth routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// use auth routes with prefix /api/v1/auth
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/bookings', bookingRoutes);




// connect to MongoDB
mongoose.connect(process.env.MONGO_URI,).then(()=>{
    console.log('MongoDB connected successfully');
}).catch((err)=>{
    console.error('Error connecting to MongoDB', err.message);
});

// define the port
const PORT = process.env.PORT || 5000;

// start the server
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});


