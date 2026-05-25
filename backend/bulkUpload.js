const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Path to your organized mood folders
const baseFolder = path.join(__dirname, 'uploads', 'songs');

// API endpoint for uploading songs
const uploadEndpoint = 'http://localhost:5000/api/songs/upload';

// Function to upload a single song
async function uploadSong(filePath, mood) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('title', path.basename(filePath, path.extname(filePath))); // Use file name as title
    formData.append('artist', 'Unknown Artist'); // Replace with actual artist if available
    formData.append('mood', mood);

    try {
        const response = await axios.post(uploadEndpoint, formData, {
            headers: formData.getHeaders(),
        });
        console.log(`Uploaded: ${filePath} -> ${response.data.message}`);
    } catch (error) {
        console.error(`Failed to upload ${filePath}:`, error.response?.data || error.message);
    }
}

// Function to process all files in mood folders
async function processFolders() {
    const moods = fs.readdirSync(baseFolder); // Read all mood folders

    for (const mood of moods) {
        const moodPath = path.join(baseFolder, mood);
        if (fs.statSync(moodPath).isDirectory()) {
            const files = fs.readdirSync(moodPath); // Read all files in the mood folder

            for (const file of files) {
                const filePath = path.join(moodPath, file);
                if (fs.statSync(filePath).isFile()) {
                    await uploadSong(filePath, mood); // Upload each file
                }
            }
        }
    }
}

processFolders()
    .then(() => console.log('Bulk upload complete!'))
    .catch((err) => console.error('Error during bulk upload:', err));
