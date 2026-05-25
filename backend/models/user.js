const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // Ensure username is unique
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Keep email unique if still used for communication purposes
  },
  password: { 
    type: String, 
    required: true 
  },
  playlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Playlist' 
  }],
  history: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Song' 
  }]
}, { timestamps: true });

// Optional: Adding indexes for quick lookup
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
