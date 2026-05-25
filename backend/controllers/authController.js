const User = require('../models/user'); // Assuming you have a User model
const jwt = require('jsonwebtoken');

// Login function
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Directly compare the plain text passwords
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        
        const token = jwt.sign(
            { userId: user._id, username: user.username,email: user.email },
            process.env.JWT_SECRET,  // Ensure the JWT secret key is loaded correctly
            { expiresIn: '1h' }  // Token expires in 1 hour
        );

        // Respond with the token
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Signup function
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create the user with plain text password
        const newUser = new User({
            username,
            email,
            password, // Save the password as plain text
        });

        // Save the user to the database
        await newUser.save();

        // Send a response back to the frontend
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
