const Playlist = require('../models/playlist');
const Song = require('../models/song');  // Import Song model to access song data

// Controller function to generate a playlist based on mood
exports.generateMoodPlaylist = async (req, res) => {
    const { mood } = req.params;

    try {
        // Fetch songs that match the given mood
        const songs = await Song.find({ mood: mood });

        if (songs.length === 0) {
            return res.status(404).json({ message: 'No songs found for this mood' });
        }

        // Create a playlist based on the fetched songs
        const playlist = new Playlist({
            name: `${mood} Playlist`,
            songs: songs.map(song => song._id),  // Assuming song object contains an '_id' field
            user: req.user.userId  // Associate the playlist with the logged-in user
        });

        await playlist.save();

        res.status(200).json({
            message: `${mood} Playlist generated successfully`,
            playlist
        });

    } catch (error) {
        console.error('Error generating playlist:', error.message);
        res.status(500).json({ message: 'Error generating playlist', error: error.message });
    }
};
