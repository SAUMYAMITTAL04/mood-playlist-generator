async function fetchProfileData() {
    try {
        const response = await fetch('http://localhost:5000/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        const { user, playlists = [], uploadedSongs = [] } = data; // Default to empty arrays

        // Update profile info
        document.getElementById('username').textContent = user.username;
        document.getElementById('email').textContent = user.email;

        // Update playlists
        const playlistContainer = document.getElementById('playlistContainer');
        playlists.forEach(playlist => {
            const playlistDiv = document.createElement('div');
            playlistDiv.classList.add('playlist');
            playlistDiv.innerHTML = `
                <h3>${playlist.name}</h3>
                <a href="playlist.html?id=${playlist._id}">View Playlist</a>
            `;
            playlistContainer.appendChild(playlistDiv);
        });

        // Update uploaded songs
        const uploadedSongsList = document.getElementById('uploadedSongsList');
        uploadedSongs.forEach(song => {
            const songLi = document.createElement('li');
            songLi.textContent = song.name;
            uploadedSongsList.appendChild(songLi);
        });
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
}



// Call the fetchProfileData function when the page loads
window.onload = fetchProfileData;

// Listen for mood button clicks and generate a playlist
document.querySelectorAll('.mood-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const mood = event.currentTarget.getAttribute('data-mood');
        generatePlaylist(mood); // Call function to generate playlist based on mood
    });
});

// Function to generate a playlist based on mood
async function generatePlaylist(mood) {
    try {
        const token = localStorage.getItem('token');  // Retrieve the token from localStorage
        if (!token) {
            throw new Error('User is not logged in');
        }

        const response = await fetch('http://localhost:5000/api/playlist/mood', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,  // Send the token in the Authorization header
                'Content-Type': 'application/json',  // Assuming you send JSON data
            },
            body: JSON.stringify({ mood })  // Send the mood as the request body
        });

        if (!response.ok) {
            throw new Error('Error generating playlist');
        }

        const data = await response.json();
        console.log('Playlist generated:', data.playlist);

        // Store the generated playlist in localStorage
        localStorage.setItem('generatedPlaylist', JSON.stringify(data.playlist));

    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred while generating the playlist.');
    }
}

window.onload = function() {
    // Retrieve the playlist from localStorage
    const playlist = JSON.parse(localStorage.getItem('generatedPlaylist'));

    if (!playlist || playlist.length === 0) {
        // Handle case where no playlist exists
        document.getElementById('playlistContainer').innerHTML = 'No playlist found.';
        return;
    }

    // Get the container element where you want to display the playlist
    const playlistContainer = document.getElementById('playlistContainer');

    // Build the HTML content for the playlist
    let playlistHtml = '';
    playlist.forEach(song => {
        playlistHtml += `<li>${song.title} by ${song.artist}</li>`;  // Adjust according to your song attributes
    });

    // Insert the HTML content into the playlist container
    playlistContainer.innerHTML = playlistHtml;
};

