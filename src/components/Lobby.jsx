import React, { useState, useEffect } from 'react';
import { database, ref, set, push, get, child, onValue } from '../firebase';

const Lobby = ({ onJoinGame }) => {
    const [roomId, setRoomId] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const createGame = async () => {
        if (!playerName) {
            setError('Please enter your name');
            return;
        }
        setIsCreating(true);

        const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const newGameRef = ref(database, 'games/' + newGameId);

        const initialGameState = {
            board: Array(9).fill(""),
            xIsNext: true,
            players: {
                X: { name: playerName, id: 'host' },
                O: null
            },
            winner: null,
            draw: false
        };

        try {
            await set(newGameRef, initialGameState);
            onJoinGame(newGameId, 'X', playerName);
        } catch (err) {
            console.error("Error creating game:", err);
            setError(`Error: ${err.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    const joinGame = async () => {
        if (!roomId || !playerName) {
            setError('Please enter Room ID and Name');
            return;
        }

        const dbRef = ref(database);
        try {
            const snapshot = await get(child(dbRef, `games/${roomId}`));
            if (snapshot.exists()) {
                const gameData = snapshot.val();
                if (gameData.players.O) {
                    setError('Game is full!');
                    return;
                }

                // Join as O
                await set(ref(database, `games/${roomId}/players/O`), { name: playerName, id: 'guest' });
                onJoinGame(roomId, 'O', playerName);
            } else {
                setError('Room not found');
            }
        } catch (err) {
            console.error("Error joining game:", err);
            setError('Could not join game.');
        }
    };

    // Connection check
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        const connectedRef = ref(database, ".info/connected");
        const unsubscribe = onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
                setConnected(true);
            } else {
                setConnected(false);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="lobby-container">
            <h1 className="title">Tic Tac Toe</h1>
            <div style={{ marginBottom: '20px', color: connected ? '#03dac6' : '#cf6679' }}>
                Status: {connected ? 'Connected to Server' : 'Disconnected (Check Console)'}
            </div>
            <div className="card">
                <div className="input-group">
                    <label>Your Name</label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>

                <div className="actions">
                    <button className="btn primary" onClick={createGame} disabled={isCreating}>
                        {isCreating ? 'Creating...' : 'Create New Game'}
                    </button>

                    <div className="divider">OR</div>

                    <div className="join-section">
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter Room ID"
                        />
                        <button className="btn secondary" onClick={joinGame}>Join Game</button>
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default Lobby;
