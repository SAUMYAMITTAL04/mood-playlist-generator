const express = require('express');
const Playlist = require('../models/playlist');
const Song = require('../models/song');  // Import the Song model
const verifyToken = require('../middleware/authMiddleware'); // Protect the routes
const moodController = require('../controllers/moodController');  // Import mood controller
const router = express.Router();

// Create a new playlist
router.post('/', verifyToken, async (req, res) => {
    const { name, songs } = req.body;
    try {
        const newPlaylist = new Playlist({
            name,
            songs,
            user: req.user.userId, // Associate the playlist with the logged-in user
        });

        await newPlaylist.save();
        res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist });
    } catch (error) {
        console.error('Error creating playlist:', error.message);
        res.status(500).json({ message: 'Error creating playlist', error: error.message });
    }
});

// Generate playlist based on mood (New route using controller)
// Generate playlist based on mood
router.post('/mood', verifyToken, moodController.generateMoodPlaylist);


// Get all playlists for the logged-in user
router.get('/', verifyToken, async (req, res) => {
    try {
        const playlists = await Playlist.find({ user: req.user.userId });
        res.status(200).json({ playlists });
    } catch (error) {
        console.error('Error fetching playlists:', error.message);
        res.status(500).json({ message: 'Error fetching playlists', error: error.message });
    }
});

// Get a specific playlist by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user.userId });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ playlist });
    } catch (error) {
        console.error('Error fetching playlist:', error.message);
        res.status(500).json({ message: 'Error fetching playlist', error: error.message });
    }
});

// Update a playlist
router.put('/:id', verifyToken, async (req, res) => {
    const { name, songs } = req.body;
    try {
        const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user.userId });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        playlist.name = name || playlist.name;
        playlist.songs = songs || playlist.songs;

        await playlist.save();
        res.status(200).json({ message: 'Playlist updated', playlist });
    } catch (error) {
        console.error('Error updating playlist:', error.message);
        res.status(500).json({ message: 'Error updating playlist', error: error.message });
    }
});

// Delete a playlist
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.status(200).json({ message: 'Playlist deleted', playlist });
    } catch (error) {
        console.error('Error deleting playlist:', error.message);
        res.status(500).json({ message: 'Error deleting playlist', error: error.message });
    }
});

module.exports = router;
