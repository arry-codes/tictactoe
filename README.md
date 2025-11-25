# Real-Time Multiplayer Tic Tac Toe
A modern, real-time multiplayer Tic Tac Toe game built with **React**, **Vite**, and **Firebase Realtime Database**.

## 🚀 Features
- **Real-Time Multiplayer**: Play with friends instantly using Firebase Realtime Database.
- **Lobby System**: Create a unique 6-character Room ID to invite friends.
- **Live Game State**: Board updates, turn management, and win/draw detection happen in real-time.
- **Player Disconnect Handling**: Automatically detects if an opponent leaves or closes the tab.
- **Responsive Design**: Fully optimized for both desktop and mobile devices.
- **Dark Mode UI**: Sleek, modern interface with CSS variables.

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite)
- **Styling**: Vanilla CSS (Modern features: Flexbox, Grid, CSS Variables)
- **Backend / Database**: Firebase Realtime Database (Serverless)
- **Deployment**: Vercel

## 📂 Project Structure
```
src/
├── components/
│   ├── Game.jsx       # Main game board, logic, and real-time sync
│   └── Lobby.jsx      # Room creation and joining interface
├── firebase.js        # Firebase configuration and exports
├── App.jsx            # Main application state manager
├── index.css          # Global styles and theme definitions
└── main.jsx           # Entry point
```
