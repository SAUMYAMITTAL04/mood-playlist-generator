const Song = require('../models/song');  // Import the Song model
const Playlist = require('../models/playlist');  // Import the Playlist model

// Controller function to generate a playlist based on mood
exports.generateMoodPlaylist = async (req, res) => {
    const { mood } = req.body;  // Get the mood from the request body

    if (!mood) {
        return res.status(400).json({ message: 'Mood is required' });
    }

    try {
        // Log the req.user to verify the user is decoded correctly
        console.log('Authenticated User:', req.user);  // Debug log

        // Find songs with the selected mood
        const songs = await Song.find({ mood: { $regex: new RegExp(mood, 'i') } });

        if (songs.length === 0) {
            return res.status(404).json({ message: 'No songs found for this mood' });
        }

        // Randomly select 5 songs for the playlist
        const randomSongs = songs.sort(() => 0.5 - Math.random()).slice(0, 5);

        // Optionally create a playlist with these songs
        const userId = req.user?.userId ? req.user.userId : null;  // Use user ID if available, otherwise set to null
        const newPlaylist = new Playlist({
            name: `${mood} Playlist`,
            songs: randomSongs.map(song => song._id),  // Use the song IDs for the playlist
            user: userId,  // Include user ID or set to null
            mood,  // Include the mood for reference
        });

        await newPlaylist.save();  // Save the playlist to the database

        res.status(200).json({ message: 'Playlist generated successfully', playlist: newPlaylist });
    } catch (error) {
        console.error('Error generating playlist:', error.message);
        res.status(500).json({ message: 'Error generating playlist', error: error.message });
    }
};
