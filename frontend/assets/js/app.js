// Function to handle user login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'profile.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});

// Function to handle user signup
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Signup successful! You can now log in.');
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});
// Function to logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Initialize event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;

    // If on the profile page, the profile data will be loaded automatically from profile.js
    if (pathname.includes('profile.html')) {
        // loadProfile() is called in profile.js, no need for it here
    }

    // Attach logout functionality
    document.getElementById('logoutButton')?.addEventListener('click', logout);

    // Attach mood button event listeners for pages like the homepage
    const moodButtons = document.querySelectorAll('.mood-button');
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            generatePlaylist(mood); // This uses the function from profile.js to generate the playlist
        });
    });
});
