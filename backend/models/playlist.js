const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    songs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Song', 
        required: true 
    }],
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null // Allow null for anonymous playlists
    },
    mood: { 
        type: String, 
        required: true, 
        enum: ['party', 'hopeful', 'nostalgic', 'proud', 'loving', 'passionate', 'random'], // Example predefined moods
    }
});

// Optionally, add indexes for performance
playlistSchema.index({ user: 1 });
playlistSchema.index({ mood: 1 });

module.exports = mongoose.model('Playlist', playlistSchema);
