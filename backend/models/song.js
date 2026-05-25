const mongoose = require('mongoose');

// Define a schema for the Song model
const songSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    artist: { 
        type: String, 
        required: true 
    },
    mood: { 
        type: String, 
        required: true, 
        enum: ['party', 'hopeful', 'nostalgic', 'proud', 'loving', 'passionate','random']  // Define mood options
    },
    file: { 
        type: String, 
        required: true 
    }
});

// Optional: Add an index on the mood field to optimize queries by mood
songSchema.index({ mood: 1 });

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
