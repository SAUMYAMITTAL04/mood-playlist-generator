let currentAudio = null;  // Store the currently playing audio
let currentButton = null; // Store the currently active play/pause button

// Fetch profile data when the page loads
window.onload = async function () {
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

        // Display playlists section
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

        // Display uploaded songs section
        const uploadedSongsList = document.getElementById('uploadedSongsList');
        uploadedSongs.forEach(song => {
            const songLi = document.createElement('li');
            songLi.textContent = song.name;
            uploadedSongsList.appendChild(songLi);
        });

        // Display most recent generated playlist
        const generatedPlaylist = JSON.parse(localStorage.getItem('generatedPlaylist'));
        if (generatedPlaylist && generatedPlaylist.songs && generatedPlaylist.songs.length > 0) {
            displayGeneratedPlaylist(generatedPlaylist);
        } else {
            playlistContainer.innerHTML += 'No generated playlist available.';
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Function to display the generated playlist
async function displayGeneratedPlaylist(playlist) {
    const playlistContainer = document.getElementById('playlistContainer');
    const playlistSongsContainer = document.getElementById('playlistSongsContainer');

    playlistContainer.innerHTML = `<h3>Generated Playlist - ${playlist.name}</h3>`;

    // Fetch song details from the backend based on song IDs
    const songDetails = await fetchSongDetails(playlist.songs);

    if (songDetails.length > 0) {
        let playlistHtml = '<ul>';
        songDetails.forEach(song => {
            playlistHtml += `
                <li>
                    <span>${song.title} by ${song.artist}</span>
                    <button class="play-song" data-song-url="${song.audioUrl}">Play</button>
                </li>
            `;
        });
        playlistHtml += '</ul>';
        playlistSongsContainer.innerHTML = playlistHtml;

        // Add play functionality to the play button
        document.querySelectorAll('.play-song').forEach(button => {
            button.addEventListener('click', (event) => {
                const songUrl = event.currentTarget.getAttribute('data-song-url');
                playSong(songUrl, event.currentTarget);  // Pass the button to playSong
            });
        });
    } else {
        playlistSongsContainer.innerHTML = 'No songs available in this playlist.';
    }
}

// Function to fetch song details based on song IDs
async function fetchSongDetails(songIds) {
    try {
        const response = await fetch('http://localhost:5000/api/songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: songIds })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch song details');
        }

        const data = await response.json();
        console.log('Backend response:', data); // Log backend response for debugging

        // Add the base URL for the song files
        const baseAudioUrl = 'http://localhost:5000/uploads/songs/';
        const songsWithUrls = data.songs.map(song => {
            // Extract the file name from the full file path
            const fileName = song.file.split('\\').pop(); // Get the last part of the file path
            return {
                ...song,
                audioUrl: baseAudioUrl + fileName // Append the file name to the base URL
            };
        });

        return songsWithUrls;
    } catch (error) {
        console.error('Error fetching song details:', error);
        return [];
    }
}

// Play or pause the song based on the button clicked
/*function playSong(songUrl, button) {
    const audio = new Audio(songUrl); // Create a new audio instance for the clicked song

    // If a song is already playing and the current song is not the same as the one clicked
    if (currentAudio && currentAudio.src !== songUrl) {
        // Stop the current song
        currentAudio.pause();
        currentButton.textContent = 'Play'; // Reset the button to 'Play'
    }

    // If the song is not already playing, create a new audio instance
    if (!currentAudio || currentAudio.src !== songUrl) {
        // Create a new audio instance for the clicked song
        currentAudio = audio;

        // Play the new song
        currentAudio.play().catch(error => console.error("Error playing audio:", error));

        // Change the button text to "Pause"
        button.textContent = 'Pause';

        // Store the current button reference for later use
        currentButton = button;

        // Listen for when the song ends, so we can reset the button
        currentAudio.onended = () => {
            currentButton.textContent = 'Play'; // Reset the button to 'Play' when the song ends
            currentAudio = null; // Reset the current audio to null
        };
    } else {
        // If the song is already playing, pause it
        if (!currentAudio.paused) {
            currentAudio.pause();
            button.textContent = 'Play'; // Change the button text to 'Play'
        } else {
            // If the song is paused, resume it
            currentAudio.play().catch(error => console.error("Error playing audio:", error));
            button.textContent = 'Pause'; // Change the button text to 'Pause'
        }
    }

    // Reset other buttons' text to 'Play'
    document.querySelectorAll('.play-song').forEach(otherButton => {
        if (otherButton !== button) {
            otherButton.textContent = 'Play'; // Reset other buttons to 'Play'
        }
    });
}*/
function playSong(songUrl, button) {
    const audio = new Audio(songUrl); // Create a new audio instance for the clicked song

    // If a song is already playing and the current song is not the same as the one clicked
    if (currentAudio && currentAudio.src !== songUrl) {
        // Stop the current song
        currentAudio.pause();
        currentButton.textContent = 'Play'; // Reset the button to 'Play'
        currentButton.setAttribute('data-state', 'play'); // Reset the button state
    }

    // If the song is not already playing, create a new audio instance
    if (!currentAudio || currentAudio.src !== songUrl) {
        currentAudio = audio;

        // Play the new song
        currentAudio.play().catch(error => console.error("Error playing audio:", error));

        // Change the button text to "Pause"
        button.textContent = 'Pause';
        button.setAttribute('data-state', 'pause'); // Set the button state to 'pause'

        // Store the current button reference for later use
        currentButton = button;

        // Listen for when the song ends, so we can reset the button
        currentAudio.onended = () => {
            currentButton.textContent = 'Play'; // Reset the button to 'Play' when the song ends
            currentButton.setAttribute('data-state', 'play'); // Reset button state to 'play'
            currentAudio = null; // Reset the current audio to null
        };
    } else {
        // If the song is already playing, pause it
        if (!currentAudio.paused) {
            currentAudio.pause();
            button.textContent = 'Play'; // Change the button text to 'Play'
            button.setAttribute('data-state', 'play'); // Reset the button state to 'play'
        } else {
            // If the song is paused, resume it
            currentAudio.play().catch(error => console.error("Error playing audio:", error));
            button.textContent = 'Pause'; // Change the button text to 'Pause'
            button.setAttribute('data-state', 'pause'); // Set the button state to 'pause'
        }
    }

    // Reset other buttons' text to 'Play'
    document.querySelectorAll('.play-song').forEach(otherButton => {
        if (otherButton !== button) {
            otherButton.textContent = 'Play'; // Reset other buttons to 'Play'
            otherButton.setAttribute('data-state', 'play'); // Reset other buttons' state to 'play'
        }
    });
}
// Function to generate a playlist based on mood
async function generatePlaylist(mood) {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        if (!token) {
            throw new Error('User is not logged in');
        }

        const response = await fetch('http://localhost:5000/api/playlist/mood', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token, // Send the token in the Authorization header
                'Content-Type': 'application/json', // Assuming you send JSON data
            },
            body: JSON.stringify({ mood }) // Send the mood as the request body
        });

        if (!response.ok) {
            throw new Error('Error generating playlist');
        }

        const data = await response.json();
        console.log('Playlist generated:', data.playlist);

        // Store the generated playlist in localStorage
        localStorage.setItem('generatedPlaylist', JSON.stringify(data.playlist));

        // Redirect to playlist page
        window.location.href = 'playlist.html'; // Directly redirect to playlist.html

    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred while generating the playlist.');
    }
}

// Listen for mood button clicks and generate a playlist
document.querySelectorAll('.mood-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
        const mood = event.currentTarget.getAttribute('data-mood');
        await generatePlaylist(mood); // Call function to generate playlist based on mood
    });
});
