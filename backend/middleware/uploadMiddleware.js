const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/songs')); // Save files to 'uploads/songs'
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`); // Ensure unique filenames
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['audio/mpeg', 'audio/mp3'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = new Error('Invalid file type. Only MP3 files are allowed.');
            error.status = 400; // Set a custom error status code
            cb(error);
        }
    }
});

// Handle file upload errors globally
upload.errors = (err, req, res, next) => {
    if (err) {
        if (err.status === 400) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Server error during file upload' });
    }
    next();
};

module.exports = upload;
