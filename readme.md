
# 🎵 Mood Playlist Generator (Full-Stack Audio Curation Engine)

A distributed, full-stack web application engineered to curate, stream, and manage audio content dynamically based on user psychological states (moods). 

In a standard media environment, playlist curation relies on heavy manual intervention or complex, black-box recommendation algorithms. This project introduces a streamlined, **Emotion-Driven Architecture**. It provides a secure user ecosystem where authenticated clients can dynamically query a cloud database for specific audio payloads categorized by mood, interact with a custom-built media scrubber, and securely upload new `.mp3` assets directly to the application server.

### 🔗 Live Deployments
* **Live Application Client (Frontend):** [mood-playlist-generator-six.vercel.app](https://mood-playlist-generator-six.vercel.app/index.html)
* **REST API Endpoint (Backend):** Hosted via Render Cloud Services

---

## 🚀 Business Impact & Value Proposition
* **Emotion-Driven User Retention:** Replaces static media browsing with an interactive, intent-based UI where users instantly receive content matched to their current state (Happy, Sad, Party, Hopeful, etc.).
* **Custom Media Streaming Pipeline:** Bypasses reliance on third-party iframe embeds (like Spotify/YouTube) by engineering a native HTML5/JavaScript audio streaming engine complete with state-managed play/pause toggles and precise duration scrubbing.
* **Full-Stack Separation of Concerns:** Demonstrates a highly scalable decoupled architecture, separating the client-side interface (Vercel) from the secure backend logic and file management system (Render).

---

## 📊 Application UI & Performance

*(Note: Replace the placeholder links below with your actual screenshot links from GitHub issues or your `docs/images` folder)*

<img width="1920" height="1080" alt="Screenshot (505)" src="https://github.com/user-attachments/assets/949bd21b-76d1-4b96-9a12-e1044a3c7ef7" />
<img width="1920" height="1080" alt="Screenshot (506)" src="https://github.com/user-attachments/assets/b7ada207-3974-407c-888a-856e33b2867b" />
<img width="1920" height="1080" alt="Screenshot (507)" src="https://github.com/user-attachments/assets/8a41c16a-5a3f-4355-a874-0f2f3e5ef94a" />




---

## 🏗️ System Architecture

1. **The Client Layer (Vanilla JS & HTML5):** A lightweight, highly responsive frontend that handles asynchronous state management, JWT authentication storage, and native media playback controls.
2. **The API & Routing Engine (Express.js):** A high-performance REST API hosted on Render that intercepts client payloads, manages CORS security policies, and orchestrates user authentication logic via bcrypt.
3. **The Persistent Vault (MongoDB Atlas):** A cloud-native NoSQL database utilizing Mongoose ORM to persistently store user credentials, hashed passwords, and structured media metadata.


---

## 🛠️ Tech Stack

* **Backend Framework:** Node.js, Express.js
* **Authentication & Security:** JSON Web Tokens (JWT), bcrypt, CORS
* **Database & ORM:** MongoDB Atlas, Mongoose
* **Frontend Visualization:** HTML5, CSS3, Vanilla DOM JavaScript
* **Media Handling:** Multer, HTML5 Audio API
* **Deployment Environments:** Vercel (Client UI), Render (API Hosting & Ephemeral Storage)

---

## 🗄️ Core Database Schema (`songs` collection)

The MongoDB Atlas cluster maintains a structured NoSQL schema to track every media asset passing through the system:

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key. Unique automated document tracking index. |
| `title` | String | The official title of the uploaded audio track. |
| `artist` | String | The designated creator or artist of the track. |
| `mood` | String | The emotional classification tag (e.g., "Party", "Nostalgic") used for dynamic querying. |
| `audioUrl` | String | The relative or absolute file path directing the client player to the raw `.mp3` asset. |
| `uploadedBy` | ObjectId | A relational reference linking the track to a specific authenticated user. |

---

## 💻 Local Installation & Monolithic Configuration



**1. Clone the Architecture**
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/mood-playlist-generator.git](https://github.com/YOUR_GITHUB_USERNAME/mood-playlist-generator.git)
cd mood-playlist-generator
```
**2. Initialize the Backend Node Environment**
```bash
Bash
cd backend
npm install
```
**3. Populate Secret Environment Variables**

Create a .env file in your backend directory and configure your cloud keys:

Code snippet
PORT=5000
MONGODB_URI=mongodb+srv://user:password@your-cluster-url.mongodb.net/database_name
SECRET=your_highly_secure_jwt_secret_key
**4. Spin Up the Backend API Microservice**
```bash
Bash
node app.js
```
**5. Execute the Frontend Client**

Ensure the API fetch URLs in your frontend/assets/js files are temporarily pointed to http://localhost:5000 for local development.

Open frontend/index.html in your browser (or utilize the VS Code Live Server extension) to interact with the application locally.



Developed as a decoupled, full-stack proof-of-concept for modernizing interactive media streaming infrastructures.
