const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const upload = require('../middleware/uploadMiddleware'); // Import the file upload middleware

// GET /api/songs - Fetch details of all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find(); // Find all songs
        res.status(200).json(songs); // Send back the song details
    } catch (err) {
        console.error('Error fetching songs:', err);
        res.status(500).json({ message: 'Failed to fetch songs.', error: err.message });
    }
});

// POST /api/songs - Fetch details of songs by their IDs
router.post('/', async (req, res) => {
    const { ids } = req.body;  // Expecting an array of song IDs in the request body
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No song IDs provided or invalid array.' });
    }

    try {
        // Fetch songs by their IDs
        const songs = await Song.find({ '_id': { $in: ids } });

        if (!songs || songs.length === 0) {
            return res.status(404).json({ message: 'No songs found for the given IDs.' });
        }

        res.status(200).json({ songs });  // Return the found songs
    } catch (err) {
        console.error('Error fetching songs:', err);
        res.status(500).json({ message: 'Failed to fetch songs.', error: err.message });
    }
});

// POST /api/songs/upload - Add a new song with file upload
router.post('/upload', upload.single('file'), async (req, res) => {
    const { title, artist, mood } = req.body;

    // Validation check
    if (!title || !artist || !mood || !req.file) {
        return res.status(400).json({ message: 'All fields (title, artist, mood) and a file are required.' });
    }

    try {
        // Check if the song already exists in the database
        const existingSong = await Song.findOne({ title, artist });

        if (existingSong) {
            return res.status(409).json({
                message: 'This song already exists in the database!',
                song: {
                    title: existingSong.title,
                    artist: existingSong.artist,
                    mood: existingSong.mood,
                    file: existingSong.file // Send the existing file path
                }
            });
        }

        // Save the song details, including the uploaded file path
        const newSong = new Song({
            title,
            artist,
            mood,
            file: req.file.path // Save the relative path to the file
        });

        const savedSong = await newSong.save();
        res.status(201).json({
            message: 'Song uploaded and saved successfully!',
            song: savedSong
        });
    } catch (err) {
        console.error('Error saving song:', err);
        res.status(500).json({ message: 'Failed to save song due to server error.', error: err.message });
    }
});

module.exports = router;
