const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
    // Extract the token from the Authorization header (Bearer token format)
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];  // Split 'Bearer <token>'

    // If no token is provided in the request
    if (!token) {
        return res.status(401).json({ message: 'Authorization denied: No token provided' });
    }

    try {
        // Verify the token using the secret key stored in environment variable
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Optionally log the decoded token for debugging (can be removed later)
        console.log('Decoded token:', decoded);

        // Attach user information from the decoded token to the request object
        req.user = decoded;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        // Log the error for debugging purposes
        console.error('JWT Error:', error.message);

        // If the token is invalid or expired, send a response with 401 status
        res.status(401).json({ message: 'Authorization denied: Invalid or expired token' });
    }
};

module.exports = verifyToken;
