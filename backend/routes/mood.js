const express = require('express');
const router = express.Router();
const { generateMoodPlaylist } = require('../controllers/moodController');  // Import the controller function

// POST request for generating mood-based playlist
router.post('/', generateMoodPlaylist);  // Define the POST route for '/api/mood'

module.exports = router;
