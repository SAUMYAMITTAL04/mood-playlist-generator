require('dotenv').config();  // Ensure environment variables are loaded
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const playlistRoutes = require('./routes/playlist');
const songRoutes = require('./routes/songRoutes');  // Import the song routes

// Import middleware
const verifyToken = require('./middleware/authMiddleware');

const app = express();

// CORS Configuration - Temporarily allow all origins for debugging
const corsOptions = {
    origin: '*',  // Allow all origins (for debugging purposes, you can narrow this down later)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); // Apply CORS globally

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests

// MongoDB URI from .env file
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Mongo URI is missing or undefined!');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

// Routes with Debug Logging
app.use('/api/auth', (req, res, next) => {
    console.log('Request to /api/auth:', req.method, req.url); // Debug log
    next(); // Proceed with normal route handling
}, authRoutes);

app.use('/api/mood', (req, res, next) => {
    console.log('Request to /api/mood:', req.method, req.url); // Debug log
    next(); // Proceed with normal route handling
}, moodRoutes);

app.use('/api/playlist', (req, res, next) => {
    console.log('Request to /api/playlist:', req.method, req.url); // Debug log
    next(); // Proceed with normal route handling
}, playlistRoutes);

// Add this line to register the song routes
app.use('/api/songs', songRoutes);

// Example protected route (for testing user profile access)
app.get('/api/profile', verifyToken, (req, res) => {
    console.log('Decoded user:', req.user);  // Check the decoded user from the token
    res.json({ message: 'User profile', user: req.user });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Catch-all route to serve index.html for any unknown requests (frontend routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Test route (you can expand this later)
app.get('/', (req, res) => {
    res.send('Hello from the Mood Playlist Generator backend!');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
